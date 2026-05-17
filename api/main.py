from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth
from .database import engine, Base

# Uygulama başlarken Veritabanı tablolarını oluştur (Eğer yoksa yaratır)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Agence AI - E-Ticaret Yapay Zeka Ajansı API",
    description="E-ticaret süreçlerini yöneten çoklu ajan sistemi",
    version="1.0.0"
)

# CORS Ayarları (Frontend'den istek alabilmek için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173", "http://127.0.0.1:8080", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sadece Auth Rotası
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/")
def read_root():
    return {"message": "Agence AI API sistemine hoş geldiniz. Dokümantasyon için /docs adresine gidin."}
