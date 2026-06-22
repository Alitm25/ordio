import { verifyToken } from "@/lib/auth";
import {cookies} from "next/headers";

export interface JwtPayload {
    userId: string;
    email: string;
}

export async function getCurrentUser(): Promise<JwtPayload> {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        throw new Error("Unauthorized");
    }

    const decoded = verifyToken(token) as JwtPayload;

    return decoded;
}