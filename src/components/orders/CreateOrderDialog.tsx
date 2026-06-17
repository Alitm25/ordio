"use client";

import {
    Dialog,
    DialogContent, DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createOrderSchema,
    CreateOrderFormValues,
} from "@/features/orders/schemas/createOrderSchema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createOrder} from "@/features/orders/services/createOrders";

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
            <DialogContent>
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
                    })}
                >
                    <input
                        {...form.register("customerName")}
                        placeholder="Customer Name"
                    />

                    <input
                        {...form.register("customerPhone")}
                        placeholder="Phone"
                    />

                    <input
                        {...form.register("productName")}
                        placeholder="Product Name"
                    />

                    <input
                        type="number"
                        {...form.register("quantity", {
                            valueAsNumber: true,
                        })}
                    />

                    <input
                        type="number"
                        {...form.register("price", {
                            valueAsNumber: true,
                        })}
                    />

                    <button type="submit" disabled={createOrderMutation.isPending}>
                        {
                            createOrderMutation.isPending
                            ? 'Creating...'
                            : 'Create Order'
                        }
                    </button>
                </form>
            </DialogContent>
        </Dialog>
    );
}