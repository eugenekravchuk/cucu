from fastapi import APIRouter, Depends, Body, UploadFile, File, HTTPException, Form, Path
from typing import Annotated, Union
from sqlalchemy.orm import Session
from database import get_db
from .auth import get_current_user
from .py_schemas import OrganizationCreate, OrganizationReturn, UserReturn, OrganizationWithPosts
from models import Users, Organization, Event
from images import s3_upload_image



router = APIRouter(
	prefix='/organization',
	tags=['organizations']
)

db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.post('/create', status_code=200)
async def request_to_create_organization(db:db_dependency, user:user_dependency,organization_name: str = Form(...),
    organization_bio: str = Form(...), photo:UploadFile = File()):
	us = db.query(Users).where(Users.id == user.get('id')).first()
	if not user:
		raise HTTPException(status_code=401, detail='Not Authorized')
	pre_organization = Organization(
		organization_name = organization_name,
		organization_desc = organization_bio,
		organization_image = await s3_upload_image(photo),
		is_active = False
	)
	pre_organization.admins.append(us)
	db.add(pre_organization)
	db.commit()

@router.get('/{organization_id}/', status_code=200, response_model=OrganizationWithPosts)
def return_organization_by_id(db:db_dependency, user:user_dependency, organization_id:Annotated[int,Path()]):
	us = db.query(Users).where(Users.id == user.get('id')).first()
	if not user:
		raise HTTPException(status_code=401, detail='Not Authenticated')
	return db.query(Organization).where(Organization.id == organization_id).first()


