/**
 * Several learners on one browser. The active profile lives in the usual
 * keys (progress + playground); the others are parked in their own slots.
 * Switching parks the current profile, unparks the next one and reloads,
 * so every store rehydrates cleanly. Nothing ever leaves the browser.
 */

export const PROGRESS_KEY = "phplearn-progress";
export const PLAYGROUND_KEY = "phplearn-playground";
const INDEX_KEY = "phplearn-profiles";
const slotKey = (id: string) => `phplearn-profile:${id}`;

export interface ProfileMeta {
  id: string;
  name: string;
  avatar: string;
  createdAt: number;
}

export interface ProfileIndex {
  active: string;
  profiles: ProfileMeta[];
}

interface Parked {
  progress: string | null;
  playground: string | null;
}

export interface Backup {
  app: "phplearn";
  kind: "profile-backup";
  version: 1;
  exportedAt: string;
  profile: { name: string; avatar: string; progress: unknown; playground: unknown };
}

const get = (k: string) => {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
};
const set = (k: string, v: string | null) => {
  try {
    if (v === null) window.localStorage.removeItem(k);
    else window.localStorage.setItem(k, v);
    return true;
  } catch {
    return false;
  }
};

const newId = () => Math.random().toString(36).slice(2, 10);

function progressMeta(raw: string | null): { name: string; avatar: string } {
  try {
    const s = JSON.parse(raw ?? "{}").state ?? {};
    return { name: typeof s.name === "string" ? s.name : "", avatar: typeof s.avatar === "string" ? s.avatar : "lane-0" };
  } catch {
    return { name: "", avatar: "lane-0" };
  }
}

/** The profile list, created on first use from whatever progress already exists. */
export function readIndex(): ProfileIndex {
  try {
    const parsed = JSON.parse(get(INDEX_KEY) ?? "null") as ProfileIndex | null;
    if (parsed && parsed.active && Array.isArray(parsed.profiles) && parsed.profiles.some((p) => p.id === parsed.active)) return parsed;
  } catch {
    /* rebuild below */
  }
  const meta = progressMeta(get(PROGRESS_KEY));
  const index: ProfileIndex = { active: newId(), profiles: [] };
  index.profiles.push({ id: index.active, name: meta.name, avatar: meta.avatar, createdAt: Date.now() });
  set(INDEX_KEY, JSON.stringify(index));
  return index;
}

/** Keep the list's name and color in step with the active profile. */
export function syncActiveMeta(name: string, avatar: string) {
  const index = readIndex();
  const me = index.profiles.find((p) => p.id === index.active);
  if (!me || (me.name === name && me.avatar === avatar)) return;
  me.name = name;
  me.avatar = avatar;
  set(INDEX_KEY, JSON.stringify(index));
}

function park(index: ProfileIndex) {
  const parked: Parked = { progress: get(PROGRESS_KEY), playground: get(PLAYGROUND_KEY) };
  set(slotKey(index.active), JSON.stringify(parked));
}

function unpark(id: string) {
  let parked: Parked = { progress: null, playground: null };
  try {
    parked = JSON.parse(get(slotKey(id)) ?? "null") ?? parked;
  } catch {
    /* empty profile */
  }
  set(PROGRESS_KEY, parked.progress);
  set(PLAYGROUND_KEY, parked.playground);
  set(slotKey(id), null);
}

export function switchProfile(id: string, to = "/learn") {
  const index = readIndex();
  if (id === index.active || !index.profiles.some((p) => p.id === id)) return;
  park(index);
  unpark(id);
  set(INDEX_KEY, JSON.stringify({ ...index, active: id }));
  window.location.assign(withBase(to));
}

/** A fresh learner: parks the current profile and starts the welcome tour. */
export function createProfile(name: string) {
  const index = readIndex();
  park(index);
  const id = newId();
  index.profiles.push({ id, name: name.trim(), avatar: `lane-${index.profiles.length % 6}`, createdAt: Date.now() });
  set(PROGRESS_KEY, null);
  set(PLAYGROUND_KEY, null);
  set(INDEX_KEY, JSON.stringify({ ...index, active: id }));
  if (name.trim()) set(PROGRESS_KEY, JSON.stringify({ version: 1, state: { name: name.trim(), avatar: `lane-${(index.profiles.length - 1) % 6}` } }));
  window.location.assign(withBase("/welcome"));
}

