import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/dashboard", "/orders", "/settings", "/products", "/customers"];
const authRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const { pathname } = request.nextUrl;

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    );

    const isAuthRoute = authRoutes.some((route) =>
        pathname.startsWith(route)
    );

    // Redirect user to the dashboard or login page whether the user is logged-in or not
    if (pathname === "/") {
        if (token) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        } else {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    if (isProtectedRoute && !token) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
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