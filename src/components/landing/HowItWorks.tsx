"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CircleCheck, RotateCcw, UserRound } from "lucide-react";
import StockBadge from "@/components/products/StockBadge";
import OrderStatusBadge from "@/components/orders/OrderStatusBadge";
import { cn } from "@/lib/utils";

const STEPS = ["one", "two", "three"] as const;
const TOTAL = STEPS.length;

// Same payment badge colors as the orders table
const PAID = "border-emerald-500/30 bg-emerald-500/10 text-emerald-500";
const UNPAID = "border-muted-foreground/20 bg-muted text-muted-foreground";
const BADGE = "rounded border px-2 py-0.5 text-xs font-medium";

// Sets --d, the start time of a .hiw-* animation (see globals.css). No JS timers needed.
const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

// One row of a mini scene. <span>s, not <div>s: the whole card is a <button>
const ROW = "hiw-reveal flex items-center justify-between gap-2 py-1";

/* ---------- Mini scenes (each one plays when its card gets data-active="true") ---------- */

function ProductsScene() {
    const t = useTranslations("landing.steps.demo");
    const products = [
        { key: "bread", stock: 10 },
        { key: "cheese", stock: 3 },
        { key: "cake", stock: 8 },
    ] as const;

    return products.map((product, index) => (
        <span key={product.key} className={ROW} style={delay(400 + index * 150)}>
            <span>{t(product.key)}</span>
            <StockBadge stock={product.stock} />
        </span>
    ));
}

function OrderScene() {
    const t = useTranslations("landing.steps.demo");
    const tOrders = useTranslations("orders.create");
    const locale = useLocale();

    return (
        <>
            <span className={ROW} style={delay(400)}>
                <span className="flex items-center gap-1.5">
                    <UserRound className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {t("customer")}
                </span>
                <span className="text-muted-foreground" dir="ltr">0912…</span>
            </span>
            <span className={ROW} style={delay(600)}>
                <span>{t("bread")} × {(2).toLocaleString(locale)}</span>
                <span>{(20).toLocaleString(locale)}</span>
            </span>
            <span className={cn(ROW, "border-t border-border mt-1 pt-2")} style={delay(800)}>
                <span>{tOrders("total")}</span>
                <span className="font-semibold text-primary">{(20).toLocaleString(locale)}</span>
            </span>
        </>
    );
}

function TrackScene() {
    const t = useTranslations("landing.steps.demo");
    const tOrders = useTranslations("orders");

    return (
        <>
            <span className={ROW} style={delay(400)}>
                <span>{tOrders("table.status")}</span>
                {/* three badges stacked in the same spot: pending -> processing -> completed */}
                <span className="grid justify-items-end">
                    <span className="hiw-hide col-start-1 row-start-1" style={delay(1000)}>
                        <OrderStatusBadge status="pending" />
                    </span>
                    <span className="hiw-flash col-start-1 row-start-1" style={delay(950)}>
                        <OrderStatusBadge status="processing" />
                    </span>
                    <span className="hiw-reveal col-start-1 row-start-1" style={delay(1700)}>
                        <OrderStatusBadge status="completed" />
                    </span>
                </span>
            </span>
            <span className={ROW} style={delay(550)}>
                <span>{tOrders("table.payment")}</span>
                <span className="grid justify-items-end">
                    <span className={cn("hiw-hide col-start-1 row-start-1", BADGE, UNPAID)} style={delay(1700)}>
                        {tOrders("payment.unpaid")}
                    </span>
                    <span className={cn("hiw-reveal col-start-1 row-start-1", BADGE, PAID)} style={delay(1700)}>
                        {tOrders("payment.paid")}
                    </span>
                </span>
            </span>
            <span className={cn(ROW, "justify-center text-emerald-500 font-medium")} style={delay(2000)}>
                <CircleCheck className="h-4 w-4" aria-hidden="true" />
                {t("orderDone")}
            </span>
        </>
    );
}

const SCENES = [ProductsScene, OrderScene, TrackScene];

/* ---------- Section ---------- */

