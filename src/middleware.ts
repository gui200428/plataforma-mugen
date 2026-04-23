import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "apv_token";

const publicPaths = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  // If trying to access a protected route without a token → redirect to login
  if (!publicPaths.includes(pathname) && pathname !== "/" && !pathname.startsWith("/api/") && !token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access auth pages while logged in → redirect to dashboard
  if (publicPaths.includes(pathname) && token) {
    const dashboardUrl = new URL("/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
