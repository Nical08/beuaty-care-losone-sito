import { Link } from "react-router-dom";
import { Sparkles, ChevronDown } from "lucide-react";
import Reveal from "@/components/Reveal";
import { useSite } from "@/lib/siteContext";
import { useLang } from "@/lib/langContext";
import { waLink } from "@/components/WhatsAppFab";
import { IMAGES } from "@/lib/content";

const Corpo = () => {
  const { settings, percorsoByHandle, openQuiz } = useSite();
  const { t } = useLang();
  const c = t.corpo;

  return (
    <div data-testid="corpo-page">
      <section className="grain relative overflow-hidden bg-crema">
        <div className="container-site grid items-center gap-10 py-16 lg:grid-cols-[1.2fr_1fr] lg:py-24">
          <Reveal>
            <p className="eyebrow mb-3">{c.eyebrow}</p>
            <h1 className="font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
              {c.h1}
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-muted-foreground">
              {c.intro}
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="relative overflow-hidden rounded-[2rem] shadow-lg" style={{ aspectRatio: "4/3" }}>
              <img src={IMAGES.massaggio} alt={c.imgAlt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* PRIMA E DOPO - subito dopo l'introduzione */}
      <section className="container-site py-14 lg:py-20">
        <Reveal>
          <div className="rounded-[2rem] border border-border bg-carta p-8 lg:p-12">
            <h2 className="font-serif text-2xl font-semibold text-antracite sm:text-3xl">{c.gallery.h2}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
              {c.gallery.p}
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {t.lavoriCorpo.map((l, i) => (
                <figure key={l.img} className="group overflow-hidden rounded-2xl border border-border" data-testid={`corpo-lavoro-${i}`}>
                  <img src={l.img} alt={l.didascalia} className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                  <figcaption className="px-3 py-2.5 text-xs font-medium text-muted-foreground">{l.didascalia}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="container-site space-y-8 py-16 lg:py-20">
        {c.sections.map((s, i) => (
          <Reveal key={s.titolo}>
            <article className="rounded-[2rem] border border-border bg-carta p-8 shadow-sm lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <h2 className="font-serif text-2xl font-semibold text-antracite sm:text-3xl">{s.titolo}</h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{s.testo}</p>
                  <p className="mt-4 text-[15px] text-muted-foreground">
                    {c.seduteNote}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {s.percorsi.map((h) => {
                      const p = percorsoByHandle(h);
                      return p ? (
                        <Link key={h} to={`/percorsi/${h}`} data-testid={`corpo-percorso-${h}`} className="btn-secondary">
                          {c.goToPrefix} {p.nome}
                        </Link>
                      ) : null;
                    })}
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-salvia">{c.techTitle}</p>
                  {s.tecnologie.map((techKey) => (
                    <details key={techKey} className="group rounded-2xl border border-border bg-crema" data-testid={`corpo-tech-${i}-${techKey.replace(/\s/g, "-").toLowerCase()}`}>
                      <summary className="flex min-h-[52px] cursor-pointer list-none items-center justify-between px-5 py-3 text-[15px] font-semibold text-antracite">
                        {t.tecNames[techKey] || techKey}
                        <ChevronDown size={17} className="transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <div className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">
                        {t.tecDescriptions[techKey] || c.techFallback}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        ))}

        {settings.rme_valido && (
          <Reveal>
            <div className="rounded-[2rem] bg-salvia-soft p-8 lg:p-10">
              <h2 className="font-serif text-2xl font-semibold text-antracite">{c.rme.h2}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-antracite/80">
                {c.rme.p}
              </p>
            </div>
          </Reveal>
        )}

        <Reveal>
          <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-antracite p-10 text-center text-carta">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">{c.cta.h2}</h2>
            <p className="max-w-md text-carta/70">{c.cta.p}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-3">
              <button data-testid="corpo-quiz-btn" onClick={openQuiz} className="btn-primary">
                <Sparkles size={18} /> {c.cta.quizBtn}
              </button>
              {settings.whatsapp_number && (
                <a data-testid="corpo-whatsapp-btn" href={waLink(settings.whatsapp_number, c.cta.waMsg)} target="_blank" rel="noopener noreferrer" className="btn-secondary border-carta/40 text-carta hover:bg-carta/10">
                  {t.common.whatsappWrite}
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
};

export default Corpo;
