"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import OrdersTable, { Order } from "@/components/orders/OrdersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CreateOrderDialog from "@/components/orders/CreateOrderDialog";
import EditOrderDialog from "@/components/orders/EditOrderDialog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Search } from "lucide-react";

const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest first" },
    { value: "createdAt:asc", label: "Oldest first" },
    { value: "price:desc", label: "Price: High to Low" },
    { value: "price:asc", label: "Price: Low to High" },
];

export default function OrdersPage() {
    // Dialog and edit States
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

    // Orders and total number of orders Variables
    const orders: Order[] = data?.orders ?? [];
    const totalCount = data?.totalCount ?? 0;

    // Handle functions
    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        setPage(1);
    };

    const handleSortChange = (value: string) => {
        setSort(value);
        setPage(1);
    };

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
                <div className="relative min-w-55 flex-1">
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