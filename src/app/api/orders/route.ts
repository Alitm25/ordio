import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import {getCurrentUser} from "@/lib/getCurrentUser";

export async function POST(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();

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



export async function GET( _req :Request ) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        const { searchParams } = new URL(req.url);

        const search = searchParams.get("search") ?? "";
        const status = searchParams.get("status") ?? "all";
        const sortBy = searchParams.get("sortBy") ?? "createdAt";
        const sortOrder = searchParams.get("sortOrder") ?? "desc";
        const page = Number(searchParams.get("page") ?? "1");
        const limit = Number(searchParams.get("limit") ?? "10");

        const filter: Record<string, unknown> = {
            userId: user.userId,
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