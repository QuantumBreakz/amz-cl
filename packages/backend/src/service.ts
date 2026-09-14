import {
  createHash,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";
import type { BackendDatabase } from "./database";
import { BackendError, requiredString, validEmail } from "./errors";
import type {
  ActorState,
  CartLine,
  CatalogProduct,
  CommerceState,
  DatabaseDocument,
  Order,
  PublicUser,
  RequestActor,
  UserRecord,
} from "./types";

const SESSION_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

function blankState(name = ""): ActorState {
  return {
    cart: [],
    saved: [],
    orders: [],
    name,
    location: "Pakistan",
    language: "English",
    orderKeys: {},
  };
}

function publicUser(user: UserRecord): PublicUser {
  const { id, email, name, createdAt } = user;
  return { id, email, name, createdAt };
}

function passwordHash(password: string, salt: string) {
  return scryptSync(password, salt, 64).toString("hex");
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left, "hex");
  const b = Buffer.from(right, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export class CommerceBackend {
  private readonly productsById: Map<string, CatalogProduct>;

  constructor(
    private readonly products: CatalogProduct[],
    private readonly database: BackendDatabase,
  ) {
    this.productsById = new Map(products.map((product) => [product.id, product]));
  }

  resolveActor(guestId: string, sessionToken?: string): RequestActor {
    const normalizedGuest = /^[a-zA-Z0-9-]{16,128}$/.test(guestId)
      ? guestId
      : randomUUID();
    if (sessionToken) {
      const session = this.database
        .read()
        .sessions.find(
          (candidate) =>
            candidate.tokenHash === tokenHash(sessionToken) &&
            Date.parse(candidate.expiresAt) > Date.now(),
        );
      const user = session
        ? this.database.read().users.find((candidate) => candidate.id === session.userId)
        : undefined;
      if (user) {
        return {
          actorId: `user:${user.id}`,
          guestId: normalizedGuest,
          user: publicUser(user),
        };
      }
    }
    return { actorId: `guest:${normalizedGuest}`, guestId: normalizedGuest, user: null };
  }

  getState(actor: RequestActor): CommerceState {
    return this.database.mutate((document) =>
      this.stateResponse(document, actor.actorId, actor.user),
    );
  }

  register(
    actor: RequestActor,
    input: { name: unknown; email: unknown; password: unknown },
  ) {
    const name = requiredString(input.name, "name", { min: 2, max: 80 });
    const email = validEmail(input.email);
    const password = requiredString(input.password, "password", { min: 8, max: 128 });

    return this.database.mutate((document) => {
      if (document.users.some((user) => user.email === email)) {
        throw new BackendError(
          "EMAIL_IN_USE",
          "An account already exists for that email address.",
          409,
        );
      }
      const salt = randomBytes(16).toString("hex");
      const user: UserRecord = {
        id: randomUUID(),
        email,
        name,
        createdAt: new Date().toISOString(),
        passwordSalt: salt,
        passwordHash: passwordHash(password, salt),
      };
      document.users.push(user);
      const userActorId = `user:${user.id}`;
      document.actors[userActorId] = this.mergeStates(
        document.actors[userActorId] ?? blankState(name),
        document.actors[actor.actorId] ?? blankState(),
        name,
      );
      if (actor.actorId.startsWith("guest:")) delete document.actors[actor.actorId];
      const token = this.createSession(document, user.id);
      const nextActor = { ...actor, actorId: userActorId, user: publicUser(user) };
      return { token, state: this.stateResponse(document, userActorId, nextActor.user) };
    });
  }

  login(actor: RequestActor, input: { email: unknown; password: unknown }) {
    const email = validEmail(input.email);
    const password = requiredString(input.password, "password", { min: 1, max: 128 });
    return this.database.mutate((document) => {
      const user = document.users.find((candidate) => candidate.email === email);
      const attempted = user ? passwordHash(password, user.passwordSalt) : "00";
      if (!user || !safeEqual(attempted, user.passwordHash)) {
        throw new BackendError(
          "INVALID_CREDENTIALS",
          "The email address or password is incorrect.",
          401,
        );
      }
      const userActorId = `user:${user.id}`;
      document.actors[userActorId] = this.mergeStates(
        document.actors[userActorId] ?? blankState(user.name),
        document.actors[actor.actorId] ?? blankState(),
        user.name,
      );
      if (actor.actorId.startsWith("guest:")) delete document.actors[actor.actorId];
      const token = this.createSession(document, user.id);
      return {
        token,
        state: this.stateResponse(document, userActorId, publicUser(user)),
      };
    });
  }

  logout(sessionToken?: string) {
    if (!sessionToken) return;
    this.database.mutate((document) => {
      document.sessions = document.sessions.filter(
        (session) => session.tokenHash !== tokenHash(sessionToken),
      );
    });
  }

  updateProfile(actor: RequestActor, input: { name?: unknown; location?: unknown; language?: unknown }) {
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      if (input.name !== undefined) {
        state.name = requiredString(input.name, "name", { min: 2, max: 80 });
        if (actor.user) {
          const user = document.users.find((candidate) => candidate.id === actor.user?.id);
          if (user) user.name = state.name;
        }
      }
      if (input.location !== undefined) {
        state.location = requiredString(input.location, "location", { min: 2, max: 80 });
      }
      if (input.language !== undefined) {
        state.language = requiredString(input.language, "language", { min: 2, max: 40 });
      }
      const user = actor.user
        ? document.users.find((candidate) => candidate.id === actor.user?.id)
        : undefined;
      return this.stateResponse(document, actor.actorId, user ? publicUser(user) : null);
    });
  }

  addCartLine(
    actor: RequestActor,
    input: { productId: unknown; quantity?: unknown; color?: unknown },
  ) {
    const id = requiredString(input.productId, "productId", { max: 100 });
    const quantity = input.quantity === undefined ? 1 : this.quantity(input.quantity, false);
    const color =
      input.color === undefined
        ? undefined
        : requiredString(input.color, "color", { min: 1, max: 40 });
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      const current = state.cart.find((line) => line.id === id)?.quantity ?? 0;
      state.cart = this.setLine(state.cart, id, current + quantity, color);
      return this.stateResponse(document, actor.actorId, actor.user);
    });
  }

  setCartLine(
    actor: RequestActor,
    productId: unknown,
    input: { quantity: unknown; color?: unknown },
  ) {
    const id = requiredString(productId, "productId", { max: 100 });
    const quantity = this.quantity(input.quantity, true);
    const color =
      input.color === undefined
        ? undefined
        : requiredString(input.color, "color", { min: 1, max: 40 });
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      state.cart = this.setLine(state.cart, id, quantity, color);
      return this.stateResponse(document, actor.actorId, actor.user);
    });
  }

  removeCartLine(actor: RequestActor, productId: unknown) {
    return this.setCartLine(actor, productId, { quantity: 0 });
  }

  saveItem(actor: RequestActor, productId: unknown) {
    const id = requiredString(productId, "productId", { max: 100 });
    this.product(id);
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      state.saved = [...new Set([...state.saved, id])];
      state.cart = state.cart.filter((line) => line.id !== id);
      return this.stateResponse(document, actor.actorId, actor.user);
    });
  }

  removeSavedItem(actor: RequestActor, productId: unknown) {
    const id = requiredString(productId, "productId", { max: 100 });
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      state.saved = state.saved.filter((candidate) => candidate !== id);
      return this.stateResponse(document, actor.actorId, actor.user);
    });
  }

  placeOrder(
    actor: RequestActor,
    input: { name: unknown; address: unknown; idempotencyKey: unknown },
  ) {
    const name = requiredString(input.name, "name", { min: 2, max: 80 });
    const address = requiredString(input.address, "address", { min: 10, max: 500 });
    const key = requiredString(input.idempotencyKey, "idempotencyKey", {
      min: 16,
      max: 128,
    });
    return this.database.mutate((document) => {
      const state = this.ensureState(document, actor.actorId, actor.user?.name);
      const existingId = state.orderKeys[key];
      if (existingId) {
        const existing = state.orders.find((order) => order.id === existingId);
        if (existing) return { order: structuredClone(existing), state: this.stateResponse(document, actor.actorId, actor.user) };
      }
      if (!state.cart.length) {
        throw new BackendError("EMPTY_CART", "Add an item before placing an order.", 409);
      }
      const lines = state.cart.map((line) => ({
        ...line,
        unitPrice: this.product(line.id).price,
      }));
      const totalCents = lines.reduce(
        (sum, line) => sum + Math.round(line.unitPrice * 100) * line.quantity,
        0,
      );
      const order: Order = {
        id: `113-${Date.now().toString().slice(-7)}-${randomBytes(4).readUInt32BE(0).toString().padStart(10, "0").slice(-7)}`,
        date: new Date().toISOString(),
        lines,
        total: totalCents / 100,
        name,
        address,
      };
      state.name = name;
      state.cart = [];
      state.orders.unshift(order);
      state.orderKeys[key] = order.id;
      return { order: structuredClone(order), state: this.stateResponse(document, actor.actorId, actor.user) };
    });
  }

  getOrder(actor: RequestActor, orderId: unknown) {
    const id = requiredString(orderId, "orderId", { max: 100 });
    const state = this.ensureState(this.database.read(), actor.actorId, actor.user?.name);
    const order = state.orders.find((candidate) => candidate.id === id);
    if (!order) throw new BackendError("ORDER_NOT_FOUND", "Order not found.", 404);
    return structuredClone(order);
  }

  listProducts(input: { q?: string; category?: string; offset?: number; limit?: number }) {
    const q = input.q?.trim().toLowerCase() ?? "";
    const category = input.category?.trim() ?? "";
    const offset = Math.max(0, Math.floor(input.offset ?? 0));
    const limit = Math.min(100, Math.max(1, Math.floor(input.limit ?? 24)));
    const filtered = this.products.filter(
      (product) =>
        (!category || product.category === category) &&
        (!q ||
          `${product.name} ${product.category} ${product.subCategory} ${product.brand}`
            .toLowerCase()
            .includes(q)),
    );
    return { items: filtered.slice(offset, offset + limit), total: filtered.length, offset, limit };
  }

  getProduct(productId: unknown) {
    return this.product(requiredString(productId, "productId", { max: 100 }));
  }

  private product(id: string) {
    const product = this.productsById.get(id);
    if (!product) throw new BackendError("PRODUCT_NOT_FOUND", "Product not found.", 404);
    return product;
  }

  private quantity(value: unknown, allowZero: boolean) {
    if (typeof value !== "number" || !Number.isFinite(value)) {
      throw new BackendError("VALIDATION_ERROR", "Enter a valid quantity.", 400);
    }
    const quantity = Math.floor(value);
    if (quantity < (allowZero ? 0 : 1)) {
      throw new BackendError("VALIDATION_ERROR", "Enter a valid quantity.", 400);
    }
    return quantity;
  }

  private setLine(lines: CartLine[], id: string, quantity: number, color?: string) {
    const product = this.product(id);
    const next = Math.min(product.stockQuantity, quantity);
    if (next === 0) return lines.filter((line) => line.id !== id);
    const existing = lines.find((line) => line.id === id);
    return existing
      ? lines.map((line) =>
          line.id === id ? { ...line, quantity: next, color: color ?? line.color } : line,
        )
      : [...lines, { id, quantity: next, color }];
  }

  private createSession(document: DatabaseDocument, userId: string) {
    const now = Date.now();
    document.sessions = document.sessions.filter(
      (session) => Date.parse(session.expiresAt) > now,
    );
    const token = randomBytes(32).toString("base64url");
    document.sessions.push({
      tokenHash: tokenHash(token),
      userId,
      expiresAt: new Date(now + SESSION_LIFETIME_MS).toISOString(),
    });
    return token;
  }

  private ensureState(document: DatabaseDocument, actorId: string, name = "") {
    return (document.actors[actorId] ??= blankState(name));
  }

  private stateResponse(
    document: DatabaseDocument,
    actorId: string,
    user: PublicUser | null,
  ): CommerceState {
    const state = this.ensureState(document, actorId, user?.name);
    return structuredClone({
      cart: state.cart,
      saved: state.saved,
      orders: state.orders,
      name: state.name || user?.name || "",
      location: state.location,
      language: state.language || "English",
      user,
    });
  }

  private mergeStates(primary: ActorState, incoming: ActorState, name: string) {
    const merged = structuredClone(primary);
    for (const line of incoming.cart) {
      const current = merged.cart.find((candidate) => candidate.id === line.id)?.quantity ?? 0;
      merged.cart = this.setLine(merged.cart, line.id, current + line.quantity, line.color);
    }
    merged.saved = [...new Set([...merged.saved, ...incoming.saved])];
    merged.orders = [...incoming.orders, ...merged.orders].sort((a, b) =>
      b.date.localeCompare(a.date),
    );
    merged.orderKeys = { ...incoming.orderKeys, ...merged.orderKeys };
    merged.name = name;
    merged.language = primary.language || incoming.language || "English";
    if (primary.location === "Pakistan" && incoming.location !== "Pakistan") {
      merged.location = incoming.location;
    }
    return merged;
  }
}
