import { readJson } from "@amazon-clone/backend";
import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function GET(request: NextRequest) {
  return api(request, ({ actor }) => ({ data: backend.service.getState(actor).orders }));
}

export function POST(request: NextRequest) {
  return api(request, async ({ actor }) => {
    const body = await readJson(request);
    return {
      data: backend.service.placeOrder(actor, {
        name: body.name,
        address: body.address,
        idempotencyKey: body.idempotencyKey,
      }),
      status: 201,
    };
  });
}
