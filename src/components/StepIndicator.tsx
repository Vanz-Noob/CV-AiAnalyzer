/**
 * StepIndicator — Progress bar langkah 1-2-3-4.
 * Menampilkan indikator visual langkah yang sedang aktif, sudah selesai, atau belum tercapai.
 */
import { Check } from "lucide-react";

/** Props untuk StepIndicator */
interface StepIndicatorProps {
  /** Langkah yang sedang aktif (1-based) */
  currentStep: number;
  /** Daftar langkah dengan label dan deskripsi */
  steps: { label: string; description: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-xl mx-auto mb-10 sm:mb-12">
      <div className="flex items-center justify-between relative">
        {/* Background track */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-slate-700 rounded-full" />
        {/* Active track */}
        <div
          className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 border-3 ${
                  isCompleted
                    ? "bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/25"
                    : isCurrent
                    ? "bg-white dark:bg-slate-800 border-primary-500 text-primary-600 shadow-md shadow-primary-500/15"
                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-600 text-gray-300 dark:text-slate-500"
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <p className={`mt-3 text-xs sm:text-sm font-semibold leading-tight ${isCurrent ? "text-primary-700 dark:text-primary-400" : isCompleted ? "text-primary-600 dark:text-primary-400" : "text-gray-300 dark:text-slate-500"}`}>
                {step.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
