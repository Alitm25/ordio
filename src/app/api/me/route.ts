import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { ApiError, handleApiError } from "@/lib/apiError";

export async function GET() {
    try {
        const decoded = await getCurrentUser();
        await connectDB();

        const user = await User.findById(decoded.userId);

        // A valid token for a deleted user: we don't know who this is anymore -> 401
        if (!user) {
            throw new ApiError(401, "Unauthorized");
        }

        return Response.json({
            user: {
                id: user._id,
                email: user.email,
                createdAt: user.createdAt
            },
        });
    } catch (error) {
        return handleApiError(error);
    }
}