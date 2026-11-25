"use client";

import { clsx } from "clsx";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { ArrowDown, ArrowRight, Globe, Monitor, Server } from "lucide-react";
import type { SceneId } from "@/features/curriculum/types";
import { useL } from "@/i18n";

/** Small illustrated diagrams for Discover steps. Each one explains one idea visually. */
export function Scene({ id }: { id: SceneId }) {
  const S = SCENES[id];
  return (
    <div className="bg-dots overflow-hidden rounded-xl border border-line bg-surface p-4 shadow-[var(--shadow-card)] sm:p-5" role="img" aria-label={id}>
      <S />
    </div>
  );
}

/** Cycles 0..n-1 every `ms`, to animate a scene step by step. */
function useTick(n: number, ms = 1400) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % n), ms);
    return () => clearInterval(t);
  }, [n, ms]);
  return i;
}

const Box = ({ children, className, on }: { children: ReactNode; className?: string; on?: boolean }) => (
  <div className={clsx("rounded-lg border bg-elevated px-3 py-2 text-sm shadow-[0_2px_0_var(--edge)] transition-colors", on ? "border-accent-mark ring-2 ring-accent-soft" : "border-line", className)}>{children}</div>
);
const Mono = ({ children, className }: { children: ReactNode; className?: string }) => <code className={clsx("font-mono text-[12.5px]", className)}>{children}</code>;

function RequestScene() {
  const l = useL();
  const i = useTick(4);
  const steps = [
    [Monitor, l("Browser asks", "Le navigateur demande"), "GET /hello.php?name=Ada"],
    [Server, l("Server runs PHP", "Le serveur exécute PHP"), "hello.php, top to bottom"],
    [Globe, l("PHP prints HTML", "PHP affiche du HTML"), "<h1>Hello Ada</h1>"],
    [Monitor, l("Browser shows it", "Le navigateur l'affiche"), "Hello Ada"],
  ] as const;
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      {steps.map(([Icon, title, code], k) => (
        <div key={k} className="contents">
          <Box on={i === k} className="text-center">
            <Icon className={clsx("mx-auto size-5", i === k ? "text-accent-fg" : "text-fg-3")} />
            <p className="mt-1 text-xs font-semibold">{title}</p>
            <Mono className="mt-0.5 block truncate text-[11px] text-fg-2">{code}</Mono>
          </Box>
          {k < 3 && <ArrowRight className={clsx("mx-auto size-4 max-sm:rotate-90", i === k ? "text-accent-fg" : "text-fg-3")} />}
        </div>
      ))}
    </div>
  );
}

function VariablesScene() {
  const l = useL();
  const i = useTick(4);
  const vars: Array<[string, string, string]> = [
    ["$name", '"Ada"', "string"],
    ["$age", i >= 2 ? "37" : "36", "int"],
    ["$paid", i >= 3 ? "true" : "false", "bool"],
  ];
  const code = ['$name = "Ada";', "$age = 36;", "$age = $age + 1;", "$paid = true;"];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1 rounded-lg bg-[var(--editor-bg)] p-3 font-mono text-[12.5px]">
        {code.map((c, k) => (
          <p key={k} className={clsx("rounded px-1.5", k === i && "bg-accent-soft")}>
            {c}
          </p>
        ))}
      </div>
      <div className="flex flex-wrap items-end gap-3">
        {vars.map(([n, v, t], k) => (
          <motion.div key={n} layout className="text-center">
            <motion.div
              key={v}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={clsx("grid h-14 min-w-20 place-items-center rounded-lg border-2 border-dashed bg-elevated px-2 font-mono text-sm", k === Math.min(i, 2) || (k === 1 && i === 2) ? "border-accent-mark" : "border-line-strong")}
            >
              {v}
            </motion.div>
            <p className="mt-1 font-mono text-xs font-semibold text-[var(--syn-variable)]">{n}</p>
            <p className="text-[10px] text-fg-3">{t}</p>
          </motion.div>
        ))}
        <p className="w-full text-xs text-fg-3">{l("A variable is a labelled box. Assigning replaces what's inside.", "Une variable est une boîte étiquetée. Affecter remplace ce qu'il y a dedans.")}</p>
      </div>
    </div>
  );
}

