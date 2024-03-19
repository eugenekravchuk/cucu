from sqlalchemy import Integer, String, Boolean, Column, Text, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from database import Base

Followers = Table(
    'Followers',
    Base.metadata,
    Column('user_id', ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True),
    Column('follower_id', ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True),
)


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

    followers = relationship("Users", secondary="Followers", primaryjoin = "Users.id == Followers.c.user_id", secondaryjoin= "Users.id == Followers.c.follower_id", backref="following")
    likes = relationship('PostLikes')

    is_self = None
    is_following = None



class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=True, default=None)
    photo = Column(String, nullable=True, default=None)
    date = Column(DateTime, nullable=False, default=None)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'))

    author = relationship('Users', overlaps="posts")
    likes = relationship('PostLikes')
    comments = relationship('Comment', back_populates='post')

    is_liked = None
    is_author = None



class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    date = Column(DateTime, nullable=False, default=None)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'))
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'))

    author = relationship('Users')
    post = relationship('Post', back_populates='comments')
    likes = relationship('CommentLike', cascade='delete, delete-orphan')

class CommentLike(Base):
    __tablename__ = 'CommentLikes'

    comment_id = Column(Integer, ForeignKey('comments.id', ondelete='CASCADE'), primary_key=True)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True)


class PostLikes(Base):
    __tablename__ = 'post_likes'

    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True)

#
# class Category(Base):
#     __tablename__ = 'Categories'
#
#     id = Column(Integer, index=True, primary_key=True)
#     name = Column(String)
#
#     events = relationship('Event')

# class Event(Base):
#     __tablename__ = 'Events'
#
#     id = Column(Integer, index=True, primary_key=True)
#     text = Column(String, nullable=False)
#     photo = Column(String, nullable=False)
#     time_creation = Column(DateTime)
#     category_id = Column(Integer, ForeignKey('Categories.id'), nullable=False)
#
#
#
# class Category_subscribers(Base):
#     user_id = Column(Integer, ForeignKey('Users.id'), primary_key=True)
#     category_id = Column(Integer, ForeignKey('Categories.id'), primary_key=True)









