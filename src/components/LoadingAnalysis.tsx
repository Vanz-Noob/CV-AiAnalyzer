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
    <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 2xl:py-24 3xl:py-28 animate-fade-in">
      <div className="relative mb-6 sm:mb-8 lg:mb-10 2xl:mb-12">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 2xl:w-32 2xl:h-32 3xl:w-36 3xl:h-36 rounded-2xl sm:rounded-3xl lg:rounded-[1.5rem] bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-2xl shadow-primary-500/30">
          <Brain className="w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 3xl:w-18 3xl:h-18 text-white" />
        </div>
        <div className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 lg:-top-3 lg:-right-3">
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8 text-warning-500 animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28 2xl:w-32 2xl:h-32 3xl:w-36 3xl:h-36 rounded-2xl sm:rounded-3xl lg:rounded-[1.5rem] border-2 lg:border-[3px] border-primary-300 animate-pulse-slow" />
      </div>

      <div className="w-36 sm:w-48 lg:w-60 2xl:w-72 h-1.5 lg:h-2 2xl:h-2.5 bg-gray-100 rounded-full overflow-hidden mb-4 sm:mb-6 lg:mb-8">
        <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full animate-loading-bar" />
      </div>

      <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg 3xl:text-xl font-semibold text-gray-700 animate-fade-in text-center px-4" key={messageIndex}>
        {LOADING_MESSAGES[messageIndex]}
      </p>
      <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-400 mt-1.5 sm:mt-2 lg:mt-3 text-center px-4">AI sedang menganalisa kecocokan CV Anda</p>
    </div>
  );
}
