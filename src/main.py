import os
import json
from dotenv import load_dotenv
from crewai import Crew, Process
from src.agents import (
    get_researcher_agent, get_customer_insights_agent, get_strategist_agent, 
    get_pricing_agent, get_social_media_agent, get_support_agent, get_seo_agent
)
from src.tasks import (
    get_competitor_analysis_task, get_customer_needs_task, get_market_trends_task, 
    get_pricing_analysis_task, get_social_media_task, get_support_task, get_seo_task
)

load_dotenv()

def check_env():
    if not os.getenv("GEMINI_API_KEY") or not os.getenv("SERPER_API_KEY"):
        raise ValueError("GEMINI_API_KEY veya SERPER_API_KEY eksik. Lütfen .env dosyasını kontrol edin.")

def run_presale_department(product_name: str, costs: dict) -> dict:
    """Süreç 1: Ürün Keşif ve Fiyatlandırma Ekibi"""
    check_env()
    
    researcher = get_researcher_agent()
    insights_analyst = get_customer_insights_agent()
    strategist = get_strategist_agent()
    pricing_agent = get_pricing_agent()

    competitor_task = get_competitor_analysis_task(product_name, researcher)
    customer_task = get_customer_needs_task(product_name, insights_analyst)
    trends_task = get_market_trends_task(product_name, strategist)
    pricing_task = get_pricing_analysis_task(product_name, costs, pricing_agent)

    crew = Crew(
        agents=[researcher, insights_analyst, strategist, pricing_agent],
        tasks=[competitor_task, customer_task, trends_task, pricing_task],
        process=Process.sequential,
        memory=True,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "presale", "raw_output": result.raw}

def run_listing_department(product_name: str) -> dict:
    """Süreç 2: Lansman ve Pazarlama Ekibi"""
    check_env()
    
    seo_agent = get_seo_agent()
    social_media_agent = get_social_media_agent()

    seo_task = get_seo_task(product_name, seo_agent)
    social_media_task = get_social_media_task(product_name, social_media_agent)

    crew = Crew(
        agents=[seo_agent, social_media_agent],
        tasks=[seo_task, social_media_task],
        process=Process.sequential,
        memory=True,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "listing", "raw_output": result.raw}

def run_support_department(product_name: str) -> dict:
    """Süreç 3: Kriz ve Müşteri İlişkileri Ekibi"""
    check_env()
    
    support_agent = get_support_agent()
    support_task = get_support_task(product_name, support_agent)

    crew = Crew(
        agents=[support_agent],
        tasks=[support_task],
        process=Process.sequential,
        memory=True,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "support", "raw_output": result.raw}

if __name__ == "__main__":
    print("Agence AI Departman API Mock Testi")
    # Örnek kullanım (FastAPI üzerinden böyle çağrılacak):
    # costs = {"base_cost": 150, "shipping_cost": 50, "commission_rate": 15, "other_costs": 20}
    # result = run_presale_department("Stanley Termos 1L", costs)
    # print(result)
