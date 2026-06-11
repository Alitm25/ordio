import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = getCurrentUser(req);

        const body = await req.json();

        const {
            customerName,
            customerPhone,
            productName,
            quantity,
            price,
        } = body;

        const order = await Order.create({
            customerName,
            customerPhone,
            productName,
            quantity,
            price,

            userId: user.userId,
        });

        return Response.json(
            {
                message: "Order created successfully",
                order,
            },
            { status: 201 }
        );
    } catch (error) {
        return Response.json(
            {
                message: "Server error",
                error,
            },
            { status: 500 }
        );
    }
}



export async function GET(req: Request) {
    try {
        await connectDB();

        const user = getCurrentUser(req);

        const orders = await Order.find({
            userId: decoded.userId,
        }).sort({
            createdAt: -1,
        });

        return Response.json({
            orders,
        });
    } catch (error) {
        return Response.json(
            {
                message: "Unauthorized",
                error,
            },
            { status: 401 }
        );
    }
}