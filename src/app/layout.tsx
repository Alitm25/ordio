import QueryProvider from "@/providers/QueryProvider";
import {Geist, Geist_Mono} from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import {Metadata} from "next";
import {getLocale, getMessages} from "next-intl/server";
import {NextIntlClientProvider} from "next-intl";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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


export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    const locale = await getLocale();
    const messages = await getMessages();
    const dir = locale === 'fa' ? 'rtl' : 'ltr';

  return (
      <html lang={locale} dir={dir}>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <QueryProvider>
          <NextIntlClientProvider messages={messages}>
              {children}
              <Toaster />
          </NextIntlClientProvider>
      </QueryProvider>
      </body>
      </html>
  );
}