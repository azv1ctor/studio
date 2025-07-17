// src/middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/auth/session";
import type { Group } from "@/lib/types";

const publicRoutes = ["/login"];
const allAppRoutes = [
  "/dashboard",
  "/products",
  "/stock-movements",
  "/transfers",
  "/shopping-list",
  "/employees",
  "/departments",
  "/groups",
  "/reports",
];

async function fetchGroups(req: NextRequest): Promise<Group[]> {
  const url = new URL("/api/groups", req.nextUrl.origin)
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      // Pass along cookies if necessary for auth, but this API route is simple
      'Cookie': req.headers.get('Cookie') || '',
    },
    cache: 'no-store' // Ensure fresh data
  });
  if (!response.ok) {
    console.error("Failed to fetch groups in middleware:", response.status, response.statusText);
    return [];
  }
  try {
    return await response.json();
  } catch (e) {
    console.error("Failed to parse groups JSON in middleware:", e);
    return [];
  }
}

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
    let userPermissions: string[] = [];

    if (user.role === 'Manager') {
        userPermissions = allAppRoutes;
    } else if (user.groupId) {
        // Fetching groups might fail if Firestore isn't set up.
        // We proceed gracefully.
        const groups = await fetchGroups(req);
        const userGroup = groups.find(g => g.id === user.groupId);
        userPermissions = userGroup?.permissions || [];
    }
    
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
