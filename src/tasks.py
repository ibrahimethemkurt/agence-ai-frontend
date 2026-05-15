from crewai import Task

def get_competitor_analysis_task(product_name: str, agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da arama yap. Bu ürünün en büyük 3 rakibini ve muadillerini tespit et. İlgini çeken veya önemli bulduğun makale ve inceleme sitelerinin içine girip detaylı oku. Rakiplerin güçlü ve zayıf yönlerini listele.",
        expected_output=f"'{product_name}' için tespit edilen rakiplerin ve muadillerin listesi, her birinin güçlü ve zayıf yönlerini içeren bir rakip analizi raporu.",
        agent=agent
    )

def get_customer_needs_task(product_name: str, agent):
    return Task(
        description=f"'{product_name}' ürünü için Google'da 'şikayet', 'eksi yönleri', 'kullanıcı yorumları', 'sorunlar' şeklinde aramalar yap. İlgili forumlara veya inceleme sayfalarına girip metinleri oku. Kullanıcıların bu üründe veya bu ürün kategorisinde en çok hangi sorunlara çözüm aradığını analiz et.",
        expected_output=f"'{product_name}' için müşteri ihtiyaçlarını, en çok dile getirilen şikayetleri ve aranan temel özellikleri listeleyen müşteri acı noktası (pain point) raporu.",
        agent=agent
    )

def get_market_trends_task(product_name: str, agent):
    return Task(
        description=f"'{product_name}' ürünü için pazar trendlerini, genel satış potansiyelini ve hedef kitleyi analiz et. Diğer görevlerden elde edilen rakip analizini ve müşteri şikayetlerini de göz önünde bulundurarak genel bir pazar konumu belirle.",
        expected_output=f"'{product_name}' için hedef kitleyi, pazar trendlerini, pazardaki fırsatları ve satış potansiyelini içeren, önceki analizleri de sentezleyen kapsamlı bir nihai pazar analizi raporu.",
        output_file="data/rapor.md",
        agent=agent
    )
