import datetime

from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
from typing import Annotated, Union, Optional
from sqlalchemy.orm import Session
from sqlalchemy import and_
from database import get_db
from .auth import get_current_user
from models import Users, Organization, Organization_admins, Category, Event
from .py_schemas import OrganizationSmallReturn, CategoryReturn, Org_and_cat_return, EventCreate
from images import s3_upload_image


router = APIRouter(
	prefix='/event',
	tags = ['event']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/create', status_code=200, response_model=Org_and_cat_return)
def return_all_user_organizations(db:db_dependency, user:user_dependency):
	organizations =     db.query(Organization) \
						.join(Organization_admins)\
					    .join(Users)\
					    .filter(and_(Users.id == user.get('id'), Organization.is_active == True)).all()
	categories = db.query(Category).all()
	return {"organizations": organizations, "categories":categories}

@router.post('/create_event', status_code=200)
async def create_event(db:db_dependency, user:user_dependency,
					event_text: str = Form(...),
                    event_date: str = Form(...),
                    category_id: int = Form(...),
					organization: int = Form(...),
                    photo:UploadFile =  File(...)):
	us = db.query(Users).where(Users.id == user.get('id')).first().organizations
	if organization not in [x.id for x in us]:
		raise HTTPException(status_code=401, detail='You are not admin of this organization')
	event = Event(
		event_text = event_text,
		event_date = event_date,
		event_time_creation = datetime.datetime.now(),
		category_id = category_id,
		event_photo = await s3_upload_image(photo),
		organization_id = organization
	)
	print(event)
	db.add(event)
	db.commit()
