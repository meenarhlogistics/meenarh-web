"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { ArrowRight } from "lucide-react";

interface ServiceCard {
  id: string;
  title: string;
  description: string;
  href: string;
}

interface ServicesOverviewProps {
  title: string;
  subtitle: string;
  services: ServiceCard[];
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function ServicesOverview({ title, subtitle, services }: ServicesOverviewProps) {
  return (
    <section id="services-overview" className="section-padding bg-muted">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <motion.h2
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
            >
              <Card className="h-full p-6 flex flex-col gap-4 hover:border-foreground/20 transition-colors">
                <h3 className="text-lg font-semibold text-foreground">{service.title}</h3>
                <p className="text-sm text-muted-foreground flex-1">{service.description}</p>
                <Link
                  href={service.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:gap-2 transition-all min-h-11"
                >
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
