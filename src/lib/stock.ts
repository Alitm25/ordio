import Product from "@/models/Product";
import { ApiError } from "@/lib/apiError";

// One product's total quantity inside an order
export interface StockLine {
    productId: string;
    productName: string;
    quantity: number;
}

interface OrderItemLike {
    productId?: unknown;
    productName: string;
    quantity: number;
}

// Active orders hold their items' stock; a canceled order has given it back
export const holdsStock = (status: string) => status !== "cancelled";

// One line per catalog product. The same product twice in an order becomes one bigger line,
// so "6 + 6 cakes" is checked as 12, not as two separate 6s. Hand-typed items (no productId) are skipped.
export function toStockLines(items: OrderItemLike[]): StockLine[] {
    const lines = new Map<string, StockLine>();

    for (const item of items) {
        if (!item.productId) continue;

        const productId = String(item.productId);
        const line = lines.get(productId);

        if (line) {
            line.quantity += item.quantity;
        } else {
            lines.set(productId, { productId, productName: item.productName, quantity: item.quantity });
        }
    }

    return [...lines.values()];
}

// Only the difference between before and after: positive = take more, negative = give back
export function diffStockLines(before: StockLine[], after: StockLine[]) {
    const change = new Map<string, StockLine>();

    for (const line of after) {
        change.set(line.productId, { ...line });
    }
    for (const line of before) {
        const current = change.get(line.productId);
        if (current) {
            current.quantity -= line.quantity;
        } else {
            change.set(line.productId, { ...line, quantity: -line.quantity });
        }
    }

    const take: StockLine[] = [];
    const give: StockLine[] = [];
    for (const line of change.values()) {
        if (line.quantity > 0) take.push(line);
        if (line.quantity < 0) give.push({ ...line, quantity: -line.quantity });
    }

    return { take, give };
}

// Give stock back. Products without stock tracking (stock: null) or deleted products are left alone.
export async function giveStock(userId: string, lines: StockLine[]) {
    for (const line of lines) {
        await Product.updateOne(
            { _id: line.productId, userId, stock: { $ne: null } },
            { $inc: { stock: line.quantity } }
        );
    }
}

// Take stock for every line: all or nothing. Returns the lines that were really taken
// (untracked and deleted products are skipped), so a later failure can give exactly those back.
export async function takeStock(userId: string, lines: StockLine[]): Promise<StockLine[]> {
    const taken: StockLine[] = [];

    try {
        for (const line of lines) {
            // Atomic: "subtract only if there is enough". Two orders at the same moment can't go below 0.
            const updated = await Product.findOneAndUpdate(
                { _id: line.productId, userId, stock: { $ne: null, $gte: line.quantity } },
                { $inc: { stock: -line.quantity } }
            );

            if (updated) {
                taken.push(line);
                continue;
            }

            // Nothing was subtracted. Find out why:
            const product = await Product.findOne({ _id: line.productId, userId }).select("stock");

            // deleted product, or stock tracking turned off -> nothing to count, that's fine
            if (!product || product.stock === null) continue;

            // tracked, but not enough
            throw new ApiError(400, `Insufficient stock for "${line.productName}". Available: ${product.stock}`);
        }
    } catch (error) {
        // Any failure (not enough stock, a DB error...) -> undo what THIS call already took
        await giveStock(userId, taken);
        throw error;
    }

    return taken;
}
