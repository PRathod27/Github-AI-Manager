import hmac
import hashlib
import os
from fastapi import Request, HTTPException

# Ensure this matches EXACTLY what you put in GitHub Webhook 'Secret' field
WEBHOOK_SECRET = os.getenv("GITHUB_WEBHOOK_SECRET", "").encode()

async def verify_signature(request: Request, signature: str):
    if not signature:
        raise HTTPException(status_code=401, detail="No signature found")
    
    # We MUST get the raw body bytes
    body = await request.body()
    
    # Calculate the hash using HMAC-SHA256
    hash_object = hmac.new(WEBHOOK_SECRET, msg=body, digestmod=hashlib.sha256)
    expected_signature = "sha256=" + hash_object.hexdigest()
    
    # Constant-time comparison to prevent timing attacks
    if not hmac.compare_digest(expected_signature, signature):
        print(f"❌ Signature Mismatch! Expected: {expected_signature} but got: {signature}")
        raise HTTPException(status_code=401, detail="Invalid signature")
    
    print("✅ Signature Verified")