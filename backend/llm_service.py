"""
LLM Service — Integrasi BytePlus Seed LLM untuk analisa CV.

Menggunakan OpenAI-compatible API (via BytePlus Ark) untuk menganalisa
kecocokan CV dengan job description. Menghasilkan output JSON terstruktur
berisi skor kecocokan, skill matching, kelebihan, dan rekomendasi.

Konfigurasi via environment variables (.env):
    ARK_API_KEY   — API key BytePlus Ark
    ARK_MODEL_ID  — Model ID (default: seed-1-8-251228)
    ARK_BASE_URL  — Base URL API (default: https://ark.ap-southeast.bytepluses.com/api/v3)
"""

import json
import os

from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

ARK_API_KEY = os.getenv("ARK_API_KEY")
ARK_MODEL_ID = os.getenv("ARK_MODEL_ID", "seed-2-0-pro-260328")
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
    """Analisa kecocokan CV dengan job description menggunakan Seed LLM.

    Mengirimkan teks CV dan job description ke LLM, lalu mem-parsing
    respons JSON yang berisi skor kecocokan, skill matching, kelebihan,
    area perbaikan, dan rekomendasi.

    Args:
        cv_text: Teks CV yang sudah diekstrak dari file.
        job_description: Deskripsi pekerjaan yang di-apply.

    Returns:
        Dict dengan keys: matchScore, summary, matchedSkills,
        missingSkills, partialSkills, strengths, improvements, recommendations.
        Jika parsing JSON gagal, mengembalikan fallback result dengan matchScore 0.
    """
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


CV_IMPROVEMENT_SYSTEM_PROMPT = """Kamu adalah seorang ahli HR dan professional resume writer. Tugasmu adalah memberikan insight perbaikan LANGSUNG kepada CV yang diberikan berdasarkan job description.

Analisa CV bagian per bagian dan berikan saran perbaikan yang spesifik, actionable, dan langsung bisa diterapkan ke CV tersebut.

Berikan analisa dalam format JSON yang PERSIS seperti berikut ini (jangan tambahkan teks lain di luar JSON):

{
  "overallFeedback": "<feedback keseluruhan tentang kualitas CV dalam 2-3 kalimat>",
  "sections": [
    {
      "sectionName": "<nama bagian CV, misal: Summary/Profil, Pengalaman Kerja, Pendidikan, Skills, dll>",
      "currentContent": "<kutipan singkat isi bagian tersebut dari CV>",
      "issues": ["<masalah yang ditemukan pada bagian ini>"],
      "suggestions": ["<saran perbaikan spesifik untuk bagian ini>"],
      "improvedExample": "<contoh perbaikan yang bisa langsung diterapkan>"
    }
  ],
  "missingSections": ["<bagian penting yang seharusnya ada di CV tapi tidak ditemukan>"],
  "keywordOptimization": {
    "missingKeywords": ["<keyword penting dari JD yang tidak ada di CV>"],
    "suggestedAdditions": ["<saran di mana dan bagaimana menambahkan keyword tersebut>"]
  },
  "formatTips": ["<saran format dan tata letak CV>"]
}

Panduan:
- sectionName: Identifikasi bagian-bagian CV yang ada (Summary, Experience, Education, Skills, dll)
- currentContent: Kutip teks asli dari bagian tersebut (ringkas)
- issues: Masalah spesifik yang ditemukan (terlalu umum, tidak kuantitatif, tidak relevan, dll)
- suggestions: Saran perbaikan yang konkret dan bisa langsung diterapkan
- improvedExample: Contoh teks perbaikan yang lebih baik (tulisan langsung yang bisa copy-paste)
- missingSections: Bagian yang penting untuk JD tapi tidak ada di CV
- keywordOptimization: Keyword dari JD yang perlu ditambahkan ke CV
- formatTips: Tips format, struktur, dan tata letak

Gunakan bahasa Indonesia yang natural dan profesional. Berikan contoh perbaikan yang konkret, bukan sekadar saran umum."""


def get_cv_improvements(cv_text: str, job_description: str) -> dict:
    """Menghasilkan insight perbaikan langsung untuk CV berdasarkan job description.

    Menganalisa CV bagian per bagian dan memberikan saran spesifik yang
    bisa langsung diterapkan, termasuk contoh teks perbaikan.

    Args:
        cv_text: Teks CV yang sudah diekstrak dari file.
        job_description: Deskripsi pekerjaan yang di-apply.

    Returns:
        Dict dengan keys: overallFeedback, sections, missingSections,
        keywordOptimization, formatTips.
    """
    user_prompt = f"""Berikut adalah CV kandidat:

---
{cv_text}
---

Berikut adalah Job Description yang di-apply:

---
{job_description}
---

Berikan insight perbaikan langsung untuk CV ini agar lebih cocok dengan job description di atas. Analisa setiap bagian CV dan berikan saran spesifik beserta contoh perbaikan yang bisa langsung diterapkan."""

    response = client.chat.completions.create(
        model=ARK_MODEL_ID,
        messages=[
            {"role": "system", "content": CV_IMPROVEMENT_SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.3,
        max_tokens=8192,
    )

    raw_content = response.choices[0].message.content.strip()

    # Bersihkan code block markdown jika ada
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
    """Coba parse JSON dari teks yang mungkin mengandung karakter non-JSON.

    Mencari kurung kurawal pembuka dan penutup pertama/terakhir,
    lalu mencoba parse substring tersebut. Jika tetap gagal,
    mengembalikan fallback result.

    Args:
        text: Teks mentah dari respons LLM.

    Returns:
        Dict hasil parse JSON, atau fallback result dengan matchScore 0.
    """
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
