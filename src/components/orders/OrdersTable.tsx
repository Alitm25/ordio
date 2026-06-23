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
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrder } from "@/features/orders/services/deleteOrder";
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

export interface Order {
    _id: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    quantity: number;
    price: number;
    status: string;
    createdAt: string;
}

interface Props {
    orders: Order[];
    onEdit: (order: Order) => void;
}

export default function OrdersTable({ orders, onEdit }: Props) {
    const queryClient = useQueryClient();
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

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

    return (
        <>
            <div className="rounded-xl border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order._id}>
                                <TableCell>{order.customerName}</TableCell>
                                <TableCell>{order.productName}</TableCell>
                                <TableCell>
                                    <OrderStatusBadge status={order.status} />
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
                            className="cursor-pointer bg-red-800 text-white hover:bg-red-700"
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
        </>
    );
}