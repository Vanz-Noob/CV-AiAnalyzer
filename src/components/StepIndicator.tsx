import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl lg:max-w-3xl 2xl:max-w-4xl mx-auto mb-6 sm:mb-8 lg:mb-10 2xl:mb-12 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-4 sm:top-5 lg:top-6 2xl:top-7 left-0 right-0 h-0.5 lg:h-1 2xl:h-1 bg-gray-200" />
        <div
          className="absolute top-4 sm:top-5 lg:top-6 2xl:top-7 left-0 h-0.5 lg:h-1 2xl:h-1 bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500 ease-out"
          style={{ width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 2xl:w-14 2xl:h-14 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base 2xl:text-lg font-bold transition-all duration-300 border-2 lg:border-[3px] ${
                  isCompleted
                    ? "bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-500/30"
                    : isCurrent
                    ? "bg-white border-primary-500 text-primary-600 shadow-lg shadow-primary-500/20"
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 2xl:w-6 2xl:h-6" /> : index + 1}
              </div>
              <div className="mt-2 sm:mt-3 lg:mt-4 2xl:mt-5 text-center">
                <p className={`text-[10px] sm:text-xs lg:text-sm 2xl:text-base font-semibold leading-tight ${isCurrent ? "text-primary-700" : isCompleted ? "text-primary-600" : "text-gray-400"}`}>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.label.split(" ")[0]}</span>
                </p>
                <p className={`text-[8px] sm:text-[10px] lg:text-xs 2xl:text-sm mt-0.5 lg:mt-1 hidden sm:block ${isCurrent ? "text-gray-500" : "text-gray-400"}`}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
