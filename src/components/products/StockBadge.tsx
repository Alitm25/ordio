import { useTranslations } from "next-intl";

// The minimum number each item stock for comparison
const LOW_STOCK_THRESHOLD = 5;

interface Props {
    stock: number | null;
}

export default function StockBadge({ stock }: Props) {
    const t = useTranslations("products");

    if (stock === null) return null;


    if (stock === 0) {
        return (
            <span className="rounded border px-2 py-0.5 text-xs font-medium border-red-500/30 bg-red-500/10 text-red-500">
                {t("outOfStock")}
            </span>
        );
    }

    if (stock <= LOW_STOCK_THRESHOLD) {
        return (
            <span className="rounded border px-2 py-0.5 text-xs font-medium border-amber-500/30 bg-amber-500/10 text-amber-500">
                {t("lowStock")} ({stock})
            </span>
        );
    }

    return (
        <span className="rounded border px-2 py-0.5 text-xs font-medium border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
            {t("inStock")} ({stock})
        </span>
    );
}