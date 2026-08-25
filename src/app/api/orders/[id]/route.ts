import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET( _req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;

        const order = await Order.findOne({
            _id: id,
            userId: user.userId,
        }).populate("customerId", "name phone");

        if (!order) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        return Response.json({ order });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}

export async function PATCH( req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;
        const body = await req.json();

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

        const allowedFields = [
            "customerName",
            "customerPhone",
            "customerId",
            "status",
            "paymentStatus",
            "paymentMethod",
        ] as const;

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                order[field] = body[field];
            }
        }

        if (body.items && Array.isArray(body.items) && body.items.length > 0) {
            const processedItems = body.items.map((item: {
                productId?: string;
                productName: string;
                quantity: number;
                price: number;
            }) => ({
                productId: item.productId ?? null,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price,
            }));

            order.items = processedItems;
            order.totalAmount = processedItems.reduce(
                (sum: number, item: { subtotal: number }) => sum + item.subtotal,
                0
            );
        }

        await order.save();

        return Response.json({
            message: "Order updated successfully",
            order,
        });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}

export async function DELETE( _req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;

        const deletedOrder = await Order.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!deletedOrder) {
            return Response.json(
                { message: "Order not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Order deleted successfully",
        });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}