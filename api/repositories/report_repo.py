from sqlalchemy.orm import Session
from ..models import AIReport
import json
from datetime import datetime

class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_report_job(self, user_id: int, product_id: int, department: str) -> AIReport:
        """Veritabanında yeni bir analiz görevi (Job) oluşturur ve durumunu 'pending' yapar."""
        db_report = AIReport(
            user_id=user_id,
            product_id=product_id,
            department=department,
            status="pending"
        )
        self.db.add(db_report)
        self.db.commit()
        self.db.refresh(db_report)
        return db_report

    def update_report_status(self, job_id: int, status: str, result_json: str = None, error_message: str = None):
        """Devam eden veya biten görevin durumunu ve sonucunu günceller."""
        db_report = self.db.query(AIReport).filter(AIReport.id == job_id).first()
        if db_report:
            db_report.status = status
            if result_json:
                db_report.result_json = result_json
            if error_message:
                db_report.error_message = error_message
            
            if status in ["completed", "failed"]:
                db_report.completed_at = datetime.utcnow()
                
            self.db.commit()
            self.db.refresh(db_report)
        return db_report

    def get_report_by_id(self, job_id: int) -> AIReport:
        """ID'ye göre rapor detayını getirir."""
        return self.db.query(AIReport).filter(AIReport.id == job_id).first()
