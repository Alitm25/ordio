import QueryProvider from "@/providers/QueryProvider";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body>
      <QueryProvider>
          {children}
          <Toaster />
      </QueryProvider>
      </body>
      </html>
  );
}