import { join } from "node:path";
import {
  BackendDatabase,
  CommerceBackend,
  type CatalogProduct,
} from "@amazon-clone/backend";
import catalog from "@/lib/catalog.json";

const dataFile =
  process.env.NODE_ENV === "test" || process.env.AMAZON_BACKEND_DATA_FILE === ":memory:"
    ? null
    : process.env.AMAZON_BACKEND_DATA_FILE ||
      (process.env.VERCEL
        ? join("/tmp", "amazon-clone-backend.json")
        : join(process.cwd(), ".data", "backend.json"));

declare global {
  var amazonCloneBackend:
    | { database: BackendDatabase; service: CommerceBackend }
    | undefined;
}

export const backend =
  globalThis.amazonCloneBackend ??
  (() => {
    const database = new BackendDatabase(dataFile);
    const service = new CommerceBackend(catalog.products as CatalogProduct[], database);
    return { database, service };
  })();

if (process.env.NODE_ENV !== "production") globalThis.amazonCloneBackend = backend;
