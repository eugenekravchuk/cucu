from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from images import s3, s3_upload_image
from database import engine
from routers import auth, posts, profile
import models

models.Base.metadata.create_all(bind = engine)

app = FastAPI()
app.include_router(auth.router)
app.include_router(posts.router)
app.include_router(profile.router)

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])


@app.post('/upload_image')
async def upload_image(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=404, detail='No file found')
    resp = await s3_upload_image(file)
    return {'img_url': f'{resp}'}











