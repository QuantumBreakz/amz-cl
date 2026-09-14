import { randomUUID } from "node:crypto";
import { BackendError, type RequestActor } from "@amazon-clone/backend";
import { NextRequest, NextResponse } from "next/server";
import { backend } from "./backend";

export const GUEST_COOKIE = "amazon_demo_guest";
export const SESSION_COOKIE = "amazon_demo_session";

export type ApiContext = {
  actor: RequestActor;
  guestId: string;
  sessionToken?: string;
  setSessionToken?: string;
  clearSession?: boolean;
};

type ApiResult = { data: unknown; status?: number };

function requestContext(request: NextRequest): ApiContext {
  const candidateGuestId = request.cookies.get(GUEST_COOKIE)?.value;
  const guestId =
    candidateGuestId && /^[a-zA-Z0-9-]{16,128}$/.test(candidateGuestId)
      ? candidateGuestId
      : randomUUID();
  const sessionToken = request.cookies.get(SESSION_COOKIE)?.value;
  return {
    actor: backend.service.resolveActor(guestId, sessionToken),
    guestId,
    sessionToken,
  };
}

function isSameOrigin(request: NextRequest, origin: string) {
  try {
    const source = new URL(origin);
    const host =
      request.headers.get("host") ??
      request.headers.get("x-forwarded-host") ??
      request.nextUrl.host;
    const protocol =
      request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.slice(0, -1);
    return Boolean(host) && source.host === host && source.protocol === `${protocol}:`;
  } catch {
    return false;
  }
}

function applyCookies(response: NextResponse, context: ApiContext) {
  const secure = process.env.NODE_ENV === "production";
  response.cookies.set({
    name: GUEST_COOKIE,
    value: context.guestId,
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  if (context.clearSession) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: "",
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 0,
    });
  } else if (context.setSessionToken) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: context.setSessionToken,
      httpOnly: true,
      sameSite: "lax",
      secure,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
  }
}

export async function api(
  request: NextRequest,
  handler: (context: ApiContext) => ApiResult | Promise<ApiResult>,
) {
  const context = requestContext(request);
  try {
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
      const origin = request.headers.get("origin");
      if (origin && !isSameOrigin(request, origin)) {
        throw new BackendError("INVALID_ORIGIN", "Cross-origin mutation rejected.", 403);
      }
    }
    const result = await handler(context);
    const response = NextResponse.json({ data: result.data }, { status: result.status ?? 200 });
    response.headers.set("Cache-Control", "no-store");
    applyCookies(response, context);
    return response;
  } catch (reason) {
    const error =
      reason instanceof BackendError
        ? reason
        : new BackendError("INTERNAL_ERROR", "The server could not complete the request.", 500);
    const response = NextResponse.json(
      { error: { code: error.code, message: error.message, details: error.details } },
      { status: error.status },
    );
    response.headers.set("Cache-Control", "no-store");
    applyCookies(response, context);
    return response;
  }
}

export function integerParam(value: string | null, fallback: number) {
  if (value === null || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new BackendError("VALIDATION_ERROR", "Invalid pagination value.", 400);
  }
  return parsed;
}
