import type { DocPage } from "../types";
import { md } from "./md";

/** How to use PHP Learn itself. Control names are written [[Like this]]. */
export const APP_PAGES: DocPage[] = [
  {
    slug: "start",
    section: "app",
    icon: "Rocket",
    lesson: "hello-php",
    title: { en: "Start here", fr: "Commence ici" },
    lead: {
      en: "PHP Learn teaches PHP from your first echo to PHP 8.5, with real PHP running in your browser. Here's how to get going in two minutes.",
      fr: "PHP Learn t'apprend PHP de ton premier echo jusqu'à PHP 8.5, avec du vrai PHP qui tourne dans ton navigateur. Voici comment démarrer en deux minutes.",
    },
    body: {
      en: md`
## Your first five minutes

1. On the home page, press [[Start learning]]. A short welcome asks your language, your name and a daily goal.
2. The first lesson, **Hello, PHP**, opens. Read the short explanation, run the example, then write your own line of PHP.
3. Press [[Run]] (or Ctrl+Enter) whenever you want to see what your code does. Objectives are checked on every run.
4. When every objective is green, press [[Continue]]. The last step celebrates with XP and stars, and the next lesson unlocks.

## What's real and what isn't

Everything you run is **real PHP**: the official interpreter, compiled to WebAssembly, running in a background thread of your browser. You can pick PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 or 8.5, and you get the exact output, warnings and errors that version gives on a server.

What's different from a server: there's no network access, each run starts from a blank state (like a fresh request), and a few extensions (intl, Fibers) aren't available. Everything else, including PDO with SQLite, sessions, JSON, regular expressions and the multibyte functions, works.

## The path

The course has **10 chapters** and gets harder step by step: first steps, decisions and loops, arrays, functions, text and data, objects, errors and debugging, modern PHP, PHP for the web, and finally **what changed from PHP 7 to 8.5**, where you run the same code on several versions side by side.

> Tip: Lost in a lesson? Each challenge has three free hints per objective: the idea, the syntax, then a walkthrough. Hints never cost XP.

## Where to go next

- [How a lesson works](/docs/lessons)
- [The editor, Run and the results panel](/docs/editor)
- [Reading the Trace](/docs/trace)
- [Install PHP on your computer](/setup) when you're ready for real projects.
`,
      fr: md`
## Tes cinq premières minutes

1. Sur la page d'accueil, appuie sur [[Commencer]]. Un court accueil te demande ta langue, ton prénom et un objectif quotidien.
2. La première leçon, **Bonjour, PHP**, s'ouvre. Lis la courte explication, exécute l'exemple, puis écris ta propre ligne de PHP.
3. Appuie sur [[Exécuter]] (ou Ctrl+Entrée) dès que tu veux voir ce que fait ton code. Les objectifs sont vérifiés à chaque exécution.
4. Quand tous les objectifs sont verts, appuie sur [[Continuer]]. La dernière étape fête ça avec des XP et des étoiles, et la leçon suivante se débloque.

## Ce qui est réel et ce qui ne l'est pas

Tout ce que tu exécutes est du **vrai PHP** : l'interpréteur officiel, compilé en WebAssembly, qui tourne dans un fil d'arrière-plan de ton navigateur. Tu peux choisir PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 ou 8.5, et tu obtiens exactement la sortie, les avertissements et les erreurs que cette version donne sur un serveur.

Ce qui change par rapport à un serveur : pas d'accès réseau, chaque exécution repart d'un état vierge (comme une nouvelle requête), et quelques extensions (intl, Fibers) ne sont pas disponibles. Tout le reste, y compris PDO avec SQLite, les sessions, JSON, les expressions régulières et les fonctions multioctets, marche.

## Le parcours

Le cours a **10 chapitres** et monte en difficulté pas à pas : premiers pas, décisions et boucles, tableaux, fonctions, texte et données, objets, erreurs et débogage, PHP moderne, PHP pour le web, et enfin **ce qui a changé de PHP 7 à 8.5**, où tu exécutes le même code sur plusieurs versions côte à côte.

> Astuce : Perdu dans une leçon ? Chaque défi a trois indices gratuits par objectif : l'idée, la syntaxe, puis une solution guidée. Les indices ne coûtent jamais d'XP.

## Et ensuite

- [Comment marche une leçon](/docs/lessons)
- [L'éditeur, Exécuter et le panneau des résultats](/docs/editor)
- [Lire la Trace](/docs/trace)
- [Installer PHP sur ton ordinateur](/setup) quand tu seras prêt pour de vrais projets.
`,
    },
  },
  {
    slug: "lessons",
    section: "app",
    icon: "GraduationCap",
    title: { en: "How a lesson works", fr: "Comment marche une leçon" },
    lead: {
      en: "Every lesson mixes short explanations, code you watch run, predictions, and exercises checked on real PHP.",
      fr: "Chaque leçon mélange de courtes explications, du code que tu regardes s'exécuter, des prédictions, et des exercices vérifiés sur du vrai PHP.",
    },
    body: {
      en: md`
## The steps

| Step | What you do |
|---|---|
| **Discover** | Read one idea, with runnable (and editable) examples and sometimes a small animated diagram. |
| **Watch** | Step through a program line by line and watch the variables and the output change. |
| **Predict** | Guess what a piece of code prints. Right on the first try: +5 XP. Then run it to check. |
| **Compare** | Run the same code on several PHP versions side by side and spot what changed. |
| **Try** | A guided exercise in the editor, usually one or two objectives. |
| **Challenge** | Several objectives, on your own, with free hints. Boss challenges close each chapter. |
| **Celebrate** | XP, stars, badges, a recap, and the next lesson unlocks. |

## How objectives are checked

When you press [[Run]], your code runs on a real interpreter, then each objective looks at the **result**: what was printed, which warnings or errors happened, the final value of your variables, and what your functions return when called with test values. Some objectives also check that you used the construct being taught (for example ´match´), ignoring comments.

So there's rarely a single right answer: any code that behaves correctly passes.

## Stars

| Star | How to get it |
|---|---|
| 1 | Finish the lesson |
| 2 | Don't open the walkthrough hint or the solution |
| 3 | Three failed runs (fatal errors) or fewer |

A three-star first completion earns a flawless bonus. Replaying a lesson never loses stars.

## Your work is saved

Your code at each step and your position in the lesson are saved in this browser as you go. Close the tab and come back later: you'll pick up where you left off. [[Restart]] in the lesson header starts over.
`,
      fr: md`
## Les étapes

| Étape | Ce que tu fais |
|---|---|
| **Découvrir** | Lire une idée, avec des exemples exécutables (et modifiables) et parfois un petit schéma animé. |
| **Observer** | Avancer dans un programme ligne par ligne et regarder les variables et la sortie changer. |
| **Deviner** | Deviner ce qu'affiche un bout de code. Juste du premier coup : +5 XP. Puis exécute-le pour vérifier. |
| **Comparer** | Exécuter le même code sur plusieurs versions de PHP côte à côte et repérer ce qui a changé. |
| **Essayer** | Un exercice guidé dans l'éditeur, en général un ou deux objectifs. |
| **Défi** | Plusieurs objectifs, en autonomie, avec des indices gratuits. Des défis boss terminent chaque chapitre. |
| **Bravo** | XP, étoiles, badges, un récapitulatif, et la leçon suivante se débloque. |

## Comment les objectifs sont vérifiés

Quand tu appuies sur [[Exécuter]], ton code tourne sur un vrai interpréteur, puis chaque objectif regarde le **résultat** : ce qui a été affiché, les avertissements ou erreurs survenus, la valeur finale de tes variables, et ce que renvoient tes fonctions appelées avec des valeurs de test. Certains objectifs vérifient aussi que tu as utilisé la construction enseignée (par exemple ´match´), en ignorant les commentaires.

Il y a donc rarement une seule bonne réponse : tout code qui se comporte correctement passe.

## Les étoiles

| Étoile | Comment l'obtenir |
|---|---|
| 1 | Terminer la leçon |
| 2 | Ne pas ouvrir la solution guidée ni la solution |
| 3 | Trois exécutions ratées (erreurs fatales) ou moins |

Une première réussite à trois étoiles rapporte un bonus sans faute. Rejouer une leçon ne fait jamais perdre d'étoiles.

## Ton travail est sauvegardé

Ton code à chaque étape et ta position dans la leçon sont enregistrés dans ce navigateur au fur et à mesure. Ferme l'onglet et reviens plus tard : tu reprendras là où tu t'étais arrêté. [[Recommencer]] dans l'en-tête de la leçon repart de zéro.
`,
    },
  },
  {
    slug: "editor",
    section: "app",
    icon: "Code",
    title: { en: "The editor, Run and the results panel", fr: "L'éditeur, Exécuter et le panneau des résultats" },
    lead: {
      en: "A small VS Code: file tabs, PHP syntax colors, autocomplete, and a results panel with Output, Problems, Trace and Variables.",
      fr: "Un petit VS Code : des onglets de fichiers, la coloration PHP, l'autocomplétion, et un panneau de résultats avec Sortie, Problèmes, Trace et Variables.",
    },
    body: {
      en: md`
## The toolbar

- **Reset** puts the starting code back.
- **Cheat sheet** opens a summary of the syntax for the current topic next to the editor (wide screens).
- **Compare versions** runs your files on every PHP version, from 7.4 to 8.5, and shows the outputs side by side.
- **PHP 8.5** (the version picker) chooses the interpreter. A green dot means that version is downloaded and ready.
- [[Run]] executes your code. Shortcut: Ctrl+Enter (Cmd+Enter on a Mac). Ctrl+S runs too.

## The editor

It works like VS Code: Tab indents, Ctrl+/ comments a line, Ctrl+F searches, Ctrl+Z undoes, and typing a function name or a ´$´ suggests completions. Projects with several files show an **Explorer** on the left; in the Playground you can add, rename and delete files.

After a run, the line of each problem gets a colored dot in the margin and the message is shown at the end of the line, so you see errors where they happen.

## The results panel

| Tab | What it shows |
|---|---|
| **Output** | What your script printed, with PHP's warnings at the place they happened, then the exit code, the version and the time. HTML output can be shown rendered. |
| **Problems** | Every error, warning, notice and deprecation, with **what it means** and **how to fix it** in plain language, the file and line (click to jump) and the stack trace. |
| **Trace** | Every statement PHP executed, in order. See [Reading the Trace](/docs/trace). |
| **Variables** | Every global variable at the end of the script with its type, or at the selected step of the trace. |

Drag the bar between the editor and the panel to resize it; double-click it to maximise the panel.

## The status bar

The colored bar at the bottom shows the exact PHP version that ran (for example 8.5.12), the number of errors and warnings, how long the run took, the exit code, and your cursor position.
`,
      fr: md`
## La barre d'outils

- **Réinitialiser** remet le code de départ.
- **Antisèche** ouvre un résumé de la syntaxe du sujet en cours à côté de l'éditeur (grands écrans).
- **Comparer les versions** exécute tes fichiers sur chaque version de PHP, de 7.4 à 8.5, et montre les sorties côte à côte.
- **PHP 8.5** (le sélecteur de version) choisit l'interpréteur. Un point vert veut dire que cette version est téléchargée et prête.
- [[Exécuter]] lance ton code. Raccourci : Ctrl+Entrée (Cmd+Entrée sur Mac). Ctrl+S exécute aussi.

## L'éditeur

Il marche comme VS Code : Tab indente, Ctrl+/ commente une ligne, Ctrl+F cherche, Ctrl+Z annule, et taper un nom de fonction ou un ´$´ propose des complétions. Les projets à plusieurs fichiers affichent un **Explorateur** à gauche ; dans le bac à sable, tu peux ajouter, renommer et supprimer des fichiers.

Après une exécution, la ligne de chaque problème reçoit un point coloré dans la marge et le message s'affiche en bout de ligne : tu vois les erreurs là où elles se produisent.

## Le panneau des résultats

| Onglet | Ce qu'il montre |
|---|---|
| **Sortie** | Ce que ton script a affiché, avec les avertissements de PHP là où ils se sont produits, puis le code de sortie, la version et la durée. Une sortie HTML peut être affichée rendue. |
| **Problèmes** | Chaque erreur, avertissement, notice et dépréciation, avec **ce que ça veut dire** et **comment corriger** en langage simple, le fichier et la ligne (clique pour y aller) et la pile d'appels. |
| **Trace** | Chaque instruction exécutée par PHP, dans l'ordre. Voir [Lire la Trace](/docs/trace). |
| **Variables** | Chaque variable globale à la fin du script avec son type, ou à l'étape sélectionnée de la trace. |

Fais glisser la barre entre l'éditeur et le panneau pour le redimensionner ; double-clique dessus pour l'agrandir.

## La barre d'état

La barre colorée en bas montre la version exacte de PHP qui a tourné (par exemple 8.5.12), le nombre d'erreurs et d'avertissements, la durée, le code de sortie et la position de ton curseur.
`,
    },
  },
  {
    slug: "trace",
    section: "app",
    icon: "Footprints",
    lesson: "debugging",
    title: { en: "Reading the Trace", fr: "Lire la Trace" },
    lead: {
      en: "The Trace records every statement PHP runs, the call stack and the variables at each step, so you can replay your program like a debugger.",
      fr: "La Trace enregistre chaque instruction exécutée par PHP, la pile d'appels et les variables à chaque étape : tu peux rejouer ton programme comme avec un débogueur.",
    },
    body: {
      en: md`
## Stepping through

After a run, open the **Trace** tab. Each row is one executed statement:

| Column | Meaning |
|---|---|
| # | The step number, in execution order |
| file:line | Where the statement is |
| call stack | The function running it, and who called that function (´{main}´ is the top level) |
| changes | The variables that changed at this step |

Click a row, use the buttons, or press **Alt+↓ / Alt+↑**: the editor highlights the line with an arrow in the margin, the **Variables** tab shows the values at that moment, and the **Output** tab shows only what had been printed so far. [[Play]] replays the program automatically.

## Debugging with it

When a result is wrong, don't guess: find the first step where a variable takes a value you didn't expect. The bug is in the statement just before. This is exactly what a step debugger like Xdebug does in a real IDE.

## How it works

Before running, PHP Learn adds ´declare(ticks=1);´ to your files on the same line, so line numbers don't move. PHP then calls a small recorder after every statement. Inside functions, the arguments and ´$this´ are shown; other local variables aren't visible to the recorder.

The first 2,500 steps are recorded. A program that runs more than 300,000 statements is stopped, which catches loops that never end.
`,
      fr: md`
## Avancer pas à pas

Après une exécution, ouvre l'onglet **Trace**. Chaque ligne est une instruction exécutée :

| Colonne | Sens |
|---|---|
| # | Le numéro de l'étape, dans l'ordre d'exécution |
| fichier:ligne | Où se trouve l'instruction |
| pile d'appels | La fonction qui l'exécute, et qui a appelé cette fonction (´{main}´ est le niveau principal) |
| changements | Les variables modifiées à cette étape |

Clique sur une ligne, utilise les boutons, ou appuie sur **Alt+↓ / Alt+↑** : l'éditeur surligne la ligne avec une flèche dans la marge, l'onglet **Variables** montre les valeurs à ce moment, et l'onglet **Sortie** montre seulement ce qui avait été affiché jusque-là. [[Lecture]] rejoue le programme automatiquement.

## Déboguer avec

Quand un résultat est faux, ne devine pas : trouve la première étape où une variable prend une valeur inattendue. Le bug est dans l'instruction juste avant. C'est exactement ce que fait un débogueur pas à pas comme Xdebug dans un vrai IDE.

## Comment ça marche

Avant l'exécution, PHP Learn ajoute ´declare(ticks=1);´ à tes fichiers sur la même ligne, pour que les numéros de ligne ne bougent pas. PHP appelle alors un petit enregistreur après chaque instruction. Dans les fonctions, les arguments et ´$this´ sont affichés ; les autres variables locales ne sont pas visibles pour l'enregistreur.

Les 2 500 premières étapes sont enregistrées. Un programme qui exécute plus de 300 000 instructions est arrêté, ce qui attrape les boucles qui ne s'arrêtent jamais.
`,
    },
  },
  {
    slug: "compare-versions",
    section: "app",
    icon: "Columns2",
    lesson: "php80",
    title: { en: "Comparing PHP versions", fr: "Comparer les versions de PHP" },
    lead: {
      en: "Seven real interpreters, from PHP 7.4 to 8.5. Run the same code on all of them and see exactly where the language changed.",
      fr: "Sept vrais interpréteurs, de PHP 7.4 à 8.5. Exécute le même code sur tous et vois exactement où le langage a changé.",
    },
    body: {
      en: md`
## Three ways to compare

1. **In any editor**, press **Compare versions**: your current files run on PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 and 8.5, one after the other.
2. **In lessons**, Compare steps run a prepared example on the versions that matter.
3. **On the [Versions](/versions) page**, each feature of each release has a button that runs it on the release before and the release that introduced it.

Cards whose result differs from the newest version are marked **different**. A different result can be a new feature (a ParseError on the old version), a behaviour change (´0 == "a"´ is true on 7.4 and false on 8.0), or a new deprecation message.

## Downloads

Each version is about 6 to 8 MB to download, once; your browser keeps it afterwards. At most two versions stay loaded in memory at the same time, so comparing all seven takes a few seconds the first time.

## What isn't available

PHP 7.0 to 7.3 can't run here (the WebAssembly builds start at 7.4), so the Versions page describes them without running them.
`,
      fr: md`
## Trois façons de comparer

1. **Dans n'importe quel éditeur**, appuie sur **Comparer les versions** : tes fichiers actuels s'exécutent sur PHP 7.4, 8.0, 8.1, 8.2, 8.3, 8.4 et 8.5, l'un après l'autre.
2. **Dans les leçons**, les étapes Comparer exécutent un exemple préparé sur les versions qui comptent.
3. **Sur la page [Versions](/versions)**, chaque nouveauté de chaque version a un bouton qui l'exécute sur la version d'avant et sur celle qui l'a introduite.

Les cartes dont le résultat diffère de la version la plus récente sont marquées **différent**. Un résultat différent peut être une nouveauté (une ParseError sur l'ancienne version), un changement de comportement (´0 == "a"´ vaut true en 7.4 et false en 8.0), ou un nouveau message de dépréciation.

## Téléchargements

Chaque version pèse environ 6 à 8 Mo à télécharger, une seule fois ; ton navigateur la garde ensuite. Au plus deux versions restent chargées en mémoire en même temps, donc comparer les sept prend quelques secondes la première fois.

## Ce qui n'est pas disponible

PHP 7.0 à 7.3 ne peuvent pas tourner ici (les versions WebAssembly commencent à 7.4), donc la page Versions les décrit sans les exécuter.
`,
    },
  },
  {
    slug: "playground",
    section: "app",
    icon: "FlaskConical",
    title: { en: "The Playground", fr: "Le bac à sable" },
    lead: {
      en: "A free editor with several files, every PHP version, a simulated web request and ready-made templates. Your files are saved in this browser.",
      fr: "Un éditeur libre avec plusieurs fichiers, toutes les versions de PHP, une requête web simulée et des modèles prêts à l'emploi. Tes fichiers sont enregistrés dans ce navigateur.",
    },
    body: {
      en: md`
## What you can do

- **Templates**: start from Hello world, a class with an interface, a multi-file project with autoloading, a SQLite database with PDO, a JSON API, or a "what's new in PHP 8.5" sampler.
- **Files**: add, rename and delete files in the Explorer. ´index.php´ is always the entry point; load other files with ´require __DIR__ . '/src/File.php';´.
- **Request**: simulate a GET or POST request with parameters, then read them in ´$_GET´ and ´$_POST´.
- **Share**: the code from any example opens here with its Open in the Playground button.

Everything is saved automatically in this browser (see [Your data](/docs/data)).
`,
      fr: md`
## Ce que tu peux faire

- **Modèles** : pars d'un Hello world, d'une classe avec une interface, d'un projet multi-fichiers avec autoloading, d'une base SQLite avec PDO, d'une API JSON, ou d'un échantillon des nouveautés de PHP 8.5.
- **Fichiers** : ajoute, renomme et supprime des fichiers dans l'Explorateur. ´index.php´ est toujours le point d'entrée ; charge les autres fichiers avec ´require __DIR__ . '/src/File.php';´.
- **Requête** : simule une requête GET ou POST avec des paramètres, puis lis-les dans ´$_GET´ et ´$_POST´.
- **Partager** : le code de n'importe quel exemple s'ouvre ici avec son bouton Ouvrir dans le bac à sable.

Tout est enregistré automatiquement dans ce navigateur (voir [Tes données](/docs/data)).
`,
    },
  },
  {
    slug: "data",
    section: "app",
    icon: "HardDrive",
    title: { en: "Profiles and your data", fr: "Profils et données" },
    lead: {
      en: "No account, no server: your progress and your code live in this browser. You can back them up, move them or erase them.",
      fr: "Pas de compte, pas de serveur : ta progression et ton code vivent dans ce navigateur. Tu peux les sauvegarder, les déplacer ou les effacer.",
    },
    body: {
      en: md`
## What's stored

| Key | What it holds |
|---|---|
| ´phplearn-progress´ | XP, completed lessons, stars, badges, quests, settings and in-progress lessons |
| ´phplearn-playground´ | Your Playground files and settings |
| ´phplearn-profiles´ | The list of profiles on this browser |

Your code never leaves your computer: PHP runs locally in WebAssembly.

## Profiles, backups, reset

On the [Profile](/profile) page you can add profiles so several people share one browser, download a JSON backup, restore it on another computer, see every stored key with its size, and reset or erase everything.
`,
      fr: md`
## Ce qui est enregistré

| Clé | Ce qu'elle contient |
|---|---|
| ´phplearn-progress´ | XP, leçons terminées, étoiles, badges, quêtes, réglages et leçons en cours |
| ´phplearn-playground´ | Tes fichiers et réglages du bac à sable |
| ´phplearn-profiles´ | La liste des profils de ce navigateur |

Ton code ne quitte jamais ton ordinateur : PHP tourne localement en WebAssembly.

## Profils, sauvegardes, réinitialisation

Sur la page [Profil](/profile), tu peux ajouter des profils pour partager un navigateur à plusieurs, télécharger une sauvegarde JSON, la restaurer sur un autre ordinateur, voir chaque clé enregistrée avec sa taille, et tout réinitialiser ou effacer.
`,
    },
  },
  {
    slug: "accessibility",
    section: "app",
    icon: "Accessibility",
    title: { en: "Settings and accessibility", fr: "Réglages et accessibilité" },
    lead: {
      en: "Light or dark theme, reduced motion, editor font size, word wrap, optional streaks, and everything usable with the keyboard.",
      fr: "Thème clair ou sombre, animations réduites, taille du code, retour à la ligne, séries optionnelles, et tout utilisable au clavier.",
    },
    body: {
      en: md`
## Settings

Open [Profile](/profile) to change the language, the daily goal, the theme (Paper or Dark), motion (System, Reduced, Full), the editor font size, word wrap, and whether streaks are shown.

## Keyboard

| Keys | Action |
|---|---|
| Ctrl+Enter | Run the code |
| Alt+↓ / Alt+↑ | Next / previous step in the trace |
| Ctrl+/ | Comment or uncomment the line |
| Ctrl+F | Find in the file |
| Tab | Indent, or accept a suggestion |
| Esc | Close suggestions and menus |

Every control has a visible focus ring, results are announced to screen readers, and the control to press next gently pulses (a steady outline with reduced motion).
`,
      fr: md`
## Réglages

Ouvre [Profil](/profile) pour changer la langue, l'objectif du jour, le thème (Papier ou Sombre), les animations (Système, Réduites, Complètes), la taille du code, le retour à la ligne et l'affichage des séries.

## Clavier

| Touches | Action |
|---|---|
| Ctrl+Entrée | Exécuter le code |
| Alt+↓ / Alt+↑ | Étape suivante / précédente dans la trace |
| Ctrl+/ | Commenter ou décommenter la ligne |
| Ctrl+F | Chercher dans le fichier |
| Tab | Indenter, ou accepter une suggestion |
| Échap | Fermer les suggestions et les menus |

Chaque contrôle a un contour de focus visible, les résultats sont annoncés aux lecteurs d'écran, et le contrôle à utiliser ensuite pulse doucement (un contour fixe avec les animations réduites).
`,
    },
  },
];
