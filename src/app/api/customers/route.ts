import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        const customers = await Customer.find({
            userId: user.userId,
        }).sort({ name: 1 });

        return Response.json({customers});
    } catch (error) {
        return Response.json(
            { message: "Unauthorized", error },
            { status: 401 }
        );
    }
}