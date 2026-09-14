import { readJson } from "@amazon-clone/backend";
import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

type Context = { params: Promise<{ id: string }> };

export function PATCH(request: NextRequest, { params }: Context) {
  return api(request, async ({ actor }) => {
    const [body, { id }] = await Promise.all([readJson(request), params]);
    return {
      data: backend.service.setCartLine(actor, id, {
        quantity: body.quantity,
        color: body.color,
      }),
    };
  });
}

export function DELETE(request: NextRequest, { params }: Context) {
  return api(request, async ({ actor }) => ({
    data: backend.service.removeCartLine(actor, (await params).id),
  }));
}
