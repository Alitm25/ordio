"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Sun, Moon } from "lucide-react";
import ThemeToggleButton from "@/components/shared/ThemeToggleButton";

export default function LandingNavbar() {
    // Translation and locale variables
    const t = useTranslations("landing");
    const locale = useLocale();

    // Viewport active section state
    const [activeSection, setActiveSection] = useState<string>("");

    // Language toggle handler function
    const toggleLanguage = async () => {
        const newLocale = locale === "en" ? "fa" : "en";
        await fetch("/api/set-locale", {
            method: "POST",
            body: JSON.stringify({ locale: newLocale }),
        });
        window.location.reload();
    };

    // Scroll-based active section
    useEffect(() => {
        const sectionIds = ["features", "steps"];

        const observers = sectionIds.map((id) => {
            const el = document.getElementById(id);
            if (!el) return null;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveSection(id);
                        }
                    });
                },
                { threshold: 0.4 }
            );

            observer.observe(el);
            return observer;
        });

        return () => {
            observers.forEach((o) => o?.disconnect());
        };
    }, []);

    const navItems = [
        { label: t("nav.product"), href: "#features", section: "features" },
        { label: t("nav.features"), href: "#features", section: "features" },
        { label: t("nav.pricing"), href: "#steps", section: "steps" },
    ];

    return (
        <header className="sticky top-0 inset-x-0 z-50 bg-white/80 dark:bg-background/80 backdrop-blur-sm border-b border-border px-10">
            <div className="h-14 flex items-center justify-between">
                <span className="font-bold text-primary text-2xl">Ordio</span>

                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = activeSection === item.section;
                        return (
                            <a key={item.label} href={item.href}
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

                <div className="flex items-center gap-2">
                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-1.5 transition-colors hover:bg-muted"
                    >
                        {locale === "en" ? "فارسی" : "EN"}
                    </button>

                    {/* Dark Mode Toggle */}
                    <ThemeToggleButton />

                    <Link
                        href="/login"
                        className="text-sm text-muted-foreground hover:text-foreground hover:bg-muted px-4 py-2 rounded-lg transition-colors"
                    >
                        {t("nav.signIn")}
                    </Link>

                    <Link
                        href="/register"
                        className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        {t("nav.startFree")}
                    </Link>
                </div>
            </div>
        </header>
    );
}