"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import StatsCard from "@/components/dashboard/StatsCard";
import OrdersTable from "@/components/orders/OrdersTable";
import {Button} from "@/components/ui/button";
import {createOrder} from "@/features/orders/services/createOrders";

export default function OrdersPage() {

    const queryClient = useQueryClient();

    // get orders
    const { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: getOrders,
    });

    const createOrderMutation = useMutation({
        mutationFn: createOrder,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["orders"],
            });
        },
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
            <Button onClick={() => createOrderMutation.mutate({
                        customerName: "Ali",
                        customerPhone: "09121234567",
                        productName: "Test Product",
                        quantity: 2,
                        price: 500000,
                    })
                }
            >
                New Order
            </Button>

            <OrdersTable orders={orders} />
        </div>
    );
}