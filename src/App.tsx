/**
 * App — Komponen utama CV Analyzer.
 *
 * Mengelola flow 4 langkah: Upload CV → Job Description → Analisa → Hasil.
 * State management dilakukan di sini dan diteruskan ke komponen anak.
 * API call ke backend dilakukan via fetch ke /api/analyze (diproxy oleh Vite).
 */
import { useState, useCallback } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import CvUpload from "./components/CvUpload";
import JobDescriptionInput from "./components/JobDescriptionInput";
import LoadingAnalysis from "./components/LoadingAnalysis";
import AnalysisResult, { type AnalysisData } from "./components/AnalysisResult";
import { type CvInsightData } from "./components/CvInsight";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { useDarkMode } from "./hooks/useDarkMode";

/** Endpoint backend untuk analisa CV (di-proxy oleh Vite ke localhost:8000) */
const API_URL = "/api/analyze";
/** Endpoint backend untuk insight perbaikan CV */
const INSIGHT_API_URL = "/api/cv-insight";

/** Definisi langkah-langkah dalam flow aplikasi */
const STEPS = [
  { label: "Upload CV", description: "Upload CV Anda" },
  { label: "Job Desc", description: "Masukkan deskripsi pekerjaan" },
  { label: "Analisa", description: "AI menganalisa" },
  { label: "Hasil", description: "Lihat hasil analisa" },
];

export default function App() {
  const { isDark, toggle: toggleDark } = useDarkMode();
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insightData, setInsightData] = useState<CvInsightData | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const canProceed = step === 1 ? cvFile !== null : step === 2 ? jobDesc.trim().length > 20 : false;

  const handleAnalyze = useCallback(async () => {
    if (!cvFile || !jobDesc.trim()) return;

    setStep(3);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("cv_file", cvFile);
      formData.append("job_description", jobDesc);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || `Gagal menganalisa CV (HTTP ${response.status})`;
        throw new Error(message);
      }

      const data: AnalysisData = await response.json();
      setResult(data);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan yang tidak diketahui");
      setStep(2);
    }
  }, [cvFile, jobDesc]);

  const handleRequestInsight = useCallback(async () => {
    if (!cvFile || !jobDesc.trim()) return;

    setInsightLoading(true);
    setInsightError(null);

    try {
      const formData = new FormData();
      formData.append("cv_file", cvFile);
      formData.append("job_description", jobDesc);

      const response = await fetch(INSIGHT_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        const message = errData?.detail || `Gagal memuat insight (HTTP ${response.status})`;
        throw new Error(message);
      }

      const data: CvInsightData = await response.json();
      setInsightData(data);
    } catch (err) {
      setInsightError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat insight");
    } finally {
      setInsightLoading(false);
    }
  }, [cvFile, jobDesc]);

  const handleNext = useCallback(() => {
    if (step === 1 && cvFile) {
      setStep(2);
    } else if (step === 2 && jobDesc.trim().length > 20) {
      handleAnalyze();
    }
  }, [step, cvFile, jobDesc, handleAnalyze]);

  const handleBack = useCallback(() => {
    if (step === 2) setStep(1);
    setError(null);
  }, [step]);

  const handleReset = useCallback(() => {
    setStep(1);
    setCvFile(null);
    setJobDesc("");
    setResult(null);
    setError(null);
    setInsightData(null);
    setInsightLoading(false);
    setInsightError(null);
  }, []);

  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center">
      <Header isDark={isDark} onToggleDark={toggleDark} />

      <main className="flex-1 w-full max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mx-auto px-8 sm:px-10 py-10 sm:py-14">
        {/* Page title */}
        {step < 4 && (
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
              Analisa Kecocokan CV Anda
            </h2>
            <p className="text-sm text-gray-400 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Upload CV dan deskripsi pekerjaan, AI kami akan menganalisa kecocokannya
            </p>
          </div>
        )}

        {step < 4 && <StepIndicator currentStep={step} steps={STEPS} />}

        {/* Main content card */}
        <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/60 dark:border-slate-700/50 shadow-sm p-8 sm:p-10">
          {step === 1 && <CvUpload onFileSelect={setCvFile} selectedFile={cvFile} />}

          {step === 2 && (
            <>
              <JobDescriptionInput value={jobDesc} onChange={setJobDesc} />
              {error && (
                <div className="mt-6 p-5 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200/60 dark:border-danger-800/40 animate-fade-in">
                  <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">{error}</p>
                </div>
              )}
            </>
          )}

          {step === 3 && <LoadingAnalysis />}

          {step === 4 && result && (
            <AnalysisResult
              data={result}
              onReset={handleReset}
              insightData={insightData}
              insightLoading={insightLoading}
              onRequestInsight={handleRequestInsight}
              insightError={insightError}
            />
          )}
        </div>

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-10 gap-8">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-3 px-8 py-5 rounded-xl text-base font-semibold text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-3.5 px-12 py-5.5 rounded-xl text-lg font-bold transition-all duration-200 ${
                canProceed
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/35 hover:-translate-y-0.5"
                  : "bg-gray-100 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-6 h-6" />
                  Mulai Analisa
                </>
              ) : (
                <>
                  Lanjutkan
                  <ArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="w-full max-w-3xl lg:max-w-4xl 2xl:max-w-5xl text-center py-10 text-xs text-gray-300 dark:text-slate-600">
        RnD Renaldi Azhar 2026
      </footer>
    </div>
  );
}
