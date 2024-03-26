import datetime
import json
import os
from typing import Annotated, Union, Optional
from fastapi import HTTPException, Response
from fastapi import UploadFile, Form, File, Path, Body
from fastapi.params import Depends
from pydantic import BaseModel, EmailStr, field_validator, parse_obj_as
from sqlalchemy.orm import Session
from models import Post, Users, PostLikes, Comment, CommentLike
from datetime import datetime

from images import s3_upload_image
from sqlalchemy import select, desc, delete, or_
from database import get_db

from fastapi import APIRouter

from routers.auth import get_current_user
from .py_schemas import PostUpdate, FullPostReturn, CommentForPostModel, PostReturn, AnonymousPostCreate

router = APIRouter(
	tags = ['post']
)

db_dependecy = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post('/post/create', status_code=200)
async def create_post(db:db_dependecy, user:user_dependency, data : str = Form(...), photo: UploadFile = File(...)):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	try:
		print("sksvkjs")
		data = json.loads(data)
		print("ksadjvkaskjv")
		post = Post(
			text = data.get('text'),
			user_id = user.get('id'),
			photo = await s3_upload_image(photo),
			date = datetime.now(),
		)
		print('helndsfks')
		db.add(post)
		db.commit()
		return
	except:
		raise HTTPException(status_code=404, detail='Invalid data')

@router.get('/post/{post_id}', status_code=200, response_model=FullPostReturn)
async def get_user_posts(db: db_dependecy, user:user_dependency, post_id: int = Path(gt=0)):
	us = db.query(Users).filter(Users.id == user.get('id')).first()
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	post = db.query(Post).filter(Post.id == post_id).first()
	if not post:
		raise HTTPException(status_code=404, detail='Post not found')
	is_liked =  True if us.id in [x.user_id for x in post.likes] else False
	is_author = True if us.id == post.user_id else False
	post.is_liked = is_liked
	post.is_author = is_author
	for i in post.comments:
		if i.user_id == us.id:
			i.deletable = True
		elif post.author == us:
			i.deletable = True
		if us.id in [x.user_id for x in i.likes]:
			i.is_liked = True
	post.comments = sorted(post.comments, key=lambda x: x.date, reverse=True)
	return post

@router.get('/posts/all', status_code=200, response_model=list[PostReturn])
def return_all_posts(user:user_dependency, db:db_dependecy):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	us:Users = db.query(Users).filter(Users.id == user.get('id')).first()

	posts = db.query(Post).where(or_(Post.is_anonymous == False, Post.is_anonymous == None)).order_by(desc(Post.date)).all()

	for post in posts:
		post.is_liked = post.id in [like.post_id for like in us.likes]
		post.is_author = us.id == post.user_id
	return posts

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

@router.post('/post/{post_id}/comment', status_code=200, response_model=CommentForPostModel)
async def add_comment(db:db_dependecy, user:user_dependency, comment_text:Annotated[str,Form()], post_id = Path()):
	if not comment_text:
		raise HTTPException(status_code=401, detail='Please provide some text')
	comment_text = json.loads(comment_text)
	try:
		comment = Comment(
			text = comment_text.get('text'),
			date = datetime.now(),
			user_id = user.get('id'),
			post_id = post_id
		)
		db.add(comment)
		db.commit()
		return comment
	except:
		raise HTTPException(status_code=404, detail='Post not found')

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

@router.put('/post/{post_id}/update', status_code=200, response_model=FullPostReturn)
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
	post = db.query(Post).filter(Post.id == post_id).first()
	if not post:
		raise HTTPException(status_code=404, detail='Post not found')
	if post.author.id != user.get('id'):
		raise HTTPException(status_code=403, detail='Access denied')
	db.delete(post)
	db.commit()

@router.delete('/comment/{comment_id}/delete')
def delete_comment(db:db_dependecy, user:user_dependency, comment_id = Path()):
	comment  = db.query(Comment).filter(Comment.id == comment_id).first()
	us:Users = db.query(Users).filter(Users.id == user.get('id')).first()
	if comment and us:
		if comment.user_id == user.get('id') or comment.post_id in us.posts:
			db.delete(comment)
			db.commit()
		else:
			raise HTTPException(status_code=401, detail='Not allowed')
	else:
		raise HTTPException(status_code=404, detail='Comment not found')