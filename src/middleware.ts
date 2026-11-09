import { NextResponse, type NextRequest } from "next/server";

/**
 * English is served at the root (/about); other languages are prefixed
 * (/ar/about, /fa/about, /zh/about). Root URLs are internally rewritten to
 * the /en route segment.
 */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/^\/(en|ar|fa|zh)(\/|$)/.test(pathname)) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = `/en${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api|_next|images|favicon|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)"],
};
