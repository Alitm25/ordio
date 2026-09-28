"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import CursorGrid from "@/components/ui/CursorGrid";

export default function HeroSection() {
    const t = useTranslations("landing");

    return (
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
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
            <div className="pointer-events-none absolute inset-x-0 top-120 h-45 z-10 bg-linear-to-b from-transparent via-background/60 to-background"/>


            <div className="relative max-w-3xl mx-auto text-center">
                <span className="inline-block text-sm text-primary font-medium mb-6">
                    {t("hero.badge")}
                </span>

                <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight mb-6">
                    {t("hero.title")}
                </h1>

                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                    {t("hero.description")}
                </p>

                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        {t("hero.cta")} →
                    </Link>

                    <a href="#steps" className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3 rounded-lg font-medium hover:bg-muted transition-colors">
                        {t("hero.secondary")}
                    </a>
                </div>
            </div>
        </section>
    );
}