import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Product from "@/models/Product";

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

export async function PATCH( req: Request, { params }: { params: Promise<{ id: string }> } ) {
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

        // Fields that can be edited
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

        // Get each item of the order that is going to be edited
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

            // Old items (with productId)
            const oldTrackedItems = order.items.filter(
                (item: any) => item.productId
            );

            // New items (with prodcutId)
            const newTrackedItems = processedItems.filter(
                (item : {
                    productId?: string;
                    productName: string;
                    quantity: number;
                    price: number;
                }) => item.productId
            );

            // Restore the old items stock
            for (const oldItem of oldTrackedItems) {
                await Product.findOneAndUpdate(
                    {
                        _id: oldItem.productId,
                        userId: user.userId,
                        stock: { $ne: null },
                    },
                    { $inc: { stock: oldItem.quantity } }
                );
            }

            // Checking new items stock
            for (const newItem of newTrackedItems) {
                const product = await Product.findOne({
                    _id: newItem.productId,
                    userId: user.userId,
                    stock: { $ne: null },
                });
                // Abort the old items stock restoring to the old one if the process fails
                if (product && product.stock < newItem.quantity) {
                    for (const oldItem of oldTrackedItems) {
                        await Product.findOneAndUpdate(
                            {
                                _id: oldItem.productId,
                                userId: user.userId,
                                stock: { $ne: null },
                            },
                            { $inc: { stock: -oldItem.quantity } }
                        );
                    }

                    return Response.json(
                        {
                            message: `Insufficient stock for "${newItem.productName}". Available: ${product.stock}`,
                        },
                        { status: 400 }
                    );
                }
            }

            // Atomic decrement for new items after pass
            const successfulDecrements: {
                productId: string;
                quantity: number;
            }[] = [];

            for (const newItem of newTrackedItems) {
                const result = await Product.findOneAndUpdate(
                    {
                        _id: newItem.productId,
                        userId: user.userId,
                        stock: { $ne: null, $gte: newItem.quantity },
                    },
                    { $inc: { stock: -newItem.quantity } },
                );

                if (!result) {
                    const product = await Product.findById(newItem.productId);
                    const available = product?.stock ?? 0;

                    // Compensating for successful deductions
                    for (const prev of successfulDecrements) {
                        await Product.findByIdAndUpdate(prev.productId, {
                            $inc: { stock: prev.quantity },
                        });
                    }

                    // Decrement the old items stock again after pass
                    for (const oldItem of oldTrackedItems) {
                        await Product.findOneAndUpdate(
                            {
                                _id: oldItem.productId,
                                userId: user.userId,
                                stock: { $ne: null },
                            },
                            { $inc: { stock: -oldItem.quantity } }
                        );
                    }

                    return Response.json(
                        { message: `Insufficient stock for "${newItem.productName}". Available: ${available}` },
                        { status: 400 }
                    );
                }

                successfulDecrements.push({
                    productId: newItem.productId!,
                    quantity: newItem.quantity,
                });
            }

            order.items = processedItems;
            order.totalAmount = processedItems.reduce(
                (sum: number, item: { subtotal: number }) => sum + item.subtotal, 0
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