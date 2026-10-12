"use client";

import { useId, type ReactNode } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, SlidersHorizontal, Sun } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/useIsMounted";
import { type AppLocale, useToggleLocale } from "@/hooks/useToggleLocale";

interface Option<T extends string> {
    value: T;
    label: ReactNode;
    lang?: string;
}

interface SegmentedControlProps<T extends string> {
    labelId: string;
    options: Option<T>[];
    // undefined = not known yet (e.g. the theme before the page is mounted): nothing looks selected
    value: T | undefined;
    onChange: (value: T) => void;
    disabled?: boolean;
}

// Two or more buttons side by side; the selected one looks "pressed"
function SegmentedControl<T extends string>({ labelId, options, value, onChange, disabled }: SegmentedControlProps<T>) {
    return (
        <div role="group" aria-labelledby={labelId} className="inline-flex shrink-0 gap-1 rounded-lg border border-border bg-muted p-1">
            {options.map((option) => {
                const isSelected = option.value === value;
                return (
                    <button
                        key={option.value}
                        type="button"
                        lang={option.lang}
                        aria-pressed={isSelected}
                        disabled={disabled}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60",
                            isSelected
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
}

// One setting: title + description on one side, the control on the other (stacked on phones)
function SettingRow({ labelId, title, description, children }: {
    labelId: string;
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-0.5">
                <p id={labelId} className="font-medium">{title}</p>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            {children}
        </div>
    );
}

export default function PreferencesCard() {
    const t = useTranslations("settings.preferences");
    const themeLabelId = useId();
    const languageLabelId = useId();

    // Theme: saved in this browser by next-themes (localStorage), so it's only known after mounting
    const { resolvedTheme, setTheme } = useTheme();
    const mounted = useIsMounted();
    const theme = mounted ? (resolvedTheme as "light" | "dark") : undefined;

    // Language: saved in a cookie, then the page reloads in the new language
    const { locale, isPending, changeLocale } = useToggleLocale();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <SlidersHorizontal className="h-5 w-5" />
                    {t("title")}
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5 divide-y divide-border [&>*:not(:last-child)]:pb-5">
                <SettingRow labelId={themeLabelId} title={t("theme")} description={t("themeDescription")}>
                    <SegmentedControl
                        labelId={themeLabelId}
                        value={theme}
                        onChange={setTheme}
                        options={[
                            { value: "light", label: <><Sun className="h-4 w-4" aria-hidden="true" />{t("light")}</> },
                            { value: "dark", label: <><Moon className="h-4 w-4" aria-hidden="true" />{t("dark")}</> },
                        ]}
                    />
                </SettingRow>

                <SettingRow labelId={languageLabelId} title={t("language")} description={t("languageDescription")}>
                    <SegmentedControl<AppLocale>
                        labelId={languageLabelId}
                        value={locale}
                        onChange={changeLocale}
                        disabled={isPending}
                        // Language names are always written in their own language, so everyone can find theirs
                        options={[
                            { value: "en", lang: "en", label: "English" },
                            { value: "fa", lang: "fa", label: "فارسی" },
                        ]}
                    />
                </SettingRow>
            </CardContent>
        </Card>
    );
}
