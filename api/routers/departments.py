import os
import json
from fastapi import APIRouter, HTTPException, BackgroundTasks
from ..models import ProductRequest, FeedbackRequest, ReturnRequest
import sys

# src klasöründeki modüllere erişebilmek için:
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))
from src.main import (
    run_presale_department, run_listing_department, run_support_department,
    run_finance_department, run_feedback_department, run_return_department
)

router = APIRouter()

def get_mock_data(filename: str):
    filepath = os.path.join(os.path.dirname(__file__), f"../mock_data/{filename}")
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None

@router.post("/presale")
def presale_analysis(request: ProductRequest):
    """Ürün Keşif ve Fiyatlandırma Departmanını Çalıştırır"""
    costs = request.costs or {"base_cost": 100, "shipping_cost": 30, "commission_rate": 15, "other_costs": 10}
    try:
        # Senkron çalışır (Hackathon testleri için şimdilik senkron, ileride BackgroundTasks eklenebilir)
        result = run_presale_department(request.product_name, costs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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
