import os
from crewai import Agent, LLM
from .tools import SafeGoogleSearchTool
from crewai_tools import ScrapeWebsiteTool

def _get_gemini_llm():
    return LLM(
        model="gemini/gemini-2.5-flash-lite",
        api_key=os.getenv("GEMINI_API_KEY"),
        temperature=0.3
    )

def get_researcher_agent():
    return Agent(
        role='Pazar Araştırmacısı',
        goal='Belirtilen ürünün rakiplerini, muadillerini bulmak ve fiyat/özellik rekabetini analiz etmek.',
        backstory='Sen hızlı ve keskin bir pazar araştırmacısısın. İnternetin altını üstüne getirip, en büyük rakipleri ve onların stratejilerini bulmakta ustasın.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=_get_gemini_llm(),
        verbose=True,
        allow_delegation=False
    )

def get_customer_insights_agent():
    return Agent(
        role='Müşteri İçgörü Uzmanı',
        goal='Kullanıcı yorumlarını, şikayetleri ve forumları inceleyerek müşterilerin asıl dertlerini (pain points) bulmak.',
        backstory='Sen empati yeteneği çok yüksek bir tüketici analistisin. İnsanların ürünlerde neyden nefret ettiğini veya neyi çok sevdiğini satır aralarından okuyup çıkarırsın.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=_get_gemini_llm(),
        verbose=True,
        allow_delegation=False
    )

def get_strategist_agent():
    return Agent(
        role='Baş Stratejist',
        goal='Araştırmacı ve İçgörü uzmanından gelen verileri sentezleyerek mükemmel bir Yönetici Özeti (Executive Summary) yazmak.',
        backstory='Sen dünyanın en iyi e-ticaret stratejistlerinden birisin. Ham verileri alır, gereksizleri atar ve patronlara sunulacak kadar net, yapılandırılmış raporlar yazarsın.',
        tools=[],  # Baş stratejist sadece diğerlerinden gelen metinleri okuyup sentezler
        llm=_get_gemini_llm(),
        verbose=True,
        allow_delegation=False
    )
