import os
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from ..models import ProductRequest, FeedbackRequest, ReturnRequest, JobResponse, User, Product
from ..database import get_db
from ..repositories.report_repo import ReportRepository
from ..services.ai_service import process_presale_task
from .auth import get_current_user
import sys

# src klasöründeki modüllere erişebilmek için:
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from src.main import (
    run_finance_department, run_feedback_department, run_return_department
)

router = APIRouter()

def get_mock_data(filename: str):
    filepath = os.path.join(os.path.dirname(__file__), f"../mock_data/{filename}")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

@router.post("/presale", response_model=JobResponse)
def presale_analysis(
    request: ProductRequest, 
    background_tasks: BackgroundTasks, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ürün Keşif ve Fiyatlandırma Departmanını Arka Planda Çalıştırır"""
    # 1. Product'ın varlığını ve bu kullanıcıya ait olduğunu kontrol et
    product = db.query(Product).filter(Product.id == request.product_id, Product.user_id == current_user.id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı veya yetkiniz yok.")

    costs = request.costs or {"base_cost": 100, "shipping_cost": 30, "commission_rate": 15, "other_costs": 10}
    
    # 2. Veritabanında boş bir görev (Job) oluştur
    repo = ReportRepository(db)
    job = repo.create_report_job(user_id=current_user.id, product_id=product.id, department="presale")
    
    # 3. Ağır yapay zeka işlemini Background Task'a gönder
    background_tasks.add_task(process_presale_task, job.id, product.name, costs, db)
    
    # 4. Beklemeden anında Job ID dön
    return JobResponse(
        job_id=job.id,
        status="pending",
        message="Yapay zeka analizi başlatıldı. Sonucu /api/v1/jobs/" + str(job.id) + " adresinden sorgulayabilirsiniz."
    )

@router.post("/finance")
def finance_analysis():
    """Finans Departmanını Mock Veri İle Çalıştırır"""
    mock_finance = get_mock_data("sample_finance.json")
    if not mock_finance:
        raise HTTPException(status_code=404, detail="Mock data bulunamadı")
        
    try:
        result = run_finance_department(mock_finance)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/feedback")
def feedback_analysis(request: FeedbackRequest):
    """Müşteri Yorumları Departmanını Mock Veri İle Çalıştırır"""
    mock_reviews = get_mock_data("sample_reviews.json")
    if not mock_reviews:
        raise HTTPException(status_code=404, detail="Mock data bulunamadı")
        
    # Yorumları tek bir metne dönüştür
    reviews_text = " ".join([r.get("comment", "") for r in mock_reviews.get("reviews", [])])
    
    try:
        result = run_feedback_department(reviews_text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
