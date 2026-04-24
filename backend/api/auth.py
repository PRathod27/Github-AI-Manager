from fastapi import APIRouter
from fastapi.responses import RedirectResponse
import requests
import os
from datetime import datetime

from db.mongo import users_collection

router = APIRouter()

CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")


# 🔹 LOGIN ROUTE
@router.get("/login")
def login():
    return RedirectResponse(
        f"https://github.com/login/oauth/authorize?client_id={CLIENT_ID}&scope=repo"
    )


# 🔹 CALLBACK ROUTE
@router.get("/callback")
def callback(code: str):

    print("✅ Callback triggered")

    # 1. Exchange code → access token
    token_res = requests.post(
        "https://github.com/login/oauth/access_token",
        headers={"Accept": "application/json"},
        data={
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
            "code": code,
        },
    )

    token_data = token_res.json()
    access_token = token_data.get("access_token")

    if not access_token:
        return {"error": "Failed to get access token"}

    # 2. Fetch GitHub user
    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    user = user_res.json()

    # 3. Prepare user data
    user_data = {
        "github_id": user.get("id"),
        "username": user.get("login"),
        "avatar_url": user.get("avatar_url"),
        "access_token": access_token,
        "created_at": datetime.utcnow()
    }

    # 4. Store in MongoDB (upsert)
    users_collection.update_one(
        {"github_id": user.get("id")},
        {"$set": user_data},
        upsert=True
    )

    print(f"✅ User stored: {user.get('login')}")

    # 5. Redirect to frontend
    return RedirectResponse(
        f"https://github-ai-manager-frontend.vercel.app/auth-success?username={user.get('login')}"
    )