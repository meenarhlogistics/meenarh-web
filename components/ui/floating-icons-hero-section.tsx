"use client";

import * as React from "react";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";

interface IconProps {
  id: number;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className: string;
  label?: string;
}

export interface FloatingIconsHeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  icons: IconProps[];
  cursiveAccent?: string;
  secondaryCta?: string;
  inputPlaceholder?: string;
}

const Icon = ({
  mouseX,
  mouseY,
  iconData,
  index,
}: {
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
  iconData: IconProps;
  index: number;
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  React.useEffect(() => {
    const handleMouseMove = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const distance = Math.sqrt(
          Math.pow(mouseX.current - (rect.left + rect.width / 2), 2) +
            Math.pow(mouseY.current - (rect.top + rect.height / 2), 2)
        );

        if (distance < 150) {
          const angle = Math.atan2(
            mouseY.current - (rect.top + rect.height / 2),
            mouseX.current - (rect.left + rect.width / 2)
          );
          const force = (1 - distance / 150) * 50;
          x.set(-Math.cos(angle) * force);
          y.set(-Math.sin(angle) * force);
        } else {
          x.set(0);
          y.set(0);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y, mouseX, mouseY]);

  return (
    <motion.div
      ref={ref}
      key={iconData.id}
      style={{
        x: springX,
        y: springY,
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("absolute", iconData.className)}
    >
      <motion.div
        className="flex flex-col items-center justify-center"
        animate={{
          y: [0, -8, 0, 8, 0],
          x: [0, 6, 0, -6, 0],
          rotate: [0, 5, 0, -5, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <iconData.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
        {iconData.label && (
          <span className="mt-1 text-[10px] md:text-xs font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            {iconData.label}
          </span>
        )}
      </motion.div>
    </motion.div>
  );
};

const renderHeadline = (title: string, cursiveAccent?: string) => {
  if (!cursiveAccent) {
    return title;
  }

  const parts = title.split(cursiveAccent);
  if (parts.length === 1) {
    return title;
  }

  return (
    <>
      {parts[0]}
      <span className="font-serif text-primary">{cursiveAccent}</span>
      {parts[1]}
    </>
  );
};

const FloatingIconsHero = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & FloatingIconsHeroProps
>(
  (
    {
      className,
      title,
      subtitle,
      ctaText,
      ctaHref,
      icons,
      cursiveAccent,
      secondaryCta,
      inputPlaceholder,
      ...props
    },
    ref
  ) => {
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);
    const [trackingCode, setTrackingCode] = useState("");

    // scrollY from framer-motion — a live MotionValue, no re-renders.
    const { scrollY } = useScroll();

    // Y offset applied to the fixed icon layer.
    // While free-scrolling: 0 (icons stay locked to viewport).
    // After stick point: stickPoint - scrollY  →  icons appear anchored
    // to their page position at the bottom of HowItWorks and scroll off
    // the top naturally as the user continues scrolling down.
    const iconLayerY = useMotionValue(0);

    // The scrollY value captured the moment TrackingPreview enters view.
    const stickPointRef = React.useRef<number | null>(null);

    // Track global mouse position so the repulsion effect works
    // while the icons are still visible over HowItWorks.
    React.useEffect(() => {
      const updateMouse = (e: MouseEvent) => {
        mouseX.current = e.clientX;
        mouseY.current = e.clientY;
      };
      window.addEventListener("mousemove", updateMouse);
      return () => window.removeEventListener("mousemove", updateMouse);
    }, []);

    // Subscribe to scroll changes and apply the sticky offset once
    // the stick point has been set by the IntersectionObserver below.
    React.useEffect(() => {
      return scrollY.on("change", (latest) => {
        const stickAt = stickPointRef.current;
        if (stickAt !== null) {
          iconLayerY.set(stickAt - latest);
        } else {
          iconLayerY.set(0);
        }
      });
    }, [scrollY, iconLayerY]);

    // Observe the TrackingPreview section. When it enters the viewport
    // (user has scrolled past HowItWorks), lock the stick point.
    // When it leaves again (user scrolls back up), release it.
    React.useEffect(() => {
      const target = document.getElementById("tracking-preview");
      if (!target) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Capture the scroll position at the exact moment the
            // next section becomes visible — only on the first entry.
            if (stickPointRef.current === null) {
              stickPointRef.current = window.scrollY;
            }
          } else {
            // Only release the lock when scrolling BACK UP (section
            // re-enters from below the viewport, meaning top > 0).
            // When scrolling DOWN past it (top < 0), keep the lock so
            // the icons stay anchored and do not reappear.
            if (entry.boundingClientRect.top > 0) {
              stickPointRef.current = null;
              iconLayerY.set(0);
            }
          }
        },
        { threshold: 0 }
      );

      observer.observe(target);
      return () => observer.disconnect();
    }, [iconLayerY]);

    const handleTrack = () => {
      if (trackingCode.trim()) {
        console.log("Tracking:", trackingCode);
      }
    };

    return (
      <>
        {/* Fixed icon layer — z-[5] keeps it above section backgrounds.
            The `y` motion value handles the sticky-scroll effect.      */}
        <motion.div
          className="fixed inset-0 w-full h-full pointer-events-none z-[5]"
          style={{ y: iconLayerY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {icons.map((iconData, index) => (
            <Icon
              key={iconData.id}
              mouseX={mouseX}
              mouseY={mouseY}
              iconData={iconData}
              index={index}
            />
          ))}
        </motion.div>

        {/* Hero section — foreground content only. */}
        <section
          ref={ref}
          id="hero"
          className={cn(
            "relative w-full min-h-screen flex items-center justify-center bg-background pt-24 pb-16 px-4",
            className
          )}
          {...props}
        >
          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6 animate-reveal">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-tight">
              {renderHeadline(title, cursiveAccent)}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">
              {subtitle}
            </p>

            <div className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder={inputPlaceholder}
                    value={trackingCode}
                    onChange={(e) => setTrackingCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  />
                </div>
                <Button
                  variant="default"
                  onClick={handleTrack}
                  className="transition-colors duration-200 hover:shadow-md"
                >
                  {ctaText}
                </Button>
              </div>
            </div>

            {secondaryCta && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  asChild
                  className="transition-colors duration-200"
                >
                  <a href="#request-pickup">{secondaryCta}</a>
                </Button>
              </div>
            )}
          </div>
        </section>
      </>
    );
  }
);

FloatingIconsHero.displayName = "FloatingIconsHero";

export { FloatingIconsHero };
