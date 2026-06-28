"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "@/features/orders/services/deleteOrder";
import { bulkDeleteOrders } from "@/features/orders/services/bulkDeleteOrders";
import { updateOrderStatus } from "@/features/orders/services/updateOrderStatus";
import { orderStatusColors } from "@/lib/orderStatusColors";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Order } from "@/types/order";

export type { Order };

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
}

export default function OrdersTable({ orders, onEdit }: Props) {
    const queryClient = useQueryClient();

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
        },
        onError: () => {
            toast.error("Could not delete order");
        },
    });

    // Bulk delete Mutation
    const bulkDeleteMutation = useMutation({
        mutationFn: bulkDeleteOrders,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            setSelectedIds([]);
            setBulkDeleteOpen(false);
        },
        onError: () => {
            toast.error("Could not delete selected orders, Please try again");
        },
    });

    // Update Status Mutation Function
    const updateStatusMutation = useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
        onError: () => {
            toast.error("Could not update status, Please try again");
        },
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
                        {selectedIds.length} selected
                    </span>

                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear
                        </Button>

                        <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => setBulkDeleteOpen(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete Selected
                        </Button>
                    </div>
                </div>
            )}

            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10">
                                <Checkbox
                                    className="cursor-pointer"
                                    checked={
                                        allOnPageSelected
                                            ? true
                                            : someOnPageSelected
                                                ? "indeterminate"
                                                : false
                                    }
                                    onCheckedChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>
                                    <Checkbox
                                        className="cursor-pointer"
                                        checked={selectedIds.includes(order._id)}
                                        onCheckedChange={() =>
                                            toggleSelectOne(order._id)
                                        }
                                    />
                                </TableCell>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>
                                    <Select
                                        value={order.status}
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
                                            <SelectItem
                                                value="pending"
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.pending}`}
                                                >
                                                    Pending
                                                </span>
                                            </SelectItem>

                                            <SelectItem
                                                value="processing"
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.processing}`}
                                                >
                                                    Processing
                                                </span>
                                            </SelectItem>

                                            <SelectItem
                                                value="completed"
                                                className="cursor-pointer"
                                            >
                                                <span
                                                    className={`rounded border px-2 py-0.5 text-xs font-medium ${orderStatusColors.completed}`}
                                                >
                                                    Completed
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`rounded border px-2 py-0.5 text-xs font-medium ${
                                            order.paymentStatus === "paid"
                                                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                                : order.paymentStatus === "partial"
                                                    ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                                                    : "border-muted-foreground/20 bg-muted text-muted-foreground"
                                        }`}
                                    >
                                        {order.paymentStatus === "paid"
                                            ? "Paid"
                                            : order.paymentStatus === "partial"
                                                ? "Partial"
                                                : "Unpaid"}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {order.price.toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            className="cursor-pointer"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => onEdit(order)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            className="cursor-pointer"
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => setOrderToDelete(order)}
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

            <AlertDialog
                open={!!orderToDelete}
                onOpenChange={(open) => {
                    if (!open) setOrderToDelete(null);
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the order for{" "}
                            <strong>{orderToDelete?.customerName}</strong>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
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
                            {deleteOrderMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete {selectedIds.length} orders?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the selected orders.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            className="cursor-pointer bg-red-800 text-white hover:bg-red-700"
                            disabled={bulkDeleteMutation.isPending}
                            onClick={() => bulkDeleteMutation.mutate(selectedIds)}
                        >
                            {bulkDeleteMutation.isPending
                                ? "Deleting..."
                                : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}