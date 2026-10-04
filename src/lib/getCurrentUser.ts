import { verifyToken } from "@/lib/auth";
import { ApiError } from "@/lib/apiError";
import {cookies} from "next/headers";

export interface JwtPayload {
    userId: string;
    email: string;
}

export async function getCurrentUser(): Promise<JwtPayload> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new ApiError(401, "Unauthorized");
    }

    // jwt.verify throws when the token is expired or tampered with
    try {
        return verifyToken(token) as JwtPayload;
    } catch {
        throw new ApiError(401, "Unauthorized");
    }
}
