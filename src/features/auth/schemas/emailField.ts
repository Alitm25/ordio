import { z } from "zod";

// One rule for every email the app accepts (login, register, change email):
// clean it first, then check the format.  " Ali@Example.COM " -> "ali@example.com"
// Without this, "Ali@x.com" and "ali@x.com" could become two different accounts.
export const emailField = (message: string) =>
    z.string().trim().toLowerCase().pipe(z.email(message));
