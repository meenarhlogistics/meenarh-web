"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
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
  const floatDuration = React.useMemo(() => {
    // Deterministic pseudo-random duration derived from icon id (no Math.random in render)
    const seed = (iconData.id * 9301 + 49297) % 233280;
    const t = seed / 233280;
    return 5 + t * 5;
  }, [iconData.id]);

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
          duration: floatDuration,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        }}
      >
        <iconData.icon className="w-5 h-5 md:w-6 md:h-6 text-primary" aria-hidden />
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
    const router = useRouter();
    const mouseX = React.useRef(0);
    const mouseY = React.useRef(0);
    const [trackingCode, setTrackingCode] = useState("");

    React.useEffect(() => {
      const updateMouse = (e: MouseEvent) => {
        mouseX.current = e.clientX;
        mouseY.current = e.clientY;
      };
      window.addEventListener("mousemove", updateMouse);
      return () => window.removeEventListener("mousemove", updateMouse);
    }, []);

    const handleTrack = () => {
      const q = trackingCode.trim();
      if (!q) return;
      const sep = ctaHref.includes("?") ? "&" : "?";
      router.push(`${ctaHref}${sep}tracking=${encodeURIComponent(q)}`);
    };

    return (
      <section
        ref={ref}
        id="hero"
        className={cn(
          "relative w-full min-h-screen overflow-hidden flex items-center justify-center bg-background pt-24 pb-16 px-4",
          className
        )}
        {...props}
      >
        <motion.div
          className="pointer-events-none absolute inset-0 z-[5]"
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

        <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center animate-reveal">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-tight">
            {renderHeadline(title, cursiveAccent)}
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-md mx-auto">{subtitle}</p>

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
              <Button variant="outline" asChild className="transition-colors duration-200">
                <a href="#request-pickup">{secondaryCta}</a>
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

FloatingIconsHero.displayName = "FloatingIconsHero";

export { FloatingIconsHero };
