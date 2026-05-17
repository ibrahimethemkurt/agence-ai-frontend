import os
from fastapi.testclient import TestClient
from api.main import app
from api.database import engine, Base

# Tabloları oluştur
Base.metadata.create_all(bind=engine)

client = TestClient(app)

print("=== 1. Kullanıcı Kaydı ve Girişi ===")
client.post("/api/v1/auth/register", json={
    "full_name": "Test User",
    "company_name": "Test Co",
    "email": "testpool@agenceai.com",
    "password": "Password123!",
    "password_confirm": "Password123!"
})

login_res = client.post("/api/v1/auth/login", json={
    "email": "testpool@agenceai.com",
    "password": "Password123!"
})

if login_res.status_code == 200:
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Giriş başarılı!")
else:
    print("Giriş başarısız:", login_res.json())
    exit(1)

print("\n=== 2. Presale Analizi (Tek Adımda Ürün + Analiz) ===")
# Senin attığın görsellere göre hazırladığımız yeni sistem!
presale_res = client.post("/api/v1/departments/presale", json={
    "product_name": "Faber-Castell 0.5mm Versatil Kalem",
    "stock": 100,
    "base_cost": 50.0,
    "shipping_cost": 15.0,
    "tax_rate": 20.0,
    "commission_rate": 15.0
}, headers=headers)

if presale_res.status_code == 200:
    print("Presale başlatıldı!", presale_res.json())
    job_id = presale_res.json()["job_id"]
else:
    print("Presale başlatılamadı:", presale_res.json())
    exit(1)

print("\n=== 3. AI Asistan Testi ===")
chat_res = client.post("/api/v1/assistant/chat", json={
    "message": "Sistemimdeki ürünleri sayar mısın?",
    "mode": "system",
    "history": []
}, headers=headers)

if chat_res.status_code == 200:
    print("Asistan Yanıtı:", chat_res.json()["reply"][:200] + "...")
else:
    print("Asistan hatası:", chat_res.text)

print("\n=== TEST TAMAMLANDI ===")
