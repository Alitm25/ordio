import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";

//  a getDataRange function in order to show the stats based on the various period of times
function getDateRange(range: string):{ start: Date, end: Date } {
    // declare today and end of the date variables
    const now = new Date();
    const end = new Date(now)
    let start :Date;

    // Initialize the 'range' param to start date and calculate end of the time range
    switch (range) {
        case "7d":
            start = new Date(now);
            start.setDate(start.getDate() - 6);
            start.setHours(0, 0, 0, 0);
            break;
        case "30d":
            start = new Date(now);
            start.setDate(start.getDate() - 29);
            start.setHours(0, 0, 0, 0);
            break;
        case "90d":
            start = new Date(now);
            start.setDate(start.getDate() - 89);
            start.setHours(0, 0, 0, 0);
            break;
        case "this_month":
        default:
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
    }

    return { start, end };
}

// Declare a function for changing 'range' param to Days
function getTrendDays(range: string): number {
    switch (range) {
        case "7d": return 7;
        case "30d": return 30;
        case "90d": return 90;
        default: return 30;
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const user = await getCurrentUser();

        // Get the range param from URL
        const { searchParams } = new URL(req.url);
        const range = searchParams.get("range") ?? "this_month";

        // Get the range time and change it to days
        const { start, end } = getDateRange(range);
        const trendDays = getTrendDays(range);

        // set the Start day and End day
        const trendStart = new Date(end);
        trendStart.setDate(trendStart.getDate() - (trendDays - 1));
        trendStart.setHours(0, 0, 0, 0);

        // Declare each stats variables with finding the exact order with given filters
        const [ rangeOrders, trendOrders, recentOrders, pendingCount, processingCount, completedCount, cancelledCount ] = await Promise.all([
            Order.find({
                userId: user.userId,
                createdAt: { $gte: start, $lte: end },
            }),
            Order.find({
                userId: user.userId,
                createdAt: { $gte: trendStart, $lte: end },
            }),
            Order.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(5),
            Order.countDocuments({ userId: user.userId, status: "pending" }),
            Order.countDocuments({ userId: user.userId, status: "processing" }),
            Order.countDocuments({ userId: user.userId, status: "completed" }),
            Order.countDocuments({ userId: user.userId, status: 'cancelled' })
        ]);

        const completedInRange = rangeOrders.filter(
            (order) => order.status === "completed"
        );

        const totalOrdersInRange = rangeOrders.length;

        const totalRevenueInRange = completedInRange.reduce(
            (sum, order) => sum + order.totalAmount,
            0
        );

        const averageOrderValue = completedInRange.length > 0 ? totalRevenueInRange / completedInRange.length : 0;

        const trendMap = new Map<string, { orders: number; revenue: number }>();

        for (let i = 0; i < trendDays; i++) {
            const d = new Date(trendStart);
            d.setDate(d.getDate() + i);
            trendMap.set(d.toISOString().split("T")[0], {
                orders: 0,
                revenue: 0,
            });
        }

        for (const order of trendOrders) {
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
            totalOrdersInRange,
            totalRevenueInRange,
            pendingOrders: pendingCount,
            averageOrderValue,
            trend,
            recentOrders,
            statusBreakdown: {
                pending: pendingCount,
                processing: processingCount,
                completed: completedCount,
                cancelled: cancelledCount,
            },
            range,
        });
    } catch (error) {
        return Response.json(
            { message: "Server error", error },
            { status: 401 }
        );
    }
}