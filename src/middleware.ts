import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateRandomName } from "../lib/randomName";
import { ID_KEY } from "../lib/id";

export const COOKIE_OPTIONS = {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const cookie = request.cookies.get("calorie-tracker-id")?.value;

  if (!cookie) {
    response.cookies.set({
      name: ID_KEY,
      value: generateRandomName(),
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
