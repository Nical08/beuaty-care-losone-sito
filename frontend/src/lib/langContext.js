import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { it } from "@/i18n/it";
import { en } from "@/i18n/en";
import { fr } from "@/i18n/fr";
import { de } from "@/i18n/de";

export const LANGS = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

const BUNDLES = { it, en, fr, de };
const STORAGE_KEY = "bc_lang";

const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);

// Unione profonda: la lingua scelta vince, l'italiano copre eventuali chiavi mancanti.
const mergeDeep = (base, extra) => {
  if (Array.isArray(base)) return extra !== undefined ? extra : base;
  if (isObject(base)) {
    const out = { ...base };
    const ext = isObject(extra) ? extra : {};
    for (const k of Object.keys(base)) out[k] = mergeDeep(base[k], ext[k]);
    for (const k of Object.keys(ext)) if (!(k in out)) out[k] = ext[k];
    return out;
  }
  return extra !== undefined ? extra : base;
};

// Sostituisce {{chiave}} con i valori forniti.
export const fmt = (str, vars = {}) =>
  typeof str === "string"
    ? str.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : ""))
    : str;

const detectInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && BUNDLES[saved]) return saved;
  } catch {}
  const nav = (navigator.language || "it").slice(0, 2).toLowerCase();
  return BUNDLES[nav] ? nav : "it";
};

const LangContext = createContext(null);

export const useLang = () => useContext(LangContext);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(detectInitial);

  const setLang = (code) => {
    if (!BUNDLES[code]) return;
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
    setLangState(code);
  };

  const t = useMemo(() => mergeDeep(BUNDLES.it, BUNDLES[lang]), [lang]);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (t.meta?.title) document.title = t.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc && t.meta?.description) desc.setAttribute("content", t.meta.description);
  }, [lang, t]);

  return (
    <LangContext.Provider value={{ lang, setLang, t, langs: LANGS }}>
      {children}
    </LangContext.Provider>
  );
}

// Localizza un percorso arrivato dal backend (italiano) con il bundle attivo.
export const localizePercorso = (p, t) => {
  const tr = t.percorsi?.[p.handle];
  if (!tr) return p;
  const out = { ...p };
  if (tr.nome) out.nome = tr.nome;
  if (tr.promessa) out.promessa = tr.promessa;
  if (tr.adatto_a) out.adatto_a = tr.adatto_a;
  if (Array.isArray(out.livelli) && Array.isArray(tr.livelli)) {
    out.livelli = out.livelli.map((l, i) => ({
      ...l,
      titolo: tr.livelli[i]?.titolo || l.titolo,
      servizi: tr.livelli[i]?.servizi || l.servizi,
      opzioni: tr.livelli[i]?.opzioni !== undefined ? tr.livelli[i].opzioni : l.opzioni,
    }));
  }
  if (Array.isArray(out.faq) && Array.isArray(tr.faq)) {
    out.faq = out.faq.map((f, i) => ({ d: tr.faq[i]?.d || f.d, r: tr.faq[i]?.r || f.r }));
  }
  if (out.protocolli && tr.protocolli) {
    out.protocolli = {
      ...out.protocolli,
      titolo: tr.protocolli.titolo || out.protocolli.titolo,
      intro: tr.protocolli.intro || out.protocolli.intro,
      elenco: (out.protocolli.elenco || []).map((pr, i) => ({
        ...pr,
        nome: tr.protocolli.elenco?.[i]?.nome || pr.nome,
        durata: tr.protocolli.elenco?.[i]?.durata || pr.durata,
        composizione: tr.protocolli.elenco?.[i]?.composizione || pr.composizione,
        obiettivo: tr.protocolli.elenco?.[i]?.obiettivo || pr.obiettivo,
        frequenza: tr.protocolli.elenco?.[i]?.frequenza || pr.frequenza,
      })),
    };
  }
  return out;
};

export const localizeTecnologie = (tecnologie, t) =>
  (tecnologie || []).map((name) => t.tecNames?.[name] || name);
