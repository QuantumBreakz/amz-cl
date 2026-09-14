import { readJson } from "@amazon-clone/backend";
import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function GET(request: NextRequest) {
  return api(request, ({ actor }) => ({ data: backend.service.getState(actor).saved }));
}

export function POST(request: NextRequest) {
  return api(request, async ({ actor }) => {
    const body = await readJson(request);
    return { data: backend.service.saveItem(actor, body.productId), status: 201 };
  });
}
