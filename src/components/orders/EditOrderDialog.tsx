"use client";

import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createOrderSchema,
    CreateOrderFormValues,
} from "@/features/orders/schemas/createOrderSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrder } from "@/features/orders/services/updateOrder";
import { Button } from "@/components/ui/button";
import { Order } from "@/components/orders/OrdersTable";

interface Props {
    order: Order | null;
    onOpenChange: (open: boolean) => void;
}

export default function EditOrderDialog({ order, onOpenChange }: Props) {
    const queryClient = useQueryClient();

    // default values of form
    const form = useForm<CreateOrderFormValues>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            productName: "",
            quantity: 1,
            price: 0,
        },
    });

    // reset form for various forms
    useEffect(() => {
        if (order) {
            form.reset({
                customerName: order.customerName,
                customerPhone: order.customerPhone,
                productName: order.productName,
                quantity: order.quantity,
                price: order.price,
            });
        }
    }, [order, form]);

    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            onOpenChange(false);
        },
    });

    return (
        <Dialog open={!!order} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5">
                <DialogHeader>
                    <DialogDescription>
                        Update the details of this order.
                    </DialogDescription>
                    <DialogTitle>Edit Order</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit((data) => {
                        if (!order) return;

                        updateOrderMutation.mutate({ id: order._id, data });
                    })}
                    className="space-y-4"
                >
                    <div className="space-y-1">
                        <Input{...form.register("customerName")} placeholder="Customer Name" />
                        {form.formState.errors.customerName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.customerName.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("customerPhone")} placeholder="Phone" />
                        {form.formState.errors.customerPhone && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.customerPhone.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("productName")} placeholder="Product Name" />
                        {form.formState.errors.productName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.productName.message}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Input type="number"
                                {...form.register("quantity", {
                                    valueAsNumber: true,
                                })}
                            />
                            {form.formState.errors.quantity && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.quantity.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <Input type="number"
                                {...form.register("price", {
                                    valueAsNumber: true,
                                })}
                            />
                            {form.formState.errors.price && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.price.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" className="cursor-pointer" disabled={updateOrderMutation.isPending}>
                            {updateOrderMutation.isPending
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}