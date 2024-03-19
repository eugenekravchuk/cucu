#CUCU Backend

## Installation

1.Clone repo <br/>
2.In project directory run following commands

```python
pip install requirements.txt
```

## In .env file change fields to connect to db and s3 storage

```python
DB_CONNECTION=#your connection to db
AWS_ACCESS_KEY_ID=#aws key for IAM  S3 manage user
AWS_SECRET_ACCESS_KEY=#aws key for IAM  S3 manage use
BUCKET_NAME=#bucket name'ucummunity-storage'
S3_BUCKET_URL=# url to s3 buck
```



in alembic.ini add your connection

```python
alembic revision --autogenerate -m 'init' # make migrations
alembic upgrade head # migrate to db
```

Then

```python
uvicorn main:app --reload #to run application
```

