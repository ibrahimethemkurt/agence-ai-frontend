from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Hackathon için SQLite kullanıyoruz. Klasör taşınırsa patlamasın diye root dizine db oluşturur.
SQLALCHEMY_DATABASE_URL = "sqlite:///./agence_ai.db"

# Eğer PostgreSQL kullanmak isterseniz ileride sadece üstteki satırı şu şekilde değiştirirsiniz:
# SQLALCHEMY_DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False} # Sadece SQLite için gerekli
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Veritabanı Session (Oturum) almak için Dependency (Bağımlılık) fonksiyonu
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
