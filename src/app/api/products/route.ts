import {connectDB} from "@/lib/db";
import {getCurrentUser} from "@/lib/getCurrentUser";
import Product from "@/models/Product";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        const products = await Product.find({ userId: user.userId }).sort({
            createdAt: -1,
        })

        return Response.json({ products });
    } catch (error) {
        return Response.json(
            { message: "Unauthorized", error },
            { status: 401 }
        );
    }
}

export async function POST(req: Request) {
    try {

        await connectDB();

        const user = await getCurrentUser();

        const { name, price, description } = await req.json();

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
            userId: user.userId,
        });

        return Response.json(
            { message: "Product created successfully", product },
            { status: 201 }
        );

    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 500 }
        );
    }
}