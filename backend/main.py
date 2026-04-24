from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import webhook, dashboard, auth

app = FastAPI()

# CORS (safe for demo)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for demo; later restrict to Vercel URL
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(webhook.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "running"}