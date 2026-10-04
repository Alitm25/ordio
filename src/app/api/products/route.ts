import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Product from "@/models/Product";
import { handleApiError } from "@/lib/apiError";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

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

        await connectDB();

        const user = await getCurrentUser();

        const { name, price, description, stock } = await req.json();

        if (!name || !price) {
            return Response.json(
                { message: 'Name and price are required' },
                { status: 400 }
            )
        }

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