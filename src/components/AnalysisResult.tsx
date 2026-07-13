import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

export interface AnalysisData {
  matchScore: number;
  summary: string;
  matchedSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

interface AnalysisResultProps {
  data: AnalysisData;
  onReset: () => void;
}

function ScoreRing({ score }: { score: number }) {
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: "#059669", bg: "bg-accent-50", text: "text-accent-600" };
    if (score >= 60) return { stroke: "#f59e0b", bg: "bg-warning-50", text: "text-warning-600" };
    return { stroke: "#ef4444", bg: "bg-danger-50", text: "text-danger-600" };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-28 h-28 lg:w-36 lg:h-36">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="8" />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl lg:text-4xl font-extrabold ${color.text}`}>{score}</span>
          <span className="text-xs text-primary-400 font-medium">dari 100</span>
        </div>
      </div>
      <div className={`${color.bg} px-4 py-1.5 rounded-full`}>
        <span className={`text-sm font-bold ${color.text}`}>
          {score >= 80 ? "Sangat Cocok" : score >= 60 ? "Cukup Cocok" : "Kurang Cocok"}
        </span>
      </div>
    </div>
  );
}

function SkillTag({ skill, type }: { skill: string; type: "matched" | "missing" | "partial" }) {
  const styles = {
    matched: "bg-accent-50 text-accent-600 border-accent-500/20",
    missing: "bg-danger-50 text-danger-600 border-danger-500/20",
    partial: "bg-warning-50 text-warning-600 border-warning-500/20",
  };

  const icons = {
    matched: <CheckCircle2 className="w-3 h-3" />,
    missing: <XCircle className="w-3 h-3" />,
    partial: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${styles[type]}`}>
      {icons[type]}
      {skill}
    </span>
  );
}

export default function AnalysisResult({ data, onReset }: AnalysisResultProps) {
  return (
    <div className="animate-slide-up">
      {/* Bento Grid: 3 columns on desktop, asymmetric layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Hero: Score + Summary (full width) */}
        <div className="bento bento-hover p-5 lg:p-6 lg:col-span-3">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <ScoreRing score={data.matchScore} />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-lg font-bold text-primary-900 mb-2">Hasil Analisa</h3>
              <p className="text-sm text-primary-600 leading-relaxed">{data.summary}</p>
            </div>
          </div>
        </div>

        {/* Skill Match (col-span-2) */}
        <div className="bento bento-hover p-5 lg:p-6 lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-accent-600" />
            <h4 className="text-sm font-bold text-primary-900">Kecocokan Skill</h4>
          </div>
          <div className="space-y-4">
            {data.matchedSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-accent-600 uppercase tracking-wider mb-2">
                  Skill Cocok ({data.matchedSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.matchedSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="matched" />
                  ))}
                </div>
              </div>
            )}
            {data.partialSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-warning-600 uppercase tracking-wider mb-2">
                  Sebagian Cocok ({data.partialSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.partialSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="partial" />
                  ))}
                </div>
              </div>
            )}
            {data.missingSkills.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-danger-600 uppercase tracking-wider mb-2">
                  Skill Kurang ({data.missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.missingSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="missing" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Strengths (col-span-1) */}
        <div className="bento bento-hover p-5 lg:p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent-600" />
            <h4 className="text-sm font-bold text-primary-900">Kelebihan CV</h4>
          </div>
          <ul className="space-y-3">
            {data.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements (col-span-1) */}
        <div className="bento bento-hover p-5 lg:p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-warning-600" />
            <h4 className="text-sm font-bold text-primary-900">Area Perbaikan</h4>
          </div>
          <ul className="space-y-3">
            {data.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <ArrowRight className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations (col-span-2) */}
        <div className="bento bento-hover p-5 lg:p-6 lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-accent-600" />
            <h4 className="text-sm font-bold text-primary-900">Rekomendasi</h4>
          </div>
          <ul className="space-y-3">
            {data.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-accent-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary-100 hover:bg-primary-200 text-primary-700 text-sm font-semibold transition-all duration-200"
        >
          <RotateCcw className="w-4 h-4" />
          Analisa CV Lain
        </button>
      </div>
    </div>
  );
}
