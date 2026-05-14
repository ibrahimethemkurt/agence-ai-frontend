# Agence AI - Pazar Analizi Ajanı

Bu proje, CrewAI ve Google Gemini (Flash Lite) altyapısını kullanarak verilen herhangi bir ürün için derinlemesine rakip analizi, müşteri içgörüsü ve pazar trendleri araştırması yapan **çoklu ajanlı (multi-agent)** bir yapay zeka sistemidir.

## 🚀 Proje Amacı
E-ticaret satıcıları veya girişimciler için manuel olarak saatler süren pazar araştırmasını otomatize etmektir. Sistem, 3 farklı sanal uzmandan oluşur:
1. **Pazar Araştırmacısı:** Rakipleri ve fiyatları araştırır.
2. **Müşteri İçgörü Uzmanı:** Şikayetleri ve kullanıcı deneyimlerini inceler.
3. **Baş Stratejist:** Verileri harmanlayıp profesyonel bir Yönetici Özeti (Executive Summary) oluşturur.

## ⚙️ Kurulum ve Çalıştırma

Projenin bağımlılıklarını kurmak ve sistemi ayağa kaldırmak için aşağıdaki adımları sırasıyla uygulayın:

### 1. Sanal Ortamı (Virtual Environment) Oluşturma ve Aktif Etme

**Linux / macOS:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

### 2. Gerekli Paketleri Kurma
```bash
pip install -r requirements.txt
```

### 3. Çevre Değişkenlerini (API Key) Ayarlama
Proje ana dizininde bulunan `.env.example` dosyasının adını `.env` olarak değiştirin ve içine kendi API anahtarlarınızı yazın:
```env
GEMINI_API_KEY="senin-gemini-api-anahtarin"
SERPER_API_KEY="senin-serper-api-anahtarin"
```

### 4. Projeyi Çalıştırma
Tüm kurulumlar tamamlandıktan sonra aşağıdaki komutla projeyi başlatabilirsiniz:
```bash
python -m src.main
```
İşlem tamamlandığında detaylı analiz sonucu proje dizininde `rapor.md` olarak kaydedilecektir.
