import {z} from "zod";
import { emailField } from "@/features/auth/schemas/emailField";

export const changeEmailSchema = z.object({
    newEmail: emailField("Invalid email format"),
    currentPassword: z.string().min(1, 'Password is required'),
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

