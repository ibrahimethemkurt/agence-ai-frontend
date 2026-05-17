import os
import random
from dotenv import load_dotenv
from crewai import Crew, Process

from src.agents import (
    get_presale_agent, get_marketing_agent, get_support_operations_agent, get_finance_agent
)
from src.tasks import (
    get_presale_task, get_marketing_task, get_support_operations_task, get_finance_task
)

load_dotenv()

def check_env():
    gemini_keys = [v for k, v in os.environ.items() if k.startswith("GEMINI_API_KEY") and v]
    
    if gemini_keys and not os.getenv("GEMINI_API_KEY"):
        os.environ["GEMINI_API_KEY"] = random.choice(gemini_keys)
        
    if not os.getenv("GEMINI_API_KEY"):
        raise ValueError("GEMINI_API_KEY eksik. Lütfen .env dosyasını kontrol edin.")

def run_presale_department(product_name: str, costs: dict) -> dict:
    check_env()
    agent = get_presale_agent()
    task = get_presale_task(product_name, costs, agent)
    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, memory=False, verbose=True, max_rpm=10)
    result = crew.kickoff()
    return {"status": "success", "department": "presale", "raw_output": result.raw}

def run_marketing_department(product_name: str) -> dict:
    check_env()
    agent = get_marketing_agent()
    task = get_marketing_task(product_name, agent)
    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, memory=False, verbose=True, max_rpm=10)
    result = crew.kickoff()
    return {"status": "success", "department": "marketing", "raw_output": result.raw}

def run_support_operations_department(product_name: str, issue_text: str) -> dict:
    check_env()
    agent = get_support_operations_agent()
    task = get_support_operations_task(product_name, issue_text, agent)
    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, memory=False, verbose=True, max_rpm=10)
    result = crew.kickoff()
    return {"status": "success", "department": "support_operations", "raw_output": result.raw}

def run_finance_department(financial_data: dict) -> dict:
    check_env()
    agent = get_finance_agent()
    task = get_finance_task(financial_data, agent)
    crew = Crew(agents=[agent], tasks=[task], process=Process.sequential, memory=False, verbose=True, max_rpm=10)
    result = crew.kickoff()
    return {"status": "success", "department": "finance", "raw_output": result.raw}

if __name__ == "__main__":
    print("Agence AI Pazar Analizi Ajanı Başlatılıyor...\n")
    print("-" * 50)
    
    product_name = input("🔍 Lütfen analiz edilecek ürünü giriniz (Örn: Stanley Termos 1L): ").strip()
    if not product_name:
        product_name = "Stanley Termos 1L"
        print(f"Boş bırakıldığı için varsayılan ürün seçildi: {product_name}")
    
    print("\n💰 Lütfen ürünün maliyet bilgilerini giriniz (Tamsayı veya ondalıklı olarak):")
    try:
        base_cost = input("1. Ürün geliş/üretim maliyeti (TL): ").strip()
        base_cost = float(base_cost) if base_cost else 150.0

        shipping_cost = input("2. Kargo maliyeti (TL): ").strip()
        shipping_cost = float(shipping_cost) if shipping_cost else 50.0

        commission_rate = input("3. Pazaryeri komisyon oranı (%): ").strip()
        commission_rate = float(commission_rate) if commission_rate else 15.0

        other_costs = input("4. Diğer giderler (Ambalaj, reklam vb. TL): ").strip()
        other_costs = float(other_costs) if other_costs else 20.0
        
    except ValueError:
        print("❌ Hatalı bir sayı girdiniz. Lütfen programı yeniden başlatın.")
        exit(1)

    costs = {
        "base_cost": base_cost,
        "shipping_cost": shipping_cost,
        "commission_rate": commission_rate,
        "other_costs": other_costs
    }
    
    print("\n" + "=" * 50)
    print(f"🚀 '{product_name}' için Satış Öncesi ve Fiyatlandırma Analizi Başlıyor...")
    print("=" * 50 + "\n")
    
    result = run_presale_department(product_name, costs)
    
    print("\n" + "=" * 50)
    print("🎯 SATIŞ ÖNCESİ ANALİZ SONUÇLARI:")
    print("=" * 50)
    print(result["raw_output"])

    print("\n" + "=" * 50)
    print(f"🚀 '{product_name}' için Pazarlama ve Lansman Analizi Başlıyor...")
    print("=" * 50 + "\n")

    marketing_result = run_marketing_department(product_name)
    
    print("\n" + "=" * 50)
    print("🎯 PAZARLAMA ANALİZ SONUÇLARI:")
    print("=" * 50)
    print(marketing_result["raw_output"])
    
    print("\n✅ Tüm analizler başarıyla tamamlandı. Token tasarrufu sağlandı.")
