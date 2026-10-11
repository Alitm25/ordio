"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";

export type AppLocale = "en" | "fa";

// Switch between English and Persian: save the choice in a cookie, then reload so the server renders the new language
export function useToggleLocale() {
    const locale = useLocale() as AppLocale;
    const [isPending, startTransition] = useTransition();

    const changeLocale = (newLocale: AppLocale) => {
        if (newLocale === locale) return;

        startTransition(async () => {
            const response = await fetch("/api/set-locale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ locale: newLocale }),
            });

            // only reload when the cookie was really saved
            if (response.ok) {
                window.location.reload();
            }
        });
    };

    const toggleLocale = () => changeLocale(locale === "en" ? "fa" : "en");

    return { locale, isPending, changeLocale, toggleLocale };
}
