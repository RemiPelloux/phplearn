import { L } from "@/lib/txt";
import { all, any, avoids, clean, outputIs, outputLines, probeIs, probeThrows, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "versions";

// ───────────────────────────────────────────── PHP 7.0 → 7.4

export const php7Recap: Lesson = {
  id: "php7-recap",
  chapterId: CH,
  title: L("PHP 7: the great leap", "PHP 7 : le grand saut"),
  tagline: L("Speed, types, ??, <=>, arrow functions: the base of modern PHP", "Vitesse, types, ??, <=>, fonctions fléchées : la base du PHP moderne"),
  xp: 70,
  syntax: ["int $x", ": float", "?string", "void", "??", "??=", "<=>", "fn() =>", "new class"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("Why PHP 7 changed everything", "Pourquoi PHP 7 a tout changé"),
      body: [
        L(
          "In December 2015, PHP jumped from 5.6 straight to 7.0 (PHP 6 was abandoned years earlier). The engine was rewritten: typical applications ran roughly **twice as fast** and used much less memory, without changing a line of their code.",
          "En décembre 2015, PHP est passé directement de la 5.6 à la 7.0 (PHP 6 avait été abandonné des années plus tôt). Le moteur a été réécrit : les applications courantes tournaient environ **deux fois plus vite** et consommaient bien moins de mémoire, sans changer une ligne de code.",
        ),
        L(
          "The 7.x series (7.0 to 7.4, until 2019) also brought the tools modern PHP is built on: **type declarations**, the null coalescing operator `??`, the spaceship operator `<=>`, anonymous classes, and in 7.4 typed properties and arrow functions.",
          "La série 7.x (de 7.0 à 7.4, jusqu'en 2019) a aussi apporté les outils sur lesquels repose le PHP moderne : les **déclarations de types**, l'opérateur de coalescence nulle `??`, l'opérateur vaisseau spatial `<=>`, les classes anonymes, et en 7.4 les propriétés typées et les fonctions fléchées.",
        ),
        L(
          "This chapter is different from the others: you can pick the PHP version for each run. Every example says which version it targets. PHP 7.4 is the oldest one available here.",
          "Ce chapitre est différent des autres : tu peux choisir la version de PHP à chaque exécution. Chaque exemple indique la version visée. PHP 7.4 est la plus ancienne disponible ici.",
        ),
      ],
      scene: "timeline",
      example: {
        version: "7.4",
        code: `<?php\n// PHP 7.0: scalar types and return types\nfunction half(int $n): float {\n    return $n / 2;\n}\nvar_dump(half(7));\n\n// PHP 7.0: ?? gives a default when a value is missing or null\n$config = ["name" => "shop"];\necho $config["theme"] ?? "light", "\\n";\n\n// PHP 7.0: <=> compares and returns -1, 0 or 1\necho 3 <=> 5, " ", 5 <=> 5, " ", 8 <=> 5, "\\n";\n`,
        caption: L("Run it on PHP 7.4: all of this already works there.", "Exécute-le sur PHP 7.4 : tout ceci y marche déjà."),
      },
    },
    {
      kind: "discover",
      title: L("Types, step by step", "Les types, petit à petit"),
      body: [
        L(
          "Before PHP 7, a function accepted anything, and bugs surfaced far from their cause. Each 7.x release added a piece: `int`, `float`, `string`, `bool` parameters and return types (7.0), nullable types `?string` and `void` (7.1), `object` (7.2), and **typed properties** (7.4).",
          "Avant PHP 7, une fonction acceptait n'importe quoi, et les bugs apparaissaient loin de leur cause. Chaque version 7.x a ajouté une pièce : les paramètres et retours `int`, `float`, `string`, `bool` (7.0), les types nullables `?string` et `void` (7.1), `object` (7.2), et les **propriétés typées** (7.4).",
        ),
        L(
          "`?string` means \"a string or null\". A typed property refuses a wrong value right away, with a `TypeError`, instead of letting it travel through your program.",
          "`?string` veut dire « une chaîne ou null ». Une propriété typée refuse tout de suite une mauvaise valeur, avec une `TypeError`, au lieu de la laisser voyager dans ton programme.",
        ),
      ],
      example: {
        version: "7.4",
        code: `<?php\nclass User {\n    public string $name;\n    public ?string $nickname = null; // 7.1 nullable + 7.4 typed property\n\n    public function __construct(string $name) {\n        $this->name = $name;\n    }\n\n    public function display(): string {\n        return $this->nickname ?? $this->name;\n    }\n}\n\n$u = new User("Ada");\necho $u->display(), "\\n";\n$u->nickname = "Countess";\necho $u->display(), "\\n";\n\ntry {\n    $u->name = ["not", "a", "string"];\n} catch (TypeError $e) {\n    echo "TypeError: ", $e->getMessage();\n}\n`,
      },
    },
    {
      kind: "discover",
      title: L("PHP 7.4: shorter code", "PHP 7.4 : du code plus court"),
      body: [
        L(
          "**Arrow functions** `fn($x) => $x * 2` are one-expression closures that see the outer variables automatically, without `use`. Perfect for `array_map` and `usort`.",
          "Les **fonctions fléchées** `fn($x) => $x * 2` sont des closures d'une seule expression qui voient automatiquement les variables extérieures, sans `use`. Parfaites pour `array_map` et `usort`.",
        ),
        L(
          "`??=` assigns only when the value is missing, and the spread operator `...` unpacks one array into another.",
          "`??=` n'affecte que si la valeur manque, et l'opérateur de décomposition `...` déplie un tableau dans un autre.",
        ),
      ],
      example: {
        version: "7.4",
        code: `<?php\n$rate = 1.2;\n$prices = [10, 25, 40];\n\n// Before 7.4: function ($p) use ($rate) { return $p * $rate; }\n$withTax = array_map(fn($p) => $p * $rate, $prices);\necho implode(", ", $withTax), "\\n";\n\n$options = [];\n$options["lang"] ??= "en";\necho $options["lang"], "\\n";\n\n$more = [...$prices, 99];\necho count($more), " prices\\n";\n`,
      },
    },
    {
      kind: "quiz",
      title: L("The spaceship operator", "L'opérateur vaisseau spatial"),
      question: L("What does this print on PHP 7.4?", "Qu'affiche ce code sur PHP 7.4 ?"),
      version: "7.4",
      code: `<?php\necho 1 <=> 2, 2 <=> 2, "b" <=> "a";\n`,
      options: ["-101", "101", "-1 0 1", "falsetruetrue"],
      answer: 0,
      explain: L(
        "`<=>` returns -1 when the left side is smaller, 0 when equal, 1 when bigger. echo glues the three results with no space: `-1`, `0`, `1` → `-101`. Strings compare alphabetically.",
        "`<=>` renvoie -1 quand le côté gauche est plus petit, 0 s'ils sont égaux, 1 s'il est plus grand. echo colle les trois résultats sans espace : `-1`, `0`, `1` → `-101`. Les chaînes se comparent par ordre alphabétique.",
      ),
    },
    {
      kind: "compare",
      title: L("PHP 7.4 warned you", "PHP 7.4 t'avait prévenu"),
      body: L(
        "PHP 7.4 printed *Deprecated* messages for habits that PHP 8.0 then removed. This old way of calling `implode()` (array first, glue second) still works on 7.4 with a warning, and fails on 8.x. Run it on each version.",
        "PHP 7.4 affichait des messages *Deprecated* pour des habitudes que PHP 8.0 a ensuite supprimées. Cette vieille façon d'appeler `implode()` (le tableau d'abord, le séparateur ensuite) marche encore en 7.4 avec un avertissement, et échoue en 8.x. Exécute-le sur chaque version.",
      ),
      code: `<?php\n$tags = ["php", "web", "api"];\necho implode($tags, ", "), "\\n";\necho "done";\n`,
      versions: ["7.4", "8.0", "8.5"],
      takeaway: L(
        "A deprecation is a promise: \"this will break in the next major version\". Fix them before you upgrade, and the upgrade becomes boring (the good kind).",
        "Une dépréciation est une promesse : « ceci cassera à la prochaine version majeure ». Corrige-les avant de mettre à jour, et la mise à jour devient ennuyeuse (dans le bon sens).",
      ),
    },
    {
      kind: "try",
      title: L("Type a PHP 5 function", "Type une fonction PHP 5"),
      body: L(
        "This function is written PHP 5 style: no types, and a manual `if` for the default. Modernise it the PHP 7 way: type it as `priceWithTax(float $price, ?float $rate = null): float`, use `??` for the default rate (0.2), and replace the closure with an arrow function `fn`. The output must stay `12, 24, 60`.",
        "Cette fonction est écrite façon PHP 5 : pas de types, et un `if` manuel pour la valeur par défaut. Modernise-la à la façon PHP 7 : type-la `priceWithTax(float $price, ?float $rate = null): float`, utilise `??` pour le taux par défaut (0.2), et remplace la closure par une fonction fléchée `fn`. La sortie doit rester `12, 24, 60`.",
      ),
      version: "7.4",
      files: {
        "index.php": `<?php\nfunction priceWithTax($price, $rate = null)\n{\n    if ($rate === null) {\n        $rate = 0.2;\n    }\n    return $price * (1 + $rate);\n}\n\n$prices = [10.0, 20.0, 50.0];\n$withTax = array_map(function ($p) { return priceWithTax($p); }, $prices);\necho implode(", ", $withTax);\n`,
      },
      solution: {
        "index.php": `<?php\nfunction priceWithTax(float $price, ?float $rate = null): float\n{\n    return $price * (1 + ($rate ?? 0.2));\n}\n\n$prices = [10.0, 20.0, 50.0];\n$withTax = array_map(fn($p) => priceWithTax($p), $prices);\necho implode(", ", $withTax);\n`,
      },
      probes: ["priceWithTax('abc')"],
      objectives: [
        {
          id: "typed",
          label: L("The function has typed parameters and a float return type", "La fonction a des paramètres typés et un retour float"),
          check: all(uses(/function\s+priceWithTax\s*\(\s*float\s+\$price\s*,\s*\?float\s+\$rate/), uses(/\)\s*:\s*float/), probeThrows("priceWithTax('abc')", "TypeError")),
          hints: [
            L("Types go before each parameter, the return type after the closing parenthesis.", "Les types se mettent avant chaque paramètre, le type de retour après la parenthèse fermante."),
            L("`float $price`, `?float $rate = null` (the `?` allows null), then `): float`.", "`float $price`, `?float $rate = null` (le `?` autorise null), puis `): float`."),
            L("`function priceWithTax(float $price, ?float $rate = null): float`", "`function priceWithTax(float $price, ?float $rate = null): float`"),
          ],
        },
        {
          id: "short",
          label: L("Use ?? for the default and an arrow function; output stays 12, 24, 60", "Utiliser ?? pour le défaut et une fonction fléchée ; la sortie reste 12, 24, 60"),
          check: all(uses(/\?\?/), uses(/\bfn\s*\(/), outputIs("12, 24, 60")),
          hints: [
            L("`$rate ?? 0.2` means \"$rate, or 0.2 if it's null\": the `if` can go.", "`$rate ?? 0.2` veut dire « $rate, ou 0.2 s'il vaut null » : le `if` peut partir."),
            L("`return $price * (1 + ($rate ?? 0.2));` and `array_map(fn($p) => priceWithTax($p), $prices)`.", "`return $price * (1 + ($rate ?? 0.2));` et `array_map(fn($p) => priceWithTax($p), $prices)`."),
            L("Delete the `if` block, write the return above, and replace `function ($p) { return priceWithTax($p); }` with `fn($p) => priceWithTax($p)`.", "Supprime le bloc `if`, écris le return ci-dessus, et remplace `function ($p) { return priceWithTax($p); }` par `fn($p) => priceWithTax($p)`."),
          ],
        },
      ],
      cheat: "php7",
    },
    {
      kind: "challenge",
      title: L("The leaderboard", "Le classement"),
      body: L(
        "On PHP 7.4: give `Player` typed properties (`string $name`, `int $score`), sort the players by score, highest first, with `usort` and `<=>`, and print `1. Linus (340)`, `2. Grace (210)`, `3. Ada (120)`, one per line.",
        "Sur PHP 7.4 : donne à `Player` des propriétés typées (`string $name`, `int $score`), trie les joueurs par score, du plus haut au plus bas, avec `usort` et `<=>`, et affiche `1. Linus (340)`, `2. Grace (210)`, `3. Ada (120)`, un par ligne.",
      ),
      version: "7.4",
      files: {
        "index.php": `<?php\nclass Player\n{\n    public $name;\n    public $score;\n\n    public function __construct($name, $score)\n    {\n        $this->name = $name;\n        $this->score = $score;\n    }\n}\n\n$players = [new Player("Ada", 120), new Player("Linus", 340), new Player("Grace", 210)];\n\n// 1. Type the properties\n// 2. Sort by score, highest first (usort + <=>)\n// 3. Print "1. Linus (340)", …\n`,
      },
      solution: {
        "index.php": `<?php\nclass Player\n{\n    public string $name;\n    public int $score;\n\n    public function __construct(string $name, int $score)\n    {\n        $this->name = $name;\n        $this->score = $score;\n    }\n}\n\n$players = [new Player("Ada", 120), new Player("Linus", 340), new Player("Grace", 210)];\n\nusort($players, fn($a, $b) => $b->score <=> $a->score);\n\nforeach ($players as $i => $p) {\n    echo ($i + 1) . ". {$p->name} ({$p->score})\\n";\n}\n`,
      },
      probes: ["(function () { $p = new Player('x', 1); $p->score = 'lots'; })()"],
      objectives: [
        {
          id: "typed",
          label: L("Player has typed properties: string $name and int $score", "Player a des propriétés typées : string $name et int $score"),
          check: all(uses(/public\s+string\s+\$name/), uses(/public\s+int\s+\$score/), probeThrows("(function () { $p = new Player('x', 1); $p->score = 'lots'; })()", "TypeError")),
          hints: [
            L("Since 7.4, a property can have a type, written between `public` and the name.", "Depuis 7.4, une propriété peut avoir un type, écrit entre `public` et le nom."),
            L("`public string $name;` and `public int $score;`", "`public string $name;` et `public int $score;`"),
            L("Replace `public $name;` with `public string $name;` and `public $score;` with `public int $score;`.", "Remplace `public $name;` par `public string $name;` et `public $score;` par `public int $score;`."),
          ],
        },
        {
          id: "sorted",
          label: L("Print the ranking, highest score first", "Afficher le classement, meilleur score d'abord"),
          check: all(uses(/<=>/), outputLines(["1. Linus (340)", "2. Grace (210)", "3. Ada (120)"])),
          hints: [
            L("`usort` takes a function that compares two players and returns -1, 0 or 1. That's exactly what `<=>` returns.", "`usort` prend une fonction qui compare deux joueurs et renvoie -1, 0 ou 1. C'est exactement ce que renvoie `<=>`."),
            L("Put `$b` on the left for highest first: `fn($a, $b) => $b->score <=> $a->score`. Then a `foreach` with `$i => $p`.", "Mets `$b` à gauche pour le plus haut d'abord : `fn($a, $b) => $b->score <=> $a->score`. Puis un `foreach` avec `$i => $p`."),
            L("`usort($players, fn($a, $b) => $b->score <=> $a->score);` then `foreach ($players as $i => $p) { echo ($i + 1) . \". {$p->name} ({$p->score})\\n\"; }`", "`usort($players, fn($a, $b) => $b->score <=> $a->score);` puis `foreach ($players as $i => $p) { echo ($i + 1) . \". {$p->name} ({$p->score})\\n\"; }`"),
          ],
        },
      ],
      cheat: "php7",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("PHP 7.0 (2015) roughly doubled performance and started the type system.", "PHP 7.0 (2015) a environ doublé les performances et lancé le système de types."),
    L("7.x added scalar and return types, `?nullable`, `void` and typed properties.", "La série 7.x a ajouté les types scalaires et de retour, `?nullable`, `void` et les propriétés typées."),
    L("`??`, `??=`, `<=>` and arrow functions `fn() =>` make everyday code shorter.", "`??`, `??=`, `<=>` et les fonctions fléchées `fn() =>` raccourcissent le code de tous les jours."),
    L("Deprecations in one version become errors in the next major one: fix them early.", "Les dépréciations d'une version deviennent des erreurs à la version majeure suivante : corrige-les tôt."),
  ],
};

// ───────────────────────────────────────────── PHP 8.0

export const php80: Lesson = {
  id: "php80",
  chapterId: CH,
  title: L("PHP 8.0: a new language", "PHP 8.0 : un nouveau langage"),
  tagline: L("match, named arguments, ?->, promotion, and saner comparisons", "match, arguments nommés, ?->, promotion, et des comparaisons saines"),
  xp: 70,
  syntax: ["match", "name: value", "?->", "int|string", "__construct(private …)", "str_contains", "throw"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("PHP 8.0: the biggest release in years", "PHP 8.0 : la plus grosse sortie depuis des années"),
      body: [
        L(
          "PHP 8.0 (November 2020) added a JIT compiler, but what changed your daily code is the syntax: `match`, named arguments, the nullsafe operator `?->`, union types, constructor promotion, `throw` as an expression, and handy functions like `str_contains()`.",
          "PHP 8.0 (novembre 2020) a ajouté un compilateur JIT, mais ce qui a changé ton code de tous les jours, c'est la syntaxe : `match`, les arguments nommés, l'opérateur nullsafe `?->`, les types union, la promotion des propriétés du constructeur, `throw` comme expression, et des fonctions pratiques comme `str_contains()`.",
        ),
        L(
          "`match` is a stricter `switch`: it returns a value, compares with `===` (no surprises), needs no `break`, and throws an `UnhandledMatchError` if nothing matches instead of silently doing nothing.",
          "`match` est un `switch` plus strict : il renvoie une valeur, compare avec `===` (pas de surprise), n'a pas besoin de `break`, et lève une `UnhandledMatchError` si rien ne correspond au lieu de ne rien faire en silence.",
        ),
      ],
      example: {
        version: "8.0",
        code: `<?php\n$status = 404;\n$text = match ($status) {\n    200, 204 => "Success",\n    301, 302 => "Redirect",\n    404 => "Not found",\n    default => "Error",\n};\necho $text, "\\n";\n\n// switch compares loosely, match strictly:\nswitch ("1e1") { case 10: echo "switch: ten\\n"; break; }\necho match ("1e1") { 10 => "match: ten", default => "match: not ten" }, "\\n";\n`,
      },
    },
    {
      kind: "compare",
      title: L("The breaking change: string vs number", "Le changement qui casse : chaîne contre nombre"),
      body: L(
        "In PHP 7, comparing a number with a non-numeric string turned the string into a number: `\"a\"` became `0`, so `0 == \"a\"` was **true**. It caused real security bugs. PHP 8 compares them as strings instead. Run this on 7.4 and 8.0.",
        "En PHP 7, comparer un nombre à une chaîne non numérique transformait la chaîne en nombre : `\"a\"` devenait `0`, donc `0 == \"a\"` était **vrai**. Ça a causé de vrais bugs de sécurité. PHP 8 les compare plutôt comme des chaînes. Exécute ceci en 7.4 et en 8.0.",
      ),
      code: `<?php\nvar_dump(0 == "a");\nvar_dump("1" == "01");\nvar_dump(in_array("abc", [0]));\n`,
      versions: ["7.4", "8.0"],
      takeaway: L(
        "Same code, different answers: when you upgrade from 7 to 8, loose `==` comparisons between numbers and words are the first thing to check. Better: use `===`.",
        "Même code, réponses différentes : quand tu passes de 7 à 8, les comparaisons lâches `==` entre nombres et mots sont la première chose à vérifier. Encore mieux : utilise `===`.",
      ),
    },
    {
      kind: "quiz",
      title: L("Zero and the empty string", "Zéro et la chaîne vide"),
      question: L("On PHP 8.0, what does this print?", "En PHP 8.0, qu'affiche ce code ?"),
      version: "8.0",
      code: `<?php\nvar_dump(0 == "");\n`,
      options: ["bool(true)", "bool(false)", "int(0)", "NULL"],
      answer: 1,
      explain: L(
        "`\"\"` is not a numeric string, so PHP 8 compares `\"0\"` with `\"\"` as strings: false. On PHP 7.4 the same line printed `bool(true)`.",
        "`\"\"` n'est pas une chaîne numérique, donc PHP 8 compare `\"0\"` et `\"\"` comme des chaînes : faux. En PHP 7.4, la même ligne affichait `bool(true)`.",
      ),
    },
    {
      kind: "discover",
      title: L("Less boilerplate", "Moins de code répétitif"),
      body: [
        L(
          "**Constructor promotion**: write `public function __construct(private string $name)` and PHP declares and assigns the property for you. **Named arguments** let you skip optional parameters and make calls readable: `str_pad($s, 5, pad_type: STR_PAD_LEFT)`.",
          "**Promotion dans le constructeur** : écris `public function __construct(private string $name)` et PHP déclare et affecte la propriété pour toi. Les **arguments nommés** permettent de sauter des paramètres optionnels et rendent les appels lisibles : `str_pad($s, 5, pad_type: STR_PAD_LEFT)`.",
        ),
        L(
          "The **nullsafe operator** `?->` stops the chain and gives `null` when a value is null, instead of crashing. **Union types** `int|string` accept several types. `throw` can now be used inside an expression, like after `??`.",
          "L'**opérateur nullsafe** `?->` arrête la chaîne et donne `null` quand une valeur est nulle, au lieu de planter. Les **types union** `int|string` acceptent plusieurs types. `throw` peut maintenant s'utiliser dans une expression, par exemple après `??`.",
        ),
      ],
      example: {
        version: "8.0",
        code: `<?php\nclass Address {\n    public function __construct(public string $city) {}\n}\nclass User {\n    public function __construct(public string $name, public ?Address $address = null) {}\n}\n\n$ada = new User("Ada", new Address("London"));\n$bob = new User("Bob");\necho $ada->address?->city ?? "unknown", "\\n";\necho $bob->address?->city ?? "unknown", "\\n";\n\necho str_pad("7", 3, "0", pad_type: STR_PAD_LEFT), "\\n";\n\nfunction describe(int|string $id): string {\n    return gettype($id) . " " . $id;\n}\necho describe(42), " / ", describe("A-7"), "\\n";\n\nvar_dump(str_contains("Hello PHP", "PHP"));\n`,
      },
    },
    {
      kind: "compare",
      title: L("New syntax, old parser", "Nouvelle syntaxe, ancien analyseur"),
      body: L(
        "What happens when PHP 7.4 meets PHP 8 syntax? It can't even read the file: a `ParseError` stops everything before the first line runs. A missing function like `str_contains` fails later, when the line is reached.",
        "Que se passe-t-il quand PHP 7.4 rencontre de la syntaxe PHP 8 ? Il ne peut même pas lire le fichier : une `ParseError` arrête tout avant que la première ligne ne s'exécute. Une fonction absente comme `str_contains` échoue plus tard, quand la ligne est atteinte.",
      ),
      code: `<?php\necho "Starting\\n";\n$size = 3;\necho match (true) {\n    $size < 2 => "small",\n    $size < 5 => "medium",\n    default => "large",\n}, "\\n";\n`,
      versions: ["7.4", "8.0"],
      takeaway: L(
        "A parse error means the whole file is rejected. That's why a library that uses `match` requires PHP 8 in its composer.json: it can't run at all on 7.",
        "Une erreur d'analyse veut dire que tout le fichier est rejeté. C'est pour ça qu'une bibliothèque qui utilise `match` exige PHP 8 dans son composer.json : elle ne peut pas tourner du tout en 7.",
      ),
    },
    {
      kind: "try",
      title: L("From switch to match", "De switch à match"),
      body: L(
        "Rewrite this `switch` as a `match` expression that assigns `$text`. Several values can share an arm: `301, 302 => \"Redirect\"`. The output must not change.",
        "Réécris ce `switch` en une expression `match` qui affecte `$text`. Plusieurs valeurs peuvent partager une branche : `301, 302 => \"Redirect\"`. La sortie ne doit pas changer.",
      ),
      version: "8.0",
      files: {
        "index.php": `<?php\n$codes = [200, 404, 500, 302];\nforeach ($codes as $code) {\n    switch ($code) {\n        case 200:\n            $text = "OK";\n            break;\n        case 301:\n        case 302:\n            $text = "Redirect";\n            break;\n        case 404:\n            $text = "Not found";\n            break;\n        default:\n            $text = "Error";\n    }\n    echo "$code: $text\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\n$codes = [200, 404, 500, 302];\nforeach ($codes as $code) {\n    $text = match ($code) {\n        200 => "OK",\n        301, 302 => "Redirect",\n        404 => "Not found",\n        default => "Error",\n    };\n    echo "$code: $text\\n";\n}\n`,
      },
      objectives: [
        {
          id: "match",
          label: L("Use match instead of switch, with the same output", "Utiliser match au lieu de switch, avec la même sortie"),
          check: all(uses(/\bmatch\s*\(/), avoids(/\bswitch\s*\(/), outputLines(["200: OK", "404: Not found", "500: Error", "302: Redirect"])),
          hints: [
            L("`match` is an expression: it gives back a value you can assign: `$text = match ($code) { … };`", "`match` est une expression : il renvoie une valeur que tu peux affecter : `$text = match ($code) { … };`"),
            L("Each arm is `value => result,`. Group values with commas. `default =>` catches the rest. Don't forget the `;` after the closing brace.", "Chaque branche est `valeur => résultat,`. Groupe les valeurs avec des virgules. `default =>` attrape le reste. N'oublie pas le `;` après l'accolade fermante."),
            L("`$text = match ($code) { 200 => \"OK\", 301, 302 => \"Redirect\", 404 => \"Not found\", default => \"Error\" };`", "`$text = match ($code) { 200 => \"OK\", 301, 302 => \"Redirect\", 404 => \"Not found\", default => \"Error\" };`"),
          ],
        },
      ],
      cheat: "php80",
    },
    {
      kind: "challenge",
      title: L("Modernise a user profile", "Modernise un profil utilisateur"),
      body: L(
        "This PHP 7 code works but is verbose. On PHP 8.0, use constructor promotion in both classes, replace the null check with `?->` and `??`, and call `str_pad` with named arguments for the optional parameters. The output must stay identical.",
        "Ce code PHP 7 marche mais il est verbeux. En PHP 8.0, utilise la promotion dans les deux constructeurs, remplace la vérification de null par `?->` et `??`, et appelle `str_pad` avec des arguments nommés pour les paramètres optionnels. La sortie doit rester identique.",
      ),
      version: "8.0",
      files: {
        "index.php": `<?php\nclass Address\n{\n    private $city;\n\n    public function __construct($city)\n    {\n        $this->city = $city;\n    }\n\n    public function getCity() { return $this->city; }\n}\n\nclass User\n{\n    private $name;\n    private $address;\n\n    public function __construct($name, $address = null)\n    {\n        $this->name = $name;\n        $this->address = $address;\n    }\n\n    public function getName() { return $this->name; }\n    public function getAddress() { return $this->address; }\n}\n\n$users = [new User("Ada", new Address("London")), new User("Linus")];\nforeach ($users as $user) {\n    $city = $user->getAddress() !== null ? $user->getAddress()->getCity() : "unknown";\n    echo str_pad($user->getName(), 6, ".", STR_PAD_RIGHT) . " " . $city . "\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass Address\n{\n    public function __construct(private string $city) {}\n\n    public function getCity(): string { return $this->city; }\n}\n\nclass User\n{\n    public function __construct(private string $name, private ?Address $address = null) {}\n\n    public function getName(): string { return $this->name; }\n    public function getAddress(): ?Address { return $this->address; }\n}\n\n$users = [new User("Ada", new Address("London")), new User("Linus")];\nforeach ($users as $user) {\n    $city = $user->getAddress()?->getCity() ?? "unknown";\n    echo str_pad($user->getName(), length: 6, pad_string: ".") . " " . $city . "\\n";\n}\n`,
      },
      objectives: [
        {
          id: "promotion",
          label: L("Both constructors use promotion", "Les deux constructeurs utilisent la promotion"),
          check: (c) => (c.code.match(/__construct\s*\(\s*(public|private|protected)\b/g) ?? []).length >= 2,
          hints: [
            L("Put the visibility right in the constructor's parameters; then delete the property declarations and the assignments.", "Mets la visibilité directement dans les paramètres du constructeur ; supprime ensuite les déclarations de propriétés et les affectations."),
            L("`public function __construct(private string $city) {}`: an empty body is fine.", "`public function __construct(private string $city) {}` : un corps vide, c'est normal."),
            L("Address: `public function __construct(private string $city) {}`. User: `public function __construct(private string $name, private ?Address $address = null) {}`.", "Address : `public function __construct(private string $city) {}`. User : `public function __construct(private string $name, private ?Address $address = null) {}`."),
          ],
        },
        {
          id: "nullsafe",
          label: L("Use ?-> and ?? for the city", "Utiliser ?-> et ?? pour la ville"),
          check: all(uses(/\?->/), uses(/\?\?/)),
          hints: [
            L("`?->` returns null instead of calling a method on null.", "`?->` renvoie null au lieu d'appeler une méthode sur null."),
            L("`$user->getAddress()?->getCity()` is null for Linus; `??` turns null into \"unknown\".", "`$user->getAddress()?->getCity()` vaut null pour Linus ; `??` transforme null en \"unknown\"."),
            L("`$city = $user->getAddress()?->getCity() ?? \"unknown\";`", "`$city = $user->getAddress()?->getCity() ?? \"unknown\";`"),
          ],
        },
        {
          id: "named",
          label: L("Call str_pad with named arguments", "Appeler str_pad avec des arguments nommés"),
          check: uses(/str_pad\s*\([^;]*\b(length|pad_string|pad_type)\s*:/),
          hints: [
            L("Named arguments are `name: value`. The names are the parameter names in the docs: `length`, `pad_string`, `pad_type`.", "Les arguments nommés s'écrivent `nom: valeur`. Les noms sont ceux des paramètres dans la doc : `length`, `pad_string`, `pad_type`."),
            L("`STR_PAD_RIGHT` is the default, so with names you can just leave it out.", "`STR_PAD_RIGHT` est la valeur par défaut : avec les noms, tu peux simplement l'omettre."),
            L("`str_pad($user->getName(), length: 6, pad_string: \".\")`", "`str_pad($user->getName(), length: 6, pad_string: \".\")`"),
          ],
        },
        {
          id: "same",
          label: L("Same output, no warnings", "Même sortie, aucun avertissement"),
          check: all(clean, outputLines(["Ada... London", "Linus. unknown"])),
          hints: [
            L("Run it after each change: the Problems tab tells you right away if something broke.", "Exécute après chaque changement : l'onglet Problèmes te dit tout de suite si quelque chose a cassé."),
            L("Expected: `Ada... London` then `Linus. unknown`.", "Attendu : `Ada... London` puis `Linus. unknown`."),
            L("Check that the getters still exist: the foreach still calls `getName()` and `getAddress()`.", "Vérifie que les getters existent toujours : le foreach appelle encore `getName()` et `getAddress()`."),
          ],
        },
      ],
      cheat: "php80",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`match` returns a value, compares strictly and has no fall-through.", "`match` renvoie une valeur, compare strictement et n'a pas de « fall-through »."),
    L("PHP 8 compares numbers and non-numeric strings as strings: `0 == \"a\"` is now false.", "PHP 8 compare nombres et chaînes non numériques comme des chaînes : `0 == \"a\"` est maintenant faux."),
    L("Promotion, named arguments, `?->` and union types remove boilerplate.", "La promotion, les arguments nommés, `?->` et les types union suppriment du code répétitif."),
    L("New syntax is a ParseError on older versions: the whole file is rejected.", "Une nouvelle syntaxe est une ParseError sur les anciennes versions : tout le fichier est rejeté."),
  ],
};

// ───────────────────────────────────────────── PHP 8.1

export const php81: Lesson = {
  id: "php81",
  chapterId: CH,
  title: L("PHP 8.1: enums and readonly", "PHP 8.1 : enums et readonly"),
  tagline: L("Enums, readonly properties, never, first-class callables", "Enums, propriétés readonly, never, callables de première classe"),
  xp: 70,
  syntax: ["enum", "case", "readonly", "never", "strlen(...)", "new in initializers", "array_is_list"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("Enums: a closed list of values", "Les enums : une liste fermée de valeurs"),
      body: [
        L(
          "For years, PHP code used strings or constants for things like an order status. Nothing stopped a typo like `\"shiped\"`. PHP 8.1 (November 2021) added **enums**: a type with a fixed list of cases.",
          "Pendant des années, le code PHP utilisait des chaînes ou des constantes pour des choses comme le statut d'une commande. Rien n'empêchait une faute comme `\"shiped\"`. PHP 8.1 (novembre 2021) a ajouté les **enums** : un type avec une liste fixe de cas.",
        ),
        L(
          "A **backed enum** (`enum Status: string`) maps each case to a value, so you can store it in a database and read it back with `from()` (throws if unknown) or `tryFrom()` (returns null). Enums can have methods, and `match` on them is very readable.",
          "Une **enum adossée** (`enum Status: string`) associe une valeur à chaque cas, pour pouvoir la stocker en base de données et la relire avec `from()` (lève une erreur si inconnue) ou `tryFrom()` (renvoie null). Les enums peuvent avoir des méthodes, et un `match` dessus se lit très bien.",
        ),
      ],
      example: {
        version: "8.1",
        code: `<?php\nenum Status: string {\n    case Active = "active";\n    case Banned = "banned";\n\n    public function label(): string {\n        return match ($this) {\n            Status::Active => "Active user",\n            Status::Banned => "Banned user",\n        };\n    }\n}\n\n$s = Status::from("banned");\necho $s->label(), "\\n";\nvar_dump(Status::tryFrom("oops"));\necho count(Status::cases()), " cases\\n";\nvar_dump($s === Status::Banned);\n`,
      },
    },
    {
      kind: "compare",
      title: L("Enums on PHP 8.0?", "Des enums en PHP 8.0 ?"),
      body: L(
        "The `enum` keyword didn't exist before 8.1. Run this on 8.0 and on 8.1.",
        "Le mot-clé `enum` n'existait pas avant 8.1. Exécute ceci en 8.0 et en 8.1.",
      ),
      code: `<?php\nenum Suit: string {\n    case Hearts = "H";\n    case Spades = "S";\n}\necho Suit::from("H")->name;\n`,
      versions: ["8.0", "8.1"],
      takeaway: L(
        "8.0 sees `enum` as an unknown word and fails to parse. From 8.1 on, `Suit::from(\"H\")` gives the case `Hearts`.",
        "8.0 voit `enum` comme un mot inconnu et l'analyse échoue. À partir de 8.1, `Suit::from(\"H\")` donne le cas `Hearts`.",
      ),
    },
    {
      kind: "discover",
      title: L("Readonly, never and other 8.1 gifts", "Readonly, never et autres cadeaux de 8.1"),
      body: [
        L(
          "A `readonly` property can be set once (in the constructor) and never changed again: perfect for value objects like money or dates. `never` is a return type for functions that always throw or exit.",
          "Une propriété `readonly` ne peut être affectée qu'une fois (dans le constructeur) et plus jamais modifiée : parfait pour les objets-valeurs comme l'argent ou les dates. `never` est un type de retour pour les fonctions qui lèvent toujours une exception ou terminent le script.",
        ),
        L(
          "`strlen(...)` creates a closure from any function (first-class callable syntax). `new` is allowed in default values. `array_is_list()` tells if keys are 0, 1, 2… And `...` now unpacks arrays with string keys.",
          "`strlen(...)` crée une closure à partir de n'importe quelle fonction (syntaxe des callables de première classe). `new` est permis dans les valeurs par défaut. `array_is_list()` dit si les clés sont 0, 1, 2… Et `...` déplie maintenant les tableaux à clés texte.",
        ),
        L(
          "8.1 also added **Fibers**, the low-level building block that async libraries use to pause and resume code. You'll rarely write one yourself, so we won't run them here.",
          "8.1 a aussi ajouté les **Fibers**, la brique de bas niveau que les bibliothèques asynchrones utilisent pour mettre du code en pause et le reprendre. Tu en écriras rarement toi-même, alors on ne les exécutera pas ici.",
        ),
      ],
      example: {
        version: "8.1",
        code: `<?php\nclass Point {\n    public function __construct(public readonly int $x, public readonly int $y) {}\n}\n$p = new Point(2, 3);\ntry {\n    $p->x = 10;\n} catch (Error $e) {\n    echo $e->getMessage(), "\\n";\n}\n\n$len = strlen(...);\necho $len("hello"), "\\n";\n\nvar_dump(array_is_list([10, 20]), array_is_list([1 => 10]));\n\n$defaults = ["theme" => "light", "size" => 14];\n$custom = ["size" => 16];\necho json_encode([...$defaults, ...$custom]), "\\n";\n`,
      },
    },
    {
      kind: "quiz",
      title: L("from() an int", "from() avec un entier"),
      question: L("On PHP 8.1, what does this print?", "En PHP 8.1, qu'affiche ce code ?"),
      version: "8.1",
      code: `<?php\nenum Size: int {\n    case S = 1;\n    case M = 2;\n    case L = 3;\n}\necho Size::from(2)->name;\n`,
      options: ["2", "M", "Size::M", "1"],
      answer: 1,
      explain: L(
        "`from(2)` finds the case whose value is 2, that's `Size::M`. Its `->name` is the case name, `M`, and its `->value` would be 2.",
        "`from(2)` trouve le cas dont la valeur est 2, c'est `Size::M`. Son `->name` est le nom du cas, `M`, et son `->value` serait 2.",
      ),
    },
    {
      kind: "try",
      title: L("Replace magic strings with an enum", "Remplace des chaînes magiques par une enum"),
      body: L(
        "Create a backed enum `OrderStatus: string` with the cases `Pending = \"pending\"` and `Shipped = \"shipped\"`, and a method `label()` that returns `\"Pending\"` or `\"Shipped\"`. Then print `OrderStatus::from(\"shipped\")->label()`.",
        "Crée une enum adossée `OrderStatus: string` avec les cas `Pending = \"pending\"` et `Shipped = \"shipped\"`, et une méthode `label()` qui renvoie `\"Pending\"` ou `\"Shipped\"`. Affiche ensuite `OrderStatus::from(\"shipped\")->label()`.",
      ),
      version: "8.1",
      files: {
        "index.php": `<?php\n// Before 8.1: plain strings, and a typo goes unnoticed.\nconst STATUS_PENDING = "pending";\nconst STATUS_SHIPPED = "shipped";\n\nfunction label(string $status): string\n{\n    return $status === STATUS_SHIPPED ? "Shipped" : "Pending";\n}\n\necho label("shiped"); // oops, prints Pending\n`,
      },
      solution: {
        "index.php": `<?php\nenum OrderStatus: string\n{\n    case Pending = "pending";\n    case Shipped = "shipped";\n\n    public function label(): string\n    {\n        return match ($this) {\n            OrderStatus::Pending => "Pending",\n            OrderStatus::Shipped => "Shipped",\n        };\n    }\n}\n\necho OrderStatus::from("shipped")->label();\n`,
      },
      probes: ["OrderStatus::from('shipped')->label()", "OrderStatus::Pending->value"],
      objectives: [
        {
          id: "enum",
          label: L("Declare the backed enum OrderStatus with its two cases", "Déclarer l'enum adossée OrderStatus avec ses deux cas"),
          check: all(uses(/\benum\s+OrderStatus\s*:\s*string/), probeIs("OrderStatus::Pending->value", "pending")),
          hints: [
            L("A backed enum names its value type after a colon, like a return type.", "Une enum adossée indique le type de ses valeurs après deux-points, comme un type de retour."),
            L("`enum OrderStatus: string { case Pending = \"pending\"; case Shipped = \"shipped\"; }`", "`enum OrderStatus: string { case Pending = \"pending\"; case Shipped = \"shipped\"; }`"),
            L("Replace the two constants and the function with the enum above (you can delete them).", "Remplace les deux constantes et la fonction par l'enum ci-dessus (tu peux les supprimer)."),
          ],
        },
        {
          id: "label",
          label: L("label() returns the readable name, and the script prints Shipped", "label() renvoie le nom lisible, et le script affiche Shipped"),
          check: all(probeIs("OrderStatus::from('shipped')->label()", "Shipped"), outputIs("Shipped")),
          hints: [
            L("Inside an enum method, `$this` is the current case. A `match ($this)` picks the label.", "Dans une méthode d'enum, `$this` est le cas courant. Un `match ($this)` choisit le libellé."),
            L("`public function label(): string { return match ($this) { OrderStatus::Pending => \"Pending\", OrderStatus::Shipped => \"Shipped\" }; }`", "`public function label(): string { return match ($this) { OrderStatus::Pending => \"Pending\", OrderStatus::Shipped => \"Shipped\" }; }`"),
            L("Add the method inside the enum, then end the file with `echo OrderStatus::from(\"shipped\")->label();`", "Ajoute la méthode dans l'enum, puis termine le fichier par `echo OrderStatus::from(\"shipped\")->label();`"),
          ],
        },
      ],
      cheat: "php81",
    },
    {
      kind: "compare",
      title: L("Unpacking string keys", "Déplier des clés texte"),
      body: L(
        "Merging option arrays with `...` was a common wish. Before 8.1, string keys made it throw an Error.",
        "Fusionner des tableaux d'options avec `...` était un souhait fréquent. Avant 8.1, les clés texte faisaient lever une Error.",
      ),
      code: `<?php\n$defaults = ["lang" => "en", "theme" => "light"];\n$user = ["theme" => "dark"];\n$settings = [...$defaults, ...$user];\necho json_encode($settings);\n`,
      versions: ["8.0", "8.1"],
      takeaway: L(
        "Since 8.1, `[...$a, ...$b]` works like `array_merge($a, $b)`: later string keys win.",
        "Depuis 8.1, `[...$a, ...$b]` marche comme `array_merge($a, $b)` : les clés texte suivantes l'emportent.",
      ),
    },
    {
      kind: "challenge",
      title: L("A Money value object", "Un objet-valeur Money"),
      body: L(
        "`add()` changes the price itself, so `$price` ends up wrong. Make `Money` immutable: promote `amount` and `currency` as `public readonly` properties (`int` and `string`), and make `add()` return a **new** `Money`. Expected output: `Price: 500 EUR` then `Total: 750 EUR`.",
        "`add()` modifie le prix lui-même, donc `$price` finit faux. Rends `Money` immuable : promeus `amount` et `currency` en propriétés `public readonly` (`int` et `string`), et fais renvoyer à `add()` un **nouvel** objet `Money`. Sortie attendue : `Price: 500 EUR` puis `Total: 750 EUR`.",
      ),
      version: "8.1",
      files: {
        "index.php": `<?php\nclass Money\n{\n    public $amount;\n    public $currency;\n\n    public function __construct($amount, $currency)\n    {\n        $this->amount = $amount;\n        $this->currency = $currency;\n    }\n\n    public function add($other)\n    {\n        $this->amount += $other->amount; // changes $this!\n        return $this;\n    }\n}\n\n$price = new Money(500, "EUR");\n$total = $price->add(new Money(250, "EUR"));\necho "Price: {$price->amount} {$price->currency}\\n";\necho "Total: {$total->amount} {$total->currency}\\n";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Money\n{\n    public function __construct(\n        public readonly int $amount,\n        public readonly string $currency,\n    ) {}\n\n    public function add(Money $other): Money\n    {\n        return new Money($this->amount + $other->amount, $this->currency);\n    }\n}\n\n$price = new Money(500, "EUR");\n$total = $price->add(new Money(250, "EUR"));\necho "Price: {$price->amount} {$price->currency}\\n";\necho "Total: {$total->amount} {$total->currency}\\n";\n`,
      },
      probes: ["(function () { $m = new Money(1, 'EUR'); $m->amount = 2; })()"],
      objectives: [
        {
          id: "readonly",
          label: L("amount and currency are promoted readonly properties", "amount et currency sont des propriétés readonly promues"),
          check: all(uses(/(public\s+readonly|readonly\s+public)\s+int\s+\$amount/), uses(/(public\s+readonly|readonly\s+public)\s+string\s+\$currency/), probeThrows("(function () { $m = new Money(1, 'EUR'); $m->amount = 2; })()", "Error")),
          hints: [
            L("A readonly property must have a type. Promotion lets you declare it in the constructor's parameters.", "Une propriété readonly doit avoir un type. La promotion permet de la déclarer dans les paramètres du constructeur."),
            L("`public function __construct(public readonly int $amount, public readonly string $currency) {}`", "`public function __construct(public readonly int $amount, public readonly string $currency) {}`"),
            L("Delete the two property declarations and the assignments, and use the constructor above.", "Supprime les deux déclarations de propriétés et les affectations, et utilise le constructeur ci-dessus."),
          ],
        },
        {
          id: "new",
          label: L("add() returns a new Money: Price: 500 EUR, Total: 750 EUR", "add() renvoie un nouveau Money : Price: 500 EUR, Total: 750 EUR"),
          check: all(clean, outputLines(["Price: 500 EUR", "Total: 750 EUR"])),
          hints: [
            L("With readonly, `$this->amount += …` throws an Error. Build a new object instead.", "Avec readonly, `$this->amount += …` lève une Error. Construis plutôt un nouvel objet."),
            L("`return new Money($this->amount + $other->amount, $this->currency);`", "`return new Money($this->amount + $other->amount, $this->currency);`"),
            L("`public function add(Money $other): Money { return new Money($this->amount + $other->amount, $this->currency); }`", "`public function add(Money $other): Money { return new Money($this->amount + $other->amount, $this->currency); }`"),
          ],
        },
      ],
      cheat: "php81",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Enums replace magic strings: `enum Status: string { case Active = \"active\"; }`.", "Les enums remplacent les chaînes magiques : `enum Status: string { case Active = \"active\"; }`."),
    L("`from()` throws on an unknown value, `tryFrom()` returns null.", "`from()` lève une erreur sur une valeur inconnue, `tryFrom()` renvoie null."),
    L("`readonly` properties are set once: ideal for value objects.", "Les propriétés `readonly` sont affectées une seule fois : idéal pour les objets-valeurs."),
    L("8.1 also brought `never`, `strlen(...)`, `new` in defaults, `array_is_list()` and string-key unpacking.", "8.1 a aussi apporté `never`, `strlen(...)`, `new` dans les valeurs par défaut, `array_is_list()` et le dépliage de clés texte."),
  ],
};

// ───────────────────────────────────────────── PHP 8.2

export const php82: Lesson = {
  id: "php82",
  chapterId: CH,
  title: L("PHP 8.2: tighter classes", "PHP 8.2 : des classes plus strictes"),
  tagline: L("Readonly classes, DNF types, true/false/null, and no more dynamic properties", "Classes readonly, types DNF, true/false/null, et fin des propriétés dynamiques"),
  xp: 70,
  syntax: ["readonly class", "(A&B)|null", "true", "Random\\Randomizer", "trait const", "#[\\AllowDynamicProperties]"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("What 8.2 adds", "Ce qu'ajoute 8.2"),
      body: [
        L(
          "PHP 8.2 (December 2022) builds on 8.1: a `readonly class` makes every property readonly at once. **DNF types** combine intersections and unions, like `(Countable&Traversable)|null`. `true`, `false` and `null` can be used as types on their own.",
          "PHP 8.2 (décembre 2022) prolonge 8.1 : une `readonly class` rend toutes les propriétés readonly d'un coup. Les **types DNF** combinent intersections et unions, comme `(Countable&Traversable)|null`. `true`, `false` et `null` peuvent servir de types à eux seuls.",
        ),
        L(
          "The new **Random** extension gives you an object-oriented random generator. With a seeded engine, the \"random\" numbers are reproducible: great for tests. Traits can now have constants too.",
          "La nouvelle extension **Random** te donne un générateur aléatoire orienté objet. Avec un moteur initialisé par une graine, les nombres « aléatoires » sont reproductibles : idéal pour les tests. Les traits peuvent aussi avoir des constantes.",
        ),
      ],
      example: {
        version: "8.2",
        code: `<?php\nreadonly class Point {\n    public function __construct(public int $x, public int $y) {}\n}\n$p = new Point(1, 2);\necho "($p->x, $p->y)\\n";\n\nfunction alwaysTrue(): true { return true; }\nvar_dump(alwaysTrue());\n\ntrait HasVersion {\n    public const VERSION = "1.0";\n}\nclass App { use HasVersion; }\necho App::VERSION, "\\n";\n\n$rng = new Random\\Randomizer(new Random\\Engine\\Mt19937(42));\necho $rng->getInt(1, 100), " ", $rng->getInt(1, 100), "\\n";\n`,
        caption: L("Run it twice: with the seed 42, the two numbers never change.", "Exécute-le deux fois : avec la graine 42, les deux nombres ne changent jamais."),
      },
    },
    {
      kind: "compare",
      title: L("The end of dynamic properties", "La fin des propriétés dynamiques"),
      body: L(
        "PHP used to let you create a property just by assigning it, even if the class never declared it. A typo like `$user->nmae = …` silently created a new property. PHP 8.2 deprecates this. Compare 8.1 and 8.2.",
        "PHP te laissait créer une propriété simplement en l'affectant, même si la classe ne l'avait jamais déclarée. Une faute comme `$user->nmae = …` créait en silence une nouvelle propriété. PHP 8.2 rend cela obsolète. Compare 8.1 et 8.2.",
      ),
      code: `<?php\nclass User {\n    public string $name = "";\n}\n$u = new User();\n$u->name = "Ada";\n$u->email = "ada@example.com"; // never declared\necho $u->name, " ", $u->email;\n`,
      versions: ["8.1", "8.2"],
      takeaway: L(
        "Same output, but 8.2 adds a *Deprecated* message: in PHP 9 this is planned to become an error. Declare your properties. (`stdClass` and classes marked `#[\\AllowDynamicProperties]` are still allowed.)",
        "Même sortie, mais 8.2 ajoute un message *Deprecated* : dans PHP 9, c'est prévu de devenir une erreur. Déclare tes propriétés. (`stdClass` et les classes marquées `#[\\AllowDynamicProperties]` restent permises.)",
      ),
    },
    {
      kind: "quiz",
      title: L("And stdClass?", "Et stdClass ?"),
      question: L("On PHP 8.2, what is the complete output (no warning shown means none was raised)?", "En PHP 8.2, quelle est la sortie complète (pas d'avertissement affiché veut dire qu'il n'y en a pas eu) ?"),
      version: "8.2",
      code: `<?php\n$o = new stdClass();\n$o->x = 1;\necho $o->x;\n`,
      options: ["1", "Deprecated: Creation of dynamic property stdClass::$x is deprecated\n1", "NULL", "Error: Undefined property"],
      answer: 0,
      explain: L(
        "`stdClass` is PHP's generic \"bag of properties\": dynamic properties are its whole point, so they stay allowed. Only your own classes trigger the deprecation.",
        "`stdClass` est le « sac de propriétés » générique de PHP : les propriétés dynamiques sont sa raison d'être, elles restent donc permises. Seules tes propres classes déclenchent la dépréciation.",
      ),
    },
    {
      kind: "try",
      title: L("Fix the deprecation", "Corrige la dépréciation"),
      body: L(
        "Run this on PHP 8.2: the Problems tab shows a *Deprecated* message. Declare the missing property so the script runs cleanly and still prints `Ada <ada@example.com>`.",
        "Exécute ceci en PHP 8.2 : l'onglet Problèmes affiche un message *Deprecated*. Déclare la propriété manquante pour que le script tourne proprement et affiche toujours `Ada <ada@example.com>`.",
      ),
      version: "8.2",
      files: {
        "index.php": `<?php\nclass Contact\n{\n    public string $name;\n\n    public function __construct(string $name, string $email)\n    {\n        $this->name = $name;\n        $this->email = $email; // never declared!\n    }\n}\n\n$c = new Contact("Ada", "ada@example.com");\necho "$c->name <$c->email>";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Contact\n{\n    public string $name;\n    public string $email;\n\n    public function __construct(string $name, string $email)\n    {\n        $this->name = $name;\n        $this->email = $email;\n    }\n}\n\n$c = new Contact("Ada", "ada@example.com");\necho "$c->name <$c->email>";\n`,
      },
      objectives: [
        {
          id: "clean",
          label: L("No deprecation, and it prints Ada <ada@example.com>", "Aucune dépréciation, et ça affiche Ada <ada@example.com>"),
          check: all(clean, outputIs("Ada <ada@example.com>")),
          hints: [
            L("The message names the property: `Contact::$email`. The class only declares `$name`.", "Le message nomme la propriété : `Contact::$email`. La classe ne déclare que `$name`."),
            L("Add `public string $email;` under `public string $name;`.", "Ajoute `public string $email;` sous `public string $name;`."),
            L("Or use promotion: `public function __construct(public string $name, public string $email) {}` and delete the body.", "Ou utilise la promotion : `public function __construct(public string $name, public string $email) {}` et supprime le corps."),
          ],
        },
      ],
      cheat: "php82",
    },
    {
      kind: "compare",
      title: L("readonly class on 8.1", "readonly class en 8.1"),
      body: L("`readonly class` is new syntax in 8.2. See how 8.1 reacts.", "`readonly class` est une nouvelle syntaxe en 8.2. Regarde comment réagit 8.1."),
      code: `<?php\nreadonly class Money {\n    public function __construct(public int $cents, public string $currency) {}\n}\n$m = new Money(999, "EUR");\necho $m->cents / 100, " ", $m->currency;\n`,
      versions: ["8.1", "8.2"],
      takeaway: L(
        "On 8.1 you had to write `readonly` on every property. 8.2 lets the class say it once.",
        "En 8.1, il fallait écrire `readonly` sur chaque propriété. 8.2 permet à la classe de le dire une fois.",
      ),
    },
    {
      kind: "challenge",
      title: L("Reproducible dice", "Des dés reproductibles"),
      body: L(
        "Make `Dice` a `readonly class`, give the trait `HasSides` the constant `public const SIDES = 6;`, and make `roll()` use a `Random\\Randomizer` with a `Random\\Engine\\Mt19937` seeded with `$this->seed`, returning `getInt(1, self::SIDES)`. Two dice with the same seed must roll the same number.",
        "Fais de `Dice` une `readonly class`, donne au trait `HasSides` la constante `public const SIDES = 6;`, et fais utiliser à `roll()` un `Random\\Randomizer` avec un `Random\\Engine\\Mt19937` initialisé avec `$this->seed`, qui renvoie `getInt(1, self::SIDES)`. Deux dés avec la même graine doivent donner le même nombre.",
      ),
      version: "8.2",
      files: {
        "index.php": `<?php\ntrait HasSides\n{\n    // Add the constant SIDES = 6 here (allowed since 8.2)\n}\n\nclass Dice\n{\n    use HasSides;\n\n    public function __construct(public int $seed) {}\n\n    public function roll(): int\n    {\n        return rand(1, 6); // not reproducible\n    }\n}\n\n$d = new Dice(42);\necho "Sides: " . Dice::SIDES . "\\n";\necho "Roll: " . $d->roll() . "\\n";\n`,
      },
      solution: {
        "index.php": `<?php\ntrait HasSides\n{\n    public const SIDES = 6;\n}\n\nreadonly class Dice\n{\n    use HasSides;\n\n    public function __construct(public int $seed) {}\n\n    public function roll(): int\n    {\n        $rng = new Random\\Randomizer(new Random\\Engine\\Mt19937($this->seed));\n        return $rng->getInt(1, self::SIDES);\n    }\n}\n\n$d = new Dice(42);\necho "Sides: " . Dice::SIDES . "\\n";\necho "Roll: " . $d->roll() . "\\n";\n`,
      },
      probes: ["(new Dice(7))->roll() === (new Dice(7))->roll()", "Dice::SIDES"],
      objectives: [
        {
          id: "trait-const",
          label: L("The trait declares SIDES = 6, and the script prints Sides: 6", "Le trait déclare SIDES = 6, et le script affiche Sides: 6"),
          check: all(uses(/trait\s+HasSides\s*\{[^}]*const\s+SIDES\s*=\s*6/), probeIs("Dice::SIDES", 6), outputLines(["Sides: 6"])),
          hints: [
            L("Before 8.2, traits couldn't have constants. Now they can, written like in a class.", "Avant 8.2, les traits ne pouvaient pas avoir de constantes. Maintenant si, écrites comme dans une classe."),
            L("Inside `trait HasSides { … }`: `public const SIDES = 6;`", "Dans `trait HasSides { … }` : `public const SIDES = 6;`"),
            L("Replace the comment in the trait with `public const SIDES = 6;`.", "Remplace le commentaire du trait par `public const SIDES = 6;`."),
          ],
        },
        {
          id: "readonly",
          label: L("Dice is a readonly class", "Dice est une readonly class"),
          check: uses(/readonly\s+(final\s+)?class\s+Dice|final\s+readonly\s+class\s+Dice/),
          hints: [
            L("The keyword goes before `class`.", "Le mot-clé se met avant `class`."),
            L("`readonly class Dice`", "`readonly class Dice`"),
            L("Change `class Dice` into `readonly class Dice`. The promoted `$seed` becomes readonly automatically.", "Change `class Dice` en `readonly class Dice`. Le `$seed` promu devient readonly automatiquement."),
          ],
        },
        {
          id: "random",
          label: L("roll() uses a seeded Randomizer: same seed, same roll", "roll() utilise un Randomizer avec graine : même graine, même lancer"),
          check: all(uses(/Randomizer/), uses(/Mt19937\s*\(\s*\$this->seed/), probeIs("(new Dice(7))->roll() === (new Dice(7))->roll()", true), (c) => /^Roll: [1-6]$/m.test(c.out), clean),
          hints: [
            L("A Randomizer needs an engine. `Mt19937` takes a seed: the same seed always gives the same sequence.", "Un Randomizer a besoin d'un moteur. `Mt19937` prend une graine : la même graine donne toujours la même suite."),
            L("`$rng = new Random\\Randomizer(new Random\\Engine\\Mt19937($this->seed));`", "`$rng = new Random\\Randomizer(new Random\\Engine\\Mt19937($this->seed));`"),
            L("In `roll()`: the line above, then `return $rng->getInt(1, self::SIDES);`", "Dans `roll()` : la ligne ci-dessus, puis `return $rng->getInt(1, self::SIDES);`"),
          ],
        },
      ],
      cheat: "php82",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`readonly class` makes every property readonly.", "`readonly class` rend toutes les propriétés readonly."),
    L("Dynamic properties are deprecated (except `stdClass` and `#[\\AllowDynamicProperties]`).", "Les propriétés dynamiques sont obsolètes (sauf `stdClass` et `#[\\AllowDynamicProperties]`)."),
    L("DNF types `(A&B)|null` and standalone `true`/`false`/`null` types.", "Types DNF `(A&B)|null` et types `true`/`false`/`null` seuls."),
    L("`Random\\Randomizer` with a seeded engine gives reproducible randomness; traits can hold constants.", "`Random\\Randomizer` avec un moteur à graine donne un hasard reproductible ; les traits peuvent avoir des constantes."),
  ],
};

// ───────────────────────────────────────────── PHP 8.3

export const php83: Lesson = {
  id: "php83",
  chapterId: CH,
  title: L("PHP 8.3: safety nets", "PHP 8.3 : des filets de sécurité"),
  tagline: L("#[\\Override], typed constants, json_validate and dynamic constant fetch", "#[\\Override], constantes typées, json_validate et accès dynamique aux constantes"),
  xp: 70,
  syntax: ["#[\\Override]", "const int X", "json_validate", "Foo::{$name}", "mb_str_pad"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("Small features, fewer bugs", "Petites nouveautés, moins de bugs"),
      body: [
        L(
          "PHP 8.3 (November 2023) is a quieter release focused on catching mistakes. **Typed class constants** (`const int MAX = 3;`) stop a child class from changing a constant's type. `json_validate()` checks JSON without decoding it.",
          "PHP 8.3 (novembre 2023) est une version plus calme, centrée sur la détection d'erreurs. Les **constantes de classe typées** (`const int MAX = 3;`) empêchent une classe enfant de changer le type d'une constante. `json_validate()` vérifie du JSON sans le décoder.",
        ),
        L(
          "You can now read a class constant whose name is in a variable with `Foo::{$name}`, use `mb_str_pad()` for multibyte text, and re-initialise readonly properties inside `__clone()` (handy for deep copies).",
          "Tu peux maintenant lire une constante de classe dont le nom est dans une variable avec `Foo::{$name}`, utiliser `mb_str_pad()` pour du texte multi-octets, et réinitialiser des propriétés readonly dans `__clone()` (pratique pour les copies profondes).",
        ),
      ],
      example: {
        version: "8.3",
        code: `<?php\nclass Color {\n    const string RED = "#ff0000";\n    const string BLUE = "#0000ff";\n}\n$name = "BLUE";\necho Color::{$name}, "\\n";\n\nvar_dump(json_validate('{"ok": true}'));\nvar_dump(json_validate('{ok: true}'));\n\necho mb_str_pad("Zoé", 6, "*"), "|\\n";\n`,
      },
    },
    {
      kind: "compare",
      title: L("#[\\Override] catches typos", "#[\\Override] attrape les fautes de frappe"),
      body: L(
        "The child class meant to replace `save()` but wrote `sav()`. Without help, PHP just adds a new method and the bug is silent. With `#[\\Override]`, PHP 8.3 checks that a parent method with that name really exists. On 8.2 the attribute is simply ignored.",
        "La classe enfant voulait remplacer `save()` mais a écrit `sav()`. Sans aide, PHP ajoute juste une nouvelle méthode et le bug est silencieux. Avec `#[\\Override]`, PHP 8.3 vérifie qu'une méthode parente de ce nom existe vraiment. En 8.2, l'attribut est simplement ignoré.",
      ),
      code: `<?php\nclass Repository {\n    public function save(): string { return "saved"; }\n}\nclass CachedRepository extends Repository {\n    #[\\Override]\n    public function sav(): string { return "saved + cached"; }\n}\necho (new CachedRepository())->save();\n`,
      versions: ["8.2", "8.3"],
      takeaway: L(
        "Attributes are ignored by versions that don't know them, so `#[\\Override]` is safe to add even if some servers still run older PHP. From 8.3, it turns a silent bug into a clear error.",
        "Les attributs sont ignorés par les versions qui ne les connaissent pas, donc `#[\\Override]` peut être ajouté sans risque même si des serveurs tournent encore sur un PHP plus ancien. À partir de 8.3, il transforme un bug silencieux en erreur claire.",
      ),
    },
    {
      kind: "compare",
      title: L("json_validate and typed constants", "json_validate et constantes typées"),
      body: L("Both arrived in 8.3. On 8.2, the typed constant doesn't even parse.", "Les deux sont arrivées en 8.3. En 8.2, la constante typée ne passe même pas l'analyse."),
      code: `<?php\nclass Api {\n    const int VERSION = 3;\n}\necho "API v", Api::VERSION, "\\n";\nvar_dump(json_validate('[1, 2, 3]'));\n`,
      versions: ["8.2", "8.3"],
      takeaway: L(
        "`json_validate()` is faster and lighter than `json_decode()` + error check when you only need a yes/no answer.",
        "`json_validate()` est plus rapide et plus léger que `json_decode()` + vérification d'erreur quand tu as juste besoin d'un oui ou non.",
      ),
    },
    {
      kind: "quiz",
      title: L("A constant from a variable", "Une constante depuis une variable"),
      question: L("On PHP 8.3, what does this print?", "En PHP 8.3, qu'affiche ce code ?"),
      version: "8.3",
      code: `<?php\nclass Size {\n    const S = 36;\n    const M = 40;\n}\n$pick = "M";\necho Size::{$pick};\n`,
      options: ["M", "40", "Size::M", "36"],
      answer: 1,
      explain: L(
        "`Size::{$pick}` reads the constant whose name is in `$pick`, here `M`, so it prints 40. Before 8.3 you had to write `constant(\"Size::$pick\")`.",
        "`Size::{$pick}` lit la constante dont le nom est dans `$pick`, ici `M`, donc ça affiche 40. Avant 8.3, il fallait écrire `constant(\"Size::$pick\")`.",
      ),
    },
    {
      kind: "try",
      title: L("Let #[\\Override] find the bug", "Laisse #[\\Override] trouver le bug"),
      body: L(
        "`SmsNotifier` should replace `send()`, but the output is still `email to Ada`. Add `#[\\Override]` above the child's method and run: PHP 8.3 tells you what's wrong. Then fix it so it prints `sms to Ada`.",
        "`SmsNotifier` devrait remplacer `send()`, mais la sortie est toujours `email to Ada`. Ajoute `#[\\Override]` au-dessus de la méthode de l'enfant et exécute : PHP 8.3 te dit ce qui cloche. Corrige ensuite pour afficher `sms to Ada`.",
      ),
      version: "8.3",
      files: {
        "index.php": `<?php\nclass Notifier\n{\n    public function send(string $to): string\n    {\n        return "email to $to";\n    }\n}\n\nclass SmsNotifier extends Notifier\n{\n    public function sned(string $to): string\n    {\n        return "sms to $to";\n    }\n}\n\necho (new SmsNotifier())->send("Ada");\n`,
      },
      solution: {
        "index.php": `<?php\nclass Notifier\n{\n    public function send(string $to): string\n    {\n        return "email to $to";\n    }\n}\n\nclass SmsNotifier extends Notifier\n{\n    #[\\Override]\n    public function send(string $to): string\n    {\n        return "sms to $to";\n    }\n}\n\necho (new SmsNotifier())->send("Ada");\n`,
      },
      objectives: [
        {
          id: "override",
          label: L("Mark the method with #[\\Override] and print sms to Ada", "Marquer la méthode avec #[\\Override] et afficher sms to Ada"),
          check: all(uses(/#\[\s*\\?Override\s*\]/), outputIs("sms to Ada")),
          hints: [
            L("An attribute goes on its own line just above the method: `#[\\Override]`.", "Un attribut se place sur sa propre ligne juste au-dessus de la méthode : `#[\\Override]`."),
            L("Run it: the fatal error says `sned()` has no matching parent method. Compare with the parent's name.", "Exécute : l'erreur fatale dit que `sned()` n'a pas de méthode parente correspondante. Compare avec le nom du parent."),
            L("Add `#[\\Override]` above the method and rename `sned` to `send`.", "Ajoute `#[\\Override]` au-dessus de la méthode et renomme `sned` en `send`."),
          ],
        },
      ],
      cheat: "php83",
    },
    {
      kind: "challenge",
      title: L("Validate incoming JSON", "Valide du JSON entrant"),
      body: L(
        "Three payloads arrive, one is broken. Give the constants a type (`const int`), skip invalid JSON with `json_validate()` (print `#1 invalid`), and read the limit with `Limits::{$key}`. Expected: `#0 ok`, `#1 invalid`, `#2 too many`, and no warnings.",
        "Trois charges utiles arrivent, une est cassée. Donne un type aux constantes (`const int`), ignore le JSON invalide avec `json_validate()` (affiche `#1 invalid`), et lis la limite avec `Limits::{$key}`. Attendu : `#0 ok`, `#1 invalid`, `#2 too many`, et aucun avertissement.",
      ),
      version: "8.3",
      files: {
        "index.php": `<?php\nclass Limits\n{\n    const MAX_ITEMS = 3;\n    const MAX_NAME = 10;\n}\n\n$payloads = ['{"items": 2}', '{items: 5}', '{"items": 9}'];\n$key = "MAX_ITEMS";\n\nforeach ($payloads as $i => $json) {\n    $data = json_decode($json, true);\n    $max = constant("Limits::$key");\n    echo "#$i " . ($data["items"] <= $max ? "ok" : "too many") . "\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass Limits\n{\n    const int MAX_ITEMS = 3;\n    const int MAX_NAME = 10;\n}\n\n$payloads = ['{"items": 2}', '{items: 5}', '{"items": 9}'];\n$key = "MAX_ITEMS";\n\nforeach ($payloads as $i => $json) {\n    if (!json_validate($json)) {\n        echo "#$i invalid\\n";\n        continue;\n    }\n    $data = json_decode($json, true);\n    $max = Limits::{$key};\n    echo "#$i " . ($data["items"] <= $max ? "ok" : "too many") . "\\n";\n}\n`,
      },
      objectives: [
        {
          id: "typed",
          label: L("Both constants are typed as int", "Les deux constantes sont typées int"),
          check: (c) => (c.code.match(/const\s+int\s+MAX_/g) ?? []).length >= 2,
          hints: [
            L("The type goes between `const` and the name.", "Le type se met entre `const` et le nom."),
            L("`const int MAX_ITEMS = 3;`", "`const int MAX_ITEMS = 3;`"),
            L("Write `const int` for both `MAX_ITEMS` and `MAX_NAME`.", "Écris `const int` pour `MAX_ITEMS` et `MAX_NAME`."),
          ],
        },
        {
          id: "validate",
          label: L("Skip invalid JSON with json_validate()", "Ignorer le JSON invalide avec json_validate()"),
          check: all(uses(/json_validate\s*\(/), outputLines(["#0 ok", "#1 invalid", "#2 too many"]), clean),
          hints: [
            L("Right now the broken payload decodes to null, and reading `[\"items\"]` on null gives a warning.", "Pour l'instant, la charge cassée se décode en null, et lire `[\"items\"]` sur null donne un avertissement."),
            L("At the start of the loop: `if (!json_validate($json)) { echo \"#$i invalid\\n\"; continue; }`", "Au début de la boucle : `if (!json_validate($json)) { echo \"#$i invalid\\n\"; continue; }`"),
            L("Add the `if` above before `json_decode`. `continue` jumps to the next payload.", "Ajoute le `if` ci-dessus avant `json_decode`. `continue` passe à la charge suivante."),
          ],
        },
        {
          id: "dynamic",
          label: L("Read the limit with Limits::{$key}", "Lire la limite avec Limits::{$key}"),
          check: all(uses(/Limits::\{\s*\$key\s*\}/), avoids(/constant\s*\(/)),
          hints: [
            L("8.3 lets you put a variable in braces after `::`.", "8.3 permet de mettre une variable entre accolades après `::`."),
            L("`$max = Limits::{$key};`", "`$max = Limits::{$key};`"),
            L("Replace `constant(\"Limits::$key\")` with `Limits::{$key}`.", "Remplace `constant(\"Limits::$key\")` par `Limits::{$key}`."),
          ],
        },
      ],
      cheat: "php83",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`#[\\Override]` makes PHP check that you really override a parent method.", "`#[\\Override]` fait vérifier à PHP que tu redéfinis vraiment une méthode parente."),
    L("Class constants can be typed: `const int MAX = 3;`.", "Les constantes de classe peuvent être typées : `const int MAX = 3;`."),
    L("`json_validate()` checks JSON without decoding it.", "`json_validate()` vérifie du JSON sans le décoder."),
    L("`Foo::{$name}` reads a constant by name; `mb_str_pad()` pads multibyte text.", "`Foo::{$name}` lit une constante par son nom ; `mb_str_pad()` complète du texte multi-octets."),
  ],
};

// ───────────────────────────────────────────── PHP 8.4

export const php84: Lesson = {
  id: "php84",
  chapterId: CH,
  title: L("PHP 8.4: property hooks", "PHP 8.4 : les hooks de propriétés"),
  tagline: L("Hooks, asymmetric visibility, array_find and new without parentheses", "Hooks, visibilité asymétrique, array_find et new sans parenthèses"),
  xp: 70,
  syntax: ["{ get => … }", "{ set => … }", "public private(set)", "new Foo()->bar()", "array_find", "array_any", "array_all", "#[\\Deprecated]"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("Goodbye, getters and setters", "Adieu, getters et setters"),
      body: [
        L(
          "For decades, PHP classes were full of `getEmail()` / `setEmail()` methods that only existed in case some logic was needed one day. PHP 8.4 (November 2024) adds **property hooks**: logic attached directly to a property.",
          "Pendant des décennies, les classes PHP étaient pleines de méthodes `getEmail()` / `setEmail()` qui n'existaient qu'au cas où une logique serait nécessaire un jour. PHP 8.4 (novembre 2024) ajoute les **hooks de propriétés** : de la logique attachée directement à une propriété.",
        ),
        L(
          "A `set` hook runs when the property is assigned (the new value is `$value`), a `get` hook runs when it's read. A property with only a `get` hook that doesn't use its own value is **virtual**: it's computed every time.",
          "Un hook `set` s'exécute quand la propriété est affectée (la nouvelle valeur est `$value`), un hook `get` quand elle est lue. Une propriété avec seulement un hook `get` qui n'utilise pas sa propre valeur est **virtuelle** : elle est calculée à chaque fois.",
        ),
      ],
      example: {
        version: "8.4",
        code: `<?php\nclass Temperature {\n    public function __construct(public float $celsius) {}\n\n    // virtual property: computed on every read\n    public float $fahrenheit {\n        get => $this->celsius * 9 / 5 + 32;\n    }\n}\n\nclass User {\n    public string $name {\n        set => ucfirst(strtolower($value));\n    }\n}\n\n$t = new Temperature(100);\necho $t->fahrenheit, "\\n";\n\n$u = new User();\n$u->name = "aDA";\necho $u->name, "\\n";\n`,
      },
    },
    {
      kind: "discover",
      title: L("More 8.4 conveniences", "D'autres commodités de 8.4"),
      body: [
        L(
          "**Asymmetric visibility**: `public private(set) int $count` can be read from anywhere but changed only inside the class. No more private property + public getter.",
          "**Visibilité asymétrique** : `public private(set) int $count` se lit de partout mais ne se modifie qu'à l'intérieur de la classe. Fini la propriété privée + le getter public.",
        ),
        L(
          "`new Foo()->bar()` works without wrapping parentheses. `array_find()`, `array_find_key()`, `array_any()` and `array_all()` replace many hand-written loops. `mb_trim()` and `mb_ucfirst()` handle accents. `#[\\Deprecated]` marks your own functions as deprecated.",
          "`new Foo()->bar()` marche sans parenthèses autour. `array_find()`, `array_find_key()`, `array_any()` et `array_all()` remplacent beaucoup de boucles écrites à la main. `mb_trim()` et `mb_ucfirst()` gèrent les accents. `#[\\Deprecated]` marque tes propres fonctions comme obsolètes.",
        ),
      ],
      example: {
        version: "8.4",
        code: `<?php\nclass Counter {\n    public private(set) int $count = 0;\n    public function hit(): static { $this->count++; return $this; }\n}\n$c = new Counter()->hit()->hit();\necho $c->count, "\\n";\ntry {\n    $c->count = 99;\n} catch (Error $e) {\n    echo $e->getMessage(), "\\n";\n}\n\n$ages = [12, 17, 21, 30];\nvar_dump(array_find($ages, fn($a) => $a >= 18));\nvar_dump(array_any($ages, fn($a) => $a < 13));\nvar_dump(array_all($ages, fn($a) => $a > 10));\n\necho mb_ucfirst("élodie"), "\\n";\n`,
      },
    },
    {
      kind: "compare",
      title: L("Loops you no longer write", "Des boucles que tu n'écris plus"),
      body: L(
        "`array_find()` and chaining on `new` without parentheses. On 8.3, the chaining alone is a parse error.",
        "`array_find()` et le chaînage sur `new` sans parenthèses. En 8.3, le chaînage seul est déjà une erreur d'analyse.",
      ),
      code: `<?php\nclass Shelf {\n    public function books(): array { return ["Dune", "Emma", "Ulysses"]; }\n}\n$long = array_find(new Shelf()->books(), fn($b) => strlen($b) > 5);\necho $long;\n`,
      versions: ["8.3", "8.4"],
      takeaway: L(
        "`array_find` returns the first matching value (or null). Before 8.4: a `foreach` with a `break`, or `array_filter` + `reset`.",
        "`array_find` renvoie la première valeur qui correspond (ou null). Avant 8.4 : un `foreach` avec un `break`, ou `array_filter` + `reset`.",
      ),
    },
    {
      kind: "compare",
      title: L("Implicitly nullable parameters", "Paramètres implicitement nullables"),
      body: L(
        "`string $s = null` used to mean \"string or null\" implicitly. 8.4 deprecates it: write the type you mean, `?string $s = null`.",
        "`string $s = null` voulait dire implicitement « chaîne ou null ». 8.4 rend cela obsolète : écris le type que tu veux dire, `?string $s = null`.",
      ),
      code: `<?php\nfunction greet(string $name = null): string {\n    return "Hello " . ($name ?? "stranger");\n}\necho greet();\n`,
      versions: ["8.3", "8.4"],
      takeaway: L(
        "Same output, a new *Deprecated* message. The fix is one character: `?string`.",
        "Même sortie, un nouveau message *Deprecated*. La correction tient en un caractère : `?string`.",
      ),
    },
    {
      kind: "quiz",
      title: L("A virtual property", "Une propriété virtuelle"),
      question: L("On PHP 8.4, what does this print?", "En PHP 8.4, qu'affiche ce code ?"),
      version: "8.4",
      code: `<?php\nclass Rect {\n    public function __construct(public int $w, public int $h) {}\n    public int $area {\n        get => $this->w * $this->h;\n    }\n}\n$r = new Rect(3, 4);\n$r->w = 5;\necho $r->area;\n`,
      options: ["12", "20", "15", "Error"],
      answer: 1,
      explain: L(
        "`area` has no stored value: its `get` hook computes it at each read. After `$r->w = 5`, the area is 5 × 4 = 20.",
        "`area` n'a pas de valeur stockée : son hook `get` la calcule à chaque lecture. Après `$r->w = 5`, l'aire vaut 5 × 4 = 20.",
      ),
    },
    {
      kind: "try",
      title: L("Replace a setter with a hook", "Remplace un setter par un hook"),
      body: L(
        "Replace `setEmail()` / `getEmail()` with a public property `$email` that has a `set` hook: `strtolower(trim($value))`. Then assign it directly: `$u->email = \"  Ada@Example.COM \";` and print `$u->email`. Expected: `ada@example.com`.",
        "Remplace `setEmail()` / `getEmail()` par une propriété publique `$email` avec un hook `set` : `strtolower(trim($value))`. Affecte-la ensuite directement : `$u->email = \"  Ada@Example.COM \";` et affiche `$u->email`. Attendu : `ada@example.com`.",
      ),
      version: "8.4",
      files: {
        "index.php": `<?php\nclass User\n{\n    private string $email = "";\n\n    public function setEmail(string $email): void\n    {\n        $this->email = strtolower(trim($email));\n    }\n\n    public function getEmail(): string\n    {\n        return $this->email;\n    }\n}\n\n$u = new User();\n$u->setEmail("  Ada@Example.COM ");\necho $u->getEmail();\n`,
      },
      solution: {
        "index.php": `<?php\nclass User\n{\n    public string $email = "" {\n        set => strtolower(trim($value));\n    }\n}\n\n$u = new User();\n$u->email = "  Ada@Example.COM ";\necho $u->email;\n`,
      },
      probes: ["(function () { $u = new User(); $u->email = ' X@Y.Z '; return $u->email; })()"],
      objectives: [
        {
          id: "hook",
          label: L("$email has a set hook, and no setter method is left", "$email a un hook set, et il ne reste aucune méthode setter"),
          check: all(uses(/public\s+string\s+\$email[^;{]*\{\s*set\b/), avoids(/function\s+setEmail/), probeIs("(function () { $u = new User(); $u->email = ' X@Y.Z '; return $u->email; })()", "x@y.z")),
          hints: [
            L("A hook is a block `{ … }` right after the property, instead of a semicolon.", "Un hook est un bloc `{ … }` juste après la propriété, à la place du point-virgule."),
            L("`public string $email = \"\" { set => strtolower(trim($value)); }`", "`public string $email = \"\" { set => strtolower(trim($value)); }`"),
            L("Replace the private property and both methods with the line above.", "Remplace la propriété privée et les deux méthodes par la ligne ci-dessus."),
          ],
        },
        {
          id: "use",
          label: L("Assign and read $u->email directly; prints ada@example.com", "Affecter et lire $u->email directement ; affiche ada@example.com"),
          check: all(uses(/\$u->email\s*=/), outputIs("ada@example.com")),
          hints: [
            L("The calls to `setEmail()` and `getEmail()` must go too.", "Les appels à `setEmail()` et `getEmail()` doivent partir aussi."),
            L("`$u->email = \"  Ada@Example.COM \";` then `echo $u->email;`", "`$u->email = \"  Ada@Example.COM \";` puis `echo $u->email;`"),
            L("The hook cleans the value as it's assigned: reading it gives the cleaned version.", "Le hook nettoie la valeur au moment de l'affectation : la lire donne la version nettoyée."),
          ],
        },
      ],
      cheat: "php84",
    },
    {
      kind: "challenge",
      title: L("A leaner shopping cart", "Un panier plus léger"),
      body: L(
        "Modernise the cart for 8.4: make `$items` `public private(set)` and delete `getItems()`, build the cart with `new Cart()->add(…)` (no extra parentheses), and replace the two loops with `array_find()` and `array_any()`. Same output: `First expensive: Lamp`, `Has cheap: yes`.",
        "Modernise le panier pour 8.4 : rends `$items` `public private(set)` et supprime `getItems()`, construis le panier avec `new Cart()->add(…)` (sans parenthèses en plus), et remplace les deux boucles par `array_find()` et `array_any()`. Même sortie : `First expensive: Lamp`, `Has cheap: yes`.",
      ),
      version: "8.4",
      files: {
        "index.php": `<?php\nclass Cart\n{\n    private array $items = [];\n\n    public function add(string $name, int $price): static\n    {\n        $this->items[] = ['name' => $name, 'price' => $price];\n        return $this;\n    }\n\n    public function getItems(): array\n    {\n        return $this->items;\n    }\n}\n\n$cart = (new Cart())->add("Book", 15)->add("Pen", 2)->add("Lamp", 40);\n\n$expensive = null;\nforeach ($cart->getItems() as $item) {\n    if ($item['price'] > 20) {\n        $expensive = $item;\n        break;\n    }\n}\n\n$hasCheap = false;\nforeach ($cart->getItems() as $item) {\n    if ($item['price'] < 5) {\n        $hasCheap = true;\n    }\n}\n\necho "First expensive: " . $expensive['name'] . "\\n";\necho "Has cheap: " . ($hasCheap ? "yes" : "no") . "\\n";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Cart\n{\n    public private(set) array $items = [];\n\n    public function add(string $name, int $price): static\n    {\n        $this->items[] = ['name' => $name, 'price' => $price];\n        return $this;\n    }\n}\n\n$cart = new Cart()->add("Book", 15)->add("Pen", 2)->add("Lamp", 40);\n\n$expensive = array_find($cart->items, fn($item) => $item['price'] > 20);\n$hasCheap = array_any($cart->items, fn($item) => $item['price'] < 5);\n\necho "First expensive: " . $expensive['name'] . "\\n";\necho "Has cheap: " . ($hasCheap ? "yes" : "no") . "\\n";\n`,
      },
      probes: ["(function () { $c = new Cart(); $c->items = []; })()", "count((new Cart())->add('A', 1)->items)"],
      objectives: [
        {
          id: "asym",
          label: L("$items is public private(set), getItems() is gone", "$items est public private(set), getItems() a disparu"),
          check: all(uses(/public\s+private\(set\)\s+array\s+\$items/), avoids(/function\s+getItems/), probeIs("count((new Cart())->add('A', 1)->items)", 1), probeThrows("(function () { $c = new Cart(); $c->items = []; })()", "Error")),
          hints: [
            L("Asymmetric visibility: the first keyword is for reading, the one with `(set)` is for writing.", "Visibilité asymétrique : le premier mot-clé est pour la lecture, celui avec `(set)` pour l'écriture."),
            L("`public private(set) array $items = [];` then read `$cart->items` directly.", "`public private(set) array $items = [];` puis lis `$cart->items` directement."),
            L("Change the property declaration, delete `getItems()`, and replace every `$cart->getItems()` with `$cart->items`.", "Change la déclaration de la propriété, supprime `getItems()`, et remplace chaque `$cart->getItems()` par `$cart->items`."),
          ],
        },
        {
          id: "new",
          label: L("Chain on new Cart() without wrapping parentheses", "Chaîner sur new Cart() sans parenthèses autour"),
          check: all(uses(/=\s*new\s+Cart\s*\(\s*\)\s*->/), avoids(/\(\s*new\s+Cart/)),
          hints: [
            L("Since 8.4, `new Foo()->method()` works directly.", "Depuis 8.4, `new Foo()->method()` marche directement."),
            L("Remove the parentheses around `new Cart()`.", "Retire les parenthèses autour de `new Cart()`."),
            L("`$cart = new Cart()->add(\"Book\", 15)->add(\"Pen\", 2)->add(\"Lamp\", 40);`", "`$cart = new Cart()->add(\"Book\", 15)->add(\"Pen\", 2)->add(\"Lamp\", 40);`"),
          ],
        },
        {
          id: "find",
          label: L("Use array_find() and array_any() instead of the loops, same output", "Utiliser array_find() et array_any() au lieu des boucles, même sortie"),
          check: all(uses(/array_find\s*\(/), uses(/array_any\s*\(/), avoids(/\bforeach\b/), outputLines(["First expensive: Lamp", "Has cheap: yes"]), clean),
          hints: [
            L("Both take the array and a function that returns true or false for one item.", "Les deux prennent le tableau et une fonction qui renvoie vrai ou faux pour un élément."),
            L("`array_find($cart->items, fn($item) => $item['price'] > 20)` returns the first item over 20.", "`array_find($cart->items, fn($item) => $item['price'] > 20)` renvoie le premier élément au-dessus de 20."),
            L("`$expensive = array_find($cart->items, fn($item) => $item['price'] > 20);` and `$hasCheap = array_any($cart->items, fn($item) => $item['price'] < 5);`", "`$expensive = array_find($cart->items, fn($item) => $item['price'] > 20);` et `$hasCheap = array_any($cart->items, fn($item) => $item['price'] < 5);`"),
          ],
        },
      ],
      cheat: "php84",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Property hooks (`get`, `set`) replace most getters and setters.", "Les hooks de propriétés (`get`, `set`) remplacent la plupart des getters et setters."),
    L("`public private(set)`: readable everywhere, writable only inside the class.", "`public private(set)` : lisible partout, modifiable seulement dans la classe."),
    L("`new Foo()->bar()`, `array_find`, `array_any`, `array_all`, `mb_trim`, `mb_ucfirst`.", "`new Foo()->bar()`, `array_find`, `array_any`, `array_all`, `mb_trim`, `mb_ucfirst`."),
    L("`string $s = null` is deprecated: write `?string $s = null`.", "`string $s = null` est obsolète : écris `?string $s = null`."),
  ],
};

// ───────────────────────────────────────────── PHP 8.5

export const php85: Lesson = {
  id: "php85",
  chapterId: CH,
  title: L("PHP 8.5: the pipe operator", "PHP 8.5 : l'opérateur pipe"),
  tagline: L("|>, clone with, array_first, #[\\NoDiscard] and the URI extension", "|>, clone avec modifications, array_first, #[\\NoDiscard] et l'extension URI"),
  xp: 70,
  syntax: ["|>", "clone($obj, [...])", "array_first", "array_last", "#[\\NoDiscard]", "(void)", "Uri\\Rfc3986\\Uri"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("Read code in the order it runs", "Lire le code dans l'ordre où il s'exécute"),
      body: [
        L(
          "Nested calls like `ucwords(strtolower(trim($s)))` read inside out: the first thing that happens is in the middle. PHP 8.5 (November 2025) adds the **pipe operator** `|>`: the value on the left is passed to the callable on the right, step after step, left to right.",
          "Des appels imbriqués comme `ucwords(strtolower(trim($s)))` se lisent de l'intérieur vers l'extérieur : la première chose qui se passe est au milieu. PHP 8.5 (novembre 2025) ajoute l'**opérateur pipe** `|>` : la valeur de gauche est passée au callable de droite, étape par étape, de gauche à droite.",
        ),
        L(
          "Each step must be a callable that takes one argument: `trim(...)` (first-class callable syntax from 8.1) or an arrow function in parentheses `(fn($x) => …)`.",
          "Chaque étape doit être un callable qui prend un argument : `trim(...)` (la syntaxe de callable de première classe de 8.1) ou une fonction fléchée entre parenthèses `(fn($x) => …)`.",
        ),
      ],
      example: {
        version: "8.5",
        code: `<?php\n$title = "  the PIPE operator  "\n    |> trim(...)\n    |> strtolower(...)\n    |> ucwords(...);\necho $title, "\\n";\n\n$total = [3, 1, 2]\n    |> (fn($a) => array_map(fn($x) => $x * 10, $a))\n    |> array_sum(...);\necho $total, "\\n";\n`,
      },
    },
    {
      kind: "compare",
      title: L("|> before 8.5", "|> avant 8.5"),
      body: L("On 8.4 the parser has never seen `|>`.", "En 8.4, l'analyseur n'a jamais vu `|>`."),
      code: `<?php\n$slug = "Hello PHP World" |> strtolower(...) |> (fn($s) => str_replace(" ", "-", $s));\necho $slug;\n`,
      versions: ["8.4", "8.5"],
      takeaway: L(
        "A parse error on 8.4, `hello-php-world` on 8.5. If your code must run on older servers, keep the nested calls for now.",
        "Une erreur d'analyse en 8.4, `hello-php-world` en 8.5. Si ton code doit tourner sur des serveurs plus anciens, garde les appels imbriqués pour l'instant.",
      ),
    },
    {
      kind: "discover",
      title: L("Clone with, array_first, NoDiscard and more", "Clone avec modifications, array_first, NoDiscard et plus"),
      body: [
        L(
          "**Clone with**: `clone($obj, ['x' => 10])` copies an object and changes some properties, even readonly ones (from inside the class). \"Withers\" on immutable objects become one line.",
          "**Clone avec modifications** : `clone($obj, ['x' => 10])` copie un objet et change certaines propriétés, même readonly (depuis l'intérieur de la classe). Les « withers » des objets immuables tiennent en une ligne.",
        ),
        L(
          "`array_first()` and `array_last()` return the first and last value of any array (or null if empty), without moving its internal pointer like `reset()` and `end()` did. `#[\\NoDiscard]` warns when a caller ignores a return value that matters; `(void)` says \"I ignore it on purpose\".",
          "`array_first()` et `array_last()` renvoient la première et la dernière valeur de n'importe quel tableau (ou null s'il est vide), sans déplacer son pointeur interne comme `reset()` et `end()`. `#[\\NoDiscard]` avertit quand un appelant ignore une valeur de retour importante ; `(void)` dit « je l'ignore exprès ».",
        ),
        L(
          "The new **URI extension** parses URLs following the standards (`Uri\\Rfc3986\\Uri`, `Uri\\WhatWg\\Url`), and closures can now be used in constant expressions.",
          "La nouvelle **extension URI** analyse les URL selon les standards (`Uri\\Rfc3986\\Uri`, `Uri\\WhatWg\\Url`), et les closures peuvent désormais servir dans les expressions constantes.",
        ),
      ],
      example: {
        version: "8.5",
        code: `<?php\nfinal readonly class Point {\n    public function __construct(public int $x, public int $y) {}\n    public function withX(int $x): static {\n        return clone($this, ['x' => $x]);\n    }\n}\n$a = new Point(1, 2);\n$b = $a->withX(10);\necho "a=($a->x,$a->y) b=($b->x,$b->y)\\n";\n\n$scores = ["ada" => 12, "bob" => 7, "cy" => 30];\necho array_first($scores), " ", array_last($scores), "\\n";\nvar_dump(array_first([]));\n\n$uri = new Uri\\Rfc3986\\Uri("https://example.com:8080/docs?page=2");\necho $uri->getHost(), " ", $uri->getPort(), " ", $uri->getPath(), "\\n";\n\nclass Format {\n    const DOUBLE = static function (int $n): int { return $n * 2; };\n}\necho (Format::DOUBLE)(21), "\\n";\n`,
      },
    },
    {
      kind: "compare",
      title: L("New deprecations in 8.5", "Nouvelles dépréciations en 8.5"),
      body: L(
        "Each release also cleans up. 8.5 deprecates non-canonical cast names like `(boolean)` and `(integer)` (use `(bool)` and `(int)`), and the backtick operator for shell commands. Compare 8.4 and 8.5.",
        "Chaque version fait aussi le ménage. 8.5 rend obsolètes les noms de cast non canoniques comme `(boolean)` et `(integer)` (utilise `(bool)` et `(int)`), et l'opérateur backtick pour les commandes shell. Compare 8.4 et 8.5.",
      ),
      code: `<?php\n$active = (boolean) 1;\n$count = (integer) "42";\nvar_dump($active, $count);\n`,
      versions: ["8.4", "8.5"],
      takeaway: L(
        "Same values, new *Deprecated* messages: a reminder to switch to `(bool)` and `(int)` before PHP 9.",
        "Mêmes valeurs, nouveaux messages *Deprecated* : un rappel de passer à `(bool)` et `(int)` avant PHP 9.",
      ),
    },
    {
      kind: "quiz",
      title: L("Follow the pipe", "Suis le pipe"),
      question: L("On PHP 8.5, what does this print?", "En PHP 8.5, qu'affiche ce code ?"),
      version: "8.5",
      code: `<?php\necho "  hello " |> trim(...) |> strtoupper(...) |> strrev(...);\n`,
      options: ["HELLO", "OLLEH", "olleh", "  OLLEH "],
      answer: 1,
      explain: L(
        "Left to right: trim gives `hello`, strtoupper gives `HELLO`, strrev reverses it: `OLLEH`.",
        "De gauche à droite : trim donne `hello`, strtoupper donne `HELLO`, strrev l'inverse : `OLLEH`.",
      ),
    },
    {
      kind: "try",
      title: L("Untangle nested calls", "Démêle des appels imbriqués"),
      body: L(
        "Rewrite the nested calls as a pipeline: `$input |> trim(...) |> strtolower(...) |> ucwords(...)`, store it in `$title`, then `echo $title . \"!\";`. The output must stay `Hello, Php World!`.",
        "Réécris les appels imbriqués en pipeline : `$input |> trim(...) |> strtolower(...) |> ucwords(...)`, range le résultat dans `$title`, puis `echo $title . \"!\";`. La sortie doit rester `Hello, Php World!`.",
      ),
      version: "8.5",
      files: { "index.php": `<?php\n$input = "   hello, PHP world   ";\n\n// Read it inside out: trim, then strtolower, then ucwords.\necho ucwords(strtolower(trim($input))) . "!";\n` },
      solution: { "index.php": `<?php\n$input = "   hello, PHP world   ";\n\n$title = $input\n    |> trim(...)\n    |> strtolower(...)\n    |> ucwords(...);\necho $title . "!";\n` },
      objectives: [
        {
          id: "pipe",
          label: L("Use at least three |> steps, same output", "Utiliser au moins trois étapes |>, même sortie"),
          check: all((c) => (c.code.match(/\|>/g) ?? []).length >= 3, outputIs("Hello, Php World!")),
          hints: [
            L("Start from `$input` and add one `|>` per function, in the order they run.", "Pars de `$input` et ajoute un `|>` par fonction, dans l'ordre où elles s'exécutent."),
            L("`trim(...)` with three dots turns the function into a callable the pipe can use.", "`trim(...)` avec trois points transforme la fonction en callable utilisable par le pipe."),
            L("`$title = $input |> trim(...) |> strtolower(...) |> ucwords(...);` then `echo $title . \"!\";`", "`$title = $input |> trim(...) |> strtolower(...) |> ucwords(...);` puis `echo $title . \"!\";`"),
          ],
        },
      ],
      cheat: "php85",
    },
    {
      kind: "challenge",
      title: L("Immutable settings history", "Un historique de réglages immuable"),
      body: L(
        "Modernise `Settings` for 8.5: make `withTheme()` use `clone($this, ['theme' => $theme])`, mark it `#[\\NoDiscard]` (forgetting the result is a bug), and replace `reset()`/`end()` with `array_first()`/`array_last()`. Same output: `First: light 14`, `Last: sepia 14`.",
        "Modernise `Settings` pour 8.5 : fais utiliser à `withTheme()` `clone($this, ['theme' => $theme])`, marque-la `#[\\NoDiscard]` (oublier le résultat est un bug), et remplace `reset()`/`end()` par `array_first()`/`array_last()`. Même sortie : `First: light 14`, `Last: sepia 14`.",
      ),
      version: "8.5",
      files: {
        "index.php": `<?php\nfinal class Settings\n{\n    public function __construct(\n        public readonly string $theme,\n        public readonly int $fontSize,\n    ) {}\n\n    public function withTheme(string $theme): static\n    {\n        // Before 8.5: copy every property by hand.\n        return new static($theme, $this->fontSize);\n    }\n}\n\n$history = [new Settings("light", 14)];\n$history[] = $history[count($history) - 1]->withTheme("dark");\n$history[] = $history[count($history) - 1]->withTheme("sepia");\n\n$first = reset($history);\n$last = end($history);\necho "First: {$first->theme} {$first->fontSize}\\n";\necho "Last: {$last->theme} {$last->fontSize}\\n";\n`,
      },
      solution: {
        "index.php": `<?php\nfinal class Settings\n{\n    public function __construct(\n        public readonly string $theme,\n        public readonly int $fontSize,\n    ) {}\n\n    #[\\NoDiscard("withTheme() returns a new object; it doesn't change this one")]\n    public function withTheme(string $theme): static\n    {\n        return clone($this, ['theme' => $theme]);\n    }\n}\n\n$history = [new Settings("light", 14)];\n$history[] = array_last($history)->withTheme("dark");\n$history[] = array_last($history)->withTheme("sepia");\n\n$first = array_first($history);\n$last = array_last($history);\necho "First: {$first->theme} {$first->fontSize}\\n";\necho "Last: {$last->theme} {$last->fontSize}\\n";\n`,
      },
      probes: ["(new Settings('a', 9))->withTheme('b')->fontSize"],
      objectives: [
        {
          id: "clone",
          label: L("withTheme() uses clone with", "withTheme() utilise clone avec modifications"),
          check: all(uses(/clone\s*\(\s*\$this\s*,\s*\[/), avoids(/new\s+static\s*\(/), probeIs("(new Settings('a', 9))->withTheme('b')->fontSize", 9)),
          hints: [
            L("`clone($object, [property => new value])` copies everything else for you.", "`clone($objet, [propriété => nouvelle valeur])` copie tout le reste pour toi."),
            L("Inside the class, readonly properties can be changed this way.", "Depuis l'intérieur de la classe, les propriétés readonly peuvent être changées ainsi."),
            L("`return clone($this, ['theme' => $theme]);`", "`return clone($this, ['theme' => $theme]);`"),
          ],
        },
        {
          id: "nodiscard",
          label: L("withTheme() is marked #[\\NoDiscard]", "withTheme() est marquée #[\\NoDiscard]"),
          check: uses(/#\[\s*\\?NoDiscard\b[^\]]*\]\s*public\s+function\s+withTheme/),
          hints: [
            L("An attribute goes on the line just above the method.", "Un attribut se place sur la ligne juste au-dessus de la méthode."),
            L("`#[\\NoDiscard]` or with a message: `#[\\NoDiscard(\"returns a new object\")]`.", "`#[\\NoDiscard]` ou avec un message : `#[\\NoDiscard(\"returns a new object\")]`."),
            L("Put `#[\\NoDiscard]` right above `public function withTheme`.", "Mets `#[\\NoDiscard]` juste au-dessus de `public function withTheme`."),
          ],
        },
        {
          id: "first-last",
          label: L("Use array_first() and array_last(), same output", "Utiliser array_first() et array_last(), même sortie"),
          check: all(uses(/array_first\s*\(/), uses(/array_last\s*\(/), avoids(/\b(reset|end)\s*\(/), outputLines(["First: light 14", "Last: sepia 14"]), clean),
          hints: [
            L("`array_first($history)` and `array_last($history)` don't move the array's pointer, unlike `reset` and `end`.", "`array_first($history)` et `array_last($history)` ne déplacent pas le pointeur du tableau, contrairement à `reset` et `end`."),
            L("`array_last($history)` also replaces `$history[count($history) - 1]`.", "`array_last($history)` remplace aussi `$history[count($history) - 1]`."),
            L("`$first = array_first($history);` and `$last = array_last($history);`", "`$first = array_first($history);` et `$last = array_last($history);`"),
          ],
        },
      ],
      cheat: "php85",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("The pipe `|>` passes a value through callables, left to right.", "Le pipe `|>` fait passer une valeur dans des callables, de gauche à droite."),
    L("`clone($obj, ['x' => 1])` copies an object with changes, even readonly ones.", "`clone($obj, ['x' => 1])` copie un objet avec des modifications, même readonly."),
    L("`array_first()` / `array_last()`, `#[\\NoDiscard]` + `(void)`, and the URI extension.", "`array_first()` / `array_last()`, `#[\\NoDiscard]` + `(void)`, et l'extension URI."),
    L("8.5 deprecates `(boolean)`, `(integer)` and the backtick operator.", "8.5 rend obsolètes `(boolean)`, `(integer)` et l'opérateur backtick."),
  ],
};

// ───────────────────────────────────────────── Boss: migrate a legacy script

const LEGACY = `<?php
class Order
{
    private $id;
    private $status;
    private $customer;

    public function __construct($id, $status, $customer = null)
    {
        $this->id = $id;
        $this->status = $status;
        $this->customer = $customer;
    }

    public function getId() { return $this->id; }
    public function getStatus() { return $this->status; }
    public function getCustomer() { return $this->customer; }
}

class Customer
{
    private $email;

    public function __construct($email)
    {
        $this->email = $email;
    }

    public function getEmail() { return $this->email; }
}

function statusLabel($status)
{
    switch ($status) {
        case 'new':
            return 'New';
        case 'paid':
            return 'Paid';
        case 'shipped':
            return 'Shipped';
        default:
            return 'Cancelled';
    }
}

$orders = [
    new Order(1, 'paid', new Customer(' ada@example.com ')),
    new Order(2, 'new'),
    new Order(3, 'shipped', new Customer('linus@kernel.org')),
    new Order(4, 'cancelled', new Customer('bob@example.com')),
];

$visible = array_filter($orders, function ($o) {
    return $o->getStatus() !== 'cancelled';
});

foreach ($visible as $order) {
    $email = $order->getCustomer() !== null ? $order->getCustomer()->getEmail() : 'guest';
    $vip = strpos($email, '@example.com') !== false ? ' (VIP)' : '';
    echo '#' . $order->getId() . ' ' . statusLabel($order->getStatus()) . ' ' . strtoupper(trim($email)) . $vip . "\\n";
}
`;

const MODERN = `<?php
enum Status: string
{
    case New = 'new';
    case Paid = 'paid';
    case Shipped = 'shipped';
    case Cancelled = 'cancelled';

    public function label(): string
    {
        return match ($this) {
            Status::New => 'New',
            Status::Paid => 'Paid',
            Status::Shipped => 'Shipped',
            Status::Cancelled => 'Cancelled',
        };
    }
}

final readonly class Customer
{
    public function __construct(public string $email) {}
}

final readonly class Order
{
    public function __construct(
        public int $id,
        public Status $status,
        public ?Customer $customer = null,
    ) {}
}

$orders = [
    new Order(1, Status::Paid, new Customer(' ada@example.com ')),
    new Order(2, Status::New),
    new Order(3, Status::Shipped, new Customer('linus@kernel.org')),
    new Order(4, Status::Cancelled, new Customer('bob@example.com')),
];

$visible = array_filter($orders, fn(Order $o) => $o->status !== Status::Cancelled);

foreach ($visible as $order) {
    $email = $order->customer?->email ?? 'guest';
    $vip = str_contains($email, '@example.com') ? ' (VIP)' : '';
    $shown = $email |> trim(...) |> strtoupper(...);
    echo "#{$order->id} {$order->status->label()} {$shown}{$vip}\\n";
}
`;

export const bossMigrate: Lesson = {
  id: "boss-migrate",
  chapterId: CH,
  title: L("Boss: migrate to PHP 8.5", "Boss : migre vers PHP 8.5"),
  tagline: L("Take a PHP 7 script and bring it to 8.5, without changing what it prints", "Prends un script PHP 7 et amène-le en 8.5, sans changer ce qu'il affiche"),
  xp: 150,
  boss: true,
  syntax: ["enum", "readonly", "match", "?->", "??", "str_contains", "fn", "|>"],
  doc: "guide-versions",
  steps: [
    {
      kind: "discover",
      title: L("How to migrate safely", "Comment migrer sans risque"),
      body: [
        L(
          "Real migrations are not rewrites. Professionals follow a loop: **run the code and note the output**, change one thing, **run again and compare**. If the output changes, the last change is the culprit.",
          "Les vraies migrations ne sont pas des réécritures. Les pros suivent une boucle : **exécuter le code et noter la sortie**, changer une seule chose, **exécuter à nouveau et comparer**. Si la sortie change, le dernier changement est le coupable.",
        ),
        L(
          "A good order: fix deprecations first, then check loose comparisons (`==` between numbers and strings changed in 8.0), then modernise: promotion and readonly, enums for fixed lists, `match` for `switch`, `?->` and `??` for null checks, `str_contains()` for `strpos() !== false`, arrow functions, and pipes where they make code clearer.",
          "Un bon ordre : corriger d'abord les dépréciations, puis vérifier les comparaisons lâches (`==` entre nombres et chaînes a changé en 8.0), puis moderniser : promotion et readonly, enums pour les listes fixes, `match` pour `switch`, `?->` et `??` pour les vérifications de null, `str_contains()` pour `strpos() !== false`, fonctions fléchées, et pipes là où ils rendent le code plus clair.",
        ),
      ],
      callout: {
        tone: "tip",
        text: L(
          "In a real project, tools like Rector automate many of these changes, and tests tell you if behaviour changed. Here, the output is your test.",
          "Dans un vrai projet, des outils comme Rector automatisent beaucoup de ces changements, et les tests te disent si le comportement a changé. Ici, la sortie est ton test.",
        ),
      },
    },
    {
      kind: "compare",
      title: L("The silent trap: loose comparisons", "Le piège silencieux : les comparaisons lâches"),
      body: L(
        "Before modernising anything, run old code on both versions. This stock report uses `==` against the word `'none'`. Look at apples, whose quantity is 0.",
        "Avant de moderniser quoi que ce soit, exécute le vieux code sur les deux versions. Ce rapport de stock utilise `==` contre le mot `'none'`. Regarde les pommes, dont la quantité vaut 0.",
      ),
      code: `<?php\n$stock = ['apples' => 0, 'pears' => 'none', 'kiwis' => 4];\nforeach ($stock as $fruit => $qty) {\n    if ($qty == 'none') {\n        echo "$fruit: not tracked\\n";\n        continue;\n    }\n    echo "$fruit: $qty\\n";\n}\n`,
      versions: ["7.4", "8.5"],
      takeaway: L(
        "On 7.4, `0 == 'none'` was true, so apples were \"not tracked\". On 8.x they show `0`. No error, no warning: only comparing outputs reveals it. Prefer `===`.",
        "En 7.4, `0 == 'none'` était vrai, donc les pommes étaient « not tracked ». En 8.x, elles affichent `0`. Pas d'erreur, pas d'avertissement : seule la comparaison des sorties le révèle. Préfère `===`.",
      ),
    },
    {
      kind: "quiz",
      title: L("Spot the replacement", "Trouve le remplaçant"),
      question: L("On PHP 8.5, what does this print?", "En PHP 8.5, qu'affiche ce code ?"),
      version: "8.5",
      code: `<?php\n$email = "ada@example.com";\nvar_dump(strpos($email, "ada") !== false, str_contains($email, "ada"), strpos($email, "ada") == true);\n`,
      options: ["bool(true)\nbool(true)\nbool(false)", "bool(true)\nbool(true)\nbool(true)", "bool(false)\nbool(true)\nbool(false)", "int(0)\nbool(true)\nbool(false)"],
      answer: 0,
      explain: L(
        "\"ada\" is found at position 0. `!== false` handles that correctly, `str_contains` too. But `0 == true` is false: that's the classic `strpos` bug that `str_contains()` (8.0) makes impossible.",
        "\"ada\" est trouvé à la position 0. `!== false` le gère correctement, `str_contains` aussi. Mais `0 == true` est faux : c'est le bug classique de `strpos` que `str_contains()` (8.0) rend impossible.",
      ),
    },
    {
      kind: "challenge",
      title: L("Bring the order report to PHP 8.5", "Amène le rapport de commandes en PHP 8.5"),
      body: L(
        "This script was written for PHP 7. Modernise it for 8.5 without changing a single character of its output. Run it first to see the expected result, then change one thing at a time. Each objective is one family of changes.",
        "Ce script a été écrit pour PHP 7. Modernise-le pour 8.5 sans changer un seul caractère de sa sortie. Exécute-le d'abord pour voir le résultat attendu, puis change une chose à la fois. Chaque objectif est une famille de changements.",
      ),
      version: "8.5",
      files: { "index.php": LEGACY },
      solution: { "index.php": MODERN },
      objectives: [
        {
          id: "output",
          label: L("Same output as the original, with no warnings", "Même sortie que l'original, sans avertissement"),
          check: all(clean, outputIs("#1 Paid ADA@EXAMPLE.COM (VIP)\n#2 New GUEST\n#3 Shipped LINUS@KERNEL.ORG")),
          hints: [
            L("The original prints three lines: orders 1, 2 and 3 (4 is cancelled). Keep checking after each change.", "L'original affiche trois lignes : les commandes 1, 2 et 3 (la 4 est annulée). Vérifie après chaque changement."),
            L("Expected: `#1 Paid ADA@EXAMPLE.COM (VIP)`, `#2 New GUEST`, `#3 Shipped LINUS@KERNEL.ORG`.", "Attendu : `#1 Paid ADA@EXAMPLE.COM (VIP)`, `#2 New GUEST`, `#3 Shipped LINUS@KERNEL.ORG`."),
            L("If a line changed, undo your last change (Ctrl+Z) and redo it more carefully. Interpolate method calls as `{$order->status->label()}`.", "Si une ligne a changé, annule ton dernier changement (Ctrl+Z) et refais-le plus prudemment. Interpole les appels de méthode ainsi : `{$order->status->label()}`."),
          ],
        },
        {
          id: "match",
          label: L("switch is replaced by match", "switch est remplacé par match"),
          check: all(uses(/\bmatch\s*\(/), avoids(/\bswitch\s*\(/)),
          hints: [
            L("`statusLabel()` is a `switch` that returns a string for each value: a perfect `match`.", "`statusLabel()` est un `switch` qui renvoie une chaîne pour chaque valeur : un `match` parfait."),
            L("`return match ($status) { 'new' => 'New', 'paid' => 'Paid', 'shipped' => 'Shipped', default => 'Cancelled' };`", "`return match ($status) { 'new' => 'New', 'paid' => 'Paid', 'shipped' => 'Shipped', default => 'Cancelled' };`"),
            L("Even better: an enum `Status` with a `label()` method that does `match ($this)`.", "Encore mieux : une enum `Status` avec une méthode `label()` qui fait `match ($this)`."),
          ],
        },
        {
          id: "classes",
          label: L("Constructors use promotion, with readonly properties or an enum", "Les constructeurs utilisent la promotion, avec des propriétés readonly ou une enum"),
          check: all((c) => (c.code.match(/__construct\s*\(\s*(public|private|protected|readonly)\b/g) ?? []).length >= 2, any(uses(/\breadonly\b/), uses(/\benum\s+\w+/))),
          hints: [
            L("Both classes only store values: promote their constructor parameters.", "Les deux classes ne font que stocker des valeurs : promeus les paramètres de leurs constructeurs."),
            L("`final readonly class Customer { public function __construct(public string $email) {} }`, then read `$customer->email` directly.", "`final readonly class Customer { public function __construct(public string $email) {} }`, puis lis `$customer->email` directement."),
            L("Order: `public function __construct(public int $id, public Status $status, public ?Customer $customer = null) {}` in a `readonly class`; remove the getters and update the calls.", "Order : `public function __construct(public int $id, public Status $status, public ?Customer $customer = null) {}` dans une `readonly class` ; supprime les getters et mets à jour les appels."),
          ],
        },
        {
          id: "null",
          label: L("The null check uses ?-> and ??", "La vérification de null utilise ?-> et ??"),
          check: all(uses(/\?->/), uses(/\?\?/)),
          hints: [
            L("The ternary `!== null ? … : 'guest'` is exactly what `?->` plus `??` express.", "Le ternaire `!== null ? … : 'guest'` est exactement ce qu'expriment `?->` et `??`."),
            L("`$order->getCustomer()?->getEmail() ?? 'guest'`", "`$order->getCustomer()?->getEmail() ?? 'guest'`"),
            L("With promoted public properties: `$email = $order->customer?->email ?? 'guest';`", "Avec des propriétés publiques promues : `$email = $order->customer?->email ?? 'guest';`"),
          ],
        },
        {
          id: "functions",
          label: L("str_contains, an arrow function and a pipe |>", "str_contains, une fonction fléchée et un pipe |>"),
          check: all(uses(/str_contains\s*\(/), avoids(/strpos\s*\(/), uses(/\bfn\s*\(/), uses(/\|>/)),
          hints: [
            L("Three small swaps: `strpos(...) !== false`, the `function ($o) { return …; }` callback, and the nested `strtoupper(trim($email))`.", "Trois petits échanges : `strpos(...) !== false`, le callback `function ($o) { return …; }`, et l'imbrication `strtoupper(trim($email))`."),
            L("`str_contains($email, '@example.com')`, `fn($o) => …`, `$email |> trim(...) |> strtoupper(...)`.", "`str_contains($email, '@example.com')`, `fn($o) => …`, `$email |> trim(...) |> strtoupper(...)`."),
            L("`$shown = $email |> trim(...) |> strtoupper(...);` then use `$shown` in the echo.", "`$shown = $email |> trim(...) |> strtoupper(...);` puis utilise `$shown` dans le echo."),
          ],
        },
      ],
      cheat: "php85",
    },
    {
      kind: "compare",
      title: L("Your migration, on every version", "Ta migration, sur chaque version"),
      body: L(
        "Here is one possible modern version of the script. Run it on 8.4 and 8.5: one operator is enough to require PHP 8.5. That's the trade-off of using the newest features.",
        "Voici une version moderne possible du script. Exécute-la en 8.4 et en 8.5 : un seul opérateur suffit à exiger PHP 8.5. C'est le prix à payer pour utiliser les nouveautés.",
      ),
      code: MODERN,
      versions: ["8.4", "8.5"],
      takeaway: L(
        "Choose features based on where your code runs. A library supporting 8.2+ can't use hooks or pipes; an app you deploy on 8.5 can use everything.",
        "Choisis les nouveautés selon l'endroit où ton code tourne. Une bibliothèque qui supporte 8.2+ ne peut pas utiliser les hooks ni les pipes ; une application que tu déploies en 8.5 peut tout utiliser.",
      ),
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Migrate in small steps: run, change one thing, compare the output.", "Migre par petites étapes : exécute, change une chose, compare la sortie."),
    L("Check loose `==` comparisons first: 8.0 changed them silently.", "Vérifie d'abord les comparaisons lâches `==` : 8.0 les a changées en silence."),
    L("Promotion, readonly, enums, match, ?->, ??, str_contains, fn and |> make PHP 7 code shorter and safer.", "Promotion, readonly, enums, match, ?->, ??, str_contains, fn et |> rendent le code PHP 7 plus court et plus sûr."),
    L("Newer features set a minimum PHP version: pick them based on where the code runs.", "Les nouveautés fixent une version minimale de PHP : choisis-les selon l'endroit où le code tourne."),
  ],
};

export const VERSIONS: Lesson[] = [php7Recap, php80, php81, php82, php83, php84, php85, bossMigrate];
