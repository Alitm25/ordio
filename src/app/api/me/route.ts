import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return Response.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];

        const decoded = verifyToken(token) as {
            userId: string;
            email: string;
        };

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