import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  steps: { label: string; description: string }[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-2xl lg:max-w-3xl mx-auto mb-6 lg:mb-8 px-2">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-5 left-0 right-0 h-1 bg-primary-200" />
        <div
          className="absolute top-5 left-0 h-1 bg-accent-500 transition-all duration-500 ease-out"
          style={{ width: `${((Math.min(currentStep, steps.length) - 1) / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = currentStep > index + 1;
          const isCurrent = currentStep === index + 1;

          return (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center text-sm lg:text-base font-bold transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-accent-600 border-accent-600 text-white"
                    : isCurrent
                    ? "bg-white border-accent-500 text-accent-600"
                    : "bg-white border-primary-200 text-primary-400"
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 lg:w-5 lg:h-5" /> : index + 1}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-semibold leading-tight ${isCurrent ? "text-accent-700" : isCompleted ? "text-accent-600" : "text-primary-400"}`}>
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.label.split(" ")[0]}</span>
                </p>
                <p className={`text-[10px] mt-0.5 hidden sm:block ${isCurrent ? "text-primary-500" : "text-primary-400"}`}>
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
