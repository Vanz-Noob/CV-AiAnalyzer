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
    if (score >= 80) return { stroke: "#22c55e", bg: "bg-success-50", text: "text-success-600" };
    if (score >= 60) return { stroke: "#f59e0b", bg: "bg-warning-50", text: "text-warning-600" };
    return { stroke: "#ef4444", bg: "bg-danger-50", text: "text-danger-600" };
  };

  const color = getColor();

  return (
    <div className="flex flex-col items-center gap-2 sm:gap-3 lg:gap-4">
      <div className="relative w-28 h-28 sm:w-36 sm:h-36 lg:w-44 lg:h-44 2xl:w-52 2xl:h-52 3xl:w-60 3xl:h-60">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
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
          <span className={`text-2xl sm:text-3xl lg:text-4xl 2xl:text-5xl 3xl:text-6xl font-extrabold ${color.text}`}>{score}</span>
          <span className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-400 font-medium">dari 100</span>
        </div>
      </div>
      <div className={`${color.bg} px-3 sm:px-4 lg:px-5 2xl:px-6 py-1 sm:py-1.5 lg:py-2 2xl:py-2.5 rounded-full`}>
        <span className={`text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-bold ${color.text}`}>
          {score >= 80 ? "Sangat Cocok" : score >= 60 ? "Cukup Cocok" : "Kurang Cocok"}
        </span>
      </div>
    </div>
  );
}

function SkillTag({ skill, type }: { skill: string; type: "matched" | "missing" | "partial" }) {
  const styles = {
    matched: "bg-success-50 text-success-600 border-success-500/20",
    missing: "bg-danger-50 text-danger-600 border-danger-500/20",
    partial: "bg-warning-50 text-warning-600 border-warning-500/20",
  };

  const icons = {
    matched: <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />,
    missing: <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />,
    partial: <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5" />,
  };

  return (
    <span className={`inline-flex items-center gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 lg:px-4 2xl:px-5 py-1 sm:py-1.5 lg:py-2 2xl:py-2.5 rounded-full text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-semibold border ${styles[type]}`}>
      {icons[type]}
      {skill}
    </span>
  );
}

export default function AnalysisResult({ data, onReset }: AnalysisResultProps) {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8 2xl:space-y-10 animate-slide-up">
      <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 2xl:p-10 3xl:p-14 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 lg:gap-8 2xl:gap-10 3xl:gap-14">
          <ScoreRing score={data.matchScore} />
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg lg:text-xl 2xl:text-2xl 3xl:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 lg:mb-3">Hasil Analisa</h3>
            <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg 3xl:text-xl text-gray-600 leading-relaxed">{data.summary}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 2xl:p-10 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-5">
            <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-600 flex-shrink-0" />
            <h4 className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold text-gray-900">Kecocokan Skill</h4>
          </div>
          <div className="space-y-3 sm:space-y-4 lg:space-y-5">
            {data.matchedSkills.length > 0 && (
              <div>
                <p className="text-[9px] sm:text-[10px] lg:text-xs 2xl:text-sm font-semibold text-success-600 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-3">
                  Skill Cocok ({data.matchedSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-2.5 2xl:gap-3">
                  {data.matchedSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="matched" />
                  ))}
                </div>
              </div>
            )}
            {data.partialSkills.length > 0 && (
              <div>
                <p className="text-[9px] sm:text-[10px] lg:text-xs 2xl:text-sm font-semibold text-warning-600 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-3">
                  Sebagian Cocok ({data.partialSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-2.5 2xl:gap-3">
                  {data.partialSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="partial" />
                  ))}
                </div>
              </div>
            )}
            {data.missingSkills.length > 0 && (
              <div>
                <p className="text-[9px] sm:text-[10px] lg:text-xs 2xl:text-sm font-semibold text-danger-600 uppercase tracking-wider mb-1.5 sm:mb-2 lg:mb-3">
                  Skill Kurang ({data.missingSkills.length})
                </p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 lg:gap-2.5 2xl:gap-3">
                  {data.missingSkills.map((s) => (
                    <SkillTag key={s} skill={s} type="missing" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 2xl:p-10 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-5">
            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-600 flex-shrink-0" />
            <h4 className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold text-gray-900">Kelebihan CV</h4>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 2xl:space-y-4">
            {data.strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 2xl:gap-4">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-success-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5 2xl:gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 2xl:p-10 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-5">
            <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-warning-600 flex-shrink-0" />
            <h4 className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold text-gray-900">Area Perbaikan</h4>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 2xl:space-y-4">
            {data.improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 2xl:gap-4">
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-warning-500 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl lg:rounded-3xl border border-gray-200/60 p-4 sm:p-6 lg:p-8 2xl:p-10 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-5">
            <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-600 flex-shrink-0" />
            <h4 className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold text-gray-900">Rekomendasi</h4>
          </div>
          <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 2xl:space-y-4">
            {data.recommendations.map((item, i) => (
              <li key={i} className="flex items-start gap-2 sm:gap-2.5 lg:gap-3 2xl:gap-4">
                <Lightbulb className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm lg:text-base 2xl:text-lg text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-center pt-2 sm:pt-4 lg:pt-6 2xl:pt-8">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 lg:gap-3 2xl:gap-4 px-5 sm:px-6 lg:px-8 2xl:px-10 3xl:px-12 py-2.5 sm:py-3 lg:py-4 2xl:py-5 rounded-lg sm:rounded-xl lg:rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs sm:text-sm lg:text-base 2xl:text-lg 3xl:text-xl font-semibold transition-all duration-200 hover:shadow-md"
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" />
          Analisa CV Lain
        </button>
      </div>
    </div>
  );
}
