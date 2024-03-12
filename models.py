import datetime

from sqlalchemy import Integer, String, Boolean, Column, URL, Text, ForeignKey, DateTime
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

    posts = relationship('Post')


class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=True, default=None)
    photo = Column(String, nullable=True, default=None)
    date = Column(DateTime, nullable=False, default=None)
    user_id = Column(Integer, ForeignKey('Users.id'))

    author = relationship('Users', overlaps="posts")
    likes = relationship('PostLikes')
    comments = relationship('Comment', back_populates='post')

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False, default=None)
    user_id = Column(Integer, ForeignKey('Users.id'))
    post_id = Column(Integer, ForeignKey('posts.id'))

    author = relationship('Users')
    post = relationship('Post', back_populates='comments')
    likes = relationship('CommentLike')

class CommentLike(Base):
    __tablename__ = 'CommentLikes'

    comment_id = Column(Integer, ForeignKey('comments.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('Users.id'), primary_key=True)


class PostLikes(Base):
    __tablename__ = 'post_likes'

    post_id = Column(Integer, ForeignKey('posts.id'), primary_key=True)
    user_id = Column(Integer, ForeignKey('Users.id'), primary_key=True)

