"use client";

import { Kbd } from "@/components/ui/button";
import { useL } from "@/i18n";
import { keyParts, useIsMac } from "@/lib/platform";

/** Every editor shortcut, shown with the learner's keyboard symbols. */
export function useShortcuts() {
  const l = useL();
  return [
    { group: l("Run", "Exécuter"), items: [["Mod-Enter", l("Run the code", "Exécuter le code")], ["Mod-s", l("Run too (your code is saved automatically)", "Exécuter aussi (ton code est enregistré automatiquement)")]] },
    {
      group: l("Hard-to-type characters", "Caractères difficiles à taper"),
      items: [
        ["Alt-Enter", l("Type \\n (new line inside a string)", "Taper \\n (retour à la ligne dans une chaîne)")],
        ["Mod-Alt-Enter", l("Type PHP_EOL", "Taper PHP_EOL")],
      ],
    },
    {
      group: l("Autocomplete", "Autocomplétion"),
      items: [
        ["Ctrl-Space", l("Show suggestions (⌘I on Mac too)", "Afficher les suggestions (⌘I sur Mac aussi)")],
        ["Tab", l("Accept the suggestion (Enter works too), then jump to the next field of a snippet", "Accepter la suggestion (Entrée aussi), puis passer au champ suivant d'un snippet")],
        ["Esc", l("Close suggestions", "Fermer les suggestions")],
      ],
    },
    {
      group: l("Editing", "Édition"),
      items: [
        ["Mod-/", l("Comment / uncomment the line", "Commenter / décommenter la ligne")],
        ["Mod-d", l("Select the next occurrence", "Sélectionner l'occurrence suivante")],
        ["Alt-Up", l("Move the line up (Alt+↓ down)", "Monter la ligne (Alt+↓ pour descendre)")],
        ["Shift-Alt-Down", l("Duplicate the line", "Dupliquer la ligne")],
        ["Mod-Shift-k", l("Delete the line", "Supprimer la ligne")],
        ["Mod-Shift-Enter", l("New line below, from anywhere", "Nouvelle ligne en dessous, d'où que tu sois")],
        ["Shift-Alt-f", l("Re-indent the whole file", "Réindenter tout le fichier")],
        ["Mod-f", l("Find and replace", "Chercher et remplacer")],
        ["Mod-z", l("Undo (Mod+Shift+Z: redo)", "Annuler (Mod+Shift+Z : rétablir)")],
      ],
    },
    {
      group: l("Trace", "Trace"),
      items: [
        ["Down", l("Next step (→ too), outside the editor", "Étape suivante (→ aussi), hors de l'éditeur")],
        ["Up", l("Previous step (← too)", "Étape précédente (← aussi)")],
      ],
    },
  ] as const;
}

export function ShortcutList({ compact }: { compact?: boolean }) {
  const mac = useIsMac();
  const groups = useShortcuts();
  return (
    <div className={compact ? "space-y-3" : "grid gap-4 sm:grid-cols-2"}>
      {groups.map((g) => (
        <section key={g.group}>
          <h3 className="text-[11px] font-semibold tracking-wide text-fg-3 uppercase">{g.group}</h3>
          <dl className="mt-1.5 space-y-1">
            {g.items.map(([combo, label]) => (
              <div key={combo} className="flex items-center justify-between gap-3 text-[13px]">
                <dt className="text-fg-2">{label}</dt>
                <dd className="flex shrink-0 gap-0.5">
                  {keyParts(combo, mac).map((k, i) => (
                    <Kbd key={i}>{k}</Kbd>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
