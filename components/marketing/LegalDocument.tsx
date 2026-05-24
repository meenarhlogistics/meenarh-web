import type { LegalSection } from "@/lib/legal/shared";
import { LEGAL_EFFECTIVE_DATE } from "@/lib/legal/shared";

interface LegalDocumentProps {
  intro?: string[];
  sections: LegalSection[];
  effectiveDate?: string;
}

export function LegalDocument({ intro, sections, effectiveDate = LEGAL_EFFECTIVE_DATE }: LegalDocumentProps) {
  return (
    <article className="space-y-10">
      <p className="text-sm text-muted-foreground text-center">Effective date: {effectiveDate}</p>

      {intro?.length ? <IntroBlock paragraphs={intro} /> : null}

      <div className="space-y-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="text-xl font-semibold text-foreground mb-4">{section.title}</h2>
            {section.paragraphs?.length ? (
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            {section.bullets?.length ? (
              <ul className="mt-3 list-disc pl-5 space-y-2 text-muted-foreground leading-relaxed">
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>
    </article>
  );
}

function IntroBlock({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="space-y-4 text-muted-foreground leading-relaxed">
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 48)}>{paragraph}</p>
      ))}
    </div>
  );
}
