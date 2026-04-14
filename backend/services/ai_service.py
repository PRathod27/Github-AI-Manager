from groq import Groq
from config.settings import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)

def analyze_code(diff: str):
    try:
        prompt = f"""
You are a senior software engineer.

Analyze the following code changes and return:

1. Type: Feature / Bug Fix / Refactor / Optimization
2. Risk Level: Low / Medium / High
3. Summary: What changed
4. Explanation: Why this change was made

Code Diff:
{diff[:4000]}
"""

        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}]
        )

        return response.choices[0].message.content

    except Exception as e:
        print("❌ GROQ ERROR:", e)
        return "Analysis unavailable"