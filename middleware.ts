import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = "session";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = request.cookies.get(COOKIE_NAME);

    // Check if route needs protection
    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    // Verify session if exists
    let isValidSession = false;
    if (sessionCookie && JWT_SECRET) {
        try {
            const secretKey = new TextEncoder().encode(JWT_SECRET);
            await jwtVerify(sessionCookie.value, secretKey);
            isValidSession = true;
        } catch {
            // Invalid session - will be handled below
        }
    }

    // Redirect from protected routes if not authenticated
    if (isProtectedRoute && !isValidSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Redirect from auth routes if already authenticated
    if (isAuthRoute && isValidSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|_next).*)",
    ],
};
