import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Product from "@/models/Product";
import { ApiError, handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { bulkDeleteOrdersSchema, createOrderSchema, ordersQuerySchema } from "@/features/orders/schemas/createOrderSchema";

// Turn every regex special character into a literal one: "a(b" -> "a\(b"
function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        // Same rules as the create-order form: at least one item, quantity is a whole number ≥ 1, etc.
        const {
            customerName,
            customerPhone,
            customerId,
            items,
            paymentStatus,
            paymentMethod,
        } = validate(createOrderSchema, await req.json());

        // Declaration of each Order
        const processedItems = items.map((item) => ({
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
                // nothing was taken yet, so we can stop right away
                throw new ApiError(400, `Insufficient stock for "${item.productName}". Available: ${product.stock}`);
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

                // throw only AFTER the stock above was given back (code after a throw never runs)
                throw new ApiError(400, `Insufficient stock for "${item.productName}". Available: ${available}`);
            }

            // if all checks were ok, add the items
            successfulDecrements.push({
                productId: item.productId!,
                quantity: item.quantity,
            });
        }

        // create the order after all checks done
        const order = await Order.create({
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
        const user = await getCurrentUser();
        await connectDB();
        const { searchParams } = new URL(req.url);

        // sortBy can only be a real field, limit is between 1 and 100, page is a whole number ≥ 1...
        const { search, status, sortBy, sortOrder, page, limit } = validate(
            ordersQuerySchema,
            Object.fromEntries(searchParams)
        );

        const filter: Record<string, unknown> = {
            userId: user.userId,
        };

        if (status !== "all") {
            filter.status = status;
        }

        if (search) {
            // Escape regex symbols so "(" or ".*" are searched as plain text, not as regex commands
            const safeSearch = escapeRegex(search);

            filter.$or = [
                { customerName: { $regex: safeSearch, $options: "i" } },
                { "items.productName": { $regex: safeSearch, $options: "i" } },
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
        const user = await getCurrentUser();
        await connectDB();
        const { ids } = validate(bulkDeleteOrdersSchema, await req.json());

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