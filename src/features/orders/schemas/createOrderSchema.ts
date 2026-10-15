import { z } from "zod";

// Allowed values, shared by the Zod schemas, the Mongoose model and the UI
export const ORDER_STATUSES = ["pending", "processing", "completed", "cancelled"] as const;
export const PAYMENT_STATUSES = ["unpaid", "paid", "partial"] as const;
export const PAYMENT_METHODS = ["cash", "card", "transfer"] as const;
export const ORDER_SORT_FIELDS = ["createdAt", "totalAmount"] as const;

export type OrderSortField = (typeof ORDER_SORT_FIELDS)[number];

// A MongoDB id: 24 hex characters. Checked up front so a bad id can't fail halfway through a stock update.
const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const orderItemSchema = z.object({
    productId: objectId.optional(),
    productName: z.string().min(2, "Product name is required"),
    quantity: z.number().int().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be 0 or greater"),
});

export const createOrderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(11, "Phone number is invalid"),
    customerId: objectId.optional(),
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    paymentStatus: z.enum(PAYMENT_STATUSES),
    // unpaid orders are stored with paymentMethod: null
    paymentMethod: z.enum(PAYMENT_METHODS).nullable().optional(),
});

// Editing: every field is optional, and the status can change too
export const updateOrderSchema = createOrderSchema.partial().extend({
    status: z.enum(ORDER_STATUSES).optional(),
});

// Query string of GET /api/orders (every value arrives as text, so numbers are coerced)
export const ordersQuerySchema = z.object({
    search: z.string().trim().max(100).default(""),
    status: z.enum([...ORDER_STATUSES, "all"]).default("all"),
    sortBy: z.enum(ORDER_SORT_FIELDS).default("createdAt"),
    sortOrder: z.enum(["asc", "desc"]).default("desc"),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const bulkDeleteOrdersSchema = z.object({
    ids: z.array(objectId).min(1, "No order ids provided").max(100),
});

export type OrderItemFormValues = z.infer<typeof orderItemSchema>;
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;
export type UpdateOrderValues = z.infer<typeof updateOrderSchema>;
