import Reveal from "@/components/Reveal";
import { IMAGES } from "@/lib/content";
import { useLang } from "@/lib/langContext";
import { BadgeCheck } from "lucide-react";

const Susana = () => {
  const { t } = useLang();
  const c = t.susana;

  return (
    <div data-testid="susana-page">
      <section className="container-site py-16 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] shadow-lg" style={{ aspectRatio: "3/4" }}>
              <img src={IMAGES.susana} alt={c.imgAlt} className="h-full w-full object-cover object-top" />
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="eyebrow mb-3">{c.eyebrow}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
              {c.h1}
            </h1>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              {t.susanaStoria.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {t.susanaCompetenze.map((comp) => (
                <span key={comp} className="rounded-full border border-border bg-carta px-4 py-2 text-sm font-medium text-antracite" data-testid="susana-competenza">
                  {comp}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-rosa-soft/50 py-16 lg:py-20">
        <div className="container-site">
          <Reveal>
            <h2 className="font-serif text-3xl font-semibold text-antracite">{c.metodoTitle}</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-antracite/80">{t.metodoRosa.intro}</p>
          </Reveal>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {t.metodoRosa.fasi.map((f, i) => (
              <Reveal key={f.n} delay={i * 0.07}>
                <div className="h-full rounded-2xl bg-carta p-5 shadow-sm">
                  <span className="font-serif text-3xl font-semibold text-rosa/50">{f.n}</span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-antracite">{f.titolo}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.testo}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-6 max-w-3xl text-sm text-muted-foreground">{t.metodoRosa.principi} {t.metodoRosa.nota}</p>
          </Reveal>
        </div>
      </section>

      <section className="container-site py-16 lg:py-20">
        <Reveal>
          <h2 className="font-serif text-3xl font-semibold text-antracite">{c.attestati.h2}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            {c.attestati.p}
          </p>
        </Reveal>
        <div className="mt-9 grid gap-5 md:grid-cols-2">
          {t.attestati.map((a, i) => (
            <Reveal key={a.titolo} delay={i * 0.1}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-carta p-7 shadow-sm" data-testid={`attestato-card-${i}`}>
                <BadgeCheck size={26} className="text-salvia" />
                <h3 className="mt-4 font-serif text-lg font-semibold leading-snug text-antracite">{a.titolo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.ente}</p>
                <p className="mt-1 text-sm font-medium text-antracite">{a.data}</p>
                <a href={a.img} target="_blank" rel="noopener noreferrer" className="mt-4 block overflow-hidden rounded-2xl border border-border" data-testid={`attestato-img-${i}`}>
                  <img src={a.img} alt={`${a.titolo} – ${c.attestati.docAltSuffix}`} className="max-h-80 w-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]" loading="lazy" />
                </a>
                <p className="mt-2 text-xs text-muted-foreground">{c.attestati.docNote}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <p className="mt-8 max-w-2xl text-sm text-muted-foreground">
            {c.rmeNote}
          </p>
        </Reveal>
      </section>
    </div>
  );
};

export default Susana;
