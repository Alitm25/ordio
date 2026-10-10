import { useTranslations } from "next-intl";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Order matters: fit -> cost -> effort -> details -> trust (the doubts a visitor has before signing up)
const FAQ_KEYS = ["what", "free", "install", "stock", "payments", "data"] as const;

// Server component: only the accordion itself runs in the browser
export default function FaqSection() {
    const t = useTranslations("landing.faq");

    return (
        <section id="faq" className="scroll-mt-14 py-24 px-6 bg-background">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">
                        {t("title")}
                    </h2>
                    <p className="text-muted-foreground">
                        {t("subtitle")}
                    </p>
                </div>

                {/* single + collapsible: one answer open at a time, and it can be closed again */}
                <Accordion type="single" collapsible defaultValue={FAQ_KEYS[0]} className="gap-3">
                    {FAQ_KEYS.map((key) => (
                        <AccordionItem
                            key={key}
                            value={key}
                            // same card look as the feature cards; the open question gets the brand border
                            className="rounded-xl border border-border bg-card px-5 transition-colors hover:border-primary/40 data-[state=open]:border-primary/40"
                        >
                            <AccordionTrigger className="py-4 text-base text-foreground hover:no-underline hover:text-primary cursor-pointer">
                                {t(`items.${key}.question`)}
                            </AccordionTrigger>
                            <AccordionContent className="pb-4 text-muted-foreground leading-relaxed">
                                {t(`items.${key}.answer`)}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
