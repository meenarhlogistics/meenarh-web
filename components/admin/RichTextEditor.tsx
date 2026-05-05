"use client";

interface RichTextEditorProps {
  content: string;
  onChange: (markdown: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  return (
    <div className="border border-border rounded-xl overflow-hidden bg-card">
      <div className="p-4">
        <textarea
          className="w-full min-h-[320px] resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder={[
            "Write in Markdown.",
            "",
            "Examples:",
            "# Heading",
            "## Subheading",
            "",
            "- Bullet",
            "1. Numbered",
            "",
            "[Link](https://example.com)",
            "![Alt text](https://example.com/image.png)",
          ].join("\\n")}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Markdown only. Raw HTML is ignored on the public blog for security.
        </p>
      </div>
    </div>
  );
}
