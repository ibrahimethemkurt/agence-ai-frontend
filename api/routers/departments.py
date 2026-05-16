import os
from fastapi import APIRouter, HTTPException, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from ..models import JobResponse, User, Product
from ..database import get_db
from ..repositories.report_repo import ReportRepository
from ..services.ai_service import (
    process_presale_task, process_listing_task, process_support_task,
    process_finance_task, process_feedback_task, process_return_task
)
from .auth import get_current_user

router = APIRouter()

# ── Request Şemaları ───────────────────────────────────────────────────────────

class PresaleRequest(BaseModel):
    product_id: int
    costs: Optional[dict] = None

class ProductOnlyRequest(BaseModel):   # listing, support
    product_id: int

class FinanceRequest(BaseModel):
    product_id: int
    financial_data: dict

class FeedbackRequest(BaseModel):
    product_id: int
    review_text: str

class ReturnRequest(BaseModel):
    product_id: int
    return_reason: str

# ── Yardımcı: Ürünü doğrula ve döndür ────────────────────────────────────────

def get_product_or_404(product_id: int, user_id: int, db: Session) -> Product:
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.user_id == user_id
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Ürün bulunamadı veya yetkiniz yok.")
    return product

# ── Ortak job başlatıcı ───────────────────────────────────────────────────────

def start_job(department: str, user_id: int, product_id: int,
              background_tasks: BackgroundTasks, fn, db: Session, *args) -> JobResponse:
    repo = ReportRepository(db)
    job = repo.create_report_job(user_id=user_id, product_id=product_id, department=department)
    background_tasks.add_task(fn, job.id, *args, db)
    return JobResponse(
        job_id=job.id,
        status="pending",
        message=f"{department.upper()} analizi başlatıldı. Sonucu /api/v1/jobs/{job.id} adresinden sorgulayabilirsiniz."
    )

# ── 1. PRESALE ────────────────────────────────────────────────────────────────
@router.post("/presale", response_model=JobResponse)
def presale_analysis(
    request: PresaleRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Ürün Keşif ve Fiyatlandırma Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    costs = request.costs or {"base_cost": 100, "shipping_cost": 30, "commission_rate": 15, "other_costs": 10}
    return start_job("presale", current_user.id, product.id, background_tasks,
                     process_presale_task, db, product.name, costs)


# ── 2. LISTING ────────────────────────────────────────────────────────────────
@router.post("/listing", response_model=JobResponse)
def listing_analysis(
    request: ProductOnlyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """SEO ve Sosyal Medya Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    return start_job("listing", current_user.id, product.id, background_tasks,
                     process_listing_task, db, product.name)


# ── 3. SUPPORT ────────────────────────────────────────────────────────────────
@router.post("/support", response_model=JobResponse)
def support_analysis(
    request: ProductOnlyRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Müşteri Destek Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    return start_job("support", current_user.id, product.id, background_tasks,
                     process_support_task, db, product.name)


# ── 4. FINANCE ────────────────────────────────────────────────────────────────
@router.post("/finance", response_model=JobResponse)
def finance_analysis(
    request: FinanceRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Finans ve Maliyet Optimizasyon Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    return start_job("finance", current_user.id, product.id, background_tasks,
                     process_finance_task, db, request.financial_data)


# ── 5. FEEDBACK ───────────────────────────────────────────────────────────────
@router.post("/feedback", response_model=JobResponse)
def feedback_analysis(
    request: FeedbackRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Müşteri Yorum Analizi Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    return start_job("feedback", current_user.id, product.id, background_tasks,
                     process_feedback_task, db, request.review_text)


# ── 6. RETURN ─────────────────────────────────────────────────────────────────
@router.post("/return", response_model=JobResponse)
def return_analysis(
    request: ReturnRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """İade ve Lojistik Yönetimi Departmanını Arka Planda Çalıştırır"""
    product = get_product_or_404(request.product_id, current_user.id, db)
    return start_job("return", current_user.id, product.id, background_tasks,
                     process_return_task, db, request.return_reason)
