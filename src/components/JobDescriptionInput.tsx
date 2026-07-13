import { Briefcase, Sparkles } from "lucide-react";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
}

const PLACEHOLDERS = [
  "Contoh:\n\nPosisi: Frontend Developer\n\nPersyaratan:\n- Minimal 3 tahun pengalaman dengan React/TypeScript\n- Familiar dengan Tailwind CSS dan component libraries\n- Pengalaman dengan REST API dan GraphQL\n- Kemampuan problem-solving yang baik\n- Pengalaman dengan CI/CD pipeline\n- Bersedia bekerja hybrid",
  "Contoh:\n\nPosisi: Data Analyst\n\nPersyaratan:\n- Pengalaman dengan Python, SQL, dan Excel\n- Familiar dengan data visualization tools (Tableau/PowerBI)\n- Pemahaman statistik yang kuat\n- Pengalaman dengan machine learning adalah nilai tambah\n- Kemampuan komunikasi data yang baik",
  "Contoh:\n\nPosisi: Solution Architect\n\nPersyaratan:\n- Minimal 5 tahun pengalaman dalam software engineering atau sistem design\n- Pengalaman mendesain arsitektur sistem skala enterprise (microservices, event-driven)\n- Mahir dalam cloud platform (AWS/Azure/GCP) dan strategi multi-cloud\n- Familiar dengan containerization (Docker, Kubernetes) dan infrastructure as code (Terraform)\n- Pemahaman kuat tentang API design (REST, gRPC, GraphQL) dan message queues (Kafka, RabbitMQ)\n- Pengalaman dengan database relational dan NoSQL, serta strategi caching (Redis)\n- Kemampuan menjelaskan solusi teknis kepada stakeholder non-teknis\n- Pengalaman dalam governance, security, dan compliance (SOC2, ISO 27001)\n- Leadership skills untuk membimbing tim engineering\n- Bersedia bekerja hybrid",
];

export default function JobDescriptionInput({ value, onChange }: JobDescriptionInputProps) {
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 lg:w-5 lg:h-5 text-accent-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base lg:text-lg font-bold text-primary-900">Job Description</h2>
          <p className="text-xs text-primary-500">Tempelkan deskripsi pekerjaan yang di-apply</p>
        </div>
      </div>

      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={PLACEHOLDERS[0]}
          rows={8}
          className="w-full rounded-xl border-2 border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-900 placeholder:text-primary-300 placeholder:text-xs resize-none focus:outline-none focus:border-accent-400 focus:ring-4 focus:ring-accent-100 transition-all duration-200"
        />
        {value.trim().length > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span className="text-xs font-semibold text-accent-600 bg-accent-50 px-2 py-0.5 rounded-full">
              {wordCount} kata
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-3">
        <div className="flex flex-wrap gap-2">
          {PLACEHOLDERS.map((_, index) => (
            <button
              key={index}
              onClick={() => onChange(PLACEHOLDERS[index])}
              className="text-xs font-semibold text-accent-600 hover:text-accent-700 bg-accent-50 hover:bg-accent-100 px-3 py-1.5 rounded-full transition-colors"
            >
              Contoh {index + 1}
            </button>
          ))}
        </div>
        {value.trim().length > 0 && (
          <button
            onClick={() => onChange("")}
            className="text-xs font-semibold text-primary-400 hover:text-danger-500 transition-colors"
          >
            Bersihkan
          </button>
        )}
      </div>
    </div>
  );
}
