import { Card } from "@/components/ui";

interface Region {
  name: string;
  areas: string[];
  variant: "sage" | "lavender" | "white";
}

interface CoverageProps {
  title: string;
  description: string;
  regions: Region[];
}

// Map old variant names to new ones
const variantMap: Record<string, "accent" | "muted" | "secondary"> = {
  sage: "accent",
  lavender: "muted",
  white: "secondary",
};

export function Coverage({ title, description, regions }: CoverageProps) {
  return (
    <section id="coverage" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {regions.map((region) => (
            <Card
              key={region.name}
              variant={variantMap[region.variant] || "accent"}
              className="p-6 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {region.name}
              </h3>
              <div className="flex flex-wrap gap-2">
                {region.areas.map((area) => (
                  <span
                    key={area}
                    className="px-4 py-2 bg-card/70 rounded-lg text-sm font-medium text-foreground"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
