"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { Apple, Check, ClipboardCopy, Container, ExternalLink, Monitor, Terminal } from "lucide-react";
import { useL } from "@/i18n";

type Os = "mac" | "linux" | "windows" | "docker";

function Cmd({ code, note }: { code: string; note?: string }) {
  const [done, setDone] = useState(false);
  return (
    <div className="terminal my-2 overflow-hidden rounded-lg bg-term">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <pre className="scrollbar-thin min-w-0 flex-1 overflow-x-auto font-mono text-[12.5px] leading-relaxed text-[var(--t-text)]">
          {code.split("\n").map((line, i) => (
            <div key={i} className={line.startsWith("#") ? "text-[var(--t-muted)]" : ""}>
              {line.startsWith("#") ? line : <><span className="text-[var(--t-green)] select-none">$ </span>{line}</>}
            </div>
          ))}
        </pre>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(code.split("\n").filter((l) => !l.startsWith("#")).join("\n"));
              setDone(true);
              setTimeout(() => setDone(false), 1300);
            } catch {
              /* clipboard unavailable */
            }
          }}
          className="grid size-7 shrink-0 place-items-center rounded-md text-[var(--t-muted)] hover:bg-white/10 hover:text-white"
          aria-label="Copy"
        >
          {done ? <Check className="size-3.5 text-[var(--t-green)]" /> : <ClipboardCopy className="size-3.5" />}
        </button>
      </div>
      {note && <p className="border-t border-white/5 px-4 py-1.5 text-[11.5px] text-[var(--t-muted)]">{note}</p>}
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="relative pl-11">
      <span className="absolute top-0 left-0 grid size-8 place-items-center rounded-full bg-accent font-semibold text-white shadow-[0_3px_0_var(--accent-deep)]">{n}</span>
      <h3 className="pt-1 text-lg font-semibold">{title}</h3>
      <div className="mt-2 text-sm leading-relaxed text-fg-2">{children}</div>
    </li>
  );
}

