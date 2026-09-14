import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function GET(request: NextRequest) {
  return api(request, ({ actor }) => ({ data: backend.service.getState(actor) }));
}
