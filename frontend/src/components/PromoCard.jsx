import { useEffect, useState } from "react";
import FreshaButton from "@/components/FreshaButton";
import Reveal from "@/components/Reveal";
import { waLink } from "@/components/WhatsAppFab";
import { useSite } from "@/lib/siteContext";
import { useLang } from "@/lib/langContext";

const remaining = (end) => Math.max(0, new Date(end).getTime() - Date.now());

const Countdown = ({ ms, labels }) => {
  const s = Math.floor(ms / 1000);
  const parts = [
    [Math.floor(s / 86400), labels.days, "days"],
    [Math.floor((s % 86400) / 3600), labels.hours, "hours"],
    [Math.floor((s % 3600) / 60), labels.minutes, "minutes"],
    [s % 60, labels.seconds, "seconds"],
  ];
  return (
    <div data-testid="promo-countdown" className="mt-5">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-antracite/60">{labels.endsIn}</p>
      <div className="mt-2 flex gap-2">
        {parts.map(([v, l, k]) => (
          <div key={k} className="min-w-[64px] rounded-2xl border border-rosa/25 bg-carta/80 px-3 py-2 text-center shadow-sm">
            <span data-testid={`promo-countdown-${k}`} className="block font-serif text-2xl font-semibold text-rosa [font-variant-numeric:lining-nums_tabular-nums]">{String(v).padStart(2, "0")}</span>
            <span className="text-[11px] font-medium uppercase tracking-wider text-antracite/60">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const PromoCard = () => {
  const { settings } = useSite();
  const { lang, t } = useLang();
  const end = settings.promo_scadenza;
  const [ms, setMs] = useState(() => (end ? remaining(end) : 0));

  useEffect(() => {
    if (!end) return;
    setMs(remaining(end));
    const id = setInterval(() => setMs(remaining(end)), 1000);
    return () => clearInterval(id);
  }, [end]);

  if (!settings.promo_attiva || !end || ms <= 0) return null;
  const base = settings.promo_testi?.it || {};
  const loc = settings.promo_testi?.[lang] || {};
  const p = Object.fromEntries(Object.keys(base).map((k) => [k, loc[k]?.trim() ? loc[k] : base[k]]));

  return (
    <Reveal delay={0.05}>
      <div
        data-testid="home-promo"
        className="mt-9 flex flex-col gap-6 rounded-[2rem] border border-rosa/30 bg-gradient-to-br from-rosa-soft to-crema p-8 shadow-md sm:p-10 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="max-w-xl">
          {p.badge && <span data-testid="promo-badge" className="rounded-full bg-rosa px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-carta">{p.badge}</span>}
          <h3 data-testid="promo-title" className="mt-4 font-serif text-3xl font-semibold text-antracite sm:text-4xl">{p.title}</h3>
          {p.text && <p data-testid="promo-text" className="mt-3 leading-relaxed text-antracite/75">{p.text}</p>}
          <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span data-testid="promo-price-unit" className="font-serif text-3xl font-bold text-rosa">{p.priceUnit}</span>
            <span className="text-[15px] font-medium text-antracite/70">{p.priceNote}</span>
          </p>
          {(p.priceTotal || p.priceOld) && (
            <p className="mt-1 text-lg font-semibold text-antracite">
              {p.priceTotal} {p.priceOld && <s className="ml-1 text-base font-normal text-muted-foreground">{p.priceOld}</s>}
            </p>
          )}
          <Countdown ms={ms} labels={t.home.promo} />
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
          <FreshaButton label={p.ctaFresha} kind="promo" testid="promo-fresha-btn" className="btn-primary" />
          {settings.whatsapp_number && (
            <a data-testid="promo-whatsapp-btn" href={waLink(settings.whatsapp_number, p.waMsg)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {p.ctaWa}
            </a>
          )}
        </div>
      </div>
    </Reveal>
  );
};

export default PromoCard;
