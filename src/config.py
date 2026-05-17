import os
import random
from crewai import LLM

def get_gemini_llm():
    """Merkezi LLM yapılandırması. Tüm ajanlar bu ayarı kullanır.
    GEMINI_API_KEY_1, _2, _3... gibi birden fazla key varsa rate-limit
    aşmamak için aralarında rastgele seçim yapar (Round-Robin Pool)."""
    
    # .env dosyasındaki GEMINI_API_KEY ile başlayan tüm key'leri topla
    keys = [v for k, v in os.environ.items() if k.startswith("GEMINI_API_KEY") and v]
    
    if not keys:
        api_key = "MISSING_API_KEY"
    else:
        api_key = random.choice(keys)
        
    return LLM(
        model="gemini/gemini-2.5-flash-lite",
        api_key=api_key,
        temperature=0.3
    )
