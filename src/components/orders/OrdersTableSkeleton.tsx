import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersTableSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-4 w-28" />

            <div className="rounded-xl border bg-card">
                <div className="divide-y">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4 px-4 py-4">
                            <Skeleton className="h-4 w-4 rounded" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-8 w-36 rounded-md" />
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                            <div className="ml-auto flex gap-2">
                                <Skeleton className="h-8 w-8 rounded-md" />
                                <Skeleton className="h-8 w-8 rounded-md" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}