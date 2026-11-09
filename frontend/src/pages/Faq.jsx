import { ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import FreshaButton from "@/components/FreshaButton";
import { useSite } from "@/lib/siteContext";
import { useLang } from "@/lib/langContext";
import { waLink } from "@/components/WhatsAppFab";

const Faq = () => {
  const { settings } = useSite();
  const { t } = useLang();
  const c = t.faqPage;
  return (
    <div data-testid="faq-page" className="container-site max-w-3xl py-16 lg:py-24">
      <Reveal>
        <p className="eyebrow mb-3">{c.eyebrow}</p>
        <h1 className="font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          {c.p}
        </p>
      </Reveal>
      <div className="mt-10 space-y-3">
        {t.faq.map((f, i) => (
          <Reveal key={i} delay={Math.min(i * 0.05, 0.3)}>
            <details className="group rounded-2xl border border-border bg-carta" data-testid={`faq-item-${i}`}>
              <summary className="flex min-h-[56px] cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-[17px] font-semibold text-antracite">
                {f.d}
                <ChevronDown size={18} className="shrink-0 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{f.r}</p>
            </details>
          </Reveal>
        ))}
      </div>
      <Reveal>
        <div className="mt-12 flex flex-col items-start gap-3 sm:flex-row">
          <FreshaButton label={t.common.bookFresha} testid="faq-fresha-btn" className="btn-primary" />
          {settings.whatsapp_number && (
            <a data-testid="faq-whatsapp-btn" href={waLink(settings.whatsapp_number, c.waMsg)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {c.waBtn}
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default Faq;
