/**
 * CvInsight — Menampilkan insight perbaikan langsung untuk CV.
 * Menganalisa CV bagian per bagian dan memberikan saran spesifik
 * beserta contoh perbaikan yang bisa langsung diterapkan.
 */
import { useState } from "react";
import {
  FileEdit,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Lightbulb,
  Search,
  Layout,
  Copy,
  Check,
  Loader2,
  Plus,
} from "lucide-react";

/** Data satu bagian CV yang dianalisa */
export interface CvSectionInsight {
  /** Nama bagian CV */
  sectionName: string;
  /** Kutipan isi bagian dari CV */
  currentContent: string;
  /** Masalah yang ditemukan */
  issues: string[];
  /** Saran perbaikan spesifik */
  suggestions: string[];
  /** Contoh perbaikan yang bisa langsung diterapkan */
  improvedExample: string;
}

/** Data optimasi keyword */
export interface KeywordOptimization {
  /** Keyword penting dari JD yang tidak ada di CV */
  missingKeywords: string[];
  /** Saran di mana dan bagaimana menambahkan keyword */
  suggestedAdditions: string[];
}

/** Struktur data insight CV dari backend */
export interface CvInsightData {
  /** Feedback keseluruhan tentang kualitas CV */
  overallFeedback: string;
  /** Insight per bagian CV */
  sections: CvSectionInsight[];
  /** Bagian penting yang seharusnya ada tapi tidak ditemukan */
  missingSections: string[];
  /** Optimasi keyword */
  keywordOptimization: KeywordOptimization;
  /** Tips format dan tata letak */
  formatTips: string[];
}

/** Props untuk CvInsight */
interface CvInsightProps {
  /** Data insight CV dari backend */
  data: CvInsightData;
}

/** Kartu satu bagian CV yang bisa di-expand/collapse */
function SectionCard({ section, index }: { section: CvSectionInsight; index: number }) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(section.improvedExample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border border-gray-100 dark:border-slate-700/50 rounded-xl overflow-hidden animate-fade-in">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4.5 hover:bg-gray-50/50 dark:hover:bg-slate-700/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <FileEdit className="w-4.5 h-4.5 text-primary-600 dark:text-primary-400" />
          </div>
          <span className="text-base font-semibold text-gray-900 dark:text-white truncate">{section.sectionName}</span>
          {section.issues.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 text-xs font-semibold flex-shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
              {section.issues.length}
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400 dark:text-slate-500" /> : <ChevronDown className="w-5 h-5 text-gray-400 dark:text-slate-500" />}
      </button>

      {isOpen && (
        <div className="px-4.5 pb-4.5 space-y-4 animate-fade-in">
          {section.currentContent && (
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-700/30 border border-gray-100 dark:border-slate-600/50">
              <p className="text-xs font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">Isi saat ini</p>
              <p className="text-sm text-gray-500 dark:text-slate-400 italic leading-relaxed">"{section.currentContent}"</p>
            </div>
          )}

          {section.issues.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-danger-600 uppercase tracking-wider mb-2.5">Masalah</p>
              <ul className="space-y-2">
                {section.issues.map((issue, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-danger-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-slate-300">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider mb-2.5">Saran Perbaikan</p>
              <ul className="space-y-2">
                {section.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Lightbulb className="w-4.5 h-4.5 text-primary-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600 dark:text-slate-300">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.improvedExample && (
            <div className="p-4 rounded-lg bg-success-50/60 dark:bg-success-900/20 border border-success-200/60 dark:border-success-800/40">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-semibold text-success-600 dark:text-success-400 uppercase tracking-wider">Contoh Perbaikan</p>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success-500/10 hover:bg-success-500/20 dark:hover:bg-success-500/30 text-success-600 dark:text-success-400 text-xs font-semibold transition-colors"
                  title="Salin contoh"
                >
                  {copied ? (
                    <><Check className="w-4 h-4" /> Tersalin</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Salin</>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{section.improvedExample}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CvInsight({ data }: CvInsightProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Overall feedback */}
      <div className="p-7 rounded-xl bg-primary-50/50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/40">
        <p className="text-base text-gray-600 dark:text-slate-300 leading-relaxed">{data.overallFeedback}</p>
      </div>

      {/* Section-by-section */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider px-1">Analisa Per Bagian</h4>
        {data.sections.map((section, index) => (
          <SectionCard key={index} section={section} index={index} />
        ))}
      </div>

      {/* Missing sections */}
      {data.missingSections && data.missingSections.length > 0 && (
        <div className="p-7 rounded-xl bg-warning-50/60 dark:bg-warning-900/20 border border-warning-200/60 dark:border-warning-800/40 animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <Plus className="w-5 h-5 text-warning-600 dark:text-warning-400 flex-shrink-0" />
            <h4 className="text-sm font-bold text-warning-700 dark:text-warning-400">Bagian yang Perlu Ditambahkan</h4>
          </div>
          <ul className="space-y-2.5">
            {data.missingSections.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-warning-400 flex-shrink-0 mt-2" />
                <span className="text-sm text-gray-600 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword & Format */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {data.keywordOptimization && (
          <div className="p-7 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Optimasi Keyword</h4>
            </div>

            {data.keywordOptimization.missingKeywords && data.keywordOptimization.missingKeywords.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-danger-600 uppercase tracking-wider mb-2.5">Keyword yang Kurang</p>
                <div className="flex flex-wrap gap-2.5">
                  {data.keywordOptimization.missingKeywords.map((kw, i) => (
                    <span key={i} className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 text-sm font-semibold border border-danger-200 dark:border-danger-800/40">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.keywordOptimization.suggestedAdditions && data.keywordOptimization.suggestedAdditions.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-primary-600 uppercase tracking-wider mb-2.5">Saran Penambahan</p>
                <ul className="space-y-2.5">
                  {data.keywordOptimization.suggestedAdditions.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Lightbulb className="w-4.5 h-4.5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600 dark:text-slate-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {data.formatTips && data.formatTips.length > 0 && (
          <div className="p-7 rounded-xl bg-white dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700/50 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <Layout className="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">Tips Format & Tata Letak</h4>
            </div>
            <ul className="space-y-3">
              {data.formatTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <Layout className="w-4.5 h-4.5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-600 dark:text-slate-300">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** Komponen loading untuk insight CV */
export function CvInsightLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin mb-4" />
      <p className="text-base font-semibold text-gray-600 dark:text-slate-300 mb-1">Menganalisa perbaikan CV Anda...</p>
      <p className="text-sm text-gray-400 dark:text-slate-500">AI sedang memberikan insight per bagian CV</p>
    </div>
  );
}