function TypesScene() {
  const l = useL();
  const types: Array<[string, string, string, string]> = [
    ["int", "42, -7, 0", l("whole numbers", "nombres entiers"), "var(--syn-number)"],
    ["float", "3.14, 0.5", l("decimals", "décimaux"), "var(--syn-number)"],
    ["string", '"hello"', l("text", "texte"), "var(--syn-string)"],
    ["bool", "true, false", l("yes / no", "oui / non"), "var(--syn-keyword)"],
    ["array", "[1, 2, 3]", l("lists & maps", "listes et dictionnaires"), "var(--syn-property)"],
    ["null", "null", l("no value", "pas de valeur"), "var(--syn-keyword)"],
    ["object", "new User()", l("things with behaviour", "des choses avec un comportement"), "var(--syn-type)"],
  ];
  return (
    <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
      {types.map(([t, ex, desc, color]) => (
        <Box key={t}>
          <p className="font-mono text-sm font-semibold" style={{ color }}>
            {t}
          </p>
          <Mono className="text-fg-2">{ex}</Mono>
          <p className="text-[11px] text-fg-3">{desc}</p>
        </Box>
      ))}
    </div>
  );
}

function ArrayScene() {
  const l = useL();
  const i = useTick(2, 2600);
  const list = ["apple", "pear", "kiwi"];
  const map: Array<[string, string]> = [
    ["name", '"Ada"'],
    ["lang", '"PHP"'],
    ["year", "1995"],
  ];
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className={clsx("transition-opacity", i === 0 ? "opacity-100" : "opacity-60")}>
        <p className="text-xs font-semibold text-fg-2">{l("A list: keys are 0, 1, 2…", "Une liste : les clés sont 0, 1, 2…")}</p>
        <div className="mt-2 flex">
          {list.map((v, k) => (
            <div key={v} className="flex-1 border border-line bg-elevated text-center first:rounded-l-lg last:rounded-r-lg">
              <p className="border-b border-line bg-surface-2 font-mono text-[11px] text-fg-3">{k}</p>
              <p className="py-2 font-mono text-[12.5px] text-[var(--syn-string)]">&quot;{v}&quot;</p>
            </div>
          ))}
        </div>
        <Mono className="mt-2 block text-fg-2">$fruits[1] → &quot;pear&quot;</Mono>
      </div>
      <div className={clsx("transition-opacity", i === 1 ? "opacity-100" : "opacity-60")}>
        <p className="text-xs font-semibold text-fg-2">{l("An associative array: you choose the keys", "Un tableau associatif : tu choisis les clés")}</p>
        <div className="mt-2 overflow-hidden rounded-lg border border-line bg-elevated">
          {map.map(([k, v]) => (
            <div key={k} className="flex border-b border-line last:border-b-0 font-mono text-[12.5px]">
              <span className="w-20 border-r border-line bg-surface-2 px-2 py-1 text-[var(--syn-property)]">&apos;{k}&apos;</span>
              <span className="px-2 py-1">{v}</span>
            </div>
          ))}
        </div>
        <Mono className="mt-2 block text-fg-2">$user[&apos;lang&apos;] → &quot;PHP&quot;</Mono>
      </div>
    </div>
  );
}

function LoopScene() {
  const l = useL();
  const i = useTick(5, 1100);
  const items = ["🍎", "🍐", "🥝"];
  const phase = i < 3 ? i : -1;
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
      <pre className="rounded-lg bg-[var(--editor-bg)] p-3 font-mono text-[12.5px] leading-relaxed">
        <span className={clsx("block rounded px-1", phase >= 0 && "bg-accent-soft")}>foreach ($fruits as $fruit) {"{"}</span>
        <span className={clsx("block rounded px-1 pl-6", phase >= 0 && "bg-accent-soft/60")}>echo $fruit;</span>
        <span className="block px-1">{"}"}</span>
        <span className={clsx("block rounded px-1", i >= 3 && "bg-ok-soft")}>echo &quot;done&quot;;</span>
      </pre>
      <div>
        <div className="flex gap-2">
          {items.map((f, k) => (
            <motion.span key={k} animate={{ scale: phase === k ? 1.25 : 1, opacity: phase === -1 || phase >= k ? 1 : 0.35 }} className="grid size-12 place-items-center rounded-lg border border-line bg-elevated text-xl">
              {f}
            </motion.span>
          ))}
        </div>
        <p className="mt-2 text-xs text-fg-2">
          {phase >= 0 ? l(`Round ${phase + 1}: $fruit holds item ${phase}`, `Tour ${phase + 1} : $fruit contient l'élément ${phase}`) : l("No items left: the loop ends and PHP moves on.", "Plus d'éléments : la boucle s'arrête et PHP continue.")}
        </p>
      </div>
    </div>
  );
}

