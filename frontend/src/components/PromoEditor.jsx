import { useEffect, useState } from "react";
import { adminUpdateSettings } from "@/lib/api";
import { useSite } from "@/lib/siteContext";

const LANGS = [["it", "Italiano"], ["en", "English"], ["fr", "Français"], ["de", "Deutsch"]];
const FIELDS = [
  ["badge", "Etichetta (es. Promo · Novembre)"],
  ["title", "Titolo"],
  ["text", "Descrizione", true],
  ["priceUnit", "Prezzo principale (es. CHF 50)"],
  ["priceNote", "Nota prezzo (es. a seduta invece di CHF 60)"],
  ["priceTotal", "Prezzo totale (es. 10 sedute: CHF 500)"],
  ["priceOld", "Prezzo barrato (es. invece di CHF 600)"],
  ["ctaFresha", "Testo pulsante Fresha"],
  ["ctaWa", "Testo pulsante WhatsApp"],
  ["waMsg", "Messaggio WhatsApp precompilato", true],
];

const toLocalInput = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export const PromoEditor = ({ token }) => {
  const { settings, setSettings } = useSite();
  const [attiva, setAttiva] = useState(!!settings.promo_attiva);
  const [scadenza, setScadenza] = useState(toLocalInput(settings.promo_scadenza));
  const [testi, setTesti] = useState(settings.promo_testi || {});
  const [tab, setTab] = useState("it");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setAttiva(!!settings.promo_attiva);
    setScadenza(toLocalInput(settings.promo_scadenza));
    setTesti(settings.promo_testi || {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.promo_attiva, settings.promo_scadenza, JSON.stringify(settings.promo_testi || {})]);

  const setField = (k, v) => setTesti({ ...testi, [tab]: { ...(testi[tab] || {}), [k]: v } });
  const scaduta = scadenza && new Date(scadenza) <= new Date();

  const save = async () => {
    setMsg("");
    try {
      const updated = await adminUpdateSettings(token, {
        promo_attiva: attiva,
        promo_scadenza: new Date(scadenza).toISOString(),
        promo_testi: testi,
      });
      setSettings(updated);
      setMsg("Promo salvata.");
    } catch (err) {
      const det = err.response?.data?.detail;
      setMsg(typeof det === "string" ? det : "Salvataggio non riuscito.");
    }
  };

  return (
    <div data-testid="admin-promo-editor" className="mt-8 rounded-3xl border border-border bg-carta p-6">
      <h2 className="font-serif text-xl font-semibold text-antracite">Promo del mese (Home)</h2>
      <p className="mt-1 text-sm text-muted-foreground">La promo sparisce da sola alla scadenza. Le lingue lasciate vuote mostrano il testo italiano.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border bg-crema px-4 py-3">
          <span className="text-[15px] font-medium text-antracite">Promo attiva</span>
          <input type="checkbox" data-testid="admin-promo-toggle" checked={attiva} onChange={(e) => setAttiva(e.target.checked)} className="h-5 w-5 accent-[#58998B]" />
        </label>
        <label className="block rounded-2xl border border-border bg-crema px-4 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Scadenza (fine promo, ora svizzera)</span>
          <input type="datetime-local" data-testid="admin-promo-scadenza" value={scadenza} onChange={(e) => setScadenza(e.target.value)} className="mt-1 block w-full bg-transparent outline-none" />
        </label>
      </div>
      {scaduta && <p data-testid="admin-promo-expired-warning" className="mt-3 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-800">La data è già passata: la promo non è visibile sul sito.</p>}
      <div className="mt-5 flex flex-wrap gap-2">
        {LANGS.map(([code, label]) => (
          <button key={code} type="button" data-testid={`admin-promo-tab-${code}`} onClick={() => setTab(code)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${tab === code ? "bg-rosa text-carta" : "border border-border bg-crema text-antracite"}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {FIELDS.map(([k, label, long]) => (
          <label key={k} className={long ? "sm:col-span-2" : ""}>
            <span className="text-sm font-semibold text-antracite">{label}</span>
            {long ? (
              <textarea data-testid={`admin-promo-field-${k}`} rows={2} value={testi[tab]?.[k] || ""} placeholder={tab !== "it" ? testi.it?.[k] : ""} onChange={(e) => setField(k, e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-crema px-4 py-2.5 outline-none focus:border-rosa" />
            ) : (
              <input data-testid={`admin-promo-field-${k}`} value={testi[tab]?.[k] || ""} placeholder={tab !== "it" ? testi.it?.[k] : ""} onChange={(e) => setField(k, e.target.value)}
                className="mt-1 min-h-[44px] w-full rounded-xl border border-input bg-crema px-4 outline-none focus:border-rosa" />
            )}
          </label>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <button type="button" data-testid="admin-promo-save-btn" onClick={save} disabled={!scadenza} className="btn-primary !min-h-[44px] !px-6 text-sm">Salva promo</button>
        {msg && <span data-testid="admin-promo-msg" className="text-sm font-medium text-antracite">{msg}</span>}
      </div>
    </div>
  );
};

export default PromoEditor;
