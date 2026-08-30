import { connectDB } from "@/lib/db";
import Product from "@/models/Product";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const user = await getCurrentUser();
        const { id } = await params;
        const { name, price, description, stock } = await req.json();

        const product = await Product.findOne({
            _id: id,
            userId: user.userId,
        });

        if (!product) {
            return Response.json(
                { message: "Product not found" },
                { status: 404 }
            );
        }

        if (name !== undefined) product.name = name;
        if (price !== undefined) product.price = price;
        if (description !== undefined) product.description = description;
        if (stock !== undefined) product.stock = stock;

        await product.save();

        return Response.json({
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
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
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}