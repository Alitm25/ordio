import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        await connectDB();

        const { email, password } = await req.json();

        if (!email || !password) {
            return Response.json(
                { message: "Email and password required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return Response.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return Response.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        return Response.json({
            message: "Login successful",
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}