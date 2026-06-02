import json
import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

ARK_API_KEY = os.getenv("ARK_API_KEY")
ARK_MODEL_ID = os.getenv("ARK_MODEL_ID", "seed-1-8-251228")
ARK_BASE_URL = os.getenv("ARK_BASE_URL", "https://ark.ap-southeast.bytepluses.com/api/v3")

client = OpenAI(
    base_url=ARK_BASE_URL,
    api_key=ARK_API_KEY,
)

SYSTEM_PROMPT = """Kamu adalah seorang ahli HR dan career consultant. Tugasmu adalah menganalisa kecocokan antara CV seorang kandidat dengan deskripsi pekerjaan (job description) yang diberikan.

Berikan analisa dalam format JSON yang PERSIS seperti berikut ini (jangan tambahkan teks lain di luar JSON):

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
- matchedSkills: skill yang eksplisit disebut di JD dan terbukti di CV
- missingSkills: skill yang wajib/mendukung di JD tapi tidak ditemukan di CV
- partialSkills: skill yang disebut di JD dan kandidat punya pengalaman terkait tapi tidak langsung
- strengths: highlight kelebihan utama kandidat
- improvements: area spesifik yang perlu diperbaiki
- recommendations: saran actionable yang konkret

Gunakan bahasa Indonesia yang natural dan profesional."""


def analyze_cv(cv_text: str, job_description: str) -> dict:
    user_prompt = f"""Berikut adalah CV kandidat:

---
{cv_text}
---

Berikut adalah Job Description yang di-apply:

---
{job_description}
---

Analisa kecocokan CV ini dengan job description di atas."""

    response = client.chat.completions.create(
        model=ARK_MODEL_ID,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=4096,
    )

    raw_content = response.choices[0].message.content.strip()

    if raw_content.startswith("```json"):
        raw_content = raw_content[len("```json"):]
    if raw_content.startswith("```"):
        raw_content = raw_content[len("```"):]
    if raw_content.endswith("```"):
        raw_content = raw_content[:-len("```")]
    raw_content = raw_content.strip()

    try:
        result = json.loads(raw_content)
    except json.JSONDecodeError:
        result = _parse_partial_json(raw_content)

    return result


def _parse_partial_json(text: str) -> dict:
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        try:
            return json.loads(text[start:end])
        except json.JSONDecodeError:
            pass

    return {
        "matchScore": 0,
        "summary": text[:300],
        "matchedSkills": [],
        "missingSkills": [],
        "partialSkills": [],
        "strengths": [],
        "improvements": [],
        "recommendations": [],
    }
