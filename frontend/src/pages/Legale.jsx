import { useLang } from "@/lib/langContext";

const Legale = ({ tipo }) => {
  const { t } = useLang();
  const c = t.legale[tipo];
  return (
    <div data-testid={`legale-${tipo}-page`} className="container-site max-w-3xl py-16 lg:py-24">
      <p className="eyebrow mb-3">Beauty &amp; Care · Losone</p>
      <h1 className="font-serif text-4xl font-semibold text-antracite">{c.titolo}</h1>
      <div className="mt-8 space-y-5 leading-relaxed text-muted-foreground">
        {c.corpo.map((p, i) => <p key={i}>{p}</p>)}
      </div>
    </div>
  );
};

export default Legale;
