import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { customerSchema } from "@/features/customers/schemas/customerSchema";

export async function GET() {
    try {
        const user = await getCurrentUser();
        await connectDB();

        const customers = await Customer.find({
            userId: user.userId,
        }).sort({ name: 1 });

        return Response.json({customers});
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        await connectDB();

        const { name, phone, notes } = validate(customerSchema, await req.json());

        const customer = await Customer.create({
            name,
            phone,
            notes,
            userId: user.userId,
        });

        return Response.json(
            { message: 'Customer Created Successfully', customer },
            { status: 201 }
        )
    } catch (error) {
        return handleApiError(error);
    }
}