import { NextResponse, type NextRequest } from "next/server";

// NEXT_PUBLIC_COMING_SOON=true hides the whole site (only /auth and /admin stay reachable).
const COMING_SOON = process.env.NEXT_PUBLIC_COMING_SOON === "true";
const OPEN = /^\/(auth|admin|coming-soon)(\/|$)/;

export function proxy(req: NextRequest) {
  if (COMING_SOON && !OPEN.test(req.nextUrl.pathname)) return NextResponse.rewrite(new URL("/coming-soon", req.url));
}

export const config = {
  // skip Next internals, robots/sitemap and any file with an extension (images, favicon, feed...)
  matcher: ["/((?!_next/|api/|robots\.txt|sitemap\.xml|.*\..*).*)"],
};