export function deleteProfile(id: string) {
  const index = readIndex();
  if (id === index.active) return false;
  set(slotKey(id), null);
  set(INDEX_KEY, JSON.stringify({ ...index, profiles: index.profiles.filter((p) => p.id !== id) }));
  return true;
}

/** The saved progress of every profile on this browser (the active one from its live key). */
export function readAllProgress(): Array<{ meta: ProfileMeta; active: boolean; state: unknown }> {
  const index = readIndex();
  return index.profiles.map((meta) => {
    const active = meta.id === index.active;
    let state: unknown = null;
    try {
      const raw = active ? get(PROGRESS_KEY) : ((JSON.parse(get(slotKey(meta.id)) ?? "null") as Parked | null)?.progress ?? null);
      state = raw ? (JSON.parse(raw) as { state?: unknown }).state ?? null : null;
    } catch {
      state = null;
    }
    return { meta, active, state };
  });
}

// ───────────────────────────────────────────── Backup

export function makeBackup(): Backup {
  const progress = JSON.parse(get(PROGRESS_KEY) ?? "null");
  const meta = progressMeta(get(PROGRESS_KEY));
  return {
    app: "phplearn",
    kind: "profile-backup",
    version: 1,
    exportedAt: new Date().toISOString(),
    profile: { name: meta.name, avatar: meta.avatar, progress, playground: JSON.parse(get(PLAYGROUND_KEY) ?? "null") },
  };
}

export function downloadBackup() {
  const backup = makeBackup();
  const slug = (backup.profile.name || "profile").toLowerCase().normalize("NFD").replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") || "profile";
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `phplearn-${slug}-${backup.exportedAt.slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export type ImportError = "not-json" | "not-backup" | "no-progress";

export function parseBackup(text: string): Backup | ImportError {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return "not-json";
  }
  const b = data as Partial<Backup>;
  if (!b || b.app !== "phplearn" || b.kind !== "profile-backup" || !b.profile) return "not-backup";
  const progress = b.profile.progress as { state?: unknown } | null;
  if (!progress || typeof progress !== "object" || !progress.state) return "no-progress";
  return b as Backup;
}

/** Restore a backup as a new profile next to the existing ones (never overwrites), then switch to it. */
export function restoreBackup(backup: Backup) {
  const index = readIndex();
  park(index);
  const id = newId();
  index.profiles.push({ id, name: backup.profile.name, avatar: backup.profile.avatar, createdAt: Date.now() });
  set(PROGRESS_KEY, JSON.stringify(backup.profile.progress));
  set(PLAYGROUND_KEY, backup.profile.playground ? JSON.stringify(backup.profile.playground) : null);
  set(INDEX_KEY, JSON.stringify({ ...index, active: id }));
  window.location.assign(withBase("/profile"));
}

// ───────────────────────────────────────────── What's stored

export interface StoredItem {
  key: string;
  bytes: number;
  kind: "progress" | "playground" | "profiles" | "parked" | "layout";
}

export function storageReport(): StoredItem[] {
  const out: StoredItem[] = [];
  try {
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)!;
      if (!key.startsWith("phplearn") && !key.startsWith("phpl-")) continue;
      const bytes = new Blob([key + (window.localStorage.getItem(key) ?? "")]).size;
      const kind =
        key === PROGRESS_KEY ? "progress" : key === PLAYGROUND_KEY ? "playground" : key === INDEX_KEY ? "profiles" : key.startsWith("phplearn-profile:") ? "parked" : "layout";
      out.push({ key, bytes, kind });
    }
  } catch {
    /* storage unavailable */
  }
  return out.sort((a, b) => b.bytes - a.bytes);
}

export function eraseEverything() {
  for (const item of storageReport()) set(item.key, null);
  window.location.assign(withBase("/"));
}

/** Pages are served under a base path on GitHub Pages (e.g. /phplearn). */
function withBase(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}${path}`;
}
