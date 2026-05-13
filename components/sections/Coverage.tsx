import Image from "next/image";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll";

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

export function Coverage({ title, description }: CoverageProps) {
  return (
    <section id="coverage" className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {/* Heading — blurs into focus like a camera refocusing */}
          <RevealOnScroll variant="blurIn">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
              {title}
            </h2>
          </RevealOnScroll>

          {/* Description — plain opacity fade */}
          <RevealOnScroll variant="fadeUp" delay={0.15}>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {description}
            </p>
          </RevealOnScroll>
        </div>

        {/* Image — starts tilted and scales into place */}
        <RevealOnScroll variant="tilt" delay={0.2} duration={0.8}>
          <div className="mx-auto w-full max-w-4xl">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-transparent sm:rounded-3xl">
              <Image
                src="/lagos2_backgrounf_removed.png"
                alt="Lagos coverage map"
                fill
                className="object-contain"
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 800px, 900px"
                priority
              />
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
