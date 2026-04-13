from fastapi import FastAPI
from api.webhook import router as webhook_router
from db.connection import db_manager

app = FastAPI()

@app.on_event("startup")
async def startup():
    await db_manager.connect_db()

app.include_router(webhook_router)