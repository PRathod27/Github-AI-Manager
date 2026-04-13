from fastapi import APIRouter, Header, Request
from utils.security import verify_signature
from services.ai_service import analyze_code_change
from services.github_service import post_comment

router = APIRouter()

@router.post("/webhook")
async def handle_github_event(request: Request, x_hub_signature_256: str = Header(None)):
    await verify_signature(request, x_hub_signature_256)
    payload = await request.json()
    
    # Trigger AI only on PRs or specific Pushes [cite: 41, 42]
    if "pull_request" in payload:
        analysis = await analyze_code_change(payload['pull_request']['diff_url'], "PR Review")
        await post_comment(payload['repository']['full_name'], payload['pull_request']['number'], analysis['suggestion'])
        
    return {"status": "success"}