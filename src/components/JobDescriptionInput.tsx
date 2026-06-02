import { Briefcase, Sparkles } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDERS = [
  "Contoh:\n\nPosisi: Frontend Developer\n\nPersyaratan:\n- Minimal 3 tahun pengalaman dengan React/TypeScript\n- Familiar dengan Tailwind CSS dan component libraries\n- Pengalaman dengan REST API dan GraphQL\n- Kemampuan problem-solving yang baik\n- Pengalaman dengan CI/CD pipeline\n- Bersedia bekerja hybrid",
  "Contoh:\n\nPosisi: Data Analyst\n\nPersyaratan:\n- Pengalaman dengan Python, SQL, dan Excel\n- Familiar dengan data visualization tools (Tableau/PowerBI)\n- Pemahaman statistik yang kuat\n- Pengalaman dengan machine learning adalah nilai tambah\n- Kemampuan komunikasi data yang baik",
];

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-900">Job Description</h2>
          <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-500">Tempelkan deskripsi pekerjaan yang di-apply</p>
        </div>
      </div>

      <div className="relative group">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[0]}
          rows={8}
          className="w-full rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-gray-200 bg-white/60 px-3 sm:px-4 lg:px-5 2xl:px-6 py-3 sm:py-4 lg:py-5 2xl:py-6 text-xs sm:text-sm lg:text-base 2xl:text-lg text-gray-800 placeholder:text-gray-300 placeholder:text-[10px] sm:placeholder:text-xs lg:placeholder:text-sm resize-none focus:outline-none focus:border-primary-400 focus:ring-2 sm:focus:ring-4 lg:focus:ring-6 focus:ring-primary-100 transition-all duration-200"
        />
        {value.trim().length > 0 && (
          <div className="absolute top-3 right-3 lg:top-4 lg:right-4 flex items-center gap-1.5 lg:gap-2">
            <Sparkles className="w-3.5 h-3.5 lg:w-4 lg:h-4 2xl:w-5 2xl:h-5 text-primary-400" />
            <span className="text-[10px] lg:text-xs 2xl:text-sm font-semibold text-primary-500 bg-primary-50 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full">
              {wordCount} kata
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 sm:mt-3 lg:mt-4">
        <div className="flex flex-wrap gap-2">
          {PLACEHOLDERS.map((_, index) => (
            <button
              key={index}
              onClick={() => onChange(PLACEHOLDERS[index])}
              className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-semibold text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-2.5 sm:px-3 lg:px-4 2xl:px-5 py-1 sm:py-1.5 lg:py-2 2xl:py-2.5 rounded-full transition-colors"
            >
              Contoh {index + 1}
            </button>
          ))}
        </div>
        {value.trim().length > 0 && (
          <button
            onClick={() => onChange("")}
            className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-semibold text-gray-400 hover:text-danger-500 transition-colors"
          >
            Bersihkan
          </button>
        )}
      </div>
    </div>
  );
}
