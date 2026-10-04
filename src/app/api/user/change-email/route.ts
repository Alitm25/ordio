import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/apiError";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { newEmail, currentPassword } = await req.json();

        if (!newEmail || !currentPassword) {
            return Response.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmail)) {
            return Response.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        // Find User
        const dbUser = await User.findById(user.userId);

        if (!dbUser) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Check the correctness of password
        const isPasswordCorrect = await bcrypt.compare(
            currentPassword,
            dbUser.password
        );

        if (!isPasswordCorrect) {
            return Response.json(
                { message: "Current password is incorrect" },
                { status: 401 }
            );
        }

        // Check that email has been submitted before or not
        const existingUser = await User.findOne({ email: newEmail });

        if (existingUser) {
            return Response.json(
                { message: "This email is already taken" },
                { status: 409 }
            );
        }

        // Replace new email with previous one
        dbUser.email = newEmail;
        await dbUser.save();

        return Response.json({
            message: "Email changed successfully",
            user: {
                id: dbUser._id,
                email: dbUser.email,
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}