function FunctionScene() {
  const l = useL();
  const i = useTick(4);
  return (
    <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
      <Box on={i === 0}>
        <p className="text-[11px] text-fg-3">{l("arguments in", "arguments en entrée")}</p>
        <Mono>2, 3</Mono>
      </Box>
      <ArrowRight className="size-4 text-fg-3 max-sm:rotate-90" />
      <Box on={i === 1 || i === 2} className="min-w-48">
        <Mono className="text-[var(--syn-keyword)]">function</Mono> <Mono className="text-[var(--syn-function)]">add</Mono>
        <Mono>($a, $b)</Mono>
        <p className="mt-1 rounded bg-surface-2 px-2 py-1 font-mono text-[12px]">{i >= 2 ? "return 2 + 3;" : "return $a + $b;"}</p>
      </Box>
      <ArrowRight className="size-4 text-fg-3 max-sm:rotate-90" />
      <Box on={i === 3}>
        <p className="text-[11px] text-fg-3">{l("value out", "valeur en sortie")}</p>
        <Mono className="text-[var(--syn-number)]">5</Mono>
      </Box>
    </div>
  );
}

function ScopeScene() {
  const l = useL();
  const i = useTick(4, 1300);
  const stack = ["{main}", "total()", "price()", "tax()"].slice(0, i + 1).reverse();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <p className="text-xs font-semibold text-fg-2">{l("The call stack", "La pile d'appels")}</p>
        <div className="mt-2 flex min-h-40 flex-col justify-end gap-1">
          {stack.map((f, k) => (
            <motion.div key={f} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={clsx("rounded-md border px-3 py-1.5 font-mono text-[12.5px]", k === 0 ? "border-accent-mark bg-accent-soft" : "border-line bg-elevated")}>
              {f}
            </motion.div>
          ))}
        </div>
      </div>
      <p className="self-center text-sm leading-relaxed text-fg-2">
        {l(
          "Each call gets its own frame with its own local variables, stacked on top of the caller. When a function returns, its frame (and its variables) disappear. The Trace tab shows this stack at every step.",
          "Chaque appel reçoit son propre cadre avec ses propres variables locales, empilé sur celui de l'appelant. Quand une fonction se termine, son cadre (et ses variables) disparaissent. L'onglet Trace montre cette pile à chaque étape.",
        )}
      </p>
    </div>
  );
}

function ClassScene() {
  const l = useL();
  const objects: Array<[string, string, string]> = [
    ["$a", "Ada", "500"],
    ["$b", "Linus", "120"],
  ];
  return (
    <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_1.2fr]">
      <Box>
        <p className="text-[11px] text-fg-3">{l("the class: a blueprint", "la classe : un plan")}</p>
        <p className="font-mono text-sm font-semibold text-[var(--syn-type)]">Account</p>
        <p className="mt-1 font-mono text-[12px] text-fg-2">- string $owner</p>
        <p className="font-mono text-[12px] text-fg-2">- int $balance</p>
        <p className="font-mono text-[12px] text-[var(--syn-function)]">+ deposit(int $amount)</p>
      </Box>
      <ArrowRight className="mx-auto size-4 text-fg-3 max-sm:rotate-90" />
      <div className="space-y-2">
        {objects.map(([v, o, b]) => (
          <Box key={v} className="flex items-center gap-3">
            <Mono className="text-[var(--syn-variable)]">{v}</Mono>
            <span className="text-fg-3">→</span>
            <span className="text-[12px]">
              <Mono className="text-[var(--syn-type)]">Account</Mono> {"{"} owner: <Mono className="text-[var(--syn-string)]">&quot;{o}&quot;</Mono>, balance: <Mono className="text-[var(--syn-number)]">{b}</Mono> {"}"}
            </span>
          </Box>
        ))}
        <p className="text-xs text-fg-3">{l("Objects: each `new` builds one from the blueprint, with its own data.", "Les objets : chaque `new` en construit un à partir du plan, avec ses propres données.")}</p>
      </div>
    </div>
  );
}

function InheritanceScene() {
  const l = useL();
  return (
    <div className="flex flex-col items-center gap-1">
      <Box className="text-center">
        <Mono className="text-[var(--syn-type)]">abstract class Shape</Mono>
        <p className="font-mono text-[11.5px] text-fg-2">area(): float · describe()</p>
      </Box>
      <div className="flex gap-10">
        <ArrowDown className="size-4 rotate-180 text-fg-3" />
        <ArrowDown className="size-4 rotate-180 text-fg-3" />
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        {["Circle", "Rectangle"].map((c) => (
          <Box key={c} className="text-center">
            <Mono className="text-[var(--syn-type)]">{c} extends Shape</Mono>
            <p className="font-mono text-[11.5px] text-fg-2">area() {"{"} … {"}"}</p>
          </Box>
        ))}
      </div>
      <p className="mt-2 max-w-md text-center text-xs text-fg-3">{l("Children inherit everything from the parent and override what differs. Code that expects a Shape accepts any of them.", "Les enfants héritent de tout le parent et redéfinissent ce qui diffère. Le code qui attend une Shape accepte n'importe lequel.")}</p>
    </div>
  );
}

