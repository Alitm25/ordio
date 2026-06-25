import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DashboardSkeleton() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-40" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6 flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <Skeleton className="h-5 w-28" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-65 w-full" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-28" />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                        <Skeleton className="h-50 w-50 rounded-full" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-9 w-9 rounded-full" />
                                <div className="space-y-1.5">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-20" />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}