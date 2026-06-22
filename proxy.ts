import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Preserve bio links copied before public profiles moved away from /@name.
  // Next treats an @-prefixed URL segment specially and otherwise returns 404.
  if (pathname.startsWith("/@") || pathname.toLowerCase().startsWith("/%40")) {
    const url = request.nextUrl.clone();
    url.pathname = `/${decodeURIComponent(pathname.slice(1)).replace(/^@+/, "")}`;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
