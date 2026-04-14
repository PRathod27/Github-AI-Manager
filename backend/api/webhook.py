from fastapi import APIRouter, Request

from services.github_service import get_commit_diff, create_issue
from services.ai_service import analyze_code
from db.mongo import events_collection

router = APIRouter()


@router.post("/webhook")
async def github_webhook(request: Request):
    payload = await request.json()
    event_type = request.headers.get("X-GitHub-Event")

    print("📩 Event Type:", event_type)

    if event_type == "push":
        repo = payload["repository"]["full_name"]
        commits = payload.get("commits", [])

        print("📦 Repo:", repo)
        print("📊 Total commits:", len(commits))

        for commit in commits:
            sha = commit.get("id")

            print("\n🔹 Processing Commit:", sha)

            # 🔥 STEP 1: Fetch code diff
            diff = get_commit_diff(repo, sha)

            print("📏 Diff length:", len(diff))

            if not diff:
                print("⚠️ No diff found, skipping...")
                continue

            # 🧠 STEP 2: AI analysis
            analysis = analyze_code(diff)

            print("🧠 AI Analysis:\n", analysis)

            # 🗄️ STEP 3: Save to MongoDB
            events_collection.insert_one({
                "type": "commit",
                "repo": repo,
                "sha": sha,
                "analysis": analysis
            })

            print("💾 Saved to MongoDB", sha)

            # 🚀 STEP 4: Create GitHub Issue
            create_issue(
                repo=repo,
                title="[AI] Code Change Analysis",
                body=analysis
            )
            print("Analysis", analysis[:100])
        print("Repo:", repo)
        print("SHA:", sha)
        print("Diff length:", len(diff))    


        return {"status": "processed push"}
    return {"status": "ignored"}