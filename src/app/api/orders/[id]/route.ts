import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user = getCurrentUser(req);

        const { id } = await params;

        const { status } = await req.json();

        console.log("ID:", id);
        console.log("User ID:", user.userId);
        console.log("Status:", status);

        const order = await Order.findOne({
            _id: id,
            userId: user.userId,
        });

        if (!order) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        order.status = status;

        await order.save();

        return Response.json({
            message: "Order updated successfully",
            order,
        });
    } catch (error) {
        console.error("PATCH ERROR:", error);

        return Response.json(
            {
                message: "Server error",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}