import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={api_key}"
req = requests.get(url)
if req.status_code == 200:
    models = [m["name"] for m in req.json().get("models", []) if "generateContent" in m.get("supportedGenerationMethods", [])]
    print("Mevcut Modeller:\n" + "\n".join(models))
else:
    print(req.status_code, req.text)
