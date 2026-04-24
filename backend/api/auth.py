from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import requests
import os
from db.mongo import users_collection

router = APIRouter()

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")



@router.get("/login")
def login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}"
    )

@router.get("/callback")
def callback(code: str):

    # 1. Exchange code → access token
    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": os.getenv("GITHUB_CLIENT_ID"),
            "client_secret": os.getenv("GITHUB_CLIENT_SECRET"),
            "code": code,
        },
    )

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    # 2. Fetch GitHub user
    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    user = user_res.json()

    user_data = {
        "github_id": user["id"],
        "username": user["login"],
        "avatar_url": user["avatar_url"],
        "access_token": access_token,
        "created_at": datetime.utcnow()
    }

    # 3. Store in MongoDB
    users_collection.update_one(
        {"github_id": user["id"]},
        {"$set": user_data},
        upsert=True
    )

    return RedirectResponse(
        f"https://github-ai-manager-frontend.vercel.app/auth-success?username={user['login']}"
    )