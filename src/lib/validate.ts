import { z } from "zod";
import { ApiError } from "@/lib/apiError";

// Check untrusted data against a Zod schema; throw a 400 if it doesn't match
export function validate<T extends z.ZodType>(schema: T, data: unknown): z.output<T> {
    const result = schema.safeParse(data);

    if (!result.success) {
        throw new ApiError(400, result.error.issues[0]?.message ?? "Invalid data");
    }

    return result.data;
}
