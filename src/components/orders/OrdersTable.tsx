"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "@/features/orders/services/deleteOrder";
import { bulkDeleteOrders } from "@/features/orders/services/bulkDeleteOrders";
import { updateOrderStatus } from "@/features/orders/services/updateOrderStatus";
import { orderStatusColors } from "@/lib/orderStatusColors";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Order } from "@/types/order";
import {useLocale, useTranslations} from "next-intl";
import {formatDate} from "@/lib/formatDate";

export type { Order };

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
    onSelect: (order: Order) => void;
    selectedOrderId: string;
}

export default function OrdersTable({ orders, onEdit, onSelect, selectedOrderId }: Props) {
    const queryClient = useQueryClient();
    const locale = useLocale();

    // Translation variable
    const tOrders = useTranslations('orders');
    const tCommon = useTranslations('common');
    const tNotif = useTranslations("orders.notifications");

    // selected orders to delete States
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

    // Delete Mutation function
    const deleteOrderMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setOrderToDelete(null);
            toast.success(tNotif("deleteSuccess"));
        },
        onError: () => {
            toast.error(tNotif("deleteError"));
        },
    });

    // Bulk delete Mutation
    const bulkDeleteMutation = useMutation({
        mutationFn: bulkDeleteOrders,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setSelectedIds([]);
            setBulkDeleteOpen(false);
            toast.success(tNotif("bulkDeleteSuccess"));
        },
        onError: () => {
            toast.error(tNotif("bulkDeleteError"));
        },
    });

    // Update Status Mutation Function
    const updateStatusMutation = useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success(tNotif("statusUpdateSuccess"));
        },
        onError: () => {
            toast.error(tNotif("statusUpdateError"));        },
    });

    const currentPageIds = orders.map((order) => order._id);

    const selectedOnPageCount = currentPageIds.filter((id) =>
        selectedIds.includes(id)
    ).length;

    const allOnPageSelected =
        currentPageIds.length > 0 &&
        selectedOnPageCount === currentPageIds.length;

    const someOnPageSelected = selectedOnPageCount > 0 && !allOnPageSelected;

    const toggleSelectAll = () => {
        if (allOnPageSelected) {
            setSelectedIds((prev) =>
                prev.filter((id) => !currentPageIds.includes(id))
            );
        } else {
            setSelectedIds((prev) => [
                ...prev,
                ...currentPageIds.filter((id) => !prev.includes(id)),
            ]);
        }
    };

    const toggleSelectOne = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((existingId) => existingId !== id)
                : [...prev, id]
        );
    };

    return (
        <>
            {selectedIds.length > 0 && (
                <div className="mb-3 flex items-center justify-between rounded-lg border bg-muted/50 px-4 py-2.5">
                    <span className="text-sm font-medium">
                        {selectedIds.length} { tOrders('bulkDelete.selected') }
                    </span>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setSelectedIds([])}
                        >
                            { tOrders('bulkDelete.clear') }
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            { tOrders('bulkDelete.deleteSelected') }
                        </Button>
                    </div>
                </div>
            )}

            <div className="rounded-xl border bg-card px-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox className="cursor-pointer"
                                    checked={ allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>{ tOrders('table.customer') }</TableHead>
                            <TableHead className="hidden md:table-cell">{ tOrders('table.product') }</TableHead>
                            <TableHead>{ tOrders('table.status') }</TableHead>
                            <TableHead>{ tOrders('table.payment') }</TableHead>
                            <TableHead className="hidden md:table-cell">{ tOrders('table.price') }</TableHead>
                            <TableHead className="hidden md:table-cell">{ tOrders('table.date') }</TableHead>
                            <TableHead>{ tOrders('table.actions') }</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}
                                className={`cursor-pointer ${ selectedOrderId === order._id ? 'bg-muted/50' : "" }`}
                            >
                                <TableCell>
                                    <Checkbox
                                        className="cursor-pointer"
                                        checked={selectedIds.includes(order._id)}
                                        onCheckedChange={() =>
                                            toggleSelectOne(order._id)
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <button onClick={ () => onSelect(order)}
                                        className={'hover:underline underline-offset-4 font-medium text-start cursor-pointer'}
                                    >
                                        {order.customerName}
                                    </button>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    <span className="font-medium">{order.items[0]?.productName}</span>
                                    {order.items.length > 1 && (
                                        <span className={`text-xs text-muted-foreground me-1 ${locale === 'fa' ? 'me-1' : 'ms-1'}`}>
                                            +{order.items.length - 1}
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Select value={order.status}
                                        onValueChange={(value) =>
                                            updateStatusMutation.mutate({
                                                id: order._id,
                                                status: value,
                                            })
                                        }
                                    >
                                        <SelectTrigger className="w-36 cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="pending" className="cursor-pointer">
                                                <span className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.pending}`}>
                                                    { tOrders('status.pending') }
                                                </span>
                                            </SelectItem>

                                            <SelectItem value="processing" className="cursor-pointer">
                                                <span className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.processing}`}>
                                                    { tOrders('status.processing') }
                                                </span>
                                            </SelectItem>

                                            <SelectItem value="completed" className="cursor-pointer">
                                                <span className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.completed}`}>
                                                    { tOrders('status.completed') }
                                                </span>
                                            </SelectItem>

                                            <SelectItem value="cancelled" className="cursor-pointer">
                                                <span className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.cancelled}`}>
                                                    { tOrders('status.cancelled') }
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <span className={`rounded border px-2 py-0.5 text-xs font-medium ${
                                            order.paymentStatus === "paid"
                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                                : order.paymentStatus === "partial"
                                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                                                    : "border-muted-foreground/20 bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {order.paymentStatus === "paid"
                                            ? tOrders('payment.paid')
                                            : order.paymentStatus === "partial"
                                                ? tOrders('payment.partial')
                                                : tOrders('payment.unpaid') }
                                    </span>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {order.totalAmount.toLocaleString()}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {formatDate(order.createdAt, locale)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button className="cursor-pointer" variant="outline" size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(order);
                                            }
                                        }
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button className="cursor-pointer" variant="destructive" size="icon"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setOrderToDelete(order);
                                            }
                                        }
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AlertDialog open={!!orderToDelete}
                onOpenChange={(open) => {
                    if (!open) setOrderToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{ tOrders('delete.title') }</AlertDialogTitle>
                        <AlertDialogDescription>
                            { tOrders('delete.description') }{" "}
                            <strong>{orderToDelete?.customerName}</strong>.
                            { tOrders('delete.cannotUndo') }
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            { tCommon('cancel') }
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="cursor-pointer bg-red-700 text-white hover:bg-red-600"
                            disabled={deleteOrderMutation.isPending}
                            onClick={() => {
                                if (orderToDelete) {
                                    deleteOrderMutation.mutate(orderToDelete._id);
                                }
                            }}
                        >
                            {
                                deleteOrderMutation.isPending
                                ? tCommon('deleting')
                                : tCommon('delete')
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            { tOrders('bulkDelete.title') }
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            { tOrders('bulkDelete.description') }
                            { tOrders('delete.cannotUndo') }
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            { tCommon('cancel') }
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="cursor-pointer bg-red-800 text-white hover:bg-red-700"
                            disabled={bulkDeleteMutation.isPending}
                            onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                        >
                            {
                                bulkDeleteMutation.isPending
                                ? tCommon('deleting')
                                : tCommon('delete')
                            }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}