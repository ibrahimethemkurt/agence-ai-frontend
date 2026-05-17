import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import dotenv_values
from google import genai
from google.genai import types

# .env dosyasını oku
env = dotenv_values(".env")
keys = {k: v for k, v in env.items() if k.startswith("GEMINI_API_KEY") and v}

print(f"Toplam {len(keys)} key bulundu:\n")

for name, key in sorted(keys.items()):
    masked = key[:12] + "..." + key[-4:]
    try:
        client = genai.Client(api_key=key)
        response = client.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents="1+1=? Sadece sayı yaz."
        )
        print(f"✅ {name} ({masked}): ÇALIŞIYOR → '{response.text.strip()}'")
    except Exception as e:
        err = str(e)
        if "429" in err or "RESOURCE_EXHAUSTED" in err:
            if "free_tier" in err or "Free" in err:
                print(f"❌ {name} ({masked}): GÜNLÜK KOTA DOLDU (free tier 20/gün)")
            else:
                print(f"⚠️  {name} ({masked}): DAKİKALIK LİMİT AŞILDI (429)")
        elif "400" in err or "INVALID" in err:
            print(f"🔑 {name} ({masked}): GEÇERSİZ KEY")
        else:
            print(f"❓ {name} ({masked}): HATA → {err[:120]}")
