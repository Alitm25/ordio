import { Badge } from "@/components/ui/badge";

interface Props {
    status: string;
}

export default function OrderStatusBadge({
                                             status,
                                         }: Props) {
    switch (status) {
        case "pending":
            return (
                <Badge variant="secondary" className={'border-amber-500/30 bg-amber-500/10 text-amber-500'}>
                    Pending
                </Badge>
            );
        case "processing":
            return (
                <Badge className={'border-blue-500/30 bg-blue-500/10 text-blue-400'}>
                    Processing
                </Badge>
            );
        case "completed":
            return (
                <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    Completed
                </Badge>
            );
        case "cancelled":
            return (
                <Badge variant="destructive" className={'border-red-500/30 bg-red-500/10 text-red-400'}>
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