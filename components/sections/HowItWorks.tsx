import { Card } from "@/components/ui";

interface Step {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

const IconMap: Record<string, React.ReactNode> = {
  calendar: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  truck: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
      />
    </svg>
  ),
  location: (
    <svg
      className="w-8 h-8"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
};

export function HowItWorks({ title, steps }: HowItWorksProps) {
  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-center mb-12">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className="p-8 text-center relative z-10 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Step Number */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-primary/20 text-primary rounded-lg flex items-center justify-center text-sm font-semibold">
                {index + 1}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-accent rounded-xl flex items-center justify-center mx-auto mb-6 text-foreground">
                {IconMap[step.icon] || IconMap.location}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground">{step.description}</p>

              {/* Connector Line (hidden on mobile, shown between cards on desktop) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
