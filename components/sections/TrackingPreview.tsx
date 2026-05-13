"use client";

import { motion } from "framer-motion";

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

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function TrackingPreview({
  title,
  description,
  events,
}: TrackingPreviewProps) {
  return (
    <section id="tracking-preview" className="section-padding bg-muted">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          {/* Title — clips in from the left */}
          <motion.h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {title}
          </motion.h2>

          {/* Description — same direction, slight delay */}
          <motion.p
            className="text-lg text-muted-foreground max-w-xl mx-auto"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
          >
            {description}
          </motion.p>
        </div>

        {/* Timeline card — rises up */}
        <motion.div
          className="bg-card rounded-xl p-8 shadow-md"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
        >
          <div className="relative">
            {/* Vertical line — draws itself downward */}
            <motion.div
              className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
              style={{ transformOrigin: "top" }}
            />

            {/* Events */}
            <div className="space-y-6">
              {events.map((event, index) => (
                <motion.div
                  key={index}
                  className="relative flex items-center gap-6"
                  initial={{ opacity: 0, x: -40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: 0.35 + index * 0.1, ease: EASE }}
                >
                  {/* Status Dot — spring pop */}
                  <motion.div
                    className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      event.isCompleted
                        ? "bg-primary"
                        : event.isActive
                        ? "bg-primary/30 ring-4 ring-primary/20"
                        : "bg-border"
                    }`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                      delay: 0.45 + index * 0.1,
                    }}
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
                  </motion.div>

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
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
