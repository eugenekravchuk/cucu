from fastapi import APIRouter, status, Depends, HTTPException, UploadFile, File, Form
from pydantic import BaseModel, EmailStr, parse_obj_as
from models import Users
from passlib.context import CryptContext
from database import  Sessionlocal
from typing import Annotated, Optional
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError
from datetime import timedelta, datetime
from images import s3_upload_image
from .py_schemas import Token, CreateUserRequest



router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = '2b084a6369d834e8d3ae9c3baee68a30bf264b614cf095d12113793a782a1899'
ALGHORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/login')

def get_db():
    db = Sessionlocal()
    try:
        yield db
    finally:
        db.close()


db_dependecy = Annotated[Session, Depends(get_db)]

def authenticate_user(name: str, password: str, db: db_dependecy):
    user = db.query(Users).filter(Users.username == name).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(username: str, user_id: int, role: str, avatar:str,  expires: timedelta = timedelta(days=2)):
    encode = {'sub': username, 'id': user_id, 'role': role, 'avatar':avatar}
    expire = datetime.utcnow() + expires
    encode.update({'exp': expire})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGHORITHM)


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGHORITHM])
        username: str = payload.get('sub')
        user_id: str = payload.get('id')
        user_role: str = payload.get('role')
        if username is None or user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail='Could not validate the user')
        return {'username': username, 'id': user_id, 'user_role': user_role}
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail='Could not validate the user') from exc


@router.post('/registration', status_code=status.HTTP_201_CREATED)
def create_user(db: db_dependecy,  user: CreateUserRequest):
    try:
        create_user_model = Users(
            email=user.email,
            username=user.username,
            first_name=user.first_name,
            last_name=user.last_name,
            role='user',
            hashed_password=bcrypt_context.hash(user.password),
            is_active=True,
            bio = None,
            avatar = None
        )
        print('created')
        db.add(create_user_model)
        db.commit()
        return login(user, db)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User already exists')


@router.post('/login/', status_code=status.HTTP_200_OK, response_model=Token)
def login(form_data:Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependecy):
    user: Users | None = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST)
    token = create_access_token(user.username, user.id, user.role, user.avatar,  timedelta(days=2))
    return {'access_token': token, 'token_type': 'Bearer'}


user_dependency = Annotated[dict, Depends(get_current_user)]
@router.post('/upload_avatar', status_code=200)
async def upload_avatar(user: user_dependency,
                  db: db_dependecy,
                  ava: UploadFile = File(...)):
    if user:
        user = db.query(Users).filter(Users.id == user.get('id')).first()
        if user:
            user.avatar = await s3_upload_image(ava)
            db.add(user)
            db.commit()