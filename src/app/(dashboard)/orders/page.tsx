"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import OrdersTable, { Order } from "@/components/orders/OrdersTable";
import OrdersTableSkeleton from "@/components/orders/OrdersTableSkeleton";
import OrdersPagination from "@/components/orders/OrdersPagination";
import EmptyOrdersState from "@/components/orders/EmptyOrdersState";
import ErrorState from "@/components/shared/ErrorState";
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
import {Download, Search} from "lucide-react";
import {exportToCsv} from "@/lib/exportToCsv";
import {useTranslations} from "next-intl";

export default function OrdersPage() {
    // Translate intl function
    const tOrders = useTranslations('orders');
    const tCreate = useTranslations('create');

    // Order action dialog open & close state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // Filter orders States
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("createdAt:desc");
    const [page, setPage] = useState(1);

    // debounce function
    const debouncedSearch = useDebouncedValue(search, 400);
    // sort variables
    const [sortBy, sortOrder] = sort.split(":") as [string, "asc" | "desc"];
    const SORT_OPTIONS = [
        { value: `createdAt:desc`, label: `${ tOrders('sort.newestFirst') }` },
        { value: "createdAt:asc", label: `${ tOrders('sort.oldestFirst') }` },
        { value: "price:desc", label: `${ tOrders('sort.priceHighToLow') }` },
        { value: "price:asc", label: `${ tOrders('sort.priceLowToHigh') }` },
    ];

    // Get orders query fetch
    const { data, isLoading, error, refetch } = useQuery({
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

    // Order and page variables
    const orders: Order[] = data?.orders ?? [];
    const totalCount = data?.totalCount ?? 0;
    const totalPages = data?.totalPages ?? 1;

    // check whether filters are active or not
    const hasActiveFilters = search !== "" || status !== "all";

    // Handlers START
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

        const handleClearFilters = () => {
            setSearch("");
            setStatus("all");
            setPage(1);
        };

        const handleExport = () => {
            const rows = orders.map(order => (
                {
                    "Customer Name": order.customerName,
                    "Customer Phone": order.customerPhone,
                    "Product": order.productName,
                    "Quantity": order.quantity,
                    "Price": order.price,
                    "Status": order.status,
                    "Payment Status": order.paymentStatus,
                    "Payment Method": order.paymentMethod ?? "",
                    "Date": new Date(order.createdAt).toLocaleDateString("en-US"),
                }
            ))

            const dateStr = new Date().toISOString().split("T")[0];
            exportToCsv(`orders-${dateStr}`, rows)
        }
    // Handlers END
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{ tOrders('title') }</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="cursor-pointer" onClick={handleExport} disabled={orders.length === 0}>
                        <Download className="h-4 w-4 mr-2" />
                        { tOrders('exportCsv') }
                    </Button>

                    <Button className="cursor-pointer" onClick={() => setDialogOpen(true)}>
                        { tOrders('newOrder') }
                    </Button>
                </div>
            </div>
            {/* Search bar */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="relative min-w-55 flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder={ tOrders('searchPlaceholder') }
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Status Filter section */}
                <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40 cursor-pointer">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" className="cursor-pointer">
                            { tOrders('allStatuses') }
                        </SelectItem>
                        <SelectItem value="pending" className="cursor-pointer">
                            { tOrders('status.pending') }
                        </SelectItem>
                        <SelectItem value="processing" className="cursor-pointer">
                            { tOrders('status.processing') }
                        </SelectItem>
                        <SelectItem value="completed" className="cursor-pointer">
                            { tOrders('status.completed') }
                        </SelectItem>
                        <SelectItem value="cancelled" className="cursor-pointer">
                            { tOrders('status.cancelled') }
                        </SelectItem>
                    </SelectContent>
                </Select>

                {/* Sort Section */}
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

            {/* Loading, Error and Empty Data Section */}
            {isLoading ? (
                <OrdersTableSkeleton />
            ) : error ? (
                <ErrorState
                    title={ tOrders('error.title') }
                    description={ tOrders('error.description') }
                    onRetry={() => refetch()}
                />
            ) : orders.length === 0 ? (
                <EmptyOrdersState
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                    onCreateOrder={() => setDialogOpen(true)}
                />
            ) : (
                // Orders Table
                <>
                    <p className="text-sm text-muted-foreground">
                        {totalCount} {tOrders(totalCount !== 1 ? "foundPlural" : "found")}
                    </p>

                    <OrdersTable orders={orders} onEdit={setEditingOrder} />

                    <OrdersPagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}

            {/* Create & Edit Order dialogs Component */}
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