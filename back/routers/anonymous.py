import datetime

import fastapi
from models import Users, Post, Comment
from fastapi import APIRouter, Depends, Form, HTTPException, Path, UploadFile, File
from database import get_db
from sqlalchemy.orm import Session
from typing import Annotated, Union
from .auth import get_current_user
from .py_schemas import AnonymousPostReturn, AnonymousPostCreate, AnonymousPostFullReturn
from images import s3_upload_image

router = APIRouter(
	prefix='/anonymous',
	tags=['anonymous']
)

db_dependecy = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/create', status_code=200)
async def create_anonymous_post(db:db_dependecy, user:user_dependency, text:Annotated[str,Form()], photo:UploadFile = File(None)):
	if not user:
		raise HTTPException(status_code=401, detail='Not Authorized')
	post = Post(
		text = text,
		photo = await s3_upload_image(photo),
		user_id = user.get('id'),
		date = datetime.datetime.now(),
		is_anonymous = True
	)
	db.add(post)
	db.commit()

@router.get('/{anonymous_id}', status_code=200, response_model=AnonymousPostFullReturn)
def get_anonymous_post(db:db_dependecy, user:user_dependency, anonymous_id:int = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Not Authorized')
	anonymous_post = db.query(Post).filter(Post.id == anonymous_id).first()
	return anonymous_post


@router.get('/all/', status_code=200, response_model=list[AnonymousPostReturn])
def get_all_anonymous_posts(db:db_dependecy, user:user_dependency):
	if not user:
		raise HTTPException(status_code=401, detail='Not Authorized')
	anonymous_post = db.query(Post).filter(Post.is_anonymous == True).all()
	return anonymous_post

