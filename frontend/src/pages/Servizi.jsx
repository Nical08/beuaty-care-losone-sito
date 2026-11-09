import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import FreshaButton from "@/components/FreshaButton";
import { FRESHA_URL } from "@/lib/content";
import { trackEvent } from "@/lib/api";
import { useSite } from "@/lib/siteContext";
import { useLang, fmt } from "@/lib/langContext";

const Servizi = () => {
  const { percorsoByHandle } = useSite();
  const { t } = useLang();
  const c = t.servizi;
  const listino = t.listino || [];
  const [searchParams] = useSearchParams();
  const [cerca, setCerca] = useState("");
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setCerca(q);
  }, [searchParams]);
  const totale = listino.reduce((n, f) => n + f.voci.length, 0);
  const q = cerca.trim().toLowerCase();
  const listinoFiltrato = listino
    .map((f) => ({ ...f, voci: f.voci.filter((v) => !q || v.nome.toLowerCase().includes(q) || f.famiglia.toLowerCase().includes(q)) }))
    .filter((f) => f.voci.length > 0);
  const risultati = listinoFiltrato.reduce((n, f) => n + f.voci.length, 0);

  const Prezzo = ({ prezzo }) => {
    if (prezzo == null) return null;
    if (prezzo === "gratuita") return <span className="font-semibold text-[#4c5c48]">{t.common.free}</span>;
    if (typeof prezzo === "string") return <span className="font-semibold text-antracite">{fmt(t.common.fromChf, { v: prezzo.replace("da ", "") })}</span>;
    return <span className="font-semibold text-antracite">{fmt(t.common.chf, { v: prezzo })}</span>;
  };

  return (
    <div data-testid="servizi-page" className="container-site py-16 lg:py-24">
      <Reveal>
        <p className="eyebrow mb-3">{c.eyebrow}</p>
        <h1 className="max-w-2xl font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">
          {c.p}
        </p>
        <div className="relative mt-7 max-w-xl">
          <Search size={20} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            data-testid="servizi-search-input"
            type="search"
            value={cerca}
            onChange={(e) => setCerca(e.target.value)}
            placeholder={c.searchPlaceholder}
            className="min-h-[56px] w-full rounded-full border border-input bg-carta pl-13 pr-5 text-[17px] text-antracite shadow-sm outline-none transition-colors focus:border-rosa"
            style={{ paddingLeft: "3.2rem" }}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {q
            ? fmt(risultati === 1 ? c.countOne : c.countMany, { n: risultati, q: cerca })
            : fmt(c.countAll, { totale })}
        </p>
      </Reveal>

      <div className="mt-14 space-y-12">
        {listinoFiltrato.map((fam, fi) => {
          const percorso = fam.percorso ? percorsoByHandle(fam.percorso) : null;
          return (
            <Reveal key={fam.famiglia}>
              <section data-testid={`servizi-famiglia-${fi}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="font-serif text-2xl font-semibold text-antracite">{fam.famiglia}</h2>
                  {percorso && (
                    <Link to={`/percorsi/${percorso.handle}`} data-testid={`servizi-percorso-${percorso.handle}`} className="text-[15px] font-semibold text-rosa hover:underline">
                      {fmt(c.linked, { nome: percorso.nome })}
                    </Link>
                  )}
                </div>
                <div className="mt-5 overflow-hidden rounded-3xl border border-border bg-carta">
                  {fam.voci.map((v, vi) => (
                    <div
                      key={v.nome}
                      className={`flex flex-wrap items-center justify-between gap-3 px-6 py-4 ${vi > 0 ? "border-t border-border/70" : ""}`}
                    >
                      <div>
                        <p className="font-medium text-antracite">{v.nome}</p>
                        {v.durata && <p className="text-sm text-muted-foreground">{v.durata}</p>}
                      </div>
                      <div className="flex items-center gap-4">
                        <Prezzo prezzo={v.prezzo} />
                        <a
                          data-testid={`servizi-fresha-${fi}-${vi}`}
                          href={FRESHA_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary !min-h-[44px] !px-5 !py-2 text-sm"
                          onClick={() => trackEvent("fresha_click")}
                        >
                          {t.common.bookFresha}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </Reveal>
          );
        })}
        {listinoFiltrato.length === 0 && (
          <p data-testid="servizi-no-results" className="rounded-3xl border border-border bg-carta p-10 text-center text-muted-foreground">
            {fmt(c.noResults, { q: cerca })}
          </p>
        )}
      </div>

      <Reveal>
        <div className="mt-16 text-center">
          <FreshaButton label={c.bottomBtn} testid="servizi-fresha-bottom" className="btn-primary" />
        </div>
      </Reveal>
    </div>
  );
};

export default Servizi;
