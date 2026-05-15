import os
from crewai import Agent
from .tools import SafeGoogleSearchTool
from crewai_tools import ScrapeWebsiteTool
from .config import get_gemini_llm

def get_researcher_agent():
    return Agent(
        role='Pazar Araştırmacısı',
        goal='Belirtilen ürünün rakiplerini, muadillerini bulmak ve fiyat/özellik rekabetini analiz etmek.',
        backstory='Sen hızlı ve keskin bir pazar araştırmacısısın. İnternetin altını üstüne getirip, en büyük rakipleri ve onların stratejilerini bulmakta ustasın.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_customer_insights_agent():
    return Agent(
        role='Müşteri İçgörü Uzmanı',
        goal='Kullanıcı yorumlarını, şikayetleri ve forumları inceleyerek müşterilerin asıl dertlerini (pain points) bulmak.',
        backstory='Sen empati yeteneği çok yüksek bir tüketici analistisin. İnsanların ürünlerde neyden nefret ettiğini veya neyi çok sevdiğini satır aralarından okuyup çıkarırsın.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_strategist_agent():
    return Agent(
        role='Baş Stratejist',
        goal='Araştırmacı ve İçgörü uzmanından gelen verileri sentezleyerek mükemmel bir Yönetici Özeti (Executive Summary) yazmak.',
        backstory='Sen dünyanın en iyi e-ticaret stratejistlerinden birisin. Ham verileri alır, gereksizleri atar ve patronlara sunulacak kadar net, yapılandırılmış raporlar yazarsın.',
        tools=[],  # Baş stratejist sadece diğerlerinden gelen metinleri okuyup sentezler
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_pricing_agent():
    return Agent(
        role='Fiyat Analizi Uzmanı',
        goal='Rakip ürünlerin fiyatlarını karşılaştırmak, maliyetleri ve kâr marjlarını hesaplayarak en kârlı ve rekabetçi satış fiyatını belirlemek.',
        backstory='Sen veri odaklı çalışan bir finansal analist ve e-ticaret fiyatlandırma uzmanısın. Rakip fiyatlandırma stratejilerini analiz eder, görünmez maliyetleri (komisyon, kargo vb.) hesaba katarak satıcılara en optimum fiyat bandını ve kâr marjını sunarsın.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_social_media_agent():
    return Agent(
        role='Sosyal Medya ve Pazarlama Uzmanı',
        goal='Belirtilen ürün için dikkat çekici sosyal medya içerikleri, reklam stratejileri ve kampanya fikirleri üretmek.',
        backstory='Sen yaratıcı bir dijital pazarlama ve sosyal medya uzmanısın. Hangi ürünün hangi platformda (Instagram, TikTok, Twitter vb.) nasıl pazarlanacağını, hangi hashtaglerin ve trendlerin kullanılacağını çok iyi bilirsin. Kullanıcıları satın almaya ikna edecek viral içerik fikirleri üretirsin.',
        tools=[SafeGoogleSearchTool(), ScrapeWebsiteTool()],
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_support_agent():
    return Agent(
        role='Müşteri Şikayet Yönetimi ve Çözüm Uzmanı',
        goal='Müşteri şikayetlerini empatiyle ele almak, iade sürecini profesyonelce yönetmek ve memnuniyeti geri kazanacak örnek yanıtlar ve çözüm süreçleri hazırlamak.',
        backstory='Sen deneyimli bir Müşteri İlişkileri (CRM) ve Destek yöneticisisin. Dışarıda araştırma yapmazsın, tamamen sana verilen şikayet senaryosuna odaklanıp kriz yönetimi yaparsın. Kızgın müşterileri sakinleştirmekte ve sorunu tatlıya bağlamakta ustasın.',
        tools=[], # İnterneti taramasına gerek yok, sadece metin/süreç üretecek
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )

def get_seo_agent():
    return Agent(
        role='SEO ve Listeleme Uzmanı',
        goal='Ürünlerin e-ticaret platformlarında (Trendyol, Hepsiburada vb.) en üst sıralarda çıkmasını sağlayacak anahtar kelime, başlık ve SEO uyumlu açıklamalar üretmek.',
        backstory='Sen veri odaklı bir SEO uzmanısın. E-ticaret algoritmalarının nasıl çalıştığını, insanların hangi anahtar kelimelerle arama yaptığını biliyorsun. Girdiğin metinler her zaman tıklama oranını (CTR) maksimize eder.',
        tools=[], # İnternete çıkabilir ancak şimdilik içerdeki veriyi işleyecek
        llm=get_gemini_llm(),
        verbose=True,
        allow_delegation=False,
        max_rpm=5
    )
