p="/app/backend/server.py"; t=open(p).read()
promo2 = '''    "promo2_attiva": True,
    "promo2_scadenza": "2026-11-30T22:59:59.000Z",
    "promo2_testi": {
        "it": {
            "badge": "Promo · Novembre",
            "title": "Epilazione laser −70%",
            "text": "Per tutto il mese di novembre: −70% sulla prima seduta di epilazione laser su zona piccola. Su prenotazione, fino a disponibilità, non cumulabile con altre promozioni.",
            "priceUnit": "−70%",
            "priceNote": "sulla prima seduta · zona piccola",
            "priceTotal": "",
            "priceOld": "",
            "ctaFresha": "Prenota su Fresha",
            "ctaWa": "Scrivici su WhatsApp",
            "waMsg": "Ciao, vorrei approfittare del −70% sulla prima seduta di epilazione laser zona piccola di novembre.",
        },
        "en": {
            "badge": "Promo · November",
            "title": "Laser hair removal −70%",
            "text": "All November long: −70% on your first laser hair removal session on a small area. By appointment, subject to availability, not combinable with other promotions.",
            "priceUnit": "−70%",
            "priceNote": "on your first session · small area",
            "priceTotal": "",
            "priceOld": "",
            "ctaFresha": "Book on Fresha",
            "ctaWa": "Message us on WhatsApp",
            "waMsg": "Hello, I would like to get the −70% offer on my first laser hair removal session on a small area in November.",
        },
        "fr": {
            "badge": "Promo · Novembre",
            "title": "Épilation laser −70 %",
            "text": "Tout le mois de novembre : −70 % sur la première séance d'épilation laser sur une petite zone. Sur rendez-vous, dans la limite des disponibilités, non cumulable avec d'autres promotions.",
            "priceUnit": "−70 %",
            "priceNote": "sur la première séance · petite zone",
            "priceTotal": "",
            "priceOld": "",
            "ctaFresha": "Réserver sur Fresha",
            "ctaWa": "Écrivez-nous sur WhatsApp",
            "waMsg": "Bonjour, je souhaiterais profiter de l'offre −70 % sur ma première séance d'épilation laser sur une petite zone en novembre.",
        },
        "de": {
            "badge": "Promo · November",
            "title": "Laser-Haarentfernung −70 %",
            "text": "Den ganzen November: −70 % auf die erste Laser-Haarentfernungs-Sitzung einer kleinen Zone. Nur mit Termin, solange verfügbar, nicht mit anderen Aktionen kombinierbar.",
            "priceUnit": "−70 %",
            "priceNote": "auf die erste Sitzung · kleine Zone",
            "priceTotal": "",
            "priceOld": "",
            "ctaFresha": "Auf Fresha buchen",
            "ctaWa": "Schreib uns auf WhatsApp",
            "waMsg": "Guten Tag, ich möchte im November das −70 %-Angebot für die erste Laser-Haarentfernungs-Sitzung einer kleinen Zone nutzen.",
        },
    },
    "immagine_evento": "",
}

PROMO_LANGS'''
t=t.replace("}\n\nPROMO_LANGS", promo2, 1)
old_v = t[t.index('    if "promo_scadenza" in allowed:'):t.index('            raise HTTPException(status_code=422, detail="Il titolo in italiano è obbligatorio")')+len('            raise HTTPException(status_code=422, detail="Il titolo in italiano è obbligatorio")')]
new_v = '''    if allowed.get("immagine_evento", "") != "":
        allowed.pop("immagine_evento")
    for prefix in ("promo", "promo2"):
        validate_promo_block(allowed, prefix)


def validate_promo_block(allowed: dict, prefix: str):
''' + old_v.replace('"promo_scadenza"', 'f"{prefix}_scadenza"').replace('"promo_testi"', 'f"{prefix}_testi"')
t=t.replace(old_v,new_v)
t=t.replace('''    settings = {**DEFAULT_SETTINGS, **{k: v for k, v in doc.items() if k != "_id"}}''','''    settings = {**DEFAULT_SETTINGS, **{k: v for k, v in doc.items() if k in DEFAULT_SETTINGS}}''')
open(p,"w").write(t)
