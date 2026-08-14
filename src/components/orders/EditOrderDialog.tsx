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
import {useProducts} from "@/features/products/hooks/useProducts";
import ProductCombobox from "@/components/products/ProductCombobox";
import {useCustomers} from "@/features/customers/hooks/useCustomer";
import {Customer} from "@/types/customer";
import CustomerCombobox from "@/components/customers/CustomerCombobox";
import {useTranslations} from "next-intl";

interface Props {
    order: Order | null;
    onOpenChange: (open: boolean) => void;
}

export default function EditOrderDialog({ order, onOpenChange }: Props) {
    const queryClient = useQueryClient();

    const tCreate = useTranslations('orders.create');
    const tEdit = useTranslations('orders.edit');
    const tOrders = useTranslations('orders');
    const tCommon = useTranslations('common');
    const tVal = useTranslations("validation");

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

    // Get customers catalog data
    const { data: customersData } = useCustomers();
    const customers = customersData?.customers ?? [];

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

    // Customer select Handler
    const handleCustomerSelect = (customer: Customer) => {
        form.setValue("customerName", customer.name);
        form.setValue("customerPhone", customer.phone);
        form.setValue("customerId", customer._id);
    };


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
                paymentMethod: order.paymentMethod as "cash" | "card" | "transfer" | undefined,
                customerId: order.customerId?._id ?? undefined,
            });
        }
    }, [order, form]);


    return (
        <Dialog open={!!order} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5">
                <DialogHeader>
                    <DialogDescription>
                        { tEdit('description') }
                    </DialogDescription>
                    <DialogTitle>{ tEdit('title') }</DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit((data) => {
                        if (!order) return;

                        updateOrderMutation.mutate({ id: order._id, data });
                    })}
                    className="space-y-4"
                >

                    {/* Customer catalog section */}
                    {customers.length > 0 && (
                        <div className="space-y-1">
                            <CustomerCombobox
                                customers={customers}
                                value={form.watch("customerId") ?? ""}
                                onSelect={handleCustomerSelect}
                            />
                            <p className="text-xs text-muted-foreground px-1">
                                { tCreate('selectFromCatalog') }
                            </p>
                        </div>
                    )}

                    <div className="space-y-1">
                        <Input{...form.register("customerName")} placeholder={ tCreate('customerName') } />
                        {form.formState.errors.customerName && (
                            <p className="text-sm text-red-500">
                                { tVal('customerNameRequired') }
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("customerPhone")} placeholder={ tCreate('customerPhone') } />
                        {form.formState.errors.customerPhone && (
                            <p className="text-sm text-red-500">
                                { tVal('phoneExact') }
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
                                    { tCreate('selectFromCatalog') }
                                </p>
                            </div>
                        )
                    }

                    <div className="space-y-1">
                        <Input {...form.register("productName")} placeholder={ tCreate('productName') } />
                        {form.formState.errors.productName && (
                            <p className="text-sm text-red-500">
                                { tVal('productNameRequired') }
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
                                    { tVal('quantityMin') }
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
                                    { tVal('priceMin') }
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
                                        { tOrders('payment.unpaid') }
                                    </SelectItem>
                                    <SelectItem value="partial" className="cursor-pointer">
                                        { tOrders('payment.partial') }
                                    </SelectItem>
                                    <SelectItem value="paid" className="cursor-pointer">
                                        { tOrders('payment.paid') }
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
                                            { tOrders('payment.cash') }
                                        </SelectItem>
                                        <SelectItem value="card" className="cursor-pointer">
                                            { tOrders('payment.card') }
                                        </SelectItem>
                                        <SelectItem value="transfer" className="cursor-pointer">
                                            { tOrders('payment.transfer') }
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
                            { tCommon('cancel') }
                        </Button>

                        <Button type="submit" className="cursor-pointer" disabled={updateOrderMutation.isPending}>
                            {updateOrderMutation.isPending
                                ? tEdit('loading')
                                : tEdit('submit')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}