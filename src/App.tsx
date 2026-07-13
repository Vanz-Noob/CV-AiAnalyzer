import { useState, useCallback } from "react";
import Header from "./components/Header";
import StepIndicator from "./components/StepIndicator";
import CvUpload from "./components/CvUpload";
import JobDescriptionInput from "./components/JobDescriptionInput";
import LoadingAnalysis from "./components/LoadingAnalysis";
import AnalysisResult, { type AnalysisData } from "./components/AnalysisResult";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

const API_URL = "/api/analyze";

const STEPS = [
  { label: "Upload CV", description: "Upload CV Anda" },
  { label: "Job Desc", description: "Masukkan deskripsi pekerjaan" },
  { label: "Analisa", description: "AI menganalisa" },
  { label: "Hasil", description: "Lihat hasil analisa" },
];

export default function App() {
  const [step, setStep] = useState(1);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return (
    <div className="min-h-screen min-h-dvh flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary-900 tracking-tight">
            {step === 4 ? "Hasil Analisa CV" : "Analisa Kecocokan CV Anda"}
          </h2>
          <p className="text-sm text-primary-500 mt-2 max-w-lg mx-auto leading-relaxed">
            {step === 4
              ? "Berikut hasil analisa kecocokan CV Anda dengan posisi yang di-apply"
              : "Upload CV dan deskripsi pekerjaan, AI kami akan menganalisa kecocokannya"}
          </p>
        </div>

        {step < 4 && <StepIndicator currentStep={step} steps={STEPS} />}

        {step < 4 && (
          <div className="bento p-5 sm:p-6 lg:p-8">
            {step === 1 && <CvUpload onFileSelect={setCvFile} selectedFile={cvFile} />}

            {step === 2 && (
              <>
                <JobDescriptionInput value={jobDesc} onChange={setJobDesc} />
                {error && (
                  <div className="mt-4 p-4 rounded-lg bg-danger-50 border border-danger-500/20 animate-fade-in">
                    <p className="text-sm text-danger-600 font-medium">{error}</p>
                  </div>
                )}
              </>
            )}

            {step === 3 && <LoadingAnalysis />}
          </div>
        )}

        {step === 4 && result && <AnalysisResult data={result} onReset={handleReset} />}

        {step < 3 && (
          <div className="flex items-center justify-between mt-5 gap-3">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="btn-ghost inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                canProceed ? "btn-accent" : "bg-primary-100 text-primary-400 cursor-not-allowed"
              }`}
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Mulai Analisa
                </>
              ) : (
                <>
                  Lanjutkan
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="text-center py-5 text-xs text-primary-400">
        RnD Renaldi Azhar 2026
      </footer>
    </div>
  );
}
