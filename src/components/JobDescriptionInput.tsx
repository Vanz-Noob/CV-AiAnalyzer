/**
 * JobDescriptionInput — Input textarea untuk deskripsi pekerjaan.
 * Menyediakan template contoh, penghitung kata, dan tombol bersihkan.
 */
import { Briefcase, Sparkles, X } from "lucide-react";

/** Props untuk JobDescriptionInput */
interface JobDescriptionInputProps {
  /** Nilai teks job description */
  value: string;
  /** Callback saat nilai berubah */
  onChange: (value: string) => void;
}

/** Template contoh job description yang bisa dipilih pengguna */
const PLACEHOLDERS = [
  "Contoh:\n\nPosisi: Frontend Developer\n\nPersyaratan:\n- Minimal 3 tahun pengalaman dengan React/TypeScript\n- Familiar dengan Tailwind CSS dan component libraries\n- Pengalaman dengan REST API dan GraphQL\n- Kemampuan problem-solving yang baik\n- Pengalaman dengan CI/CD pipeline\n- Bersedia bekerja hybrid",
  "Contoh:\n\nPosisi: Data Analyst\n\nPersyaratan:\n- Pengalaman dengan Python, SQL, dan Excel\n- Familiar dengan data visualization tools (Tableau/PowerBI)\n- Pemahaman statistik yang kuat\n- Pengalaman dengan machine learning adalah nilai tambah\n- Kemampuan komunikasi data yang baik",
];

const MIN_CHARS = 20;

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const charCount = value.trim().length;
  const isValid = charCount >= MIN_CHARS;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Job Description</h2>
          <p className="text-sm text-gray-400 dark:text-slate-400">Tempelkan deskripsi pekerjaan yang di-apply</p>
        </div>
        {value.trim().length > 0 && (
          <button
            onClick={() => onChange("")}
            className="text-sm font-medium text-gray-400 dark:text-slate-400 hover:text-danger-500 transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Bersihkan
          </button>
        )}
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[0]}
          rows={10}
          className="w-full rounded-2xl border-2 border-gray-200 dark:border-slate-600 bg-white/40 dark:bg-slate-700/30 px-5 py-4 text-base text-gray-800 dark:text-slate-200 placeholder:text-gray-300 dark:placeholder:text-slate-500 placeholder:text-sm resize-none focus:outline-none focus:border-primary-400 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-50 dark:focus:ring-primary-900/30 transition-all duration-200"
        />
        {charCount > 0 && (
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-primary-400" />
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isValid ? "text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30" : "text-gray-400 dark:text-slate-500 bg-gray-50 dark:bg-slate-700/50"}`}>
              {wordCount} kata
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <div className="flex flex-wrap gap-3">
          {PLACEHOLDERS.map((_, index) => (
            <button
              key={index}
              onClick={() => onChange(PLACEHOLDERS[index])}
              className="text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 px-4 py-2 rounded-full transition-colors"
            >
              Contoh {index + 1}
            </button>
          ))}
        </div>
        {charCount > 0 && charCount < MIN_CHARS && (
          <span className="text-xs text-gray-400 dark:text-slate-500">
            Min. {MIN_CHARS} karakter ({MIN_CHARS - charCount} lagi)
          </span>
        )}
      </div>
    </div>
  );
}
