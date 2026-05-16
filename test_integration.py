"""
Agence AI - Kapsamlı Entegrasyon Test Scripti
Auth → Ürün → Presale Analizi → DB Kontrolü → AI Asistan
"""

import requests
import json
import time

BASE_URL = "http://localhost:8000/api/v1"
TOKEN = None
HEADERS = {}

# ── Renkli çıktı için ────────────────────────────────────────────────────────
def ok(msg):   print(f"  ✅ {msg}")
def fail(msg): print(f"  ❌ {msg}")
def info(msg): print(f"  ℹ️  {msg}")
def section(msg): print(f"\n{'═'*60}\n🔷 {msg}\n{'═'*60}")

def post(endpoint, body, auth=True):
    h = {**HEADERS, "Content-Type": "application/json"} if auth else {"Content-Type": "application/json"}
    r = requests.post(f"{BASE_URL}{endpoint}", json=body, headers=h)
    return r

def get(endpoint, auth=True):
    h = HEADERS if auth else {}
    r = requests.get(f"{BASE_URL}{endpoint}", headers=h)
    return r

# ── 1. AUTH TESTLERİ ──────────────────────────────────────────────────────────
section("1. AUTH — REGISTER & LOGIN")

# Register
r = post("/auth/register", {
    "full_name": "Test Kullanıcı",
    "company_name": "Test Mağazası",
    "email": "test@agenceai.com",
    "password": "Test1234!",
    "password_confirm": "Test1234!"
}, auth=False)

if r.status_code == 201:
    ok(f"Register başarılı: {r.json()}")
elif r.status_code == 400 and "zaten" in r.text:
    info("Kullanıcı zaten kayıtlı, login'e geçiliyor.")
else:
    fail(f"Register başarısız [{r.status_code}]: {r.text}")

# Login
r = post("/auth/login", {
    "email": "test@agenceai.com",
    "password": "Test1234!"
}, auth=False)

if r.status_code == 200:
    TOKEN = r.json()["access_token"]
    HEADERS["Authorization"] = f"Bearer {TOKEN}"
    ok(f"Login başarılı. Token alındı: {TOKEN[:40]}...")
else:
    fail(f"Login başarısız [{r.status_code}]: {r.text}")
    exit(1)

# ── 2. ÜRÜN EKLEME ────────────────────────────────────────────────────────────
section("2. ÜRÜN EKLEME")

r = post("/products/", {
    "name": "Sony WH-1000XM5 Kulaklık",
    "description": "Gürültü önleyici premium Bluetooth kulaklık",
    "category": "Elektronik"
})

if r.status_code == 201:
    product = r.json()
    PRODUCT_ID = product["id"]
    ok(f"Ürün oluşturuldu → ID: {PRODUCT_ID} | Ad: {product['name']}")
else:
    fail(f"Ürün oluşturma başarısız [{r.status_code}]: {r.text}")
    exit(1)

# Ürün listesi kontrolü
r = get("/products/")
if r.status_code == 200:
    products = r.json()
    ok(f"Ürün listesi alındı. Toplam {len(products)} ürün var.")
else:
    fail(f"Ürün listesi alınamadı: {r.text}")

# ── 3. PRESALE ANALİZİ ────────────────────────────────────────────────────────
section("3. PRESALE (Pazar & Fiyat) ANALİZİ BAŞLATILIYOR")

r = post("/departments/presale", {
    "product_id": PRODUCT_ID,
    "costs": {
        "base_cost": 2500,
        "shipping_cost": 80,
        "commission_rate": 12,
        "other_costs": 50
    }
})

if r.status_code == 200:
    job = r.json()
    PRESALE_JOB_ID = job["job_id"]
    ok(f"Presale analizi başlatıldı → Job ID: {PRESALE_JOB_ID} | Status: {job['status']}")
    info("AI ajanları arka planda çalışıyor (CrewAI)...")
else:
    fail(f"Presale başlatılamadı [{r.status_code}]: {r.text}")
    exit(1)

# ── 4. LİSTİNG ANALİZİ ───────────────────────────────────────────────────────
section("4. LISTING (SEO & Sosyal Medya) ANALİZİ BAŞLATILIYOR")

r = post("/departments/listing", {"product_id": PRODUCT_ID})

if r.status_code == 200:
    job = r.json()
    LISTING_JOB_ID = job["job_id"]
    ok(f"Listing analizi başlatıldı → Job ID: {LISTING_JOB_ID}")
else:
    fail(f"Listing başlatılamadı [{r.status_code}]: {r.text}")
    LISTING_JOB_ID = None

# ── 5. AI ASİSTAN TESTİ (hızlı, CrewAI yok) ─────────────────────────────────
section("5. AI ASİSTAN TESTİ (Her iki mod)")

# Mod 1: Sistem Asistanı
r = post("/assistant/chat", {
    "message": "Şu an sistemimde kaç ürün var ve hangileri?",
    "mode": "system",
    "history": []
})
if r.status_code == 200:
    reply = r.json()["reply"]
    ok("Sistem Asistanı yanıt verdi:")
    print(f"\n     '{reply[:300]}...'\n")
else:
    fail(f"Sistem asistanı başarısız [{r.status_code}]: {r.text}")

# Mod 2: E-Ticaret Danışmanı
r = post("/assistant/chat", {
    "message": "Trendyol'da kulaklık satışımı nasıl artırabilirim?",
    "mode": "advisor",
    "history": []
})
if r.status_code == 200:
    reply = r.json()["reply"]
    ok("E-Ticaret Danışmanı yanıt verdi:")
    print(f"\n     '{reply[:300]}...'\n")
else:
    fail(f"E-ticaret danışmanı başarısız [{r.status_code}]: {r.text}")

# ── 6. JOB DURUMU POLLİNG (30 saniye bekle) ──────────────────────────────────
section("6. JOB DURUMU POLLİNG (max 60sn, her 10sn)")

start = time.time()
for i in range(6):
    time.sleep(10)
    elapsed = int(time.time() - start)

    r = get(f"/jobs/{PRESALE_JOB_ID}")
    if r.status_code == 200:
        job = r.json()
        status = job["status"]
        info(f"[{elapsed}s] Presale Job {PRESALE_JOB_ID} → Status: {status}")
        if status == "completed":
            ok("Presale analizi TAMAMLANDI!")
            result = job.get("result", "")
            if result:
                print(f"\n     Sonuç (ilk 400 karakter):\n     {result[:400]}...\n")
            break
        elif status == "failed":
            fail(f"Presale analizi BAŞARISIZ: {job.get('error')}")
            break
    else:
        fail(f"Job sorgulanamadı: {r.text}")

# ── 7. VERİTABANI SON DURUM KONTROLÜ ─────────────────────────────────────────
section("7. VERİTABANI SON DURUM")

import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.dirname(os.path.abspath(__file__)))

from api.database import engine
from api.models import User, Product, AIReport
from sqlalchemy.orm import Session

with Session(engine) as db:
    users = db.query(User).all()
    products = db.query(Product).all()
    reports = db.query(AIReport).all()

    ok(f"USERS tablosu: {len(users)} kayıt")
    for u in users:
        print(f"     → #{u.id} | {u.full_name} | {u.email}")

    ok(f"PRODUCTS tablosu: {len(products)} kayıt")
    for p in products:
        print(f"     → #{p.id} | {p.name} | user_id={p.user_id}")

    ok(f"AI_REPORTS tablosu: {len(reports)} kayıt")
    for r in reports:
        print(f"     → #{r.id} | dept={r.department} | status={r.status} | product_id={r.product_id} | user_id={r.user_id}")

section("TEST TAMAMLANDI")
