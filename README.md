# CV Analyzer

Aplikasi web untuk menganalisa kecocokan CV dengan deskripsi pekerjaan menggunakan AI. Dibangun dengan React + FastAPI, didukung oleh BytePlus Seed 1.8 LLM.

## Fitur

- Upload CV dalam format PDF, DOC, atau DOCX (drag & drop)
- Input job description secara manual atau dari template
- Analisa AI dengan skor kecocokan 0-100
- Pencocokan skill (cocok, sebagian cocok, kurang)
- Identifikasi kelebihan CV & area perbaikan
- Rekomendasi konkret untuk meningkatkan peluang
- UI responsif untuk mobile (iPhone, Samsung) hingga desktop FHD, 2K, dan 4K

## Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | FastAPI, Python 3.14, PyMuPDF, python-docx |
| LLM | BytePlus Seed 1.8 (via Ark API, OpenAI-compatible) |
| Icons | Lucide React |

## Struktur Project

```
rnd-cv-analyzer/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── public/
│   └── vite.svg                      # Favicon
├── src/
│   ├── main.tsx                      # Entry point
│   ├── App.tsx                       # Halaman utama + state management
│   ├── index.css                     # Tailwind + custom animations + breakpoints
│   ├── vite-env.d.ts
│   └── components/
│       ├── Header.tsx                # Header + branding
│       ├── StepIndicator.tsx         # Step progress bar (1-2-3-4)
│       ├── CvUpload.tsx             # Upload CV dengan drag & drop
│       ├── JobDescriptionInput.tsx   # Input job description + template
│       ├── LoadingAnalysis.tsx       # Loading animation saat analisa
│       └── AnalysisResult.tsx        # Hasil analisa (score ring, skills, dll)
├── backend/
│   ├── main.py                       # FastAPI app + endpoints
│   ├── extractor.py                  # Ekstrak teks dari PDF/DOCX
│   ├── llm_service.py               # Integrasi BytePlus Seed 1.8
│   ├── arkclaw_service.py           # Integrasi ArkClaw Webhook (opsional)
│   ├── requirements.txt
│   ├── .env.example                  # Template konfigurasi
│   └── .gitignore
├── .gitignore
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- BytePlus Ark API Key (dari [ModelArk Console](https://console.byteplus.com/ark))

### 1. Clone & Install Frontend

```bash
git clone https://github.com/<username>/rnd-cv-analyzer.git
cd rnd-cv-analyzer
npm install
```

### 2. Setup Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows
pip install -r requirements.txt
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
```

Edit `backend/.env` dan masukkan API key Anda:

```env
ARK_API_KEY=your_ark_api_key_here
ARK_MODEL_ID=seed-1-8-251228
ARK_BASE_URL=https://ark.ap-southeast.bytepluses.com/api/v3
```

### 4. Jalankan Aplikasi

**Terminal 1 — Backend:**

```bash
cd backend
source .venv/bin/activate
python main.py
# → http://localhost:8000
```

**Terminal 2 — Frontend:**

```bash
npm run dev
# → http://localhost:5173
```

Buka `http://localhost:5173` di browser.

## API Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/api/analyze` | Analisa CV via Seed 1.8 |
| `POST` | `/api/analyze/arkclaw` | Analisa CV via ArkClaw Agent (opsional) |

### POST /api/analyze

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `cv_file` | File | Yes | CV file (PDF/DOC/DOCX, maks 10MB) |
| `job_description` | string | Yes | Job description (min 20 karakter) |

**Response:**

```json
{
  "matchScore": 72,
  "summary": "CV Anda memiliki kecocokan yang cukup baik...",
  "matchedSkills": ["React", "TypeScript", "REST API"],
  "missingSkills": ["GraphQL", "AWS"],
  "partialSkills": ["CI/CD Pipeline"],
  "strengths": ["Pengalaman solid 3+ tahun"],
  "improvements": ["Perlu mendalami GraphQL"],
  "recommendations": ["Ambil kursus online tentang GraphQL"]
}
```

**Error Response:**

| Status | Kondisi |
|---|---|
| `400` | Format file tidak didukung, file terlalu besar, atau job description terlalu singkat |
| `422` | Gagal mengekstrak teks dari file (file rusak atau hanya berisi gambar) |
| `502` | Gagal menghubungi LLM atau ArkClaw |

## User Flow

```
1. Upload CV ──→ 2. Job Description ──→ 3. AI Analisa ──→ 4. Hasil
   (drag & drop)    (paste/text)         (loading)         (score + skills)
```

Step 1: User upload CV (drag & drop atau klik). Format didukung: PDF, DOC, DOCX (maks 10MB).

Step 2: User memasukkan job description. Tersedia template contoh untuk mempercepat input.

Step 3: Backend mengekstrak teks dari CV, lalu mengirim ke BytePlus Seed 1.8 untuk dianalisa.

Step 4: Hasil analisa ditampilkan berupa skor kecocokan, skill matching, kelebihan, area perbaikan, dan rekomendasi.

## ArkClaw Integration (Opsional)

Aplikasi juga mendukung analisa via [ArkClaw](https://docs.byteplus.com/api/docs/ArkClaw/What_is_ArkClaw) AI Agent. Endpoint `/api/analyze/arkclaw` sudah tersedia di backend.

### Setup ArkClaw

1. Subscribe [ModelArk Coding Plan Pro](https://www.byteplus.com/en/activity/codingplan)
2. Buat ArkClaw instance di [ModelArk Console](https://console.byteplus.com/ark/region:ark+ap-southeast-1/experience)
3. Install [Custom Webhook Plugin](https://www.npmjs.com/package/openclaw-custom-webhook):

```bash
npx openclaw-custom-webhook install
npx openclaw-custom-webhook setup
```

4. Tambahkan konfigurasi ke `backend/.env`:

```env
ARKCLAW_WEBHOOK_URL=http://localhost:18789/api/plugins/custom-webhook/webhook
ARKCLAW_RECEIVE_SECRET=your_secret_here
ARKCLAW_TIMEOUT=120
```

## Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Jalankan frontend dev server |
| `npm run build` | Build frontend untuk production |
| `npm run preview` | Preview build production |
| `cd backend && python main.py` | Jalankan backend server |

## Responsivitas

Aplikasi mendukung breakpoint berikut:

| Breakpoint | Min-width | Target |
|---|---|---|
| Default | 0px | iPhone SE, small phones |
| `sm` | 640px | iPhone 14/15, Galaxy S |
| `lg` | 1024px | iPad, FHD (1920×1080) |
| `2xl` | 1536px | 2K/QHD (2560×1440) |
| `3xl` | 1920px | 4K/UHD (3840×2160) |

## Environment Variables

| Variable | Default | Deskripsi |
|---|---|---|
| `ARK_API_KEY` | — | BytePlus Ark API key (wajib) |
| `ARK_MODEL_ID` | `seed-1-8-251228` | Model LLM yang digunakan |
| `ARK_BASE_URL` | `https://ark.ap-southeast.bytepluses.com/api/v3` | Ark API base URL |
| `ARKCLAW_WEBHOOK_URL` | — | ArkClaw webhook URL (opsional) |
| `ARKCLAW_RECEIVE_SECRET` | — | ArkClaw webhook auth token (opsional) |
| `ARKCLAW_TIMEOUT` | `120` | Timeout request ke ArkClaw dalam detik |

## Lisensi

RnD Renaldi Azhar 2026
