import jwt from "jsonwebtoken";

// Read the secret when it's USED, not when this file is loaded.
// `next build` loads this file too, and building the app must not need production secrets.
export function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is missing");
    }

    return secret;
}

export function verifyToken(token: string) {
    return jwt.verify(token, getJwtSecret());
}
