import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "muted" | "secondary";
  rotate?: "none" | "left" | "right";
}

export function Card({
  children,
  className = "",
  variant = "default",
  rotate = "none",
}: CardProps) {
  const variants = {
    default: "bg-card",
    accent: "bg-accent",
    muted: "bg-muted",
    secondary: "bg-secondary",
  };

  const rotations = {
    none: "",
    left: "-rotate-1",
    right: "rotate-1",
  };

  return (
    <div
      className={`rounded-xl shadow-md ${variants[variant]} ${rotations[rotate]} ${className}`}
    >
      {children}
    </div>
  );
}
