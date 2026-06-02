import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface CvUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const MAX_SIZE_MB = 10;

export default function CvUpload({ onFileSelect, selectedFile }: CvUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED_TYPES.includes(file.type) && !ACCEPTED_EXTENSIONS.includes(ext)) {
      return "Format file tidak didukung. Gunakan PDF, DOC, atau DOCX.";
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `Ukuran file terlalu besar. Maksimal ${MAX_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        onFileSelect(null);
        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [validateFile, onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    onFileSelect(null);
    setError(null);
  }, [onFileSelect]);

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 mb-3 sm:mb-4 lg:mb-5">
        <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 rounded-lg lg:rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-primary-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base lg:text-lg 2xl:text-xl 3xl:text-2xl font-bold text-gray-900">Upload CV</h2>
          <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-500">Format: PDF, DOC, DOCX (maks. {MAX_SIZE_MB}MB)</p>
        </div>
      </div>

      {!selectedFile ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full min-h-[160px] sm:min-h-[200px] lg:min-h-[240px] 2xl:min-h-[280px] rounded-xl sm:rounded-2xl lg:rounded-3xl border-2 border-dashed cursor-pointer
            transition-all duration-200 group
            ${
              isDragging
                ? "border-primary-500 bg-primary-50/80 scale-[1.01]"
                : "border-gray-200 bg-white/60 hover:border-primary-300 hover:bg-primary-50/30"
            }
          `}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleInputChange}
            className="hidden"
          />
          <div
            className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 2xl:w-24 2xl:h-24 rounded-xl sm:rounded-2xl lg:rounded-3xl flex items-center justify-center mb-3 sm:mb-4 lg:mb-5 transition-all duration-200 ${
              isDragging
                ? "bg-primary-200 scale-110"
                : "bg-gray-100 group-hover:bg-primary-100 group-hover:scale-105"
            }`}
          >
            <Upload
              className={`w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 2xl:w-11 2xl:h-11 transition-colors ${
                isDragging ? "text-primary-600" : "text-gray-400 group-hover:text-primary-500"
              }`}
            />
          </div>
          <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg font-semibold text-gray-700 mb-1">
            {isDragging ? "Lepaskan file di sini" : "Seret & lepas CV Anda di sini"}
          </p>
          <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-400 text-center px-4">
            atau <span className="text-primary-600 font-medium underline underline-offset-2">klik untuk memilih file</span>
          </p>
        </label>
      ) : (
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 2xl:gap-6 p-3 sm:p-4 lg:p-5 2xl:p-6 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-success-50 border border-success-500/20 animate-fade-in">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 2xl:w-16 2xl:h-16 rounded-lg sm:rounded-xl lg:rounded-2xl bg-success-500/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 2xl:w-8 2xl:h-8 text-success-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm lg:text-base 2xl:text-lg 3xl:text-xl font-semibold text-gray-900 truncate">{selectedFile.name}</p>
            <p className="text-[10px] sm:text-xs lg:text-sm 2xl:text-base text-gray-500 mt-0.5 lg:mt-1">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="w-8 h-8 lg:w-10 lg:h-10 2xl:w-12 2xl:h-12 rounded-lg lg:rounded-xl bg-white/80 hover:bg-danger-50 flex items-center justify-center transition-colors group/remove"
            title="Hapus file"
          >
            <X className="w-4 h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6 text-gray-400 group-hover/remove:text-danger-500 transition-colors" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 lg:mt-4 flex items-start gap-2 lg:gap-3 p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-danger-50 border border-danger-500/20 animate-fade-in">
          <X className="w-4 h-4 lg:w-5 lg:h-5 text-danger-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs lg:text-sm 2xl:text-base text-danger-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
