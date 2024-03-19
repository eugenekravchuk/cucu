from typing import Annotated

from pydantic import BaseModel, EmailStr, field_validator
from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.orm import Session

from database import Sessionlocal
from routers.auth import get_current_user
from models import Users, Followers, PostLikes

import os

router = APIRouter(
	prefix='/profile',
	tags = ['profile']

)
s3_url = os.environ.get('S3_BUCKET_URL')

def get_db():
	db = Sessionlocal()
	try:
		yield db
	finally:
		db.close()

db_dependecy = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

class CommentReturn(BaseModel):
	text: str
	photo: str
	likes:list

	@field_validator('likes')
	def likes_quantity(cls, value):
		return len(value)


class PostReturn(BaseModel):
	id: int
	text:str
	photo:str
	likes: list
	is_liked: bool
	comments: list[CommentReturn]

	@field_validator('photo')
	def add_bucket(cls, value):
		return s3_url + value

	@field_validator('likes')
	def like_quantity(cls, value):
		return len(value)

	class Config:
		orm_model = True

class Follower(BaseModel):
	id: int
	username:str
	avatar: str

	@field_validator('avatar')
	def add_route(cls, v):
		return s3_url + v

class ProfileWithPosts(BaseModel):
	username:str
	email:EmailStr
	first_name:str
	last_name:str
	avatar:str
	followers:list[Follower]
	following:list[Follower]
	posts:list[PostReturn]
	is_following:bool

	@field_validator('followers')
	def followers_amount(cls, v):
		return len(v)
	@field_validator('following')
	def following_amount(cls, v):
		return len(v)

	@field_validator('avatar')
	def add_bucket(cls, value):
		return s3_url + value

	class Config:
		orm_model = True



@router.get('/{user_name}/', status_code=200, response_model=ProfileWithPosts)
def get_user_posts(db:db_dependecy, us:user_dependency, user_name:str = Path()):
	user = db.query(Users).filter(Users.username == user_name).first()
	us = db.query(Users).filter(Users.id == us.get('id')).first()
	if not user:
		raise HTTPException(status_code=404, detail='Not found')
	user.is_self = True if us.username == user.username else False
	user.is_following = True if us in user.followers else False

	for post in user.posts:
		post.is_liked =True if db.query(PostLikes).filter(PostLikes.post_id == post.id, PostLikes.user_id == us.id).first() else False
	return user

@router.post('/{username}/follow', status_code=200)
async def follow_user(db:db_dependecy, user:user_dependency, username = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us = db.query(Users).filter(Users.username == username).first()
	user_1 = db.query((Users)).filter(Users.id == user.get('id')).first()
	if us in user_1.following:
		user_1.following.remove(us)
	else:
		follow = Followers.insert().values(user_id=us.id, follower_id=user.get('id'))
		db.execute(follow)
	db.commit()


