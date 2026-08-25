import { z } from "zod";

export const orderItemSchema = z.object({
    productId: z.string().optional(),
    productName: z.string().min(2, "Product name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(0, "Price must be 0 or greater"),
});

export const createOrderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(11, "Phone number is invalid"),
    customerId: z.string().optional(),
    items: z.array(orderItemSchema).min(1, "Order must have at least one item"),
    paymentStatus: z.enum(["unpaid", "paid", "partial"]),
    paymentMethod: z.enum(["cash", "card", "transfer"]).optional(),
});

export type OrderItemFormValues = z.infer<typeof orderItemSchema>;
export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;