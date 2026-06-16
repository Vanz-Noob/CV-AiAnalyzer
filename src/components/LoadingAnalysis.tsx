/**
 * LoadingAnalysis — Animasi loading saat AI menganalisa CV.
 * Menampilkan progress bar, ikon animasi, dan pesan bergantian
 * untuk memberikan feedback visual selama proses analisa.
 */
import React from "react";
import { Brain, Sparkles } from "lucide-react";

/** Pesan yang ditampilkan bergantian selama loading */
const LOADING_MESSAGES = [
  "Membaca CV Anda...",
  "Menganalisa deskripsi pekerjaan...",
  "Mencocokkan skill dan kualifikasi...",
  "Menghitung skor kecocokan...",
  "Menyusun rekomendasi...",
  "Hampir selesai...",
];

export default function LoadingAnalysis() {
  const [messageIndex, setMessageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-14 sm:py-18 animate-fade-in">
      <div className="relative mb-10">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30 animate-float">
          <Brain className="w-12 h-12 sm:w-14 sm:h-14 text-white" />
        </div>
        <div className="absolute -top-2 -right-2">
          <Sparkles className="w-6 h-6 text-warning-500 animate-pulse-slow" />
        </div>
      </div>

      <div className="w-64 sm:w-80 h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-loading-bar" />
      </div>

      <p className="text-base sm:text-lg font-semibold text-gray-700 dark:text-slate-300 text-center animate-fade-in" key={messageIndex}>
        {LOADING_MESSAGES[messageIndex]}
      </p>
      <p className="text-sm text-gray-400 dark:text-slate-500 mt-2 text-center">AI sedang menganalisa kecocokan CV Anda</p>
    </div>
  );
}
