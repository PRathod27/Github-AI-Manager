from fastapi import FastAPI
from api import webhook

app = FastAPI()

app.include_router(webhook.router)
print("hello world updated")
@app.get("/")
def health_check():

    return {"status": "running"}