import datetime
import json
import os
from typing import Annotated, Union
from fastapi import HTTPException, Response
from fastapi import UploadFile, Form, File, Path, Body
from fastapi.params import Depends
from pydantic import BaseModel, EmailStr, field_validator, parse_obj_as
from sqlalchemy.orm import Session
from models import Post, Users, PostLikes, Comment, CommentLike

from images import s3_upload_image
from sqlalchemy import select
from database import Sessionlocal

from fastapi import APIRouter

from routers.auth import get_current_user

router = APIRouter(
	tags = ['post']
)

s3_url = os.environ.get('S3_BUCKET_URL')

class UserReturn(BaseModel):
	id: int
	username: str
	first_name: str
	last_name: str
	email: EmailStr
	avatar: str

	@field_validator('avatar')
	def return_url(cls, v):
		return s3_url + v

class CommentForPostModel(BaseModel):
	text:str
	likes:list
	author:UserReturn

	@field_validator('likes')
	def like_qunatity(cls, value):
		return len(value)

class PostReturn(BaseModel):
	id:int
	text:str
	photo:str
	date:datetime.datetime
	author: UserReturn
	likes:list
	comments: list[CommentForPostModel]
	is_liked: bool = False
	is_author: bool = False
	@field_validator('likes')
	def like_qunatity(cls, value):
		return len(value)

	@field_validator('photo')
	def return_photo(cls, value):
		return s3_url + value

	class Config:
		orm_mode = True

class CommentReturn(BaseModel):
	text:str
	date:datetime.datetime
	author:UserReturn
	post_id:int

	class Config:
		orm_mode = True

class CommentCreate(BaseModel):
	text:str

def get_db():
	db = Sessionlocal()
	try:
		yield db
	finally:
		db.close()

class PostUpdate(BaseModel):
	text:str

db_dependecy = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]



@router.post('/post/create', status_code=200)
async def create_post(db:db_dependecy, user:user_dependency, data : str = Form(...), photo: UploadFile = File(...)):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	try:
		data = json.loads(data)
		post = Post(
			text = data.get('text'),
			user_id = user.get('id'),
			photo = await s3_upload_image(photo),
			date = datetime.datetime.now()
		)
		print(data.get("text"))
		db.add(post)
		db.commit()
		return
	except:
		raise HTTPException(status_code=404, detail='Invalid data')

@router.get('/post/{post_id}', status_code=200, response_model=PostReturn)
async def get_user_posts(db: db_dependecy, user:user_dependency, post_id: int = Path(gt=0)):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	post = db.query(Post).filter(Post.id == post_id).first()
	if not post:
		raise HTTPException(status_code=404, detail='Post not found')
	is_liked =  True if db.query(PostLikes).filter(PostLikes.post_id == post.id, PostLikes.user_id == user.get('id')).first() else False
	is_author = True if user.get('id') == post.user_id else False
	post.is_liked = is_liked
	post.is_author = is_author
	return post


@router.post('/post/{post_id}/like', status_code=201)
async def like_post(user:user_dependency, db: db_dependecy, post_id: int = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	like = db.query(PostLikes).filter(PostLikes.post_id == post_id, PostLikes.user_id == user.get('id')).first()
	if not like:
		new_like = PostLikes(user_id = user.get('id'), post_id = post_id)
		db.add(new_like)
		db.commit()
		return Response(status_code=200)
	db.delete(like)
	db.commit()
	return Response(status_code=200)

@router.post('/post/{post_id}/comment', status_code=200, response_model=CommentReturn)
async def add_comment(db:db_dependecy, user:user_dependency, comment_text:Annotated[str,Form()], post_id = Path()):
	if not comment_text:
		raise HTTPException(status_code=401, detail='Please provide some text')
	comment_text = json.loads(comment_text)
	comment = Comment(
		text = comment_text.get('text'),
		date = datetime.datetime.now(),
		user_id = user.get('id'),
		post_id = post_id
	)
	db.add(comment)
	db.commit()
	return comment

@router.post('/{comm_id}/like', status_code=200)
def add_like_to_comment(db:db_dependecy, user:user_dependency, comm_id = Path()):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	like = db.query(CommentLike).filter(CommentLike.comment_id == comm_id, CommentLike.user_id == user.get('id')).first()
	if not like:
		like = CommentLike(comment_id = comm_id, user_id = user.get('id'))
		db.add(like)
		db.commit()
	else:
		db.delete(like)
		db.commit()


@router.get('/posts/all', status_code=200, response_model=list[PostReturn])
def return_all_posts(user:user_dependency, db:db_dependecy):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	posts = db.query(Post).all()
	result = []
	for post in posts:
		post.is_liked =  True if db.query(PostLikes).filter(PostLikes.post_id == post.id, PostLikes.user_id == user.get('id')).first() else False
		post.is_author = True if user.get('id') == post.user_id else False
		result.append(post)

	return result

@router.put('/post/{post_id}/update', status_code=200, response_model=PostReturn)
def update_post(user:user_dependency, db:db_dependecy, post_text:Annotated[PostUpdate, Body()], post_id:int = Path(...)):
	post = db.query(Post).filter(Post.id == post_id).first()
	if post.user_id is not  user.get("id"):
		raise HTTPException(status_code=404, detail='Not authenticated')
	post.text = post_text.text
	post.is_liked = True if db.query(PostLikes).filter(PostLikes.post_id == post.id, PostLikes.user_id == user.get('id')).first() else False
	post.is_author = True if user.get('id') == post.user_id else False
	db.add(post)
	db.commit()
	return post

@router.delete('/post/{post_id}/delete')
def delete_post(user:user_dependency, db:db_dependecy, post_id:int = Path()):
	post = db.query(Post).filter(Post.id == post_id)
	post.delete(synchronize_session = False)
	db.commit()



