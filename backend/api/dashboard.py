from fastapi import APIRouter
from db.connection import db_manager

router = APIRouter()

@router.get("/tasks")
async def get_tasks():
    # MongoDB se saare AI insights nikalna [cite: 60]
    cursor = db_manager.db.ai_insights.find().sort("created_at", -1)
    tasks = await cursor.to_list(length=100)
    for task in tasks:
        task["_id"] = str(task["_id"]) # JSON compatibility ke liye
    return tasks