import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { changePasswordRequestSchema } from "@/features/settings/schemas/changePasswordSchema";

export async function PATCH(req: Request) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        // Both passwords must be strings, and the new one at least 6 characters
        const {currentPassword, newPassword} = validate(changePasswordRequestSchema, await req.json());

        const dbUser = await User.findById(user.userId);

        // Return Error if user not found
        if (!dbUser) {
            return Response.json(
                { message: 'User not found.' },
                { status: 400 }
            )
        }

        // check if the current password is the same as user password
        const isPasswordCorrect = await bcrypt.compare(currentPassword, dbUser.password);

        if (!isPasswordCorrect) {
            return Response.json(
                { message: 'Current Password is incorrect.' },
                { status: 400 }
            );
        }

        // Hashed new password for security purposes
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // save the new password
        dbUser.password = hashedPassword;
        await dbUser.save();

        return Response.json({
            message: "Password changed successfully",
        });
    } catch (error) {
        return handleApiError(error);
    }
}