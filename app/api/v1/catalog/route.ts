import { NextRequest } from "next/server";
import { api, integerParam } from "@/lib/server/api";
import { backend } from "@/lib/server/backend";

export function GET(request: NextRequest) {
  return api(request, () => {
    const search = request.nextUrl.searchParams;
    return {
      data: backend.service.listProducts({
        q: search.get("q") ?? undefined,
        category: search.get("category") ?? undefined,
        offset: integerParam(search.get("offset"), 0),
        limit: integerParam(search.get("limit"), 24),
      }),
    };
  });
}
