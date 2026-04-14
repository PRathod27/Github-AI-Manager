from fastapi import APIRouter, Request
from services.github_service import get_commit_diff, create_issue, get_pr_diff, comment_on_pr
from services.ai_service import analyze_code, review_code
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


        for commit in commits:
            sha = commit.get("id")
            message = commit.get("message")
            print("\n🔹 Processing Commit:", sha)
            # 🔥 STEP 1: Fetch code diff
            diff = get_commit_diff(repo, sha)

            print("📏 Diff length:", len(diff))

            if not diff:
                print("⚠️ No diff found, skipping...")
                continue

            # 🧠 STEP 2: AI analysis
            analysis = analyze_code(diff)


            # 🗄️ STEP 3: Save to MongoDB
            events_collection.insert_one({
                "type": "commit",
                "repo": repo,
                "sha": sha,
                "message": commit.get("message"),
                "analysis": analysis
})

            print("💾 Saved to MongoDB", sha)

            # 🚀 STEP 4: Create GitHub Issue
            create_issue(
                repo=repo,
                title="[AI] Code Change Analysis",
                body=analysis
            )


        return {"status": "processed push"}

    # 🔥 HANDLE PULL REQUESTS
    # =========================
    elif event_type == "pull_request":
        action = payload.get("action")

        # Only trigger on PR open or update
        if action in ["opened", "synchronize"]:
            repo = payload["repository"]["full_name"]
            pr_number = payload["pull_request"]["number"]

            print(f"🚀 Processing PR #{pr_number} ({action})")

            # 🔥 Get PR diff
            diff = get_pr_diff(repo, pr_number)

            if not diff:
                print("⚠️ No PR diff found..")
                return {"status": "no diff"}

            # 🧠 AI Review
            review = review_code(diff)

            # 💬 Comment on PR
            comment_on_pr(repo, pr_number, review)

            print(f"✅ PR reviewed: #{pr_number}")

            return {"status": "PR reviewed"}

        return {"status": f"PR action '{action}' ignored"}

    # =========================
    # ❌ OTHER EVENTS
    # =========================
    return {"status": "ignored"}