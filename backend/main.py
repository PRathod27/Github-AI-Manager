from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import webhook, dashboard

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://github-ai-manager-frontend.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(webhook.router)
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "running"}