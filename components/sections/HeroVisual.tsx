"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroVisual() {
  const [hidden, setHidden] = useState(false);

  if (hidden) return null;

  return (
    <section
      className="relative z-10 max-w-5xl mx-auto px-4 -mt-8 mb-4 hidden sm:block"
      aria-hidden={hidden}
    >
      <div className="relative aspect-[21/9] max-h-64 w-full overflow-hidden rounded-2xl border border-border bg-muted shadow-md">
        <Image
          src="/hero-logistics.webp"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 960px"
          priority
          onError={() => setHidden(true)}
        />
      </div>
    </section>
  );
}
