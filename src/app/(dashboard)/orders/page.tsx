"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import StatsCard from "@/components/dashboard/StatsCard";
import OrdersTable, { Order } from "@/components/orders/OrdersTable";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/features/orders/services/createOrders";
import { useState } from "react";
import CreateOrderDialog from "@/components/orders/CreateOrderDialog";
import EditOrderDialog from "@/components/orders/EditOrderDialog";

export default function OrdersPage() {
    const queryClient = useQueryClient();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });

    const orders: Order[] = data?.orders ?? [];

    const totalOrders = orders.length;

    const pendingOrders = orders.filter(
        (order) => order.status === "pending"
    ).length;

    const completedOrders = orders.filter(
        (order) => order.status === "completed"
    ).length;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading orders</div>;
    }

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
                <StatsCard title="Total Orders" value={totalOrders} />
                <StatsCard title="Pending" value={pendingOrders} />
                <StatsCard title="Completed" value={completedOrders} />
            </div>

            <h1 className="text-3xl font-bold mb-6">Orders</h1>

            <Button onClick={() => setDialogOpen(true)}>New Order</Button>

            <OrdersTable orders={orders} onEdit={setEditingOrder} />

            <CreateOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />

            <EditOrderDialog
                order={editingOrder}
                onOpenChange={(open) => {
                    if (!open) setEditingOrder(null);
                }}
            />
        </div>
    );
}