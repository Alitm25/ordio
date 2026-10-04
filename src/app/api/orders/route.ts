import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Product from "@/models/Product";
import { handleApiError } from "@/lib/apiError";

export async function POST(req: Request) {
    try {
        await connectDB();

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

        // Check the items with productId
        const trackedItems = processedItems.filter(
            (item) => item.productId
        );

        // Check for each item products stock
        for (const item of trackedItems) {
            const product = await Product.findOne({
                _id: item.productId,
                userId: user.userId,
                stock: { $ne: null },
            });

            if (product && product.stock < item.quantity) {
                return Response.json(
                    {
                        message: `Insufficient stock for "${item.productName}". Available: ${product.stock}`,
                    },
                    { status: 400 }
                );
            }
        }

        // Atomic conditional decrement
        const successfulDecrements: { productId: string; quantity: number }[] = [];

        for (const item of trackedItems) {
            const result = await Product.findOneAndUpdate(
                {
                    _id: item.productId,
                    userId: user.userId,
                    stock: { $ne: null, $gte: item.quantity },
                },
                { $inc: { stock: -item.quantity } },
            );

            if (!result) {
                // if this item fails => get the items stock information again
                const product = await Product.findById(item.productId);
                const available = product?.stock ?? 0;

                // abort the previous items stock
                for (const prev of successfulDecrements) {
                    await Product.findByIdAndUpdate(prev.productId, {
                        $inc: { stock: prev.quantity },
                    });
                }

                return Response.json(
                    {
                        message: `Insufficient stock for "${item.productName}". Available: ${available}`,
                    },
                    { status: 400 }
                );
            }

            // if all checks were ok, add the items
            successfulDecrements.push({
                productId: item.productId!,
                quantity: item.quantity,
            });
        }

        // create the order after all checks done
        let order;

        order = await Order.create({
            customerName,
            customerPhone,
            customerId: customerId ?? null,
            items: processedItems,
            totalAmount,
            paymentStatus,
            paymentMethod,
            userId: user.userId,
        }).catch(async (createError) => {
            // Order.create failed — restore all deducted stock
            for (const prev of successfulDecrements) {
                await Product.findByIdAndUpdate(prev.productId, {
                    $inc: { stock: prev.quantity },
                });
            }
            throw createError;
        });

        return Response.json(
            { message: "Order created successfully", order },
            { status: 201 }
        );
    } catch (error) {
        return handleApiError(error);
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
        return handleApiError(error);
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
        return handleApiError(error);
    }
}