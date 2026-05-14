import os
import requests
from crewai.tools import BaseTool

class SafeGoogleSearchTool(BaseTool):
    name: str = "Safe Google Search Tool"
    description: str = "Bu araç, verilen bir ürün adı veya arama terimi için Google'da arama yapar ve özet sonuçlar döner. Doğrudan site kazıması (scraping) yapmaz."

    def _run(self, query: str) -> str:
        serper_api_key = os.getenv("SERPER_API_KEY")
        if not serper_api_key:
            return "Hata: SERPER_API_KEY bulunamadı. Lütfen .env dosyanızı kontrol edin."
        
        url = "https://google.serper.dev/search"
        payload = {"q": query, "num": 5}
        headers = {
            'X-API-KEY': serper_api_key,
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            response.raise_for_status()
            results = response.json()
            
            organic_results = results.get("organic", [])
            summary = ""
            for item in organic_results:
                summary += f"Başlık: {item.get('title')}\n"
                summary += f"Link: {item.get('link')}\n"
                summary += f"Özet: {item.get('snippet')}\n\n"
            
            return summary if summary else "Arama sonucu bulunamadı."
        except Exception as e:
            return f"Arama sırasında bir hata oluştu: {str(e)}"
