/**
 * AnalysisResult — Menampilkan hasil analisa kecocokan CV.
 * Terdiri dari ring skor, daftar skill (cocok/sebagian/kurang),
 * kelebihan CV, area perbaikan, rekomendasi, dan insight perbaikan CV.
 */
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  FileEdit,
} from "lucide-react";
import CvInsight, { type CvInsightData, CvInsightLoading } from "./CvInsight";

/** Struktur data hasil analisa dari backend */
export interface AnalysisData {
  /** Skor kecocokan 0-100 */
  matchScore: number;
  /** Ringkasan singkat kecocokan */
  summary: string;
  /** Skill yang cocok dan dimiliki kandidat */
  matchedSkills: string[];
  /** Skill yang dibutuhkan tapi tidak dimiliki */
  missingSkills: string[];
  /** Skill yang sebagian dimiliki */
  partialSkills: string[];
  /** Kelebihan kandidat */
  strengths: string[];
  /** Area yang perlu ditingkatkan */
  improvements: string[];
  /** Rekomendasi konkret */
  recommendations: string[];
}

/** Props untuk AnalysisResult */
interface AnalysisResultProps {
  /** Data hasil analisa dari backend */
  data: AnalysisData;
  /** Callback untuk reset dan mulai analisa ulang */
  onReset: () => void;
  /** Data insight perbaikan CV (null jika belum diminta) */
  insightData: CvInsightData | null;
  /** Apakah sedang loading insight */
  insightLoading: boolean;
  /** Callback untuk meminta insight perbaikan CV */
  onRequestInsight: () => void;
  /** Error saat memuat insight */
  insightError: string | null;
}

/** Ring skor sirkular dengan warna berdasarkan nilai (hijau/kuning/merah) */
function ScoreRing({ score }: { score: number }) {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: "#22c55e", bg: "bg-success-50", text: "text-success-600", label: "Sangat Cocok" };
    if (score >= 60) return { stroke: "#f59e0b", bg: "bg-warning-50", text: "text-warning-600", label: "Cukup Cocok" };
    return { stroke: "#ef4444", bg: "bg-danger-50", text: "text-danger-600", label: "Kurang Cocok" };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-44 h-44 sm:w-52 sm:h-52">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" className="dark:stroke-slate-700" strokeWidth="10" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-5xl sm:text-6xl font-extrabold ${color.text}`}>{score}</span>
          <span className="text-sm text-gray-400 dark:text-slate-500 font-medium">dari 100</span>
        </div>
      </div>
      <div className={`${color.bg} px-5 py-2 rounded-full`}>
        <span className={`text-sm font-bold ${color.text}`}>{color.label}</span>
      </div>
    </div>
  );
}

/** Tag skill dengan ikon dan warna berdasarkan tipe kecocokan */
function SkillTag({ skill, type }: { skill: string; type: "matched" | "missing" | "partial" }) {
  const styles = {
    matched: "bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 border-success-200 dark:border-success-800/40",
    missing: "bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 border-danger-200 dark:border-danger-800/40",
    partial: "bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 border-warning-200 dark:border-warning-800/40",
  };

  const icons = {
    matched: <CheckCircle2 className="w-4 h-4" />,
    missing: <XCircle className="w-4 h-4" />,
    partial: <AlertCircle className="w-4 h-4" />,
  };

  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-semibold border ${styles[type]}`}>
      {icons[type]}
      {skill}
    </span>
  );
}

/** Kartu section generik */
function SectionCard({ icon, title, children, accent = "primary" }: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  accent?: "primary" | "success" | "warning" | "danger";
}) {
  const iconBg = {
    primary: "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400",
    success: "bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400",
    warning: "bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400",
    danger: "bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400",
  };

  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-6 shadow-sm animate-fade-in">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg[accent]}`}>
          {icon}
        </div>
        <h4 className="text-base font-bold text-gray-900 dark:text-white">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export default function AnalysisResult({ data, onReset, insightData, insightLoading, onRequestInsight, insightError }: AnalysisResultProps) {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Score & Summary */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-9 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-7">
          <ScoreRing score={data.matchScore} />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Hasil Analisa</h3>
            <p className="text-base text-gray-500 dark:text-slate-400 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </div>

      {/* Skills & Strengths */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          icon={<Target className="w-5 h-5" />}
          title="Kecocokan Skill"
          accent="primary"
        >
          <div className="space-y-5">
            {data.matchedSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-success-600 uppercase tracking-wider mb-3">
                  Cocok ({data.matchedSkills.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {data.matchedSkills.map((s) => <SkillTag key={s} skill={s} type="matched" />)}
                </div>
              </div>
            )}
            {data.partialSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-warning-600 uppercase tracking-wider mb-3">
                  Sebagian Cocok ({data.partialSkills.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {data.partialSkills.map((s) => <SkillTag key={s} skill={s} type="partial" />)}
                </div>
              </div>
            )}
            {data.missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-danger-600 uppercase tracking-wider mb-3">
                  Kurang ({data.missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {data.missingSkills.map((s) => <SkillTag key={s} skill={s} type="missing" />)}
                </div>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard
          icon={<TrendingUp className="w-5 h-5" />}
          title="Kelebihan CV"
          accent="success"
        >
          <ul className="space-y-3">
            {data.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-success-500 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-600 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Improvements & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard
          icon={<AlertCircle className="w-5 h-5" />}
          title="Area Perbaikan"
          accent="warning"
        >
          <ul className="space-y-3">
            {data.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-600 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard
          icon={<Lightbulb className="w-5 h-5" />}
          title="Rekomendasi"
          accent="primary"
        >
          <ul className="space-y-3">
            {data.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-base text-gray-600 dark:text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Insight Perbaikan CV */}
      <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-gray-100 dark:border-slate-700/50 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <FileEdit className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">Insight Perbaikan CV</h4>
              {!insightData && !insightLoading && (
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">Analisa detail per bagian CV dengan contoh perbaikan</p>
              )}
            </div>
          </div>
          {!insightData && !insightLoading && (
            <button
              onClick={onRequestInsight}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-bold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
            >
              <FileEdit className="w-4.5 h-4.5" />
              Dapatkan Insight
            </button>
          )}
        </div>

        {insightLoading && <CvInsightLoading />}

        {insightError && (
          <div className="mt-4 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200/60 dark:border-danger-800/40 animate-fade-in">
            <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">{insightError}</p>
          </div>
        )}

        {insightData && <CvInsight data={insightData} />}
      </div>

      {/* Reset button */}
      <div className="flex justify-center pt-3">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-slate-300 text-base font-semibold transition-all duration-200 hover:shadow-sm"
        >
          <RotateCcw className="w-5 h-5" />
          Analisa CV Lain
        </button>
      </div>
    </div>
  );
}
