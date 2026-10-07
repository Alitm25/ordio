import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { ApiError, handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { productSchema } from "@/features/products/schemas/productSchema";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;
        // partial(): every field is optional, but any field that IS sent must follow the rules
        const data = validate(productSchema.partial(), await req.json());

        const product = await Product.findOne({
            _id: id,
            userId: user.userId,
        });

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // only the validated fields are copied onto the product
        product.set(data);

        await product.save();

        return Response.json({
            message: "Product updated successfully",
            product,
        });
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

        const deleted = await Product.findOneAndDelete({
            _id: id,
            userId: user.userId,
        });

        if (!deleted) {
            return Response.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        return Response.json({
            message: "Product deleted successfully",
        });
    } catch (error) {
        return handleApiError(error);
    }
}