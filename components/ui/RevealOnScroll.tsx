"use client";

import { motion, type TargetAndTransition } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

export type AnimVariant =
  | "fadeUp"
  | "fadeLeft"
  | "fadeRight"
  | "scaleIn"
  | "blurIn"
  | "flipUp"
  | "tilt"
  | "dropDown";

interface RevealOnScrollProps {
  children: ReactNode;
  variant?: AnimVariant;
  delay?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
}

type VariantDef = {
  hidden: TargetAndTransition;
  visible: TargetAndTransition;
};

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const variantDefs: Record<AnimVariant, VariantDef> = {
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  },
  fadeRight: {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  blurIn: {
    hidden: { opacity: 0, filter: "blur(12px)" },
    visible: { opacity: 1, filter: "blur(0px)" },
  },
  flipUp: {
    hidden: { opacity: 0, rotateX: 35 },
    visible: { opacity: 1, rotateX: 0 },
  },
  tilt: {
    hidden: { opacity: 0, scale: 0.92, rotate: -2 },
    visible: { opacity: 1, scale: 1, rotate: 0 },
  },
  dropDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
};

export function RevealOnScroll({
  children,
  variant = "fadeUp",
  delay = 0,
  duration = 0.6,
  className,
  style,
}: RevealOnScrollProps) {
  const def = variantDefs[variant];
  const isFlip = variant === "flipUp";

  const motionEl = (
    <motion.div
      className={isFlip ? undefined : className}
      style={isFlip ? undefined : style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: def.hidden,
        visible: {
          ...def.visible,
          transition: {
            duration,
            delay,
            ease: EASE,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );

  if (isFlip) {
    return (
      <div className={className} style={{ perspective: "800px", ...style }}>
        {motionEl}
      </div>
    );
  }

  return motionEl;
}
