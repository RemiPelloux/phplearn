"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Check, ClipboardCopy, Info, TriangleAlert } from "lucide-react";
import { Example } from "@/features/ide/example";

/**
 * A small, safe Markdown subset for the docs: headings, paragraphs, lists,
 * fenced code with a copy button (```php blocks starting with <?php run on real PHP), tables, callouts (> Tip: / > Warning:),
 * inline `code`, **bold**, [links](/path) and [[UI controls]] drawn like the
 * real control. No raw HTML is ever rendered.
 */

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");

export function headingsOf(md: string): Heading[] {
  return md
    .split("\n")
    .map((line) => line.match(/^(#{2,3}) (.+)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ id: slugify(plain(m[2])), text: plain(m[2]), level: m[1].length as 2 | 3 }));
}

/** French typography: keep ": ; ? ! »" and "«" glued to their word with a non-breaking space. */
export const nbsp = (s: string) => s.replace(/ ([:;?!»])/g, "\u00a0$1").replace(/« /g, "«\u00a0");

const plain = (s: string) => s.replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(\[\[([^\]]+)\]\]|`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(nbsp(text.slice(last, m.index)));
    const k = `${key}-${i++}`;
    if (m[2]) out.push(<kbd key={k} className="ui-chip">{m[2]}</kbd>);
    else if (m[3]) out.push(<code key={k} className="rounded bg-surface-2 px-1 py-0.5 font-mono text-[0.88em] text-fg">{m[3]}</code>);
    else if (m[4]) out.push(<strong key={k} className="font-semibold text-fg">{m[4]}</strong>);
    else if (m[5] && m[6]) {
      const href = m[6];
      out.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={k} href={href} className="font-medium text-accent-fg underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
            {m[5]}
          </Link>
        ) : (
          <a key={k} href={href} target="_blank" rel="noreferrer" className="font-medium text-accent-fg underline decoration-accent/40 underline-offset-[3px] hover:decoration-accent">
            {m[5]}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(nbsp(text.slice(last)));
  return out;
}

function CodeBlock({ code, lang, copyLabel, copiedLabel }: { code: string; lang: string; copyLabel: string; copiedLabel: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="terminal my-5 overflow-hidden rounded-lg bg-term">
      <div className="flex items-center justify-between border-b border-white/5 px-3 py-1.5 font-mono text-[11px] text-[var(--t-muted)]">
        <span>{lang || "text"}</span>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code);
              setDone(true);
              setTimeout(() => setDone(false), 1400);
            } catch {
              /* clipboard unavailable */
            }
          }}
          className="no-print flex items-center gap-1 rounded-md px-2 py-0.5 font-sans hover:bg-white/10 hover:text-white"
        >
          {done ? <Check className="size-3.5 text-[var(--t-green)]" /> : <ClipboardCopy className="size-3.5" />}
          {done ? copiedLabel : copyLabel}
        </button>
      </div>
      <pre className="scrollbar-thin overflow-x-auto px-4 py-3 font-mono text-[12.5px] leading-relaxed text-[var(--t-text)]">
        {code.split("\n").map((line, i) => (
          <div key={i} className={/^\s*#(?!#)/.test(line) && lang !== "markdown" ? "text-[var(--t-muted)]" : ""}>
            {line || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}

/** Split a table row on |, except inside `code` or when escaped as \|. */
function cells(row: string): string[] {
  const out: string[] = [];
  let cur = "";
  let code = false;
  for (let i = 0; i < row.length; i++) {
    const c = row[i];
    if (c === "\\" && row[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (c === "`") {
      code = !code;
      cur += c;
    } else if (c === "|" && !code) {
      out.push(cur.trim());
      cur = "";
    } else cur += c;
  }
  out.push(cur.trim());
  return out.slice(1, -1);
}

