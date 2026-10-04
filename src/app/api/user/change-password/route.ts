import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/apiError";

export async function PATCH(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const {currentPassword, newPassword} = await req.json();

        // Return Error when new and current passwrod missing
        if (!currentPassword || !newPassword) {
            return Response.json(
                { message: 'All fields are required.' },
                { status: 400 }
            )
        }

        // Return error when password is less than 6 characters
        if (newPassword.length < 6) {
            return Response.json(
                { message: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

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