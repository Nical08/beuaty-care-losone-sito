import { useState } from "react";
import { api, fileUrl } from "@/lib/api";
import { useSite } from "@/lib/siteContext";

export const EventoImmagineEditor = ({ token }) => {
  const { settings, setSettings } = useSite();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const auth = { headers: { Authorization: `Bearer ${token}` } };

  const upload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/admin/immagine-evento", fd, auth);
      setSettings(r.data);
      setMsg("Immagine caricata.");
    } catch (err) {
      const det = err.response?.data?.detail;
      setMsg(typeof det === "string" ? det : "Caricamento non riuscito.");
    }
    setBusy(false);
  };

  const remove = async () => {
    const r = await api.delete("/admin/immagine-evento", auth);
    setSettings(r.data);
    setMsg("Immagine rimossa.");
  };

  return (
    <div data-testid="admin-evento-immagine" className="mt-8 rounded-3xl border border-border bg-carta p-6">
      <h2 className="font-serif text-xl font-semibold text-antracite">Immagine pagina evento</h2>
      <p className="mt-1 text-sm text-muted-foreground">Compare in alto nella pagina dell'evento. JPG, PNG o WEBP, max 8 MB.</p>
      {settings.immagine_evento && (
        <img data-testid="admin-evento-immagine-preview" src={fileUrl(settings.immagine_evento)} alt="Anteprima immagine evento" className="mt-4 max-h-56 rounded-2xl border border-border object-cover" />
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <label className={`btn-primary !min-h-[44px] !px-6 cursor-pointer text-sm ${busy ? "opacity-50" : ""}`}>
          {busy ? "Caricamento…" : settings.immagine_evento ? "Cambia immagine" : "Carica immagine"}
          <input data-testid="admin-evento-immagine-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={upload} disabled={busy} className="hidden" />
        </label>
        {settings.immagine_evento && (
          <button type="button" data-testid="admin-evento-immagine-remove" onClick={remove} className="btn-secondary !min-h-[44px] !px-5 text-sm">Rimuovi</button>
        )}
        {msg && <span data-testid="admin-evento-immagine-msg" className="text-sm font-medium text-antracite">{msg}</span>}
      </div>
    </div>
  );
};

export default EventoImmagineEditor;
