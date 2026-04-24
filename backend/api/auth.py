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
def callback(code: str = None):

    if not code:
        return {"error": "Missing code parameter"}

    print("✅ Callback hit")

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
        return {"error": "Failed to fetch token"}

    user_res = requests.get(
        "https://api.github.com/user",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    user = user_res.json()

    users_collection.update_one(
        {"github_id": user.get("id")},
        {"$set": {
            "username": user.get("login"),
            "access_token": access_token
        }},
        upsert=True
    )

    return RedirectResponse(
        f"https://github-ai-manager-frontend.vercel.app/auth-success?username={user.get('login')}"
    )