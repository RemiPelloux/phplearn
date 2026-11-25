import { L } from "@/lib/txt";
import { all, clean, outputHas, outputIs, outputLines, probeIs, uses } from "../checks";
import type { Check, Lesson } from "../types";

const CH = "text-data";

/** Lines of output that mention one of these words all have the same length (aligned columns). */
const aligned = (words: string[]): Check => (c) => {
  const lines = c.out.split("\n").filter((l) => words.some((w) => l.includes(w)));
  return lines.length === words.length && new Set(lines.map((l) => l.trimEnd().length)).size === 1;
};

export const stringFunctions: Lesson = {
  id: "string-functions",
  chapterId: CH,
  title: L("String functions", "Les fonctions de chaînes"),
  tagline: L("Search, cut, replace, split and join text", "Chercher, couper, remplacer, découper et assembler du texte"),
  xp: 50,
  syntax: ["str_contains", "str_starts_with", "strpos", "substr", "str_replace", "explode", "implode", "ucwords"],
  doc: "guide-text-data",
  steps: [
    {
      kind: "discover",
      title: L("Searching inside text", "Chercher dans du texte"),
      body: [
        L(
          "Most of what web apps do with text is *asking questions about it*: does this email contain an @? Does this path start with /admin? Does this file end with .php?",
          "L'essentiel de ce que font les applis web avec du texte, c'est *lui poser des questions* : cet e-mail contient-il un @ ? Ce chemin commence-t-il par /admin ? Ce fichier finit-il par .php ?",
        ),
        L(
          "`str_contains()`, `str_starts_with()` and `str_ends_with()` answer with `true` or `false`. `strpos()` tells you **where** the text is (counting from 0), or `false` if it isn't there.",
          "`str_contains()`, `str_starts_with()` et `str_ends_with()` répondent par `true` ou `false`. `strpos()` te dit **où** se trouve le texte (en comptant depuis 0), ou `false` s'il n'y est pas.",
        ),
      ],
      example: {
        code: `<?php\n$email = "ada@example.com";\nvar_dump(str_contains($email, "@"));\nvar_dump(str_starts_with($email, "ada"));\nvar_dump(str_ends_with($email, ".org"));\nvar_dump(strpos($email, "@"));\nvar_dump(strpos($email, "z"));\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "`str_contains`, `str_starts_with` and `str_ends_with` arrived in PHP 8.0. On PHP 7.4 they don't exist: you had to write `strpos($haystack, $needle) !== false`. Try the example on 7.4 to see the error.",
          "`str_contains`, `str_starts_with` et `str_ends_with` sont arrivées en PHP 8.0. En PHP 7.4 elles n'existent pas : il fallait écrire `strpos($botte, $aiguille) !== false`. Essaie l'exemple en 7.4 pour voir l'erreur.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Cutting, replacing, splitting", "Couper, remplacer, découper"),
      body: [
        L(
          "`substr($s, $start, $length)` cuts a piece out; a negative start counts from the end. `str_replace($search, $replace, $s)` swaps every occurrence.",
          "`substr($s, $debut, $longueur)` découpe un morceau ; un début négatif compte depuis la fin. `str_replace($cherche, $remplace, $s)` remplace chaque occurrence.",
        ),
        L(
          "`explode(\",\", $s)` splits a string into an array at each comma; `implode(\" > \", $array)` does the reverse. Together they're how you read and write simple formats like CSV lines or paths.",
          "`explode(\",\", $s)` découpe une chaîne en tableau à chaque virgule ; `implode(\" > \", $tableau)` fait l'inverse. Ensemble, c'est comme ça qu'on lit et écrit des formats simples comme des lignes CSV ou des chemins.",
        ),
      ],
      example: {
        code: `<?php\n$path = "/home/ada/notes.txt";\necho substr($path, 0, 5), "\\n";\necho substr($path, -3), "\\n";\necho str_replace("ada", "linus", $path), "\\n";\n\n$parts = explode("/", trim($path, "/"));\nprint_r($parts);\necho implode(" > ", $parts), "\\n";\necho ucwords("the quick brown fox");\n`,
      },
    },
    {
      kind: "quiz",
      title: L("The strpos trap", "Le piège de strpos"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$s = "PHP rocks";\nif (strpos($s, "PHP")) {\n    echo "found";\n} else {\n    echo "not found";\n}\n`,
      options: ["found", "not found", "0", "PHP"],
      answer: 1,
      explain: L(
        "\"PHP\" is at position 0, and 0 counts as false in an `if`. That's why you must compare with `!== false`, or simply use `str_contains()`.",
        "« PHP » est à la position 0, et 0 compte comme faux dans un `if`. C'est pour ça qu'il faut comparer avec `!== false`, ou simplement utiliser `str_contains()`.",
      ),
    },
    {
      kind: "watch",
      title: L("Parse a CSV line", "Analyse une ligne CSV"),
      body: L(
        "Step through and watch a line of text become an array, then a formatted label.",
        "Avance pas à pas et regarde une ligne de texte devenir un tableau, puis une étiquette formatée.",
      ),
      code: `<?php\n$csv = "Ada,Lovelace,1815";\n$fields = explode(",", $csv);\n$first = $fields[0];\n$year = (int) $fields[2];\n$label = strtoupper($fields[1]) . " ($year)";\necho $label;\n`,
      notes: {
        3: L("explode() returns an array of 3 strings.", "explode() renvoie un tableau de 3 chaînes."),
        4: L("Index 0 is the first piece.", "L'indice 0 est le premier morceau."),
        5: L("\"1815\" is still text: the cast turns it into an int.", "« 1815 » est encore du texte : le cast le transforme en int."),
        6: L("Functions and concatenation combine the pieces.", "Fonctions et concaténation assemblent les morceaux."),
      },
    },
    {
      kind: "try",
      title: L("Get a file extension", "Récupère l'extension d'un fichier"),
      body: L(
        "Write `extension(string $file): string` returning what comes after the **last** dot, in lowercase: `Photo.JPG` → `jpg`, `archive.tar.gz` → `gz`. Tip: `strrpos()` finds the last position.",
        "Écris `extension(string $file): string` qui renvoie ce qui suit le **dernier** point, en minuscules : `Photo.JPG` → `jpg`, `archive.tar.gz` → `gz`. Astuce : `strrpos()` trouve la dernière position.",
      ),
      files: { "index.php": `<?php\nfunction extension(string $file): string {\n    return $file;\n}\n\necho extension("Photo.JPG");\n` },
      solution: { "index.php": `<?php\nfunction extension(string $file): string {\n    return strtolower(substr($file, strrpos($file, ".") + 1));\n}\n\necho extension("Photo.JPG");\n` },
      probes: ["extension('Photo.JPG')", "extension('archive.tar.gz')"],
      objectives: [
        {
          id: "ext",
          label: L("extension('Photo.JPG') is jpg, extension('archive.tar.gz') is gz", "extension('Photo.JPG') vaut jpg, extension('archive.tar.gz') vaut gz"),
          check: all(probeIs("extension('Photo.JPG')", "jpg"), probeIs("extension('archive.tar.gz')", "gz")),
          hints: [
            L("Find where the last dot is, then take everything after it.", "Trouve où est le dernier point, puis prends tout ce qui suit."),
            L("`strrpos($file, \".\")` gives the dot's position; `substr($file, $pos + 1)` takes the rest.", "`strrpos($file, \".\")` donne la position du point ; `substr($file, $pos + 1)` prend la suite."),
            L("`return strtolower(substr($file, strrpos($file, \".\") + 1));`", "`return strtolower(substr($file, strrpos($file, \".\") + 1));`"),
          ],
        },
      ],
      cheat: "string-functions",
    },
    {
      kind: "try",
      title: L("A tiny spam filter", "Un mini filtre anti-spam"),
      body: L(
        "Write `isSpam(string $message): bool` that returns `true` when the message contains `free money`, whatever the capitals. Use `str_contains()`.",
        "Écris `isSpam(string $message): bool` qui renvoie `true` quand le message contient `free money`, quelles que soient les majuscules. Utilise `str_contains()`.",
      ),
      files: { "index.php": `<?php\nfunction isSpam(string $message): bool {\n    return false;\n}\n\nvar_dump(isSpam("Get FREE money now"));\n` },
      solution: { "index.php": `<?php\nfunction isSpam(string $message): bool {\n    return str_contains(strtolower($message), "free money");\n}\n\nvar_dump(isSpam("Get FREE money now"));\n` },
      probes: ["isSpam('Get FREE money now')", "isSpam('Meeting at noon')", "isSpam('free Money!!!')"],
      objectives: [
        {
          id: "spam",
          label: L("Detect free money in any case, and only then", "Détecter free money quelle que soit la casse, et seulement là"),
          check: all(probeIs("isSpam('Get FREE money now')", true), probeIs("isSpam('free Money!!!')", true), probeIs("isSpam('Meeting at noon')", false), uses(/str_contains\s*\(/)),
          hints: [
            L("str_contains is case-sensitive: make the message lowercase first.", "str_contains est sensible à la casse : passe d'abord le message en minuscules."),
            L("`str_contains(strtolower($message), \"free money\")`", "`str_contains(strtolower($message), \"free money\")`"),
            L("`return str_contains(strtolower($message), \"free money\");`", "`return str_contains(strtolower($message), \"free money\");`"),
          ],
        },
      ],
      cheat: "string-functions",
    },
    {
      kind: "challenge",
      title: L("Clean up a name list", "Nettoie une liste de noms"),
      body: L(
        "`$raw` is a messy comma-separated list. Print the names separated by `; `, trimmed and with capitals (`Ada Lovelace; Grace Hopper; Linus Torvalds`), then on the next line `3 names`.",
        "`$raw` est une liste désordonnée séparée par des virgules. Affiche les noms séparés par `; `, sans espaces autour et avec des majuscules (`Ada Lovelace; Grace Hopper; Linus Torvalds`), puis à la ligne suivante `3 names`.",
      ),
      files: { "index.php": `<?php\n$raw = "  ada lovelace , grace hopper,linus torvalds ";\n\n// 1. split at the commas\n// 2. trim and capitalise each name\n// 3. join with "; " and print, then the count\n\necho $raw;\n` },
      solution: {
        "index.php": `<?php\n$raw = "  ada lovelace , grace hopper,linus torvalds ";\n\n$names = [];\nforeach (explode(",", $raw) as $name) {\n    $names[] = ucwords(trim($name));\n}\n\necho implode("; ", $names), "\\n";\necho count($names) . " names";\n`,
      },
      objectives: [
        {
          id: "names",
          label: L("First line: Ada Lovelace; Grace Hopper; Linus Torvalds", "Première ligne : Ada Lovelace; Grace Hopper; Linus Torvalds"),
          check: (c) => c.out.split("\n")[0] === "Ada Lovelace; Grace Hopper; Linus Torvalds",
          hints: [
            L("Split with explode, fix each piece, then join with implode.", "Découpe avec explode, corrige chaque morceau, puis assemble avec implode."),
            L("In a foreach over `explode(\",\", $raw)`, add `ucwords(trim($name))` to a new array.", "Dans un foreach sur `explode(\",\", $raw)`, ajoute `ucwords(trim($name))` à un nouveau tableau."),
            L(
              "`$names = []; foreach (explode(\",\", $raw) as $name) { $names[] = ucwords(trim($name)); } echo implode(\"; \", $names), \"\\n\";`",
              "`$names = []; foreach (explode(\",\", $raw) as $name) { $names[] = ucwords(trim($name)); } echo implode(\"; \", $names), \"\\n\";`",
            ),
          ],
        },
        {
          id: "count",
          label: L("Second line: 3 names", "Deuxième ligne : 3 names"),
          check: outputLines(["3 names"]),
          hints: [
            L("Count the items of your cleaned array.", "Compte les éléments de ton tableau nettoyé."),
            L("`count($names)` gives 3.", "`count($names)` donne 3."),
            L("`echo count($names) . \" names\";`", "`echo count($names) . \" names\";`"),
          ],
        },
      ],
      cheat: "string-functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`str_contains`, `str_starts_with`, `str_ends_with` (PHP 8.0) answer yes/no questions.", "`str_contains`, `str_starts_with`, `str_ends_with` (PHP 8.0) répondent par oui ou non."),
    L("`strpos` returns a position or false: compare with `!== false` because 0 is falsy.", "`strpos` renvoie une position ou false : compare avec `!== false` car 0 compte comme faux."),
    L("`substr` cuts, `str_replace` swaps, `ucwords` capitalises.", "`substr` découpe, `str_replace` remplace, `ucwords` met des majuscules."),
    L("`explode` splits text into an array; `implode` joins it back.", "`explode` découpe du texte en tableau ; `implode` le rassemble."),
  ],
};

