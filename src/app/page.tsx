import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import {ChartNoAxesColumn, CreditCard, ShoppingBag, Users} from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";
import LandingNavbar from "@/components/landing/LandingNavbar";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Cta from "@/components/landing/Cta";
import FaqSection from "@/components/landing/FaqSection";
import Logo from "@/components/shared/Logo";
import HowItWorks from "@/components/landing/HowItWorks";

const FEATURES = [
  { key: "orders", Icon: ShoppingBag },
  { key: "payments", Icon: CreditCard },
  { key: "customers", Icon: Users },
  { key: "dashboard", Icon: ChartNoAxesColumn },
] as const;

// Title, description and the link-preview card (Telegram, WhatsApp, Google...) in the visitor's language
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("landing.meta");
  const locale = await getLocale();

  return {
    title: { absolute: t("title") },
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Ordio",
      type: "website",
      locale: locale === "fa" ? "fa_IR" : "en_US",
    },
  };
}

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const locale = await getLocale();

  // Always the current year: Jalali digits for Persian (۱۴۰۵), Gregorian for English (2026)
  const year = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-US", { year: "numeric" })
      .format(new Date());

  return (
      // dir/lang already come from <html> in the root layout
      <div className="min-h-screen bg-background text-foreground">
        {/* Navbar — Client Component*/}
        <LandingNavbar />

        <main>
          {/* Hero — Client Component (CursorGrid) */}
          <HeroSection />

          {/* Features */}
          {/* scroll-mt: leave room for the sticky navbar when jumping to #features */}
          <section id="features" className="scroll-mt-14 py-24 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-foreground mb-16 text-balance">
                {t("features.title")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {FEATURES.map(({ key, Icon }) => (
                    // Not a link, so no "click me" movement on hover: only the spotlight + a border hint
                    <SpotlightCard spotlightColor={'rgba(91, 91, 214, 0.25)'} key={key}
                    className={'bg-card border border-border rounded-xl p-6 transition-colors hover:border-primary/40'}>
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                            {/* text-primary follows the theme (lighter purple in dark mode) */}
                            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">
                            {t(`features.items.${key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {t(`features.items.${key}.description`)}
                        </p>
                    </SpotlightCard>
                ))}
              </div>
            </div>
          </section>

          {/* How it works — Client Component (clickable, animated steps) */}
          <HowItWorks />

          {/* FAQ */}
          <FaqSection />

          {/* CTA */}
          <Cta />
        </main>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border bg-background">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <Logo size={22} textClassName="text-lg font-semibold text-primary" />
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="flex items-center justify-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.features")}
              </a>
              <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.faq")}
              </a>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.login")}
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{t("footer.copyright", { year })}</p>
          </div>
        </footer>
      </div>
  );
}
