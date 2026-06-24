import { Badge } from "@/components/ui/badge";
import {orderStatusColors} from "@/lib/orderStatusColors";

interface Props {
    status: string;
}

export default function OrderStatusBadge({
                                             status,
                                         }: Props) {
    switch (status) {
        case "pending":
            return (
                <Badge variant="secondary" className={orderStatusColors.pending}>
                    Pending
                </Badge>
            );
        case "processing":
            return (
                <Badge className={orderStatusColors.processing}>
                    Processing
                </Badge>
            );
        case "completed":
            return (
                <Badge className={orderStatusColors.completed}>
                    Completed
                </Badge>
            );
        case "cancelled":
            return (
                <Badge variant="destructive" className={orderStatusColors.cancelled}>
                    Cancelled
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