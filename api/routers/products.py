from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Product, ProductCreate, ProductResponse, User
from .auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
def create_product(
    product_in: ProductCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının sisteme yeni bir ürün eklemesini sağlar."""
    new_product = Product(
        user_id=current_user.id,
        name=product_in.name,
        description=product_in.description,
        category=product_in.category
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product

@router.get("/", response_model=list[ProductResponse])
def get_my_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kullanıcının kendi eklediği ürünlerin listesini döner."""
    products = db.query(Product).filter(Product.user_id == current_user.id).all()
    return products
