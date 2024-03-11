import json
from typing import Annotated
from fastapi import HTTPException
from fastapi import UploadFile, Form, File
from fastapi.params import Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models import Post
from images import s3_upload_image
from typing import Optional

from database import Sessionlocal

from fastapi import APIRouter

from routers.auth import get_current_user

router = APIRouter(
	prefix = '/post',
	tags = ['post']
)


class PostCreate(BaseModel):
	text:str = None


def get_db():
	db = Sessionlocal()
	try:
		yield db
	finally:
		db.close()

db_dependecy = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]


@router.post('/create', status_code=200)
async def create_post(db:db_dependecy, user:user_dependency, data : Optional[str] = Form(...), photo: UploadFile = File(...)):
	if not user:
		raise HTTPException(status_code=401, detail='Authentication failed')
	try:
		data = json.loads(data) or None
		post = Post(
			text = data['text'] or '',
			user_id = user.get('id'),
			photo = await s3_upload_image(photo) or '',
		)
		print('hellow')
		db.add(post)
		db.commit()
	except:
		raise HTTPException(status_code=404, detail='Invalid data')



