import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Customer from "@/models/Customer";
import { ApiError, handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { customerSchema } from "@/features/customers/schemas/customerSchema";

export async function PATCH(
    req: Request,
    { params } : { params: Promise<{id: String}> }
) {
    try {
        const user = await getCurrentUser();
        await connectDB();
        const { id } = await params;
        const data = validate(customerSchema.partial(), await req.json());

        const customer = await Customer.findOne({
            _id: id,
            userId: user.userId
        });

        if (!customer) {
            throw new ApiError(404, "Customer not found");
        }

        customer.set(data);

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
        const user = await getCurrentUser();
        await connectDB();
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
