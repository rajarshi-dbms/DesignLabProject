from sqlalchemy import Column, Integer, String
from app.database import Base

class Video(Base):
    __tablename__ = "videos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    category = Column(String, index=True)
    level = Column(String)
    duration = Column(String)
    instructor = Column(String)
    video_url = Column(String)
    thumbnail_emoji = Column(String)
