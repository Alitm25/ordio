import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PackageSearch } from "lucide-react";
import {useTranslations} from "next-intl";

export default function NotFound() {
    // Translation function
    const t = useTranslations('notFound');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-4 text-center">
            <div className="rounded-full bg-muted p-6">
                <PackageSearch className="h-12 w-12 text-muted-foreground" />
            </div>

            <div className="space-y-2">
                <h1 className="text-6xl font-bold">404</h1>
                <h2 className="text-xl font-semibold">{ t('title') }</h2>
                <p className="text-muted-foreground max-w-sm">
                    { t('description') }
                </p>
            </div>

            <div className="flex gap-3">
                <Button asChild className="cursor-pointer">
                    <Link href="/dashboard">{ t('goToDashboard') }</Link>
                </Button>

                <Button asChild variant="outline" className="cursor-pointer">
                    <Link href="/orders">{ t('viewOrders') }</Link>
                </Button>
            </div>
        </div>
    );
}