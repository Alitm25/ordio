import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";
import { handleApiError } from "@/lib/apiError";

export async function PATCH(
    req: Request,
    { params } : { params: Promise<{id: String}> }
) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;
        const { name, phone, notes } = await req.json();

        const customer = await Customer.findOne({
            _id: id,
            userId: user.userId
        });

        if (!customer) {
            return Response.json(
                { message: "Customer not found" },
                { status: 404 }
            );
        }

        if (name !== undefined) customer.name = name;
        if (phone !== undefined) customer.phone = phone;
        if (notes !== undefined) customer.notes = notes;

        await customer.save();

        return Response.json({
                message: "Customer updated successfully",
                customer,
            },
        )

    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;

        const deleted = await Customer.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!deleted) {
            return Response.json(
                { message: "Customer not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Customer deleted successfully",
        });
    } catch (error) {
        return handleApiError(error);
    }
}
