import Link from "next/link";
import { Button } from "@/components/ui";

interface CallToActionProps {
  headline: string;
  description: string;
  buttonText: string;
  helperText?: string;
}

export function CallToAction({
  headline,
  description,
  buttonText,
  helperText,
}: CallToActionProps) {
  return (
    <section
      id="request-pickup"
      className="section-padding bg-background relative overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-muted rounded-full blur-3xl opacity-40 animate-pulse-soft"
          aria-hidden="true"
        />
        <div
          className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent rounded-full blur-3xl opacity-40 animate-pulse-soft"
          style={{ animationDelay: "2s" }}
          aria-hidden="true"
        />
      </div>

      <div className="relative z-10 max-w-lg mx-auto text-center animate-reveal">
        {/* Icon */}
        <div className="w-16 h-16 bg-foreground rounded-xl flex items-center justify-center mx-auto mb-8">
          <div className="w-3 h-3 bg-primary rounded-full" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
          {headline}
        </h2>

        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        <Link href="/login">
          <Button
            variant="dark"
            size="lg"
            className="w-full transition-transform transition-shadow duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {buttonText}
          </Button>
        </Link>

        {helperText && (
          <p className="text-sm text-muted-foreground mt-4">{helperText}</p>
        )}
      </div>
    </section>
  );
}
