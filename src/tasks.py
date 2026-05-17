from crewai import Task, Agent

def get_presale_task(product_name: str, costs: dict, agent: Agent):
    costs_str = (
        f"- Ürün Geliş Fiyatı: {costs.get('base_cost')} TL\n"
        f"- Kargo Ücreti: {costs.get('shipping_cost')} TL\n"
        f"- KDV Oranı: %{costs.get('tax_rate', 20.0)}\n"
        f"- Platform Komisyon Oranı: %{costs.get('commission_rate')}\n"
        f"- Diğer Giderler: {costs.get('other_costs', 0.0)} TL\n"
    )
    return Task(
        description=(
            f"'{product_name}' ürünü için kendi bilgi birikimini ve veritabanını kullanarak "
            f"kapsamlı bir pazar ve fiyatlandırma analizi yap.\n"
            f"1. En büyük 3 rakibi ve muadili tespit et (Güçlü ve zayıf yönleriyle).\n"
            f"2. Türk müşterilerin bu tarz ürünlerde yaşadığı sorunları ve ihtiyaçları tahmin et.\n"
            f"3. Verilen maliyetlere ({costs_str}) göre kâr marjını ve optimum satış fiyatını hesapla (Net Kar = Satış Fiyatı - Maliyet - (SatışFiyatı*KDV/100) - (SatışFiyatı*Komisyon/100)).\n"
            f"Sonuçları detaylı, okunaklı ve profesyonel bir Markdown (.md) metni olarak sun."
        ),
        expected_output=(
            "Kapsamlı bir Markdown belgesi. İçerisinde başlıklar (##), alt başlıklar (###) ve "
            "madde işaretleri (-) kullanılarak rakip analizi, müşteri ihtiyaçları ve fiyat/kar tahminleri yer almalıdır."
        ),
        agent=agent
    )

def get_marketing_task(product_name: str, agent: Agent):
    return Task(
        description=(
            f"'{product_name}' ürünü için kendi bilgi birikimini kullanarak "
            f"hem Trendyol/Hepsiburada gibi platformlar için SEO verilerini (Başlık, etiketler, açıklama), "
            f"hem de sosyal medya (Instagram/TikTok) için yaratıcı içerik fikirleri, kanca cümleleri ve hashtagler üret.\n"
            f"Sonuçları profesyonel bir Markdown (.md) metni olarak sun."
        ),
        expected_output=(
            "SEO stratejisi ve Sosyal Medya planını içeren, başlıklar ve madde işaretleriyle "
            "okunaklı şekilde biçimlendirilmiş bir Markdown belgesi."
        ),
        agent=agent
    )

def get_support_operations_task(product_name: str, issue_text: str, agent: Agent):
    return Task(
        description=(
            f"Müşteri şu şikayeti/yorumu yaptı: '{issue_text}'. İlgili ürün: '{product_name}'.\n"
            f"Bu durumu analiz et:\n"
            f"1. Müşteriye verilecek profesyonel ve empati kuran bir e-posta/yanıt yaz.\n"
            f"2. Şikayetin duygu analizini yap.\n"
            f"3. Sorunun asıl kök nedenini (üretim mi, kargo mu vb.) tespit et ve operasyonel çözüm öner.\n"
            f"Sonuçları net ve rapor formatında bir Markdown (.md) metni olarak sun."
        ),
        expected_output=(
            "Müşteri e-postası taslağı, duygu analizi ve operasyonel çözüm adımlarını barındıran "
            "profesyonel bir Markdown belgesi."
        ),
        agent=agent
    )

def get_finance_task(financial_data: dict, agent: Agent):
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
            f"Kar marjını artırmak için acil uygulanabilir 3 strateji öner.\n"
            f"Sonuçları yönetim kuruluna sunulacak tarzda şık bir Markdown (.md) metni olarak sun."
        ),
        expected_output=(
            "Finansal analiz ve strateji önerilerinin başlıklandırıldığı, maddelerle "
            "desteklendiği net bir Markdown belgesi."
        ),
        agent=agent
    )
