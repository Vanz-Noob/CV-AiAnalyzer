import { FileSearch } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-primary-200">
      <div className="max-w-5xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-primary-900 flex items-center justify-center flex-shrink-0">
            <FileSearch className="w-5 h-5 lg:w-6 lg:h-6 text-accent-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base lg:text-xl font-bold text-primary-900 tracking-tight truncate">CV Analyzer</h1>
            <p className="text-xs text-primary-500 font-medium hidden sm:block truncate">Analisa kecocokan CV & Pekerjaan</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent-50 text-accent-700 text-xs font-semibold flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse-slow" />
          <span className="hidden sm:inline">AI-Powered</span>
          <span className="sm:hidden">AI</span>
        </span>
      </div>
    </header>
  );
}
