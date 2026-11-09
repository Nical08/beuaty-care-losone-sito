// Logica del quiz: Tabella A (D1+D2 -> percorso) e Tabella B (D3+D4 -> livello, messaggio, secondo percorso)
// I testi arrivano dal bundle lingua attivo (src/i18n/*), passato come parametro `quiz`.
import { fmt } from "@/lib/langContext";

// Tabella A
const TABLE_A = {
  "corpo|cellulite": "corpo-leggero",
  "corpo|tonicita": "corpo-tonico",
  "viso|spenta": "luminosita",
  "viso|rughe": "anti-age-metodo-rosa",
  "viso|macchie": "uniformita",
  "viso|acne": "pelle-pulita",
  "peli|duratura": "laser-senza-pensieri",
  "peli|rapida": "liscia-tutto-l-anno",
  "relax|staccare": "pausa-benessere",
  "relax|riequilibrio": "equilibrio",
  "sguardo|intenso": "sguardo",
  "sguardo|sopracciglia": "sguardo",
  "maniepiedi|mani": "mani-e-piedi",
  "maniepiedi|piedi": "mani-e-piedi",
};

const LIVELLO_BY_D4 = { mai: 1, qualche_volta: 2, regolarmente: 3, altro: 2 };

const SECONDO = {
  "under35": { main: "pelle-pulita", alt: "liscia-tutto-l-anno" },
  "35-50": { main: "luminosita", alt: "corpo-leggero" },
  "over50": { main: "anti-age-metodo-rosa", alt: "equilibrio" },
  "altro": { main: "pausa-benessere", alt: "luminosita" },
};

const PERCORSI_CORPO = ["corpo-leggero", "corpo-tonico"];

export const d1Label = (quiz, id) => quiz.d1.find((o) => o.id === id)?.label || id;
export const d2Label = (quiz, d1, id) => quiz.d2[d1]?.find((o) => o.id === id)?.label || id || "–";
export const d3Label = (quiz, id) => quiz.d3.find((o) => o.id === id)?.label || id;
export const d4Label = (quiz, id) => quiz.d4.find((o) => o.id === id)?.label || id;

export function computeResult({ d1, d2, d3, d4 }, quiz) {
  const percorso = d1 === "altro" || !d2 || d2 === "altro" || d2 === "valutazione"
    ? "consulenza"
    : TABLE_A[`${d1}|${d2}`] || "consulenza";
  let msg = quiz.tableB[`${d3}|${d4}`] || quiz.tableB["altro|altro"];
  if (PERCORSI_CORPO.includes(percorso)) {
    for (const [from, to] of quiz.bodyAdjust || []) msg = msg.replaceAll(from, to);
  }
  const sec = SECONDO[d3] || SECONDO["altro"];
  const secondo = percorso === sec.main ? sec.alt : sec.main;
  return { percorso, livello: LIVELLO_BY_D4[d4] || 2, messaggio: msg, secondo };
}

export function buildWhatsAppMessage({ nome, percorsoNome, livello, altroText, d1, d2, d3, d4 }, quiz) {
  let msg = percorsoNome
    ? fmt(quiz.waWith, { nome, percorso: percorsoNome, livello })
    : fmt(quiz.waWithout, { nome });
  if (altroText) msg += fmt(quiz.waWhat, { altro: altroText });
  msg += fmt(quiz.waQuizLine, {
    d1: d1Label(quiz, d1),
    d2: d2 ? d2Label(quiz, d1, d2) : quiz.altroWord,
    d3: d3Label(quiz, d3),
    d4: d4Label(quiz, d4),
  });
  return msg;
}
