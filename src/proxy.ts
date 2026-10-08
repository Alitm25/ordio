import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/orders", "/settings", "/products", "/customers"];
const authRoutes = ["/login", "/register"];

// Actually read the ticket: a token only counts if its signature is valid and it hasn't expired
function hasValidToken(token: string | undefined): boolean {
    if (!token) return false;

    try {
        verifyToken(token);
        return true;
    } catch {
        return false;
    }
}

// Decide where the visitor goes, based on whether they're really logged in
function getResponse(request: NextRequest, isLoggedIn: boolean) {
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Redirect user to the dashboard or login page whether the user is logged-in or not
    if (pathname === "/" || pathname === "") {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
        return NextResponse.next();
    }

    if (isProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const isLoggedIn = hasValidToken(token);

    const response = getResponse(request, isLoggedIn);

    // An expired or fake token is useless: throw it away so the browser stops sending it
    if (token && !isLoggedIn) {
        response.cookies.delete("token");
    }

    return response;
}

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/orders/:path*",
        "/products/:path*",
        "/customers/:path*",
        "/settings/:path*",
        "/login",
        "/register",
    ],
};
