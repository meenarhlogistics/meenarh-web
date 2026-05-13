"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
}

interface HowItWorksProps {
  title: string;
  steps: Step[];
}

const AUTO_MS = 5500;
const SCROLL_SYNC_MS = 120;
const WRAP_SYNC_MS = 450;

export function HowItWorks({ title, steps }: HowItWorksProps) {
  // physicalActive indexes into the rendered (cloned) slides for seamless wrap.
  const [physicalActive, setPhysicalActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = steps.length;

  const scrollerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const skipScrollSync = useRef(false);
  const initialScrollDone = useRef(false);
  const scrollSyncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const slides = useMemo(() => {
    if (!len) return [];
    // 3x clones: [A][A][A]. We start in the middle block for wrap safety.
    return [...steps, ...steps, ...steps].map((s, i) => ({
      ...s,
      __key: `${s.id}-${i}`,
      __physicalIndex: i,
      __logicalIndex: i % len,
    }));
  }, [steps, len]);

  // Derived logical index for the text and dot controls.
  const active = len ? ((physicalActive % len) + len) % len : 0;

  const centerPhysical = useCallback((index: number, behavior: ScrollBehavior) => {
    const sc = scrollerRef.current;
    const el = slideRefs.current[index];
    if (!sc || !el) return;

    skipScrollSync.current = true;
    const slideMid = el.offsetLeft + el.offsetWidth / 2;
    const left = slideMid - sc.clientWidth / 2;

    // Never use scrollIntoView here: it can scroll the whole page to this section.
    if (behavior === "instant") {
      sc.scrollLeft = left;
      requestAnimationFrame(() => {
        skipScrollSync.current = false;
      });
      return;
    }

    sc.scrollTo({ left, behavior: "smooth" });
    window.setTimeout(() => {
      skipScrollSync.current = false;
    }, WRAP_SYNC_MS);
  }, []);

  useLayoutEffect(() => {
    if (len < 1) return;
    // Start on the first slide of the middle clone block.
    if (!initialScrollDone.current) {
      const start = len; // middle block start
      requestAnimationFrame(() => {
        setPhysicalActive(start);
        centerPhysical(start, "instant");
        initialScrollDone.current = true;
      });
    }
  }, [len, centerPhysical]);

  useLayoutEffect(() => {
    if (!initialScrollDone.current) return;
    centerPhysical(physicalActive, "smooth");
  }, [physicalActive, centerPhysical]);

  useEffect(() => {
    if (paused || len < 2) return;
    const id = window.setInterval(() => {
      setPhysicalActive((i) => i + 1);
    }, AUTO_MS);
    return () => window.clearInterval(id);
  }, [paused, len]);

  // Seamless wrap: when we drift into the third clone block, jump back by len to the middle block.
  // Same for the first block (user scroll backwards).
  useEffect(() => {
    if (!initialScrollDone.current || len < 2) return;
    const upper = len * 2; // start of third block
    const lower = len; // start of middle block

    if (physicalActive >= upper) {
      const target = physicalActive - len;
      const t = window.setTimeout(() => {
        centerPhysical(target, "instant");
        setPhysicalActive(target);
      }, WRAP_SYNC_MS);
      return () => window.clearTimeout(t);
    }

    if (physicalActive < lower) {
      const target = physicalActive + len;
      const t = window.setTimeout(() => {
        centerPhysical(target, "instant");
        setPhysicalActive(target);
      }, WRAP_SYNC_MS);
      return () => window.clearTimeout(t);
    }
  }, [physicalActive, len, centerPhysical]);

  const syncActiveFromScroll = useCallback(() => {
    const sc = scrollerRef.current;
    if (!sc || skipScrollSync.current) return;
    const center = sc.scrollLeft + sc.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    slideRefs.current.forEach((el, i) => {
      if (!el) return;
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setPhysicalActive((prev) => (prev === best ? prev : best));
  }, []);

  const onScrollerScroll = useCallback(() => {
    if (scrollSyncTimer.current) clearTimeout(scrollSyncTimer.current);
    scrollSyncTimer.current = setTimeout(() => {
      scrollSyncTimer.current = null;
      syncActiveFromScroll();
    }, SCROLL_SYNC_MS);
  }, [syncActiveFromScroll]);

  useEffect(() => {
    return () => {
      if (scrollSyncTimer.current) clearTimeout(scrollSyncTimer.current);
    };
  }, []);

  const step = steps[active];

  const titleWords = title.split(" ");

  return (
    <section id="how-it-works" className="section-padding bg-background">
      <div className="mx-auto w-full max-w-7xl px-0">
        {/* Word-split cascade title */}
        <motion.h2
          className="mb-10 text-center text-3xl font-semibold tracking-tight text-foreground sm:mb-12 sm:text-4xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ marginRight: i < titleWords.length - 1 ? "0.28em" : undefined }}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h2>

        {/* Slider — spring bounce rise */}
        <motion.div
          className="mx-auto w-full max-w-6xl"
          initial={{ opacity: 0, y: 70 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 60, damping: 18, delay: 0.15 }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            ref={scrollerRef}
            role="region"
            aria-roledescription="carousel"
            aria-label="How it works steps"
            className={cn(
              "flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden pb-2 sm:gap-4",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            )}
            onScroll={onScrollerScroll}
          >
            {slides.map((s, i) => (
              <div
                key={s.__key}
                ref={(el) => {
                  slideRefs.current[i] = el;
                }}
                className={cn(
                  "relative aspect-[4/3] w-[92%] shrink-0 snap-center overflow-hidden rounded-2xl border border-border bg-muted shadow-md sm:rounded-3xl md:aspect-[16/10]",
                  i === physicalActive
                    ? "opacity-100 ring-2 ring-primary/25"
                    : "opacity-70 sm:opacity-80"
                )}
              >
                <Image
                  src={s.imageSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 92vw, 1024px"
                  priority={s.__logicalIndex === 0 && i >= len && i < len * 2}
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/75 via-transparent to-transparent"
                  aria-hidden
                />
                {i === physicalActive && (
                  <div className="absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground shadow-sm">
                    {active + 1}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <h3 className="mb-2 text-xl font-semibold text-foreground sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mx-auto max-w-lg text-muted-foreground sm:text-lg">
                  {step.description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots — fade in after slider settles */}
            <motion.div
              className="mt-6 flex items-center justify-center gap-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.4, delay: 0.55 }}
              aria-label="How it works steps"
            >
              {steps.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={i === active}
                  aria-label={`Step ${i + 1}: ${s.title}`}
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === active ? "w-8 bg-primary" : "w-2.5 bg-border hover:bg-muted-foreground/35"
                  )}
                  onClick={() => setPhysicalActive(len + i)}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
