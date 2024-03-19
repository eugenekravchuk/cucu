import uuid
import boto3
import os
from fastapi import UploadFile, File, HTTPException
from PIL import Image
import io




s3 = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('aws_access_key_id'),
    aws_secret_access_key=os.environ.get('aws_secret_access_key'),
    region_name="eu-north-1",
)
BUCKET_NAME = 'ucummunity-storage'




async def s3_upload_image(file:UploadFile = File(...)):
    if file:
        content = await file.read()
        image = Image.open(io.BytesIO(content))
        webp_content = io.BytesIO()
        image.save(webp_content, "WEBP")
        webp_content.seek(0)
        filename = file.filename.split('.')[0] + uuid.uuid4().hex + '.webp'
        s3.upload_fileobj(webp_content, BUCKET_NAME, f'{filename}', ExtraArgs={"ACL":"public-read"})
        link = s3.generate_presigned_url('get_object',
                                         Params={'Bucket': BUCKET_NAME,
                                                 'Key': f'{filename}'}).split('?')[0].split('/')[-1]
        return link
    else:
        raise HTTPException(status_code=400, detail='File not found')


