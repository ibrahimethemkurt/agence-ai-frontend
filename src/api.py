from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from typing import Optional, Dict, Any
import uuid
from datetime import datetime

from src.main import run_presale_department

app = FastAPI(title="Agence AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SAHTE (MOCK) GİRİŞ/KAYIT ENDPOINT'LERİ ---
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    full_name: str
    company_name: str
    email: str
    password: str
    password_confirm: str

@app.post("/api/v1/auth/login")
async def login(req: LoginRequest):
    return {"access_token": "dummy_token_12345", "token_type": "bearer"}

@app.post("/api/v1/auth/register")
async def register(req: RegisterRequest):
    return {"message": "Kayıt başarılı", "user": {"email": req.email}}

@app.get("/api/v1/auth/me")
async def get_me():
    return {"email": "demo@agence.ai", "full_name": "Demo Kullanıcı", "company_name": "Agence AI"}


# --- ASIL YAPAY ZEKA ANALİZ ENDPOINT'LERİ ---
# Veritabanı yerine geçici bir sözlük kullanıyoruz
analyses_db = {}

class AnalysisPayload(BaseModel):
    product_name: str
    photo_url: Optional[str] = None
    inputs: Dict[str, Any] = {}

def blocking_analysis_task(analysis_id: str, product_name: str, costs: dict):
    try:
        # Ajanı çalıştır (Bu işlem 30-40 saniye sürebilir)
        presale_result = run_presale_department(product_name, costs)
        
        # Sonucu veritabanına kaydet
        analyses_db[analysis_id]["status"] = "completed"
        analyses_db[analysis_id]["report_json"] = presale_result["raw_output"]
    except Exception as e:
        analyses_db[analysis_id]["status"] = "failed"
        analyses_db[analysis_id]["report_json"] = f"Hata oluştu: {str(e)}"

@app.post("/api/v1/analysis/start")
async def start_analysis(payload: AnalysisPayload, background_tasks: BackgroundTasks):
    try:
        inputs = payload.inputs or {}
        costs = {
            "base_cost": float(inputs.get("base_cost", 150.0)),
            "shipping_cost": float(inputs.get("shipping_cost", 50.0)),
            "commission_rate": float(inputs.get("commission_rate", 15.0)),
            "other_costs": float(inputs.get("other_costs", 20.0))
        }
        product_name = payload.product_name or "Örnek Ürün"

        analysis_id = str(uuid.uuid4())
        
        # Analizi 'processing' durumunda başlatıyoruz
        analyses_db[analysis_id] = {
            "id": analysis_id,
            "product_name": product_name,
            "status": "processing", 
            "report_json": None,
            "created_at": datetime.now().isoformat()
        }

        # Ajanları arka planda çalışması için BackgroundTasks'e gönderiyoruz 
        # (Frontend bu sayede kilitlenmez, "bekleniyor" ekranını gösterir)
        background_tasks.add_task(blocking_analysis_task, analysis_id, product_name, costs)
        
        return {
            "id": analysis_id,
            "status": "processing"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/analysis/{analysis_id}")
async def get_analysis(analysis_id: str):
    if analysis_id not in analyses_db:
        raise HTTPException(status_code=404, detail="Analiz bulunamadı")
    return analyses_db[analysis_id]

@app.get("/api/v1/analysis/")
async def get_user_analyses():
    # Geçmiş analizleri listeleme
    return list(analyses_db.values())

if __name__ == "__main__":
    print("🚀 Agence AI API Başlatılıyor... Frontend'den istek bekleniyor.")
    uvicorn.run("src.api:app", host="0.0.0.0", port=8000, reload=True)
