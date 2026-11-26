# Promo settings (homepage monthly promo) API tests: GET/PUT /api/settings promo fields + validation + auth
import copy
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL").rstrip("/")
ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD"]


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
    r = requests.put(f"{BASE_URL}/api/settings", headers={"Authorization": f"Bearer {token}"}, json={
        "promo_attiva": original["promo_attiva"],
        "promo_scadenza": original["promo_scadenza"],
        "promo_testi": original["promo_testi"],
    })
    assert r.status_code == 200


def H(t):
    return {"Authorization": f"Bearer {t}"}


# GET defaults structure
def test_get_settings_promo_fields(original):
    assert "promo_attiva" in original and isinstance(original["promo_attiva"], bool)
    assert original["promo_scadenza"] == "2026-11-30T22:59:59.000Z"
    for lang in ["it", "en", "fr", "de"]:
        assert lang in original["promo_testi"]
        assert original["promo_testi"][lang]["title"]
    assert "_id" not in original


# PUT without token -> 401
def test_put_no_token():
    r = requests.put(f"{BASE_URL}/api/settings", json={"promo_attiva": False})
    assert r.status_code == 401


def test_put_bad_token():
    r = requests.put(f"{BASE_URL}/api/settings", headers=H("abc"), json={"promo_attiva": False})
    assert r.status_code == 401


# Toggle off/on persists
def test_toggle_promo(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_attiva": False})
    assert r.status_code == 200 and r.json()["promo_attiva"] is False
    assert requests.get(f"{BASE_URL}/api/settings").json()["promo_attiva"] is False
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_attiva": True})
    assert r.json()["promo_attiva"] is True


# Date update persists
def test_update_scadenza(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_scadenza": "2026-12-31T10:00:00.000Z"})
    assert r.status_code == 200
    assert requests.get(f"{BASE_URL}/api/settings").json()["promo_scadenza"] == "2026-12-31T10:00:00.000Z"


def test_invalid_date_422(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_scadenza": "not-a-date"})
    assert r.status_code == 422


def test_empty_date_422(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_scadenza": ""})
    assert r.status_code == 422


# promo_testi validation
def test_testi_without_it_title_422(token, original):
    t = copy.deepcopy(original["promo_testi"])
    t["it"]["title"] = "  "
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_testi": t})
    assert r.status_code == 422


def test_testi_without_it_422(token, original):
    t = copy.deepcopy(original["promo_testi"])
    del t["it"]
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_testi": t})
    assert r.status_code == 422


def test_testi_not_dict_422(token):
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_testi": "x"})
    assert r.status_code == 422


# Update texts; unknown langs/fields stripped
def test_update_testi_and_strip(token, original):
    t = copy.deepcopy(original["promo_testi"])
    t["it"]["title"] = "TEST_Titolo"
    t["en"]["title"] = ""
    t["xx"] = {"title": "bad"}
    t["it"]["evil"] = "x"
    r = requests.put(f"{BASE_URL}/api/settings", headers=H(token), json={"promo_testi": t})
    assert r.status_code == 200
    g = requests.get(f"{BASE_URL}/api/settings").json()["promo_testi"]
    assert g["it"]["title"] == "TEST_Titolo"
    assert g["en"]["title"] == ""
    assert "xx" not in g
    assert "evil" not in g["it"]
