import type { ReactNode } from "react";

/** Lesson text: `code`, **bold** and *italic*. Nothing else is interpreted. */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const s = m[0];
    if (s.startsWith("`"))
      out.push(
        <code key={i++} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.88em] text-fg">
          {s.slice(1, -1)}
        </code>,
      );
    else if (s.startsWith("**"))
      out.push(
        <strong key={i++} className="font-semibold text-fg">
          {s.slice(2, -2)}
        </strong>,
      );
    else out.push(<em key={i++}>{s.slice(1, -1)}</em>);
    last = m.index + s.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}
