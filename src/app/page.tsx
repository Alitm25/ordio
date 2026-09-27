import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { ShoppingBag } from "lucide-react";
import HeroSection from "@/components/landing/HeroSection";

export default async function LandingPage() {
  const t = await getTranslations("landing");
  const locale = await getLocale();
  const dir = locale === "fa" ? "rtl" : "ltr";

  return (
      <div dir={dir} className="min-h-screen bg-white">
        {/* Navbar */}
        <header className="sticky top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-sm border-b border-border px-10">
          <div className="h-14 flex items-center justify-between">
            <span className="font-semibold text-primary text-lg">Ordio</span>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.product")}
              </a>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.features")}
              </a>
              <a href="#steps" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.pricing")}
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("nav.signIn")}
              </Link>
              <Link href="/register" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                {t("nav.startFree")}
              </Link>
            </div>
          </div>
        </header>

        {/* Hero — Client Component (CursorGrid) */}
        <HeroSection />

        {/* Features */}
        <section id="features" className="py-24 px-6 bg-background">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-16">
              {t("features.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { key: "orders", icon: "🛒", color: "bg-primary/10" },
                { key: "payments", icon: "💳", color: "bg-emerald-500/10" },
                { key: "customers", icon: "👥", color: "bg-amber-500/10" },
                { key: "dashboard", icon: "📊", color: "bg-blue-500/10" },
              ].map((feature) => (
                  <div key={feature.key} className="bg-white border border-border rounded-xl p-6 hover:shadow-sm transition-shadow">
                    <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center text-lg mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t(`features.items.${feature.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`features.items.${feature.key}.description`)}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="steps" className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-16">
              {t("steps.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { key: "one", num: "1" },
                { key: "two", num: "2" },
                { key: "three", num: "3" },
              ].map((step) => (
                  <div key={step.key} className="text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted text-muted-foreground font-semibold text-lg flex items-center justify-center mx-auto mb-4">
                      {step.num}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {t(`steps.items.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {t(`steps.items.${step.key}.description`)}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 bg-[#f4f2fd]">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-3">
              {t("cta.title")}
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              {t("cta.subtitle")}
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-primary/90 transition-colors">
              {t("cta.button")} →
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 border-t border-border bg-white">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <span className="font-semibold text-primary text-lg block">Ordio</span>
            <p className="text-sm text-muted-foreground">{t("footer.tagline")}</p>
            <div className="flex items-center justify-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.product")}
              </a>
              <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t("footer.login")}
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
          </div>
        </footer>
      </div>
  );
}