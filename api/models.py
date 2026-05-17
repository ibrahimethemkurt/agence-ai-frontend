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

# ==========================================
# 2. PYDANTIC MODELLERİ (Veri Doğrulama / Request-Response)
# ==========================================

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
