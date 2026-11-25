import { L } from "@/lib/txt";
import { all, clean, outputHas, outputIs, probeIs, probeShows, uses } from "../checks";
import type { Check, Lesson } from "../types";

const CH = "functions";

/** The function is called at least `n` times in index.php (counting its own definition). */
const mentions = (name: string, n: number): Check => (c) => (c.code.match(new RegExp(`\\b${name}\\s*\\(`, "g")) ?? []).length >= n;

export const functionsBasics: Lesson = {
  id: "functions-basics",
  chapterId: CH,
  title: L("Your first functions", "Tes premières fonctions"),
  tagline: L("Name a piece of code, give it inputs, get a result back", "Nomme un bout de code, donne-lui des entrées, récupère un résultat"),
  xp: 50,
  syntax: ["function", "return", "$param", "$param = default"],
  doc: "guide-functions",
  steps: [
    {
      kind: "discover",
      title: L("Why functions?", "Pourquoi des fonctions ?"),
      body: [
        L(
          "As programs grow, you'll write the same few lines again and again. A **function** gives those lines a name, so you write them once and use them anywhere. Fix a bug in the function and every use is fixed.",
          "Quand un programme grandit, tu réécris sans cesse les mêmes lignes. Une **fonction** donne un nom à ces lignes : tu les écris une fois et tu t'en sers partout. Corrige un bug dans la fonction, et toutes ses utilisations sont corrigées.",
        ),
        L(
          "`function greet($name) { … }` defines a function with one **parameter**, `$name`. Calling `greet(\"Ada\")` runs the body with `$name` set to `\"Ada\"`. The value you pass is called an **argument**.",
          "`function greet($name) { … }` définit une fonction avec un **paramètre**, `$name`. Appeler `greet(\"Ada\")` exécute le corps avec `$name` qui vaut `\"Ada\"`. La valeur que tu passes s'appelle un **argument**.",
        ),
        L(
          "`return` sends a value back to whoever called the function, and stops the function right there.",
          "`return` renvoie une valeur à celui qui a appelé la fonction, et arrête la fonction tout de suite.",
        ),
      ],
      scene: "function",
      example: { code: `<?php\nfunction greet($name) {\n    return "Hello, $name!";\n}\n\necho greet("Ada"), "\\n";\necho greet("Linus");\n` },
    },
    {
      kind: "discover",
      title: L("return, not echo", "return, pas echo"),
      body: [
        L(
          "A function that **returns** a value is far more useful than one that **prints** it: you can store the result, combine it, test it, or print it later. Printing is a decision for the caller.",
          "Une fonction qui **renvoie** une valeur est bien plus utile qu'une fonction qui l'**affiche** : tu peux garder le résultat, le combiner, le tester, ou l'afficher plus tard. Afficher, c'est au code appelant de le décider.",
        ),
        L(
          "Parameters can have **default values**: `$times = 1` means \"if the caller doesn't say, use 1\". Parameters with defaults go after the ones without.",
          "Les paramètres peuvent avoir des **valeurs par défaut** : `$times = 1` veut dire « si l'appelant ne précise pas, prends 1 ». Les paramètres avec une valeur par défaut se placent après les autres.",
        ),
      ],
      example: {
        code: `<?php\nfunction shout($text, $times = 1) {\n    return str_repeat(strtoupper($text) . "! ", $times);\n}\n\n$loud = shout("hey");\necho $loud . "\\n";\necho shout("go", 3);\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "A function with no `return` still gives something back: `null`. That's a common surprise, as the next quiz shows.",
          "Une fonction sans `return` renvoie quand même quelque chose : `null`. C'est une surprise fréquente, comme le montre le quiz suivant.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Jump into a function and back", "Entre dans une fonction et ressors-en"),
      body: L(
        "Step through and watch the call stack: when `area()` is called, execution jumps into its body, with `$width` and `$height` set from the arguments. When it returns, execution continues where it left off.",
        "Avance pas à pas et surveille la pile d'appels : quand `area()` est appelée, l'exécution saute dans son corps, avec `$width` et `$height` remplis par les arguments. Au retour, l'exécution reprend là où elle s'était arrêtée.",
      ),
      code: `<?php\nfunction area($width, $height) {\n    $result = $width * $height;\n    return $result;\n}\n$kitchen = area(3, 4);\n$bedroom = area(5, 4);\n$total = $kitchen + $bedroom;\necho "Total: $total m2";\n`,
      notes: {
        3: L(
          "We're inside `area()`: the stack shows it, and the arguments panel shows `$width` and `$height` for this call.",
          "On est dans `area()` : la pile l'affiche, et le panneau des arguments montre `$width` et `$height` pour cet appel.",
        ),
        6: L("`area(3, 4)` returned 12, which is stored in `$kitchen`.", "`area(3, 4)` a renvoyé 12, rangé dans `$kitchen`."),
        7: L("Same function, new arguments, new result: 20.", "Même fonction, nouveaux arguments, nouveau résultat : 20."),
        8: L("Returned values combine like any other value.", "Les valeurs renvoyées se combinent comme n'importe quelle valeur."),
      },
    },
    {
      kind: "quiz",
      title: L("Where did the value go?", "Où est passée la valeur ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfunction double($n) {\n    echo $n * 2;\n}\n$x = double(5);\nvar_dump($x);\n`,
      options: ["10", "10NULL", "NULL", "int(10)"],
      answer: 1,
      explain: L(
        "`double()` prints 10 but returns nothing, so `$x` is `null` and var_dump prints `NULL` right after. To keep the 10, the function should `return $n * 2;`.",
        "`double()` affiche 10 mais ne renvoie rien : `$x` vaut donc `null` et var_dump affiche `NULL` juste après. Pour garder le 10, la fonction devrait faire `return $n * 2;`.",
      ),
    },
    {
      kind: "try",
      title: L("Write square()", "Écris square()"),
      body: L(
        "Complete `square($n)` so it **returns** the number multiplied by itself. The checks call your function with different numbers.",
        "Complète `square($n)` pour qu'elle **renvoie** le nombre multiplié par lui-même. Les vérifications appellent ta fonction avec différents nombres.",
      ),
      files: { "index.php": `<?php\nfunction square($n) {\n    // return the number multiplied by itself\n}\n\necho square(4);\n` },
      solution: { "index.php": `<?php\nfunction square($n) {\n    return $n * $n;\n}\n\necho square(4);\n` },
      probes: ["square(4)", "square(-3)"],
      objectives: [
        {
          id: "square",
          label: L("square(4) returns 16 and square(-3) returns 9", "square(4) renvoie 16 et square(-3) renvoie 9"),
          check: all(probeIs("square(4)", 16), probeIs("square(-3)", 9)),
          hints: [
            L("The function must give the result back, not print it.", "La fonction doit renvoyer le résultat, pas l'afficher."),
            L("Use `return` followed by a calculation with `$n`.", "Utilise `return` suivi d'un calcul avec `$n`."),
            L("Inside the braces: `return $n * $n;`", "Entre les accolades : `return $n * $n;`"),
          ],
        },
      ],
      cheat: "functions",
    },
    {
      kind: "try",
      title: L("A default greeting", "Une salutation par défaut"),
      body: L(
        "Add a second parameter `$greeting` that defaults to `\"Hello\"`, so `greet('Ada')` returns `Hello, Ada!` and `greet('Ada', 'Bonjour')` returns `Bonjour, Ada!`.",
        "Ajoute un second paramètre `$greeting` qui vaut `\"Hello\"` par défaut : `greet('Ada')` renvoie `Hello, Ada!` et `greet('Ada', 'Bonjour')` renvoie `Bonjour, Ada!`.",
      ),
      files: { "index.php": `<?php\nfunction greet($name) {\n    return "Hello, $name!";\n}\n\necho greet("Ada"), "\\n";\necho greet("Ada", "Bonjour");\n` },
      solution: { "index.php": `<?php\nfunction greet($name, $greeting = "Hello") {\n    return "$greeting, $name!";\n}\n\necho greet("Ada"), "\\n";\necho greet("Ada", "Bonjour");\n` },
      probes: ["greet('Ada')", "greet('Ada', 'Bonjour')"],
      objectives: [
        {
          id: "default",
          label: L("greet('Ada') still returns Hello, Ada!", "greet('Ada') renvoie toujours Hello, Ada!"),
          check: probeIs("greet('Ada')", "Hello, Ada!"),
          hints: [
            L("A default value is written right in the parameter list.", "Une valeur par défaut s'écrit directement dans la liste des paramètres."),
            L("`function greet($name, $greeting = \"Hello\")`", "`function greet($name, $greeting = \"Hello\")`"),
            L("Change the first line to `function greet($name, $greeting = \"Hello\") {`.", "Change la première ligne en `function greet($name, $greeting = \"Hello\") {`."),
          ],
        },
        {
          id: "custom",
          label: L("greet('Ada', 'Bonjour') returns Bonjour, Ada!", "greet('Ada', 'Bonjour') renvoie Bonjour, Ada!"),
          check: probeIs("greet('Ada', 'Bonjour')", "Bonjour, Ada!"),
          hints: [
            L("The returned text must use the new parameter instead of the word Hello.", "Le texte renvoyé doit utiliser le nouveau paramètre au lieu du mot Hello."),
            L("Interpolate both variables: `\"$greeting, $name!\"`.", "Interpole les deux variables : `\"$greeting, $name!\"`."),
            L("`return \"$greeting, $name!\";`", "`return \"$greeting, $name!\";`"),
          ],
        },
      ],
      cheat: "functions",
    },
    {
      kind: "challenge",
      title: L("Prices with tax", "Des prix TTC"),
      body: L(
        "Write two functions. `priceWithTax($price, $rate = 20)` returns the price plus `$rate` percent, rounded to 2 decimals. `formatPrice($amount)` returns the amount with 2 decimals and ` €` after it, like `7.00 €`. Then print `formatPrice(priceWithTax(19.99))`.",
        "Écris deux fonctions. `priceWithTax($price, $rate = 20)` renvoie le prix augmenté de `$rate` pour cent, arrondi à 2 décimales. `formatPrice($amount)` renvoie le montant avec 2 décimales suivi de ` €`, comme `7.00 €`. Puis affiche `formatPrice(priceWithTax(19.99))`.",
      ),
      files: { "index.php": `<?php\n// 1. priceWithTax($price, $rate = 20)\n// 2. formatPrice($amount)\n// 3. echo formatPrice(priceWithTax(19.99));\n\n` },
      solution: {
        "index.php": `<?php\nfunction priceWithTax($price, $rate = 20) {\n    return round($price * (1 + $rate / 100), 2);\n}\n\nfunction formatPrice($amount) {\n    return number_format($amount, 2) . " €";\n}\n\necho formatPrice(priceWithTax(19.99));\n`,
      },
      probes: ["priceWithTax(19.99)", "priceWithTax(10, 25)", "formatPrice(7)"],
      objectives: [
        {
          id: "tax",
          label: L("priceWithTax(19.99) returns 23.99, priceWithTax(10, 25) returns 12.5", "priceWithTax(19.99) renvoie 23.99, priceWithTax(10, 25) renvoie 12.5"),
          check: all(probeIs("priceWithTax(19.99)", 23.99), probeIs("priceWithTax(10, 25)", 12.5)),
          hints: [
            L("Adding 20% means multiplying by 1.20. With a rate parameter: 1 + $rate / 100.", "Ajouter 20 % revient à multiplier par 1.20. Avec un paramètre : 1 + $rate / 100."),
            L("`round($price * (1 + $rate / 100), 2)`", "`round($price * (1 + $rate / 100), 2)`"),
            L(
              "`function priceWithTax($price, $rate = 20) { return round($price * (1 + $rate / 100), 2); }`",
              "`function priceWithTax($price, $rate = 20) { return round($price * (1 + $rate / 100), 2); }`",
            ),
          ],
        },
        {
          id: "format",
          label: L("formatPrice(7) returns 7.00 €", "formatPrice(7) renvoie 7.00 €"),
          check: probeShows("formatPrice(7)", '"7.00 €"'),
          hints: [
            L("`number_format()` always shows the number of decimals you ask for.", "`number_format()` affiche toujours le nombre de décimales demandé."),
            L("`number_format($amount, 2)` gives `\"7.00\"`; glue `\" €\"` after it.", "`number_format($amount, 2)` donne `\"7.00\"` ; colle `\" €\"` après."),
            L("`function formatPrice($amount) { return number_format($amount, 2) . \" €\"; }`", "`function formatPrice($amount) { return number_format($amount, 2) . \" €\"; }`"),
          ],
        },
        {
          id: "print",
          label: L("The script prints 23.99 €", "Le script affiche 23.99 €"),
          check: all(clean, outputIs("23.99 €")),
          hints: [
            L("Combine the two: the result of one is the argument of the other.", "Combine les deux : le résultat de l'une est l'argument de l'autre."),
            L("The inner call runs first: `formatPrice(priceWithTax(19.99))`.", "L'appel intérieur s'exécute d'abord : `formatPrice(priceWithTax(19.99))`."),
            L("Last line: `echo formatPrice(priceWithTax(19.99));`", "Dernière ligne : `echo formatPrice(priceWithTax(19.99));`"),
          ],
        },
      ],
      cheat: "functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`function name($param) { … }` defines reusable code; calling it runs the body.", "`function name($param) { … }` définit du code réutilisable ; l'appeler exécute le corps."),
    L("`return` gives a value back and stops the function. No return means `null`.", "`return` renvoie une valeur et arrête la fonction. Sans return, c'est `null`."),
    L("Prefer returning over echoing: the caller decides what to do with the result.", "Préfère renvoyer plutôt qu'afficher : l'appelant décide quoi faire du résultat."),
    L("Default values (`$rate = 20`) make parameters optional.", "Les valeurs par défaut (`$rate = 20`) rendent les paramètres optionnels."),
  ],
};

export const typedFunctions: Lesson = {
  id: "typed-functions",
  chapterId: CH,
  title: L("Types and named arguments", "Types et arguments nommés"),
  tagline: L("Say what goes in and what comes out, and let PHP check it", "Dis ce qui entre et ce qui sort, et laisse PHP vérifier"),
  xp: 50,
  syntax: ["int $a", "): string", "?string", "int|float", "void", "name: value"],
  doc: "guide-functions",
  steps: [
    {
      kind: "discover",
      title: L("Types catch bugs early", "Les types attrapent les bugs tôt"),
      body: [
        L(
          "You can write the expected type before each parameter, and the return type after the parentheses: `function add(int $a, int $b): int`. It documents the function **and** PHP enforces it.",
          "Tu peux écrire le type attendu devant chaque paramètre, et le type de retour après les parenthèses : `function add(int $a, int $b): int`. Ça documente la fonction **et** PHP le fait respecter.",
        ),
        L(
          "If a value can be converted safely (the string `\"4\"` to the int 4), PHP converts it. If not, it throws a **TypeError** and stops, pointing at the exact call. Failing loudly beats computing nonsense silently.",
          "Si une valeur peut être convertie sans risque (la chaîne `\"4\"` en entier 4), PHP la convertit. Sinon, il lève une **TypeError** et s'arrête, en pointant l'appel fautif. Échouer bruyamment vaut mieux que calculer n'importe quoi en silence.",
        ),
      ],
      examples: [
        {
          code: `<?php\nfunction add(int $a, int $b): int {\n    return $a + $b;\n}\n\necho add(2, 3), "\\n";\necho add("4", 5), "\\n";\n`,
          caption: L("\"4\" looks like a number, so PHP converts it.", "\"4\" ressemble à un nombre : PHP le convertit."),
        },
        {
          code: `<?php\nfunction add(int $a, int $b): int {\n    return $a + $b;\n}\n\necho add("four", 5);\n`,
          caption: L("\"four\" can't become an int: look at the Problems tab.", "\"four\" ne peut pas devenir un int : regarde l'onglet Problèmes."),
        },
      ],
      callout: {
        tone: "tip",
        text: L(
          "With `declare(strict_types=1);` at the top of a file, PHP stops converting and requires the exact type. You'll use it in the Errors chapter.",
          "Avec `declare(strict_types=1);` en haut d'un fichier, PHP arrête de convertir et exige le type exact. Tu t'en serviras dans le chapitre sur les erreurs.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Nullable, union and void", "Nullable, union et void"),
      body: [
        L(
          "`?string` means \"a string or null\": perfect for \"maybe not found\". `int|float` (a **union type**) accepts either. `void` says the function returns nothing at all.",
          "`?string` veut dire « une chaîne ou null » : parfait pour « peut-être introuvable ». `int|float` (un **type union**) accepte l'un ou l'autre. `void` indique que la fonction ne renvoie rien du tout.",
        ),
      ],
      example: {
        code: `<?php\nfunction findUser(int $id): ?string {\n    $users = [1 => "Ada", 2 => "Linus"];\n    if (isset($users[$id])) {\n        return $users[$id];\n    }\n    return null;\n}\n\nfunction half(int|float $n): float {\n    return $n / 2;\n}\n\nfunction logLine(string $msg): void {\n    echo "[log] $msg\\n";\n}\n\nvar_dump(findUser(2), findUser(9));\nvar_dump(half(5));\nlogLine("done");\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "Scalar types and return types arrived in PHP 7.0, nullable types and `void` in 7.1, union types like `int|float` in PHP 8.0. On PHP 7.4, `int|float` is a parse error: switch the version picker to see it.",
          "Les types scalaires et les types de retour sont arrivés en PHP 7.0, les types nullables et `void` en 7.1, les types union comme `int|float` en PHP 8.0. En PHP 7.4, `int|float` est une erreur de syntaxe : change de version dans le sélecteur pour le voir.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Named arguments", "Les arguments nommés"),
      body: [
        L(
          "Since PHP 8.0 you can pass arguments **by name**: `makeButton(\"Save\", rounded: true)`. You skip the defaults you don't care about, the order no longer matters, and the call reads like a sentence.",
          "Depuis PHP 8.0, tu peux passer des arguments **par leur nom** : `makeButton(\"Save\", rounded: true)`. Tu sautes les valeurs par défaut qui ne t'intéressent pas, l'ordre ne compte plus, et l'appel se lit comme une phrase.",
        ),
        L(
          "That's why parameter names matter: they become part of how people call your function.",
          "C'est pour ça que les noms de paramètres comptent : ils deviennent une partie de la façon d'appeler ta fonction.",
        ),
      ],
      example: {
        code: `<?php\nfunction makeButton(string $label, string $color = "blue", bool $rounded = false): string {\n    $shape = $rounded ? "round" : "square";\n    return "[$label · $color · $shape]";\n}\n\necho makeButton("OK"), "\\n";\necho makeButton("Save", rounded: true), "\\n";\necho makeButton(color: "red", label: "Delete");\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Return types convert too", "Les types de retour convertissent aussi"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfunction half(int $n): float {\n    return $n / 2;\n}\nvar_dump(half(8));\n`,
      options: ["int(4)", "float(4)", "4", "float(4.5)"],
      answer: 1,
      explain: L(
        "8 / 2 is the int 4, but the return type says `float`, so PHP converts it: `float(4)`.",
        "8 / 2 donne l'entier 4, mais le type de retour dit `float` : PHP le convertit en `float(4)`.",
      ),
    },
    {
      kind: "try",
      title: L("Accept null", "Accepter null"),
      body: L(
        "This script crashes with a TypeError. Make `formatTemp()` accept `null` (use a nullable type) and return `unknown` for it. Numbers keep working: `formatTemp(21.456)` returns `21.5°C`. Fix the call on the last line too.",
        "Ce script plante avec une TypeError. Fais accepter `null` à `formatTemp()` (avec un type nullable) et renvoie `unknown` dans ce cas. Les nombres marchent toujours : `formatTemp(21.456)` renvoie `21.5°C`. Corrige aussi l'appel de la dernière ligne.",
      ),
      files: { "index.php": `<?php\nfunction formatTemp(float $celsius): string {\n    return round($celsius, 1) . "°C";\n}\n\necho formatTemp(21.456), "\\n";\necho formatTemp("hot");\n` },
      solution: {
        "index.php": `<?php\nfunction formatTemp(?float $celsius): string {\n    if ($celsius === null) {\n        return "unknown";\n    }\n    return round($celsius, 1) . "°C";\n}\n\necho formatTemp(21.456), "\\n";\necho formatTemp(null);\n`,
      },
      probes: ["formatTemp(null)", "formatTemp(21.456)"],
      objectives: [
        {
          id: "null",
          label: L("formatTemp(null) returns unknown", "formatTemp(null) renvoie unknown"),
          check: all(probeIs("formatTemp(null)", "unknown"), probeShows("formatTemp(21.456)", '"21.5°C"')),
          hints: [
            L("Put a `?` in front of the parameter type to allow null, then handle that case first.", "Mets un `?` devant le type du paramètre pour autoriser null, puis traite ce cas en premier."),
            L("`function formatTemp(?float $celsius): string` and `if ($celsius === null) { return \"unknown\"; }`", "`function formatTemp(?float $celsius): string` et `if ($celsius === null) { return \"unknown\"; }`"),
            L(
              "Change `float` to `?float`, then add `if ($celsius === null) { return \"unknown\"; }` before the existing return.",
              "Remplace `float` par `?float`, puis ajoute `if ($celsius === null) { return \"unknown\"; }` avant le return existant.",
            ),
          ],
        },
        {
          id: "runs",
          label: L("The script runs without errors", "Le script s'exécute sans erreur"),
          check: clean,
          hints: [
            L("`\"hot\"` can never be a float. What did the caller mean?", "`\"hot\"` ne sera jamais un float. Qu'est-ce que l'appelant voulait dire ?"),
            L("Pass `null` (no reading) instead of `\"hot\"` on the last line.", "Passe `null` (pas de mesure) au lieu de `\"hot\"` à la dernière ligne."),
            L("Last line: `echo formatTemp(null);`", "Dernière ligne : `echo formatTemp(null);`"),
          ],
        },
      ],
      cheat: "functions",
    },
    {
      kind: "challenge",
      title: L("A typed BMI calculator", "Un calculateur d'IMC typé"),
      body: L(
        "Write `bmi(float $weightKg, float $heightM): float`, returning the weight divided by the height squared, rounded to 1 decimal. Write `bmiLabel(float $bmi): string` returning `under` below 18.5, `normal` below 25, and `over` otherwise. Finally print the BMI for 70 kg and 1.75 m, passing **heightM first** with named arguments.",
        "Écris `bmi(float $weightKg, float $heightM): float`, qui renvoie le poids divisé par la taille au carré, arrondi à 1 décimale. Écris `bmiLabel(float $bmi): string` qui renvoie `under` en dessous de 18.5, `normal` en dessous de 25, et `over` sinon. Enfin, affiche l'IMC pour 70 kg et 1.75 m, en passant **heightM en premier** avec des arguments nommés.",
      ),
      files: { "index.php": `<?php\n// 1. bmi(): weight divided by height squared, rounded to 1 decimal\n// 2. bmiLabel(): "under" below 18.5, "normal" below 25, "over" otherwise\n// 3. Print the BMI with named arguments, heightM first\n\n` },
      solution: {
        "index.php": `<?php\nfunction bmi(float $weightKg, float $heightM): float {\n    return round($weightKg / ($heightM ** 2), 1);\n}\n\nfunction bmiLabel(float $bmi): string {\n    if ($bmi < 18.5) {\n        return "under";\n    } elseif ($bmi < 25) {\n        return "normal";\n    }\n    return "over";\n}\n\n$value = bmi(heightM: 1.75, weightKg: 70);\necho $value, " (", bmiLabel($value), ")";\n`,
      },
      probes: ["bmi(70, 1.75)", "bmiLabel(17)", "bmiLabel(22.9)", "bmiLabel(30)"],
      objectives: [
        {
          id: "bmi",
          label: L("bmi() is typed (float in, float out) and bmi(70, 1.75) returns 22.9", "bmi() est typée (float en entrée et en sortie) et bmi(70, 1.75) renvoie 22.9"),
          check: all(probeIs("bmi(70, 1.75)", 22.9), uses(/function\s+bmi\s*\(\s*float\s+\$weightKg\s*,\s*float\s+\$heightM\s*\)\s*:\s*float/)),
          hints: [
            L("Height squared is `$heightM ** 2`. Keep the parameter names exactly as given.", "La taille au carré, c'est `$heightM ** 2`. Garde exactement les noms de paramètres donnés."),
            L("`function bmi(float $weightKg, float $heightM): float { return round(…, 1); }`", "`function bmi(float $weightKg, float $heightM): float { return round(…, 1); }`"),
            L("`return round($weightKg / ($heightM ** 2), 1);`", "`return round($weightKg / ($heightM ** 2), 1);`"),
          ],
        },
        {
          id: "label",
          label: L("bmiLabel() returns under, normal or over", "bmiLabel() renvoie under, normal ou over"),
          check: all(probeIs("bmiLabel(17)", "under"), probeIs("bmiLabel(22.9)", "normal"), probeIs("bmiLabel(30)", "over")),
          hints: [
            L("Test the smallest range first, then the next one; the last case is \"everything else\".", "Teste d'abord la plus petite plage, puis la suivante ; le dernier cas, c'est « tout le reste »."),
            L("`if ($bmi < 18.5) { return \"under\"; } elseif ($bmi < 25) { … }`", "`if ($bmi < 18.5) { return \"under\"; } elseif ($bmi < 25) { … }`"),
            L(
              "Body: `if ($bmi < 18.5) { return \"under\"; } elseif ($bmi < 25) { return \"normal\"; } return \"over\";`",
              "Corps : `if ($bmi < 18.5) { return \"under\"; } elseif ($bmi < 25) { return \"normal\"; } return \"over\";`",
            ),
          ],
        },
        {
          id: "named",
          label: L("Call bmi() with named arguments, heightM first, and print 22.9", "Appeler bmi() avec des arguments nommés, heightM en premier, et afficher 22.9"),
          check: all(uses(/bmi\s*\(\s*heightM\s*:/), outputHas("22.9")),
          hints: [
            L("A named argument is `name: value`, without the dollar sign.", "Un argument nommé s'écrit `nom: valeur`, sans le dollar."),
            L("`bmi(heightM: 1.75, weightKg: 70)`", "`bmi(heightM: 1.75, weightKg: 70)`"),
            L("`echo bmi(heightM: 1.75, weightKg: 70);`", "`echo bmi(heightM: 1.75, weightKg: 70);`"),
          ],
        },
      ],
      cheat: "functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Parameter and return types document a function and are checked by PHP.", "Les types de paramètres et de retour documentent une fonction et sont vérifiés par PHP."),
    L("A value that can't be converted causes a TypeError at the call.", "Une valeur non convertible provoque une TypeError à l'appel."),
    L("`?T` allows null, `A|B` accepts either type (PHP 8.0), `void` returns nothing.", "`?T` autorise null, `A|B` accepte l'un ou l'autre (PHP 8.0), `void` ne renvoie rien."),
    L("Named arguments (`rounded: true`, PHP 8.0) skip defaults and make calls readable.", "Les arguments nommés (`rounded: true`, PHP 8.0) sautent les valeurs par défaut et rendent les appels lisibles."),
  ],
};

export const closures: Lesson = {
  id: "closures",
  chapterId: CH,
  title: L("Closures and arrow functions", "Closures et fonctions fléchées"),
  tagline: L("Functions as values: store them, pass them, return them", "Des fonctions comme valeurs : range-les, passe-les, renvoie-les"),
  xp: 50,
  syntax: ["function () use ($x)", "use (&$x)", "fn($x) =>", "callable", "strlen(...)"],
  doc: "guide-functions",
  steps: [
    {
      kind: "discover",
      title: L("A function without a name", "Une fonction sans nom"),
      body: [
        L(
          "A function can be a **value**: `$double = function ($n) { return $n * 2; };` stores it in a variable, and `$double(21)` calls it. These anonymous functions are called **closures**.",
          "Une fonction peut être une **valeur** : `$double = function ($n) { return $n * 2; };` la range dans une variable, et `$double(21)` l'appelle. Ces fonctions anonymes s'appellent des **closures**.",
        ),
        L(
          "Why? Many PHP functions take another function as an argument: `array_map()` applies it to every item, `usort()` uses it to compare, `array_filter()` to decide what to keep. You pass the *what to do*, PHP does the looping.",
          "Pourquoi ? Beaucoup de fonctions PHP prennent une autre fonction en argument : `array_map()` l'applique à chaque élément, `usort()` s'en sert pour comparer, `array_filter()` pour décider quoi garder. Tu passes le *quoi faire*, PHP fait la boucle.",
        ),
      ],
      example: {
        code: `<?php\n$double = function ($n) {\n    return $n * 2;\n};\necho $double(21), "\\n";\n\n$prices = [10, 25, 40];\n$withTax = array_map(function ($p) {\n    return $p * 1.2;\n}, $prices);\nprint_r($withTax);\n`,
      },
    },
    {
      kind: "discover",
      title: L("Capturing variables with use", "Capturer des variables avec use"),
      body: [
        L(
          "A closure can't see the variables around it, just like a normal function. `use ($rate)` copies a variable **into** the closure when it's created. Changing `$rate` afterwards doesn't affect the copy.",
          "Une closure ne voit pas les variables autour d'elle, comme une fonction normale. `use ($rate)` **copie** une variable dans la closure au moment de sa création. Changer `$rate` ensuite n'affecte pas la copie.",
        ),
        L(
          "`use (&$count)` (with an ampersand) shares the variable **by reference**: the closure and the outside see the same box, so the closure can change it.",
          "`use (&$count)` (avec une esperluette) partage la variable **par référence** : la closure et l'extérieur voient la même boîte, et la closure peut la modifier.",
        ),
      ],
      example: {
        code: `<?php\n$rate = 0.2;\n$addTax = function ($price) use ($rate) {\n    return $price * (1 + $rate);\n};\n$rate = 0.5; // too late: the closure copied 0.2\necho $addTax(100), "\\n";\n\n$count = 0;\n$increment = function () use (&$count) {\n    $count++;\n};\n$increment();\n$increment();\necho $count;\n`,
      },
    },
    {
      kind: "discover",
      title: L("Arrow functions and callables", "Fonctions fléchées et callables"),
      body: [
        L(
          "`fn($price) => $price * 1.2` is an **arrow function**: one expression, an automatic `return`, and it captures outside variables by value on its own, no `use` needed. Perfect for short callbacks.",
          "`fn($price) => $price * 1.2` est une **fonction fléchée** : une seule expression, un `return` automatique, et elle capture seule les variables extérieures par valeur, sans `use`. Parfaite pour les petits callbacks.",
        ),
        L(
          "Anything you can call is a **callable**: a closure, an arrow function, or an existing function. `strtoupper(...)` (with three dots) turns a named function into a closure you can pass around.",
          "Tout ce qu'on peut appeler est un **callable** : une closure, une fonction fléchée, ou une fonction existante. `strtoupper(...)` (avec trois points) transforme une fonction nommée en closure que tu peux passer partout.",
        ),
      ],
      example: {
        code: `<?php\n$rate = 0.2;\n$addTax = fn($price) => $price * (1 + $rate);\necho $addTax(50), "\\n";\n\n$words = ["php", "closure", "fn"];\nprint_r(array_map(strtoupper(...), $words));\nprint_r(array_map(fn($w) => strlen($w), $words));\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "Arrow functions arrived in PHP 7.4; the `strlen(...)` first-class callable syntax in PHP 8.1. Before that you'd write the name as a string: `array_map('strtoupper', $words)`.",
          "Les fonctions fléchées sont arrivées en PHP 7.4 ; la syntaxe `strlen(...)` (callable de première classe) en PHP 8.1. Avant, on écrivait le nom en chaîne : `array_map('strtoupper', $words)`.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("When is $x captured?", "Quand $x est-elle capturée ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$x = 1;\n$f = fn() => $x + 1;\n$x = 10;\necho $f();\n`,
      options: ["2", "11", "1", "10"],
      answer: 0,
      explain: L(
        "Arrow functions capture by value **when they're created**: at that moment `$x` was 1, so `$f()` returns 2. Changing `$x` later doesn't reach the copy.",
        "Les fonctions fléchées capturent par valeur **au moment de leur création** : à cet instant `$x` valait 1, donc `$f()` renvoie 2. Changer `$x` ensuite n'atteint pas la copie.",
      ),
    },
    {
      kind: "watch",
      title: L("A closure that remembers", "Une closure qui se souvient"),
      body: L(
        "This closure captures `$total` by reference. Step through and watch the stack show `{closure}` each time it's called, and `$total` grow in the globals.",
        "Cette closure capture `$total` par référence. Avance pas à pas et regarde la pile afficher `{closure}` à chaque appel, et `$total` grandir dans les variables globales.",
      ),
      code: `<?php\n$total = 0;\n$add = function ($n) use (&$total) {\n    $total += $n;\n};\n$add(5);\n$add(10);\n$add(20);\necho "Total: $total";\n`,
      notes: {
        4: L("We're inside the closure; `$n` is this call's argument.", "On est dans la closure ; `$n` est l'argument de cet appel."),
        6: L("Back outside: thanks to `&`, the global `$total` changed.", "De retour dehors : grâce à `&`, la variable globale `$total` a changé."),
        9: L("Three calls, one shared box: 35.", "Trois appels, une seule boîte partagée : 35."),
      },
    },
    {
      kind: "try",
      title: L("Filter with an arrow function", "Filtre avec une fonction fléchée"),
      body: L(
        "Keep only the words with more than 3 letters, using `array_filter()` and an arrow function. The script should print `tree, forest`.",
        "Garde seulement les mots de plus de 3 lettres, avec `array_filter()` et une fonction fléchée. Le script doit afficher `tree, forest`.",
      ),
      files: { "index.php": `<?php\n$words = ["a", "tree", "is", "big", "forest"];\n\n$long = $words; // keep only words with more than 3 letters\n\necho implode(", ", $long);\n` },
      solution: { "index.php": `<?php\n$words = ["a", "tree", "is", "big", "forest"];\n\n$long = array_filter($words, fn($w) => strlen($w) > 3);\n\necho implode(", ", $long);\n` },
      objectives: [
        {
          id: "filter",
          label: L("Print tree, forest using an arrow function", "Afficher tree, forest avec une fonction fléchée"),
          check: all(outputIs("tree, forest"), uses(/fn\s*\(/)),
          hints: [
            L("`array_filter($array, $callback)` keeps the items for which the callback returns true.", "`array_filter($tableau, $callback)` garde les éléments pour lesquels le callback renvoie true."),
            L("The callback: `fn($w) => strlen($w) > 3`.", "Le callback : `fn($w) => strlen($w) > 3`."),
            L("`$long = array_filter($words, fn($w) => strlen($w) > 3);`", "`$long = array_filter($words, fn($w) => strlen($w) > 3);`"),
          ],
        },
      ],
      cheat: "closures",
    },
    {
      kind: "challenge",
      title: L("Function factories", "Des usines à fonctions"),
      body: L(
        "Functions can **return** functions. Write `makeMultiplier(int $factor): Closure` that returns a function multiplying its argument by `$factor`. Then write `makeCounter(): Closure` whose returned function counts how many times it was called (1, 2, 3…). Two counters must count separately.",
        "Les fonctions peuvent **renvoyer** des fonctions. Écris `makeMultiplier(int $factor): Closure` qui renvoie une fonction multipliant son argument par `$factor`. Puis écris `makeCounter(): Closure` dont la fonction renvoyée compte combien de fois elle a été appelée (1, 2, 3…). Deux compteurs doivent compter séparément.",
      ),
      files: {
        "index.php": `<?php\nfunction makeMultiplier(int $factor): Closure {\n    // return a function that multiplies by $factor\n}\n\nfunction makeCounter(): Closure {\n    // return a function that returns 1, then 2, then 3…\n}\n\n$triple = makeMultiplier(3);\necho $triple(5);\n`,
      },
      solution: {
        "index.php": `<?php\nfunction makeMultiplier(int $factor): Closure {\n    return fn($n) => $n * $factor;\n}\n\nfunction makeCounter(): Closure {\n    $count = 0;\n    return function () use (&$count) {\n        $count++;\n        return $count;\n    };\n}\n\n$triple = makeMultiplier(3);\necho $triple(5);\n`,
      },
      probes: [
        "makeMultiplier(3)(5)",
        "array_map(makeMultiplier(2), [1, 2, 3])",
        "(function () { $c = makeCounter(); $c(); $c(); return $c(); })()",
        "(function () { $a = makeCounter(); $b = makeCounter(); $a(); $a(); return $b(); })()",
      ],
      objectives: [
        {
          id: "multiplier",
          label: L("makeMultiplier(3)(5) returns 15", "makeMultiplier(3)(5) renvoie 15"),
          check: all(probeIs("makeMultiplier(3)(5)", 15), probeIs("array_map(makeMultiplier(2), [1, 2, 3])", [2, 4, 6])),
          hints: [
            L("The function you return needs `$factor`: an arrow function captures it automatically.", "La fonction renvoyée a besoin de `$factor` : une fonction fléchée la capture automatiquement."),
            L("`return fn($n) => $n * $factor;`", "`return fn($n) => $n * $factor;`"),
            L("The whole body of makeMultiplier is: `return fn($n) => $n * $factor;`", "Tout le corps de makeMultiplier : `return fn($n) => $n * $factor;`"),
          ],
        },
        {
          id: "counter",
          label: L("A counter returns 3 on its third call", "Un compteur renvoie 3 à son troisième appel"),
          check: probeIs("(function () { $c = makeCounter(); $c(); $c(); return $c(); })()", 3),
          hints: [
            L("The count must survive between calls, and be changed by the closure: that's capture by reference.", "Le compteur doit survivre entre les appels, et être modifié par la closure : c'est la capture par référence."),
            L("Create `$count = 0;` in makeCounter, then return `function () use (&$count) { … }`.", "Crée `$count = 0;` dans makeCounter, puis renvoie `function () use (&$count) { … }`."),
            L(
              "`$count = 0; return function () use (&$count) { $count++; return $count; };`",
              "`$count = 0; return function () use (&$count) { $count++; return $count; };`",
            ),
          ],
        },
        {
          id: "separate",
          label: L("Two counters count separately", "Deux compteurs comptent séparément"),
          check: probeIs("(function () { $a = makeCounter(); $b = makeCounter(); $a(); $a(); return $b(); })()", 1),
          hints: [
            L("Each call to makeCounter() should create a fresh `$count`.", "Chaque appel à makeCounter() doit créer un nouveau `$count`."),
            L("Avoid `static` or globals here: a local variable captured by reference is per-counter.", "Évite `static` ou les globales ici : une variable locale capturée par référence est propre à chaque compteur."),
            L("Declare `$count = 0;` inside makeCounter(), not outside it.", "Déclare `$count = 0;` à l'intérieur de makeCounter(), pas en dehors."),
          ],
        },
      ],
      cheat: "closures",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Closures are functions stored in variables and passed to other functions.", "Les closures sont des fonctions rangées dans des variables et passées à d'autres fonctions."),
    L("`use ($x)` copies a variable in; `use (&$x)` shares it by reference.", "`use ($x)` copie une variable ; `use (&$x)` la partage par référence."),
    L("`fn($x) => …` returns one expression and captures by value automatically.", "`fn($x) => …` renvoie une expression et capture par valeur automatiquement."),
    L("`strtoupper(...)` turns a named function into a callable (PHP 8.1).", "`strtoupper(...)` transforme une fonction nommée en callable (PHP 8.1)."),
  ],
};

export const scopeRecursion: Lesson = {
  id: "scope-recursion",
  chapterId: CH,
  title: L("Scope, static and recursion", "Portée, static et récursivité"),
  tagline: L("Where variables live, and functions that call themselves", "Où vivent les variables, et des fonctions qui s'appellent elles-mêmes"),
  xp: 50,
  syntax: ["static $n", "global", "f($n - 1)", "is_array"],
  doc: "guide-functions",
  steps: [
    {
      kind: "discover",
      title: L("Each function has its own room", "Chaque fonction a sa propre pièce"),
      body: [
        L(
          "Variables created inside a function are **local**: they exist only during that call, and the function can't see variables from outside. That's a feature: a function only depends on what you pass it, so it's predictable and reusable.",
          "Les variables créées dans une fonction sont **locales** : elles n'existent que pendant cet appel, et la fonction ne voit pas les variables de l'extérieur. C'est voulu : une fonction ne dépend que de ce que tu lui passes, elle est donc prévisible et réutilisable.",
        ),
        L(
          "The first example forgets this and gets a warning. The fix is simple: pass the value as a parameter.",
          "Le premier exemple l'oublie et reçoit un avertissement. La correction est simple : passe la valeur en paramètre.",
        ),
      ],
      scene: "scope",
      examples: [
        { code: `<?php\n$siteName = "My Shop";\n\nfunction title() {\n    return "Welcome to $siteName";\n}\n\necho title();\n`, caption: L("$siteName doesn't exist inside title().", "$siteName n'existe pas dans title().") },
        { code: `<?php\n$siteName = "My Shop";\n\nfunction title(string $site): string {\n    return "Welcome to $site";\n}\n\necho title($siteName);\n`, caption: L("Passing it in: clean and explicit.", "En la passant : propre et explicite.") },
      ],
      callout: {
        tone: "warn",
        text: L(
          "PHP has a `global $siteName;` statement to reach outside variables. Avoid it: hidden dependencies make code hard to test and to understand.",
          "PHP a une instruction `global $siteName;` pour atteindre les variables extérieures. Évite-la : les dépendances cachées rendent le code difficile à tester et à comprendre.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("static: a variable that remembers", "static : une variable qui se souvient"),
      body: [
        L(
          "A `static` variable is local to the function, but keeps its value **between calls**. It's initialised only the first time. Handy for counters and caches.",
          "Une variable `static` est locale à la fonction, mais garde sa valeur **entre les appels**. Elle n'est initialisée que la première fois. Pratique pour les compteurs et les caches.",
        ),
      ],
      example: { code: `<?php\nfunction nextId(): int {\n    static $id = 0;\n    $id++;\n    return $id;\n}\n\necho nextId(), nextId(), nextId();\n` },
    },
    {
      kind: "quiz",
      title: L("Count the calls", "Compte les appels"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfunction counter() {\n    static $n = 0;\n    $n += 10;\n    return $n;\n}\ncounter();\ncounter();\necho counter();\n`,
      options: ["10", "30", "0", "20"],
      answer: 1,
      explain: L(
        "`static $n = 0` runs only once. Each call adds 10 to the same `$n`: 10, 20, then 30 on the third call.",
        "`static $n = 0` ne s'exécute qu'une fois. Chaque appel ajoute 10 au même `$n` : 10, 20, puis 30 au troisième appel.",
      ),
    },
    {
      kind: "discover",
      title: L("Recursion: a function that calls itself", "La récursivité : une fonction qui s'appelle elle-même"),
      body: [
        L(
          "Some problems contain smaller copies of themselves: 5! is 5 × 4!, a folder contains folders. A **recursive** function solves the small version by calling itself, until it reaches a **base case** simple enough to answer directly.",
          "Certains problèmes contiennent des copies plus petites d'eux-mêmes : 5! vaut 5 × 4!, un dossier contient des dossiers. Une fonction **récursive** résout la petite version en s'appelant elle-même, jusqu'à un **cas de base** assez simple pour répondre directement.",
        ),
        L(
          "Forget the base case and the function calls itself forever, until PHP runs out of memory. Always ask: when does it stop?",
          "Oublie le cas de base et la fonction s'appelle à l'infini, jusqu'à ce que PHP manque de mémoire. Demande-toi toujours : quand est-ce que ça s'arrête ?",
        ),
      ],
      example: { code: `<?php\nfunction factorial(int $n): int {\n    if ($n <= 1) {\n        return 1; // base case\n    }\n    return $n * factorial($n - 1);\n}\n\necho factorial(5);\n` },
    },
    {
      kind: "watch",
      title: L("Watch the call stack grow", "Regarde la pile d'appels grandir"),
      body: L(
        "Each call to `countdown()` is stacked on top of the previous one. Watch the stack: three `countdown` calls are active at the deepest point, each with its own `$n`.",
        "Chaque appel à `countdown()` s'empile sur le précédent. Surveille la pile : trois appels à `countdown` sont actifs au point le plus profond, chacun avec son propre `$n`.",
      ),
      code: `<?php\nfunction countdown(int $n): void {\n    echo "$n...\\n";\n    if ($n > 1) {\n        countdown($n - 1);\n    }\n}\ncountdown(3);\necho "Liftoff!";\n`,
      notes: {
        3: L("Each call prints its own `$n`. Count the countdown entries in the stack.", "Chaque appel affiche son propre `$n`. Compte les entrées countdown dans la pile."),
        8: L("Every call has returned: the stack is empty again.", "Tous les appels sont revenus : la pile est de nouveau vide."),
        9: L("Back at the top level.", "Retour au niveau principal."),
      },
    },
    {
      kind: "try",
      title: L("Sum with recursion", "Une somme récursive"),
      body: L(
        "Write `sumTo(int $n): int` that returns 1 + 2 + … + n **recursively**: the sum up to n is n plus the sum up to n − 1, and the sum up to 1 is 1.",
        "Écris `sumTo(int $n): int` qui renvoie 1 + 2 + … + n **de façon récursive** : la somme jusqu'à n vaut n plus la somme jusqu'à n − 1, et la somme jusqu'à 1 vaut 1.",
      ),
      files: { "index.php": `<?php\nfunction sumTo(int $n): int {\n    return 0; // replace me\n}\n\necho sumTo(4);\n` },
      solution: { "index.php": `<?php\nfunction sumTo(int $n): int {\n    if ($n <= 1) {\n        return $n;\n    }\n    return $n + sumTo($n - 1);\n}\n\necho sumTo(4);\n` },
      probes: ["sumTo(4)", "sumTo(1)", "sumTo(100)"],
      objectives: [
        {
          id: "sum",
          label: L("sumTo(4) returns 10 and sumTo(100) returns 5050", "sumTo(4) renvoie 10 et sumTo(100) renvoie 5050"),
          check: all(probeIs("sumTo(4)", 10), probeIs("sumTo(1)", 1), probeIs("sumTo(100)", 5050)),
          hints: [
            L("Two cases: the base case (n is 1 or less) and the recursive case.", "Deux cas : le cas de base (n vaut 1 ou moins) et le cas récursif."),
            L("`if ($n <= 1) { return $n; }` then `return $n + sumTo(…);`", "`if ($n <= 1) { return $n; }` puis `return $n + sumTo(…);`"),
            L("`if ($n <= 1) { return $n; } return $n + sumTo($n - 1);`", "`if ($n <= 1) { return $n; } return $n + sumTo($n - 1);`"),
          ],
        },
        {
          id: "recursive",
          label: L("sumTo() calls itself", "sumTo() s'appelle elle-même"),
          check: mentions("sumTo", 3),
          hints: [
            L("A loop works too, but here the point is recursion.", "Une boucle marche aussi, mais ici le but est la récursivité."),
            L("Inside sumTo, call `sumTo($n - 1)`.", "Dans sumTo, appelle `sumTo($n - 1)`."),
            L("`return $n + sumTo($n - 1);`", "`return $n + sumTo($n - 1);`"),
          ],
        },
      ],
      cheat: "functions",
    },
    {
      kind: "challenge",
      title: L("Walk a folder tree", "Parcours une arborescence"),
      body: L(
        "`$tree` is a folder: plain strings are files, nested arrays are sub-folders. Write `countFiles(array $folder): int` that counts every file, at any depth, using recursion. Then print `Files: 5`.",
        "`$tree` est un dossier : les chaînes sont des fichiers, les tableaux imbriqués des sous-dossiers. Écris `countFiles(array $folder): int` qui compte tous les fichiers, à n'importe quelle profondeur, avec la récursivité. Puis affiche `Files: 5`.",
      ),
      files: {
        "index.php": `<?php\n$tree = [\n    "readme.md",\n    "src" => ["index.php", "lib" => ["a.php", "b.php"]],\n    "tests" => ["test.php"],\n];\n\nfunction countFiles(array $folder): int {\n    return count($folder); // only counts the top level!\n}\n\necho "Files: " . countFiles($tree);\n`,
      },
      solution: {
        "index.php": `<?php\n$tree = [\n    "readme.md",\n    "src" => ["index.php", "lib" => ["a.php", "b.php"]],\n    "tests" => ["test.php"],\n];\n\nfunction countFiles(array $folder): int {\n    $total = 0;\n    foreach ($folder as $item) {\n        if (is_array($item)) {\n            $total += countFiles($item);\n        } else {\n            $total++;\n        }\n    }\n    return $total;\n}\n\necho "Files: " . countFiles($tree);\n`,
      },
      probes: ["countFiles(['a', 'b' => ['c', 'd' => ['e']]])", "countFiles([])"],
      objectives: [
        {
          id: "count",
          label: L("countFiles counts files at every depth", "countFiles compte les fichiers à toutes les profondeurs"),
          check: all(probeIs("countFiles(['a', 'b' => ['c', 'd' => ['e']]])", 3), probeIs("countFiles([])", 0)),
          hints: [
            L("Look at each item: a file counts 1, a folder counts all the files inside it.", "Regarde chaque élément : un fichier compte 1, un dossier compte tous les fichiers qu'il contient."),
            L("Loop with `foreach ($folder as $item)`, and test `is_array($item)`: if so, add `countFiles($item)`.", "Boucle avec `foreach ($folder as $item)`, et teste `is_array($item)` : si oui, ajoute `countFiles($item)`."),
            L(
              "`$total = 0; foreach ($folder as $item) { if (is_array($item)) { $total += countFiles($item); } else { $total++; } } return $total;`",
              "`$total = 0; foreach ($folder as $item) { if (is_array($item)) { $total += countFiles($item); } else { $total++; } } return $total;`",
            ),
          ],
        },
        {
          id: "print",
          label: L("Print: Files: 5", "Afficher : Files: 5"),
          check: outputIs("Files: 5"),
          hints: [
            L("Once countFiles is right, the last line prints the right number.", "Une fois countFiles correcte, la dernière ligne affiche le bon nombre."),
            L("readme.md, index.php, a.php, b.php, test.php: 5 files.", "readme.md, index.php, a.php, b.php, test.php : 5 fichiers."),
            L("Keep `echo \"Files: \" . countFiles($tree);`", "Garde `echo \"Files: \" . countFiles($tree);`"),
          ],
        },
        {
          id: "recursive",
          label: L("countFiles() calls itself", "countFiles() s'appelle elle-même"),
          check: mentions("countFiles", 3),
          hints: [
            L("A sub-folder is the same problem, only smaller.", "Un sous-dossier, c'est le même problème en plus petit."),
            L("Call `countFiles($item)` for each sub-folder.", "Appelle `countFiles($item)` pour chaque sous-dossier."),
            L("`$total += countFiles($item);`", "`$total += countFiles($item);`"),
          ],
        },
      ],
      cheat: "functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Variables inside a function are local; pass values in as parameters.", "Les variables d'une fonction sont locales ; passe les valeurs en paramètres."),
    L("`static` keeps a local variable's value between calls.", "`static` garde la valeur d'une variable locale entre les appels."),
    L("Recursion: a base case that stops, and a call on a smaller problem.", "Récursivité : un cas de base qui arrête, et un appel sur un problème plus petit."),
    L("The Trace's call stack shows every active call, each with its own arguments.", "La pile d'appels de la Trace montre chaque appel actif, avec ses propres arguments."),
  ],
};

export const bossToolkit: Lesson = {
  id: "boss-toolkit",
  chapterId: CH,
  title: L("Boss: your utility toolkit", "Boss : ta boîte à outils"),
  tagline: L("Four typed helper functions, tested like a real library", "Quatre fonctions utilitaires typées, testées comme une vraie bibliothèque"),
  xp: 80,
  boss: true,
  syntax: ["function", "return types", "?float", "int|float", "callable"],
  doc: "guide-functions",
  steps: [
    {
      kind: "discover",
      title: L("Every project has a helpers file", "Chaque projet a son fichier d'utilitaires"),
      body: [
        L(
          "Real projects collect small, well-named, well-typed functions in one place: formatting names, computing averages, clamping numbers. Each one does one job and can be tested on its own.",
          "Les vrais projets regroupent de petites fonctions bien nommées et bien typées au même endroit : formater des noms, calculer des moyennes, borner des nombres. Chacune fait un seul travail et se teste séparément.",
        ),
        L(
          "In this boss, the checks act like a test suite: they call your functions with tricky inputs (empty lists, negative numbers, extra spaces). Read each requirement carefully, and run often.",
          "Dans ce boss, les vérifications font office de suite de tests : elles appellent tes fonctions avec des entrées piégeuses (listes vides, nombres négatifs, espaces en trop). Lis bien chaque exigence, et exécute souvent.",
        ),
      ],
      scene: "function",
    },
    {
      kind: "quiz",
      title: L("Warm-up: functions as arguments", "Échauffement : des fonctions en argument"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfunction twice(callable $f, int $x): int {\n    return $f($f($x));\n}\necho twice(fn($n) => $n * 3, 2);\n`,
      options: ["6", "18", "12", "9"],
      answer: 1,
      explain: L(
        "`$f($x)` gives 2 × 3 = 6, then `$f(6)` gives 18. The inner call runs first.",
        "`$f($x)` donne 2 × 3 = 6, puis `$f(6)` donne 18. L'appel intérieur s'exécute d'abord.",
      ),
    },
    {
      kind: "try",
      title: L("Warm-up: isEven()", "Échauffement : isEven()"),
      body: L(
        "Write `isEven(int $n): bool` returning `true` for even numbers (including 0 and negatives) and `false` otherwise.",
        "Écris `isEven(int $n): bool` qui renvoie `true` pour les nombres pairs (y compris 0 et les négatifs) et `false` sinon.",
      ),
      files: { "index.php": `<?php\nfunction isEven(int $n): bool {\n    return false;\n}\n\nvar_dump(isEven(4));\n` },
      solution: { "index.php": `<?php\nfunction isEven(int $n): bool {\n    return $n % 2 === 0;\n}\n\nvar_dump(isEven(4));\n` },
      probes: ["isEven(4)", "isEven(7)", "isEven(0)", "isEven(-6)"],
      objectives: [
        {
          id: "even",
          label: L("isEven works for 4, 7, 0 and -6", "isEven marche pour 4, 7, 0 et -6"),
          check: all(probeIs("isEven(4)", true), probeIs("isEven(7)", false), probeIs("isEven(0)", true), probeIs("isEven(-6)", true)),
          hints: [
            L("A number is even when the remainder of dividing by 2 is 0.", "Un nombre est pair quand le reste de sa division par 2 vaut 0."),
            L("`$n % 2` gives the remainder; compare it with `=== 0`.", "`$n % 2` donne le reste ; compare-le avec `=== 0`."),
            L("`return $n % 2 === 0;`", "`return $n % 2 === 0;`"),
          ],
        },
      ],
      cheat: "functions",
    },
    {
      kind: "challenge",
      title: L("Build the toolkit", "Construis la boîte à outils"),
      body: L(
        "Write four typed functions: `slugify(string $text): string` (trim, lowercase, spaces become dashes: `'  Hello World '` → `hello-world`); `average(array $numbers): ?float` (`null` for an empty list); `clamp(int|float $value, int|float $min, int|float $max): int|float` (keep a value inside a range); `initials(string $fullName): string` (`'grace brewster hopper'` → `GBH`).",
        "Écris quatre fonctions typées : `slugify(string $text): string` (supprime les espaces autour, minuscules, espaces remplacés par des tirets : `'  Hello World '` → `hello-world`) ; `average(array $numbers): ?float` (`null` pour une liste vide) ; `clamp(int|float $value, int|float $min, int|float $max): int|float` (garde une valeur dans un intervalle) ; `initials(string $fullName): string` (`'grace brewster hopper'` → `GBH`).",
      ),
      files: { "index.php": `<?php\n// Your toolkit: slugify, average, clamp, initials\n\n\necho slugify("  Hello World ");\n` },
      solution: {
        "index.php": `<?php\nfunction slugify(string $text): string {\n    return str_replace(" ", "-", strtolower(trim($text)));\n}\n\nfunction average(array $numbers): ?float {\n    if (count($numbers) === 0) {\n        return null;\n    }\n    return array_sum($numbers) / count($numbers);\n}\n\nfunction clamp(int|float $value, int|float $min, int|float $max): int|float {\n    return max($min, min($max, $value));\n}\n\nfunction initials(string $fullName): string {\n    $result = "";\n    foreach (explode(" ", trim($fullName)) as $word) {\n        $result .= strtoupper(substr($word, 0, 1));\n    }\n    return $result;\n}\n\necho slugify("  Hello World ");\n`,
      },
      probes: ["slugify('  Hello World ')", "slugify('PHP Learn')", "average([1, 2])", "average([])", "clamp(15, 0, 10)", "clamp(-3, 0, 10)", "clamp(5, 0, 10)", "initials('grace brewster hopper')", "initials('Ada Lovelace')"],
      objectives: [
        {
          id: "slugify",
          label: L("slugify('  Hello World ') returns hello-world", "slugify('  Hello World ') renvoie hello-world"),
          check: all(probeIs("slugify('  Hello World ')", "hello-world"), probeIs("slugify('PHP Learn')", "php-learn")),
          hints: [
            L("Three transformations: remove outer spaces, lowercase, replace inner spaces.", "Trois transformations : enlever les espaces autour, passer en minuscules, remplacer les espaces internes."),
            L("`trim()`, `strtolower()` and `str_replace(\" \", \"-\", …)`.", "`trim()`, `strtolower()` et `str_replace(\" \", \"-\", …)`."),
            L("`return str_replace(\" \", \"-\", strtolower(trim($text)));`", "`return str_replace(\" \", \"-\", strtolower(trim($text)));`"),
          ],
        },
        {
          id: "average",
          label: L("average([1, 2]) returns 1.5, average([]) returns null", "average([1, 2]) renvoie 1.5, average([]) renvoie null"),
          check: all(probeIs("average([1, 2])", 1.5), probeIs("average([])", null)),
          hints: [
            L("Dividing by zero is an error: handle the empty list first.", "Diviser par zéro est une erreur : traite d'abord la liste vide."),
            L("`array_sum($numbers) / count($numbers)`, after `if (count($numbers) === 0) { return null; }`.", "`array_sum($numbers) / count($numbers)`, après `if (count($numbers) === 0) { return null; }`."),
            L(
              "`function average(array $numbers): ?float { if (count($numbers) === 0) { return null; } return array_sum($numbers) / count($numbers); }`",
              "`function average(array $numbers): ?float { if (count($numbers) === 0) { return null; } return array_sum($numbers) / count($numbers); }`",
            ),
          ],
        },
        {
          id: "clamp",
          label: L("clamp keeps values between min and max", "clamp garde les valeurs entre min et max"),
          check: all(probeIs("clamp(15, 0, 10)", 10), probeIs("clamp(-3, 0, 10)", 0), probeIs("clamp(5, 0, 10)", 5)),
          hints: [
            L("Too big? Return max. Too small? Return min. Otherwise the value itself.", "Trop grand ? Renvoie max. Trop petit ? Renvoie min. Sinon la valeur elle-même."),
            L("`min($max, $value)` caps it from above; `max($min, …)` from below.", "`min($max, $value)` limite par le haut ; `max($min, …)` par le bas."),
            L("`return max($min, min($max, $value));`", "`return max($min, min($max, $value));`"),
          ],
        },
        {
          id: "initials",
          label: L("initials('grace brewster hopper') returns GBH", "initials('grace brewster hopper') renvoie GBH"),
          check: all(probeIs("initials('grace brewster hopper')", "GBH"), probeIs("initials('Ada Lovelace')", "AL")),
          hints: [
            L("Split the name into words, take the first letter of each, uppercase it.", "Découpe le nom en mots, prends la première lettre de chacun, mets-la en majuscule."),
            L("`explode(\" \", $fullName)`, then `strtoupper(substr($word, 0, 1))` in a foreach.", "`explode(\" \", $fullName)`, puis `strtoupper(substr($word, 0, 1))` dans un foreach."),
            L(
              "`$result = \"\"; foreach (explode(\" \", trim($fullName)) as $word) { $result .= strtoupper(substr($word, 0, 1)); } return $result;`",
              "`$result = \"\"; foreach (explode(\" \", trim($fullName)) as $word) { $result .= strtoupper(substr($word, 0, 1)); } return $result;`",
            ),
          ],
        },
        {
          id: "typed",
          label: L("All four functions declare a return type", "Les quatre fonctions déclarent un type de retour"),
          check: (c) => (c.code.match(/function\s+(slugify|average|clamp|initials)\s*\([^)]*\)\s*:\s*\??[\w|]+/g) ?? []).length >= 4,
          hints: [
            L("A return type goes after the parentheses, before the brace.", "Le type de retour se place après les parenthèses, avant l'accolade."),
            L("`): string`, `): ?float`, `): int|float`, `): string`.", "`): string`, `): ?float`, `): int|float`, `): string`."),
            L("Copy the signatures from the instructions exactly.", "Recopie exactement les signatures de l'énoncé."),
          ],
        },
      ],
      cheat: "functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Small functions with one job and clear types are easy to test.", "De petites fonctions avec un seul rôle et des types clairs se testent facilement."),
    L("Handle edge cases first: empty lists, out-of-range values, extra spaces.", "Traite d'abord les cas limites : listes vides, valeurs hors limites, espaces en trop."),
    L("`?float` and `int|float` say exactly what a function can return.", "`?float` et `int|float` disent exactement ce qu'une fonction peut renvoyer."),
    L("Functions can take other functions (`callable`) as arguments.", "Les fonctions peuvent prendre d'autres fonctions (`callable`) en argument."),
  ],
};

export const FUNCTIONS: Lesson[] = [functionsBasics, typedFunctions, closures, scopeRecursion, bossToolkit];
