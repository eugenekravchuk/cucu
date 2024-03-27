import datetime

from sqlalchemy import Integer, String, Boolean, Column, Text, ForeignKey, DateTime, Table, Date
from sqlalchemy.orm import relationship
from database import Base

Followers = Table(
    'Followers',
    Base.metadata,
    Column('user_id', ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True),
    Column('follower_id', ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True),
)

Organization_admins = Table(
    'Organization_admins',
    Base.metadata,
    Column('user_id', ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True),
    Column('organization_id', ForeignKey('Organizations.id', ondelete='CASCADE'), primary_key=True),
)



class Users(Base):
    __tablename__ = 'Users'

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True)
    username = Column(String, unique=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    bio = Column(Text, nullable=True, default=None)
    is_active = Column(Boolean, default=True)
    role = Column(String)
    avatar = Column(String, nullable=True, default=None)

    posts = relationship('Post')
    followers = relationship("Users", secondary="Followers", primaryjoin = "Users.id == Followers.c.user_id", secondaryjoin= "Users.id == Followers.c.follower_id", backref="following")
    likes = relationship('PostLikes')
    organizations = relationship("Organization", secondary='Organization_admins', backref='admins')

    is_self = None
    is_following = None



class Post(Base):
    __tablename__ = 'posts'

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=True, default=None)
    photo = Column(String, nullable=True, default=None)
    date = Column(DateTime, nullable=False, default=None)
    is_anonymous = Column(Boolean, default=False,  nullable=True)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'))

    author = relationship('Users', overlaps="posts")
    likes = relationship('PostLikes')
    comments = relationship('Comment', back_populates='post')

    is_liked = None
    is_author = False


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

    deletable:bool = False
    is_liked:bool = False

class CommentLike(Base):
    __tablename__ = 'CommentLikes'

    comment_id = Column(Integer, ForeignKey('comments.id', ondelete='CASCADE'), primary_key=True)
    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True)


class PostLikes(Base):
    __tablename__ = 'post_likes'

    user_id = Column(Integer, ForeignKey('Users.id', ondelete='CASCADE'), primary_key=True)
    post_id = Column(Integer, ForeignKey('posts.id', ondelete='CASCADE'), primary_key=True)

    post = relationship('Post')


class Category(Base):
    __tablename__ = 'Categories'

    id = Column(Integer, primary_key=True)
    category_name = Column(String)
    category_image = Column(String, nullable=True)

    events = relationship('Event', backref='category')

class Event(Base):
    __tablename__ = 'Events'
    id = Column(Integer, primary_key=True)
    event_text = Column(String, nullable=False)
    event_photo = Column(String, nullable=False)
    event_time_creation = Column(DateTime,default=datetime.datetime.now(), nullable=False)
    event_date = Column(Date, nullable=False)
    organization_id = Column(Integer, ForeignKey('Organizations.id'), nullable=False)
    category_id = Column(Integer, ForeignKey('Categories.id'), nullable=False)




class Organization(Base):
    __tablename__ = 'Organizations'

    id = Column(Integer, primary_key=True)
    organization_name = Column(String, nullable=False, unique=True)
    organization_desc = Column(Text, nullable=True, default=None)
    organization_image = Column(String, nullable=False)
    is_active = Column(Boolean, default=False, nullable=False)

    events = relationship('Event')




