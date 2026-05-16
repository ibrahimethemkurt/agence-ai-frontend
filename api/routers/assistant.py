from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from google.genai import types

from ..database import get_db
from ..models import User
from ..services.assistant_service import get_assistant_reply
from .auth import get_current_user

router = APIRouter()

# ==========================================
# PYDANTIC ŞEMALARI
# ==========================================

class ConversationMessage(BaseModel):
    role: str   # "user" veya "model"
    text: str

class ChatRequest(BaseModel):
    message: str
    mode: str = "advisor"  # "system" veya "advisor"
    history: Optional[list[ConversationMessage]] = []  # Frontend'den gelen konuşma geçmişi

class ChatResponse(BaseModel):
    reply: str
    mode: str


# ==========================================
# ENDPOINT
# ==========================================

@router.post("/chat", response_model=ChatResponse)
def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    2 Modlu AI Asistan Chat Endpoint'i.
    
    - mode='system'  → Kullanıcının DB'deki verileri üzerinden konuşur
    - mode='advisor' → Genel e-ticaret danışmanı gibi davranır
    
    Frontend, konuşma geçmişini 'history' alanında göndermelidir.
    """
    if request.mode not in ["system", "advisor"]:
        raise HTTPException(status_code=400, detail="Geçersiz mod. 'system' veya 'advisor' olmalıdır.")

    # Frontend'den gelen history'yi Gemini formatına çevir
    conversation_history = []
    for msg in (request.history or []):
        role = msg.role if msg.role in ["user", "model"] else "user"
        conversation_history.append(
            types.Content(role=role, parts=[types.Part(text=msg.text)])
        )

    reply = get_assistant_reply(
        message=request.message,
        mode=request.mode,
        conversation_history=conversation_history,
        user=current_user,
        db=db
    )

    return ChatResponse(reply=reply, mode=request.mode)
