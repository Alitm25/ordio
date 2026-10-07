import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { registerSchema } from "@/features/auth/schemas/registerSchema";

export async function POST(req: Request) {
    try {
        // connecting to DataBase
        await connectDB();

        // getting data from request (checked with the same schema as the register form)
        const { email, password } = validate(registerSchema, await req.json());

        // check that the user not existed before
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return Response.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        // hashing password
        const hashedPassword = await bcrypt.hash(password, 10);

        // creating user
        const user = await User.create({
            email,
            password: hashedPassword,
        });

        // response
        return Response.json(
            {
                message: "User created successfully",
                user: {
                    id: user._id,
                    email: user.email,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        return handleApiError(error);
    }
}