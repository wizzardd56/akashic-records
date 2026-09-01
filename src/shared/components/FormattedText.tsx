"use client";

import React from "react";

/**
 * Renders text with newlines as <br> and double-newlines as paragraph breaks.
 * Also handles **bold** markdown-style formatting.
 */
export function FormattedText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\n+/);

  return (
    <div className={className}>
      {paragraphs.map((para, pIdx) => {
        const lines = para.split(/\n/);
        return (
          <p key={pIdx} className={pIdx > 0 ? "mt-2" : ""}>
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

/** Handle **bold** and `code` inline formatting */
function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1 py-0.5 rounded text-[11px]">$1</code>');
}
