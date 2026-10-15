import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { ApiError, handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { updateOrderSchema } from "@/features/orders/schemas/createOrderSchema";
import { diffStockLines, giveStock, holdsStock, takeStock, toStockLines } from "@/lib/stock";

export async function GET( _req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        const { id } = await params;

        const order = await Order.findOne({
            _id: id,
            userId: user.userId,
        }).populate("customerId", "name phone");

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        return Response.json({ order });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH( req: Request, { params }: { params: Promise<{ id: string }> } ) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        const { id } = await params;
        // Only known fields with valid values survive (e.g. status: "flying" is rejected here)
        const { items, ...fields } = validate(updateOrderSchema, await req.json());

        const order = await Order.findOne({
            _id: id,
            userId: user.userId,
        });

        if (!order) {
            throw new ApiError(404, "Order not found");
        }

        // What this order holds in stock BEFORE the edit (read it before changing the status!)
        const stockBefore = holdsStock(order.status) ? toStockLines(order.items) : [];

        // Copy the validated simple fields (customer info, status, payment...)
        order.set(fields);

        // New items: recalculate subtotals and the total on the server (never trust the client's math)
        if (items) {
            order.items = items.map((item) => ({
                productId: item.productId ?? null,
                productName: item.productName,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.quantity * item.price,
            }));
            order.totalAmount = order.items.reduce(
                (sum: number, item: { subtotal: number }) => sum + item.subtotal, 0
            );
        }

        // Catch schema problems BEFORE touching any stock
        await order.validate();

        // What it should hold AFTER (a cancelled order holds nothing). Only the difference is applied:
        // 3 -> 5 cakes takes 2 more; cancelling gives everything back; un-cancelling takes it again.
        const stockAfter = holdsStock(order.status) ? toStockLines(order.items) : [];
        const { take, give } = diffStockLines(stockBefore, stockAfter);

        // 1. take (all or nothing, may answer 400 "Insufficient stock" with nothing changed)
        const taken = await takeStock(user.userId, take);

        // 2. save the order; if that fails, give back what step 1 took
        try {
            await order.save();
        } catch (error) {
            await giveStock(user.userId, taken);
            throw error;
        }

        // 3. only now give stock back (if we gave it earlier and the save failed, it would be "double stock")
        await giveStock(user.userId, give);

        return Response.json({
            message: "Order updated successfully",
            order,
        });
    } catch (error) {
        return handleApiError(error);
    }
}
export async function DELETE( _req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        const { id } = await params;

        const deletedOrder = await Order.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!deletedOrder) {
            throw new ApiError(404, "Order not found");
        }

        // An active order gives its stock back (a cancelled one already did when it was cancelled)
        if (holdsStock(deletedOrder.status)) {
            await giveStock(user.userId, toStockLines(deletedOrder.items));
        }

        return Response.json({
            message: "Order deleted successfully",
        });
    } catch (error) {
        return handleApiError(error);
    }
}