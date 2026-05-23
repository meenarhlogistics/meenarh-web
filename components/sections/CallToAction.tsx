"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CtaIllustration } from "./CtaIllustration";

/** Focus rings sit on muted card background (#ebefe0) */
const focusOnCard =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-2 focus-visible:ring-offset-muted";

interface CallToActionProps {
  headline: string;
  description: string;
  buttonText: string;
  helperText?: string;
  primaryHref: string;
  secondaryButtonText?: string;
  secondaryHref?: string;
  appStoreHref?: string;
  googlePlayHref?: string;
}

function AppleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.5 2.94-1.72 2.02.12 3.93 1.73 4.12 2.47-.9.08-2.12.62-2.82 1.55-.78.92-1.46 2.3-1.26 3.66-.13-.01-2.08-.38-3.12-2.24-.5-.87-.9-1.96-.86-2.72z" />
    </svg>
  );
}

function PlayGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M3 20.5v-17c0-.59.47-1.04 1.02-.98l16.99 8.5c.58.29.58 1.17 0 1.46L4.02 21.48A1.02 1.02 0 0 1 3 20.5Z"
      />
    </svg>
  );
}

const storeBadgeClass = cn(
  "inline-flex min-h-11 flex-1 min-w-[10rem] cursor-pointer items-center gap-3 rounded-xl border border-foreground/25 bg-foreground px-4 py-2.5 text-background shadow-sm transition-opacity hover:opacity-95 sm:max-w-[14rem]",
  focusOnCard
);

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function CallToAction({
  headline,
  description,
  buttonText,
  helperText,
  primaryHref,
  secondaryButtonText,
  secondaryHref,
  appStoreHref,
  googlePlayHref,
}: CallToActionProps) {
  const showStores = Boolean(appStoreHref || googlePlayHref);
  const headlineWords = headline.split(" ");

  return (
    <section id="request-pickup" className="section-padding bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 xl:px-12 2xl:max-w-[90rem]">
        {/* Outer card — pronounced spring bounce */}
        <motion.div
          className="min-h-[20rem] rounded-3xl bg-muted px-8 py-12 shadow-lg shadow-black/10 sm:px-10 sm:py-14 lg:min-h-[24rem] lg:rounded-[2rem] lg:px-14 lg:py-16 xl:min-h-[26rem] xl:px-16 xl:py-20 2xl:py-24"
          initial={{ opacity: 0, y: 80, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 55, damping: 16 }}
        >
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
            <div className="order-1 flex max-w-2xl flex-col gap-7 lg:max-w-none lg:gap-9 xl:gap-10">
              {/* Headline — word-by-word cascade from left */}
              <motion.h2
                className="max-w-2xl text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-[3.25rem] xl:leading-[1.1]"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
                }}
              >
                {headlineWords.map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    style={{ marginRight: i < headlineWords.length - 1 ? "0.28em" : undefined }}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.4, ease: EASE },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h2>

              {/* Description — plain fade */}
              <motion.p
                className="max-w-2xl text-base leading-relaxed text-foreground/90 sm:text-lg lg:text-xl"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: 0.38, ease: EASE }}
              >
                {description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row flex-wrap gap-3"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                  delay: 0.45,
                }}
              >
                <Link
                  href={primaryHref}
                  className={cn(
                    "inline-flex min-h-12 w-full sm:w-fit items-center justify-center rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-md transition-colors hover:bg-primary/90 sm:text-lg",
                    focusOnCard
                  )}
                >
                  {buttonText}
                </Link>
                {secondaryButtonText && secondaryHref ? (
                  <Link
                    href={secondaryHref}
                    className={cn(
                      "inline-flex min-h-12 w-full sm:w-fit items-center justify-center rounded-xl border border-foreground/25 bg-transparent px-10 py-4 text-base font-semibold text-foreground transition-colors hover:bg-foreground/5 sm:text-lg",
                      focusOnCard
                    )}
                  >
                    {secondaryButtonText}
                  </Link>
                ) : null}
              </motion.div>

              {showStores ? (
                <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:flex-wrap">
                  {[
                    appStoreHref
                      ? {
                          href: appStoreHref,
                          label: "Download on the App Store",
                          glyph: <AppleGlyph className="h-8 w-8 shrink-0" />,
                          line1: "Download on the",
                          line2: "App Store",
                        }
                      : null,
                    googlePlayHref
                      ? {
                          href: googlePlayHref,
                          label: "Get it on Google Play",
                          glyph: <PlayGlyph className="h-7 w-7 shrink-0 opacity-95" />,
                          line1: "Get it on",
                          line2: "Google Play",
                        }
                      : null,
                  ]
                    .filter(Boolean)
                    .map((badge, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{
                          duration: 0.45,
                          delay: 0.55 + i * 0.1,
                          ease: EASE,
                        }}
                      >
                        <Link
                          href={badge!.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={storeBadgeClass}
                          aria-label={badge!.label}
                        >
                          {badge!.glyph}
                          <span className="flex flex-col text-left leading-tight">
                            <span className="text-[0.65rem] font-medium uppercase tracking-wide opacity-90">
                              {badge!.line1}
                            </span>
                            <span className="text-sm font-semibold">{badge!.line2}</span>
                          </span>
                        </Link>
                      </motion.div>
                    ))}
                </div>
              ) : null}

              {helperText ? (
                <motion.p
                  className="mt-1 max-w-2xl text-sm text-foreground/80 sm:text-base"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: 0.65, ease: EASE }}
                >
                  {helperText}
                </motion.p>
              ) : null}
            </div>

            {/* Illustration — swings in from the right with a slight initial rotation */}
            <motion.div
              className="order-2 flex min-h-[14rem] justify-center sm:min-h-[16rem] lg:min-h-[18rem] lg:justify-end"
              initial={{ opacity: 0, x: 60, rotate: 8 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 18,
                delay: 0.25,
              }}
            >
              <CtaIllustration className="max-w-lg lg:max-w-xl xl:max-w-2xl" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
