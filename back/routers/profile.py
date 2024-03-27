from typing import Annotated

from pydantic import BaseModel, EmailStr, field_validator
from fastapi import APIRouter, Depends, Path, HTTPException, Body
from sqlalchemy.orm import Session

from database import Sessionlocal
from routers.auth import get_current_user
from models import Users, Followers, PostLikes, Post

from .py_schemas import CommentReturn, PostReturn, ProfileWithPosts, Follower, UpdateUserRequest, UserInformation

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


@router.get('/{user_name}/', status_code=200, response_model=ProfileWithPosts)
def get_user_posts(db:db_dependecy, us:user_dependency, user_name:str = Path()):
	user = db.query(Users).filter(Users.username == user_name).first()
	us = db.query(Users).filter(Users.id == us.get('id')).first()
	if not user:
		raise HTTPException(status_code=404, detail='Not found')
	user.is_self = True if us.username == user.username else False
	user.is_following = True if us in user.followers else False

	result = []
	if user.posts:
		for post in user.posts:
			if not post.is_anonymous:
				post.is_liked =True if db.query(PostLikes).filter(PostLikes.post_id == post.id, PostLikes.user_id == us.id).first() else False
				result.append(post)
	user.posts = result
	return user

@router.get('/get_information', status_code=200, response_model=UserInformation)
def get_user_info(db:db_dependecy, user:user_dependency):
	return db.query(Users).where(Users.id == user.get('id')).first()

@router.put('/update_info/', status_code=200, response_model=UserInformation)
def update_profile_info(db:db_dependecy, user:user_dependency, info:UpdateUserRequest = Body()):
	us:Users = db.query(Users).where(Users.id == user.get('id')).first()
	us.first_name = info.first_name
	us.last_name = info.last_name
	us.bio = info.bio

	db.add(us)
	db.commit()
	return us

@router.post('/{username}/follow', status_code=200)
async def follow_user(db:db_dependecy, user:user_dependency, username = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us = db.query(Users).filter(Users.username == username).first()
	user_1 = db.query((Users)).filter(Users.id == user.get('id')).first()
	if us.id == user_1.id:
		raise HTTPException(status_code=401, detail="Can't follow yourself")
	if us in user_1.following:
		user_1.following.remove(us)
	else:
		us.followers.append(user_1)
	db.commit()

@router.get('/{username}/followers', response_model=list[Follower])
def return_followers(user:user_dependency, db:db_dependecy, username:str = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us:Users = db.query(Users).filter(Users.username == username).first()
	if us:
		return us.followers

@router.get('/{username}/followings', response_model=list[Follower])
def return_followers(user:user_dependency, db:db_dependecy, username:str = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us:Users = db.query(Users).filter(Users.username == username).first()
	if us:
		return us.following


