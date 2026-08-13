"use client"

import {useParams, useRouter} from "next/navigation";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {Order} from "@/types/order";
import {getOrderById} from "@/features/orders/services/getOrderById";
import {deleteOrder} from "@/features/orders/services/deleteOrder";
import {toast} from "sonner";
import {Skeleton} from "@/components/ui/skeleton";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Pencil, Trash2} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import EditOrderDialog from "@/components/orders/EditOrderDialog";
import {
    AlertDialog,
    AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useLocale, useTranslations} from "next-intl";
import {formatDate} from "@/lib/formatDate";

export default function OrderDetailsPage() {
    // Get the URL parameters (ID)
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    // Get queryClient for refetching page
    const queryClient = useQueryClient();
    // delete and edit dialog handler states
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState<Order | null>(null);

    // locale variable
    const locale = useLocale();

    // Translation Function
    const tDetails = useTranslations('orders.details');
    const tOrders = useTranslations('orders');
    const tCommon = useTranslations('common');
    const tToast = useTranslations('toast.order');

    // Get the specific order fetch function
    const { data, isLoading, error } = useQuery({
        queryKey: ["order", id],
        queryFn: () => getOrderById(id),
    });

    // Delete order mutation function
    const deleteOrderMutation = useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
            toast.success( tToast('orderDelete') );
            router.push("/orders");
        },
        onError: () => {
            toast.error( tToast('orderDeleteError') );
        },
    });

    // Loading JSX
    if (isLoading) {
        return (
            <div className="space-y-6 max-w-2xl">
                <Skeleton className="h-9 w-32" />
                <div className="space-y-4">
                    <Skeleton className="h-48 w-full rounded-xl" />
                    <Skeleton className="h-36 w-full rounded-xl" />
                </div>
            </div>
        );
    }

    // Error state JSX
    if (error || !data) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <p className="font-medium">{ tDetails('notFound') }</p>
                <Link href="/orders">
                    <Button variant="outline" className="cursor-pointer">
                        { tDetails('backButton') }
                    </Button>
                </Link>
            </div>
        );
    }

    const order = data.order;

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center justify-between">
                <Link href={'/orders'} className={'flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors'}>
                    <ArrowLeft className={'h-4 w-4'}/>
                    <span className={'text-sm'}>{ tDetails('backButton') }</span>
                </Link>

                {/* Edit and Delete buttons */}
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => setEditingOrder(order)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        { tCommon('edit') }
                    </Button>
                    <Button variant="destructive" size="sm" className="cursor-pointer" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        { tCommon('delete') }
                    </Button>
                </div>
            </div>

            {/* Orders Detail Card START */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>{ tDetails('title') }</span>
                            <OrderStatusBadge status={order.status} />
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    { tDetails('product') }
                                </p>
                                <p className="font-medium">{order.productName}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    { tDetails('quantity') }
                                </p>
                                <p className="font-medium">{order.quantity}</p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    { tDetails('price') }
                                </p>
                                <p className="font-medium">
                                    {order.price.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    { tDetails('date') }
                                </p>
                                <p className="font-medium">
                                    {formatDate(order.createdAt, locale)}
                                </p>
                            </div>
                        </div>

                        <div className="border-t pt-4 grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    { tDetails('paymentStatus') }
                                </p>
                                <span
                                    className={`inline-flex rounded border px-2 py-0.5 text-xs font-medium ${
                                        order.paymentStatus === "paid"
                                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                                            : order.paymentStatus === "partial"
                                                ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                                                : "border-muted-foreground/20 bg-muted text-muted-foreground"
                                    }`}
                                >
                                    {order.paymentStatus === "paid"
                                        ? tOrders('payment.paid')
                                        : order.paymentStatus === "partial"
                                            ? tOrders('payment.partial')
                                            : tOrders('payment.unpaid') }
                                </span>
                            </div>

                            {order.paymentMethod && (
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">
                                        { tDetails('paymentMethod') }
                                    </p>
                                    <p className="font-medium capitalize">
                                        { tOrders(`payment.${order.paymentMethod}`) }
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            {/* Orders Detail Card START */}

            {/* Customer Detail Card START */}
                <Card>
                    <CardHeader>
                        <CardTitle>{ tDetails('customer') }</CardTitle>
                    </CardHeader>

                    <CardContent className={'space-y-3'}>
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                {order.customerName.charAt(0).toUpperCase()}
                            </div>

                            <div>
                                <p className="font-medium">{order.customerName}</p>
                                <a href={`tel:${order.customerPhone}`}>{order.customerPhone}</a>
                            </div>
                        </div>

                        {order.customerId && (
                            <Link href={`/customers`}>
                                <Button variant="outline" size="sm" className="cursor-pointer mt-2">
                                    { tDetails('viewCustomerProfile') }
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            {/* Customer Detail Card END */}

            <EditOrderDialog
                order={editingOrder}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingOrder(null);
                        queryClient.invalidateQueries({
                            queryKey: ["order", id],
                        });
                    }
                }}
            />

            <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{ tOrders('delete.title') }</AlertDialogTitle>
                        <AlertDialogDescription>
                            { tOrders('delete.description') }{" "}
                            <strong>{order.customerName}</strong>.
                            <br/>
                            { tOrders('delete.cannotUndo') }
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">
                            { tCommon('cancel') }
                        </AlertDialogCancel>
                        <AlertDialogAction
                            className="cursor-pointer bg-red-800 text-white hover:bg-red-700"
                            disabled={deleteOrderMutation.isPending}
                            onClick={() =>
                                deleteOrderMutation.mutate(order._id)
                            }
                        >
                            {deleteOrderMutation.isPending
                                ? tCommon('deleting')
                                : tCommon('delete') }
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}