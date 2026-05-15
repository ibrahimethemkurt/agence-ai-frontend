from crewai import Task, Agent

def get_competitor_analysis_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da arama yap. Bu ürünün en büyük 3 rakibini ve muadillerini tespit et. İlgini çeken veya önemli bulduğun makale ve inceleme sitelerinin içine girip detaylı oku. Rakiplerin güçlü ve zayıf yönlerini listele.",
        expected_output=f"'{product_name}' için tespit edilen rakiplerin ve muadillerin listesi, her birinin güçlü ve zayıf yönlerini içeren bir rakip analizi raporu.",
        agent=agent
    )

def get_customer_needs_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da 'şikayet', 'eksi yönleri', 'kullanıcı yorumları', 'sorunlar' şeklinde aramalar yap. İlgili forumlara veya inceleme sayfalarına girip metinleri oku. Kullanıcıların bu üründe veya bu ürün kategorisinde en çok hangi sorunlara çözüm aradığını analiz et.",
        expected_output=f"'{product_name}' için müşteri ihtiyaçlarını, en çok dile getirilen şikayetleri ve aranan temel özellikleri listeleyen müşteri acı noktası (pain point) raporu.",
        agent=agent
    )

def get_market_trends_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için pazar trendlerini, genel satış potansiyelini ve hedef kitleyi analiz et. Diğer görevlerden elde edilen rakip analizini ve müşteri şikayetlerini de göz önünde bulundurarak genel bir pazar konumu belirle.",
        expected_output=f"'{product_name}' için hedef kitleyi, pazar trendlerini, pazardaki fırsatları ve satış potansiyelini içeren, önceki analizleri de sentezleyen kapsamlı bir nihai pazar analizi raporu.",
        output_file="pazar_analizi_raporu.md",
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
        description=f"'{product_name}' ürünü için e-ticaret platformlarındaki rakip fiyatlarını araştır. Kullanıcının girdiği maliyet bilgileri şunlardır:\n{costs_str}\n"
                    "Rakiplerin ortalama, en düşük ve en yüksek fiyatlarını belirle. Bu fiyatlara ve maliyetlere göre (komisyonu satış fiyatı üzerinden hesaplayarak) net kâr marjı hesabı yap. "
                    "Önceki pazar analizi verilerini de kullanarak ürün için optimum, rekabetçi ve kârlı bir satış fiyat bandı öner.",
        expected_output=f"'{product_name}' için rakip fiyat tablosu, maliyet kalemlerine göre net kâr hesaplaması ve hedeflenen kâr marjı ile önerilen nihai satış fiyat bandını içeren Fiyat Analizi raporu.",
        output_file="fiyat_analizi_raporu.md",
        agent=agent
    )

def get_social_media_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü için sosyal medya (Instagram, TikTok, Twitter) platformlarına uygun yaratıcı içerik fikirleri, kısa video konseptleri ve potansiyel kampanya senaryoları hazırla. Pazar araştırması verilerini göz önünde bulundurarak hedef kitleyi etkileyecek pazarlama söylemlerini (hook'ları) ve kullanılacak popüler hashtagleri belirle.",
        expected_output=f"'{product_name}' için sosyal medya içerik fikirleri, platform bazlı stratejiler, etkileyici reklam metinleri, hashtag önerileri ve potansiyel bir reklam kampanyası kurgusunu içeren Sosyal Medya Pazarlama Raporu.",
        output_file="sosyal_medya_raporu.md",
        agent=agent
    )

def get_support_task(product_name: str, agent: Agent):
    return Task(
        description=f"'{product_name}' ürünü hakkında bir müşterinin sana çok sinirli bir şekilde şu e-postayı attığını varsay: 'Ürün kargodan çok geç geldi, ayrıca resimde göründüğünden daha farklı duruyor, paramı hemen iade edin!'. Bu müşteriye markanın profesyonelliğini yansıtacak, empati kuran ve sorunu çözen (örn. iade kargo kodu oluşturma veya alternatif teklif) bir yanıt metni hazırla. Ayrıca destek ekibinin bu tarz iade ve şikayet durumlarında izlemesi gereken adım adım süreci (kriz yönetimi prosedürü) listele.",
        expected_output=f"'{product_name}' için müşteriye yazılacak profesyonel örnek yanıt e-postası ve müşteri temsilcileri için standart şikayet/iade yönetim prosedürünü içeren Müşteri Şikayet Yönetim Raporu.",
        output_file="satis_sonrasi_destek_raporu.md",
        agent=agent
    )
