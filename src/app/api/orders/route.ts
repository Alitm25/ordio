import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function POST(req: Request) {
    const connection = await connectDB();
    const session = await mongoose.startSession();

    try {
        const user = await getCurrentUser();
        const body = await req.json();

        const {
            customerName,
            customerPhone,
            customerId,
            items,
            paymentStatus,
            paymentMethod,
        } = body;

        // Check if data has any order or not
        if (!items || !Array.isArray(items) || items.length === 0) {
            return Response.json(
                { message: "Order must have at least one item" },
                { status: 400 }
            );
        }

        // Declaration of each Order
        const processedItems = items.map((item: {
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

        // Calculating total amount of items
        const totalAmount = processedItems.reduce(
            (sum, item) => sum + item.subtotal,
            0
        );

        let order;

        await session.withTransaction(async () => {
            // Checking each item stock before any changes
            const itemsWithProduct = processedItems.filter(
                (item) => item.productId
            );

            for (const item of itemsWithProduct) {
                const product = await Product.findOne({
                    _id: item.productId,
                    userId: user.userId,
                    stock: { $ne: null },
                }).session(session);

                if (product && product.stock < item.quantity) {
                    throw new Error(
                        `INSUFFICIENT_STOCK:${item.productName}:${product.stock}`
                    );
                }
            }

            // Creating the order after checking each item stock
            const created = await Order.create(
                [
                    {
                        customerName,
                        customerPhone,
                        customerId: customerId ?? null,
                        items: processedItems,
                        totalAmount,
                        paymentStatus,
                        paymentMethod,
                        userId: user.userId,
                    },
                ],
                { session }
            );

            order = created[0];

            // Deduction of all items stock after checking
            for (const item of itemsWithProduct) {
                await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        userId: user.userId,
                        stock: { $ne: null },
                    },
                    { $inc: { stock: -item.quantity } },
                    { session }
                );
            }
        });

        return Response.json(
            { message: "Order created successfully", order },
            { status: 201 }
        );
    } catch (error) {
        // Insufficient inventory error
        if (
            error instanceof Error &&
            error.message.startsWith("INSUFFICIENT_STOCK:")
        ) {
            const [, productName, currentStock] = error.message.split(":");
            return Response.json(
                {
                    message: `Insufficient stock for "${productName}". Available: ${currentStock}`,
                },
                { status: 400 }
            );
        }

        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    } finally {
        session.endSession();
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
                { "items.productName": { $regex: search, $options: "i" } },
            ];
        }

        const sort: Record<string, 1 | -1> = {
            [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

        const [orders, totalCount] = await Promise.all([
            Order.find(filter)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .populate("customerId", "name phone"),
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
            { message: "Unauthorized", error },
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
            { message: "Server error", error },
            { status: 500 }
        );
    }
}