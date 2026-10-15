import {z} from "zod";
import { emailField } from "@/features/auth/schemas/emailField";

export const loginSchema = z.object({
        email: emailField('Invalid email'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>