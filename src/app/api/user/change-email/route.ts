import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { changeEmailSchema } from "@/features/settings/schemas/changeEmail";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        // Same schema as the change-email form (also checks the email format)
        const { newEmail, currentPassword } = validate(changeEmailSchema, await req.json());

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