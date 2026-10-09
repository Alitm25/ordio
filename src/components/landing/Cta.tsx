"use client"

import Link from "next/link";
import ShapeGrid from "@/components/ui/ShapeGrid";
import {useTranslations} from "next-intl";
import { ArrowRight } from "lucide-react";

// Hide the grid in the middle (behind the text) and show it towards the edges
const GRID_MASK = "radial-gradient(ellipse 60% 70% at center, transparent 30%, black 80%)";

export default function Cta() {
    const t = useTranslations("landing");

    return (
        <section className="relative isolate overflow-hidden py-24 px-6 bg-secondary">
            {/* Background animation */}
            <div
                className="absolute inset-0 z-0 opacity-50"
                style={{ maskImage: GRID_MASK, WebkitMaskImage: GRID_MASK }}
            >
                <ShapeGrid
                    speed={0.47}
                    squareSize={40}
                    borderColor="#5B5BD6"
                    shape='square'
                    hoverTrailAmount={8}
                    direction="down"
                    hoverFillColor="#5B5BD6"
                />
            </div>

            {/* Top fade */}
            <div
                className="absolute inset-x-0 top-0 z-1 h-32 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
            />

            {/* Bottom fade */}
            <div
                className="absolute inset-x-0 bottom-0 z-1 h-32 pointer-events-none"
                style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
            />

            {/* CTA Content */}
            <div className="relative z-10 max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3 text-balance">
                    {t("cta.title")}
                </h2>

                <p className="text-lg md:text-xl text-muted-foreground mb-10">
                    {t("cta.subtitle")}
                </p>

                <Link
                    href="/register"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors"
                >
                    {t("cta.button")}
                    <ArrowRight className="h-5 w-5 rtl:rotate-180" aria-hidden="true" />
                </Link>
            </div>
        </section>
    )
}
