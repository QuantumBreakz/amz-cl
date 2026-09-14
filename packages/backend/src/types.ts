export type CartLine = {
  id: string;
  quantity: number;
  color?: string;
};

export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  stockQuantity: number;
  category: string;
  subCategory: string;
  brand: string;
  images: string[];
  inStock: boolean;
  [key: string]: unknown;
};

export type OrderLine = CartLine & { unitPrice: number };

export type Order = {
  id: string;
  date: string;
  lines: OrderLine[];
  total: number;
  name: string;
  address: string;
};

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
};

export type CommerceState = {
  cart: CartLine[];
  saved: string[];
  orders: Order[];
  name: string;
  location: string;
  language: string;
  user: PublicUser | null;
};

export type UserRecord = PublicUser & {
  passwordHash: string;
  passwordSalt: string;
};

export type SessionRecord = {
  tokenHash: string;
  userId: string;
  expiresAt: string;
};

export type ActorState = Omit<CommerceState, "user"> & {
  orderKeys: Record<string, string>;
};

export type DatabaseDocument = {
  version: 1;
  users: UserRecord[];
  sessions: SessionRecord[];
  actors: Record<string, ActorState>;
};

export type RequestActor = {
  actorId: string;
  guestId: string;
  user: PublicUser | null;
};
