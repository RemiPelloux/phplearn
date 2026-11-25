"use client";

import { clsx } from "clsx";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Download, HardDrive, Plus, RotateCcw, Trash2, Upload, UserRoundPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/misc";
import { useL } from "@/i18n";
import {
  createProfile,
  deleteProfile,
  downloadBackup,
  eraseEverything,
  parseBackup,
  PLAYGROUND_KEY,
  readIndex,
  restoreBackup,
  storageReport,
  switchProfile,
  syncActiveMeta,
  type ProfileIndex,
  type StoredItem,
} from "./profiles";
import { useProgress } from "./store";

const fmtBytes = (n: number, locale: string) =>
  n < 1024 ? `${n} B` : `${(n / 1024).toLocaleString(locale, { maximumFractionDigits: 1 })} KB`;

/** Profiles on this browser: switch, add, remove. */
export function ProfilesSection() {
  const l = useL();
  const name = useProgress((s) => s.name);
  const avatar = useProgress((s) => s.avatar);
  const [index, setIndex] = useState<ProfileIndex>(() => readIndex());
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    syncActiveMeta(name, avatar);
  }, [name, avatar]);

  return (
    <section aria-labelledby="profiles-title" id="profiles" className="scroll-mt-20">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="profiles-title" className="text-lg font-semibold">
            {l("Profiles on this browser", "Profils sur ce navigateur")}
          </h2>
          <p className="text-sm text-fg-2">
            {l(
              "Sharing a computer? Each learner gets their own name, XP, lessons and playground. Switching takes a second and reloads the page.",
              "Un ordinateur partagé ? Chaque personne a son nom, son XP, ses leçons et son bac à sable. Changer de profil prend une seconde et recharge la page.",
            )}
          </p>
        </div>
        {!adding && (
          <Button variant="secondary" size="sm" onClick={() => setAdding(true)}>
            <UserRoundPlus className="size-4" /> {l("Add a profile", "Ajouter un profil")}
          </Button>
        )}
      </div>
      <Card className="divide-y divide-line">
        {index.profiles.map((pr) => {
          const active = pr.id === index.active;
          return (
            <div key={pr.id} className={clsx("flex flex-wrap items-center gap-3 px-4 py-3", active && "bg-accent-soft/40")}>
              <Avatar name={active ? name : pr.name} color={(active ? avatar : pr.avatar) as never} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{(active ? name : pr.name) || l("Guest learner", "Apprenant invité")}</p>
                <p className="text-xs text-fg-3">
                  {active ? l("Active now", "Actif") : l(`Added ${new Date(pr.createdAt).toLocaleDateString()}`, `Ajouté le ${new Date(pr.createdAt).toLocaleDateString("fr")}`)}
                </p>
              </div>
              {active ? (
                <span className="flex items-center gap-1 rounded-full bg-ok-soft px-2 py-0.5 text-xs font-semibold text-ok">
                  <Check className="size-3.5" /> {l("You", "Toi")}
                </span>
              ) : confirmDelete === pr.id ? (
                <span className="flex items-center gap-2">
                  <span className="text-xs text-fg-2">{l("Delete this profile and its progress?", "Supprimer ce profil et sa progression ?")}</span>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(null)}>
                    {l("Keep", "Garder")}
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      deleteProfile(pr.id);
                      setConfirmDelete(null);
                      setIndex(readIndex());
                    }}
                  >
                    {l("Delete", "Supprimer")}
                  </Button>
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Button size="sm" onClick={() => switchProfile(pr.id)} aria-label={l(`Switch to ${pr.name || "Guest learner"}`, `Utiliser le profil ${pr.name || "Apprenant invité"}`)}>
                    {l("Switch", "Utiliser")}
                  </Button>
                  <button
                    onClick={() => setConfirmDelete(pr.id)}
                    className="grid size-8 place-items-center rounded-lg text-fg-3 hover:bg-surface-2 hover:text-bad"
                    aria-label={l(`Delete profile ${pr.name}`, `Supprimer le profil ${pr.name}`)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </span>
              )}
            </div>
          );
        })}
        {adding && (
          <form
            className="flex flex-wrap items-center gap-2 px-4 py-3"
            onSubmit={(e) => {
              e.preventDefault();
              createProfile(newName);
            }}
          >
            <label htmlFor="new-profile" className="sr-only">
              {l("First name or nickname", "Prénom ou pseudo")}
            </label>
            <input
              id="new-profile"
              autoFocus
              value={newName}
              maxLength={30}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={l("First name or nickname", "Prénom ou pseudo")}
              className="min-w-0 flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm outline-none focus:border-accent"
            />
            <Button type="submit" size="sm">
              <Plus className="size-4" /> {l("Create and start", "Créer et commencer")}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setAdding(false)}>
              {l("Cancel", "Annuler")}
            </Button>
            <p className="w-full text-xs text-fg-3">
              {l("Your progress stays safe in this browser. The new profile starts with the welcome tour.", "Ta progression reste en sécurité dans ce navigateur. Le nouveau profil commence par la visite de bienvenue.")}
            </p>
          </form>
        )}
      </Card>
    </section>
  );
}

