"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

export default function LanguageToggle() {
    // Get the current language
    const locale = useLocale();
    // controlling the isPending situation with useTransition hook
    const [isPending, startTransition] = useTransition();

    const toggleLanguage = () => {
        // current language variable
        const newLocale = locale === "en" ? "fa" : "en";


        startTransition(async () => {
            const response = await fetch("/api/set-locale", {
                method: "POST",
                body: JSON.stringify({ locale: newLocale }),
            });

            if (response.ok) {
                window.location.reload();
            }
        });
    };

    return (
        <Button variant="outline" size="sm"
        onClick={toggleLanguage} disabled={isPending}
        className="cursor-pointer font-medium">
            {locale === "en" ? "فارسی" : "English"}
        </Button>
    );
}