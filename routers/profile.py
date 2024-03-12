from typing import Annotated

from pydantic import BaseModel, EmailStr, field_validator
from fastapi import APIRouter, Depends, Path
from sqlalchemy.orm import Session

from database import Sessionlocal
from routers.auth import get_current_user
from models import Users

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

class PostReturn(BaseModel):
	text:str
	photo:str
	likes: list

	@field_validator('photo')
	def add_bucket(cls, value):
		return s3_url + value

	@field_validator('likes')
	def like_qunatity(cls, value):
		return len(value)




class ProfileWithPosts(BaseModel):
	username:str
	email:EmailStr
	first_name:str
	last_name:str
	avatar:str
	posts:list[PostReturn]

	@field_validator('avatar')
	def add_bucket(cls, value):
		return s3_url + value

	class Config:
		orm_model = True

@router.get('/{user_name}/', status_code=200, response_model=ProfileWithPosts)
def get_user_posts(db:db_dependecy, user_name:str = Path()):
	user = db.query(Users).filter(Users.username == user_name).first()
	return user