import os
import json
from dotenv import load_dotenv
from crewai import Crew, Process
from src.agents import (
    get_researcher_agent, get_customer_insights_agent, get_strategist_agent, 
    get_pricing_agent, get_social_media_agent, get_support_agent, get_seo_agent,
    get_accounting_agent, get_financial_advisor_agent, get_sentiment_analyst_agent,
    get_qa_manager_agent, get_return_inspector_agent, get_logistics_expert_agent
)
from src.tasks import (
    get_competitor_analysis_task, get_customer_needs_task, get_market_trends_task, 
    get_pricing_analysis_task, get_social_media_task, get_support_task, get_seo_task,
    get_accounting_task, get_financial_advisor_task, get_sentiment_analysis_task,
    get_qa_analysis_task, get_return_inspection_task, get_logistics_improvement_task
)

load_dotenv()

import random

def check_env():
    gemini_keys = [v for k, v in os.environ.items() if k.startswith("GEMINI_API_KEY") and v]
    
    if gemini_keys and not os.getenv("GEMINI_API_KEY"):
        os.environ["GEMINI_API_KEY"] = random.choice(gemini_keys)
        
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
        memory=False,
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
        memory=False,
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
        memory=False,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "support", "raw_output": result.raw}

def run_finance_department(financial_data: dict) -> dict:
    """Finans ve Maliyet Optimizasyon Departmanı"""
    check_env()
    
    accounting_agent = get_accounting_agent()
    advisor_agent = get_financial_advisor_agent()

    accounting_task = get_accounting_task(financial_data, accounting_agent)
    advisor_task = get_financial_advisor_task(advisor_agent)

    crew = Crew(
        agents=[accounting_agent, advisor_agent],
        tasks=[accounting_task, advisor_task],
        process=Process.sequential,
        memory=False,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "finance", "raw_output": result.raw}

def run_feedback_department(review_text: str) -> dict:
    """Müşteri Geri Bildirim (Yorum) Departmanı"""
    check_env()
    
    sentiment_agent = get_sentiment_analyst_agent()
    qa_agent = get_qa_manager_agent()

    sentiment_task = get_sentiment_analysis_task(review_text, sentiment_agent)
    qa_task = get_qa_analysis_task(qa_agent)

    crew = Crew(
        agents=[sentiment_agent, qa_agent],
        tasks=[sentiment_task, qa_task],
        process=Process.sequential,
        memory=False,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "feedback", "raw_output": result.raw}

def run_return_department(return_reason_text: str) -> dict:
    """İade ve Lojistik Yönetimi Departmanı"""
    check_env()
    
    inspector_agent = get_return_inspector_agent()
    logistics_agent = get_logistics_expert_agent()

    inspection_task = get_return_inspection_task(return_reason_text, inspector_agent)
    logistics_task = get_logistics_improvement_task(logistics_agent)

    crew = Crew(
        agents=[inspector_agent, logistics_agent],
        tasks=[inspection_task, logistics_task],
        process=Process.sequential,
        memory=False,
        verbose=True,
        max_rpm=10
    )

    result = crew.kickoff()
    return {"status": "success", "department": "return", "raw_output": result.raw}

if __name__ == "__main__":
    print("Agence AI Departman API Mock Testi")
    # Örnek kullanım (FastAPI üzerinden böyle çağrılacak):
    # costs = {"base_cost": 150, "shipping_cost": 50, "commission_rate": 15, "other_costs": 20}
    # result = run_presale_department("Stanley Termos 1L", costs)
    # print(result)
