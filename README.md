# Estetica Beauty & Care – Losone

Sito ufficiale del centro estetico **Estetica Beauty & Care** di Susana Cabezas Agostino, Via Locarno 58, 6616 Losone (TI).
Online su [esteticabeautycare.com](https://esteticabeautycare.com).

Sito gestito da [WebDev Innovations](https://www.webdevinnovations.ch).

## Cosa contiene
- Sito pubblico in 4 lingue (italiano, inglese, francese, tedesco): corpo, viso, percorsi, servizi, buoni regalo, evento, contatti, FAQ.
- Quiz per scegliere il percorso giusto, promo del mese con conto alla rovescia, iscrizioni all'evento.
- Pannello `/admin` per gestire promo, evento, immagine evento, contatti del quiz, iscrizioni e statistiche.

## Tecnologie
- Frontend: React, Tailwind CSS, cartella `frontend/`
- Backend: FastAPI (Python), cartella `backend/`
- Database: MongoDB

## Configurazione
Le password e le chiavi **non sono nel repository**. Per avviare il progetto crea questi file con i tuoi valori:

`backend/.env`
```
MONGO_URL=
DB_NAME=
ADMIN_EMAIL=
ADMIN_PASSWORD=
JWT_SECRET=
EMERGENT_LLM_KEY=
```

`frontend/.env`
```
REACT_APP_BACKEND_URL=
GENERATE_SOURCEMAP=false
```

Avvio in locale:
```
cd backend && pip install -r requirements.txt && uvicorn server:app --port 8001
cd frontend && yarn install && yarn start
```
