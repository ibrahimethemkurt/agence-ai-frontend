from pydantic import BaseModel
from typing import Dict, Any, Optional

class ProductRequest(BaseModel):
    product_name: str
    costs: Optional[Dict[str, float]] = None

class FeedbackRequest(BaseModel):
    product_id: str
    
class ReturnRequest(BaseModel):
    product_id: str
