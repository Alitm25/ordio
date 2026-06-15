"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    {
        href: "/dashboard",
        label: "Overview",
    },
    {
        href: "/orders",
        label: "Orders",
    },
    {
        href: "/settings",
        label: "Settings",
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-card">
            <div className="p-6 border-b">
                <h1 className="text-xl font-bold">
                    Ordio
                </h1>
            </div>

            <nav className="p-4 space-y-2">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`block rounded-md px-3 py-2 transition-colors ${
                            pathname === link.href
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                        }`}
                    >
                        {link.label}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}