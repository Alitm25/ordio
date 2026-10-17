"use client";

import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/useLogout";

// Last card on the settings page: leaving the account is the "furthest away" action, so it lives at the bottom
export default function LogoutCard() {
    const t = useTranslations("settings.logout");
    const logoutMutation = useLogout();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <LogOut className="h-5 w-5" />
                    {t("title")}
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">{t("description")}</p>
                <Button
                    variant="outline"
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                    className="shrink-0 cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                    <LogOut className="h-4 w-4 me-2" aria-hidden="true" />
                    {logoutMutation.isPending ? t("loading") : t("button")}
                </Button>
            </CardContent>
        </Card>
    );
}
