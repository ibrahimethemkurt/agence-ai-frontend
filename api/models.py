from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from pydantic import BaseModel
from typing import Dict, Any, Optional, List
from .database import Base

# ==========================================
# 1. SQLALCHEMY MODELLERİ (Veritabanı Tabloları)
# ==========================================

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String)
    company_name = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İlişkiler (One-to-Many)
    products = relationship("Product", back_populates="owner")
    reports = relationship("AIReport", back_populates="owner")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True)
    description = Column(Text, nullable=True)
    category = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # İlişkiler
    owner = relationship("User", back_populates="products")
    reports = relationship("AIReport", back_populates="product")

class AIReport(Base):
    __tablename__ = "ai_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) # Rapor kimin?
    product_id = Column(Integer, ForeignKey("products.id")) # Hangi ürünün?
    
    department = Column(String) # presale, finance, support vs.
    status = Column(String, default="pending") # pending, processing, completed, failed
    result_json = Column(Text, nullable=True) # AI'dan dönen JSON çıktısı
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # İlişkiler
    owner = relationship("User", back_populates="reports")
    product = relationship("Product", back_populates="reports")

# ==========================================
# 2. PYDANTIC MODELLERİ (Veri Doğrulama / Request-Response)
# ==========================================

class ProductCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None

class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category: Optional[str]
    created_at: Any
    
    class Config:
        from_attributes = True

class ProductRequest(BaseModel):
    product_id: int
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

class UserCreate(BaseModel):
    full_name: str
    company_name: str
    email: str
    password: str
    password_confirm: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class UserResponse(BaseModel):
    id: int
    full_name: str
    company_name: str
    email: str
    
    class Config:
        from_attributes = True
