import os
import sys
import json
from sqlalchemy.orm import Session
from ..repositories.report_repo import ReportRepository

# src klasöründeki modüllere erişebilmek için
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from src.main import run_presale_department, run_finance_department

def process_presale_task(job_id: int, product_name: str, costs: dict, db: Session):
    """
    Arka planda (Background Task) çalışan ana analiz fonksiyonu.
    CrewAI çalışır, bitince sonucu Veritabanına kaydeder.
    """
    repo = ReportRepository(db)
    
    # 1. İşlem başladı olarak güncelle
    repo.update_report_status(job_id, status="processing")
    
    try:
        # 2. Ağır AI işlemini çalıştır (CrewAI)
        result = run_presale_department(product_name, costs)
        
        # 3. Sonucu JSON string olarak veritabanına kaydet
        # Not: result.get("raw_output") string olarak gelir.
        repo.update_report_status(
            job_id, 
            status="completed", 
            result_json=json.dumps(result)
        )
    except Exception as e:
        # Hata olursa logla ve veritabanına hata durumunu yaz
        repo.update_report_status(job_id, status="failed", error_message=str(e))
