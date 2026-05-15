from crewai import Task, Agent

def get_competitor_analysis_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da arama yap. Bu ürünün en büyük 3 rakibini ve muadillerini tespit et. İlgini çeken makale ve inceleme sitelerinin içine girip oku. Rakiplerin güçlü ve zayıf yönlerini listele.",
        expected_output="JSON formatında tespit edilen rakiplerin listesi, her birinin güçlü ve zayıf yönlerini içeren veri seti. Şablon: {\"rakipler\": [{\"isim\": \"...\", \"guclu_yonler\": [...], \"zayif_yonler\": [...]}]}",
        agent=agent
    )

def get_customer_needs_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da 'şikayet', 'eksi yönleri', 'kullanıcı yorumları', 'sorunlar' aramaları yap. Kullanıcıların en çok hangi sorunlara çözüm aradığını analiz et.",
        expected_output="JSON formatında müşteri ihtiyaçları, şikayetleri ve aranan temel özellikleri listeleyen rapor. Şablon: {\"temel_ihtiyaclar\": [...], \"en_cok_gelen_sikayetler\": [...], \"firsatlar\": [...]}",
        agent=agent
    )

def get_market_trends_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için pazar trendlerini, genel satış potansiyelini ve hedef kitleyi analiz et. Önceki araştırmacıların verilerini sentezleyerek nihai pazar analizi yap.",
        expected_output="JSON formatında hedef kitle, pazar trendleri ve satış potansiyeli. Şablon: {\"hedef_kitle\": \"...\", \"pazar_trendleri\": [...], \"satis_potansiyeli\": \"...\", \"genel_degerlendirme\": \"...\"}",
        agent=agent
    )

def get_pricing_analysis_task(product_name: str, costs: dict[str, float], agent: Agent):
    costs_str = (
        f"- Ürün Geliş Fiyatı: {costs.get('base_cost')} TL\n"
        f"- Kargo Ücreti: {costs.get('shipping_cost')} TL\n"
        f"- Platform Komisyon Oranı: %{costs.get('commission_rate')}\n"
        f"- Diğer Giderler: {costs.get('other_costs')} TL\n"
    )
    
    return Task(
        description=f"'{product_name}' ürünü için e-ticaret platformlarındaki rakip fiyatlarını araştır. Maliyet bilgileri şunlardır:\n{costs_str}\nKomisyonu satış fiyatı üzerinden hesaplayarak net kâr marjı hesabı yap. Optimum fiyat bandı öner.",
        expected_output="JSON formatında rakip fiyatları, kâr hesaplaması ve nihai satış fiyatı önerisi. Şablon: {\"rakip_fiyatlari\": {\"en_dusuk\": 0, \"ortalama\": 0, \"en_yuksek\": 0}, \"hesaplanan_kar_marji_yuzdesi\": 0, \"onerilen_satis_fiyati\": 0}",
        agent=agent
    )

def get_seo_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için e-ticaret platformlarında (Trendyol, Hepsiburada) en üst sıralarda çıkmasını sağlayacak çarpıcı bir başlık, 5 adet anahtar kelime (etiket) ve SEO uyumlu açıklama yazısı hazırla.",
        expected_output="JSON formatında SEO verileri. Şablon: {\"seo_baslik\": \"...\", \"etiketler\": [\"...\"], \"seo_aciklama\": \"...\"}",
        agent=agent
    )

def get_social_media_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için Instagram ve TikTok'a uygun yaratıcı içerik fikirleri, kanca cümleleri (hooks) ve hashtagler hazırla.",
        expected_output="JSON formatında sosyal medya stratejisi. Şablon: {\"kanca_cumleleri\": [\"...\"], \"icerik_fikirleri\": [\"...\"], \"hashtagler\": [\"...\"]}",
        agent=agent
    )

def get_support_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü hakkında kargosu geç gelmiş ve ürün resimden farklı duran sinirli bir müşteriye empati kuran, sorunu çözen profesyonel bir e-posta yanıtı hazırla.",
        expected_output="JSON formatında yanıt metni ve kriz yönetimi adımları. Şablon: {\"musteri_yanit_maili\": \"...\", \"kriz_yonetim_adimlari\": [\"...\"]}",
        agent=agent
    )
