import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const user = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  // Rutas públicas — no requieren auth
  if (pathname === "/login" || pathname === "/register") {
    if (token) return NextResponse.redirect(new URL("/", request.url));
    return NextResponse.next();
  }

  // Ruta admin — solo ADMIN
  if (pathname.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    try {
      const userData = JSON.parse(user || "{}");
      if (userData.rol !== "ADMIN") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Rutas privadas — requieren auth
  if (pathname.startsWith("/products")) {
    if (!token) return NextResponse.redirect(new URL("/login", request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/products/:path*", "/login", "/register"],
};