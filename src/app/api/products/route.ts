import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Product from "@/models/Product";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { productSchema } from "@/features/products/schemas/productSchema";

export async function GET() {
    try {
        const user = await getCurrentUser();
        await connectDB();

        const products = await Product.find({ userId: user.userId }).sort({
            createdAt: -1,
        })

        return Response.json({ products });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(req: Request) {
    try {

        const user = await getCurrentUser();
        await connectDB();

        // price: 0 is allowed now (the old `!price` check treated 0 as "missing")
        const { name, price, description, stock } = validate(productSchema, await req.json());

        const product = await Product.create({
            name,
            price,
            description,
            stock: stock ?? null,
            userId: user.userId,
        });

        return Response.json(
            { message: "Product created successfully", product },
            { status: 201 }
        );

    } catch (error) {
        return handleApiError(error);
    }
}