import json
import os

import httpx
from dotenv import load_dotenv

load_dotenv()

ARKCLAW_WEBHOOK_URL = os.getenv(
    "ARKCLAW_WEBHOOK_URL",
    "http://localhost:18789/api/plugins/custom-webhook/webhook",
)
ARKCLAW_RECEIVE_SECRET = os.getenv("ARKCLAW_RECEIVE_SECRET", "")
ARKCLAW_TIMEOUT = int(os.getenv("ARKCLAW_TIMEOUT", "120"))

CV_ANALYSIS_PROMPT = """Kamu adalah seorang ahli HR dan career consultant. Tugasmu adalah menganalisa kecocokan antara CV seorang kandidat dengan deskripsi pekerjaan (job description) yang diberikan.

Berikan analisa DALAM FORMAT JSON PERSIS seperti berikut (jangan tambahkan teks lain di luar JSON):

{
  "matchScore": <angka 0-100>,
  "summary": "<ringkasan singkat kecocokan CV dengan job description dalam 2-3 kalimat>",
  "matchedSkills": ["<skill yang cocok dan dimiliki kandidat>"],
  "missingSkills": ["<skill yang dibutuhkan tapi tidak dimiliki kandidat>"],
  "partialSkills": ["<skill yang sebagian dimiliki atau pengalaman terbatas>"],
  "strengths": ["<kelebihan kandidat berdasarkan CV>"],
  "improvements": ["<area yang perlu ditingkatkan kandidat>"],
  "recommendations": ["<rekomendasi konkret untuk meningkatkan peluang>"]
}

Panduan penilaian:
- matchScore: 80-100 = Sangat Cocok, 60-79 = Cukup Cocok, 40-59 = Kurang Cocok, 0-39 = Tidak Cocok
- Gunakan bahasa Indonesia yang natural dan profesional."""


def analyze_cv_via_arkclaw(cv_text: str, job_description: str, sender_id: str = "cv-analyzer") -> dict:
    user_message = f"""{CV_ANALYSIS_PROMPT}

Berikut adalah CV kandidat:

---
{cv_text}
---

Berikut adalah Job Description yang di-apply:

---
{job_description}
---

Analisa kecocokan CV ini dengan job description di atas. Berikan HASILNYA DALAM FORMAT JSON SAJA."""

    payload = {
        "senderId": sender_id,
        "text": user_message,
        "async": False,
    }

    headers = {
        "Content-Type": "application/json",
    }

    if ARKCLAW_RECEIVE_SECRET:
        headers["Authorization"] = f"Bearer {ARKCLAW_RECEIVE_SECRET}"

    with httpx.Client(timeout=ARKCLAW_TIMEOUT) as client:
        response = client.post(ARKCLAW_WEBHOOK_URL, json=payload, headers=headers)

    if response.status_code == 200:
        data = response.json()
        reply = data.get("reply", "")
    elif response.status_code == 202:
        raise Exception("ArkClaw dalam mode async. Harap set async=False atau implementasikan callback handler.")
    else:
        raise Exception(f"ArkClaw error: HTTP {response.status_code} - {response.text}")

    return _parse_arkclaw_reply(reply)


def _parse_arkclaw_reply(reply: str) -> dict:
    raw = reply.strip()

    if raw.startswith("```json"):
        raw = raw[len("```json"):]
    if raw.startswith("```"):
        raw = raw[len("```"):]
    if raw.endswith("```"):
        raw = raw[:-len("```")]
    raw = raw.strip()

    try:
        result = json.loads(raw)
    except json.JSONDecodeError:
        start = raw.find("{")
        end = raw.rfind("}") + 1
        if start != -1 and end > start:
            try:
                result = json.loads(raw[start:end])
            except json.JSONDecodeError:
                result = _fallback_result(reply)
        else:
            result = _fallback_result(reply)

    required_keys = {"matchScore", "summary", "matchedSkills", "missingSkills", "partialSkills", "strengths", "improvements", "recommendations"}
    if not required_keys.issubset(result.keys()):
        result = _fallback_result(reply)

    return result


def _fallback_result(raw_reply: str) -> dict:
    return {
        "matchScore": 0,
        "summary": raw_reply[:500] if raw_reply else "Tidak ada respons dari ArkClaw.",
        "matchedSkills": [],
        "missingSkills": [],
        "partialSkills": [],
        "strengths": [],
        "improvements": [],
        "recommendations": [],
    }
