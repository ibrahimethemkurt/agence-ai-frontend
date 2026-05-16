from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import departments, jobs, auth, products, assistant
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
    allow_origins=["*"], # Canlıda burayı kısıtlayın, örn: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotaları (Endpointleri) Bağlama
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/api/v1/products", tags=["Products"])
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["AI Assistant"])
app.include_router(departments.router, prefix="/api/v1/departments", tags=["Departments"])
app.include_router(jobs.router, prefix="/api/v1/jobs", tags=["Jobs"])

@app.get("/")
def read_root():
    return {"message": "Agence AI API sistemine hoş geldiniz. Dokümantasyon için /docs adresine gidin."}
