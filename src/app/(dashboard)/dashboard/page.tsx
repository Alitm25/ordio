"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/features/dashboard/services/getDashboardStats";
import StatsCard from "@/components/dashboard/StatsCard";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error || !data) {
        return <div>Error loading dashboard</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>

                <Link href="/orders">
                    <Button className="cursor-pointer">+ New Order</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Orders This Month"
                    value={data.totalOrdersThisMonth}
                />
                <StatsCard
                    title="Revenue This Month"
                    value={data.totalRevenueThisMonth}
                />
                <StatsCard title="Pending Orders" value={data.pendingOrders} />
                <StatsCard
                    title="Avg. Order Value"
                    value={Math.round(data.averageOrderValue)}
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Last 7 Days</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data.trend}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                />
                                <YAxis />
                                <Tooltip
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString()
                                    }
                                />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <OrderStatusBadge status="pending" />
                            <span className="font-medium">
                                {data.statusBreakdown.pending}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <OrderStatusBadge status="processing" />
                            <span className="font-medium">
                                {data.statusBreakdown.processing}
                            </span>
                        </div>

                        <div className="flex items-center justify-between">
                            <OrderStatusBadge status="completed" />
                            <span className="font-medium">
                                {data.statusBreakdown.completed}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                    {data.recentOrders.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No orders yet.
                        </p>
                    )}

                    {data.recentOrders.map((order) => (
                        <div
                            key={order._id}
                            className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                        >
                            <div>
                                <p className="font-medium">{order.customerName}</p>
                                <p className="text-sm text-muted-foreground">
                                    {order.productName}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <OrderStatusBadge status={order.status} />
                                <span className="font-medium">
                                    {order.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2">
                        <Link
                            href="/orders"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            View all orders →
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}