import Image from "next/image";
import { cn } from "@/lib/utils";

const CTA_ILLUSTRATION_SRC = "/meenarh_cta1.png";

/** Hero-style illustration for the CTA card (asset in `public/`). */
export function CtaIllustration({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-[4/3] w-full max-w-[min(100%,22rem)] sm:max-w-md lg:mx-0 lg:ml-auto",
        className
      )}
    >
      <Image
        src={CTA_ILLUSTRATION_SRC}
        alt="Illustration of deliveries and logistics"
        fill
        className="object-contain object-center"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40rem"
        priority={false}
      />
    </div>
  );
}
