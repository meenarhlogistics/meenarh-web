"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";

interface Point {
  title: string;
  description: string;
  icon: string;
}

interface WhyUsProps {
  title: string;
  points: Point[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const IconMap: Record<string, React.ReactNode> = {
  tracking: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
      />
    </svg>
  ),
  notification: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  ),
  location: (
    <svg
      className="w-6 h-6"
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
  shield: (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  ),
};

export function WhyUs({ title, points }: WhyUsProps) {
  return (
    <section className="section-padding bg-muted">
      <div className="max-w-5xl mx-auto">
        {/* Title — 3D forward flip using rotateX with perspective */}
        <div style={{ perspective: "800px" }}>
          <motion.h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-center mb-12"
            initial={{ opacity: 0, rotateX: 35 }}
            whileInView={{ opacity: 1, rotateX: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            {title}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {points.map((point, index) => {
            // Odd-indexed cards slide in from the left, even from the right
            const xStart = index % 2 === 0 ? -60 : 60;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: xStart }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: EASE }}
              >
                <Card className="p-6 flex items-start gap-4 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
                  {/* Icon — spins 180deg into position */}
                  <motion.div
                    className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0 text-primary"
                    initial={{ rotate: 180, opacity: 0 }}
                    whileInView={{ rotate: 0, opacity: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: 0.15 + index * 0.1,
                    }}
                  >
                    {IconMap[point.icon] || IconMap.shield}
                  </motion.div>

                  {/* Content */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {point.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{point.description}</p>
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
