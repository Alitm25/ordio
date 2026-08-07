"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// @ts-ignore
import ProductCombobox from "@/components/products/ProductCombobox";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Input } from "@/components/ui/input";
import {Controller, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createOrderSchema, CreateOrderFormValues } from "@/features/orders/schemas/createOrderSchema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createOrder} from "@/features/orders/services/createOrders";
import {Button} from "@/components/ui/button";
import {useCustomers} from "@/features/customers/hooks/useCustomer";
import {Customer} from "@/types/customer";
import CustomerCombobox from "@/components/customers/CustomerCombobox";
import {useTranslations} from "next-intl";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateOrderDialog({open, onOpenChange}: Props) {
    const queryClient = useQueryClient();

    const tCreate = useTranslations('orders.create');
    const tOrder = useTranslations('orders');
    const tCommon = useTranslations('common');


    // Create Order mutation function declaration
    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            form.reset();
            onOpenChange(false);
        }
    });

    // Get products catalog data
    const { data: productsData } = useProducts();
    const products = productsData?.products ?? [];

    // Get customers catalog data
    const { data: customersData } = useCustomers();
    const customers = customersData?.customers ?? [];

    // Create Order Form default values initialization
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

    const paymentStatus = form.watch("paymentStatus")

    // Customer select Handler
    const handleCustomerSelect = (customer: Customer) => {
        form.setValue("customerName", customer.name);
        form.setValue("customerPhone", customer.phone);
        form.setValue("customerId", customer._id);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-137.5">
                <DialogHeader>
                    <DialogDescription>
                        { tCreate('description') }
                    </DialogDescription>
                    <DialogTitle>
                        { tCreate('title') }
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={form.handleSubmit((data) => {
                        createOrderMutation.mutate(data);
                    })} className={'space-y-4'}>

                    {/* Customer catalog section */}
                    {customers.length > 0 && (
                        <div className="space-y-1">
                            <CustomerCombobox
                                customers={customers}
                                value={form.watch("customerId") ?? ""}
                                onSelect={handleCustomerSelect}
                                placeholder={ tCreate('selectFromCatalog') }
                            />
                        </div>
                    )}

                    <div className="space-y-1">
                        <Input {...form.register("customerName")} placeholder={ tCreate('customerName') }/>
                        {
                            form.formState.errors.customerName && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.customerName.message}
                            </p>)
                        }
                    </div>

                    <div className="space-y-1">
                        <Input {...form.register("customerPhone")} placeholder={ tCreate('customerPhone') }/>
                        {
                            form.formState.errors.customerPhone && (
                                <p className="text-sm text-red-500">
                                    {form.formState.errors.customerPhone.message}
                                </p>)
                        }
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
                                    placeholder={ tCreate('selectFromCatalog') }
                                />
                            </div>
                        )
                    }

                    <div className="space-y-1">
                        <Input {...form.register("productName")} placeholder={ tCreate('productName') }/>
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

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Controller
                                control={form.control}
                                name="paymentStatus"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger className="w-full cursor-pointer">
                                            <SelectValue placeholder={ tCreate('paymentStatus') } />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unpaid" className="cursor-pointer">
                                                { tOrder('payment.unpaid') }
                                            </SelectItem>
                                            <SelectItem value="partial" className="cursor-pointer">
                                                { tOrder('payment.partial') }
                                            </SelectItem>
                                            <SelectItem value="paid" className="cursor-pointer">
                                                { tOrder('payment.paid') }
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        { paymentStatus !== "unpaid" && (
                            <div className="space-y-1">
                                <Controller
                                    control={form.control}
                                    name="paymentMethod"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value ?? ""}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue placeholder={ tCreate('paymentMethod') }/>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="cash" className="cursor-pointer">
                                                    { tOrder('payment.cash') }
                                                </SelectItem>
                                                <SelectItem value="card" className="cursor-pointer">
                                                    { tOrder('payment.card') }
                                                </SelectItem>
                                                <SelectItem value="transfer" className="cursor-pointer">
                                                    { tOrder('payment.transfer') }
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" className={'cursor-pointer'} onClick={() => onOpenChange(false)}>
                            { tCommon('cancel') }
                        </Button>

                        <Button type="submit" className={'cursor-pointer'} disabled={createOrderMutation.isPending}>
                            {createOrderMutation.isPending
                                ?  tCreate('loading')
                                : tCreate('submit') }
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}