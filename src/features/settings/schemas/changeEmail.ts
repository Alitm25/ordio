import {z} from "zod";

export const changeEmailSchema = z.object({
    newEmail: z.email("Invalid email format"),
    currentPassword: z.string().min(1, 'Password is required'),
})

export type ChangeEmailFormValues = z.infer<typeof changeEmailSchema>;

