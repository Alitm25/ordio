import { z } from "zod";

export const createOrderSchema = z.object({
    customerName: z.string().min(2, "Customer name is required"),
    customerPhone: z.string().min(11, "Phone number is invalid"),
    productName: z.string().min(2, "Product name is required"),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    price: z.number().min(1, "Price must be greater than 0"),
    paymentStatus: z.enum(["unpaid", "paid", "partial"]),
    paymentMethod: z.enum(["cash", "card", "transfer"]).optional(),
    customerId: z.string().optional(),
});

export type CreateOrderFormValues = z.infer<typeof createOrderSchema>;