import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

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

export async function GET(req: Request) {
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
        };

        if (status !== "all") {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { customerName: { $regex: search, $options: "i" } },
                { productName: { $regex: search, $options: "i" } },
            ];
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const [orders, totalCount] = await Promise.all([
            Order.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit),
            Order.countDocuments(filter),
        ]);

        return Response.json({
            orders,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            page,
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

export async function DELETE(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        const { ids } = await req.json();

        if (!Array.isArray(ids) || ids.length === 0) {
            return Response.json(
                { message: "No order ids provided" },
                { status: 400 }
            );
        }

        const result = await Order.deleteMany({
            _id: { $in: ids },
            userId: user.userId,
        });

        return Response.json({
            message: "Orders deleted successfully",
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        return Response.json(
            {
                message: "Server error",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}