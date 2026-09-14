import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { dirname } from "node:path";
import type { DatabaseDocument } from "./types";

const emptyDocument = (): DatabaseDocument => ({
  version: 1,
  users: [],
  sessions: [],
  actors: {},
});

const text = (value: unknown, max = 500) =>
  typeof value === "string" && value.length <= max;
const isoDate = (value: unknown) =>
  text(value, 40) && Number.isFinite(Date.parse(value as string));
const positiveInteger = (value: unknown) =>
  typeof value === "number" && Number.isInteger(value) && value > 0;
const money = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) && value >= 0;

function validLine(value: unknown, order = false) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const line = value as Record<string, unknown>;
  return (
    text(line.id, 100) &&
    positiveInteger(line.quantity) &&
    (line.color === undefined || text(line.color, 40)) &&
    (!order || money(line.unitPrice))
  );
}

function validOrder(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const order = value as Record<string, unknown>;
  return (
    text(order.id, 100) &&
    isoDate(order.date) &&
    Array.isArray(order.lines) &&
    order.lines.every((line) => validLine(line, true)) &&
    money(order.total) &&
    text(order.name, 80) &&
    text(order.address, 500)
  );
}

function validActor(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const actor = value as Record<string, unknown>;
  return (
    Array.isArray(actor.cart) &&
    actor.cart.every((line) => validLine(line)) &&
    Array.isArray(actor.saved) &&
    actor.saved.every((id) => text(id, 100)) &&
    Array.isArray(actor.orders) &&
    actor.orders.every(validOrder) &&
    text(actor.name, 80) &&
    text(actor.location, 80) &&
    (actor.language === undefined || text(actor.language, 40)) &&
    actor.orderKeys !== null &&
    typeof actor.orderKeys === "object" &&
    !Array.isArray(actor.orderKeys) &&
    Object.entries(actor.orderKeys as Record<string, unknown>).every(
      ([key, id]) => text(key, 128) && text(id, 100),
    )
  );
}

function validDocument(value: unknown): value is DatabaseDocument {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const document = value as Record<string, unknown>;
  return (
    document.version === 1 &&
    Array.isArray(document.users) &&
    document.users.every((candidate) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
      const user = candidate as Record<string, unknown>;
      return (
        text(user.id, 100) &&
        text(user.email, 254) &&
        text(user.name, 80) &&
        isoDate(user.createdAt) &&
        typeof user.passwordHash === "string" &&
        /^[a-f0-9]{128}$/.test(user.passwordHash) &&
        typeof user.passwordSalt === "string" &&
        /^[a-f0-9]{32}$/.test(user.passwordSalt)
      );
    }) &&
    Array.isArray(document.sessions) &&
    document.sessions.every((candidate) => {
      if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) return false;
      const session = candidate as Record<string, unknown>;
      return (
        typeof session.tokenHash === "string" &&
        /^[a-f0-9]{64}$/.test(session.tokenHash) &&
        text(session.userId, 100) &&
        isoDate(session.expiresAt)
      );
    }) &&
    document.actors !== null &&
    typeof document.actors === "object" &&
    !Array.isArray(document.actors) &&
    Object.entries(document.actors as Record<string, unknown>).every(
      ([id, actor]) => text(id, 140) && validActor(actor),
    )
  );
}

export class BackendDatabase {
  private document: DatabaseDocument;

  constructor(private readonly filePath: string | null = null) {
    this.document = this.load();
  }

  read() {
    return this.document;
  }

  mutate<T>(operation: (document: DatabaseDocument) => T): T {
    const result = operation(this.document);
    this.persist();
    return result;
  }

  reset() {
    this.document = emptyDocument();
    this.persist();
  }

  private load(): DatabaseDocument {
    if (!this.filePath || !existsSync(this.filePath)) return emptyDocument();
    try {
      const value = JSON.parse(readFileSync(this.filePath, "utf8"));
      if (validDocument(value)) return value;
    } catch {
      // A corrupt file is replaced with a known-safe empty document on first write.
    }
    return emptyDocument();
  }

  private persist() {
    if (!this.filePath) return;
    mkdirSync(dirname(this.filePath), { recursive: true });
    const temporary = `${this.filePath}.${process.pid}.tmp`;
    writeFileSync(temporary, `${JSON.stringify(this.document, null, 2)}\n`, {
      mode: 0o600,
    });
    renameSync(temporary, this.filePath);
  }
}
