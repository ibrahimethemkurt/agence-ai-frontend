import os
from dotenv import load_dotenv
from crewai import Crew, Process
from src.agents import get_researcher_agent, get_customer_insights_agent, get_strategist_agent, get_pricing_agent
from src.tasks import get_competitor_analysis_task, get_customer_needs_task, get_market_trends_task, get_pricing_analysis_task

# .env dosyasını yükle
load_dotenv()

def run_market_analysis():
    # Çevre değişkenlerinin kontrolü
    if not os.getenv("GEMINI_API_KEY"):
        print("Hata: GEMINI_API_KEY çevre değişkeni bulunamadı. Lütfen .env dosyasını kontrol edin.")
        return
    
    if not os.getenv("SERPER_API_KEY"):
        print("Hata: SERPER_API_KEY çevre değişkeni bulunamadı. Lütfen .env dosyasını kontrol edin.")
        return

    # Ajanları oluştur
    researcher = get_researcher_agent()
    insights_analyst = get_customer_insights_agent()
    strategist = get_strategist_agent()
    pricing_agent = get_pricing_agent()
    
    print("\n--- Agence AI: Pazar ve Fiyat Analizi Sistemi ---\n")
    product_to_analyze = input("Analiz edilecek ürün adını girin (Örn: Stanley Termos 1L): ")
    if not product_to_analyze:
        product_to_analyze = "Stanley Termos 1L"
        print(f"Boş bırakıldı, varsayılan ürün seçildi: {product_to_analyze}")

    print("\nLütfen maliyet bilgilerinizi girin (Sadece rakam olarak, örn: 150):")
    try:
        base_cost = float(input("Ürün Geliş Fiyatı (TL): ") or 0)
        shipping_cost = float(input("Kargo Ücreti (TL): ") or 0)
        commission_rate = float(input("Platform Komisyon Oranı (%): ") or 0)
        other_costs = float(input("Diğer Giderler (TL): ") or 0)
    except ValueError:
        print("Hatalı giriş yaptınız, varsayılan değerler 0 olarak alınıyor.")
        base_cost = shipping_cost = commission_rate = other_costs = 0.0

    costs = {
        "base_cost": base_cost,
        "shipping_cost": shipping_cost,
        "commission_rate": commission_rate,
        "other_costs": other_costs
    }

    # Görevleri oluştur ve uygun ajana ata
    competitor_task = get_competitor_analysis_task(product_to_analyze, researcher)
    customer_task = get_customer_needs_task(product_to_analyze, insights_analyst)
    trends_task = get_market_trends_task(product_to_analyze, strategist)
    pricing_task = get_pricing_analysis_task(product_to_analyze, costs, pricing_agent)

    # Crew'u kur
    crew = Crew(
        agents=[researcher, insights_analyst, strategist, pricing_agent],
        tasks=[competitor_task, customer_task, trends_task, pricing_task],
        process=Process.sequential,
        verbose=True,
        max_rpm=5
    )

    print(f"\n--- '{product_to_analyze}' için Analiz Başlıyor ---\n")
    result = crew.kickoff()
    
    print("\n--- Analiz Sonucu ---")
    print(result)
    print("\n✅ Detaylı analiz raporları proje dizininde ('pazar_analizi_raporu.md' ve 'fiyat_analizi_raporu.md') olarak kaydedildi!")

if __name__ == "__main__":
    run_market_analysis()
