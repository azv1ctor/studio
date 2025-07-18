// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/auth/session";

const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Skip middleware for API routes and static files
  if (path.startsWith('/api/') || path.startsWith('/_next/') || path.endsWith('.png') || path.endsWith('.ico')) {
    return NextResponse.next();
  }

  const sessionCookie = req.cookies.get("session")?.value;
  const session = await decrypt(sessionCookie);
  const user = session?.user;
  
  const isPublicRoute = publicRoutes.includes(path);

  if (user && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (!user && !isPublicRoute) {
    const from = path === "/" ? "" : `?from=${encodeURIComponent(path)}`;
    return NextResponse.redirect(new URL(`/login${from}`, req.nextUrl));
  }
  
  if (user && path === "/") {
     return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (user && !isPublicRoute) {
    // Permissions are now read directly from the session cookie.
    // This is much faster as it avoids a database call on every navigation.
    const userPermissions = user.permissions || [];
    
    // Check if the current path is one of the allowed routes.
    // Use `some` to check if the path starts with any of the allowed permissions.
    if (!userPermissions.some(p => path.startsWith(p))) {
        // Redirect to dashboard if they try to access a forbidden page.
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
