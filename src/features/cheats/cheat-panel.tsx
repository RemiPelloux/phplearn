"use client";

import { usePick } from "@/i18n";
import { InlineCode } from "@/features/ide/panels";
import type { CheatSheet } from "./types";

/** A cheat sheet, compact enough to sit next to the editor. */
export function CheatPanel({ sheet, onInsert }: { sheet: CheatSheet; onInsert?: (code: string) => void }) {
  const pick = usePick();
  return (
    <div className="p-4">
      <h2 className="text-sm font-semibold">{pick(sheet.title)}</h2>
      {sheet.intro && (
        <p className="mt-1 text-xs leading-relaxed text-fg-2">
          <InlineCode text={pick(sheet.intro)} />
        </p>
      )}
      {sheet.sections.map((s) => (
        <section key={s.title.en} className="mt-4">
          <h3 className="text-[11px] font-semibold tracking-wide text-fg-3 uppercase">{pick(s.title)}</h3>
          <dl className="mt-1.5 space-y-1.5">
            {s.rows.map((r) => (
              <div key={r.code} className="rounded-md border border-line bg-elevated px-2.5 py-1.5">
                <dt>
                  <button
                    onClick={() => onInsert?.(r.code)}
                    disabled={!onInsert}
                    className="block w-full text-left font-mono text-[12px] whitespace-pre-wrap text-fg enabled:hover:text-accent-fg"
                  >
                    {r.code}
                  </button>
                </dt>
                <dd className="mt-0.5 text-[11.5px] leading-snug text-fg-2">
                  <InlineCode text={pick(r.note)} />
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
