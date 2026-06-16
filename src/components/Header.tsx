/**
 * Header — Header aplikasi dengan branding, badge AI-Powered, dan toggle dark mode.
 * Sticky di bagian atas dengan backdrop blur.
 */
import { FileSearch, Moon, Sun } from "lucide-react";

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export default function Header({ isDark, onToggleDark }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-gray-100 dark:border-slate-700/50">
      <div className="max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mx-auto px-8 sm:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-md shadow-primary-500/20">
            <FileSearch className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">CV Analyzer</h1>
            <p className="text-xs text-gray-400 dark:text-slate-400 font-medium hidden sm:block">Analisa kecocokan CV & Pekerjaan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDark}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700/50 transition-colors"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse-slow" />
            AI-Powered
          </span>
        </div>
      </div>
    </header>
  );
}
