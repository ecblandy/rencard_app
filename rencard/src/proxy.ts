import { NextRequest, NextResponse } from "next/server";

const ANGULAR_URL = process.env.ANGULAR_URL || "http://localhost:4200";

const ANGULAR_ROUTES = ["/auth", "/dashboard"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAngularRoute = ANGULAR_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (isAngularRoute) {
    const url = new URL(pathname + request.nextUrl.search, ANGULAR_URL);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/dashboard/:path*"],
};
