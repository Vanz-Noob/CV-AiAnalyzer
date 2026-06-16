"""
CV Analyzer API — Backend FastAPI

Menyediakan endpoint untuk menganalisa kecocokan CV dengan deskripsi pekerjaan
menggunakan BytePlus Seed LLM (via Ark API) atau ArkClaw Agent.

Endpoints:
    GET  /health              — Health check & status konfigurasi
    POST /api/analyze         — Analisa CV via Seed LLM (OpenAI-compatible)
    POST /api/analyze/arkclaw — Analisa CV via ArkClaw Agent (opsional)
"""

import os

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from extractor import extract_cv_text
from llm_service import analyze_cv, get_cv_improvements
from arkclaw_service import analyze_cv_via_arkclaw

app = FastAPI(
    title="CV Analyzer API",
    description="Backend API untuk analisa kecocokan CV dengan job description menggunakan BytePlus Seed 1.8",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


@app.get("/health")
async def health_check():
    """Mengembalikan status API dan konfigurasi model yang aktif."""
    return {
        "status": "ok",
        "model": os.getenv("ARK_MODEL_ID", "seed-2-0-pro-260328"),
        "arkclaw_enabled": bool(os.getenv("ARKCLAW_WEBHOOK_URL")),
    }


@app.post("/api/analyze")
async def analyze_cv_endpoint(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Analisa kecocokan CV dengan job description menggunakan BytePlus Seed LLM.

    Args:
        cv_file: File CV dalam format PDF, DOC, atau DOCX (maks 10MB).
        job_description: Deskripsi pekerjaan yang di-apply (min 20 karakter).

    Returns:
        Dict berisi matchScore, summary, matchedSkills, missingSkills,
        partialSkills, strengths, improvements, dan recommendations.

    Raises:
        HTTPException 400: Format file tidak didukung, file kosong, atau job description invalid.
        HTTPException 422: Gagal mengekstrak teks dari file.
        HTTPException 502: Gagal menganalisa CV (error dari LLM).
    """
    if not cv_file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    ext = cv_file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung: .{ext}. Gunakan PDF, DOC, atau DOCX.",
        )

    content = await cv_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file terlalu besar. Maksimal {MAX_FILE_SIZE // (1024*1024)}MB.",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File kosong.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description tidak boleh kosong.")

    if len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description terlalu singkat. Minimal 20 karakter.",
        )

    try:
        cv_text = extract_cv_text(content, cv_file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=422,
            detail="Gagal mengekstrak teks dari file. Pastikan file tidak rusak.",
        )

    if not cv_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Tidak dapat mengekstrak teks dari CV. File mungkin berisi hanya gambar atau kosong.",
        )

    try:
        result = analyze_cv(cv_text, job_description)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menganalisa CV: {str(e)}",
        )

    return result


@app.post("/api/analyze/arkclaw")
async def analyze_cv_arkclaw_endpoint(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Analisa kecocokan CV dengan job description menggunakan ArkClaw Agent.

    Memiliki validasi dan parameter yang sama dengan /api/analyze,
    namun menggunakan ArkClaw webhook sebagai backend AI.

    Args:
        cv_file: File CV dalam format PDF, DOC, atau DOCX (maks 10MB).
        job_description: Deskripsi pekerjaan yang di-apply (min 20 karakter).

    Returns:
        Dict berisi matchScore, summary, matchedSkills, missingSkills,
        partialSkills, strengths, improvements, dan recommendations.

    Raises:
        HTTPException 400: Format file tidak didukung, file kosong, atau job description invalid.
        HTTPException 422: Gagal mengekstrak teks dari file.
        HTTPException 502: Gagal menganalisa CV via ArkClaw.
    """
    if not cv_file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    ext = cv_file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung: .{ext}. Gunakan PDF, DOC, atau DOCX.",
        )

    content = await cv_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file terlalu besar. Maksimal {MAX_FILE_SIZE // (1024*1024)}MB.",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File kosong.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description tidak boleh kosong.")

    if len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description terlalu singkat. Minimal 20 karakter.",
        )

    try:
        cv_text = extract_cv_text(content, cv_file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=422,
            detail="Gagal mengekstrak teks dari file. Pastikan file tidak rusak.",
        )

    if not cv_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Tidak dapat mengekstrak teks dari CV. File mungkin berisi hanya gambar atau kosong.",
        )

    try:
        result = analyze_cv_via_arkclaw(cv_text, job_description)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menganalisa CV via ArkClaw: {str(e)}",
        )

    return result


@app.post("/api/cv-insight")
async def cv_insight_endpoint(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
):
    """Memberikan insight perbaikan langsung untuk CV berdasarkan job description.

    Menganalisa CV bagian per bagian dan memberikan saran spesifik
    beserta contoh perbaikan yang bisa langsung diterapkan.

    Args:
        cv_file: File CV dalam format PDF, DOC, atau DOCX (maks 10MB).
        job_description: Deskripsi pekerjaan yang di-apply (min 20 karakter).

    Returns:
        Dict berisi overallFeedback, sections, missingSections,
        keywordOptimization, dan formatTips.

    Raises:
        HTTPException 400: Format file tidak didukung, file kosong, atau job description invalid.
        HTTPException 422: Gagal mengekstrak teks dari file.
        HTTPException 502: Gagal menganalisa CV (error dari LLM).
    """
    if not cv_file.filename:
        raise HTTPException(status_code=400, detail="Filename is required")

    ext = cv_file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Format file tidak didukung: .{ext}. Gunakan PDF, DOC, atau DOCX.",
        )

    content = await cv_file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"Ukuran file terlalu besar. Maksimal {MAX_FILE_SIZE // (1024*1024)}MB.",
        )

    if len(content) == 0:
        raise HTTPException(status_code=400, detail="File kosong.")

    if not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description tidak boleh kosong.")

    if len(job_description.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job description terlalu singkat. Minimal 20 karakter.",
        )

    try:
        cv_text = extract_cv_text(content, cv_file.filename)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=422,
            detail="Gagal mengekstrak teks dari file. Pastikan file tidak rusak.",
        )

    if not cv_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Tidak dapat mengekstrak teks dari CV. File mungkin berisi hanya gambar atau kosong.",
        )

    try:
        result = get_cv_improvements(cv_text, job_description)
    except Exception as e:
        raise HTTPException(
            status_code=502,
            detail=f"Gagal menganalisa insight CV: {str(e)}",
        )

    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
