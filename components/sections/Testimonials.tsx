import { Card } from "@/components/ui";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
}

interface TestimonialsProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export function Testimonials({
  title,
  subtitle,
  testimonials,
}: TestimonialsProps) {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              rotate={index % 2 === 0 ? "left" : "right"}
              className="p-6 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Quote */}
              <div className="mb-6">
                <svg
                  className="w-8 h-8 text-primary/40 mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-foreground leading-relaxed">
                  {testimonial.quote}
                </p>
              </div>

              {/* Signature */}
              <div className="border-t border-border pt-4">
                <div className="w-8 h-0.5 bg-border mb-2" />
                <p className="font-serif text-xl text-muted-foreground">
                  {testimonial.author}, {testimonial.location}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
