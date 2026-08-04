import { Badge } from "@/components/ui/badge";
import {orderStatusColors} from "@/lib/orderStatusColors";
import {useTranslations} from "next-intl";

interface Props {
    status: string;
}

export default function OrderStatusBadge({status}: Props) {
    // Translation Function
    const t = useTranslations('orders.status')

    switch (status) {
        case "pending":
            return (
                <Badge variant="secondary" className={orderStatusColors.pending}>
                    { t('pending') }
                </Badge>
            );
        case "processing":
            return (
                <Badge className={orderStatusColors.processing}>
                    { t('processing') }
                </Badge>
            );
        case "completed":
            return (
                <Badge className={orderStatusColors.completed}>
                    { t('completed') }
                </Badge>
            );
        case "cancelled":
            return (
                <Badge variant="destructive" className={orderStatusColors.cancelled}>
                    { t('cancelled') }
                </Badge>
            );
        default:
            return (
                <Badge variant="outline">
                    {status}
                </Badge>
            );
    }
}