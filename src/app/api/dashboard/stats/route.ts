import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

export async function GET() {
    try {
        await connectDB();

        const user = await getCurrentUser();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const [
            monthOrders,
            weekOrders,
            recentOrders,
            pendingCount,
            processingCount,
            completedCount,
        ] = await Promise.all([
            Order.find({ userId: user.userId, createdAt: { $gte: startOfMonth } }),
            Order.find({ userId: user.userId, createdAt: { $gte: sevenDaysAgo } }),
            Order.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(5),
            Order.countDocuments({ userId: user.userId, status: "pending" }),
            Order.countDocuments({ userId: user.userId, status: "processing" }),
            Order.countDocuments({ userId: user.userId, status: "completed" }),
        ]);

        const totalOrdersThisMonth = monthOrders.length;

        const completedThisMonth = monthOrders.filter(
            (order) => order.status === "completed"
        );

        const totalRevenueThisMonth = completedThisMonth.reduce(
            (sum, order) => sum + order.price,
            0
        );

        const averageOrderValue =
            completedThisMonth.length > 0
                ? totalRevenueThisMonth / completedThisMonth.length
                : 0;

        const trendMap = new Map<string, { orders: number; revenue: number }>();

        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            trendMap.set(d.toISOString().split("T")[0], {
                orders: 0,
                revenue: 0,
            });
        }

        for (const order of weekOrders) {
            const key = new Date(order.createdAt).toISOString().split("T")[0];
            const entry = trendMap.get(key);

            if (entry) {
                entry.orders += 1;

                if (order.status === "completed") {
                    entry.revenue += order.price;
                }
            }
        }

        const trend = Array.from(trendMap.entries()).map(([date, value]) => ({
            date,
            ...value,
        }));

        return Response.json({
            totalOrdersThisMonth,
            totalRevenueThisMonth,
            pendingOrders: pendingCount,
            averageOrderValue,
            trend,
            recentOrders,
            statusBreakdown: {
                pending: pendingCount,
                processing: processingCount,
                completed: completedCount,
            },
        });
    } catch (error) {
        return Response.json(
            {
                message: "Server error",
                error: error instanceof Error ? error.message : String(error),
            },
            { status: 401 }
        );
    }
}