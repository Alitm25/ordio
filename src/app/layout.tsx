import QueryProvider from "@/providers/QueryProvider";
import ThemeProvider from "@/providers/ThemeProvider";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import localFont from "next/font/local";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
    variable: "--font-jetbrains-mono",
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

const vazirMatn = localFont({
    src: [
        {
            path: "./fonts/Woff2/IRANYekanXFaNum-Regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/Woff2/IRANYekanXFaNum-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "./fonts/Woff2/IRANYekanXFaNum-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--font-vazirmatn",
    display: "swap",
});

export const metadata: Metadata = {
    // Pages can set their own title; "%s" is replaced by it, e.g. "Orders | Ordio"
    title: { default: "Ordio", template: "%s | Ordio" },
    description: "Order Management System",
};

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const locale = await getLocale();
    const messages = await getMessages();
    const dir = locale === "fa" ? "rtl" : "ltr";

    return (
        <html
            lang={locale}
            dir={dir}
            // lets Next.js turn smooth scrolling off while changing pages (it stays on for #section links)
            data-scroll-behavior="smooth"
            className={`${geistSans.variable} ${vazirMatn.variable} ${jetbrainsMono.variable}`}
            suppressHydrationWarning
        >
        <body className="antialiased">
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider>
                <QueryProvider>
                    {children}
                    <Toaster style={ {fontFamily: locale === "fa" ? "var(--font-vazirmatn)" : "var(--font-geist-sans)"} } />
                </QueryProvider>
            </ThemeProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    );
}