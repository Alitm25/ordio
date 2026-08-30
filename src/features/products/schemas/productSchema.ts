import { z } from "zod";

export const productSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    price: z.number().min(0, "Price must be 0 or greater"),
    description: z.string().optional(),
    stock: z.number().min(0, "Stock must be 0 or greater").nullable().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;