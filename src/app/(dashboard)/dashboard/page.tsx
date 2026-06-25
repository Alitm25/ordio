"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/features/dashboard/services/getDashboardStats";
import StatsCard from "@/components/dashboard/StatsCard";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Sector,
} from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {ShoppingCart, Wallet, Clock, TrendingUp, AlertCircle} from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

const STATUS_COLORS = {
    pending: "#f59e0b",
    processing: "#3b82f6",
    completed: "#10b981",
};

export default function DashboardPage() {
    // Dashboard API Fetch
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["dashboardStats"],
        queryFn: getDashboardStats,
    });

    // Loading return component
    if (isLoading) {
        return <DashboardSkeleton />
    }

    // Error return component
    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-24 text-center">
                <div className="rounded-full bg-destructive/10 p-3">
                    <AlertCircle className="h-6 w-6 text-destructive" />
                </div>

                <div>
                    <p className="font-medium">Couldn&apos;t load dashboard</p>
                    <p className="text-sm text-muted-foreground">
                        Something went wrong while fetching your stats.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => refetch()}
                >
                    Try again
                </Button>
            </div>
        );
    }

    // Status section variables
    const statusData = [
        { name: "Pending", value: data.statusBreakdown.pending, color: STATUS_COLORS.pending },
        { name: "Processing", value: data.statusBreakdown.processing, color: STATUS_COLORS.processing },
        { name: "Completed", value: data.statusBreakdown.completed, color: STATUS_COLORS.completed },
    ];

    const totalStatusOrders =
        data.statusBreakdown.pending +
        data.statusBreakdown.processing +
        data.statusBreakdown.completed;

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
                    icon={ShoppingCart}
                />
                <StatsCard
                    title="Revenue This Month"
                    value={data.totalRevenueThisMonth}
                    icon={Wallet}
                    iconClassName="bg-emerald-500/10 text-emerald-500"
                />
                <StatsCard
                    title="Pending Orders"
                    value={data.pendingOrders}
                    icon={Clock}
                    iconClassName="bg-amber-500/10 text-amber-500"
                />
                <StatsCard
                    title="Avg. Order Value"
                    value={Math.round(data.averageOrderValue)}
                    icon={TrendingUp}
                    iconClassName="bg-blue-500/10 text-blue-500"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Last 7 Days</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={data.trend}>
                                <defs>
                                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--foreground)" stopOpacity={0.25} />
                                        <stop offset="100%" stopColor="var(--foreground)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>

                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />

                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) =>
                                        new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }
                                    tickLine={false}
                                    axisLine={false}
                                    fontSize={12}
                                />

                                <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />

                                <Tooltip
                                    contentStyle={{
                                        background: "var(--card)",
                                        border: "1px solid var(--border)",
                                        borderRadius: "8px",
                                    }}
                                    labelFormatter={(value) =>
                                        new Date(value).toLocaleDateString()
                                    }
                                />

                                <Area
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="var(--foreground)"
                                    strokeWidth={2}
                                    fill="url(#ordersGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Status</CardTitle>
                    </CardHeader>

                    <CardContent>
                        <div className="relative">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        shape={(props) => (
                                            <Sector
                                                {...props}
                                                fill={statusData[props.index].color}
                                                stroke="none"
                                            />
                                        )}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-2xl font-bold">
                                    {totalStatusOrders}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    orders
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {statusData.map((entry) => (
                                <div
                                    key={entry.name}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: entry.color }}
                                        />
                                        <span className="text-muted-foreground">
                                            {entry.name}
                                        </span>
                                    </div>
                                    <span className="font-medium">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>

                <CardContent className="space-y-1">
                    {data.recentOrders.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No orders yet.
                        </p>
                    )}

                    {data.recentOrders.map((order) => (
                        <div
                            key={order._id}
                            className="flex items-center justify-between -mx-2 rounded-lg px-2 py-3 transition-colors hover:bg-muted/50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {order.customerName.charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <p className="font-medium">{order.customerName}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {order.productName}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <OrderStatusBadge status={order.status} />
                                <span className="font-medium">
                                    {order.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-3">
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