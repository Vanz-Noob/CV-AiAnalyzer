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
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 lg:w-11 lg:h-11 rounded-lg bg-accent-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 lg:w-5 lg:h-5 text-accent-600" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base lg:text-lg font-bold text-primary-900">Upload CV</h2>
          <p className="text-xs text-primary-500">Format: PDF, DOC, DOCX (maks. {MAX_SIZE_MB}MB)</p>
        </div>
      </div>

      {!selectedFile ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full min-h-[160px] lg:min-h-[200px] rounded-xl border-2 border-dashed cursor-pointer
            transition-all duration-200 group
            ${
              isDragging
                ? "border-accent-500 bg-accent-50 scale-[1.01]"
                : "border-primary-200 bg-primary-50 hover:border-accent-300 hover:bg-accent-50/30"
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
            className={`w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-200 ${
              isDragging
                ? "bg-accent-200 scale-110"
                : "bg-primary-100 group-hover:bg-accent-100 group-hover:scale-105"
            }`}
          >
            <Upload
              className={`w-7 h-7 transition-colors ${
                isDragging ? "text-accent-600" : "text-primary-400 group-hover:text-accent-500"
              }`}
            />
          </div>
          <p className="text-sm font-semibold text-primary-700 mb-1">
            {isDragging ? "Lepaskan file di sini" : "Seret & lepas CV Anda di sini"}
          </p>
          <p className="text-xs text-primary-400 text-center px-4">
            atau <span className="text-accent-600 font-medium underline underline-offset-2">klik untuk memilih file</span>
          </p>
        </label>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-success-50 border border-success-500/20 animate-fade-in">
          <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-success-500/10 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-success-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-900 truncate">{selectedFile.name}</p>
            <p className="text-xs text-primary-500 mt-0.5">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            onClick={handleRemove}
            className="w-9 h-9 rounded-lg bg-white hover:bg-danger-50 flex items-center justify-center transition-colors group/remove"
            title="Hapus file"
          >
            <X className="w-4 h-4 text-primary-400 group-hover/remove:text-danger-500 transition-colors" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-danger-50 border border-danger-500/20 animate-fade-in">
          <X className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger-600 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
