"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from "@codemirror/autocomplete";
import { defaultKeymap, history, historyKeymap, indentWithTab, toggleComment } from "@codemirror/commands";
import { bracketMatching, foldGutter, foldKeymap, HighlightStyle, indentOnInput, indentUnit, syntaxHighlighting } from "@codemirror/language";
import { highlightSelectionMatches, openSearchPanel, searchKeymap } from "@codemirror/search";
import { Compartment, EditorState, RangeSetBuilder, StateEffect, StateField, type Extension } from "@codemirror/state";
import {
  Decoration,
  drawSelection,
  dropCursor,
  EditorView,
  gutter,
  GutterMarker,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightSpecialChars,
  keymap,
  lineNumbers,
  rectangularSelection,
  WidgetType,
  type DecorationSet,
} from "@codemirror/view";
import { tags as t } from "@lezer/highlight";
import { langExtension, phpCompletions, type LangId } from "./languages";

/** Syntax colors come from CSS variables, so the editor follows the app theme. */
const highlight = HighlightStyle.define([
  { tag: [t.keyword, t.modifier, t.operatorKeyword, t.controlKeyword, t.moduleKeyword, t.definitionKeyword], color: "var(--syn-keyword)" },
  { tag: [t.string, t.special(t.string), t.regexp, t.character], color: "var(--syn-string)" },
  { tag: [t.number, t.bool, t.null, t.atom], color: "var(--syn-number)" },
  { tag: [t.comment, t.lineComment, t.blockComment, t.docComment], color: "var(--syn-comment)", fontStyle: "italic" },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.function(t.definition(t.variableName))], color: "var(--syn-function)" },
  { tag: [t.typeName, t.className, t.namespace, t.standard(t.typeName)], color: "var(--syn-type)" },
  { tag: [t.propertyName, t.attributeName], color: "var(--syn-property)" },
  { tag: [t.variableName, t.definition(t.variableName), t.special(t.variableName)], color: "var(--syn-variable)" },
  { tag: [t.operator, t.punctuation, t.separator, t.bracket, t.derefOperator], color: "var(--syn-punct)" },
  { tag: [t.processingInstruction, t.meta], color: "var(--syn-keyword)", fontWeight: "600" },
  { tag: [t.heading], color: "var(--syn-heading)", fontWeight: "700" },
  { tag: [t.strong], fontWeight: "700" },
  { tag: [t.emphasis], fontStyle: "italic" },
  { tag: [t.link, t.url], color: "var(--syn-string)", textDecoration: "underline" },
  { tag: [t.tagName, t.angleBracket], color: "var(--syn-property)" },
  { tag: [t.invalid], color: "var(--bad)" },
]);

