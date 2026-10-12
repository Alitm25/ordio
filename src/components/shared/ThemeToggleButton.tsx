"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useTranslations } from "next-intl";

const BOX = "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border";

export default function ThemeToggleButton() {
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useIsMounted();
    const t = useTranslations("common");

    // The theme is only known in the browser. Until then, hold the exact same space
    // so the navbar doesn't jump when the real button appears.
    if (!mounted) {
        return <span className={BOX} aria-hidden="true" />;
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            type="button"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={isDark ? t("switchToLight") : t("switchToDark")}
            className={`${BOX} bg-background text-foreground transition-colors hover:bg-muted cursor-pointer`}
        >
            {isDark ? (
                <Sun className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </button>
    );
}
