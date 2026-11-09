import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";
import { useLang } from "@/lib/langContext";

const LanguageSwitcher = ({ inMobileMenu = false }) => {
  const { lang, setLang, langs, t } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (inMobileMenu) {
    return (
      <div className="mt-4 flex items-center justify-center gap-2" data-testid="lang-switcher-mobile">
        {langs.map((l) => (
          <button
            key={l.code}
            data-testid={`lang-option-${l.code}`}
            onClick={() => setLang(l.code)}
            className={`min-h-[44px] rounded-full border px-4 text-sm font-semibold transition-colors ${
              lang === l.code
                ? "border-rosa bg-rosa-soft text-rosa"
                : "border-border bg-carta text-antracite/70 hover:text-antracite"
            }`}
            aria-pressed={lang === l.code}
          >
            {l.code.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        data-testid="lang-switcher-toggle"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center gap-1.5 rounded-full text-antracite transition-colors hover:bg-elevato"
        aria-label={t.common.languageAria}
        aria-expanded={open}
      >
        <Globe size={20} />
        <span className="text-xs font-bold">{lang.toUpperCase()}</span>
      </button>
      {open && (
        <div
          data-testid="lang-switcher-menu"
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-border bg-carta py-1 shadow-lg"
        >
          {langs.map((l) => (
            <button
              key={l.code}
              data-testid={`lang-option-${l.code}`}
              onClick={() => { setLang(l.code); setOpen(false); }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[15px] transition-colors hover:bg-elevato/70 ${
                lang === l.code ? "font-semibold text-rosa" : "text-antracite"
              }`}
            >
              {l.label}
              {lang === l.code && <Check size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
