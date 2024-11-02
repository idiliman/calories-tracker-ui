import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { generateRandomName } from "@/lib/randomName";
import { CALORIE_GOAL_KEY, COOKIE_OPTIONS, ID_KEY } from "@/lib/cookies";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.fixedWindow(2, "5 s"),
});

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = request.headers.get("x-real-ip");

  console.log("ip:", ip);

  // Rate limit
  const identifier = ip ?? request.url;
  const result = await ratelimit.limit(identifier);
  response.headers.set("X-RateLimit-Limit", result.limit.toString());
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());

  if (!result.success) {
    return new Response("The request has been rate limited.", {
      status: 429,
      headers: {
        "X-RateLimit-Limit": result.limit.toString(),
        "X-RateLimit-Remaining": result.remaining.toString(),
      },
    });
  }

  // Set cookies
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
