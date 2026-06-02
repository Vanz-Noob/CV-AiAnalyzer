import { FileSearch } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200/60">
      <div className="max-w-5xl lg:max-w-6xl 2xl:max-w-7xl 3xl:container-wide mx-auto px-3 sm:px-6 lg:px-8 2xl:px-12 3xl:px-16 py-3 sm:py-4 lg:py-5 2xl:py-6 flex items-center justify-between gap-2 lg:gap-4">
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 flex-shrink-0">
            <FileSearch className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 2xl:w-7 2xl:h-7 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-gray-900 tracking-tight truncate">CV Analyzer</h1>
            <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-500 font-medium hidden sm:block truncate">Analisa kecocokan CV & Pekerjaan</p>
          </div>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 flex-shrink-0">
          <span className="inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 lg:px-4 2xl:px-5 py-1 sm:py-1.5 lg:py-2 2xl:py-2.5 rounded-full bg-primary-50 text-primary-700 text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-semibold">
            <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-primary-500 animate-pulse-slow" />
            <span className="hidden sm:inline">AI-Powered</span>
            <span className="sm:hidden">AI</span>
          </span>
        </div>
      </div>
    </header>
  );
}
