import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  return api(request, async ({ actor }) => ({
    data: backend.service.removeSavedItem(actor, (await params).id),
  }));
}
