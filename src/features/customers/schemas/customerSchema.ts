import {z} from "zod";

export const customerSchema = z.object({
    name: z.string().min(2, "Customer name is required"),
    phone: z.string().min(11, "Phone number must be at least 11 digits").max(11, 'Phone number must be exactly 11 digits'),
    notes: z.string().optional()
})

export type CustomerFormValues = z.infer<typeof customerSchema>