import React from "react";

interface Step {
  id: number;
  label: string;
  description: string;
}

interface OrderStepperProps {
  currentStep: number;
  steps: Step[];
}

export function OrderStepper({ currentStep, steps }: OrderStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted -z-10">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div
              key={step.id}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Circle Indicator */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  border-2 transition-all duration-300 mb-2
                  ${
                    isCompleted
                      ? "bg-primary border-primary text-primary-foreground"
                      : isCurrent
                      ? "bg-background border-primary text-primary ring-4 ring-primary/20"
                      : "bg-background border-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="font-semibold text-sm">{stepNumber}</span>
                )}
              </div>

              {/* Label */}
              <div className="text-center max-w-[120px]">
                <p
                  className={`
                    text-sm font-medium mb-1
                    ${
                      isCompleted || isCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground hidden sm:block">
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
