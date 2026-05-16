from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Dict, Any, Optional
from .database import Base

# ==========================================
# 1. SQLALCHEMY MODELLERİ (Veritabanı Tabloları)
# ==========================================

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    department = Column(String) # presale, finance, support vs.
    status = Column(String, default="pending") # pending, processing, completed, failed
    result_json = Column(Text, nullable=True) # AI'dan dönen JSON çıktısı
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

# ==========================================
# 2. PYDANTIC MODELLERİ (Veri Doğrulama / Request-Response)
# ==========================================

class ProductRequest(BaseModel):
    product_name: str
    costs: Optional[Dict[str, float]] = None

class FeedbackRequest(BaseModel):
    product_id: str
    
class ReturnRequest(BaseModel):
    product_id: str

# API'den frontend'e dönecek Job (Görev) formatı
class JobResponse(BaseModel):
    job_id: int
    status: str
    message: str
