from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import webhook, dashboard,auth

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(webhook.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "running"}