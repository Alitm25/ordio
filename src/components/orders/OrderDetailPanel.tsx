"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/features/orders/services/getOrderById";
import { Button } from "@/components/ui/button";
import { X, Pencil, Trash2, Phone } from "lucide-react";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { formatDate } from "@/lib/formatDate";


interface Props {
    orderId: string;
    onClose: () => void;
    onEdit: (order: any) => void;
    onDelete: (order: any) => void;
}

export default function OrderDetailPanel({ orderId, onClose, onEdit, onDelete }: Props) {
    // Translation variable
    const locale = useLocale();
    const tOrder = useTranslations("orders");
    const tDetails = useTranslations("orders.details");
    const tCommon = useTranslations("common");

    // Order API fetch function
    const { data, isLoading } = useQuery({
        queryKey: ["order", orderId],
        queryFn: () => getOrderById(orderId),
        enabled: !!orderId,
    });

    const order = data?.order;

    return (
        <div className="flex flex-col h-full border-s bg-card">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={onClose}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    {order && (
                        <OrderStatusBadge status={order.status} />
                    )}
                </div>

                {order && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => onEdit(order)}
                        >
                            <Pencil className="h-4 w-4 me-1" />
                            {tCommon("edit")}
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                            onClick={() => onDelete(order)}
                        >
                            <Trash2 className="h-4 w-4 me-1" />
                            {tCommon("delete")}
                        </Button>
                    </div>
                )}
            </div>

            {/* Order content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Skeleton Loading */}
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-24 w-full rounded-lg" />
                        <Skeleton className="h-40 w-full rounded-lg" />
                    </div>
                ) : !order ? (
                    <p className="text-muted-foreground text-sm">
                        {tDetails("notFound")}
                    </p>
                ) : (
                    <div>
                        {/* Customer details */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {tDetails("customer")}
                            </p>
                            <div className="flex items-center gap-3 rounded-lg border p-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {order.customerName.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {order.customerName}
                                    </p>
                                    <a href={`tel:${order.customerPhone}`} className="text-sm text-primary flex items-center gap-1 hover:underline">
                                        <Phone className="h-3 w-3" />
                                        {order.customerPhone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Items section */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {tDetails("title")}
                            </p>

                            <div className="rounded-lg border overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted/50">
                                    <tr>
                                        <th className="text-start px-3 py-2 font-medium">
                                            {tOrder("table.product")}
                                        </th>
                                        <th className="text-center px-3 py-2 font-medium">
                                            {tDetails("quantity")}
                                        </th>
                                        <th className="text-end px-3 py-2 font-medium">
                                            {tDetails("price")}
                                        </th>
                                        <th className="text-end px-3 py-2 font-medium">
                                            {tOrder("table.price")}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                    {order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-3 py-2">
                                                {item.productName}
                                            </td>
                                            <td className="px-3 py-2 text-center">
                                                {item.quantity}
                                            </td>
                                            <td className="px-3 py-2 text-end">
                                                {item.price.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-2 text-end font-medium">
                                                {item.subtotal.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Sub Total */}
                            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                                <span className="font-medium">
                                    {tOrder("total")}
                                </span>
                                <span className="text-lg font-bold">
                                    {order.totalAmount.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment section details */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {tDetails("paymentStatus")}
                            </p>
                            <div className="rounded-lg border p-3 grid grid-cols-2 gap-3">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {tDetails("paymentStatus")}
                                    </p>
                                    <span className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                        order.paymentStatus === "paid"
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                            : order.paymentStatus === "partial"
                                                ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                                                : "border-muted-foreground/20 bg-muted text-muted-foreground"
                                    }`}>
                                        {order.paymentStatus === "paid"
                                            ? tOrder("payment.paid")
                                            : order.paymentStatus === "partial"
                                                ? tOrder("payment.partial")
                                                : tOrder("payment.unpaid")}
                                    </span>
                                </div>

                                {order.paymentMethod && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            {tDetails("paymentMethod")}
                                        </p>
                                        <p className="font-medium capitalize">
                                            {tOrder(`payment.${order.paymentMethod}`)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                {tDetails("date")}
                            </p>
                            <p
                                className="text-sm"
                                suppressHydrationWarning
                            >
                                {formatDate(order.createdAt, locale)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}