/** What's stored, backup, restore, reset, erase. */
export function DataSection() {
  const l = useL();
  const locale = useProgress((s) => s.settings.locale) ?? "en";
  const resetProgress = useProgress((s) => s.resetProgress);
  const [items, setItems] = useState<StoredItem[]>(() => storageReport());
  const [importError, setImportError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<"reset" | "erase" | null>(null);
  const file = useRef<HTMLInputElement>(null);
  const refresh = () => setItems(storageReport());
  const total = items.reduce((n, i) => n + i.bytes, 0);
  const describe: Record<StoredItem["kind"], string> = {
    progress: l("Your progress: name, XP, lessons, stars, badges, settings and unfinished lessons", "Ta progression : nom, XP, leçons, étoiles, badges, réglages et leçons en cours"),
    playground: l("Your Playground files", "Tes fichiers du bac à sable"),
    profiles: l("The list of profiles on this browser", "La liste des profils de ce navigateur"),
    parked: l("Another profile, waiting for you to switch back", "Un autre profil, qui attend que tu reviennes"),
    layout: l("Panel sizes you chose in the workspace", "Les tailles de panneaux choisies dans l'espace de travail"),
  };

  // A file input can report the same pick twice (input + change): restore only once.
  const restoring = useRef(false);
  const onFile = async (f: File | undefined) => {
    setImportError(null);
    if (!f || restoring.current) return;
    restoring.current = true;
    const result = parseBackup(await f.text());
    if (file.current) file.current.value = "";
    if (typeof result === "string") restoring.current = false;
    if (typeof result === "string")
      setImportError(
        result === "not-json"
          ? l("That file isn't JSON. Pick the .json file you got from Download backup.", "Ce fichier n'est pas du JSON. Choisis le fichier .json obtenu avec Télécharger une sauvegarde.")
          : result === "not-backup"
            ? l("That JSON file isn't an PHP Learn backup.", "Ce fichier JSON n'est pas une sauvegarde PHP Learn.")
            : l("The backup has no progress in it.", "La sauvegarde ne contient aucune progression."),
      );
    else restoreBackup(result);
  };

  return (
    <section aria-labelledby="data-title" id="data" className="scroll-mt-20 space-y-3">
      <div>
        <h2 id="data-title" className="flex items-center gap-2 text-lg font-semibold">
          <HardDrive className="size-5 text-fg-3" /> {l("Your data", "Tes données")}
        </h2>
        <p className="text-sm text-fg-2">
          {l(
            "Everything stays in this browser's local storage. There is no account and no server: nothing you type is sent anywhere. Clearing your browser data erases it, so download a backup now and then.",
            "Tout reste dans le stockage local de ce navigateur. Pas de compte, pas de serveur : rien de ce que tu tapes n'est envoyé où que ce soit. Effacer les données du navigateur efface tout, alors télécharge une sauvegarde de temps en temps.",
          )}
        </p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-sm font-semibold">{l("Stored on this device", "Stocké sur cet appareil")}</p>
          <p className="font-mono text-xs text-fg-3 tabular-nums">{fmtBytes(total, locale)}</p>
        </div>
        <ul className="mt-2 divide-y divide-line/70">
          {items.map((i) => (
            <li key={i.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 gap-y-0.5 py-2 text-xs sm:grid-cols-[13rem_minmax(0,1fr)_auto]">
              <code className="truncate font-mono text-fg-2" title={i.key}>
                {i.key}
              </code>
              <span className="text-right font-mono text-fg-3 tabular-nums sm:order-3">{fmtBytes(i.bytes, locale)}</span>
              <span className="col-span-2 text-fg-2 sm:order-2 sm:col-span-1">{describe[i.kind]}</span>
            </li>
          ))}
          {!items.length && <li className="py-2 text-xs text-fg-3">{l("Nothing stored yet.", "Rien n'est stocké pour l'instant.")}</li>}
        </ul>
      </Card>

      <Card className="grid gap-4 p-4 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold">{l("Back up this profile", "Sauvegarder ce profil")}</p>
          <p className="mt-0.5 text-xs text-fg-2">{l("Downloads one .json file with your progress and Playground. Keep it, or move it to another computer.", "Télécharge un fichier .json avec ta progression et ton bac à sable. Garde-le, ou emporte-le sur un autre ordinateur.")}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={downloadBackup}>
            <Download className="size-4" /> {l("Download backup", "Télécharger une sauvegarde")}
          </Button>
        </div>
        <div>
          <p className="text-sm font-semibold">{l("Restore a backup", "Restaurer une sauvegarde")}</p>
          <p className="mt-0.5 text-xs text-fg-2">{l("Adds the backup as a new profile next to yours, then switches to it. Nothing here gets overwritten.", "Ajoute la sauvegarde comme nouveau profil à côté du tien, puis bascule dessus. Rien n'est écrasé.")}</p>
          <input ref={file} type="file" accept="application/json,.json" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} aria-label={l("Backup file", "Fichier de sauvegarde")} />
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => file.current?.click()}>
            <Upload className="size-4" /> {l("Choose a backup file", "Choisir un fichier de sauvegarde")}
          </Button>
          {importError && (
            <p className="mt-2 text-xs text-bad" role="alert">
              {importError}
            </p>
          )}
        </div>
      </Card>

      <Card className="divide-y divide-line">
        <DangerRow
          title={l("Reset this profile", "Réinitialiser ce profil")}
          desc={l("Erases XP, lessons, badges and the Playground of the active profile. Your name and settings stay.", "Efface l'XP, les leçons, les badges et le bac à sable du profil actif. Ton nom et tes réglages restent.")}
          armed={confirm === "reset"}
          onArm={() => setConfirm("reset")}
          onCancel={() => setConfirm(null)}
          action={l("Reset", "Réinitialiser")}
          confirmLabel={l("Yes, reset this profile", "Oui, réinitialiser ce profil")}
          onConfirm={() => {
            resetProgress();
            try { window.localStorage.removeItem(PLAYGROUND_KEY); } catch { /* storage unavailable */ }
            setConfirm(null);
            refresh();
          }}
          extra={
            <Link href="/welcome" className="mt-1 inline-block text-xs text-accent-fg underline underline-offset-2">
              {l("Replay the welcome tour", "Revoir la visite de bienvenue")}
            </Link>
          }
        />
        <DangerRow
          title={l("Erase everything", "Tout effacer")}
          desc={l("Removes every profile and setting stored by PHP Learn on this browser. Download a backup first if you might want it back.", "Supprime tous les profils et réglages enregistrés par PHP Learn sur ce navigateur. Télécharge d'abord une sauvegarde si tu risques d'en avoir besoin.")}
          armed={confirm === "erase"}
          onArm={() => setConfirm("erase")}
          onCancel={() => setConfirm(null)}
          action={l("Erase", "Effacer")}
          confirmLabel={l("Yes, erase everything", "Oui, tout effacer")}
          onConfirm={eraseEverything}
          icon={<Trash2 className="size-3.5" />}
        />
      </Card>
    </section>
  );
}

function DangerRow({
  title,
  desc,
  armed,
  onArm,
  onCancel,
  onConfirm,
  action,
  confirmLabel,
  extra,
  icon,
}: {
  title: string;
  desc: string;
  armed: boolean;
  onArm: () => void;
  onCancel: () => void;
  onConfirm: () => void;
  action: string;
  confirmLabel: string;
  extra?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  const l = useL();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-fg-2">{desc}</p>
        {extra}
      </div>
      {armed ? (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            {l("Cancel", "Annuler")}
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirm} autoFocus>
            {confirmLabel}
          </Button>
        </div>
      ) : (
        <Button variant="secondary" size="sm" onClick={onArm}>
          {icon ?? <RotateCcw className="size-3.5" />} {action}
        </Button>
      )}
    </div>
  );
}
