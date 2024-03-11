from sqlalchemy import Integer, String, Boolean, Column, URL, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base



class Users(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    role = Column(String)
    avatar = Column(String, nullable=True, default=None)

    posts = relationship('Post', back_populates='author')


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=True, default=None)
    photo = Column(String, nullable=True, default=None)
    user_id = Column(Integer, ForeignKey('Users.id'))

    author = relationship('Users', back_populates='posts')
