import requests
from config.settings import GITHUB_TOKEN

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github.v3.diff"
}

def get_commit_diff(repo: str, commit_sha: str):
    url = f"https://api.github.com/repos/{repo}/commits/{commit_sha}"
    
    response = requests.get(url, headers=headers)
    data = response.json()

    # Combine all file patches
    diff = ""
    for file in data.get("files", []):
        if "patch" in file:
            diff += file["patch"] + "\n"

    return diff

def create_issue(repo: str, title: str, body: str):
    url = f"{BASE_URL}/repos/{repo}/issues"

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