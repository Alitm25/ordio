import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";
import { handleApiError } from "@/lib/apiError";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

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
        await connectDB();

        const user = await getCurrentUser();

        const { name, phone, notes } = await req.json();

        if (!name || !phone) {
            return Response.json(
                { message: 'Name and Phone are required' },
                { status: 400 }
            );
        }

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