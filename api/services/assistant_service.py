import os
import json
from typing import Optional
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from ..models import AIReport, Product, User

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-2.5-flash"

# ==========================================
# YARDIMCI: Kullanıcının veritabanı özetini oluşturur
# ==========================================
def build_user_context(user: User, db: Session, date_filter: Optional[str] = None) -> str:
    """
    Kullanıcıya ait ürün ve raporları DB'den çekip
    Gemini'ye gönderilecek bağlam metnine dönüştürür.
    """
    products = db.query(Product).filter(Product.user_id == user.id).all()
    
    report_query = db.query(AIReport).filter(
        AIReport.user_id == user.id,
        AIReport.status == "completed"
    )
    reports = report_query.order_by(AIReport.created_at.desc()).limit(20).all()

    # Ürün listesi
    product_lines = []
    for p in products:
        product_lines.append(f"  - ID:{p.id} | {p.name} | Kategori: {p.category or 'Belirtilmemiş'}")

    # Rapor özeti
    report_lines = []
    for r in reports:
        product_name = r.product.name if r.product else "Bilinmiyor"
        date_str = r.created_at.strftime("%d %B %Y") if r.created_at else "-"
        
        # result_json içinden kısa özet çıkar
        summary = ""
        if r.result_json:
            try:
                data = json.loads(r.result_json)
                if isinstance(data, dict):
                    # İlk anlamlı değeri al
                    for key, val in data.items():
                        if val and not isinstance(val, dict):
                            summary = f"{key}: {str(val)[:80]}"
                            break
            except Exception:
                pass

        report_lines.append(
            f"  - [{date_str}] Departman: {r.department.upper()} | Ürün: {product_name} | {summary}"
        )

    context = f"""
KULLANICI BİLGİLERİ:
Ad: {user.full_name}
Şirket: {user.company_name}

ÜRÜN PORTFÖYܙ ({len(products)} ürün):
{chr(10).join(product_lines) if product_lines else '  - Henüz ürün eklenmemiş.'}

TAMAMLANAN ANALİZLER ({len(reports)} rapor, son 20):
{chr(10).join(report_lines) if report_lines else '  - Henüz tamamlanmış analiz yok.'}
"""
    return context.strip()


# ==========================================
# MOD 1: SİSTEM ASİSTANI (Kullanıcı Verisi Odaklı)
# ==========================================
SYSTEM_ASSISTANT_PROMPT = """Sen AjansAI'nın "Sistem Asistanı"sın. Deneyimli bir iş analistisin.

Görevin:
- Kullanıcının kendi e-ticaret verilerini (ürünler, AI analizleri, raporlar) analiz etmek
- Özet sunmak, trendleri yorumlamak, veriye dayalı içgörüler üretmek
- "Ne oldu?", "Özetle", "Analiz et" gibi sorulara verilere dayanarak cevap vermek

KAPSAM DIŞI: Genel sohbet, spor, haber gibi konularda kibarca "Bu konuda yardımcı olamam, ancak işletmenizle ilgili sorularınızda buradayım." de.

Yanıtlarını Türkçe ver. Kısa ve net ol, gerektiğinde madde listesi kullan.
"""


# ==========================================
# MOD 2: E-TİCARET DANIŞMANI (Genel Uzman)
# ==========================================
ADVISOR_PROMPT = """Sen AjansAI'nın "E-Ticaret Danışmanı"sın. Türkiye'nin en başarılı e-ticaret uzmanısın.

Görevin:
- Trendyol, Hepsiburada, Amazon, Instagram Mağaza gibi platformlarda satış stratejisi konusunda rehberlik etmek
- Gelir artırma, SEO, ürün fotoğrafçılığı, müşteri ilişkileri, iade yönetimi, pazarlama gibi konularda somut öneriler sunmak
- Platformun AI ajanlarını nasıl daha iyi kullanabileceği konusunda ipuçları vermek

KAPSAM DIŞI: Spor, politika, kişisel meseleler gibi e-ticaretle ilgisi olmayan konularda kibarca "Bu konuya girmiyorum, ama e-ticaret stratejinize odaklanabiliriz!" de.

Yanıtlarını Türkçe ver. Pratik, uygulanabilir ve samimi bir ton kullan.
"""


# ==========================================
# ANA FONKSİYON: Sohbet Yanıtı Üretici
# ==========================================
def get_assistant_reply(
    message: str,
    mode: str,  # "system" veya "advisor"
    conversation_history: list,
    user: User,
    db: Session
) -> str:
    """
    İki modlu asistan yanıtı üretir.
    conversation_history: [{"role": "user"/"model", "parts": [{"text": "..."}]}]
    """
    client = genai.Client(api_key=GEMINI_API_KEY)

    if mode == "system":
        # Kullanıcının verisini bağlam olarak ekle
        user_context = build_user_context(user, db)
        system_instruction = SYSTEM_ASSISTANT_PROMPT + f"\n\n--- KULLANICININ VERİLERİ ---\n{user_context}"
    else:
        # Genel e-ticaret danışmanı, DB'ye gitme
        system_instruction = ADVISOR_PROMPT

    # Konuşma geçmişini + yeni mesajı birleştir
    contents = list(conversation_history)
    contents.append(types.Content(role="user", parts=[types.Part(text=message)]))

    response = client.models.generate_content(
        model=MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7,
        )
    )

    return response.text
