"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ThemeToggleButton from "@/components/shared/ThemeToggleButton";
import Logo from "@/components/shared/Logo";
import { useToggleLocale } from "@/hooks/useToggleLocale";

// Sections that have a link in the navbar
const SECTION_IDS = ["features", "steps", "faq"];

export default function LandingNavbar() {
    // Translation and locale variables
    const t = useTranslations("landing");
    const { locale, isPending, toggleLocale } = useToggleLocale();

    // Viewport active section state
    const [activeSection, setActiveSection] = useState<string>("");

    // Scroll-based active section
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    } else {
                        // leaving a section (e.g. scrolling back up to the hero) switches its link off
                        setActiveSection((current) => (current === entry.target.id ? "" : current));
                    }
                });
            },
            // A thin band (1% tall) across the middle of the screen: the section crossing it is the active one.
            // (A percentage threshold fails on phones, where a section is taller than the screen.)
            { rootMargin: "-49% 0px -50% 0px" }
        );

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const navItems = [
        { label: t("nav.features"), href: "#features", section: "features" },
        { label: t("nav.howItWorks"), href: "#steps", section: "steps" },
        { label: t("nav.faq"), href: "#faq", section: "faq" },
    ];

    return (
        <header className="sticky top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border px-4 md:px-10">
            {/* 3 columns on desktop: [1fr | auto | 1fr]. Both side columns get the SAME width,
                so the nav sits in the true center no matter how wide the logo or the buttons are */}
            <div className="h-14 flex items-center justify-between gap-3 md:grid md:grid-cols-[1fr_auto_1fr]">
                <Link href="/" aria-label={t("nav.home")} className="justify-self-start">
                    <Logo size={28} priority textClassName="text-2xl text-primary" />
                </Link>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.section;
                        return (
                            <a key={item.section} href={item.href}
                            aria-current={isActive ? "true" : undefined}
                            className={`relative px-4 py-4 text-sm transition-colors group ${
                                isActive
                                    ? "text-primary font-medium"
                                    : "text-muted-foreground hover:text-primary"
                                }`}
                            >
                                {item.label}
                                <span className={`absolute bottom-0 inset-x-4 h-0.5 bg-primary rounded-full transition-transform duration-200 ease-out ${
                                    isActive
                                        ? "scale-x-100"
                                        : "scale-x-0 group-hover:scale-x-100"
                                    }`}
                                />
                            </a>
                        );
                    })}
                </nav>

                <div className="flex items-center gap-2 justify-self-end">
                    {/* Language Toggle */}
                    <button
                        type="button"
                        onClick={toggleLocale}
                        disabled={isPending}
                        lang={locale === "en" ? "fa" : "en"}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors hover:bg-muted cursor-pointer disabled:opacity-50"
                    >
                        {locale === "en" ? "فارسی" : "EN"}
                    </button>

                    {/* Dark Mode Toggle */}
                    <ThemeToggleButton />

                    {/* Hidden on small phones: there's only room for one main button there */}
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-colors"
                    >
                        {t("nav.signIn")}
                    </Link>

                    <Link
                        href="/register"
                        className="whitespace-nowrap text-sm bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {t("nav.startFree")}
                    </Link>
                </div>
            </div>
        </header>
    );
}
