from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api import webhook, dashboard

app = FastAPI()

# ✅ CORS MUST BE HERE (BEFORE ROUTES)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # 👈 NOT "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(webhook.router)
app.include_router(dashboard.router, prefix="/api")


@app.get("/")
def health_check():
    return {"status": "running"}