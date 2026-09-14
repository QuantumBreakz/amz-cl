import { readJson } from "@amazon-clone/backend";
import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function GET(request: NextRequest) {
  return api(request, ({ actor }) => {
    const state = backend.service.getState(actor);
    return {
      data: { name: state.name, location: state.location, language: state.language, user: state.user },
    };
  });
}

export function PATCH(request: NextRequest) {
  return api(request, async ({ actor }) => {
    const body = await readJson(request);
    return {
      data: backend.service.updateProfile(actor, {
        name: body.name,
        location: body.location,
        language: body.language,
      }),
    };
  });
}
