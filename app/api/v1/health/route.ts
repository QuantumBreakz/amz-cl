import { backend } from "@/lib/server/backend";

export function GET() {
  const response = Response.json({
    data: {
      status: "ok",
      service: "amazon-clone-backend",
      version: 1,
      catalogProducts: backend.service.listProducts({ limit: 1 }).total,
    },
  });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
