export class BackendError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly status: number,
    public readonly details?: Record<string, string>,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

export function requiredString(
  value: unknown,
  field: string,
  options: { min?: number; max?: number } = {},
) {
  const text = typeof value === "string" ? value.trim() : "";
  const min = options.min ?? 1;
  const max = options.max ?? 500;
  if (text.length < min || text.length > max) {
    throw new BackendError(
      "VALIDATION_ERROR",
      `Enter a valid ${field}.`,
      400,
      { [field]: `Must be between ${min} and ${max} characters.` },
    );
  }
  return text;
}

export function validEmail(value: unknown) {
  const email = requiredString(value, "email", { min: 5, max: 254 }).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new BackendError("VALIDATION_ERROR", "Enter a valid email address.", 400, {
      email: "Email format is invalid.",
    });
  }
  return email;
}

export async function readJson(request: Request): Promise<Record<string, unknown>> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    throw new BackendError("UNSUPPORTED_MEDIA_TYPE", "Send a JSON request body.", 415);
  }
  try {
    const value = await request.json();
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value as Record<string, unknown>;
  } catch {
    throw new BackendError("INVALID_JSON", "The request body is not valid JSON.", 400);
  }
}
