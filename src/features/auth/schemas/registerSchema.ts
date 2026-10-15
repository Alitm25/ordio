import {z} from "zod";
import { emailField } from "@/features/auth/schemas/emailField";

export const registerSchema = z.object({
    email: emailField('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

export type RegisterFormData = z.infer<typeof registerSchema>
