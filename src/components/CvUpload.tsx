/**
 * CvUpload — Komponen upload CV dengan drag & drop.
 * Mendukung format PDF, DOC, DOCX dengan validasi tipe dan ukuran file.
 * Menampilkan preview file yang sudah dipilih beserta tombol hapus.
 */
import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle2, File } from "lucide-react";

/** Props untuk CvUpload */
interface CvUploadProps {
  /** Callback saat file dipilih atau dihapus (null) */
  onFileSelect: (file: File | null) => void;
  /** File yang sedang dipilih */
  selectedFile: File | null;
}

/** Tipe MIME yang diterima untuk upload */
const ACCEPTED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

/** Ekstensi file yang diterima */
const ACCEPTED_EXTENSIONS = [".pdf", ".doc", ".docx"];
/** Batas ukuran file dalam MB */
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

  const fileExt = selectedFile?.name.split(".").pop()?.toUpperCase();

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-5 mb-8">
        <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          <FileText className="w-5.5 h-5.5 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Upload CV</h2>
          <p className="text-sm text-gray-400 dark:text-slate-400">Format: PDF, DOC, DOCX (maks. {MAX_SIZE_MB}MB)</p>
        </div>
      </div>

      {!selectedFile ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative flex flex-col items-center justify-center w-full min-h-[240px] sm:min-h-[280px] rounded-2xl border-2 border-dashed cursor-pointer
            transition-all duration-200 group p-6
            ${
              isDragging
                ? "border-primary-400 bg-primary-50/60 dark:bg-primary-900/20 scale-[1.01]"
                : "border-gray-200 dark:border-slate-600 bg-white/40 dark:bg-slate-700/30 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-primary-50/20 dark:hover:bg-primary-900/10"
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
            className={`w-16 h-16 sm:w-18 sm:h-18 rounded-2xl flex items-center justify-center mb-5 transition-all duration-200 ${
              isDragging
                ? "bg-primary-200/60 dark:bg-primary-800/40 scale-110"
                : "bg-gray-50 dark:bg-slate-700 group-hover:bg-primary-100/60 dark:group-hover:bg-primary-900/30 group-hover:scale-105"
            }`}
          >
            <Upload
              className={`w-8 h-8 transition-colors ${
                isDragging ? "text-primary-600 dark:text-primary-400" : "text-gray-300 dark:text-slate-500 group-hover:text-primary-500 dark:group-hover:text-primary-400"
              }`}
            />
          </div>
          <p className="text-base font-semibold text-gray-600 dark:text-slate-300 mb-2">
            {isDragging ? "Lepaskan file di sini" : "Seret & lepas CV Anda di sini"}
          </p>
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center">
            atau <span className="text-primary-600 dark:text-primary-400 font-medium underline underline-offset-2">klik untuk memilih file</span>
          </p>
        </label>
      ) : (
        <div className="flex items-center gap-5 p-5 rounded-2xl bg-success-50/80 dark:bg-success-900/20 border border-success-200/60 dark:border-success-800/40 animate-scale-in">
          <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm relative">
            <File className="w-7 h-7 text-primary-500 dark:text-primary-400" />
            {fileExt && (
              <span className="absolute -bottom-1 -right-1 text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/50 px-1.5 rounded">
                {fileExt}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-sm text-gray-400 dark:text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
              <CheckCircle2 className="w-4.5 h-4.5 text-success-500" />
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="w-10 h-10 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 flex items-center justify-center transition-colors group/remove"
            title="Hapus file"
          >
            <X className="w-5 h-5 text-gray-300 dark:text-slate-500 group-hover/remove:text-danger-500 transition-colors" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200/60 dark:border-danger-800/40 animate-fade-in">
          <X className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-danger-600 dark:text-danger-400 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
