from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import departments

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
app.include_router(departments.router, prefix="/api/v1/departments")

@app.get("/")
def read_root():
    return {"message": "Agence AI API sistemine hoş geldiniz. Dokümantasyon için /docs adresine gidin."}
