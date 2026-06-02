import os

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from extractor import extract_cv_text
from llm_service import analyze_cv
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

MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {"pdf", "doc", "docx"}


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "model": os.getenv("ARK_MODEL_ID", "seed-1-8-251228"),
        "arkclaw_enabled": bool(os.getenv("ARKCLAW_WEBHOOK_URL")),
    }


@app.post("/api/analyze")
async def analyze_cv_endpoint(
    cv_file: UploadFile = File(...),
    job_description: str = Form(...),
):
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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
