import os
import sys
import json
from sqlalchemy.orm import Session
from ..repositories.report_repo import ReportRepository

# src klasöründeki modüllere erişebilmek için
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../')))
from src.main import (
    run_presale_department,
    run_listing_department,
    run_support_department,
    run_finance_department,
    run_feedback_department,
    run_return_department,
)

def _run_task(job_id: int, db: Session, fn, *args):
    """
    Tüm departmanlar için ortak background task çalıştırıcısı.
    fn → ilgili CrewAI fonksiyonu, *args → fonksiyon argümanları
    """
    repo = ReportRepository(db)
    repo.update_report_status(job_id, status="processing")
    try:
        result = fn(*args)
        repo.update_report_status(job_id, status="completed", result_json=json.dumps(result))
    except Exception as e:
        repo.update_report_status(job_id, status="failed", error_message=str(e))

# ── Her departman için ayrı bir sarmalayıcı (wrapper) ─────────────────────────

def process_presale_task(job_id: int, product_name: str, costs: dict, db: Session):
    _run_task(job_id, db, run_presale_department, product_name, costs)

def process_listing_task(job_id: int, product_name: str, db: Session):
    _run_task(job_id, db, run_listing_department, product_name)

def process_support_task(job_id: int, product_name: str, db: Session):
    _run_task(job_id, db, run_support_department, product_name)

def process_finance_task(job_id: int, financial_data: dict, db: Session):
    _run_task(job_id, db, run_finance_department, financial_data)

def process_feedback_task(job_id: int, review_text: str, db: Session):
    _run_task(job_id, db, run_feedback_department, review_text)

def process_return_task(job_id: int, return_reason: str, db: Session):
    _run_task(job_id, db, run_return_department, return_reason)

