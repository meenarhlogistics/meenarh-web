interface TrackingEvent {
  status: string;
  isActive: boolean;
  isCompleted: boolean;
}

interface TrackingPreviewProps {
  title: string;
  description: string;
  events: TrackingEvent[];
}

export function TrackingPreview({
  title,
  description,
  events,
}: TrackingPreviewProps) {
  return (
    <section id="tracking-preview" className="section-padding bg-muted">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-card rounded-xl p-8 shadow-md">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {/* Events */}
            <div className="space-y-6">
              {events.map((event, index) => (
                <div key={index} className="relative flex items-center gap-6">
                  {/* Status Dot */}
                  <div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.isCompleted
                        ? "bg-primary"
                        : event.isActive
                        ? "bg-primary/30 ring-4 ring-primary/20"
                        : "bg-border"
                    }`}
                  >
                    {event.isCompleted && (
                      <svg
                        className="w-4 h-4 text-primary-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {event.isActive && !event.isCompleted && (
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Status Text */}
                  <div
                    className={`py-3 px-5 rounded-xl flex-1 ${
                      event.isActive || event.isCompleted
                        ? "bg-accent/50"
                        : "bg-muted"
                    }`}
                  >
                    <span
                      className={`font-medium ${
                        event.isActive || event.isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