export default function HowItWorks() {
    const t = useTranslations("landing.steps");
    const locale = useLocale();
    const sectionRef = useRef<HTMLElement>(null);

    // The ONLY state: how many steps are open (0 = none yet). Every animation is derived from it in CSS.
    const [step, setStep] = useState(0);
    // Bumped by "Play again" to remount the cards, which restarts step 1's animations
    const [run, setRun] = useState(0);

    // Open step 1 by itself once the section scrolls into view, then stop watching (no scroll listeners)
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStep((current) => current || 1);
                    observer.disconnect();
                }
            },
            // fire when the top of the section reaches 70% down the screen
            { rootMargin: "0px 0px -30% 0px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Clicking the open card opens the next one; clicking any other card jumps to it
    const handleCardClick = (n: number) => {
        setStep(n === step ? Math.min(step + 1, TOTAL) : n);
    };

    const handleNext = () => {
        if (step >= TOTAL) {
            setRun((r) => r + 1);
            setStep(1);
        } else {
            setStep(step + 1);
        }
    };

    const isFinished = step >= TOTAL;

    return (
        <section ref={sectionRef} id="steps" className="scroll-mt-14 py-24 px-6 bg-background">
            <div className="max-w-5xl mx-auto">
                <h2 className="text-3xl font-bold text-center text-foreground mb-3 text-balance">
                    {t("title")}
                </h2>
                <p className="text-center text-muted-foreground mb-12">{t("hint")}</p>

                {/* Step numbers + progress line */}
                <div className="relative mb-8">
                    <div className="absolute top-5 inset-x-[16.66%] h-0.5 bg-border" aria-hidden="true">
                        {/* scaleX instead of width: the GPU can animate it without recalculating the layout */}
                        <div
                            className="h-full bg-primary ltr:origin-left rtl:origin-right transition-transform duration-500 ease-out motion-reduce:transition-none"
                            style={{ transform: `scaleX(${Math.max(step - 1, 0) / (TOTAL - 1)})` }}
                        />
                    </div>

                    <ol className="relative grid grid-cols-3">
                        {STEPS.map((key, index) => {
                            const n = index + 1;
                            const isReached = n <= step;

                            return (
                                <li key={key} className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep(n)}
                                        aria-current={n === step ? "step" : undefined}
                                        aria-label={`${n}. ${t(`items.${key}.title`)}`}
                                        className={cn(
                                            "h-10 w-10 rounded-xl border font-semibold cursor-pointer transition-[scale,background-color,color,border-color] duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                            isReached
                                                ? "bg-primary border-primary text-primary-foreground"
                                                : "bg-muted border-border text-muted-foreground hover:border-primary/40",
                                            n === step && "scale-110"
                                        )}
                                    >
                                        {n.toLocaleString(locale)}
                                    </button>
                                </li>
                            );
                        })}
                    </ol>
                </div>

                {/* Cards. key={run}: "Play again" remounts them so the first scene replays */}
                <div key={run} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {STEPS.map((key, index) => {
                        const n = index + 1;
                        const isReached = n <= step;
                        const Scene = SCENES[index];

                        return (
                            <button
                                key={key}
                                type="button"
                                data-active={isReached}
                                onClick={() => handleCardClick(n)}
                                className={cn(
                                    "text-start rounded-xl border bg-card p-5 cursor-pointer",
                                    // only opacity, translate and border color change: cheap to animate
                                    "transition-[opacity,translate,border-color] duration-500 ease-out motion-reduce:transition-none",
                                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                                    isReached
                                        ? "opacity-100 translate-y-0 border-primary/40 delay-150"
                                        : "opacity-50 translate-y-2 border-border hover:opacity-80"
                                )}
                            >
                                <span className="block font-semibold text-foreground mb-1">
                                    {t(`items.${key}.title`)}
                                </span>
                                <span className="block text-sm text-muted-foreground leading-relaxed mb-4">
                                    {t(`items.${key}.description`)}
                                </span>
                                {/* fixed min height: the scene appearing never pushes the layout around */}
                                <span className="block min-h-30 rounded-lg border border-border bg-background/60 p-3 text-sm">
                                    <Scene />
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                        {isFinished ? (
                            <>
                                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                                {t("again")}
                            </>
                        ) : (
                            <>
                                {t("next")}
                                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
                            </>
                        )}
                    </button>
                </div>

                {/* Screen readers hear which step just opened */}
                <p className="sr-only" aria-live="polite">
                    {step > 0 &&
                        t("stepOf", { current: step, total: TOTAL, title: t(`items.${STEPS[step - 1]}.title`) })}
                </p>
            </div>
        </section>
    );
}
