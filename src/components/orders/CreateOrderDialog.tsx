"use client";

import {
    Dialog,
    DialogContent, DialogDescription,
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
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createOrder} from "@/features/orders/services/createOrders";
import {Button} from "@/components/ui/button";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateOrderDialog({open, onOpenChange}: Props) {

    const queryClient = useQueryClient();

    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            form.reset();
            onOpenChange(false);
        }
    });

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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5">
                <DialogHeader>
                    <DialogDescription>
                        Create a new order for your customer.
                    </DialogDescription>
                    <DialogTitle>
                        Create New Order
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit((data) => {
                        createOrderMutation.mutate(data);
                    })} className={'space-y-4'}>

                    <div className="space-y-1">
                        <Input {...form.register("customerName")} placeholder="Customer Name"/>
                        {
                            form.formState.errors.customerName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.customerName.message}
                            </p>)
                        }
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("customerPhone")} placeholder="Phone"/>
                        {
                            form.formState.errors.customerPhone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.customerPhone.message}
                                </p>)
                        }
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("productName")} placeholder="Product Name"/>
                        {
                            form.formState.errors.productName && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.productName.message}
                                </p>)
                        }
                    </div>

                    <div className={'grid grid-cols-2 gap-4'}>

                        <div className="space-y-1">
                            <Input type="number" {...form.register("quantity", {
                                    valueAsNumber: true,
                                })}
                            />
                            {
                                form.formState.errors.quantity && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.quantity.message}
                                    </p>)
                            }
                        </div>

                        <div className="space-y-1">
                            <Input type="number" {...form.register("price", {
                                    valueAsNumber: true,
                                })}
                            />
                            {
                                form.formState.errors.price && (
                                    <p className="text-sm text-red-500">
                                        {form.formState.errors.price.message}
                                    </p>)
                            }
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className={'cursor-pointer'} onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>

                        <Button type="submit" className={'cursor-pointer'} disabled={createOrderMutation.isPending}>
                            {createOrderMutation.isPending
                                ? "Creating..."
                                : "Create Order"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}