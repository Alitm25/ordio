"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Package,
    Settings, ShoppingBag, Users,
} from "lucide-react";
import {useTranslations} from "next-intl";
import Logo from "@/components/shared/Logo";

interface Props {
    onNavigate?: () => void;
}

// Sidebar and menu content
export function SidebarContent({ onNavigate } :Props) {
    // Get the current path
    const pathname = usePathname();
    // Translation Hook
    const t = useTranslations('nav');

    // Nav links
    const links = [
        { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
        { href: "/orders", label: t("orders"), icon: Package },
        { href: "/products", label: t("products"), icon: ShoppingBag },
        { href: "/customers", label: t("customers"), icon: Users },
        { href: "/settings", label: t("settings"), icon: Settings },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* h-17: the same height as the topbar. flex: the logo is a flex item, so no extra "descender" gap below it */}
            <div className="h-17 px-4.5 border-b flex items-center">
                {/* Not an <h1>: each page already has its own title as the h1 */}
                <Link href="/dashboard" onClick={onNavigate} className="inline-flex">
                    <Logo size={28} textClassName="text-2xl" />
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {
                    links.map( (link) => {
                    const Icon = link.icon;

                    return (
                        <Link key={link.href} href={link.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                  pathname === link.href
                                      ? "border-s-2 border-primary bg-primary/5 text-primary font-medium"
                                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                              onClick={onNavigate}
                        >
                            <Icon size={18} />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

// Sidebar JSX
export default function Sidebar() {
    return (
        <aside className={'hidden lg:flex w-64 border-r bg-card flex-col'}>
            <SidebarContent />
        </aside>
    )
}