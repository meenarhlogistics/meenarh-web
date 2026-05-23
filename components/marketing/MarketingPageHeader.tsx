interface MarketingPageHeaderProps {
  title: string;
  subtitle?: string;
}

export function MarketingPageHeader({ title, subtitle }: MarketingPageHeaderProps) {
  return (
    <header className="max-w-3xl mx-auto text-center mb-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
        {title}
      </h1>
      {subtitle ? (
        <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>
      ) : null}
    </header>
  );
}
