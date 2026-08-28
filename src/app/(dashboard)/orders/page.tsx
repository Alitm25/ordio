"use client";

import { useState } from "react";
import {keepPreviousData, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { getOrders } from "@/features/orders/services/getOrders";
import { deleteOrder } from "@/features/orders/services/deleteOrder";
import OrdersTable, { Order } from "@/components/orders/OrdersTable";
import OrdersTableSkeleton from "@/components/orders/OrdersTableSkeleton";
import OrdersPagination from "@/components/orders/OrdersPagination";
import EmptyOrdersState from "@/components/orders/EmptyOrdersState";
import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreateOrderDialog from "@/components/orders/CreateOrderDialog";
import EditOrderDialog from "@/components/orders/EditOrderDialog";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Download, Search } from "lucide-react";
import { exportToCsv } from "@/lib/exportToCsv";
import { useLocale, useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import OrderDetailPanel from "@/components/orders/OrderDetailPanel";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function OrdersPage() {
    // Router variables for URL syncing
    const router=  useRouter();
    const searchParams = useSearchParams();

    const queryClient = useQueryClient();

    // Translate intl function
    const locale = useLocale();
    const dir = locale === 'fa'? 'rtl' : 'ltr';

    const tOrders = useTranslations('orders');
    const tCommon = useTranslations("common");

    // Order action dialog open & close state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    // Filter orders States
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("createdAt:desc");
    const [page, setPage] = useState(1);

    // Order id variable for detail panel information
    const selectedOrderId = searchParams.get("id");

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
        queryKey: [ "orders", { search: debouncedSearch, status, sortBy, sortOrder, page } ],
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

    // Delete the order mutation FN
    const deleteOrderMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setOrderToDelete(null);
            if (selectedOrderId) {
                router.push("/orders");
            }
        },
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

        const handleSelectOrder = (order: Order) => {
            router.push(`/orders?id=${order._id}`);
        };

        const handleClosePanel = () => {
            router.push("/orders");
        }

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
            const rows = orders.map((order) => ({
                [tOrders("table.customer")]: order.customerName,
                "Phone": order.customerPhone,
                [tOrders("table.product")]: order.items
                    .map((item) => `${item.productName} x${item.quantity}`)
                    .join(" | "),
                [tOrders("table.price")]: order.totalAmount,
                [tOrders("table.status")]: order.status,
                [tOrders("table.payment")]: order.paymentStatus,
                [tOrders("table.date")]: new Date(order.createdAt).toLocaleDateString(),
            }));

            const dateStr = new Date().toISOString().split("T")[0];
            exportToCsv(`orders-${dateStr}`, rows)
        }
    // Handlers END

    return (
        <div className="flex h-full gap-0">
            {/* لیست سفارش‌ها */}
            <div className={`flex flex-col space-y-4 transition-all duration-300 ${
                selectedOrderId
                    ? "hidden lg:flex lg:w-1/2 xl:w-3/5"
                    : "flex w-full"
            } p-1`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">
                        {tOrders("title")}
                    </h1>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={handleExport}
                            disabled={orders.length === 0}
                        >
                            <Download className="h-4 w-4 me-2" />
                            {tOrders("exportCsv")}
                        </Button>
                        <Button
                            className="cursor-pointer"
                            onClick={() => setDialogOpen(true)}
                        >
                            {tOrders("newOrder")}
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-50 flex-1">
                        <Search className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder={tOrders("searchPlaceholder")}
                            value={search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="ps-9"
                        />
                    </div>

                    <Select value={status} onValueChange={handleStatusChange}>
                        <SelectTrigger className="w-36 cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={dir}>
                            <SelectItem value="all" className="cursor-pointer">
                                {tOrders("allStatuses")}
                            </SelectItem>
                            <SelectItem value="pending" className="cursor-pointer">
                                {tOrders("status.pending")}
                            </SelectItem>
                            <SelectItem value="processing" className="cursor-pointer">
                                {tOrders("status.processing")}
                            </SelectItem>
                            <SelectItem value="completed" className="cursor-pointer">
                                {tOrders("status.completed")}
                            </SelectItem>
                            <SelectItem value="cancelled" className="cursor-pointer">
                                {tOrders("status.cancelled")}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={sort} onValueChange={handleSortChange}>
                        <SelectTrigger className="w-44 cursor-pointer">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent dir={dir}>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className="cursor-pointer"
                                >
                                    {tOrders(option.label as any)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {isLoading ? (
                    <OrdersTableSkeleton />
                ) : error ? (
                    <ErrorState
                        title={tOrders("error.title")}
                        description={tOrders("error.description")}
                        onRetry={() => refetch()}
                    />
                ) : orders.length === 0 ? (
                    <EmptyOrdersState
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={handleClearFilters}
                        onCreateOrder={() => setDialogOpen(true)}
                    />
                ) : (
                    <>
                        <p className="text-sm text-muted-foreground">
                            {totalCount}{" "}
                            {tOrders(totalCount !== 1 ? "foundPlural" : "found")}
                        </p>

                        <OrdersTable
                            orders={orders}
                            onEdit={setEditingOrder}
                            onSelect={handleSelectOrder}
                            selectedOrderId={selectedOrderId!}
                        />

                        <OrdersPagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            {/* پنل جزئیات */}
            {selectedOrderId && (
                <div className="w-full lg:w-1/2 xl:w-2/5">
                    <OrderDetailPanel
                        orderId={selectedOrderId}
                        onClose={handleClosePanel}
                        onEdit={setEditingOrder}
                        onDelete={setOrderToDelete}
                    />
                </div>
            )}

            <CreateOrderDialog open={dialogOpen} onOpenChange={setDialogOpen} />

            <EditOrderDialog
                order={editingOrder}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingOrder(null);
                        queryClient.invalidateQueries({ queryKey: ["order", selectedOrderId] });
                    }
                }}
            />

            <AlertDialog
                open={!!orderToDelete}
                onOpenChange={(open) => {
                    if (!open) setOrderToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {tOrders("delete.title")}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {tOrders("delete.description")}{" "}
                            <strong>{orderToDelete?.customerName}</strong>.{" "}
                            {tOrders("delete.cannotUndo")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            {tCommon("cancel")}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer bg-red-800 text-white hover:bg-red-700"
                            disabled={deleteOrderMutation.isPending}
                            onClick={() => {
                                if (orderToDelete) {
                                    deleteOrderMutation.mutate(orderToDelete._id);
                                }
                            }}
                        >
                            {tCommon("delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}