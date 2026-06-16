"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import StatsCard from "@/components/dashboard/StatsCard";

export default function OrdersPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const orders = data?.orders ?? [];

    //orders status
    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order: any) => order.status === "pending"
    ).length;

    const completedOrders = orders.filter(
        (order: any) => order.status === "completed"
    ).length;

    const cancelledOrders = orders.filter(
        (order: any) => order.status === "cancelled"
    ).length;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading orders</div>;
    }

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatsCard
                    title="Total Orders"
                    value={totalOrders}
                />

                <StatsCard
                    title="Pending"
                    value={pendingOrders}
                />

                <StatsCard
                    title="Completed"
                    value={completedOrders}
                />

                <StatsCard
                    title="Cancelled"
                    value={cancelledOrders}
                />
            </div>

            <h1 className="text-3xl font-bold mb-6">
                Orders
            </h1>

            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}