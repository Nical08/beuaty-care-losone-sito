import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { getSettings, getPercorsi } from "./api";
import { trackEvent } from "./api";
import { useLang, localizePercorso } from "./langContext";

const SiteContext = createContext(null);

export const useSite = () => useContext(SiteContext);

export function SiteProvider({ children }) {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [settings, setSettings] = useState({});
  const [percorsiRaw, setPercorsiRaw] = useState([]);
  const [areeRaw, setAreeRaw] = useState([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizDismissed, setQuizDismissed] = useState(
    () => sessionStorage.getItem("bc_quiz_dismissed") === "1"
  );

  useEffect(() => {
    getSettings().then(setSettings).catch(() => {});
    getPercorsi()
      .then((d) => { setPercorsiRaw(d.percorsi); setAreeRaw(d.aree); })
      .catch(() => {});
  }, []);

  const percorsi = useMemo(() => percorsiRaw.map((p) => localizePercorso(p, t)), [percorsiRaw, t]);
  const aree = useMemo(() => areeRaw.map((a) => ({ ...a, nome: t.aree?.[a.id] || a.nome })), [areeRaw, t]);

  // Apertura automatica solo in home: dopo 15s o al 40% di scroll, una volta per sessione; ?quiz=1 la forza ovunque
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quiz") === "1") {
      setQuizOpen(true);
      return;
    }
    if (quizDismissed || pathname !== "/") return;
    const open = () => setQuizOpen(true);
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max > 0 && window.scrollY / max >= 0.4) open();
    };
    const timer = setTimeout(open, 15000);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { clearTimeout(timer); window.removeEventListener("scroll", onScroll); };
  }, [quizDismissed, pathname]);

  const openQuiz = useCallback(() => {
    setQuizOpen(true);
    trackEvent("quiz_start");
  }, []);
  const closeQuiz = useCallback(() => {
    setQuizOpen(false);
    setQuizDismissed(true);
    sessionStorage.setItem("bc_quiz_dismissed", "1");
  }, []);

  const percorsoByHandle = useCallback(
    (handle) => percorsi.find((p) => p.handle === handle),
    [percorsi]
  );

  return (
    <SiteContext.Provider
      value={{ settings, setSettings, percorsi, aree, quizOpen, openQuiz, closeQuiz, percorsoByHandle }}
    >
      {children}
    </SiteContext.Provider>
  );
}
