import React from "react";
import { Brain, Sparkles } from "lucide-react";

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
    <div className="flex flex-col items-center justify-center py-12 lg:py-16 animate-fade-in">
      <div className="relative mb-8">
        <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center shadow-lg shadow-accent-500/30">
          <Brain className="w-10 h-10 lg:w-12 lg:h-12 text-white" />
        </div>
        <div className="absolute -top-1.5 -right-1.5">
          <Sparkles className="w-5 h-5 text-warning-500 animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 w-20 h-20 lg:w-24 lg:h-24 rounded-3xl border-2 border-accent-300 animate-pulse-slow" />
      </div>

      <div className="w-48 lg:w-60 h-2 bg-primary-100 rounded-full overflow-hidden mb-6">
        <div className="h-full bg-accent-500 rounded-full animate-loading-bar" />
      </div>

      <p className="text-sm font-semibold text-primary-700 animate-fade-in text-center px-4" key={messageIndex}>
        {LOADING_MESSAGES[messageIndex]}
      </p>
      <p className="text-xs text-primary-400 mt-2 text-center px-4">AI sedang menganalisa kecocokan CV Anda</p>
    </div>
  );
}
