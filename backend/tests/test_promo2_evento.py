# Iteration 2: promo2 settings validation, evento image upload/files, RSVP, static SEO files
import copy
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]
OG = "/app/frontend/public/assets/og-image.jpg"


@pytest.fixture(scope="module")
def token():
    r = requests.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    if r.status_code != 200:
        pytest.skip(f"login failed {r.status_code}")
    return r.json()["token"]


@pytest.fixture(scope="module")
def original():
    return requests.get(f"{BASE_URL}/api/settings").json()


@pytest.fixture(scope="module", autouse=True)
def restore(token, original):
    yield
    requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={
        "promo2_attiva": True, "promo2_scadenza": "2026-11-30T22:59:59.000Z",
        "promo2_testi": original["promo2_testi"], "open_day_attivo": True,
    })
    requests.delete(f"{BASE_URL}/api/admin/immagine-evento", headers=H(token))


def H(t):
    return {"Authorization": f"Bearer {t}"}


# promo2 defaults
def test_promo2_defaults(original):
    assert original["promo2_attiva"] is True
    assert original["promo2_scadenza"] == "2026-11-30T22:59:59.000Z"
    for lang in ["it", "en", "fr", "de"]:
        t = original["promo2_testi"][lang]
        assert "70" in (t["title"] + t.get("badge", "") + t.get("priceUnit", ""))
        assert t.get("priceTotal", "") == "" and t.get("priceOld", "") == ""
    assert original["open_day_attivo"] is True
    assert original["immagine_evento"] == ""


def test_promo2_no_token():
    assert requests.put(f"{BASE_URL}/api/settings", json={"promo2_attiva": False}).status_code == 401


def test_promo2_bad_date(token):
    assert requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_scadenza": "xx"}).status_code == 422


def test_promo2_missing_it_title(token, original):
    t = copy.deepcopy(original["promo2_testi"])
    t["it"]["title"] = ""
    assert requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_testi": t}).status_code == 422
    t2 = copy.deepcopy(original["promo2_testi"]); del t2["it"]
    assert requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_testi": t2}).status_code == 422


def test_promo2_nonbool(token):
    assert requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_attiva": "yes"}).status_code == 422


def test_promo2_toggle_independent(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_attiva": False})
    assert r.status_code == 200 and r.json()["promo2_attiva"] is False and r.json()["promo_attiva"] is True
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_attiva": True})
    assert r.json()["promo2_attiva"] is True


def test_promo2_local_date_converted(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo2_scadenza": "2026-11-30T23:59:59+01:00"})
    assert r.status_code == 200 and r.json()["promo2_scadenza"] == "2026-11-30T22:59:59.000Z"


# immagine_evento via PUT can only be cleared (non-empty value stripped)
def test_put_immagine_evento_only_nonempty(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"immagine_evento": "hack/x.jpg"})
    assert r.status_code in (200, 400), f"got {r.status_code}: {r.text[:200]}"
    assert requests.get(f"{BASE_URL}/api/settings").json()["immagine_evento"] != "hack/x.jpg"


def test_files_unknown_404():
    assert requests.get(f"{BASE_URL}/api/files/beautycare-losone/evento/nope.jpg").status_code == 404


def test_upload_requires_auth():
    r = requests.post(f"{BASE_URL}/api/admin/immagine-evento", files={"file": ("a.jpg", b"x", "image/jpeg")})
    assert r.status_code == 401


def test_upload_non_image_422(token):
    r = requests.post(f"{BASE_URL}/api/admin/immagine-evento", headers=H(token), files={"file": ("a.txt", b"hello", "text/plain")})
    assert r.status_code == 422


def test_upload_serve_remove(token):
    with open(OG, "rb") as f:
        r = requests.post(f"{BASE_URL}/api/admin/immagine-evento", headers=H(token), files={"file": ("og.jpg", f, "image/jpeg")})
    assert r.status_code == 200, r.text[:300]
    path = r.json()["immagine_evento"]
    assert path
    g = requests.get(f"{BASE_URL}/api/files/{path}")
    assert g.status_code == 200 and g.headers["content-type"].startswith("image/jpeg") and len(g.content) > 1000
    d = requests.delete(f"{BASE_URL}/api/admin/immagine-evento", headers=H(token))
    assert d.status_code == 200 and d.json()["immagine_evento"] == ""
    assert requests.get(f"{BASE_URL}/api/files/{path}").status_code == 404


# RSVP
def test_rsvp_create_and_list(token):
    r = requests.post(f"{BASE_URL}/api/event-rsvps", json={"nome": "TEST_api_rsvp", "telefono": "+41790000000", "persone": 2, "consenso": True})
    assert r.status_code == 200 and r.json()["ok"]
    rows = requests.get(f"{BASE_URL}/api/event-rsvps", headers=H(token)).json()["rsvps"]
    assert any(x["nome"] == "TEST_api_rsvp" for x in rows)


def test_rsvp_validation():
    assert requests.post(f"{BASE_URL}/api/event-rsvps", json={"nome": "TEST_x", "telefono": "1", "consenso": False}).status_code == 422
    assert requests.post(f"{BASE_URL}/api/event-rsvps", json={"nome": "TEST_x", "telefono": "1", "persone": 11, "consenso": True}).status_code == 422


# Static SEO files
def test_robots_sitemap():
    r = requests.get(f"{BASE_URL}/robots.txt")
    assert r.status_code == 200 and "Sitemap:" in r.text and "Disallow: /admin" in r.text
    s = requests.get(f"{BASE_URL}/sitemap.xml")
    assert s.status_code == 200 and "<urlset" in s.text
    for bad in ["/admin", "/link", "/grazie", "/risultato"]:
        assert f"esteticabeautycare.com{bad}<" not in s.text
