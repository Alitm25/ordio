import { verifyToken } from "@/lib/auth";

export interface JwtPayload {
    userId: string;
    email: string;
}

export function getCurrentUser(req: Request): JwtPayload {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
        throw new Error("Unauthorized");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = verifyToken(token) as JwtPayload;

    return decoded;
}