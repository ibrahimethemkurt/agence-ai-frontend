import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[var(--color-border)] z-0" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[var(--color-accent)] transition-all duration-300 z-0" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }} />
      
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
              isActive ? 'bg-[var(--color-accent)] border-[var(--color-accent)] text-white' :
              isCompleted ? 'bg-[var(--color-surface)] border-[var(--color-accent)] text-[var(--color-accent)]' :
              'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-muted)]'
            }`}>
              {isCompleted ? <Check size={18} /> : stepNumber}
            </div>
            <span className={`text-xs font-medium ${isActive || isCompleted ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}`}>
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
};