function ExceptionScene() {
  const l = useL();
  const i = useTick(4, 1300);
  const frames = ["{main}  try { … } catch", "checkout()", "pay()", "charge()  throw"];
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col-reverse gap-1">
        {frames.map((f, k) => {
          const unwound = i >= 1 && k > 3 - i;
          return (
            <div
              key={f}
              className={clsx(
                "rounded-md border px-3 py-1.5 font-mono text-[12px] transition-all",
                k === 0 && i === 3 ? "border-ok bg-ok-soft" : unwound ? "border-bad/30 bg-bad-soft line-through opacity-50" : k === 3 && i === 0 ? "border-bad bg-bad-soft" : "border-line bg-elevated",
              )}
            >
              {f}
            </div>
          );
        })}
      </div>
      <p className="self-center text-sm leading-relaxed text-fg-2">
        {i === 0
          ? l("charge() throws an exception…", "charge() lance une exception…")
          : i < 3
            ? l("…PHP leaves each function in turn, looking for a catch…", "…PHP quitte chaque fonction tour à tour, en cherchant un catch…")
            : l("…and the catch in {main} handles it. With no catch at all, the script stops with “Uncaught”.", "…et le catch de {main} la gère. Sans aucun catch, le script s'arrête avec « Uncaught ».")}
      </p>
    </div>
  );
}

function TimelineScene() {
  const l = useL();
  const versions: Array<[string, string, string]> = [
    ["7.0", "2015", l("2× faster, scalar types", "2× plus rapide, types scalaires")],
    ["7.4", "2019", l("typed properties, fn()", "propriétés typées, fn()")],
    ["8.0", "2020", l("match, named args, JIT", "match, arguments nommés, JIT")],
    ["8.1", "2021", l("enums, readonly", "enums, readonly")],
    ["8.2", "2022", l("readonly classes", "classes readonly")],
    ["8.3", "2023", l("typed constants", "constantes typées")],
    ["8.4", "2024", l("property hooks", "property hooks")],
    ["8.5", "2025", l("pipe operator |>", "opérateur pipe |>")],
  ];
  return (
    <ol className="relative grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
      {versions.map(([v, y, what], k) => (
        <motion.li key={v} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.08 }} className="rounded-lg border border-line bg-elevated p-2 text-center shadow-[0_2px_0_var(--edge)]">
          <span className="mx-auto block size-2.5 rounded-full" style={{ background: `var(--lane-${k % 6})` }} />
          <p className="mt-1 font-mono text-sm font-semibold">PHP {v}</p>
          <p className="text-[10px] text-fg-3">{y}</p>
          <p className="mt-1 text-[11px] leading-tight text-fg-2">{what}</p>
        </motion.li>
      ))}
    </ol>
  );
}

function CompileScene() {
  const l = useL();
  const i = useTick(4);
  const steps = [
    [l("Your code", "Ton code"), "<?php echo 1 + 2;"],
    [l("Tokens", "Jetons"), "T_ECHO T_LNUMBER + T_LNUMBER"],
    [l("Opcodes", "Opcodes"), "ADD 1 2 → ECHO"],
    [l("Output", "Sortie"), "3"],
  ];
  return (
    <div className="grid items-center gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      {steps.map(([t, c], k) => (
        <div key={k} className="contents">
          <Box on={i === k} className="text-center">
            <p className="text-xs font-semibold">{t}</p>
            <Mono className="text-[11px] text-fg-2">{c}</Mono>
          </Box>
          {k < 3 && <ArrowRight className="mx-auto size-4 text-fg-3 max-sm:rotate-90" />}
        </div>
      ))}
    </div>
  );
}

const SCENES: Record<SceneId, () => React.JSX.Element> = {
  request: RequestScene,
  variables: VariablesScene,
  types: TypesScene,
  array: ArrayScene,
  loop: LoopScene,
  function: FunctionScene,
  scope: ScopeScene,
  class: ClassScene,
  inheritance: InheritanceScene,
  exception: ExceptionScene,
  timeline: TimelineScene,
  compile: CompileScene,
};