export const formatting: Lesson = {
  id: "formatting",
  chapterId: CH,
  title: L("Formatting output", "Mettre en forme la sortie"),
  tagline: L("printf, number_format, padding, and text with accents", "printf, number_format, remplissage, et texte accentué"),
  xp: 50,
  syntax: ["printf", "sprintf", "%s %d %.2f", "number_format", "str_pad", "mb_strlen"],
  doc: "guide-text-data",
  steps: [
    {
      kind: "discover",
      title: L("Templates with printf", "Des gabarits avec printf"),
      body: [
        L(
          "Gluing strings with dots gets messy when you care about decimals and alignment. `printf()` takes a **template** with placeholders and fills them in order: `%s` a string, `%d` an integer, `%.2f` a float with 2 decimals, `%%` a literal percent sign.",
          "Coller des chaînes avec des points devient vite brouillon quand on veut des décimales et de l'alignement. `printf()` prend un **gabarit** avec des emplacements et les remplit dans l'ordre : `%s` une chaîne, `%d` un entier, `%.2f` un float avec 2 décimales, `%%` un signe pourcent.",
        ),
        L(
          "A number before the letter sets a **width**: `%5d` pads to 5 characters on the left, `%-8s` pads on the right. `%05.2f` pads with zeros. `sprintf()` does the same but **returns** the string instead of printing it.",
          "Un nombre devant la lettre fixe une **largeur** : `%5d` complète à 5 caractères par la gauche, `%-8s` par la droite. `%05.2f` complète avec des zéros. `sprintf()` fait pareil mais **renvoie** la chaîne au lieu de l'afficher.",
        ),
      ],
      example: {
        code: `<?php\n$name = "Ada";\n$score = 92.456;\nprintf("%s scored %.1f%%\\n", $name, $score);\n\n$line = sprintf("%-8s|%5d|", "apples", 42);\necho $line, "\\n";\necho sprintf("%05.2f", 3.14159), "\\n";\necho sprintf("%03d", 7);\n`,
      },
    },
    {
      kind: "discover",
      title: L("Numbers for humans", "Des nombres pour les humains"),
      body: [
        L(
          "`number_format($n, $decimals, $decimalPoint, $thousandsSep)` adds thousands separators and fixes the decimals: `1 234 567,89` for French readers, `1,234,567.89` for English ones.",
          "`number_format($n, $decimales, $separateurDecimal, $separateurMilliers)` ajoute les séparateurs de milliers et fixe les décimales : `1 234 567,89` pour un lecteur français, `1,234,567.89` pour un lecteur anglais.",
        ),
        L(
          "`str_pad($s, $length, $padWith, STR_PAD_LEFT)` pads a string to a fixed width: leading zeros, dotted leaders in a menu, aligned columns.",
          "`str_pad($s, $longueur, $remplissage, STR_PAD_LEFT)` complète une chaîne jusqu'à une largeur fixe : zéros devant, pointillés dans un menu, colonnes alignées.",
        ),
      ],
      example: {
        code: `<?php\necho number_format(1234567.891), "\\n";\necho number_format(1234567.891, 2), "\\n";\necho number_format(1234567.891, 2, ",", " "), "\\n";\necho str_pad("7", 3, "0", STR_PAD_LEFT), "\\n";\necho str_pad("Total", 10, "."), "42";\n`,
      },
    },
    {
      kind: "discover",
      title: L("Bytes vs characters: mb_ functions", "Octets et caractères : les fonctions mb_"),
      body: [
        L(
          "PHP strings are sequences of **bytes**. In UTF-8, `é` takes 2 bytes, so `strlen(\"café\")` says 5. The `mb_` (multibyte) functions count real **characters**: `mb_strlen(\"café\")` says 4.",
          "Les chaînes PHP sont des suites d'**octets**. En UTF-8, `é` prend 2 octets, donc `strlen(\"café\")` répond 5. Les fonctions `mb_` (multi-octets) comptent les vrais **caractères** : `mb_strlen(\"café\")` répond 4.",
        ),
        L(
          "As soon as text comes from people (names, messages, cities), use `mb_strlen`, `mb_substr`, `mb_strtoupper`. Otherwise you'll cut a letter in half or skip accents.",
          "Dès que le texte vient de vraies personnes (noms, messages, villes), utilise `mb_strlen`, `mb_substr`, `mb_strtoupper`. Sinon tu couperas une lettre en deux ou tu oublieras les accents.",
        ),
      ],
      example: {
        code: `<?php\n$word = "café";\necho strlen($word), "\\n";\necho mb_strlen($word), "\\n";\necho strtoupper($word), "\\n";\necho mb_strtoupper($word), "\\n";\necho mb_substr("Zoë Saldaña", 0, 3);\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "`strtoupper()` only changes ASCII letters a–z, so `café` becomes `CAFé`. `mb_strtoupper()` gives `CAFÉ`.",
          "`strtoupper()` ne change que les lettres ASCII a–z : `café` devient `CAFé`. `mb_strtoupper()` donne `CAFÉ`.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Read the template", "Lis le gabarit"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nprintf("[%5s][%-5s]", "ab", "ab");\n`,
      options: ["[   ab][ab   ]", "[ab   ][   ab]", "[ab][ab]", "[00 ab][ab 00]"],
      answer: 0,
      explain: L(
        "`%5s` pads to 5 characters on the left (right-aligned); the minus in `%-5s` pads on the right (left-aligned).",
        "`%5s` complète à 5 caractères par la gauche (aligné à droite) ; le moins de `%-5s` complète par la droite (aligné à gauche).",
      ),
    },
    {
      kind: "try",
      title: L("A receipt line", "Une ligne de ticket de caisse"),
      body: L(
        "Write `receiptLine(string $item, float $price): string`: the item padded to 12 characters with dots, then the price with 2 decimals right-aligned in 8 characters. `receiptLine('Coffee', 3.5)` returns `Coffee......    3.50`.",
        "Écris `receiptLine(string $item, float $price): string` : l'article complété à 12 caractères avec des points, puis le prix avec 2 décimales aligné à droite sur 8 caractères. `receiptLine('Coffee', 3.5)` renvoie `Coffee......    3.50`.",
      ),
      files: { "index.php": `<?php\nfunction receiptLine(string $item, float $price): string {\n    return $item . " " . $price;\n}\n\necho receiptLine("Coffee", 3.5), "\\n";\necho receiptLine("Croissant", 12);\n` },
      solution: {
        "index.php": `<?php\nfunction receiptLine(string $item, float $price): string {\n    return str_pad($item, 12, ".") . sprintf("%8.2f", $price);\n}\n\necho receiptLine("Coffee", 3.5), "\\n";\necho receiptLine("Croissant", 12);\n`,
      },
      probes: ["receiptLine('Coffee', 3.5)", "receiptLine('Croissant', 12)"],
      objectives: [
        {
          id: "line",
          label: L("receiptLine('Coffee', 3.5) returns Coffee......    3.50", "receiptLine('Coffee', 3.5) renvoie Coffee......    3.50"),
          check: all(probeIs("receiptLine('Coffee', 3.5)", "Coffee......    3.50"), probeIs("receiptLine('Croissant', 12)", "Croissant...   12.00")),
          hints: [
            L("Two parts glued together: the padded name, then the formatted price.", "Deux parties collées : le nom complété, puis le prix formaté."),
            L("`str_pad($item, 12, \".\")` and `sprintf(\"%8.2f\", $price)`.", "`str_pad($item, 12, \".\")` et `sprintf(\"%8.2f\", $price)`."),
            L("`return str_pad($item, 12, \".\") . sprintf(\"%8.2f\", $price);`", "`return str_pad($item, 12, \".\") . sprintf(\"%8.2f\", $price);`"),
          ],
        },
      ],
      cheat: "string-functions",
    },
    {
      kind: "challenge",
      title: L("Print an invoice", "Imprime une facture"),
      body: L(
        "Print one aligned line per item with `printf` (name, quantity like `x2`, line total with 2 decimals), so that all three item lines have the same length. Then print `Total: 132.05`.",
        "Affiche une ligne alignée par article avec `printf` (nom, quantité comme `x2`, total de la ligne avec 2 décimales), de sorte que les trois lignes d'articles aient la même longueur. Puis affiche `Total: 132.05`.",
      ),
      files: {
        "index.php": `<?php\n$items = [\n    ["Keyboard", 2, 49.90],\n    ["Mouse", 1, 19.50],\n    ["Cable", 3, 4.25],\n];\n\nforeach ($items as $item) {\n    echo $item[0] . " x" . $item[1] . " " . $item[1] * $item[2] . "\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\n$items = [\n    ["Keyboard", 2, 49.90],\n    ["Mouse", 1, 19.50],\n    ["Cable", 3, 4.25],\n];\n\n$total = 0;\nforeach ($items as $item) {\n    $line = $item[1] * $item[2];\n    $total += $line;\n    printf("%-10s x%d %8.2f\\n", $item[0], $item[1], $line);\n}\nprintf("Total: %.2f", $total);\n`,
      },
      objectives: [
        {
          id: "aligned",
          label: L("The three item lines are aligned (same length)", "Les trois lignes d'articles sont alignées (même longueur)"),
          check: all(aligned(["Keyboard", "Mouse", "Cable"]), outputHas("99.80"), outputHas("12.75")),
          hints: [
            L("Give every column a fixed width: pad the name, and the amount.", "Donne une largeur fixe à chaque colonne : complète le nom, et le montant."),
            L("`%-10s` for the name, `x%d` for the quantity, `%8.2f` for the amount.", "`%-10s` pour le nom, `x%d` pour la quantité, `%8.2f` pour le montant."),
            L("In the loop: `printf(\"%-10s x%d %8.2f\\n\", $item[0], $item[1], $item[1] * $item[2]);`", "Dans la boucle : `printf(\"%-10s x%d %8.2f\\n\", $item[0], $item[1], $item[1] * $item[2]);`"),
          ],
        },
        {
          id: "total",
          label: L("Print: Total: 132.05", "Afficher : Total: 132.05"),
          check: outputHas(/^Total: 132\.05$/m),
          hints: [
            L("Add each line total to a `$total` variable inside the loop.", "Ajoute chaque total de ligne à une variable `$total` dans la boucle."),
            L("Start with `$total = 0;` and do `$total += …;` in the loop; print with `%.2f`.", "Commence par `$total = 0;` et fais `$total += …;` dans la boucle ; affiche avec `%.2f`."),
            L("After the loop: `printf(\"Total: %.2f\", $total);`", "Après la boucle : `printf(\"Total: %.2f\", $total);`"),
          ],
        },
        {
          id: "printf",
          label: L("Use printf or sprintf", "Utiliser printf ou sprintf"),
          check: uses(/s?printf\s*\(/),
          hints: [
            L("printf fills a template.", "printf remplit un gabarit."),
            L("`printf(\"%-10s …\", …);`", "`printf(\"%-10s …\", …);`"),
            L("Replace the echo in the loop with a printf call.", "Remplace le echo de la boucle par un appel à printf."),
          ],
        },
      ],
      cheat: "string-functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`printf`/`sprintf` fill templates: `%s`, `%d`, `%.2f`, widths like `%-10s` and `%8.2f`.", "`printf`/`sprintf` remplissent des gabarits : `%s`, `%d`, `%.2f`, largeurs comme `%-10s` et `%8.2f`."),
    L("`number_format` adds thousands separators and fixed decimals.", "`number_format` ajoute les séparateurs de milliers et des décimales fixes."),
    L("`str_pad` pads to a fixed width, left or right.", "`str_pad` complète jusqu'à une largeur fixe, à gauche ou à droite."),
    L("Use `mb_` functions for human text: they count characters, not bytes.", "Utilise les fonctions `mb_` pour le texte humain : elles comptent des caractères, pas des octets."),
  ],
};

export const regex: Lesson = {
  id: "regex",
  chapterId: CH,
  title: L("Regular expressions", "Les expressions régulières"),
  tagline: L("Describe a pattern once, then find, validate and replace", "Décris un motif une fois, puis trouve, valide et remplace"),
  xp: 50,
  syntax: ["preg_match", "preg_match_all", "preg_replace", "preg_split", "/^\\d+$/", "(…)"],
  doc: "guide-text-data",
  steps: [
    {
      kind: "discover",
      title: L("A tiny language for patterns", "Un petit langage pour les motifs"),
      body: [
        L(
          "A **regular expression** (regex) describes the *shape* of text: \"five digits\", \"letters then an @\", \"a dash between numbers\". Instead of writing loops to check each character, you describe the pattern once.",
          "Une **expression régulière** (regex) décrit la *forme* d'un texte : « cinq chiffres », « des lettres puis un @ », « un tiret entre des nombres ». Au lieu d'écrire des boucles pour vérifier chaque caractère, tu décris le motif une fois.",
        ),
        L(
          "In PHP the pattern sits between delimiters, usually slashes: `'/php/i'` (the `i` means case-insensitive). `\\d` is a digit, `\\w` a letter, digit or underscore, `+` means \"one or more\", `{5}` exactly five, `^` and `$` the start and end of the text.",
          "En PHP, le motif se place entre des délimiteurs, souvent des slashs : `'/php/i'` (le `i` veut dire insensible à la casse). `\\d` est un chiffre, `\\w` une lettre, un chiffre ou un tiret bas, `+` veut dire « un ou plusieurs », `{5}` exactement cinq, `^` et `$` le début et la fin du texte.",
        ),
        L(
          "`preg_match()` returns 1 if the pattern is found, 0 if not.",
          "`preg_match()` renvoie 1 si le motif est trouvé, 0 sinon.",
        ),
      ],
      example: {
        code: `<?php\nvar_dump(preg_match('/php/i', "I love PHP"));\nvar_dump(preg_match('/^\\d{5}$/', "75001"));\nvar_dump(preg_match('/^\\d{5}$/', "7500"));\n`,
        caption: L("Single quotes keep the backslashes as they are: always write patterns in single quotes.", "Les guillemets simples gardent les antislashs tels quels : écris toujours les motifs entre guillemets simples."),
      },
    },
    {
      kind: "discover",
      title: L("Capturing groups", "Les groupes de capture"),
      body: [
        L(
          "Parentheses `( )` **capture** part of the match. Pass a third argument to `preg_match()` and it fills an array: index 0 is the whole match, 1 the first group, and so on.",
          "Les parenthèses `( )` **capturent** une partie de la correspondance. Passe un troisième argument à `preg_match()` et il remplit un tableau : l'indice 0 est la correspondance entière, 1 le premier groupe, et ainsi de suite.",
        ),
        L(
          "Named groups `(?<year>\\d{4})` make the result easier to read: `$m['year']`.",
          "Les groupes nommés `(?<year>\\d{4})` rendent le résultat plus lisible : `$m['year']`.",
        ),
      ],
      example: {
        code: `<?php\n$date = "2026-03-14";\nif (preg_match('/^(\\d{4})-(\\d{2})-(\\d{2})$/', $date, $m)) {\n    print_r($m);\n    echo "Month: {$m[2]}\\n";\n}\n\npreg_match('/(?<user>\\w+)@(?<domain>[\\w.]+)/', "ada@example.com", $email);\necho $email['user'], " at ", $email['domain'];\n`,
      },
    },
    {
      kind: "discover",
      title: L("Find all, replace, split", "Tout trouver, remplacer, découper"),
      body: [
        L(
          "`preg_match_all()` finds **every** match, `preg_replace()` replaces every match, and `preg_split()` splits text wherever the pattern matches, perfect when separators are irregular.",
          "`preg_match_all()` trouve **toutes** les correspondances, `preg_replace()` remplace chaque correspondance, et `preg_split()` découpe le texte partout où le motif correspond, parfait quand les séparateurs sont irréguliers.",
        ),
      ],
      example: {
        code: `<?php\n$text = "Call 555-1234 or 555-9876 today";\npreg_match_all('/\\d{3}-\\d{4}/', $text, $all);\nprint_r($all[0]);\necho preg_replace('/\\d/', '#', $text), "\\n";\nprint_r(preg_split('/[\\s,]+/', "red, green  blue,yellow"));\n`,
      },
      callout: {
        tone: "warn",
        text: L(
          "Regexes are powerful but hard to read. When `str_contains()` or `explode()` is enough, use them. Never validate an email with a home-made regex: use `filter_var($email, FILTER_VALIDATE_EMAIL)`.",
          "Les regex sont puissantes mais difficiles à lire. Quand `str_contains()` ou `explode()` suffit, utilise-les. Ne valide jamais un e-mail avec une regex maison : utilise `filter_var($email, FILTER_VALIDATE_EMAIL)`.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Greedy pluses", "Le plus gourmand"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho preg_replace('/a+/', '-', "baaad banana");\n`,
      options: ["b-d b-n-n-", "b---d b-n-n-", "bd bnn", "b-d banana"],
      answer: 0,
      explain: L(
        "`a+` matches one or more `a` in a row, as many as possible: `aaa` becomes a single dash. Each lone `a` in banana is its own match.",
        "`a+` correspond à un ou plusieurs `a` à la suite, autant que possible : `aaa` devient un seul tiret. Chaque `a` isolé de banana est une correspondance à part.",
      ),
    },
    {
      kind: "try",
      title: L("Validate a product code", "Valide un code produit"),
      body: L(
        "Product codes look like `ABC-1234`: three uppercase letters, a dash, four digits, nothing else. Write `isValidCode(string $code): bool`.",
        "Les codes produit ressemblent à `ABC-1234` : trois majuscules, un tiret, quatre chiffres, rien d'autre. Écris `isValidCode(string $code): bool`.",
      ),
      files: { "index.php": `<?php\nfunction isValidCode(string $code): bool {\n    return strlen($code) === 8;\n}\n\nvar_dump(isValidCode("ABC-1234"));\n` },
      solution: { "index.php": `<?php\nfunction isValidCode(string $code): bool {\n    return preg_match('/^[A-Z]{3}-\\d{4}$/', $code) === 1;\n}\n\nvar_dump(isValidCode("ABC-1234"));\n` },
      probes: ["isValidCode('ABC-1234')", "isValidCode('abc-1234')", "isValidCode('ABC-12345')", "isValidCode('ABCD1234')", "isValidCode('xABC-1234')"],
      objectives: [
        {
          id: "valid",
          label: L("Accept ABC-1234, reject the others", "Accepter ABC-1234, refuser les autres"),
          check: all(
            probeIs("isValidCode('ABC-1234')", true),
            probeIs("isValidCode('abc-1234')", false),
            probeIs("isValidCode('ABC-12345')", false),
            probeIs("isValidCode('ABCD1234')", false),
            probeIs("isValidCode('xABC-1234')", false),
            uses(/preg_match\s*\(/),
          ),
          hints: [
            L("Describe the whole code from start `^` to end `$`, so nothing extra can sneak in.", "Décris tout le code du début `^` à la fin `$`, pour que rien de plus ne puisse s'ajouter."),
            L("`[A-Z]{3}` is three uppercase letters, `\\d{4}` four digits.", "`[A-Z]{3}` vaut trois majuscules, `\\d{4}` quatre chiffres."),
            L("`return preg_match('/^[A-Z]{3}-\\d{4}$/', $code) === 1;`", "`return preg_match('/^[A-Z]{3}-\\d{4}$/', $code) === 1;`"),
          ],
        },
      ],
      cheat: "regex",
    },
    {
      kind: "challenge",
      title: L("Hashtags and slugs", "Hashtags et slugs"),
      body: L(
        "Write `hashtags(string $text): array` returning the unique hashtags in lowercase, without `#` (`'Learning #PHP and #Regex today #php'` → `['php', 'regex']`). Then write `slugify(string $title): string` turning any title into a URL slug: lowercase, every run of non-alphanumeric characters becomes one dash, no dash at either end.",
        "Écris `hashtags(string $text): array` qui renvoie les hashtags uniques en minuscules, sans `#` (`'Learning #PHP and #Regex today #php'` → `['php', 'regex']`). Puis écris `slugify(string $title): string` qui transforme un titre en slug d'URL : minuscules, chaque suite de caractères non alphanumériques devient un seul tiret, pas de tiret au début ni à la fin.",
      ),
      files: { "index.php": `<?php\nfunction hashtags(string $text): array {\n    return [];\n}\n\nfunction slugify(string $title): string {\n    return $title;\n}\n\nprint_r(hashtags("Learning #PHP and #Regex today #php"));\necho slugify("  Hello, World! PHP 8.5 ");\n` },
      solution: {
        "index.php": `<?php\nfunction hashtags(string $text): array {\n    preg_match_all('/#(\\w+)/', $text, $m);\n    return array_values(array_unique(array_map('strtolower', $m[1])));\n}\n\nfunction slugify(string $title): string {\n    $slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($title));\n    return trim($slug, '-');\n}\n\nprint_r(hashtags("Learning #PHP and #Regex today #php"));\necho slugify("  Hello, World! PHP 8.5 ");\n`,
      },
      probes: ["hashtags('Learning #PHP and #Regex today #php')", "hashtags('no tags here')", "slugify('  Hello, World! PHP 8.5 ')", "slugify('Already-a-slug')"],
      objectives: [
        {
          id: "tags",
          label: L("hashtags() returns ['php', 'regex']", "hashtags() renvoie ['php', 'regex']"),
          check: all(probeIs("hashtags('Learning #PHP and #Regex today #php')", ["php", "regex"]), probeIs("hashtags('no tags here')", [])),
          hints: [
            L("Find every `#` followed by word characters, capture the word, then lowercase and deduplicate.", "Trouve chaque `#` suivi de caractères de mot, capture le mot, puis passe en minuscules et retire les doublons."),
            L("`preg_match_all('/#(\\w+)/', $text, $m)` puts the words in `$m[1]`. Then `array_map('strtolower', …)`, `array_unique()`, `array_values()`.", "`preg_match_all('/#(\\w+)/', $text, $m)` met les mots dans `$m[1]`. Puis `array_map('strtolower', …)`, `array_unique()`, `array_values()`."),
            L(
              "`preg_match_all('/#(\\w+)/', $text, $m); return array_values(array_unique(array_map('strtolower', $m[1])));`",
              "`preg_match_all('/#(\\w+)/', $text, $m); return array_values(array_unique(array_map('strtolower', $m[1])));`",
            ),
          ],
        },
        {
          id: "slug",
          label: L("slugify('  Hello, World! PHP 8.5 ') returns hello-world-php-8-5", "slugify('  Hello, World! PHP 8.5 ') renvoie hello-world-php-8-5"),
          check: all(probeIs("slugify('  Hello, World! PHP 8.5 ')", "hello-world-php-8-5"), probeIs("slugify('Already-a-slug')", "already-a-slug")),
          hints: [
            L("Lowercase first, then replace anything that isn't a-z or 0-9 by a dash, then trim the dashes.", "Passe d'abord en minuscules, puis remplace tout ce qui n'est pas a-z ou 0-9 par un tiret, puis retire les tirets des bords."),
            L("`[^a-z0-9]+` means \"one or more characters that are not a-z or 0-9\". `trim($slug, '-')` removes dashes at the ends.", "`[^a-z0-9]+` veut dire « un ou plusieurs caractères qui ne sont pas a-z ou 0-9 ». `trim($slug, '-')` retire les tirets aux extrémités."),
            L(
              "`$slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($title)); return trim($slug, '-');`",
              "`$slug = preg_replace('/[^a-z0-9]+/', '-', strtolower($title)); return trim($slug, '-');`",
            ),
          ],
        },
      ],
      cheat: "regex",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A regex describes a pattern: `\\d` digit, `\\w` word character, `+` one or more, `^…$` the whole text.", "Une regex décrit un motif : `\\d` chiffre, `\\w` caractère de mot, `+` un ou plusieurs, `^…$` tout le texte."),
    L("`preg_match` tests and captures groups; `preg_match_all` finds every match.", "`preg_match` teste et capture des groupes ; `preg_match_all` trouve toutes les correspondances."),
    L("`preg_replace` and `preg_split` replace and split by pattern.", "`preg_replace` et `preg_split` remplacent et découpent selon un motif."),
    L("Prefer simple string functions when they're enough; write patterns in single quotes.", "Préfère les fonctions de chaînes simples quand elles suffisent ; écris les motifs entre guillemets simples."),
  ],
};

export const dates: Lesson = {
  id: "dates",
  chapterId: CH,
  title: L("Dates and times", "Dates et heures"),
  tagline: L("DateTimeImmutable: create, format, shift and compare dates", "DateTimeImmutable : créer, formater, décaler et comparer des dates"),
  xp: 50,
  syntax: ["DateTimeImmutable", "->format()", "->modify()", "->diff()", "DateInterval"],
  doc: "guide-text-data",
  steps: [
    {
      kind: "discover",
      title: L("A date is an object", "Une date est un objet"),
      body: [
        L(
          "Dates are surprisingly hard: months have different lengths, there are leap years and time zones. Don't do date maths with numbers. PHP's `DateTimeImmutable` knows all the rules.",
          "Les dates sont étonnamment difficiles : les mois n'ont pas la même longueur, il y a les années bissextiles et les fuseaux horaires. Ne fais pas de calculs de dates avec des nombres. Le `DateTimeImmutable` de PHP connaît toutes les règles.",
        ),
        L(
          "`new DateTimeImmutable(\"2026-07-14 09:30\")` creates a date. `->format(\"…\")` turns it into text with letters as codes: `Y` year, `m` month, `d` day, `H:i` hours and minutes, `l` day name, `F` month name, `D` and `M` their short forms.",
          "`new DateTimeImmutable(\"2026-07-14 09:30\")` crée une date. `->format(\"…\")` la transforme en texte avec des lettres-codes : `Y` année, `m` mois, `d` jour, `H:i` heures et minutes, `l` nom du jour, `F` nom du mois, `D` et `M` leurs formes courtes.",
        ),
      ],
      example: {
        code: `<?php\n$launch = new DateTimeImmutable("2026-07-14 09:30");\necho $launch->format("Y-m-d"), "\\n";\necho $launch->format("l j F Y"), "\\n";\necho $launch->format("H:i"), "\\n";\necho $launch->format("D, d M Y");\n`,
      },
      callout: {
        tone: "info",
        text: L(
          "This app runs in the UTC time zone. In tests and lessons, always use fixed dates rather than \"now\", so the result is the same every time you run it.",
          "Cette appli tourne dans le fuseau UTC. Dans les tests et les leçons, utilise toujours des dates fixes plutôt que « maintenant », pour que le résultat soit le même à chaque exécution.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Moving through time", "Se déplacer dans le temps"),
      body: [
        L(
          "`->modify(\"+1 day\")` and `->add(new DateInterval(\"P1W\"))` return a **new** date; the original never changes. That's what *immutable* means, and it prevents a whole family of bugs where one part of the code moves a date another part was still using.",
          "`->modify(\"+1 day\")` et `->add(new DateInterval(\"P1W\"))` renvoient une **nouvelle** date ; l'originale ne change jamais. C'est ce que veut dire *immuable*, et ça évite toute une famille de bugs où une partie du code déplace une date qu'une autre partie utilisait encore.",
        ),
        L(
          "Watch out: \"+1 month\" from January 31 overflows into March. Use \"last day of next month\" when you mean it.",
          "Attention : « +1 month » depuis le 31 janvier déborde en mars. Utilise « last day of next month » quand c'est ce que tu veux dire.",
        ),
      ],
      example: {
        code: `<?php\n$start = new DateTimeImmutable("2026-01-31");\n$next = $start->modify("+1 day");\necho $start->format("Y-m-d"), " -> ", $next->format("Y-m-d"), "\\n";\necho $start->modify("+1 month")->format("Y-m-d"), "\\n";\necho $start->modify("last day of next month")->format("Y-m-d"), "\\n";\necho $start->add(new DateInterval("P1W"))->format("Y-m-d");\n`,
      },
    },
    {
      kind: "discover",
      title: L("Differences and comparisons", "Écarts et comparaisons"),
      body: [
        L(
          "`$a->diff($b)` returns a `DateInterval`: `->days` is the total number of days, `->y`, `->m`, `->d` the years, months and days. Dates compare with `<`, `>` and `==` like numbers.",
          "`$a->diff($b)` renvoie un `DateInterval` : `->days` est le nombre total de jours, `->y`, `->m`, `->d` les années, mois et jours. Les dates se comparent avec `<`, `>` et `==` comme des nombres.",
        ),
      ],
      example: {
        code: `<?php\n$a = new DateTimeImmutable("2026-03-01");\n$b = new DateTimeImmutable("2026-12-25");\n$gap = $a->diff($b);\necho $gap->days, " days\\n";\necho $gap->format("%m months and %d days"), "\\n";\nvar_dump($a < $b);\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Immutable means immutable", "Immuable veut dire immuable"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$d = new DateTimeImmutable("2026-05-10");\n$d->modify("+5 days");\necho $d->format("d");\n`,
      options: ["15", "10", "05", "16"],
      answer: 1,
      explain: L(
        "`modify()` returned a new date, but nobody kept it: `$d` is still May 10. Write `$d = $d->modify(\"+5 days\");` to move it.",
        "`modify()` a renvoyé une nouvelle date, mais personne ne l'a gardée : `$d` est toujours le 10 mai. Écris `$d = $d->modify(\"+5 days\");` pour la déplacer.",
      ),
    },
    {
      kind: "watch",
      title: L("A deadline reminder", "Un rappel d'échéance"),
      body: L(
        "Step through and watch each variable: two dates, a number of days, a new date a week earlier, and a label.",
        "Avance pas à pas et regarde chaque variable : deux dates, un nombre de jours, une nouvelle date une semaine plus tôt, et une étiquette.",
      ),
      code: `<?php\n$deadline = new DateTimeImmutable("2026-06-30");\n$today = new DateTimeImmutable("2026-06-02");\n$left = $today->diff($deadline)->days;\n$reminder = $deadline->modify("-7 days");\n$label = $reminder->format("D j M");\necho "$left days left. Reminder on $label.";\n`,
      notes: {
        2: L("The Variables panel shows the object and its date.", "Le panneau Variables montre l'objet et sa date."),
        4: L("diff() gives an interval; ->days is the total: 28.", "diff() donne un intervalle ; ->days est le total : 28."),
        5: L("A new object; `$deadline` is unchanged.", "Un nouvel objet ; `$deadline` ne change pas."),
        6: L("format() turns the date into text.", "format() transforme la date en texte."),
      },
    },
    {
      kind: "try",
      title: L("How old?", "Quel âge ?"),
      body: L(
        "Write `age(string $birth, string $on): int` returning the number of **full** years between the two dates. Someone born on 1990-08-20 is 35 on 2026-08-19 and 36 the next day.",
        "Écris `age(string $birth, string $on): int` qui renvoie le nombre d'années **complètes** entre les deux dates. Quelqu'un né le 1990-08-20 a 35 ans le 2026-08-19 et 36 le lendemain.",
      ),
      files: { "index.php": `<?php\nfunction age(string $birth, string $on): int {\n    return (int) substr($on, 0, 4) - (int) substr($birth, 0, 4);\n}\n\necho age("1990-08-20", "2026-08-19");\n` },
      solution: {
        "index.php": `<?php\nfunction age(string $birth, string $on): int {\n    $from = new DateTimeImmutable($birth);\n    $to = new DateTimeImmutable($on);\n    return $from->diff($to)->y;\n}\n\necho age("1990-08-20", "2026-08-19");\n`,
      },
      probes: ["age('1990-08-20', '2026-08-19')", "age('1990-08-20', '2026-08-20')", "age('2000-02-29', '2026-03-01')"],
      objectives: [
        {
          id: "age",
          label: L("Count only full years (35, then 36 on the birthday)", "Ne compter que les années complètes (35, puis 36 le jour de l'anniversaire)"),
          check: all(probeIs("age('1990-08-20', '2026-08-19')", 35), probeIs("age('1990-08-20', '2026-08-20')", 36), probeIs("age('2000-02-29', '2026-03-01')", 26)),
          hints: [
            L("Subtracting years ignores whether the birthday has happened yet. Let DateTimeImmutable compute the interval.", "Soustraire les années ignore si l'anniversaire est passé. Laisse DateTimeImmutable calculer l'intervalle."),
            L("Create two DateTimeImmutable objects, then `->diff()`; the interval's `->y` is the full years.", "Crée deux objets DateTimeImmutable, puis `->diff()` ; le `->y` de l'intervalle donne les années complètes."),
            L("`return (new DateTimeImmutable($birth))->diff(new DateTimeImmutable($on))->y;`", "`return (new DateTimeImmutable($birth))->diff(new DateTimeImmutable($on))->y;`"),
          ],
        },
      ],
      cheat: "dates",
    },
    {
      kind: "challenge",
      title: L("Subscription dates", "Les dates d'un abonnement"),
      body: L(
        "Write three functions for a subscription service. `renewalDate(string $start, int $months): string` returns the date `$months` months later as `Y-m-d`. `daysUntil(string $from, string $to): int` returns the number of days between them. `isWeekend(string $date): bool` is true on Saturdays and Sundays.",
        "Écris trois fonctions pour un service d'abonnement. `renewalDate(string $start, int $months): string` renvoie la date `$months` mois plus tard au format `Y-m-d`. `daysUntil(string $from, string $to): int` renvoie le nombre de jours entre les deux. `isWeekend(string $date): bool` vaut true le samedi et le dimanche.",
      ),
      files: { "index.php": `<?php\n// renewalDate, daysUntil, isWeekend\n\n` },
      solution: {
        "index.php": `<?php\nfunction renewalDate(string $start, int $months): string {\n    return (new DateTimeImmutable($start))->modify("+$months months")->format("Y-m-d");\n}\n\nfunction daysUntil(string $from, string $to): int {\n    return (new DateTimeImmutable($from))->diff(new DateTimeImmutable($to))->days;\n}\n\nfunction isWeekend(string $date): bool {\n    return (int) (new DateTimeImmutable($date))->format("N") >= 6;\n}\n\necho renewalDate("2026-01-15", 3), "\\n";\necho daysUntil("2026-12-01", "2026-12-25"), " days\\n";\nvar_dump(isWeekend("2026-11-28"));\n`,
      },
      probes: ["renewalDate('2026-01-15', 3)", "renewalDate('2026-11-10', 2)", "daysUntil('2026-12-01', '2026-12-25')", "daysUntil('2026-01-01', '2027-01-01')", "isWeekend('2026-11-28')", "isWeekend('2026-11-29')", "isWeekend('2026-11-30')"],
      objectives: [
        {
          id: "renewal",
          label: L("renewalDate('2026-01-15', 3) returns 2026-04-15", "renewalDate('2026-01-15', 3) renvoie 2026-04-15"),
          check: all(probeIs("renewalDate('2026-01-15', 3)", "2026-04-15"), probeIs("renewalDate('2026-11-10', 2)", "2027-01-10")),
          hints: [
            L("Create the date, shift it, then format it.", "Crée la date, décale-la, puis formate-la."),
            L("`->modify(\"+$months months\")` then `->format(\"Y-m-d\")`.", "`->modify(\"+$months months\")` puis `->format(\"Y-m-d\")`."),
            L("`return (new DateTimeImmutable($start))->modify(\"+$months months\")->format(\"Y-m-d\");`", "`return (new DateTimeImmutable($start))->modify(\"+$months months\")->format(\"Y-m-d\");`"),
          ],
        },
        {
          id: "days",
          label: L("daysUntil('2026-12-01', '2026-12-25') returns 24", "daysUntil('2026-12-01', '2026-12-25') renvoie 24"),
          check: all(probeIs("daysUntil('2026-12-01', '2026-12-25')", 24), probeIs("daysUntil('2026-01-01', '2027-01-01')", 365)),
          hints: [
            L("The interval from diff() has the total number of days.", "L'intervalle renvoyé par diff() contient le nombre total de jours."),
            L("`$a->diff($b)->days`", "`$a->diff($b)->days`"),
            L("`return (new DateTimeImmutable($from))->diff(new DateTimeImmutable($to))->days;`", "`return (new DateTimeImmutable($from))->diff(new DateTimeImmutable($to))->days;`"),
          ],
        },
        {
          id: "weekend",
          label: L("isWeekend is true on 2026-11-28 and 29, false on the 30th", "isWeekend vaut true les 28 et 29/11/2026, false le 30"),
          check: all(probeIs("isWeekend('2026-11-28')", true), probeIs("isWeekend('2026-11-29')", true), probeIs("isWeekend('2026-11-30')", false)),
          hints: [
            L("The format code `N` gives the day of the week: 1 for Monday … 7 for Sunday.", "Le code de format `N` donne le jour de la semaine : 1 pour lundi … 7 pour dimanche."),
            L("`(int) $date->format(\"N\") >= 6`", "`(int) $date->format(\"N\") >= 6`"),
            L("`return (int) (new DateTimeImmutable($date))->format(\"N\") >= 6;`", "`return (int) (new DateTimeImmutable($date))->format(\"N\") >= 6;`"),
          ],
        },
      ],
      cheat: "dates",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Use `DateTimeImmutable` instead of doing date maths by hand.", "Utilise `DateTimeImmutable` au lieu de calculer les dates à la main."),
    L("`format()` codes: `Y-m-d`, `H:i`, `l`, `F`, `N`…", "Codes de `format()` : `Y-m-d`, `H:i`, `l`, `F`, `N`…"),
    L("`modify()` and `add()` return a new date: keep the result.", "`modify()` et `add()` renvoient une nouvelle date : garde le résultat."),
    L("`diff()` gives an interval (`->days`, `->y`); dates compare with `<` and `>`.", "`diff()` donne un intervalle (`->days`, `->y`) ; les dates se comparent avec `<` et `>`."),
  ],
};

export const json: Lesson = {
  id: "json",
  chapterId: CH,
  title: L("JSON", "JSON"),
  tagline: L("Talk to APIs and JavaScript: encode, decode, validate", "Parle aux API et à JavaScript : encoder, décoder, valider"),
  xp: 50,
  syntax: ["json_encode", "json_decode", "JSON_PRETTY_PRINT", "JSON_THROW_ON_ERROR", "json_validate"],
  doc: "guide-text-data",
  steps: [
    {
      kind: "discover",
      title: L("The language of APIs", "La langue des API"),
      body: [
        L(
          "**JSON** is the text format almost every API, JavaScript front end and config file speaks. A PHP API mostly does one thing: build arrays, then `json_encode()` them.",
          "Le **JSON** est le format texte que parlent presque toutes les API, les interfaces JavaScript et les fichiers de configuration. Une API PHP fait surtout une chose : construire des tableaux, puis les passer à `json_encode()`.",
        ),
        L(
          "A list (keys 0, 1, 2…) becomes a JSON array `[…]`; an associative array becomes an object `{…}`. `JSON_PRETTY_PRINT` adds indentation for humans.",
          "Une liste (clés 0, 1, 2…) devient un tableau JSON `[…]` ; un tableau associatif devient un objet `{…}`. `JSON_PRETTY_PRINT` ajoute une indentation pour les humains.",
        ),
      ],
      example: {
        code: `<?php\n$user = ["name" => "Ada", "age" => 36, "langs" => ["PHP", "SQL"], "admin" => false];\necho json_encode($user), "\\n";\necho json_encode($user, JSON_PRETTY_PRINT);\n`,
      },
    },
    {
      kind: "discover",
      title: L("Reading JSON", "Lire du JSON"),
      body: [
        L(
          "`json_decode($json)` gives objects (`$obj->title`). With `true` as second argument it gives associative arrays (`$arr[\"title\"]`), which are usually easier to work with.",
          "`json_decode($json)` donne des objets (`$obj->title`). Avec `true` en deuxième argument, il donne des tableaux associatifs (`$arr[\"title\"]`), souvent plus pratiques.",
        ),
        L(
          "On invalid JSON, `json_decode()` quietly returns `null`. That's dangerous: `null` could also be a valid value. Ask `json_last_error_msg()`, or better, make it throw (next step).",
          "Sur du JSON invalide, `json_decode()` renvoie `null` sans rien dire. C'est dangereux : `null` pourrait aussi être une valeur valide. Demande `json_last_error_msg()`, ou mieux, fais-le lever une exception (étape suivante).",
        ),
      ],
      example: {
        code: `<?php\n$json = '{"title":"PHP Learn","tags":["php","wasm"],"stars":42}';\n$obj = json_decode($json);\necho $obj->title, "\\n";\n$arr = json_decode($json, true);\necho $arr["tags"][1], "\\n";\n\nvar_dump(json_decode("not json"));\necho json_last_error_msg();\n`,
      },
    },
    {
      kind: "discover",
      title: L("Failing loudly", "Échouer bruyamment"),
      body: [
        L(
          "With the `JSON_THROW_ON_ERROR` flag, bad JSON throws a `JsonException` you can catch with `try`/`catch` (you'll master exceptions in the Errors chapter). No silent `null`.",
          "Avec l'option `JSON_THROW_ON_ERROR`, du mauvais JSON lève une `JsonException` que tu peux attraper avec `try`/`catch` (tu maîtriseras les exceptions dans le chapitre sur les erreurs). Plus de `null` silencieux.",
        ),
        L(
          "If you only need to know whether a string is valid JSON, `json_validate()` answers without building the whole structure in memory.",
          "Si tu veux seulement savoir si une chaîne est du JSON valide, `json_validate()` répond sans construire toute la structure en mémoire.",
        ),
      ],
      example: {
        code: `<?php\ntry {\n    json_decode("{bad json}", true, 512, JSON_THROW_ON_ERROR);\n} catch (JsonException $e) {\n    echo "Invalid JSON: ", $e->getMessage(), "\\n";\n}\n\nvar_dump(json_validate('{"ok":true}'));\nvar_dump(json_validate('{ok:true}'));\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "`JSON_THROW_ON_ERROR` exists since PHP 7.3; `json_validate()` arrived in PHP 8.3. Switch to 8.2 to see \"Call to undefined function json_validate()\".",
          "`JSON_THROW_ON_ERROR` existe depuis PHP 7.3 ; `json_validate()` est arrivée en PHP 8.3. Passe en 8.2 pour voir « Call to undefined function json_validate() ».",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Array or object?", "Tableau ou objet ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho json_encode([1 => "a", 2 => "b"]);\n`,
      options: ['["a","b"]', '{"1":"a","2":"b"}', '[null,"a","b"]', '{"a","b"}'],
      answer: 1,
      explain: L(
        "A JSON array must have keys 0, 1, 2… in order. These keys start at 1, so PHP has to produce an object. Use `array_values()` first if you want a list.",
        "Un tableau JSON doit avoir les clés 0, 1, 2… dans l'ordre. Ici les clés commencent à 1 : PHP doit produire un objet. Utilise d'abord `array_values()` si tu veux une liste.",
      ),
    },
    {
      kind: "watch",
      title: L("Decode, change, encode", "Décoder, modifier, encoder"),
      body: L(
        "The typical round trip of an API: JSON comes in, becomes a PHP array, is modified, and goes back out as JSON.",
        "L'aller-retour typique d'une API : du JSON arrive, devient un tableau PHP, est modifié, et repart en JSON.",
      ),
      code: `<?php\n$json = '{"cart":[{"item":"pen","qty":2},{"item":"book","qty":1}]}';\n$data = json_decode($json, true);\n$count = count($data["cart"]);\n$data["cart"][] = ["item" => "bag", "qty" => 1];\n$data["updated"] = true;\necho json_encode($data);\n`,
      notes: {
        3: L("Now a nested PHP array: look at `$data` in the Variables panel.", "C'est maintenant un tableau PHP imbriqué : regarde `$data` dans le panneau Variables."),
        4: L("Two items in the cart.", "Deux articles dans le panier."),
        5: L("`[]` appends a third item.", "`[]` ajoute un troisième article."),
        6: L("A new key at the top level.", "Une nouvelle clé au premier niveau."),
        7: L("Back to JSON text, ready to send.", "Retour en texte JSON, prêt à être envoyé."),
      },
    },
    {
      kind: "try",
      title: L("Read a setting", "Lis un réglage"),
      body: L(
        "`$config` holds JSON settings. Decode it into an array and print `Theme: dark` using the decoded value (don't type `dark` yourself).",
        "`$config` contient des réglages en JSON. Décode-le en tableau et affiche `Theme: dark` à partir de la valeur décodée (n'écris pas `dark` toi-même).",
      ),
      files: { "index.php": `<?php\n$config = '{"user":"ada","ui":{"theme":"dark","lang":"en"}}';\n\n// decode, then print "Theme: " and the theme\necho "Theme: ";\n` },
      solution: { "index.php": `<?php\n$config = '{"user":"ada","ui":{"theme":"dark","lang":"en"}}';\n\n$settings = json_decode($config, true);\necho "Theme: " . $settings["ui"]["theme"];\n` },
      objectives: [
        {
          id: "theme",
          label: L("Print Theme: dark from the decoded JSON", "Afficher Theme: dark à partir du JSON décodé"),
          check: all(outputIs("Theme: dark"), uses(/json_decode\s*\(/), (c) => !/["']dark["']/.test(c.code.replace(/\$config\s*=\s*'[^']*'/, ""))),
          hints: [
            L("Decode with `true` to get nested arrays, then walk down the keys.", "Décode avec `true` pour obtenir des tableaux imbriqués, puis descends dans les clés."),
            L("`$settings = json_decode($config, true);` then `$settings[\"ui\"][\"theme\"]`.", "`$settings = json_decode($config, true);` puis `$settings[\"ui\"][\"theme\"]`."),
            L("`$settings = json_decode($config, true); echo \"Theme: \" . $settings[\"ui\"][\"theme\"];`", "`$settings = json_decode($config, true); echo \"Theme: \" . $settings[\"ui\"][\"theme\"];`"),
          ],
        },
      ],
      cheat: "json",
    },
    {
      kind: "challenge",
      title: L("Summarise an API response", "Résume une réponse d'API"),
      body: L(
        "Write `summarize(string $json): string`. The input is a JSON list of orders (`id`, `total`, `status`). Return JSON with the number of orders, how many are `paid`, and the revenue from paid orders: `{\"orders\":3,\"paid\":2,\"revenue\":44.5}`. For invalid JSON, return `{\"error\":\"invalid\"}`.",
        "Écris `summarize(string $json): string`. L'entrée est une liste JSON de commandes (`id`, `total`, `status`). Renvoie du JSON avec le nombre de commandes, combien sont `paid`, et le chiffre d'affaires des commandes payées : `{\"orders\":3,\"paid\":2,\"revenue\":44.5}`. Pour du JSON invalide, renvoie `{\"error\":\"invalid\"}`.",
      ),
      files: {
        "index.php": `<?php\n$response = '[{"id":1,"total":19.5,"status":"paid"},{"id":2,"total":5,"status":"refunded"},{"id":3,"total":25,"status":"paid"}]';\n\nfunction summarize(string $json): string {\n    return $json;\n}\n\necho summarize($response);\n`,
      },
      solution: {
        "index.php": `<?php\n$response = '[{"id":1,"total":19.5,"status":"paid"},{"id":2,"total":5,"status":"refunded"},{"id":3,"total":25,"status":"paid"}]';\n\nfunction summarize(string $json): string {\n    if (!json_validate($json)) {\n        return json_encode(["error" => "invalid"]);\n    }\n    $orders = json_decode($json, true);\n    $paid = 0;\n    $revenue = 0;\n    foreach ($orders as $order) {\n        if ($order["status"] === "paid") {\n            $paid++;\n            $revenue += $order["total"];\n        }\n    }\n    return json_encode(["orders" => count($orders), "paid" => $paid, "revenue" => $revenue]);\n}\n\necho summarize($response);\n`,
      },
      probes: [
        `summarize('[{"id":1,"total":19.5,"status":"paid"},{"id":2,"total":5,"status":"refunded"},{"id":3,"total":25,"status":"paid"}]')`,
        `summarize('[{"id":7,"total":10,"status":"paid"}]')`,
        "summarize('oops')",
      ],
      objectives: [
        {
          id: "summary",
          label: L("Return {\"orders\":3,\"paid\":2,\"revenue\":44.5}", "Renvoyer {\"orders\":3,\"paid\":2,\"revenue\":44.5}"),
          check: all(
            probeIs(`summarize('[{"id":1,"total":19.5,"status":"paid"},{"id":2,"total":5,"status":"refunded"},{"id":3,"total":25,"status":"paid"}]')`, '{"orders":3,"paid":2,"revenue":44.5}'),
            probeIs(`summarize('[{"id":7,"total":10,"status":"paid"}]')`, '{"orders":1,"paid":1,"revenue":10}'),
          ),
          hints: [
            L("Decode to arrays, loop over the orders, count and add up the paid ones, then encode a new array.", "Décode en tableaux, boucle sur les commandes, compte et additionne celles qui sont payées, puis encode un nouveau tableau."),
            L(
              "In a foreach: `if ($order[\"status\"] === \"paid\") { $paid++; $revenue += $order[\"total\"]; }`. Finally `json_encode([\"orders\" => count($orders), \"paid\" => $paid, \"revenue\" => $revenue])`.",
              "Dans un foreach : `if ($order[\"status\"] === \"paid\") { $paid++; $revenue += $order[\"total\"]; }`. Enfin `json_encode([\"orders\" => count($orders), \"paid\" => $paid, \"revenue\" => $revenue])`.",
            ),
            L(
              "`$orders = json_decode($json, true); $paid = 0; $revenue = 0; foreach ($orders as $order) { … } return json_encode([…]);` (keys in the order orders, paid, revenue).",
              "`$orders = json_decode($json, true); $paid = 0; $revenue = 0; foreach ($orders as $order) { … } return json_encode([…]);` (clés dans l'ordre orders, paid, revenue).",
            ),
          ],
        },
        {
          id: "invalid",
          label: L("Return {\"error\":\"invalid\"} for bad JSON", "Renvoyer {\"error\":\"invalid\"} pour du JSON invalide"),
          check: probeIs("summarize('oops')", '{"error":"invalid"}'),
          hints: [
            L("Check the input before decoding it.", "Vérifie l'entrée avant de la décoder."),
            L("`json_validate($json)` returns false for 'oops'.", "`json_validate($json)` renvoie false pour 'oops'."),
            L("First line of the function: `if (!json_validate($json)) { return json_encode([\"error\" => \"invalid\"]); }`", "Première ligne de la fonction : `if (!json_validate($json)) { return json_encode([\"error\" => \"invalid\"]); }`"),
          ],
        },
        {
          id: "clean",
          label: L("The script runs without warnings", "Le script s'exécute sans avertissement"),
          check: clean,
          hints: [
            L("Check the Problems tab after running.", "Regarde l'onglet Problèmes après l'exécution."),
            L("Initialise `$paid` and `$revenue` to 0 before the loop.", "Initialise `$paid` et `$revenue` à 0 avant la boucle."),
            L("Make sure you decode with `true` so `$order[\"status\"]` works.", "Vérifie que tu décodes avec `true` pour que `$order[\"status\"]` marche."),
          ],
        },
      ],
      cheat: "json",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`json_encode` turns arrays into JSON: lists become `[…]`, associative arrays `{…}`.", "`json_encode` transforme des tableaux en JSON : les listes deviennent `[…]`, les tableaux associatifs `{…}`."),
    L("`json_decode($json, true)` gives associative arrays; without `true`, objects.", "`json_decode($json, true)` donne des tableaux associatifs ; sans `true`, des objets."),
    L("Invalid JSON decodes to null silently: use `JSON_THROW_ON_ERROR` or check first.", "Du JSON invalide se décode en null sans bruit : utilise `JSON_THROW_ON_ERROR` ou vérifie avant."),
    L("`json_validate()` (PHP 8.3) checks validity without decoding.", "`json_validate()` (PHP 8.3) vérifie la validité sans décoder."),
  ],
};

export const TEXT_DATA: Lesson[] = [stringFunctions, formatting, regex, dates, json];
