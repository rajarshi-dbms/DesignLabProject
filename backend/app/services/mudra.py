from app.models.mudra import Mudra
from app.schemas.mudra import MudraCreate
from sqlalchemy.orm import Session

def get_mudra_by_name(db: Session, name: str):
    return db.query(Mudra).filter(Mudra.name == name).first()

def create_mudra(db: Session, mudra: MudraCreate):
    db_mudra = Mudra(
        name=mudra.name,
        sanskrit_name=mudra.sanskrit_name,
        meaning=mudra.meaning,
        description=mudra.description
    )
    db.add(db_mudra)
    db.commit()
    db.refresh(db_mudra)
    return db_mudra

def get_all_mudras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Mudra).offset(skip).limit(limit).all()
