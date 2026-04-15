from fastapi import APIRouter, Query
from db.mongo import events_collection   # ✅ correct source

router = APIRouter()


@router.get("/events")
def get_events(repo: str = Query(...)):
    # filter it by repo
    events = list(
        events_collection.find(
            {"repo": repo},
            {"_id": 0}
        )
    )

    return events