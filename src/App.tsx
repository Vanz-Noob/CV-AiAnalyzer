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

      <main className="flex-1 w-full max-w-5xl lg:max-w-6xl 2xl:max-w-7xl 3xl:container-wide mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 py-4 sm:py-8 lg:py-12 2xl:py-16 3xl:py-20">
        <div className="text-center mb-4 sm:mb-6 lg:mb-8 2xl:mb-10 3xl:mb-12">
          <h2 className="text-xl sm:text-2xl lg:text-3xl 2xl:text-4xl 3xl:text-5xl font-extrabold text-gray-900 tracking-tight px-2">
            {step === 4 ? "Hasil Analisa CV" : "Analisa Kecocokan CV Anda"}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-gray-500 mt-1.5 sm:mt-2 lg:mt-3 max-w-lg 2xl:max-w-2xl 3xl:max-w-3xl mx-auto px-4 leading-relaxed">
            {step === 4
              ? "Berikut hasil analisa kecocokan CV Anda dengan posisi yang di-apply"
              : "Upload CV dan deskripsi pekerjaan, AI kami akan menganalisa kecocokannya"}
          </p>
        </div>

        {step < 4 && <StepIndicator currentStep={step} steps={STEPS} />}

        <div className="bg-white/60 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 shadow-sm p-4 sm:p-6 lg:p-8 2xl:p-10 3xl:p-14">
          {step === 1 && <CvUpload onFileSelect={setCvFile} selectedFile={cvFile} />}

          {step === 2 && (
            <>
              <JobDescriptionInput value={jobDesc} onChange={setJobDesc} />
              {error && (
                <div className="mt-4 p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-danger-50 border border-danger-500/20 animate-fade-in">
                  <p className="text-xs sm:text-sm lg:text-base text-danger-600 font-medium">{error}</p>
                </div>
              )}
            </>
          )}

          {step === 3 && <LoadingAnalysis />}

          {step === 4 && result && <AnalysisResult data={result} onReset={handleReset} />}
        </div>

        {step < 3 && (
          <div className="flex items-center justify-between mt-4 sm:mt-6 lg:mt-8 2xl:mt-10 gap-3">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 px-4 sm:px-5 lg:px-6 2xl:px-8 py-2 sm:py-2.5 lg:py-3 2xl:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-xs sm:text-sm lg:text-base 2xl:text-lg font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
                Kembali
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed}
              className={`inline-flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 px-4 sm:px-6 lg:px-8 2xl:px-10 py-2.5 sm:py-3 lg:py-3.5 2xl:py-4 rounded-lg sm:rounded-xl lg:rounded-2xl text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold transition-all duration-200 ${
                canProceed
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              {step === 2 ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
                  Mulai Analisa
                </>
              ) : (
                <>
                  Lanjutkan
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <footer className="text-center py-4 sm:py-6 lg:py-8 2xl:py-10 text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-400">
        RnD Renaldi Azhar 2026
      </footer>
    </div>
  );
}
