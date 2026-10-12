"use client";

import { Button } from "@/components/ui/button";
import {Menu, UserRound} from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import {useState} from "react";
import {Sheet, SheetContent, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import {SidebarContent} from "@/components/layout/Sidebar";
import {useLocale, useTranslations} from "next-intl";
import Link from "next/link";
import Logo from "@/components/shared/Logo";

export default function Topbar() {
    const { data } = useCurrentUser();
    const [open, setOpen] = useState(false);

    const locale = useLocale();
    const t = useTranslations('topbar');
    // h-17: the SAME height as the sidebar header, so their bottom borders always line up
    return (
        <header className="h-17 border-b px-4 md:px-8 flex items-center justify-between">
        {/* SideBar Menu */}
            <div className={'flex items-center gap-4'}>
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant={'ghost'} size={"icon"} className={'lg:hidden cursor-pointer'}>
                            <Menu className={'h-5 w-5'} />
                        </Button>
                    </SheetTrigger>

                    <SheetContent side={locale === 'en' ? 'left' : 'right'} className={'p-0 w-64'}>
                        <SheetTitle className={'sr-only'}>
                            Navigation Menu
                        </SheetTitle>
                        <SidebarContent onNavigate={ () => setOpen(false)}/>
                    </SheetContent>
                </Sheet>
                {/* phones only: on desktop the sidebar already shows the logo */}
                <Link href="/dashboard" className="lg:hidden">
                    <Logo size={24} textClassName="text-lg" />
                </Link>
            </div>
        {/* Account: one link to the settings page (language, theme and logout live there now) */}
            {data?.user.email && (
                <Link
                    href="/settings#account"
                    aria-label={`${t("accountSettings")} (${data.user.email})`}
                    title={t("accountSettings")}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <UserRound className="h-4 w-4" aria-hidden="true" />
                    {/* phones: just the icon */}
                    <span className="hidden sm:inline latin-value">{data.user.email}</span>
                </Link>
            )}
        </header>
    );
}