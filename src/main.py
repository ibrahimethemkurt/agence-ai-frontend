import os
from dotenv import load_dotenv
from crewai import Crew, Process
from src.agents import get_researcher_agent, get_customer_insights_agent, get_strategist_agent
from src.tasks import get_competitor_analysis_task, get_customer_needs_task, get_market_trends_task

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
    
    product_to_analyze = input("Analiz edilecek ürün adını girin (Örn: Stanley Termos 1L): ")
    if not product_to_analyze:
        product_to_analyze = "Stanley Termos 1L"
        print(f"Boş bırakıldı, varsayılan ürün seçildi: {product_to_analyze}")

    # Görevleri oluştur ve uygun ajana ata
    competitor_task = get_competitor_analysis_task(product_to_analyze, researcher)
    customer_task = get_customer_needs_task(product_to_analyze, insights_analyst)
    trends_task = get_market_trends_task(product_to_analyze, strategist)

    # Crew'u kur
    crew = Crew(
        agents=[researcher, insights_analyst, strategist],
        tasks=[competitor_task, customer_task, trends_task],
        process=Process.sequential,
        verbose=True
    )

    print(f"\n--- '{product_to_analyze}' için Pazar Analizi Başlıyor ---\n")
    result = crew.kickoff()
    
    print("\n--- Analiz Sonucu ---")
    print(result)
    print("\n✅ Detaylı analiz raporu projenin ana klasöründe 'rapor.md' olarak kaydedildi!")

if __name__ == "__main__":
    run_market_analysis()