export function Markdown({ source, copyLabel = "Copy", copiedLabel = "Copied" }: { source: string; copyLabel?: string; copiedLabel?: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const blocks: ReactNode[] = [];
  let i = 0;
  let k = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) body.push(lines[i++]);
      i++;
      const code = body.join("\n");
      blocks.push(
        fence[1] === "php" ? (
          /^<\?php/.test(code.trimStart()) ? (
            <Example key={k++} code={code.trimStart()} editable className="my-5" />
          ) : (
            <Example key={k++} code={code.replace(/\s+$/, "")} runnable={false} className="my-5" />
          )
        ) : (
          <CodeBlock key={k++} code={code} lang={fence[1]} copyLabel={copyLabel} copiedLabel={copiedLabel} />
        ),
      );
      continue;
    }
    const h = line.match(/^(#{2,3}) (.+)$/);
    if (h) {
      const id = slugify(plain(h[2]));
      blocks.push(
        h[1].length === 2 ? (
          <h2 key={k++} id={id} className="mt-12 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight text-balance first:mt-0">
            {inline(h[2])}
          </h2>
        ) : (
          <h3 key={k++} id={id} className="mt-8 mb-2 scroll-mt-24 text-base font-semibold text-fg">
            {inline(h[2])}
          </h3>
        ),
      );
      i++;
      continue;
    }
    if (line.startsWith("> ")) {
      const body: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) body.push(lines[i++].slice(2));
      const text = body.join(" ");
      const warn = /^(Warning|Attention)\s*:/i.test(text);
      const content = text.replace(/^(Tip|Astuce|Note|Warning|Attention)\s*:\s*/i, "");
      blocks.push(
        <aside key={k++} className={clsx("my-5 flex gap-3 rounded-lg px-4 py-3 text-[15px] leading-relaxed", warn ? "bg-warn-soft text-fg" : "bg-accent-soft text-fg")}>
          {warn ? <TriangleAlert className="mt-1 size-4 shrink-0 text-warn" aria-hidden /> : <Info className="mt-1 size-4 shrink-0 text-accent-fg" aria-hidden />}
          <p>{inline(content)}</p>
        </aside>,
      );
      continue;
    }
    if (/^\|/.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) {
        if (!/^\|[\s:-]+\|/.test(lines[i]) || /[a-z0-9]/i.test(lines[i])) rows.push(cells(lines[i]));
        i++;
      }
      const [head, ...rest] = rows;
      blocks.push(
        <div key={k++} className="scrollbar-thin my-5 overflow-x-auto rounded-lg border border-line">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface-2">
              <tr>
                {head.map((c, j) => (
                  <th key={j} scope="col" className="px-3 py-2 text-xs font-semibold text-fg-2">
                    {inline(c)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((r, ri) => (
                <tr key={ri} className="border-t border-line align-top">
                  {r.map((c, j) => (
                    <td key={j} className={clsx("px-3 py-2 text-fg-2", j === 0 && "font-medium text-fg")}>
                      {inline(c, ri * 10 + j)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }
    if (/^(- |\d+\. )/.test(line)) {
      const ordered = /^\d+\. /.test(line);
      const items: string[] = [];
      while (i < lines.length && /^(- |\d+\. )/.test(lines[i])) items.push(lines[i++].replace(/^(- |\d+\. )/, ""));
      const List = ordered ? "ol" : "ul";
      blocks.push(
        <List key={k++} className={clsx("my-4 space-y-2 pl-5 text-[15px] leading-relaxed text-fg-2", ordered ? "list-decimal marker:font-semibold marker:text-fg-3" : "list-disc marker:text-fg-3")}>
          {items.map((it, j) => (
            <li key={j} className="pl-1">
              {inline(it, j)}
            </li>
          ))}
        </List>,
      );
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |```|> |\||- |\d+\. )/.test(lines[i])) para.push(lines[i++]);
    blocks.push(
      <p key={k++} className="my-4 text-[15px] leading-[1.75] text-fg-2">
        {inline(para.join(" "))}
      </p>,
    );
  }
  return <div className="max-w-[70ch]">{blocks}</div>;
}
