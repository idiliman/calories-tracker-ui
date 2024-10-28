import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateRandomName } from "@/lib/randomName";
import { CALORIE_GOAL_KEY, COOKIE_OPTIONS, ID_KEY } from "@/lib/cookies";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const idCookie = request.cookies.get(ID_KEY)?.value;
  const goalsCookie = request.cookies.get(CALORIE_GOAL_KEY)?.value;

  if (!idCookie) {
    response.cookies.set({
      name: ID_KEY,
      value: generateRandomName(),
      ...COOKIE_OPTIONS,
    });
  }

  if (!goalsCookie) {
    response.cookies.set({
      name: CALORIE_GOAL_KEY,
      value: "2000",
      ...COOKIE_OPTIONS,
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
