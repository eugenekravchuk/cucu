import os
from pydantic import BaseModel, EmailStr, field_validator, Field
from typing import Optional, Union
from datetime import datetime, date

s3_url = os.environ.get('S3_BUCKET_URL')

class Token(BaseModel):
	access_token: str
	token_type: str

class CreateUserRequest(BaseModel):
	username: str
	first_name: str
	last_name: str
	email: EmailStr
	password: str

class UpdateUserRequest(BaseModel):
	first_name:str
	last_name:str
	bio:str

class UserInformation(BaseModel):
	first_name:str
	last_name:str
	username:str
	email:EmailStr
	bio:Optional[str]
	avatar:Optional[str]

	@field_validator('avatar')
	def s3_add(cls, val):
		return s3_url + val

class CommentCreate(BaseModel):
	text:str

class PostUpdate(BaseModel):
	text:str

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

class CommentReturn(BaseModel):
	id:int
	text: str
	likes:int
	date:datetime
	author: 'UserReturn'

	@field_validator('likes', mode='before')
	def likes_quantity(cls, value):
		return len(value)

	class Config:
		from_attributes = True

class AnonymousPostCreate(BaseModel):
	text:str

class PostReturn(BaseModel):
	id: int
	text:str
	photo:Union[str,None]
	likes: int
	is_liked: bool
	is_author: bool
	date:datetime
	author: UserReturn

	@field_validator('photo')
	def add_bucket(cls, value):
		if value is not None:
			return s3_url + value

	@field_validator('likes', mode='before')
	def like_quantity(cls, value):
		return len(value)

	class Config:
		from_attributes = True

class Follower(BaseModel):
	id: int
	username:str
	avatar: str

	@field_validator('avatar')
	def add_route(cls, v):
		return s3_url + v

	class Config:
		from_attributes = True

class ProfileWithPosts(UserReturn):
	followers:int
	following:int
	posts:list[PostReturn] = []
	is_following:bool

	@field_validator('followers', mode='before')
	def followers_amount(cls, v):
		return len(v)

	@field_validator('following', mode='before')
	def following_amount(cls, v):
		return len(v)

	class Config:
		from_attributes = True

class CommentForPostModel(BaseModel):
	id:int
	text:str
	likes:int
	author:UserReturn
	date:datetime
	deletable:bool
	is_liked:bool = False

	@field_validator('likes', mode='before')
	def like_quantity(cls, value):
		return len(value)


class FullPostReturn(PostReturn):
	comments: list[CommentForPostModel]

	class Config:
		from_attributes = True

class AnonymousPostCreate(BaseModel):
	text:str

class AnonymousPostReturn(BaseModel):
	id:int
	text:str
	date:datetime
	likes:int
	photo:Optional[str]

	@field_validator('likes', mode='before')
	def amount_of_likes(cls, val):
		return len(val)

	class Config:
		from_attributes = True

class AnonymousPostFullReturn(AnonymousPostReturn):
	comments:list[CommentReturn]

	class Config:
		from_attributes = True

class OrganizationCreate(BaseModel):
	organization_name:str
	organization_bio:str

class OrganizationSmallReturn(BaseModel):
	id: int
	organization_name: str
	organization_image:str

	@field_validator('organization_image')
	def s3_add(cls, val):
		return s3_url + val


class OrganizationReturn(OrganizationSmallReturn):
	organization_desc:str
	admins:list[UserReturn]

	class Config:
		arbitrary_types_allowed = True

class CategoryReturn(BaseModel):
	id:int
	category_name:str

class Org_and_cat_return(BaseModel):
	organizations:list[OrganizationSmallReturn]
	categories:list[CategoryReturn]

class EventCreate(BaseModel):
	event_text:str
	event_date:datetime
	category_id:int

class EventReturn(BaseModel):
	id:int
	event_text:str
	event_photo:str
	event_date:date
	category: CategoryReturn


	@field_validator('event_photo')
	def s3_add(cls, val):
		return s3_url + val

	class Config:
		from_attributes = True

class OrganizationWithPosts(BaseModel):
	id: int
	organization_name: str
	organization_image: str
	organization_desc:str
	events:list[EventReturn]


	@field_validator('organization_image')
	def s3_add(cls, val):
		return s3_url + val

	class Config:
		arbitrary_types_allowed = True


