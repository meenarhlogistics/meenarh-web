"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui";
import { trackLoginUrl } from "@/lib/auth/trackLogin";

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
  icons: IconProps[];
  cursiveAccent?: string;
  quoteCta?: string;
  quoteHref?: string;
  contactCta?: string;
  contactHref?: string;
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
  const IconComponent = iconData.icon;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 20 });
  const springY = useSpring(y, { stiffness: 150, damping: 20 });

  React.useEffect(() => {
    const handleMove = () => {
      const el = document.querySelector(`[data-icon-id="${iconData.id}"]`);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = mouseX.current - centerX;
      const distY = mouseY.current - centerY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const maxDist = 200;
      const force = Math.max(0, 1 - dist / maxDist);
      x.set(-distX * force * 0.15);
      y.set(-distY * force * 0.15);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY, iconData.id, x, y]);

  return (
    <motion.div
      data-icon-id={iconData.id}
      className={cn(
        "absolute flex flex-col items-center gap-1 text-muted-foreground/80",
        iconData.className
      )}
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden />
      {iconData.label ? (
        <span className="text-[0.65rem] sm:text-xs font-medium">{iconData.label}</span>
      ) : null}
    </motion.div>
  );
};

function renderHeadline(title: string, cursiveAccent?: string) {
  if (!cursiveAccent || !title.includes(cursiveAccent)) {
    return title;
  }
  const parts = title.split(cursiveAccent);
  return (
    <>
      {parts[0]}
      <span className="font-serif italic text-primary">{cursiveAccent}</span>
      {parts[1]}
    </>
  );
}

const FloatingIconsHero = React.forwardRef<HTMLElement, FloatingIconsHeroProps & React.HTMLAttributes<HTMLElement>>(
  (
    {
      className,
      title,
      subtitle,
      ctaText,
      icons,
      cursiveAccent,
      quoteCta,
      quoteHref = "/pricing#quote",
      contactCta,
      contactHref = "/contact",
      inputPlaceholder = "Enter tracking code",
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
      router.push(trackLoginUrl(q || undefined));
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

          <div className="max-w-md mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder={inputPlaceholder}
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                  aria-label="Tracking code"
                />
              </div>
              <Button
                variant="default"
                onClick={handleTrack}
                className="transition-colors duration-200 hover:shadow-md min-h-11"
              >
                {ctaText}
              </Button>
            </div>
          </div>

          {(quoteCta || contactCta) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center pt-2">
              {quoteCta ? (
                <Button variant="outline" asChild className="min-h-11">
                  <Link href={quoteHref}>{quoteCta}</Link>
                </Button>
              ) : null}
              {contactCta ? (
                <Button variant="ghost" asChild className="min-h-11">
                  <Link href={contactHref}>{contactCta}</Link>
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </section>
    );
  }
);

FloatingIconsHero.displayName = "FloatingIconsHero";

export { FloatingIconsHero };
