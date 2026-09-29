"use client"

import Link from "next/link";
import ShapeGrid from "@/components/ui/ShapeGrid";
import {useTranslations} from "next-intl";

export default function Cta() {
    const t = useTranslations("landing");

    return (
        <section className="relative isolate overflow-hidden py-24 px-6 bg-secondary">
            {/* Background animation */}
            <div className="absolute inset-0 z-0">
                <ShapeGrid
                    speed={0.47}
                    squareSize={40}
                    borderColor="#5B5BD6"
                    shape='square'
                    hoverTrailAmount={2}
                    direction="down"
                    hoverFillColor="#5B5BD6"
                />
            </div>

            {/* CTA Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold text-foreground mb-3">
                    {t("cta.title")}
                </h2>

                <p className="text-xl text-muted-foreground mb-10">
                    {t("cta.subtitle")}
                </p>

                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors"
                >
                    {t("cta.button")} →
                </Link>
            </div>
        </section>
    )
}