import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import {NextResponse} from "next/server";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { loginSchema } from "@/features/auth/schemas/loginSchema";
import { createRateLimiter, getClientIp } from "@/lib/rateLimit";
import { getJwtSecret } from "@/lib/auth";

const FIFTEEN_MINUTES = 15 * 60 * 1000;
// Only FAILED logins are counted. Two keys, because each one alone has a hole:
// per email stops many computers guessing one account; per IP stops one computer trying many accounts.
const failedByEmail = createRateLimiter({ limit: 5, windowMs: FIFTEEN_MINUTES });
const failedByIp = createRateLimiter({ limit: 20, windowMs: FIFTEEN_MINUTES });

export async function POST(req: Request) {
    try {
        // email & password are guaranteed to be strings (not database operators)
        const { email, password } = validate(loginSchema, await req.json());

        const emailKey = `email:${email}`;
        const ipKey = `ip:${getClientIp(req)}`;

        // Too many failures? Answer before touching the database or bcrypt (both are slow on purpose)
        const retryAfter = Math.max(failedByEmail.retryAfterSeconds(emailKey), failedByIp.retryAfterSeconds(ipKey));
        if (retryAfter > 0) {
            return NextResponse.json(
                { message: "Too many login attempts. Try again later.", retryAfter },
                { status: 429, headers: { "Retry-After": String(retryAfter) } }
            );
        }

        // Same answer for "no such user" and "wrong password", so nobody can find out which emails exist
        const rejectLogin = () => {
            failedByEmail.hit(emailKey);
            failedByIp.hit(ipKey);
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        };

        await connectDB();
        const user = await User.findOne({ email });

        if (!user) {
            return rejectLogin();
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return rejectLogin();
        }

        // Logged in: this account's failed attempts start from zero again
        failedByEmail.reset(emailKey);

        // JWT auth
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            getJwtSecret(),
            {
                expiresIn: "7d"
            }
        )

        const response = NextResponse.json({
            message: "Login successfully",
            user: {
                id: user._id,
                email: user.email
            }
        })

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        return response;

    } catch (error) {
        return handleApiError(error);
    }

}