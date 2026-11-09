import Reveal from "@/components/Reveal";
import FreshaButton from "@/components/FreshaButton";
import { CheckCircle2 } from "lucide-react";
import { useSite } from "@/lib/siteContext";
import { useLang, fmt } from "@/lib/langContext";
import { waLink } from "@/components/WhatsAppFab";

const Grazie = () => {
  const { settings } = useSite();
  const { t } = useLang();
  const c = t.grazie;
  let nome = null;
  try {
    const raw = sessionStorage.getItem("bc_quiz_result");
    if (raw) nome = JSON.parse(raw).nome;
  } catch {}

  return (
    <div data-testid="grazie-page" className="container-site flex min-h-[70vh] flex-col items-center justify-center py-20 text-center">
      <Reveal>
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-salvia-soft text-[#4c5c48]">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="mt-6 max-w-xl font-serif text-4xl font-semibold leading-tight text-antracite sm:text-5xl">
          {fmt(c.title, { nome: nome ? ` ${nome}` : "" })}
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted-foreground">
          {c.p}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <FreshaButton label={c.freshaBtn} testid="grazie-fresha-btn" className="btn-primary" />
          {settings.whatsapp_number && (
            <a data-testid="grazie-whatsapp-btn" href={waLink(settings.whatsapp_number, c.waMsg)} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              {t.common.whatsappWrite}
            </a>
          )}
        </div>
      </Reveal>
    </div>
  );
};

export default Grazie;
