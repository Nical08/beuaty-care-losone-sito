p="/app/backend/server.py"; t=open(p).read()
t=t.replace("from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends\nfrom fastapi.responses import StreamingResponse\n",
"import uuid\nimport asyncio\nimport requests\nfrom fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, UploadFile, File\nfrom fastapi.responses import StreamingResponse, Response\n")
t=t.replace('''# ---------- Percorsi (catalogo locale''','''# ---------- Immagine evento (Emergent Object Storage) ----------

STORAGE_BASE = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip() or "https://integrations.emergentagent.com"
STORAGE_URL = STORAGE_BASE.rstrip("/") + "/objstore/api/v1/storage"
APP_NAME = "beautycare-losone"
IMAGE_TYPES = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}
MAX_IMAGE_BYTES = 8 * 1024 * 1024
storage_key = None


def init_storage(force: bool = False):
    global storage_key
    if storage_key and not force:
        return storage_key
    resp = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": os.environ["EMERGENT_LLM_KEY"]}, timeout=30)
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key


def storage_request(method: str, path: str, **kwargs):
    for attempt in range(2):
        key = init_storage(force=attempt == 1)
        headers = {"X-Storage-Key": key, **kwargs.pop("headers", {})}
        resp = requests.request(method, f"{STORAGE_URL}/objects/{path}", headers=headers, timeout=120, **kwargs)
        if resp.status_code != 404 or attempt == 1:
            resp.raise_for_status()
            return resp
        kwargs["headers"] = {k: v for k, v in headers.items() if k != "X-Storage-Key"}


@api_router.post("/admin/immagine-evento")
async def upload_immagine_evento(file: UploadFile = File(...), admin=Depends(require_admin)):
    ext = IMAGE_TYPES.get(file.content_type or "")
    if not ext:
        raise HTTPException(status_code=422, detail="Formato non supportato: usa JPG, PNG o WEBP")
    data = await file.read()
    if len(data) > MAX_IMAGE_BYTES:
        raise HTTPException(status_code=422, detail="Immagine troppo grande (max 8 MB)")
    path = f"{APP_NAME}/evento/{uuid.uuid4()}.{ext}"
    resp = await asyncio.to_thread(storage_request, "PUT", path, data=data, headers={"Content-Type": file.content_type})
    stored = resp.json()["path"]
    await db.files.update_many({"categoria": "evento", "is_deleted": False}, {"$set": {"is_deleted": True}})
    await db.files.insert_one({
        "storage_path": stored, "categoria": "evento", "original_filename": file.filename,
        "content_type": file.content_type, "size": len(data), "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    await db.settings.update_one({"_id": "site"}, {"$set": {"immagine_evento": stored}}, upsert=True)
    return await get_settings()


@api_router.delete("/admin/immagine-evento")
async def delete_immagine_evento(admin=Depends(require_admin)):
    await db.files.update_many({"categoria": "evento", "is_deleted": False}, {"$set": {"is_deleted": True}})
    await db.settings.update_one({"_id": "site"}, {"$set": {"immagine_evento": ""}}, upsert=True)
    return await get_settings()


@api_router.get("/files/{path:path}")
async def get_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": False})
    if not record:
        raise HTTPException(status_code=404, detail="File non trovato")
    resp = await asyncio.to_thread(storage_request, "GET", path)
    return Response(content=resp.content, media_type=record["content_type"], headers={"Cache-Control": "public, max-age=86400"})


# ---------- Percorsi (catalogo locale''')
t=t.replace('''    await db.settings.update_one({"_id": "site", "whatsapp_number": "417964944005"}''','''    await db.settings.update_one({"_id": "site", "mig_evento_2026": {"$exists": False}}, {"$set": {"open_day_attivo": True, "mig_evento_2026": True}})
    try:
        await asyncio.to_thread(init_storage)
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    await db.settings.update_one({"_id": "site", "whatsapp_number": "417964944005"}''')
open(p,"w").write(t)
