import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSettings, getPercorsi } from "./api";
import { trackEvent } from "./api";
import { useLang, localizePercorso } from "./langContext";

const SiteContext = createContext(null);

export const useSite = () => useContext(SiteContext);

export function SiteProvider({ children }) {
  const { t } = useLang();
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

  // Apertura automatica 2-3s dopo l'ingresso, una sola volta per sessione; anche con ?quiz=1
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("quiz") === "1") {
      setQuizOpen(true);
      return;
    }
    if (quizDismissed) return;
    const t = setTimeout(() => setQuizOpen(true), 2500);
    return () => clearTimeout(t);
  }, [quizDismissed]);

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
