from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..repositories.report_repo import ReportRepository

router = APIRouter()

@router.get("/{job_id}")
def get_job_status(job_id: int, db: Session = Depends(get_db)):
    """
    Frontend'in "Raporum hazır mı?" diye sorguladığı (Polling) uç nokta.
    Eğer status 'completed' ise result_json (rapor) döner.
    """
    repo = ReportRepository(db)
    report = repo.get_report_by_id(job_id)
    
    if not report:
        raise HTTPException(status_code=404, detail="Böyle bir görev (job) bulunamadı.")
        
    return {
        "job_id": report.id,
        "product_name": report.product_name,
        "department": report.department,
        "status": report.status,
        "result": report.result_json,
        "error": report.error_message,
        "created_at": report.created_at,
        "completed_at": report.completed_at
    }
