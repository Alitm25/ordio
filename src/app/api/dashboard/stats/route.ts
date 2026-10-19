import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { getCurrentUser } from "@/lib/getCurrentUser";
import Product from "@/models/Product";
import { handleApiError } from "@/lib/apiError";
import { validate } from "@/lib/validate";
import { addDays, dayKey, startOfDay } from "@/lib/businessTime";
import { DashboardRange, dashboardQuerySchema } from "@/features/dashboard/schemas/dashboardRange";

const RANGE_DAYS: Record<Exclude<DashboardRange, "this_month">, number> = { "7d": 7, "30d": 30, "90d": 90 };

// The calendar days a range covers, in the shop's time zone, oldest first, ending today.
// "this_month" = from the 1st of this month until today. The KPI cards AND the chart both use this list.
function getRangeDays(range: DashboardRange): string[] {
    const today = dayKey(new Date());
    const firstDay = range === "this_month"
        ? `${today.slice(0, 8)}01`
        : addDays(today, -(RANGE_DAYS[range] - 1));

    const days: string[] = [];
    for (let day = firstDay; day <= today; day = addDays(day, 1)) {
        days.push(day);
    }
    return days;
}

export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();
        await connectDB();

        // Only known ranges are accepted ("banana" -> 400 instead of silently meaning "this month")
        const { searchParams } = new URL(req.url);
        const { range } = validate(dashboardQuerySchema, Object.fromEntries(searchParams));

        const days = getRangeDays(range);
        // the moment the first day of the range begins in the shop's time zone
        const start = startOfDay(days[0]);

        // Declare each stats variables with finding the exact order with given filters
        const [ rangeOrders, recentOrders, pendingCount, processingCount, completedCount, cancelledCount, lowStockProducts ] = await Promise.all([
            Order.find({
                userId: user.userId,
                createdAt: { $gte: start },
            }),
            Order.find({ userId: user.userId }).sort({ createdAt: -1 }).limit(5),
            Order.countDocuments({ userId: user.userId, status: "pending" }),
            Order.countDocuments({ userId: user.userId, status: "processing" }),
            Order.countDocuments({ userId: user.userId, status: "completed" }),
            Order.countDocuments({ userId: user.userId, status: 'cancelled' }),
            Product.find({ userId: user.userId, stock: { $ne: null, $lte: 5 }  }).select("name stock")
        ]);

        // Render complete orders
        const completedInRange = rangeOrders.filter(
            (order) => order.status === "completed"
        );

        const totalOrdersInRange = rangeOrders.length;

        // Render total revenue of all orders
        const totalRevenueInRange = completedInRange.reduce(
            (sum, order) => sum + order.totalAmount,
            0
        );

        // Calculate average order values
        const averageOrderValue = completedInRange.length > 0 ? totalRevenueInRange / completedInRange.length : 0;

        // One bucket per day of the range (days without orders stay at 0)
        const trendMap = new Map<string, { orders: number; revenue: number }>(
            days.map((day) => [day, { orders: 0, revenue: 0 }])
        );

        for (const order of rangeOrders) {
            // the shop's calendar day, NOT toISOString() (UTC would move late-night orders to the day before)
            const entry = trendMap.get(dayKey(order.createdAt));

            if (entry) {
                entry.orders += 1;
                if (order.status === "completed") {
                    entry.revenue += order.totalAmount;
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
            lowStockProducts
        });
    } catch (error) {
        return handleApiError(error);
    }
}