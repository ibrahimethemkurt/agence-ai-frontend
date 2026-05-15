import os
from crewai import LLM

def get_gemini_llm():
    """Merkezi LLM yapılandırması. Tüm ajanlar bu ayarı kullanır."""
    return LLM(
        model="gemini/gemini-2.5-flash-lite",
        api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3
    )
