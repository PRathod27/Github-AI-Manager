import requests
from config.settings import GITHUB_TOKEN

headers = {
    "Authorization": f"token {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3.diff"
}

def get_commit_diff(repo: str, commit_sha: str):
    url = f"https://api.github.com/repos/{repo}/commits/{commit_sha}"

    headers_diff = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3.diff"   # 🔥 KEY CHANGE
    }

    response = requests.get(url, headers=headers_diff)

    print("Status:", response.status_code)

    if response.status_code != 200:
        print("❌ Error:", response.text)
        return ""

    diff = response.text

    print("🔗 URL:", url)
    print("📦 Repo:", repo)
    print("🔑 Using Token:", GITHUB_TOKEN[:5], "...")  # partial print

    return diff

def create_issue(repo: str, title: str, body: str):
    url = f"https://api.github.com/repos/{repo}/issues"

    data = {
        "title": title,
        "body": body
    }

    response = requests.post(url, json=data, headers=headers)

    # Debug logging (VERY useful)
    if response.status_code != 201:
        print("❌ Issue creation failed:", response.text)
    else:
        print("✅ Issue created successfully")

    return response.json()