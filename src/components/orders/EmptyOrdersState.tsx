"use client";

import { PackageSearch, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {useTranslations} from "next-intl";

interface Props {
    hasActiveFilters: boolean;
    onClearFilters: () => void;
    onCreateOrder: () => void;
}

export default function EmptyOrdersState({ hasActiveFilters, onClearFilters, onCreateOrder }: Props) {
    // Translation function
    const t = useTranslations('orders.empty');
    const tOrders = useTranslations('orders');

    if (hasActiveFilters) {
        return (
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
                <div className="rounded-full bg-muted p-3">
                    <PackageSearch className="h-6 w-6 text-muted-foreground" />
                </div>

                <div>
                    <p className="font-medium">{ t('noResults') }</p>
                    <p className="text-sm text-muted-foreground">
                        { t('noResultsDesc') }
                    </p>
                </div>

                <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={onClearFilters}
                >
                    { t('clearFilters') }
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
                <p className="font-medium">{ t('noOrders') }</p>
                <p className="text-sm text-muted-foreground">
                    { t('noOrdersDesc') }
                </p>
            </div>

            <Button className="cursor-pointer" onClick={onCreateOrder}>
                { tOrders('newOrder') }
            </Button>
        </div>
    );
}