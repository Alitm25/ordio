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

    // URL Params States
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("createdAt:desc");
    const [page, setPage] = useState(1);

    // Debounce and sort Variables
    const debouncedSearch = useDebouncedValue(search, 400);
    const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];

    // Orders API Query
    const { data, isLoading, error } = useQuery({
        queryKey: [
            "orders",
            { search: debouncedSearch, status, sortBy, sortOrder, page },
        ],
        queryFn: () =>
            getOrders({
                search: debouncedSearch || undefined,
                status,
                sortBy,
                sortOrder,
                page,
                limit: 10,
            }),
        placeholderData: keepPreviousData,
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Orders</h1>

                <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
                    + New Order
                </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-[220px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by customer or product..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40 cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">All Statuses</SelectItem>
                        <SelectItem value="pending" className="cursor-pointer">Pending</SelectItem>
                        <SelectItem value="processing" className="cursor-pointer">Processing</SelectItem>
                        <SelectItem value="completed" className="cursor-pointer">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={sort} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-44 cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                            <SelectItem
                                key={option.value}
                                value={option.value}
                                className="cursor-pointer"
                            >
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <p className="text-sm text-muted-foreground">
                {totalCount} order{totalCount !== 1 ? "s" : ""} found
            </p>

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