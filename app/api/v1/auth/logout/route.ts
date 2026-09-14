import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function POST(request: NextRequest) {
  return api(request, (context) => {
    backend.service.logout(context.sessionToken);
    context.clearSession = true;
    const guest = backend.service.resolveActor(context.guestId);
    return { data: backend.service.getState(guest) };
  });
}
