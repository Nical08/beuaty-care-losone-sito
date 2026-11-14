import json
D = {
 "it": dict(ritiro="Durante l'evento potrai ritirare i buoni regalo da usare sui tuoi trattamenti.",
   ritiroEvento="Puoi anche ritirarli di persona durante il Christmas Gift Experience del 27 novembre al Golf Ascona.",
   waBtn="Richiedi il buono su WhatsApp", waMsg="Ciao, vorrei un buono regalo",
   nf=dict(title="Pagina non trovata", text="La pagina che cerchi non esiste o è stata spostata.", btn="Torna alla home")),
 "en": dict(ritiro="At the event you can collect your gift vouchers to use on your treatments.",
   ritiroEvento="You can also collect them in person at the Christmas Gift Experience on 27 November at Golf Ascona.",
   waBtn="Request a voucher on WhatsApp", waMsg="Hello, I would like a gift voucher",
   nf=dict(title="Page not found", text="The page you are looking for does not exist or has been moved.", btn="Back to home")),
 "fr": dict(ritiro="Pendant l'événement, vous pourrez retirer vos bons cadeaux à utiliser sur vos soins.",
   ritiroEvento="Vous pouvez aussi les retirer sur place lors du Christmas Gift Experience du 27 novembre au Golf Ascona.",
   waBtn="Demander un bon sur WhatsApp", waMsg="Bonjour, je souhaiterais un bon cadeau",
   nf=dict(title="Page introuvable", text="La page que vous cherchez n'existe pas ou a été déplacée.", btn="Retour à l'accueil")),
 "de": dict(ritiro="Während der Veranstaltung können Sie Ihre Geschenkgutscheine für Ihre Behandlungen abholen.",
   ritiroEvento="Sie können sie auch persönlich beim Christmas Gift Experience am 27. November im Golf Ascona abholen.",
   waBtn="Gutschein auf WhatsApp anfragen", waMsg="Guten Tag, ich möchte einen Geschenkgutschein",
   nf=dict(title="Seite nicht gefunden", text="Die gesuchte Seite existiert nicht oder wurde verschoben.", btn="Zurück zur Startseite")),
}
j = lambda s: json.dumps(s, ensure_ascii=False)
for l, d in D.items():
    p = f"/app/frontend/src/i18n/{l}.js"; t = open(p).read()
    b = t.index("\n  buoni: {")
    n = t.index("\n    note:", b); e = t.index("\n", n + 1)
    t = t[:e] + f"\n    ritiroEvento: {j(d['ritiroEvento'])},\n    waBtn: {j(d['waBtn'])},\n    waMsg: {j(d['waMsg'])}," + t[e:]
    ev = t.index("\n  evento: {")
    n = t.index("\n    benefit2b:", ev); e = t.index("\n", n + 1)
    t = t[:e] + f"\n    ritiro: {j(d['ritiro'])}," + t[e:]
    b = t.index("\n  buoni: {")
    nf = d["nf"]
    t = t[:b] + f"\n  notFound: {{\n    title: {j(nf['title'])},\n    text: {j(nf['text'])},\n    btn: {j(nf['btn'])},\n  }}," + t[b:]
    open(p, "w").write(t)
print("ok")
