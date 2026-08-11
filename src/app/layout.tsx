import QueryProvider from "@/providers/QueryProvider";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import {Metadata} from "next";
import {getLocale, getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";
import localFont from "next/font/local";

// English fonts
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Ordio",
    description: "Order Management System",
};

// Persian fonts
const vazirMatn = localFont({
    src: [
        {
            path: './fonts/Woff2/IRANYekanXFaNum-Regular.woff2',
            weight: '400',
            style: "normal"
        },
        {
            path: './fonts/Woff2/IRANYekanXFaNum-Medium.woff2',
            weight: '500',
            style: "normal"
        },
        {
            path: './fonts/Woff2/IRANYekanXFaNum-Bold.woff2',
            weight: '700',
            style: "normal"
        }
    ],
    variable: "--font-vazirmatn",
    display: "swap",
})


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();
    const messages = await getMessages();
    const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
      <html lang={locale} dir={dir}
            className={`${geistSans.variable} ${geistMono.variable} ${vazirMatn.variable} dark`} suppressHydrationWarning>
      <body className={"antialiased"}>
      <NextIntlClientProvider messages={messages}>
          <QueryProvider>
                  {children}
                  <Toaster />
          </QueryProvider>
      </NextIntlClientProvider>
      </body>
      </html>
  );
}