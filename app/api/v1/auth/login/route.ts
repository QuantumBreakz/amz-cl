import { readJson } from "@amazon-clone/backend";
import { NextRequest } from "next/server";
import { api } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function POST(request: NextRequest) {
  return api(request, async (context) => {
    const body = await readJson(request);
    const result = backend.service.login(context.actor, {
      email: body.email,
      password: body.password,
    });
    context.setSessionToken = result.token;
    return { data: result.state };
  });
}
