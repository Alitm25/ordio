"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";

export default function OrdersPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading orders</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Orders
            </h1>

            <pre>
                {JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
}