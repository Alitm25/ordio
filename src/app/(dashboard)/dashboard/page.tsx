"use client";

import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "@/features/dashboard/services/getDashboardStats";
import StatsCard from "@/components/dashboard/StatsCard";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Sector } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {ShoppingCart, Wallet, Clock, TrendingUp, AlertCircle} from "lucide-react";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";
import {useState} from "react";
import {DashboardRange} from "@/types/dashboard";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useLocale, useTranslations} from "next-intl";
import {formatDate} from "@/lib/formatDate";
import StockBadge from "@/components/products/StockBadge";

const STATUS_COLORS = {
    pending: "#f59e0b",
    processing: "#3b82f6",
    completed: "#10b981",
    cancelled: "#ef4444",
};

export default function DashboardPage() {
    // Time range state
    const [range, setRange] = useState<DashboardRange>('this_month');
    // Translate intl function
    const locale = useLocale();
    const dir = locale === 'fa' ? 'rtl' : 'ltr';

    const tDashboard = useTranslations('dashboard');
    const tCommon = useTranslations('common')
    const tOrders = useTranslations('orders')

    // Range Labels
    const RANGE_LABELS :Record<DashboardRange, string> = {
        "7d": `${tDashboard('range.7d')}`,
        "30d": `${tDashboard('range.30d')}`,
        "90d": `${tDashboard('range.90d')}`,
        this_month: `${tDashboard('range.this_month')}`,
    }

    // Dashboard API Fetch
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["dashboardStats", range],
        queryFn: () => getDashboardStats(range),
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
                    <p className="font-medium">{ tDashboard('error.title') }</p>
                    <p className="text-sm text-muted-foreground">
                        { tDashboard('error.description') }
                    </p>
                </div>

                <Button variant="outline" className="cursor-pointer" onClick={() => refetch()}>
                    { tCommon('retry') }
                </Button>
            </div>
        );
    }

    // Status section variables
    const statusData = [
        { name: `${tOrders('status.pending')}`, value: data.statusBreakdown.pending, color: STATUS_COLORS.pending },
        { name: `${tOrders('status.processing')}`, value: data.statusBreakdown.processing, color: STATUS_COLORS.processing },
        { name: `${tOrders('status.completed')}`, value: data.statusBreakdown.completed, color: STATUS_COLORS.completed },
        { name: `${tOrders('status.cancelled')}`, value: data.statusBreakdown.cancelled, color: STATUS_COLORS.cancelled }
    ];

    const totalStatusOrders =
        data.statusBreakdown.pending +
        data.statusBreakdown.processing +
        data.statusBreakdown.completed +
        data.statusBreakdown.cancelled;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">{ tDashboard('title') }</h1>
                {/* Range select input */}
                <div className="flex items-center justify-between gap-3">
                    <Select value={range} dir={dir}
                        onValueChange={(value) =>
                            setRange(value as DashboardRange)
                        }
                    >
                        <SelectTrigger className="w-40 cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(RANGE_LABELS).map(
                                ([value, label]) => (
                                    <SelectItem
                                        key={value}
                                        value={value}
                                        className="cursor-pointer"
                                    >
                                        {label}
                                    </SelectItem>
                                )
                            )}
                        </SelectContent>
                    </Select>
                    {/* New Order Button */}
                    <Link href="/orders">
                        <Button className="cursor-pointer">{ tDashboard('newOrder') }</Button>
                    </Link>
                </div>
            </div>

            {/* KPI Stats Card START */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title={`${ tDashboard('kpi.orders') } (${RANGE_LABELS[range]})`}
                    value={data.totalOrdersInRange}
                    icon={ShoppingCart}
                />
                <StatsCard
                    title={`${ tDashboard('kpi.revenue') } (${RANGE_LABELS[range]})`}
                    value={data.totalRevenueInRange}
                    icon={Wallet}
                    iconClassName="bg-emerald-500/10 text-emerald-500"
                />
                <StatsCard
                    title={`${ tDashboard('kpi.pending' )}`}
                    value={data.pendingOrders}
                    icon={Clock}
                    iconClassName="bg-amber-500/10 text-amber-500"
                />
                <StatsCard
                    title={`${ tDashboard('kpi.avgOrder') }`}
                    value={Math.round(data.averageOrderValue)}
                    icon={TrendingUp}
                    iconClassName="bg-blue-500/10 text-blue-500"
                />
            </div>
            {/* KPI Stats Card END */}

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{ `${tDashboard('trend')} (${RANGE_LABELS[range]})` }</CardTitle>
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
                                    tickFormatter={ (value) => formatDate(`${value}T12:00:00`, locale) }
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
                                    labelFormatter={ (value) => formatDate(`${value}T12:00:00`, locale) }
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
                        <CardTitle>{ tDashboard('orderStatus') }</CardTitle>
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
                                    { tDashboard('orders') }
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            {statusData.map((entry) => (
                                <div key={entry.name} className="flex items-center justify-between text-sm">
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
                    <CardTitle>{ tDashboard('recentOrders') }</CardTitle>
                </CardHeader>

                <CardContent className="space-y-1">
                    {data.recentOrders.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            { tDashboard('noOrders') }
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
                                        {order.items[0]?.productName}
                                        {order.items.length > 1 && (
                                            <span className="ms-1">+{order.items.length - 1}</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <OrderStatusBadge status={order.status} />
                                <span className="font-medium">
                                    {order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    ))}

                    <div className="pt-3">
                        <Link
                            href="/orders"
                            className="text-sm text-primary underline-offset-4 hover:underline"
                        >
                            { tDashboard('viewAllOrders') }
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {data.lowStockProducts.length > 0 && (
                <Card className="border-amber-500/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-500">
                            <AlertCircle className="h-5 w-5" />
                            {tDashboard("lowStock.title")}
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-2">
                        {data.lowStockProducts.map((product) => (
                            <div
                                key={product._id}
                                className="flex items-center justify-between text-sm"
                            >
                                <span>{product.name}</span>
                                <StockBadge stock={product.stock} />
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}