"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    LayoutDashboard,
    Package,
    Settings, ShoppingBag, Users,
} from "lucide-react";
import {useTransition} from "react";
import {useTranslations} from "next-intl";

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
            <div className="p-4.5 border-b">
                <h1 className="text-2xl font-bold">
                    Ordio
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {
                    links.map( (link) => {
                    const Icon = link.icon;

                    return (
                        <Link key={link.href} href={link.href}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                                pathname === link.href
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
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