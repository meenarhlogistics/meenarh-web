"use client";

import { motion } from "framer-motion";
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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Testimonials({
  title,
  subtitle,
  testimonials,
}: TestimonialsProps) {
  return (
    <section className="section-padding bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          {/* Heading — drops DOWN from above (opposite of every other section) */}
          <motion.h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {title}
          </motion.h2>

          {/* Subtitle — also drops down, slight delay */}
          <motion.p
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0, y: -40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => {
            const cardRotate = index % 2 === 0 ? "left" : "right";
            // The initial tilt exaggerates in the same direction as the card's rest rotation:
            // "left" cards (-rotate-1) start more left; "right" cards (rotate-1) start more right.
            const initRotate = cardRotate === "left" ? -8 : 8;

            return (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, rotate: initRotate, y: 30 }}
                whileInView={{ opacity: 1, rotate: 0, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                  ease: EASE,
                }}
              >
                <Card
                  rotate={cardRotate}
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
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
