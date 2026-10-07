import { z } from "zod";

// What the API receives
export const changePasswordRequestSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
        .string()
        .min(6, "New password must be at least 6 characters"),
});

// What the form needs: the same fields + a confirmation that only lives in the browser
export const changePasswordSchema = changePasswordRequestSchema.extend({
        confirmPassword: z.string().min(1, "Please confirm your new password"),
    }).refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
});

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
