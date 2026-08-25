import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: `${process.cwd()}/.env.local` });


const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env");
}

// تعریف schema قدیمی برای خوندن دیتای فعلی
const OldOrderSchema = new mongoose.Schema({}, { strict: false });
const OldOrder = mongoose.model("Order", OldOrderSchema);

async function migrate() {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const orders = await OldOrder.find({});
    console.log(`📦 Found ${orders.length} orders to migrate`);

    let migrated = 0;
    let skipped = 0;

    for (const order of orders) {
        const orderObj = order.toObject();

        // اگه قبلاً migrate شده (items داره)، skip کن
        if (orderObj.items && Array.isArray(orderObj.items)) {
            skipped++;
            continue;
        }

        // اگه productName نداره، skip کن
        if (!orderObj.productName) {
            skipped++;
            continue;
        }

        const quantity = orderObj.quantity ?? 1;
        const price = orderObj.price ?? 0;
        const subtotal = quantity * price;

        await OldOrder.updateOne(
            { _id: orderObj._id },
            {
                $set: {
                    items: [
                        {
                            productName: orderObj.productName,
                            quantity,
                            price,
                            subtotal,
                            productId: orderObj.productId ?? null,
                        },
                    ],
                    totalAmount: subtotal,
                },
                $unset: {
                    productName: "",
                    quantity: "",
                    price: "",
                },
            }
        );

        migrated++;
    }

    console.log(`✅ Migrated: ${migrated} orders`);
    console.log(`⏭️  Skipped: ${skipped} orders (already migrated or invalid)`);

    await mongoose.disconnect();
    console.log("✅ Done!");
}

migrate().catch((error) => {
    console.error("❌ Migration failed:", error);
    process.exit(1);
});