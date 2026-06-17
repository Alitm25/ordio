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
                    })} className={'space-y-4'}>
                    <Input
                        {...form.register("customerName")}
                        placeholder="Customer Name"
                    />

                    <Input
                        {...form.register("customerPhone")}
                        placeholder="Phone"
                    />

                    <Input
                        {...form.register("productName")}
                        placeholder="Product Name"
                    />

                    <div className={'grid grid-cols-2 gap-4'}>
                        <Input
                            type="number"
                            {...form.register("quantity", {
                                valueAsNumber: true,
                            })}
                        />

                        <Input
                            type="number"
                            {...form.register("price", {
                                valueAsNumber: true,
                            })}
                        />
                    </div>

                    <Button type="submit" className={'cursor-pointer w-full'} disabled={createOrderMutation.isPending}>
                        {
                            createOrderMutation.isPending
                            ? 'Creating...'
                            : 'Create Order'
                        }
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}