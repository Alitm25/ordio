"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// @ts-ignore
import ProductCombobox from "@/components/products/ProductCombobox";
import { useProducts } from "@/features/products/hooks/useProducts";
import { Input } from "@/components/ui/input";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { createOrderSchema, CreateOrderFormValues } from "@/features/orders/schemas/createOrderSchema";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import { refreshOrderQueries } from "@/features/orders/refreshOrderQueries";
import {createOrder} from "@/features/orders/services/createOrders";
import {Button} from "@/components/ui/button";
import {useCustomers} from "@/features/customers/hooks/useCustomer";
import {Customer} from "@/types/customer";
import CustomerCombobox from "@/components/customers/CustomerCombobox";
import {useLocale, useTranslations} from "next-intl";
import {Product} from "@/types/product";
import {Plus, Trash2} from "lucide-react";
import {toast} from "sonner";
import {getErrorMessage} from "@/lib/getErrorMessage";


interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function CreateOrderDialog({open, onOpenChange}: Props) {
    const queryClient = useQueryClient();
    const locale = useLocale();
    const dir = locale === 'fa' ? "rtl" : "ltr";

    // Translation variables
    const tCreate = useTranslations("orders.create");
    const tOrder = useTranslations("orders");
    const tCommon = useTranslations("common");
    const tVal = useTranslations("validation");
    const tCustomers = useTranslations("customers");
    const tProducts = useTranslations("products");
    const tNotif = useTranslations("orders.notifications");

    // Create Order mutation function declaration
    const createOrderMutation = useMutation({
        mutationFn: createOrder,
        onSuccess: () => {
            refreshOrderQueries(queryClient); // orders, stock and dashboard
            toast.success(tNotif("createSuccess"));
            form.reset();
            onOpenChange(false);
        },
        onError: (error) => {
            const message = getErrorMessage(error, tNotif("createError"));

            if (message.includes("Insufficient stock")) {
                toast.error(`${tNotif("insufficientStock")}: ${message.split('"')[1]}`);
            } else {
                toast.error(message);
            }
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
            customerId: undefined,
            items: [
                {
                    productName: "",
                    quantity: 1,
                    price: 0,
                    productId: undefined,
                }
            ],
            paymentStatus: 'unpaid',
        },
    });

    // useFieldArray of RHF for controlling dynamic arrays of create order form
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items'
    })

    const paymentStatus = form.watch("paymentStatus")

    //total amount of orders price
    const watchedItems = form.watch('items');
    const totalAmount = watchedItems.reduce(
        (sum, item) => sum + (item.quantity ?? 0) * (item.price ?? 0), 0
    )

    // Customer select Handler
    const handleCustomerSelect = (customer: Customer) => {
        form.setValue("customerName", customer.name);
        form.setValue("customerPhone", customer.phone);
        form.setValue("customerId", customer._id);
    };

    // Product select Handler
    const handleProductSelect = (product: Product, index: number) => {
        form.setValue(`items.${index}.productName`, product.name);
        form.setValue(`items.${index}.price`, product.price);
        form.setValue(`items.${index}.productId`, product._id);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{tCreate("title")}</DialogTitle>
                    <DialogDescription>{tCreate("description")}</DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={form.handleSubmit((data) =>
                        createOrderMutation.mutate(data)
                    )}
                    className="space-y-6"
                >
                    {/* Customer section */}
                    <div className="space-y-3">
                        {customers.length > 0 && (
                            <div className="space-y-1">
                                <CustomerCombobox
                                    customers={customers}
                                    value={form.watch("customerId") ?? ""}
                                    onSelect={handleCustomerSelect}
                                    placeholder={tCustomers("selectFromList")}
                                />
                                <p className="text-xs text-muted-foreground px-1">
                                    {tCreate("selectFromCatalog")}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Input
                                    {...form.register("customerName")}
                                    placeholder={tCreate("customerName")}
                                />
                                {form.formState.errors.customerName && (
                                    <p className="text-sm text-red-500">
                                        {tVal("customerNameRequired")}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1">
                                <Input
                                    {...form.register("customerPhone")}
                                    placeholder={tCreate("customerPhone")}
                                />
                                {form.formState.errors.customerPhone && (
                                    <p className="text-sm text-red-500">
                                        {tVal("phoneMin")}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Order Items section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                                {tCreate("items")}
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="cursor-pointer"
                                onClick={() =>
                                    append({
                                        productName: "",
                                        quantity: 1,
                                        price: 0,
                                        productId: undefined,
                                    })
                                }
                            >
                                <Plus className="h-4 w-4 me-1" />
                                {tCreate("addItem")}
                            </Button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={field.id} className="rounded-lg border p-3 space-y-3">
                                {products.length > 0 && (
                                    <ProductCombobox
                                        products={products}
                                        value={
                                            form.watch(
                                                `items.${index}.productName`
                                            ) ?? ""
                                        }
                                        onSelect={(product) =>
                                            handleProductSelect(product, index)
                                        }
                                        placeholder={tProducts(
                                            "selectFromCatalog"
                                        )}
                                    />
                                )}

                                <div className="grid grid-cols-3 gap-2">
                                    <div className="col-span-3 sm:col-span-1 space-y-1">
                                        <Input
                                            {...form.register(
                                                `items.${index}.productName`
                                            )}
                                            placeholder={tCreate("productName")}
                                        />
                                        {form.formState.errors.items?.[index]
                                            ?.productName && (
                                            <p className="text-sm text-red-500">
                                                {tVal("productNameRequired")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Input type="number"
                                            {...form.register(
                                                `items.${index}.quantity`,
                                                { valueAsNumber: true }
                                            )}
                                            placeholder={tCreate("quantity")}
                                        />
                                        {form.formState.errors.items?.[index]
                                            ?.quantity && (
                                            <p className="text-sm text-red-500">
                                                {tVal("quantityMin")}
                                            </p>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Input type="number"
                                            {...form.register(
                                                `items.${index}.price`,
                                                { valueAsNumber: true }
                                            )}
                                            placeholder={tCreate("price")}
                                        />
                                        {form.formState.errors.items?.[index]
                                            ?.price && (
                                            <p className="text-sm text-red-500">
                                                {tVal("priceZero")}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">
                                        {tCreate("subtotal")}:{" "}
                                        <span className="font-medium text-foreground">
                                            {(
                                                (form.watch(
                                                    `items.${index}.quantity`
                                                ) ?? 0) *
                                                (form.watch(
                                                    `items.${index}.price`
                                                ) ?? 0)
                                            ).toLocaleString()}
                                        </span>
                                    </span>

                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="cursor-pointer text-destructive hover:text-destructive"
                                            onClick={() => remove(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {form.formState.errors.items?.root && (
                            <p className="text-sm text-red-500">
                                {form.formState.errors.items.root.message}
                            </p>
                        )}

                        {/* total amount section */}
                        <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                            <span className="font-medium">
                                {tCreate("total")}
                            </span>
                            <span className="text-lg font-bold">
                                {totalAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* payment section */}
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
                                            <SelectValue
                                                placeholder={tCreate(
                                                    "paymentStatus"
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent dir={dir}>
                                            <SelectItem value="unpaid" className="cursor-pointer">
                                                {tOrder("payment.unpaid")}
                                            </SelectItem>
                                            <SelectItem value="partial" className="cursor-pointer">
                                                {tOrder("payment.partial")}
                                            </SelectItem>
                                            <SelectItem value="paid" className="cursor-pointer">
                                                {tOrder("payment.paid")}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>

                        {paymentStatus !== "unpaid" && (
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
                                                <SelectValue
                                                    placeholder={tCreate(
                                                        "paymentMethod"
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent dir={dir}>
                                                <SelectItem value="cash" className="cursor-pointer">
                                                    {tOrder("payment.cash")}
                                                </SelectItem>
                                                <SelectItem value="card" className="cursor-pointer">
                                                    {tOrder("payment.card")}
                                                </SelectItem>
                                                <SelectItem value="transfer" className="cursor-pointer">
                                                    {tOrder("payment.transfer")}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => onOpenChange(false)}
                        >
                            {tCommon("cancel")}
                        </Button>
                        <Button
                            type="submit"
                            className="cursor-pointer"
                            disabled={createOrderMutation.isPending}
                        >
                            {createOrderMutation.isPending
                                ? tCreate("loading")
                                : tCreate("submit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>    );
}