export function SetupGuide() {
  const l = useL();
  const [os, setOs] = useState<Os>("mac");
  const tabs: Array<[Os, string, React.ReactNode]> = [
    ["mac", "macOS", <Apple key="a" className="size-4" />],
    ["linux", "Linux", <Terminal key="l" className="size-4" />],
    ["windows", "Windows", <Monitor key="w" className="size-4" />],
    ["docker", "Docker", <Container key="d" className="size-4" />],
  ];
  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 pb-28 md:pb-16">
      <h1 className="text-3xl font-semibold tracking-tight">{l("Install PHP on your computer", "Installer PHP sur ton ordinateur")}</h1>
      <p className="mt-2 max-w-[65ch] text-lg leading-relaxed text-fg-2">
        {l(
          "PHP Learn runs everything in your browser. When you're ready for real projects, here's how to get PHP, Composer and a good editor on your machine, in about ten minutes.",
          "PHP Learn exécute tout dans ton navigateur. Quand tu seras prêt pour de vrais projets, voici comment installer PHP, Composer et un bon éditeur sur ta machine, en une dizaine de minutes.",
        )}
      </p>

      <div className="mt-6 flex flex-wrap gap-1 rounded-xl bg-surface-2 p-1" role="tablist" aria-label={l("Operating system", "Système d'exploitation")}>
        {tabs.map(([id, label, icon]) => (
          <button
            key={id}
            role="tab"
            aria-selected={os === id}
            onClick={() => setOs(id)}
            className={clsx("flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium", os === id ? "bg-elevated text-fg shadow-sm" : "text-fg-3 hover:text-fg")}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      <ol className="mt-8 space-y-10">
        <Step n={1} title={l("Install PHP", "Installer PHP")}>
          {os === "mac" && (
            <>
              <p>{l("With Homebrew (brew.sh), the latest PHP is one command away:", "Avec Homebrew (brew.sh), la dernière version de PHP s'installe en une commande :")}</p>
              <Cmd code={"brew install php"} />
              <p>{l("Need a specific version for a project? Install it next to the other one:", "Besoin d'une version précise pour un projet ? Installe-la à côté de l'autre :")}</p>
              <Cmd code={"brew install php@8.4"} />
              <p>
                {l("Prefer an app? Laravel Herd installs several PHP versions and switches between them with a click: ", "Tu préfères une appli ? Laravel Herd installe plusieurs versions de PHP et passe de l'une à l'autre en un clic : ")}
                <a href="https://herd.laravel.com" target="_blank" rel="noreferrer" className="text-accent-fg underline underline-offset-2">
                  herd.laravel.com <ExternalLink className="inline size-3" />
                </a>
              </p>
            </>
          )}
          {os === "linux" && (
            <>
              <p>{l("On Ubuntu, your distribution's PHP may be a few versions behind. Ondřej Surý's PPA has every current version:", "Sur Ubuntu, le PHP de ta distribution peut avoir quelques versions de retard. Le PPA d'Ondřej Surý propose toutes les versions actuelles :")}</p>
              <Cmd code={"sudo add-apt-repository ppa:ondrej/php\nsudo apt update\nsudo apt install php8.5-cli php8.5-mbstring php8.5-xml php8.5-sqlite3"} />
              <p>{l("On Debian, the same packages come from packages.sury.org. On Fedora:", "Sur Debian, les mêmes paquets viennent de packages.sury.org. Sur Fedora :")}</p>
              <Cmd code={"sudo dnf install php-cli"} />
              <p>{l("On Arch Linux:", "Sur Arch Linux :")}</p>
              <Cmd code={"sudo pacman -S php"} />
            </>
          )}
          {os === "windows" && (
            <>
              <p>
                {l("The simplest path is WSL (Windows Subsystem for Linux): you get a real Linux terminal, then follow the Linux tab.", "Le plus simple est WSL (le sous-système Windows pour Linux) : tu obtiens un vrai terminal Linux, puis tu suis l'onglet Linux.")}
              </p>
              <Cmd code={"wsl --install"} note={l("Run in PowerShell as administrator, then restart.", "À lancer dans PowerShell en administrateur, puis redémarre.")} />
              <p>
                {l("To stay on Windows itself, use Laravel Herd (herd.laravel.com) or Laragon (laragon.org), or download the zip from ", "Pour rester sous Windows, utilise Laravel Herd (herd.laravel.com) ou Laragon (laragon.org), ou télécharge le zip sur ")}
                <a href="https://windows.php.net/download/" target="_blank" rel="noreferrer" className="text-accent-fg underline underline-offset-2">
                  windows.php.net <ExternalLink className="inline size-3" />
                </a>{" "}
                {l("and add its folder to your PATH.", "et ajoute son dossier à ton PATH.")}
              </p>
            </>
          )}
          {os === "docker" && (
            <>
              <p>{l("No install at all: run any PHP version in a container. In your project folder:", "Aucune installation : exécute n'importe quelle version de PHP dans un conteneur. Dans le dossier de ton projet :")}</p>
              <Cmd code={'docker run --rm -v "$PWD":/app -w /app php:8.5-cli php index.php'} />
              <p>{l("Compare versions exactly like in PHP Learn, by changing the tag:", "Compare les versions exactement comme dans PHP Learn, en changeant l'étiquette :")}</p>
              <Cmd code={'docker run --rm -v "$PWD":/app -w /app php:7.4-cli php index.php'} />
            </>
          )}
        </Step>

        <Step n={2} title={l("Check it works", "Vérifie que ça marche")}>
          <Cmd code={"php -v"} note={l("Prints the version, e.g. PHP 8.5.x (cli).", "Affiche la version, par ex. PHP 8.5.x (cli).")} />
          <p>{l("Run a file, or start PHP's built-in web server and open http://localhost:8000 in your browser:", "Exécute un fichier, ou lance le serveur web intégré de PHP et ouvre http://localhost:8000 dans ton navigateur :")}</p>
          <Cmd code={"php index.php\nphp -S localhost:8000"} />
          <p>{l("php -a opens an interactive shell to try one line at a time.", "php -a ouvre un shell interactif pour essayer une ligne à la fois.")}</p>
        </Step>

        <Step n={3} title={l("Install Composer", "Installer Composer")}>
          <p>
            {l("Composer installs libraries and sets up autoloading (chapter 8 explains why). On macOS: ", "Composer installe des bibliothèques et met en place l'autoloading (le chapitre 8 explique pourquoi). Sur macOS : ")}
            <code className="rounded bg-surface-2 px-1 font-mono text-[0.9em]">brew install composer</code>
            {l(". Everywhere else, follow the four commands on ", ". Partout ailleurs, suis les quatre commandes sur ")}
            <a href="https://getcomposer.org/download/" target="_blank" rel="noreferrer" className="text-accent-fg underline underline-offset-2">
              getcomposer.org/download <ExternalLink className="inline size-3" />
            </a>
            .
          </p>
          <Cmd code={"composer --version\ncomposer init\ncomposer require --dev phpunit/phpunit"} note={l("Start a project and add PHPUnit for tests.", "Démarre un projet et ajoute PHPUnit pour les tests.")} />
        </Step>

        <Step n={4} title={l("Set up your editor", "Configure ton éditeur")}>
          <p>{l("Visual Studio Code is free and works great with PHP once you add two extensions:", "Visual Studio Code est gratuit et marche très bien avec PHP une fois ces deux extensions ajoutées :")}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 marker:text-fg-3">
            <li>
              <strong className="text-fg">PHP Intelephense</strong> {l(": autocomplete, go to definition, and errors as you type.", ": autocomplétion, aller à la définition, et erreurs pendant que tu tapes.")}
            </li>
            <li>
              <strong className="text-fg">PHP Debug</strong> {l(": step-by-step debugging with Xdebug, like the Trace tab here.", ": débogage pas à pas avec Xdebug, comme l'onglet Trace ici.")}
            </li>
          </ul>
          <Cmd code={"code --install-extension bmewburn.vscode-intelephense-client\ncode --install-extension xdebug.php-debug"} />
          <p>{l("PhpStorm (JetBrains) is the most complete paid IDE for PHP, with everything built in.", "PhpStorm (JetBrains) est l'IDE payant le plus complet pour PHP, avec tout intégré.")}</p>
        </Step>
      </ol>

      <div className="mt-12 rounded-xl border border-line bg-surface p-5 text-sm text-fg-2">
        <p className="font-semibold text-fg">{l("Your first real project", "Ton premier vrai projet")}</p>
        <Cmd code={"mkdir hello && cd hello\necho '<?php echo \"Hello from my computer!\";' > index.php\nphp index.php"} />
        <p>{l("Then, to go further: Laravel and Symfony are the two big PHP frameworks, PHPStan and Psalm find bugs before you run code, and PHP-CS-Fixer formats your code.", "Ensuite, pour aller plus loin : Laravel et Symfony sont les deux grands frameworks PHP, PHPStan et Psalm trouvent des bugs avant l'exécution, et PHP-CS-Fixer formate ton code.")}</p>
      </div>
    </div>
  );
}
