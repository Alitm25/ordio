"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import CursorGrid from "@/components/ui/CursorGrid";

export default function HeroSection() {
    const t = useTranslations("landing");

    return (
        <section className="relative pt-20 pb-20 md:pt-32 md:pb-24 px-6 overflow-hidden">
            <div className="absolute inset-0">
                <CursorGrid
                    cellSize={60}
                    color="#5B5BD6"
                    radius={140}
                    falloff="sharp"
                    holdTime={400}
                    fadeDuration={800}
                    lineWidth={1.2}
                    maxOpacity={1}
                    fillOpacity={0}
                    gridOpacity={0.1}
                    cellRadius={0}
                    clickPulse
                    pulseSpeed={900}
                />
            </div>
            {/* Fade the grid into the next section: pinned to the BOTTOM (not a fixed top offset),
                and kept below the content (z-0 vs z-10) so it never covers text or buttons */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 z-0 bg-linear-to-b from-transparent via-background/60 to-background"/>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                <span className="inline-block text-sm text-primary font-medium mb-6">
                    {t("hero.badge")}
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6 text-balance">
                    {t("hero.title")}
                </h1>

                <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t("hero.description")}
                </p>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        {t("hero.cta")}
                        {/* "forward" points left in Persian (RTL) */}
                        <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                    </Link>

                    <a href="#steps" className="inline-flex items-center gap-2 border border-border bg-background/60 text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                        {t("hero.secondary")}
                    </a>
                </div>
            </div>
        </section>
    );
}
