"use client";

import { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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

    // Update Order mutation function declaration
    const updateOrderMutation = useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            onOpenChange(false);
        },
    });

    // Get products catalog data
    const { data: productsData } = useProducts();
    const products = productsData?.products ?? [];

    // Form default values initializations
    const form = useForm<CreateOrderFormValues>({
        resolver: zodResolver(createOrderSchema),
        defaultValues: {
            customerName: "",
            customerPhone: "",
            productName: "",
            quantity: 1,
            price: 0,
            paymentStatus: 'unpaid',
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
                paymentStatus: order.paymentStatus as "unpaid" | "paid" | "partial",
                paymentMethod: order.paymentMethod as
                    | "cash"
                    | "card"
                    | "transfer"
                    | undefined,
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

                    {/* choosing products catalog SECTION */}
                    {
                        products.length > 0 && (
                            <div className="space-y-1">
                                <ProductCombobox
                                    products={products}
                                    value={ form.watch('productName') }
                                    onSelect={ (product) => {
                                        form.setValue('productName', product.name);
                                        form.setValue('price', product.price)
                                    }}
                                />
                                <p className={'text-xs text-muted-foreground px-1'}>
                                    Or type manually below
                                </p>
                            </div>
                        )
                    }

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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Select
                                value={form.watch("paymentStatus")}
                                onValueChange={(value) =>
                                    form.setValue(
                                        "paymentStatus",
                                        value as "unpaid" | "paid" | "partial"
                                    )
                                }
                            >
                                <SelectTrigger className="w-full cursor-pointer">
                                    <SelectValue placeholder="Payment Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unpaid" className="cursor-pointer">
                                        Unpaid
                                    </SelectItem>
                                    <SelectItem value="partial" className="cursor-pointer">
                                        Partial
                                    </SelectItem>
                                    <SelectItem value="paid" className="cursor-pointer">
                                        Paid
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {form.watch("paymentStatus") !== "unpaid" && (
                            <div className="space-y-1">
                                <Select
                                    value={form.watch("paymentMethod")}
                                    onValueChange={(value) =>
                                        form.setValue(
                                            "paymentMethod",
                                            value as "cash" | "card" | "transfer"
                                        )
                                    }
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Payment Method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash" className="cursor-pointer">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="card" className="cursor-pointer">
                                            Card
                                        </SelectItem>
                                        <SelectItem value="transfer" className="cursor-pointer">
                                            Transfer
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
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