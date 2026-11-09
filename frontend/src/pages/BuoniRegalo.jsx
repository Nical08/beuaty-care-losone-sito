import Reveal from "@/components/Reveal";
import FreshaButton from "@/components/FreshaButton";
import { useLang } from "@/lib/langContext";
import { Gift } from "lucide-react";

const BuoniRegalo = () => {
  const { t } = useLang();
  const c = t.buoni;

  return (
    <div data-testid="buoni-regalo-page" className="container-site py-16 lg:py-24">
      <Reveal>
        <p className="eyebrow mb-3">{c.eyebrow}</p>
        <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          {c.p}
        </p>
      </Reveal>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {c.occasioni.map((o, i) => (
          <Reveal key={o} delay={i * 0.07}>
            <div className="flex h-full flex-col items-start gap-3 rounded-3xl border border-border bg-carta p-7">
              <Gift size={22} className="text-rosa" />
              <h2 className="font-serif text-xl font-semibold text-antracite">{o}</h2>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-12 rounded-[2rem] bg-rosa-soft/60 p-8 lg:p-10">
          <h2 className="font-serif text-2xl font-semibold text-antracite">{c.ideeTitle}</h2>
          <ul className="mt-4 space-y-2 text-antracite/80">
            {c.idee.map((i) => <li key={i}>· {i}</li>)}
          </ul>
          <div className="mt-7">
            <FreshaButton label={c.buyBtn} kind="buoni" testid="buoni-fresha-btn" className="btn-primary" />
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            {c.note}
          </p>
        </div>
      </Reveal>
    </div>
  );
};

export default BuoniRegalo;
