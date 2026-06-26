"use client";

import { PackageSearch, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onCreateOrder: () => void;
}

export default function EmptyOrdersState({ hasActiveFilters, onClearFilters, onCreateOrder }: Props) {
    if (hasActiveFilters) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <div className="rounded-full bg-muted p-3">
                    <PackageSearch className="h-6 w-6 text-muted-foreground" />
                </div>

                <div>
                    <p className="font-medium">No orders match your filters</p>
                    <p className="text-sm text-muted-foreground">
                        Try adjusting your search or status filter.
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={onClearFilters}
                >
                    Clear filters
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
            <div className="rounded-full bg-muted p-3">
                <PackageOpen className="h-6 w-6 text-muted-foreground" />
            </div>

            <div>
                <p className="font-medium">No orders yet</p>
                <p className="text-sm text-muted-foreground">
                    Create your first order to get started.
                </p>
            </div>

            <Button className="cursor-pointer" onClick={onCreateOrder}>
                + New Order
            </Button>
        </div>
    );
}