const theme = EditorView.theme({
  "&": { height: "100%", fontSize: "var(--editor-font, 14px)", backgroundColor: "var(--editor-bg)", color: "var(--text)" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: "var(--font-mono)", lineHeight: "1.65", overflow: "auto" },
  ".cm-content": { padding: "10px 0 30vh", caretColor: "var(--accent-mark)" },
  ".cm-line": { padding: "0 16px 0 10px" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "var(--accent-mark)", borderLeftWidth: "2px" },
  "&.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground, .cm-selectionBackground, ::selection": { backgroundColor: "var(--editor-selection) !important" },
  ".cm-activeLine": { backgroundColor: "var(--editor-line)" },
  ".cm-gutters": { backgroundColor: "var(--editor-bg)", color: "var(--text-3)", border: "none", paddingLeft: "4px" },
  ".cm-lineNumbers .cm-gutterElement": { minWidth: "3ch", padding: "0 8px 0 4px", opacity: "0.6" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "var(--text)" },
  ".cm-activeLineGutter.cm-gutterElement": { opacity: "1" },
  ".cm-foldGutter .cm-gutterElement": { padding: "0 4px", color: "var(--text-3)" },
  ".cm-marks-gutter .cm-gutterElement": { width: "12px", display: "flex", justifyContent: "center" },
  ".cm-matchingBracket": { backgroundColor: "var(--accent-soft)", outline: "1px solid var(--accent-mark)", borderRadius: "2px" },
  ".cm-selectionMatch": { backgroundColor: "var(--editor-match)" },
  ".cm-searchMatch": { backgroundColor: "var(--warn-soft)", outline: "1px solid var(--warn)" },
  ".cm-searchMatch.cm-searchMatch-selected": { backgroundColor: "var(--accent-soft)" },
  ".cm-foldPlaceholder": { backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text-3)", padding: "0 6px", borderRadius: "4px" },
  ".cm-tooltip": { backgroundColor: "var(--elevated)", border: "1px solid var(--border)", borderRadius: "8px", boxShadow: "var(--shadow-lg)", overflow: "hidden" },
  ".cm-tooltip-autocomplete > ul > li": { padding: "2px 10px", fontFamily: "var(--font-mono)" },
  ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "var(--accent)", color: "white" },
  ".cm-completionDetail": { opacity: "0.7", fontStyle: "normal", marginLeft: "0.8em" },
  ".cm-completionInfo": { fontFamily: "var(--font-sans)", fontSize: "12px", padding: "6px 10px", maxWidth: "320px" },
  ".cm-panels": { backgroundColor: "var(--surface)", color: "var(--text)", borderColor: "var(--border)" },
  ".cm-panels.cm-panels-top": { borderBottom: "1px solid var(--border)" },
  ".cm-search": { padding: "8px 10px", fontFamily: "var(--font-sans)", fontSize: "12px", display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" },
  ".cm-search label": { display: "inline-flex", gap: "4px", alignItems: "center", color: "var(--text-2)" },
  ".cm-textfield": { backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 8px", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "12px" },
  ".cm-button": { backgroundImage: "none", backgroundColor: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "3px 10px", color: "var(--text-2)", fontSize: "12px" },
  ".cm-button:hover": { color: "var(--text)", borderColor: "var(--border-strong)" },
  ".cm-search button[name=close]": { color: "var(--text-3)", fontSize: "16px", right: "8px" },
});

// ───────────────────────── Marks: the traced line and the lines with problems

export interface EditorProblem {
  line: number;
  severity: "error" | "warning" | "notice" | "deprecated";
  message: string;
}

interface Marks {
  trace: number | null;
  problems: EditorProblem[];
}

const setMarks = StateEffect.define<Marks>();

class InlineProblem extends WidgetType {
  constructor(
    readonly text: string,
    readonly severity: string,
  ) {
    super();
  }
  eq(o: InlineProblem) {
    return o.text === this.text && o.severity === this.severity;
  }
  toDOM() {
    const s = document.createElement("span");
    s.className = `cm-inline-problem ${this.severity}`;
    s.textContent = this.text;
    s.setAttribute("aria-hidden", "true");
    return s;
  }
}

class Dot extends GutterMarker {
  constructor(readonly kind: string) {
    super();
  }
  eq(o: Dot) {
    return o.kind === this.kind;
  }
  toDOM() {
    const s = document.createElement("span");
    s.className = `cm-gutter-mark ${this.kind}`;
    return s;
  }
}

const marksField = StateField.define<Marks>({
  create: () => ({ trace: null, problems: [] }),
  update(v, tr) {
    for (const e of tr.effects) if (e.is(setMarks)) return e.value;
    return v;
  },
});

const lineDecorations = EditorView.decorations.compute([marksField, "doc"], (state): DecorationSet => {
  const { trace, problems } = state.field(marksField);
  const byLine = new Map<number, { cls: string; widget?: Decoration }>();
  const n = state.doc.lines;
  const seen = new Set<number>();
  for (const p of [...problems].sort((a, b) => (a.severity === "error" ? -1 : 0) - (b.severity === "error" ? -1 : 0))) {
    if (p.line < 1 || p.line > n || seen.has(p.line)) continue;
    seen.add(p.line);
    const msg = p.message.length > 90 ? p.message.slice(0, 88) + "…" : p.message;
    byLine.set(p.line, {
      cls: p.severity === "error" ? "cm-error-line" : "cm-warn-line",
      widget: Decoration.widget({ widget: new InlineProblem(msg, p.severity), side: 1 }),
    });
  }
  if (trace && trace >= 1 && trace <= n) byLine.set(trace, { cls: "cm-trace-line", widget: byLine.get(trace)?.widget });
  const b = new RangeSetBuilder<Decoration>();
  for (const line of [...byLine.keys()].sort((a, c) => a - c)) {
    const info = byLine.get(line)!;
    const l = state.doc.line(line);
    b.add(l.from, l.from, Decoration.line({ class: info.cls }));
    if (info.widget) b.add(l.to, l.to, info.widget);
  }
  return b.finish();
});

const marksGutter = gutter({
  class: "cm-marks-gutter",
  lineMarker(view, line) {
    const { trace, problems } = view.state.field(marksField);
    const no = view.state.doc.lineAt(line.from).number;
    if (trace === no) return new Dot("trace");
    const p = problems.find((x) => x.line === no);
    return p ? new Dot(p.severity) : null;
  },
  lineMarkerChange: (u) => u.transactions.some((tr) => tr.effects.some((e) => e.is(setMarks))),
  initialSpacer: () => new Dot("none"),
});

// ───────────────────────── Component

export interface CodeEditorHandle {
  focus: () => void;
  openSearch: () => void;
  goToLine: (line: number) => void;
  insert: (text: string) => void;
}

export interface CursorInfo {
  line: number;
  col: number;
  selected: number;
  lines: number;
}

interface Props {
  value: string;
  lang: LangId;
  onChange?: (value: string) => void;
  onCursor?: (c: CursorInfo) => void;
  onRun?: () => void;
  ariaLabel: string;
  wrap?: boolean;
  readOnly?: boolean;
  traceLine?: number | null;
  problems?: EditorProblem[];
  /** Compact: no fold gutter, small padding (examples in lessons). */
  compact?: boolean;
}

export const CodeEditor = forwardRef<CodeEditorHandle, Props>(function CodeEditor(
  { value, lang, onChange, onCursor, onRun, ariaLabel, wrap, readOnly, traceLine = null, problems, compact },
  ref,
) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const langComp = useRef(new Compartment());
  const wrapComp = useRef(new Compartment());
  const roComp = useRef(new Compartment());
  const cb = useRef({ onChange, onCursor, onRun });
  useEffect(() => {
    cb.current = { onChange, onCursor, onRun };
  });

  useEffect(() => {
    const report = (v: EditorView) => {
      const sel = v.state.selection.main;
      const line = v.state.doc.lineAt(sel.head);
      cb.current.onCursor?.({ line: line.number, col: sel.head - line.from + 1, selected: Math.abs(sel.to - sel.from), lines: v.state.doc.lines });
    };
    const extensions: Extension[] = [
      lineNumbers(),
      marksField,
      lineDecorations,
      marksGutter,
      highlightActiveLineGutter(),
      highlightSpecialChars(),
      history(),
      compact ? [] : foldGutter({ openText: "⌄", closedText: "›" }),
      drawSelection(),
      dropCursor(),
      EditorState.allowMultipleSelections.of(true),
      EditorState.tabSize.of(4),
      indentUnit.of("    "),
      indentOnInput(),
      syntaxHighlighting(highlight),
      bracketMatching(),
      closeBrackets(),
      autocompletion({ activateOnTyping: true, override: lang.startsWith("php") ? [phpCompletions] : undefined }),
      rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      keymap.of([
        { key: "Mod-Enter", preventDefault: true, run: () => (cb.current.onRun?.(), true) },
        { key: "Mod-s", preventDefault: true, run: () => (cb.current.onRun?.(), true) },
        { key: "Mod-/", run: toggleComment },
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        indentWithTab,
      ]),
      langComp.current.of(langExtension(lang)),
      wrapComp.current.of(wrap ? EditorView.lineWrapping : []),
      roComp.current.of(readOnly ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : []),
      theme,
      EditorView.contentAttributes.of({ "aria-label": ariaLabel, spellcheck: "false", autocapitalize: "off", autocorrect: "off" }),
      EditorView.updateListener.of((u) => {
        if (u.docChanged) cb.current.onChange?.(u.state.doc.toString());
        if (u.docChanged || u.selectionSet) report(u.view);
      }),
    ];
    const v = new EditorView({ parent: host.current!, state: EditorState.create({ doc: value, extensions }) });
    view.current = v;
    report(v);
    return () => {
      v.destroy();
      view.current = null;
    };
    // The editor is created once; later prop changes go through compartments and effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // A change from outside (reset, solution, another tab) replaces the document.
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    const cur = v.state.doc.toString();
    if (cur !== value) v.dispatch({ changes: { from: 0, to: cur.length, insert: value } });
  }, [value]);

  useEffect(() => {
    view.current?.dispatch({ effects: langComp.current.reconfigure(langExtension(lang)) });
  }, [lang]);
  useEffect(() => {
    view.current?.dispatch({ effects: wrapComp.current.reconfigure(wrap ? EditorView.lineWrapping : []) });
  }, [wrap]);
  useEffect(() => {
    view.current?.dispatch({ effects: roComp.current.reconfigure(readOnly ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : []) });
  }, [readOnly]);

  const problemsKey = JSON.stringify(problems ?? []);
  useEffect(() => {
    const v = view.current;
    if (!v) return;
    v.dispatch({ effects: setMarks.of({ trace: traceLine, problems: JSON.parse(problemsKey) as EditorProblem[] }) });
    if (traceLine && traceLine <= v.state.doc.lines) {
      const pos = v.state.doc.line(traceLine).from;
      v.dispatch({ effects: EditorView.scrollIntoView(pos, { y: "nearest", yMargin: 48 }) });
    }
  }, [traceLine, problemsKey]);

  useImperativeHandle(ref, () => ({
    focus: () => view.current?.focus(),
    openSearch: () => {
      if (view.current) openSearchPanel(view.current);
    },
    goToLine: (line: number) => {
      const v = view.current;
      if (!v) return;
      const l = v.state.doc.line(Math.max(1, Math.min(line, v.state.doc.lines)));
      v.dispatch({ selection: { anchor: l.from, head: l.to }, effects: EditorView.scrollIntoView(l.from, { y: "center" }) });
      v.focus();
    },
    insert: (text: string) => {
      const v = view.current;
      if (!v) return;
      const sel = v.state.selection.main;
      v.dispatch({ changes: { from: sel.from, to: sel.to, insert: text }, selection: { anchor: sel.from + text.length } });
      v.focus();
    },
  }));

  return <div ref={host} className="h-full min-h-0" />;
});
