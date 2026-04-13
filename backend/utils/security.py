import hmac, hashlib, os
from fastapi import Request, HTTPException

WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "").encode()

async def verify_signature(request: Request, signature: str):
    body = await request.body()
    hash_obj = hmac.new(WEBHOOK_SECRET, msg=body, digestmod=hashlib.sha256)
    expected = "sha256=" + hash_obj.hexdigest()
    if not hmac.compare_digest(expected, signature):
        raise HTTPException(status_code=401, detail="Invalid Signature")