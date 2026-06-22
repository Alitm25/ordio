import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        await connectDB();

        const decoded = await getCurrentUser();

        const user = await User.findById(decoded.userId);

        if (!user) {
            return Response.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return Response.json({
            user: {
                id: user._id,
                email: user.email,
            },
        });
    } catch (error) {
        return Response.json(
            { message: "Unauthorized", error },
            { status: 401 }
        );
    }
}