from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Mudra(Base):
    __tablename__ = "mudras"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    sanskrit_name = Column(String)
    meaning = Column(Text)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
