"use client";

import { clsx } from "clsx";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Globe, LayoutTemplate, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/components/ui/misc";
import { Ide, type Files } from "@/features/ide/ide";
import { PLAYGROUND_KEY } from "@/features/progress/profiles";
import { useProgress } from "@/features/progress/store";
import { useL, usePick } from "@/i18n";
import { LATEST, PHP_VERSIONS, type PhpVersion } from "@/php/types";
import { TEMPLATES, type Template } from "./templates";

type Request = NonNullable<Template["request"]>;

interface PlaygroundSave {
  files: Files;
  version: PhpVersion;
  request?: Request;
}

function load(): PlaygroundSave | null {
  try {
    const raw = localStorage.getItem(PLAYGROUND_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as PlaygroundSave;
    return s && s.files && s.files["index.php"] !== undefined ? s : null;
  } catch {
    return null;
  }
}

export function Playground() {
  const hydrated = useHydrated();
  if (!hydrated) return <div className="h-full" aria-busy="true" />;
  return <PlaygroundInner />;
}

function PlaygroundInner() {
  const l = useL();
  const [initial] = useState<PlaygroundSave>(() => {
    // ?code=… (from "Open in the Playground") wins once, then the saved project, then Hello world.
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const v = params.get("v") as PhpVersion | null;
    if (code) {
      window.history.replaceState(null, "", window.location.pathname);
      return { files: { "index.php": code }, version: v && PHP_VERSIONS.includes(v) ? v : LATEST };
    }
    return load() ?? { files: TEMPLATES[0].files, version: useProgress.getState().settings.phpVersion ?? LATEST };
  });
  const [files, setFiles] = useState<Files>(initial.files);
  const [version, setVersion] = useState<PhpVersion>(initial.version);
  const [request, setRequest] = useState<Request | undefined>(initial.request);
  const [menu, setMenu] = useState<null | "templates" | "request">(null);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(PLAYGROUND_KEY, JSON.stringify({ files, version, request }));
      } catch {
        /* storage full or unavailable */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [files, version, request]);

  const apply = (t: Template) => {
    if (JSON.stringify(files) !== JSON.stringify(TEMPLATES[0].files) && !window.confirm(l("Replace your current files with this template?", "Remplacer tes fichiers actuels par ce modèle ?"))) return;
    setFiles(t.files);
    if (t.version) setVersion(t.version);
    setRequest(t.request);
    setMenu(null);
  };

  return (
    <div className="relative h-full">
      <Ide
        files={files}
        onFilesChange={setFiles}
        version={version}
        onVersionChange={setVersion}
        request={request}
        editableTree
        where="playground"
        toolbar={
          <>
            <ToolbarButton active={menu === "templates"} onClick={() => setMenu(menu === "templates" ? null : "templates")} icon={<LayoutTemplate className="size-3.5" />}>
              {l("Templates", "Modèles")}
            </ToolbarButton>
            <ToolbarButton active={menu === "request" || !!request} onClick={() => setMenu(menu === "request" ? null : "request")} icon={<Globe className="size-3.5" />}>
              {request ? `${request.method ?? "GET"} ${Object.keys({ ...request.query, ...request.body }).length}` : l("Request", "Requête")}
            </ToolbarButton>
          </>
        }
      />
      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute top-12 left-2 z-40 w-[min(26rem,calc(100%-1rem))] rounded-xl border border-line bg-elevated p-3 shadow-[var(--shadow-lg)]"
          >
            <button onClick={() => setMenu(null)} className="absolute top-2 right-2 grid size-7 place-items-center rounded-md text-fg-3 hover:bg-surface-2" aria-label={l("Close", "Fermer")}>
              <X className="size-4" />
            </button>
            {menu === "templates" ? <TemplateList onPick={apply} /> : <RequestEditor value={request} onChange={setRequest} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolbarButton({ active, onClick, icon, children }: { active?: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={clsx("flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium", active ? "bg-accent-soft text-accent-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg")}
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
      <ChevronDown className="size-3 opacity-60" />
    </button>
  );
}

function TemplateList({ onPick }: { onPick: (t: Template) => void }) {
  const l = useL();
  const pick = usePick();
  return (
    <div>
      <p className="text-sm font-semibold">{l("Start from a template", "Partir d'un modèle")}</p>
      <ul className="mt-2 space-y-1">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <button onClick={() => onPick(t)} className="w-full rounded-lg px-2.5 py-2 text-left hover:bg-surface-2">
              <span className="flex items-center gap-2 text-sm font-medium">
                {pick(t.title)}
                {t.version && <span className="rounded-full bg-accent-soft px-1.5 font-mono text-[10px] text-accent-fg">PHP {t.version}</span>}
                {Object.keys(t.files).length > 1 && <span className="text-[11px] text-fg-3">{l(`${Object.keys(t.files).length} files`, `${Object.keys(t.files).length} fichiers`)}</span>}
              </span>
              <span className="block text-xs text-fg-2">{pick(t.description)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestEditor({ value, onChange }: { value?: Request; onChange: (r: Request | undefined) => void }) {
  const l = useL();
  const method = value?.method ?? "GET";
  const params = Object.entries((method === "POST" ? value?.body : value?.query) ?? {});
  const [rows, setRows] = useState<Array<[string, string]>>(params.length ? params : [["name", "Ada"]]);
  const first = useRef(true);
  const [m, setM] = useState<"GET" | "POST">(method);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const data = Object.fromEntries(rows.filter(([k]) => k.trim()));
    onChange(m === "POST" ? { method: "POST", body: data } : { method: "GET", query: data });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows, m]);
  return (
    <div>
      <p className="text-sm font-semibold">{l("Simulated web request", "Requête web simulée")}</p>
      <p className="mt-0.5 text-xs text-fg-2">
        {l("Your script runs as if a browser requested it. Read the values with $_GET or $_POST.", "Ton script tourne comme si un navigateur l'avait demandé. Lis les valeurs avec $_GET ou $_POST.")}
      </p>
      <div className="mt-3 flex gap-1 rounded-lg bg-surface-2 p-1 text-xs font-semibold" role="radiogroup">
        {(["GET", "POST"] as const).map((x) => (
          <button key={x} role="radio" aria-checked={m === x} onClick={() => setM(x)} className={clsx("flex-1 rounded-md py-1", m === x ? "bg-elevated shadow-sm" : "text-fg-3")}>
            {x}
          </button>
        ))}
      </div>
      <ul className="mt-3 space-y-1.5">
        {rows.map(([k, v], i) => (
          <li key={i} className="flex items-center gap-1.5">
            <input
              value={k}
              onChange={(e) => setRows(rows.map((r, j) => (j === i ? [e.target.value, r[1]] : r)))}
              placeholder="key"
              aria-label={l("Parameter name", "Nom du paramètre")}
              className="w-28 rounded-md border border-line bg-surface px-2 py-1 font-mono text-xs outline-none focus:border-accent"
            />
            <span className="text-fg-3">=</span>
            <input
              value={v}
              onChange={(e) => setRows(rows.map((r, j) => (j === i ? [r[0], e.target.value] : r)))}
              placeholder="value"
              aria-label={l("Parameter value", "Valeur du paramètre")}
              className="min-w-0 flex-1 rounded-md border border-line bg-surface px-2 py-1 font-mono text-xs outline-none focus:border-accent"
            />
            <button onClick={() => setRows(rows.filter((_, j) => j !== i))} className="grid size-7 place-items-center rounded-md text-fg-3 hover:text-bad" aria-label={l("Remove", "Retirer")}>
              <Trash2 className="size-3.5" />
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex items-center gap-2">
        <Button size="sm" variant="secondary" onClick={() => setRows([...rows, ["", ""]])}>
          <Plus className="size-3.5" /> {l("Add a parameter", "Ajouter un paramètre")}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onChange(undefined)}>
          {l("No request", "Pas de requête")}
        </Button>
      </div>
      <p className="mt-3 rounded-md bg-surface-2 px-2 py-1.5 font-mono text-[11px] break-all text-fg-2">
        {m} /index.php{m === "GET" && rows.some(([k]) => k) ? "?" + new URLSearchParams(Object.fromEntries(rows.filter(([k]) => k))).toString() : ""}
      </p>
    </div>
  );
}
