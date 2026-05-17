from crewai import Task, Agent

# ── SATIŞI ÖNCESİ (PRESALE) ────────────────────────────────────────────────────

def get_competitor_analysis_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürününü Trendyol, Hepsiburada ve Amazon Türkiye'de ara. "
            f"Sadece Türkçe arama terimleri kullan. Bu ürünü satan en büyük 3 rakibi tespit et. "
            f"Her rakibin güçlü ve zayıf yönlerini çıkar. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir metin, açıklama veya yorum ekleme."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin, düşünce zinciri veya açıklama ekleme:\n"
            '{"rakipler": [{"isim": "...", "fiyat_araligi": "...TL", "guclu_yonler": ["..."], "zayif_yonler": ["..."]}]}'
        ),
        agent=agent
    )

def get_customer_needs_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürünü için Türkçe olarak 'şikayet', 'eksik', 'sorun', 'yorum' "
            f"gibi kelimelerle Trendyol ve Google Türkiye'de arama yap. "
            f"Türk müşterilerin bu üründe ne tür sorunlar yaşadığını tespit et. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin veya açıklama ekleme:\n"
            '{"temel_ihtiyaclar": ["..."], "en_cok_gelen_sikayetler": ["..."], "firsatlar": ["..."]}'
        ),
        agent=agent
    )

def get_market_trends_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürünü için Türkiye e-ticaret pazarındaki trendleri ve satış "
            f"potansiyelini analiz et. Önceki araştırmacıların verilerini sentezle. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver, başka hiçbir metin ekleme."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin veya açıklama ekleme:\n"
            '{"hedef_kitle": "...", "pazar_trendleri": ["..."], "satis_potansiyeli": "Yüksek/Orta/Düşük", "genel_degerlendirme": "..."}'
        ),
        agent=agent
    )

def get_pricing_analysis_task(product_name: str, costs: dict, agent: Agent):
    costs_str = (
        f"- Ürün Geliş Fiyatı: {costs.get('base_cost')} TL\n"
        f"- Kargo Ücreti: {costs.get('shipping_cost')} TL\n"
        f"- KDV Oranı: %{costs.get('tax_rate', 20.0)}\n"
        f"- Platform Komisyon Oranı: %{costs.get('commission_rate')}\n"
        f"- Diğer Giderler: {costs.get('other_costs', 0.0)} TL\n"
    )

    return Task(
        description=(
            f"'{product_name}' ürününü Trendyol ve Hepsiburada'da Türkçe olarak ara ve "
            f"güncel satış fiyatlarını bul. DİKKAT: Eğer arama sonuçlarında net fiyat bulamazsan "
            f"veya linklerin içine giremezsen, KESİNLİKLE 'bulamadım' veya 'farklı araç kullanmalıyım' DEME! "
            f"Bunun yerine, gördüğün en yakın ürünlerin fiyatlarını veya pazar ortalamasını tahmin ederek doldur. "
            f"Aşağıdaki maliyet bilgilerine göre kâr hesapla ve optimum satış fiyatını öner:\n{costs_str}\n"
            f"Formül: KDV ve komisyon satış fiyatı üzerinden hesaplanır. "
            f"Net kâr = Satış Fiyatı - Maliyet - (Satış Fiyatı × KDV/100) - (Satış Fiyatı × Komisyon/100)\n"
            f"ÇOK ÖNEMLİ: HİÇBİR ŞEKİLDE açıklama yapma. SADECE VE SADECE JSON formatında yanıt ver. Yanıtın '{{' ile başlayıp '}}' ile bitmek ZORUNDADIR. İngilizce konuşma."
        ),
        expected_output=(
            '{"rakip_fiyatlari": {"en_dusuk": 250.0, "ortalama": 300.0, "en_yuksek": 400.0}, '
            '"hesaplanan_kar_marji_yuzdesi": 15.5, "onerilen_satis_fiyati": 349.90}'
        ),
        agent=agent
    )

# ── SATIŞ SÜRECİ (LİSTİNG) ────────────────────────────────────────────────────

def get_seo_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürünü için Trendyol ve Hepsiburada'da üst sıralarda çıkmasını "
            f"sağlayacak Türkçe bir başlık, 5 anahtar kelime ve açıklama metni yaz. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin ekleme:\n"
            '{"seo_baslik": "...", "etiketler": ["...", "...", "...", "...", "..."], "seo_aciklama": "..."}'
        ),
        agent=agent
    )

