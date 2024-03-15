from typing import Annotated

from pydantic import BaseModel, EmailStr, field_validator
from fastapi import APIRouter, Depends, Path, HTTPException
from sqlalchemy.orm import Session

from database import Sessionlocal
from routers.auth import get_current_user
from models import Users, Followers

import os

router = APIRouter(
	prefix='/profile',
	tags = ['post']

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

	@field_validator('avatar')
	def add_bucket(cls, value):
		return s3_url + value

	class Config:
		orm_model = True



@router.get('/{user_name}/', status_code=200, response_model=ProfileWithPosts)
def get_user_posts(db:db_dependecy, user_name:str = Path()):
	try:
		user = db.query(Users).filter(Users.username == user_name).first()
	except:
		raise HTTPException(status_code=404, detail='Not found')
	print(user.followers)
	return user

@router.post('/{username}/follow', status_code=200)
async def follow_user(db:db_dependecy, user:user_dependency, username = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us = db.query(Users).filter(Users.username == username).first()
	follow = Followers.insert().values(user_id = us.id, follower_id = user.get('id'))
	db.execute(follow)
	db.commit()