def get_social_media_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürünü için Instagram ve TikTok'ta Türk kullanıcılara yönelik "
            f"viral olacak yaratıcı içerik fikirleri, kanca cümleleri ve hashtagler hazırla. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin ekleme:\n"
            '{"kanca_cumleleri": ["..."], "icerik_fikirleri": ["..."], "hashtagler": ["..."]}'
        ),
        agent=agent
    )

# ── SATIŞ SONRASI ──────────────────────────────────────────────────────────────

def get_support_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürününün kargosu geç gelmiş ve ürün fotoğraftan farklı. "
            f"Türkçe olarak empati kuran, profesyonel bir müşteri yanıt maili ve çözüm adımları yaz. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver. "
            "Başka HİÇBİR metin ekleme:\n"
            '{"musteri_yanit_maili": "...", "kriz_yonetim_adimlari": ["..."]}'
        ),
        agent=agent
    )

def get_accounting_task(financial_data: dict, agent: Agent):
    data_str = (
        f"- Toplam Gelir: {financial_data.get('total_revenue')} TL\n"
        f"- Ürün Maliyetleri: {financial_data.get('cogs')} TL\n"
        f"- Kargo Giderleri: {financial_data.get('shipping_costs')} TL\n"
        f"- Platform Komisyonları: {financial_data.get('commissions')} TL\n"
        f"- İade Giderleri: {financial_data.get('return_costs')} TL\n"
    )
    return Task(
        description=(
            f"Aşağıdaki aylık finansal verileri incele ve sınıflandır:\n{data_str}\n"
            f"Hangi gider kaleminin oransal olarak en büyük riski taşıdığını tespit et. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"net_kar": 0.0, "en_buyuk_gider_kalemi": "...", "risk_durumu": "..."}'
        ),
        agent=agent
    )

def get_financial_advisor_task(agent: Agent):
    return Task(
        description=(
            "Muhasebe denetçisinden gelen risk raporunu incele. "
            "Türk e-ticaret satıcısına kâr marjını artırmak için acil uygulanabilir "
            "3 operasyonel strateji öner. "
            "KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"durum_degerlendirmesi": "...", "aksiyon_adimlari": ["...", "...", "..."]}'
        ),
        agent=agent
    )

def get_sentiment_analysis_task(review_text: str, agent: Agent):
    return Task(
        description=(
            f"Müşteri yorumunu analiz et: '{review_text}'. "
            f"Yorumun ana duygusunu belirle. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"duygu_kategorisi": "Olumlu/Olumsuz/Nötr/Öneri", "onem_derecesi": 0, "kisa_ozet": "..."}'
        ),
        agent=agent
    )

def get_qa_analysis_task(agent: Agent):
    return Task(
        description=(
            "Duygu analistinden gelen olumsuz/öneri yorumunu al. "
            "Şikayetin üretim hatası mı yoksa kargo/paketleme sorunumu olduğunu analiz et. "
            "KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"sorun_kaynagi": "...", "etkilenen_surec": "...", "cozum_onerisi": "..."}'
        ),
        agent=agent
    )

def get_return_inspection_task(return_reason_text: str, agent: Agent):
    return Task(
        description=(
            f"Müşterinin iade açıklamasını oku: '{return_reason_text}'. "
            f"İadenin asıl kök nedenini tek cümleyle özetle. "
            f"KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"kullanci_amaci": "...", "kok_neden": "...", "iade_turu": "Kusurlu/Vazgeçme/Yanlış Ürün vb."}'
        ),
        agent=agent
    )

def get_logistics_improvement_task(agent: Agent):
    return Task(
        description=(
            "İade uzmanından gelen kök nedeni al. "
            "Bu sorunun tekrar etmemesi için tedarik zinciri veya paketleme iyileştirmeleri öner. "
            "KESİNLİKLE sadece aşağıdaki JSON formatında Türkçe yanıt ver."
        ),
        expected_output=(
            "SADECE aşağıdaki JSON formatında, Türkçe olarak yanıt ver:\n"
            '{"gerekli_degisiklik": "...", "uygulama_maliyeti_tahmini": "Düşük/Orta/Yüksek", "beklenen_fayda": "..."}'
        ),
        agent=agent
    )
