import { L } from "@/lib/txt";
import { all, clean, outputIs, outputLines, probeIs, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "arrays";

/** Non-empty output lines, trimmed. */
const lines = (out: string) =>
  out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

export const arrayBasics: Lesson = {
  id: "array-basics",
  chapterId: CH,
  title: L("Lists of values", "Des listes de valeurs"),
  tagline: L("Indexed arrays: create, read, add and count", "Les tableaux indexés : créer, lire, ajouter et compter"),
  xp: 50,
  syntax: ["[ ]", "$list[0]", "$list[] =", "count", "print_r"],
  doc: "guide-arrays",
  steps: [
    {
      kind: "discover",
      title: L("One variable, many values", "Une variable, plusieurs valeurs"),
      body: [
        L(
          "A shopping list, the players of a game, the lines of a file: programs constantly deal with **lists**. Instead of `$fruit1`, `$fruit2`, `$fruit3`…, an **array** stores all of them in one variable.",
          "Une liste de courses, les joueurs d'une partie, les lignes d'un fichier : les programmes manipulent sans cesse des **listes**. Au lieu de `$fruit1`, `$fruit2`, `$fruit3`…, un **tableau** les range toutes dans une seule variable.",
        ),
        L(
          "Write an array with square brackets: `[\"apple\", \"pear\", \"kiwi\"]`. Each item gets a number called its **index** (or key). Indexes **start at 0**: the first item is `$fruits[0]`, the second `$fruits[1]`.",
          "Un tableau s'écrit entre crochets : `[\"apple\", \"pear\", \"kiwi\"]`. Chaque élément reçoit un numéro appelé **index** (ou clé). Les index **commencent à 0** : le premier élément est `$fruits[0]`, le deuxième `$fruits[1]`.",
        ),
      ],
      scene: "array",
      example: {
        code: `<?php\n$fruits = ["apple", "pear", "kiwi"];\necho $fruits[0], "\\n";\necho $fruits[2], "\\n";\necho count($fruits), " fruits\\n";\nprint_r($fruits);\n`,
        caption: L("print_r() shows a whole array with its indexes: perfect for debugging.", "print_r() affiche un tableau entier avec ses index : parfait pour déboguer."),
      },
    },
    {
      kind: "discover",
      title: L("Add, change, count", "Ajouter, modifier, compter"),
      body: [
        L(
          "`$list[] = value;` (empty brackets) **appends** an item at the end. `$list[1] = value;` **replaces** the item at index 1. `count($list)` tells how many items there are.",
          "`$list[] = valeur;` (crochets vides) **ajoute** un élément à la fin. `$list[1] = valeur;` **remplace** l'élément à l'index 1. `count($list)` dit combien il y a d'éléments.",
        ),
        L(
          "Because indexes start at 0, the last item is at `count($list) - 1`. Forgetting the `- 1` is the famous **off-by-one** bug.",
          "Comme les index commencent à 0, le dernier élément est à `count($list) - 1`. Oublier le `- 1`, c'est le fameux bug **off-by-one** (décalage de un).",
        ),
      ],
      example: {
        code: `<?php\n$todo = ["Wake up", "Code"];\n$todo[] = "Eat";\n$todo[1] = "Code in PHP";\necho count($todo), " tasks\\n";\necho "Last: ", $todo[count($todo) - 1], "\\n";\nvar_dump($todo);\n`,
      },
    },
    {
      kind: "watch",
      title: L("Watch an array grow", "Regarde un tableau grandir"),
      body: L(
        "Step through and watch `$scores` in the Variables panel: each `[] =` adds a box at the next free index.",
        "Avance pas à pas et surveille `$scores` dans le panneau Variables : chaque `[] =` ajoute une case au prochain index libre.",
      ),
      code: `<?php\n$scores = [];\n$scores[] = 12;\n$scores[] = 7;\n$scores[] = 20;\n$scores[0] = 15;\n$best = $scores[2];\necho count($scores), " scores, best: $best";\n`,
      notes: {
        2: L("An empty array: zero items.", "Un tableau vide : zéro élément."),
        3: L("12 goes to index 0, the first free index.", "12 va à l'index 0, le premier index libre."),
        5: L("20 lands at index 2: the third item.", "20 arrive à l'index 2 : le troisième élément."),
        6: L("This replaces the item at index 0 (12 becomes 15). No new item is added.", "Ceci remplace l'élément à l'index 0 (12 devient 15). Aucun élément n'est ajouté."),
        7: L("Reading index 2 gives 20.", "Lire l'index 2 donne 20."),
      },
    },
    {
      kind: "quiz",
      title: L("Which item?", "Quel élément ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$a = [10, 20, 30];\necho $a[1];\n`,
      options: ["10", "20", "30", "1"],
      answer: 1,
      explain: L(
        "Indexes start at 0: `$a[0]` is 10, `$a[1]` is 20, `$a[2]` is 30.",
        "Les index commencent à 0 : `$a[0]` vaut 10, `$a[1]` vaut 20, `$a[2]` vaut 30.",
      ),
    },
    {
      kind: "discover",
      title: L("Reading outside the list", "Lire en dehors de la liste"),
      body: [
        L(
          "Reading an index that doesn't exist gives a **warning**, and the value is `null`. The script keeps running with a wrong value, which is worse than stopping: always check the Problems tab.",
          "Lire un index qui n'existe pas donne un **avertissement**, et la valeur vaut `null`. Le script continue avec une mauvaise valeur, ce qui est pire que de s'arrêter : regarde toujours l'onglet Problèmes.",
        ),
      ],
      example: { code: `<?php\n$colors = ["red", "green", "blue"];\n$c = $colors[3];\nvar_dump($c);\necho "count: ", count($colors);\n` },
      callout: {
        tone: "version",
        text: L(
          "PHP 7.4 called it `Notice: Undefined offset: 3`. PHP 8 raised it to `Warning: Undefined array key 3`. Try both versions with the version picker.",
          "PHP 7.4 l'appelait `Notice: Undefined offset: 3`. PHP 8 l'a passé en `Warning: Undefined array key 3`. Essaie les deux versions avec le sélecteur de version.",
        ),
      },
    },
    {
      kind: "try",
      title: L("Your playlist", "Ta playlist"),
      body: L(
        "Add `\"Hey Jude\"` at the end of `$songs` (without retyping the list), then print `3 songs` using `count()`, and on a second line `First: Imagine`.",
        "Ajoute `\"Hey Jude\"` à la fin de `$songs` (sans réécrire la liste), puis affiche `3 songs` avec `count()`, et sur une deuxième ligne `First: Imagine`.",
      ),
      files: { "index.php": `<?php\n$songs = ["Imagine", "Yesterday"];\n\n// 1. Add "Hey Jude" at the end\n// 2. Print "3 songs" with count()\n// 3. Print "First: " and the first song\n` },
      solution: {
        "index.php": `<?php\n$songs = ["Imagine", "Yesterday"];\n\n$songs[] = "Hey Jude";\necho count($songs) . " songs\\n";\necho "First: " . $songs[0];\n`,
      },
      probes: ["$GLOBALS['songs']"],
      objectives: [
        {
          id: "added",
          label: L("$songs ends with \"Hey Jude\" (3 songs)", "$songs se termine par « Hey Jude » (3 chansons)"),
          check: all(probeIs("$GLOBALS['songs']", ["Imagine", "Yesterday", "Hey Jude"]), uses(/\$songs\s*\[\s*\]\s*=/)),
          hints: [
            L("Empty brackets add at the end.", "Des crochets vides ajoutent à la fin."),
            L("`$songs[] = \"Hey Jude\";`", "`$songs[] = \"Hey Jude\";`"),
            L("Write `$songs[] = \"Hey Jude\";` on its own line after the list.", "Écris `$songs[] = \"Hey Jude\";` sur sa propre ligne après la liste."),
          ],
        },
        {
          id: "print",
          label: L("Print: 3 songs, then First: Imagine", "Afficher : 3 songs, puis First: Imagine"),
          check: all(outputLines(["3 songs", "First: Imagine"]), uses(/count\s*\(\s*\$songs\s*\)/)),
          hints: [
            L("`count()` gives the number of items; index 0 is the first one.", "`count()` donne le nombre d'éléments ; l'index 0 est le premier."),
            L("`echo count($songs) . \" songs\\n\";`", "`echo count($songs) . \" songs\\n\";`"),
            L("Then `echo \"First: \" . $songs[0];`", "Puis `echo \"First: \" . $songs[0];`"),
          ],
        },
      ],
      cheat: "arrays",
    },
    {
      kind: "challenge",
      title: L("The off-by-one bug", "Le bug du décalage de un"),
      body: L(
        "This script should print the first and last fruits, but it triggers a warning. Fix it so it runs cleanly and prints `First: Apple` then `Last: Cherry`. Bonus: it should still work if someone adds a fruit to the list.",
        "Ce script devrait afficher le premier et le dernier fruit, mais il déclenche un avertissement. Corrige-le pour qu'il tourne sans erreur et affiche `First: Apple` puis `Last: Cherry`. Bonus : il doit encore marcher si quelqu'un ajoute un fruit à la liste.",
      ),
      files: { "index.php": `<?php\n$fruits = ["Apple", "Banana", "Cherry"];\n\necho "First: " . $fruits[1] . "\\n";\necho "Last: " . $fruits[count($fruits)] . "\\n";\n` },
      solution: { "index.php": `<?php\n$fruits = ["Apple", "Banana", "Cherry"];\n\necho "First: " . $fruits[0] . "\\n";\necho "Last: " . $fruits[count($fruits) - 1] . "\\n";\n` },
      objectives: [
        {
          id: "first",
          label: L("Print: First: Apple", "Afficher : First: Apple"),
          check: (c) => lines(c.out)[0] === "First: Apple",
          hints: [
            L("Which index does the first item have?", "Quel index a le premier élément ?"),
            L("Indexes start at 0, not 1.", "Les index commencent à 0, pas à 1."),
            L("Use `$fruits[0]` on line 4.", "Utilise `$fruits[0]` ligne 4."),
          ],
        },
        {
          id: "last",
          label: L("Print: Last: Cherry, with no warning", "Afficher : Last: Cherry, sans avertissement"),
          check: all((c) => lines(c.out)[1] === "Last: Cherry", clean, uses(/count\s*\(\s*\$fruits\s*\)\s*-\s*1/)),
          hints: [
            L("With 3 items, the indexes are 0, 1 and 2. `count()` gives 3.", "Avec 3 éléments, les index sont 0, 1 et 2. `count()` donne 3."),
            L("The last index is always one less than the count.", "Le dernier index vaut toujours un de moins que le nombre d'éléments."),
            L("Use `$fruits[count($fruits) - 1]` on line 5.", "Utilise `$fruits[count($fruits) - 1]` ligne 5."),
          ],
        },
      ],
      cheat: "arrays",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("An array stores many values in one variable: `[\"a\", \"b\", \"c\"]`.", "Un tableau range plusieurs valeurs dans une variable : `[\"a\", \"b\", \"c\"]`."),
    L("Indexes start at 0; the last one is `count($list) - 1`.", "Les index commencent à 0 ; le dernier est `count($list) - 1`."),
    L("`$list[] = x` appends, `$list[i] = x` replaces.", "`$list[] = x` ajoute à la fin, `$list[i] = x` remplace."),
    L("Reading a missing index gives a warning and null. `print_r` and `var_dump` show the whole array.", "Lire un index absent donne un avertissement et null. `print_r` et `var_dump` montrent tout le tableau."),
  ],
};

export const assocArrays: Lesson = {
  id: "assoc-arrays",
  chapterId: CH,
  title: L("Keys and values", "Clés et valeurs"),
  tagline: L("Associative arrays, nested data and foreach with keys", "Tableaux associatifs, données imbriquées et foreach avec les clés"),
  xp: 50,
  syntax: ["\"key\" => value", "foreach ($a as $k => $v)", "isset", "array_key_exists", "print_r"],
  doc: "guide-arrays",
  steps: [
    {
      kind: "discover",
      title: L("Name your boxes", "Nomme tes cases"),
      body: [
        L(
          "Numbers are fine for lists, but a user has a name, an email and an age. Remembering that the email is at index 1 is error-prone. An **associative array** uses text keys instead: `\"email\" => \"ada@example.com\"`.",
          "Les numéros conviennent aux listes, mais un utilisateur a un nom, un email et un âge. Se souvenir que l'email est à l'index 1, c'est risqué. Un **tableau associatif** utilise des clés texte : `\"email\" => \"ada@example.com\"`.",
        ),
        L(
          "Read and write with the key in brackets: `$user[\"email\"]`. In PHP, lists and dictionaries are the same thing: an array is always an ordered map from keys to values.",
          "Lis et écris avec la clé entre crochets : `$user[\"email\"]`. En PHP, listes et dictionnaires sont la même chose : un tableau est toujours une table ordonnée de clés vers des valeurs.",
        ),
      ],
      scene: "array",
      example: {
        code: `<?php\n$user = [\n    "name" => "Ada",\n    "email" => "ada@example.com",\n    "age" => 36,\n];\necho $user["name"], " <", $user["email"], ">\\n";\n$user["age"] = 37;\n$user["city"] = "London";\nprint_r($user);\n`,
        caption: L("A trailing comma after the last item is allowed, and makes adding lines easier.", "Une virgule après le dernier élément est permise, et facilite l'ajout de lignes."),
      },
    },
    {
      kind: "discover",
      title: L("Nested data and missing keys", "Données imbriquées et clés absentes"),
      body: [
        L(
          "Values can be arrays themselves, so you can describe real data: a list of users, each with an address. Chain the brackets to dig in: `$users[0][\"address\"][\"city\"]`.",
          "Les valeurs peuvent elles-mêmes être des tableaux, pour décrire de vraies données : une liste d'utilisateurs, chacun avec une adresse. Enchaîne les crochets pour creuser : `$users[0][\"address\"][\"city\"]`.",
        ),
        L(
          "Before reading a key that may be missing, test it. `isset($a[\"k\"])` is true when the key exists **and** isn't null. `array_key_exists(\"k\", $a)` is true even when the value is null. `$a[\"k\"] ?? \"default\"` reads with a fallback.",
          "Avant de lire une clé qui peut manquer, teste-la. `isset($a[\"k\"])` est vrai si la clé existe **et** n'est pas null. `array_key_exists(\"k\", $a)` est vrai même si la valeur est null. `$a[\"k\"] ?? \"défaut\"` lit avec une valeur de secours.",
        ),
      ],
      example: {
        code: `<?php\n$order = [\n    "id" => 42,\n    "customer" => ["name" => "Lin", "city" => "Lyon"],\n    "coupon" => null,\n];\necho $order["customer"]["city"], "\\n";\nvar_dump(isset($order["coupon"]));\nvar_dump(array_key_exists("coupon", $order));\necho $order["note"] ?? "no note";\n`,
      },
    },
    {
      kind: "watch",
      title: L("foreach with keys", "foreach avec les clés"),
      body: L(
        "`foreach ($array as $key => $value)` gives you both the key and the value at each turn. Step through and watch `$item`, `$price` and `$total`.",
        "`foreach ($array as $key => $value)` te donne la clé et la valeur à chaque tour. Avance pas à pas et surveille `$item`, `$price` et `$total`.",
      ),
      code: `<?php\n$prices = ["coffee" => 3, "croissant" => 2, "juice" => 4];\n$total = 0;\nforeach ($prices as $item => $price) {\n    echo "$item: $price\\n";\n    $total += $price;\n}\necho "Total: $total";\n`,
      notes: {
        5: L("Each turn, $item is the key and $price the value.", "À chaque tour, $item est la clé et $price la valeur."),
        6: L("The running total grows: 3, then 5, then 9.", "Le total cumulé grandit : 3, puis 5, puis 9."),
        8: L("The loop ran once per key, in the order they were added.", "La boucle a tourné une fois par clé, dans l'ordre d'ajout."),
      },
    },
    {
      kind: "quiz",
      title: L("Count the keys", "Compte les clés"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$u = ["name" => "Ada", "age" => 36];\necho count($u), $u["name"];\n`,
      options: ["2Ada", "36Ada", "1Ada", "Ada2"],
      answer: 0,
      explain: L(
        "`count()` counts the pairs: 2. Then `$u[\"name\"]` is \"Ada\". echo prints them side by side.",
        "`count()` compte les paires : 2. Puis `$u[\"name\"]` vaut « Ada ». echo les affiche côte à côte.",
      ),
    },
    {
      kind: "try",
      title: L("Describe a user", "Décris un utilisateur"),
      body: L(
        "Create `$user` with three keys: `name` (a string), `email` (a string) and `age` (an int). Then print `Name: …` using the array.",
        "Crée `$user` avec trois clés : `name` (une chaîne), `email` (une chaîne) et `age` (un entier). Puis affiche `Name: …` en utilisant le tableau.",
      ),
      files: { "index.php": `<?php\n$user = [];\n\necho "Name: " . ($user["name"] ?? "?");\n` },
      solution: {
        "index.php": `<?php\n$user = [\n    "name" => "Grace",\n    "email" => "grace@example.com",\n    "age" => 85,\n];\n\necho "Name: " . ($user["name"] ?? "?");\n`,
      },
      probes: ["array_keys($GLOBALS['user'])", "is_string($GLOBALS['user']['name'] ?? null) && is_string($GLOBALS['user']['email'] ?? null) && is_int($GLOBALS['user']['age'] ?? null)"],
      objectives: [
        {
          id: "keys",
          label: L("$user has the keys name, email and age", "$user a les clés name, email et age"),
          check: probeIs("array_keys($GLOBALS['user'])", ["name", "email", "age"]),
          hints: [
            L("Each entry is written `\"key\" => value`, separated by commas.", "Chaque entrée s'écrit `\"clé\" => valeur`, séparée par des virgules."),
            L("`$user = [\"name\" => …, \"email\" => …, \"age\" => …];`", "`$user = [\"name\" => …, \"email\" => …, \"age\" => …];`"),
            L("Replace `$user = [];` with `$user = [\"name\" => \"Grace\", \"email\" => \"grace@example.com\", \"age\" => 85];`", "Remplace `$user = [];` par `$user = [\"name\" => \"Grace\", \"email\" => \"grace@example.com\", \"age\" => 85];`"),
          ],
        },
        {
          id: "types",
          label: L("name and email are strings, age is an int", "name et email sont des chaînes, age est un entier"),
          check: probeIs(
            "is_string($GLOBALS['user']['name'] ?? null) && is_string($GLOBALS['user']['email'] ?? null) && is_int($GLOBALS['user']['age'] ?? null)",
            true,
          ),
          hints: [
            L("Text in quotes, numbers without.", "Le texte entre guillemets, les nombres sans."),
            L("`\"age\" => 85` (not `\"85\"`).", "`\"age\" => 85` (pas `\"85\"`)."),
            L("Check the Variables panel: it shows each value's type.", "Regarde le panneau Variables : il montre le type de chaque valeur."),
          ],
        },
      ],
      cheat: "arrays",
    },
    {
      kind: "challenge",
      title: L("Stock report", "Rapport de stock"),
      body: L(
        "For each product, print `Name: value` where the value is price × quantity (so `Pen: 15`). Then print `Total: 95`. One product has no `qty` key: treat it as 0 without any warning.",
        "Pour chaque produit, affiche `Nom: valeur` où la valeur est prix × quantité (donc `Pen: 15`). Puis affiche `Total: 95`. Un produit n'a pas de clé `qty` : considère-la comme 0, sans aucun avertissement.",
      ),
      files: {
        "index.php": `<?php\n$products = [\n    ["name" => "Pen", "price" => 1.5, "qty" => 10],\n    ["name" => "Notebook", "price" => 4, "qty" => 20],\n    ["name" => "Stapler", "price" => 12],\n];\n\n`,
      },
      solution: {
        "index.php": `<?php\n$products = [\n    ["name" => "Pen", "price" => 1.5, "qty" => 10],\n    ["name" => "Notebook", "price" => 4, "qty" => 20],\n    ["name" => "Stapler", "price" => 12],\n];\n\n$total = 0;\nforeach ($products as $product) {\n    $value = $product["price"] * ($product["qty"] ?? 0);\n    echo $product["name"] . ": " . $value . "\\n";\n    $total += $value;\n}\necho "Total: $total";\n`,
      },
      objectives: [
        {
          id: "lines",
          label: L("Print Pen: 15, Notebook: 80 and Stapler: 0", "Afficher Pen: 15, Notebook: 80 et Stapler: 0"),
          check: all(outputLines(["Pen: 15", "Notebook: 80", "Stapler: 0"]), uses(/\bforeach\s*\(/)),
          hints: [
            L("Loop over `$products`; each item is itself an array with `name`, `price` and maybe `qty`.", "Boucle sur `$products` ; chaque élément est lui-même un tableau avec `name`, `price` et peut-être `qty`."),
            L("`foreach ($products as $product) { echo $product[\"name\"] . \": \" . … ; }`", "`foreach ($products as $product) { echo $product[\"name\"] . \": \" . … ; }`"),
            L("Compute `$value = $product[\"price\"] * ($product[\"qty\"] ?? 0);` then `echo $product[\"name\"] . \": \" . $value . \"\\n\";`", "Calcule `$value = $product[\"price\"] * ($product[\"qty\"] ?? 0);` puis `echo $product[\"name\"] . \": \" . $value . \"\\n\";`"),
          ],
        },
        {
          id: "total",
          label: L("Last line: Total: 95", "Dernière ligne : Total: 95"),
          check: (c) => lines(c.out).at(-1) === "Total: 95",
          hints: [
            L("Keep a running total, like in the watch step.", "Garde un total cumulé, comme dans l'étape d'observation."),
            L("`$total = 0;` before the loop, `$total += $value;` inside.", "`$total = 0;` avant la boucle, `$total += $value;` dedans."),
            L("After the loop: `echo \"Total: $total\";`", "Après la boucle : `echo \"Total: $total\";`"),
          ],
        },
        {
          id: "clean",
          label: L("No warning about the missing qty", "Aucun avertissement sur la qty manquante"),
          check: all(clean, (c) => c.out.trim() !== ""),
          hints: [
            L("Reading `$product[\"qty\"]` on the Stapler raises `Undefined array key`.", "Lire `$product[\"qty\"]` sur l'agrafeuse déclenche `Undefined array key`."),
            L("The `??` operator reads a key with a fallback when it's missing.", "L'opérateur `??` lit une clé avec une valeur de secours quand elle manque."),
            L("Use `($product[\"qty\"] ?? 0)` instead of `$product[\"qty\"]`.", "Utilise `($product[\"qty\"] ?? 0)` au lieu de `$product[\"qty\"]`."),
          ],
        },
      ],
      cheat: "arrays",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Associative arrays map keys to values: `[\"name\" => \"Ada\"]`.", "Les tableaux associatifs relient des clés à des valeurs : `[\"name\" => \"Ada\"]`."),
    L("Arrays nest: `$data[0][\"address\"][\"city\"]`.", "Les tableaux s'imbriquent : `$data[0][\"address\"][\"city\"]`."),
    L("`foreach ($a as $key => $value)` gives keys and values in insertion order.", "`foreach ($a as $clé => $valeur)` donne clés et valeurs dans l'ordre d'ajout."),
    L("`isset`, `array_key_exists` and `??` protect you from missing keys.", "`isset`, `array_key_exists` et `??` te protègent des clés absentes."),
  ],
};

export const arrayFunctions: Lesson = {
  id: "array-functions",
  chapterId: CH,
  title: L("Transform arrays", "Transformer des tableaux"),
  tagline: L("map, filter, reduce, sort and friends", "map, filter, reduce, le tri et compagnie"),
  xp: 50,
  syntax: ["array_map", "array_filter", "array_reduce", "array_sum", "in_array", "implode", "sort", "usort", "arsort"],
  doc: "guide-arrays",
  steps: [
    {
      kind: "discover",
      title: L("Say what, not how", "Dis quoi, pas comment"),
      body: [
        L(
          "Many loops do the same jobs: transform every item, keep some items, or combine them into one value. PHP has a function for each, and they make your intent obvious at a glance.",
          "Beaucoup de boucles font les mêmes travaux : transformer chaque élément, en garder certains, ou les combiner en une seule valeur. PHP a une fonction pour chacun, et elles rendent ton intention évidente d'un coup d'œil.",
        ),
        L(
          "`array_map(fn, $a)` returns a new array where each item went through `fn`. `array_filter($a, fn)` keeps the items for which `fn` returns true. The small function is often an **arrow function**: `fn($x) => $x * 2` (\"given x, give back x times 2\"). You'll study them in the functions chapter.",
          "`array_map(fn, $a)` renvoie un nouveau tableau où chaque élément est passé par `fn`. `array_filter($a, fn)` garde les éléments pour lesquels `fn` renvoie vrai. La petite fonction est souvent une **fonction fléchée** : `fn($x) => $x * 2` (« étant donné x, rends x fois 2 »). Tu les étudieras dans le chapitre sur les fonctions.",
        ),
      ],
      example: {
        code: `<?php\n$numbers = [1, 2, 3, 4, 5, 6];\n$doubled = array_map(fn($n) => $n * 2, $numbers);\n$even = array_filter($numbers, fn($n) => $n % 2 === 0);\necho implode(", ", $doubled), "\\n";\necho implode(", ", $even), "\\n";\nprint_r($even);\n`,
        caption: L("array_filter keeps the original keys (1, 3, 5). Wrap it in array_values() to renumber.", "array_filter garde les clés d'origine (1, 3, 5). Entoure-le de array_values() pour renuméroter."),
      },
    },
    {
      kind: "discover",
      title: L("Combine and search", "Combiner et chercher"),
      body: [
        L(
          "`array_reduce($a, fn, $start)` folds a whole array into one value, carrying a result from item to item. For the common cases there are shortcuts: `array_sum()`, `max()`, `min()`, `count()`.",
          "`array_reduce($a, fn, $départ)` réduit tout un tableau à une valeur, en transportant un résultat d'élément en élément. Pour les cas courants il y a des raccourcis : `array_sum()`, `max()`, `min()`, `count()`.",
        ),
        L(
          "`in_array($x, $a, true)` tells whether a value is there (pass `true` for a strict check). `array_keys()` and `array_values()` extract the keys or values, and `implode(\", \", $a)` glues items into a string (`explode()` does the reverse).",
          "`in_array($x, $a, true)` dit si une valeur est présente (passe `true` pour une vérification stricte). `array_keys()` et `array_values()` extraient les clés ou les valeurs, et `implode(\", \", $a)` colle les éléments en une chaîne (`explode()` fait l'inverse).",
        ),
      ],
      example: {
        code: `<?php\n$cart = [12, 5, 30];\n$total = array_reduce($cart, fn($carry, $price) => $carry + $price, 0);\necho $total, " = ", array_sum($cart), "\\n";\necho "Max: ", max($cart), "\\n";\n\n$tags = ["php", "web", "backend"];\nvar_dump(in_array("web", $tags, true));\necho implode(" #", $tags), "\\n";\nprint_r(explode(",", "a,b,c"));\n`,
      },
    },
    {
      kind: "discover",
      title: L("Sorting", "Trier"),
      body: [
        L(
          "`sort()` sorts values from small to big and renumbers the keys; `rsort()` sorts in reverse. `asort()` / `arsort()` sort by value but **keep the keys**, and `ksort()` sorts by key. For custom orders, `usort($a, fn($x, $y) => …)` uses your comparison, usually with the spaceship `<=>`.",
          "`sort()` trie les valeurs de la plus petite à la plus grande et renumérote les clés ; `rsort()` trie à l'envers. `asort()` / `arsort()` trient par valeur mais **gardent les clés**, et `ksort()` trie par clé. Pour un ordre personnalisé, `usort($a, fn($x, $y) => …)` utilise ta comparaison, souvent avec le vaisseau `<=>`.",
        ),
        L(
          "Unlike `array_map`, the sort functions **change the array you pass** and return only `true`. Writing `$sorted = sort($list);` is a classic mistake.",
          "Contrairement à `array_map`, les fonctions de tri **modifient le tableau que tu passes** et ne renvoient que `true`. Écrire `$sorted = sort($list);` est une erreur classique.",
        ),
      ],
      example: {
        code: `<?php\n$ages = ["Ada" => 36, "Linus" => 21, "Grace" => 85];\nasort($ages);\nprint_r($ages);\n\n$words = ["kiwi", "fig", "banana"];\nusort($words, fn($a, $b) => strlen($a) <=> strlen($b));\necho implode(", ", $words);\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "Since PHP 8.0, sorting is **stable**: items that compare equal keep their original order. In PHP 7 their order could change.",
          "Depuis PHP 8.0, le tri est **stable** : les éléments égaux gardent leur ordre d'origine. En PHP 7, leur ordre pouvait changer.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("The sort trap", "Le piège du tri"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$n = [3, 1, 2];\n$sorted = sort($n);\nvar_dump($sorted);\n`,
      options: ["bool(true)", "array(3) { [0]=> int(1) [1]=> int(2) [2]=> int(3) }", "NULL", "int(3)"],
      answer: 0,
      explain: L(
        "`sort()` sorts `$n` in place and returns `true`. The sorted values are in `$n`, not in `$sorted`.",
        "`sort()` trie `$n` sur place et renvoie `true`. Les valeurs triées sont dans `$n`, pas dans `$sorted`.",
      ),
    },
    {
      kind: "try",
      title: L("Prices with tax", "Prix TTC"),
      body: L(
        "Keep only the prices above 10 with `array_filter`, add 20% tax to them with `array_map` (× 1.2), then print them joined with `, `. Expected: `14.4, 54, 36`.",
        "Garde seulement les prix supérieurs à 10 avec `array_filter`, ajoute-leur 20 % de taxe avec `array_map` (× 1.2), puis affiche-les séparés par `, `. Attendu : `14.4, 54, 36`.",
      ),
      files: { "index.php": `<?php\n$prices = [12, 45, 7, 30];\n\n$expensive = $prices; // keep prices > 10\n$withTax = $expensive; // multiply by 1.2\n\necho implode(", ", $withTax);\n` },
      solution: {
        "index.php": `<?php\n$prices = [12, 45, 7, 30];\n\n$expensive = array_filter($prices, fn($p) => $p > 10);\n$withTax = array_map(fn($p) => $p * 1.2, $expensive);\n\necho implode(", ", $withTax);\n`,
      },
      objectives: [
        {
          id: "tax",
          label: L("Print 14.4, 54, 36 using array_filter and array_map", "Afficher 14.4, 54, 36 avec array_filter et array_map"),
          check: all(outputIs("14.4, 54, 36"), uses(/array_filter\s*\(/), uses(/array_map\s*\(/)),
          hints: [
            L("First filter (keep some items), then map (transform each kept item).", "D'abord filtrer (garder certains éléments), puis mapper (transformer chaque élément gardé)."),
            L("`array_filter($prices, fn($p) => $p > 10)` and `array_map(fn($p) => $p * 1.2, $expensive)`.", "`array_filter($prices, fn($p) => $p > 10)` et `array_map(fn($p) => $p * 1.2, $expensive)`."),
            L("Note the argument order: array_filter takes the array first, array_map takes the function first.", "Attention à l'ordre des arguments : array_filter prend le tableau d'abord, array_map prend la fonction d'abord."),
          ],
        },
      ],
      cheat: "array-functions",
    },
    {
      kind: "challenge",
      title: L("Leaderboard", "Classement"),
      body: L(
        "Sort the players by score, best first, keeping their names, and print the top 3 as `1. ben (95)`. Players with the same score keep the order of the list. Then print `Average: 87.5`.",
        "Trie les joueurs par score, du meilleur au moins bon, en gardant leurs noms, et affiche le top 3 sous la forme `1. ben (95)`. Les joueurs à égalité gardent l'ordre de la liste. Puis affiche `Average: 87.5`.",
      ),
      files: { "index.php": `<?php\n$scores = ["ana" => 82, "ben" => 95, "chloe" => 78, "dev" => 95];\n\n` },
      solution: {
        "index.php": `<?php\n$scores = ["ana" => 82, "ben" => 95, "chloe" => 78, "dev" => 95];\n\n$ranked = $scores;\narsort($ranked);\n$rank = 1;\nforeach ($ranked as $name => $score) {\n    if ($rank > 3) {\n        break;\n    }\n    echo "$rank. $name ($score)\\n";\n    $rank++;\n}\necho "Average: " . array_sum($scores) / count($scores);\n`,
      },
      objectives: [
        {
          id: "top3",
          label: L("Print 1. ben (95), 2. dev (95), 3. ana (82)", "Afficher 1. ben (95), 2. dev (95), 3. ana (82)"),
          check: all((c) => lines(c.out).slice(0, 3).join("|") === "1. ben (95)|2. dev (95)|3. ana (82)", uses(/\b(arsort|uasort|usort|uksort)\s*\(/)),
          hints: [
            L("You need a sort by value, highest first, that keeps the keys (the names).", "Il te faut un tri par valeur, du plus grand au plus petit, qui garde les clés (les noms)."),
            L("`arsort($scores);` then a foreach with a counter that stops after 3.", "`arsort($scores);` puis un foreach avec un compteur qui s'arrête après 3."),
            L("`arsort($ranked); $rank = 1; foreach ($ranked as $name => $score) { if ($rank > 3) break; echo \"$rank. $name ($score)\\n\"; $rank++; }`", "`arsort($ranked); $rank = 1; foreach ($ranked as $name => $score) { if ($rank > 3) break; echo \"$rank. $name ($score)\\n\"; $rank++; }`"),
          ],
        },
        {
          id: "only3",
          label: L("Only three players are listed", "Seuls trois joueurs sont listés"),
          check: (c) => !c.out.includes("chloe"),
          hints: [
            L("Stop the loop after the third player.", "Arrête la boucle après le troisième joueur."),
            L("`break` leaves a loop early.", "`break` quitte une boucle plus tôt."),
            L("Check `if ($rank > 3) { break; }` at the start of each turn.", "Teste `if ($rank > 3) { break; }` au début de chaque tour."),
          ],
        },
        {
          id: "average",
          label: L("Last line: Average: 87.5", "Dernière ligne : Average: 87.5"),
          check: all((c) => lines(c.out).at(-1) === "Average: 87.5", uses(/array_sum\s*\(/)),
          hints: [
            L("Average = sum of all scores ÷ number of players.", "Moyenne = somme de tous les scores ÷ nombre de joueurs."),
            L("`array_sum($scores) / count($scores)`", "`array_sum($scores) / count($scores)`"),
            L("`echo \"Average: \" . array_sum($scores) / count($scores);` after the loop.", "`echo \"Average: \" . array_sum($scores) / count($scores);` après la boucle."),
          ],
        },
      ],
      cheat: "array-functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`array_map` transforms, `array_filter` keeps, `array_reduce` combines.", "`array_map` transforme, `array_filter` garde, `array_reduce` combine."),
    L("Shortcuts: `array_sum`, `max`, `min`, `in_array`, `implode`, `explode`.", "Raccourcis : `array_sum`, `max`, `min`, `in_array`, `implode`, `explode`."),
    L("`sort`/`rsort` renumber, `asort`/`arsort`/`ksort` keep keys, `usort` takes your own comparison.", "`sort`/`rsort` renumérotent, `asort`/`arsort`/`ksort` gardent les clés, `usort` prend ta propre comparaison."),
    L("Sort functions modify the array in place and return true.", "Les fonctions de tri modifient le tableau sur place et renvoient true."),
  ],
};

export const destructuring: Lesson = {
  id: "destructuring",
  chapterId: CH,
  title: L("Unpacking arrays", "Déballer des tableaux"),
  tagline: L("Destructuring, swapping and the spread operator ...", "La déstructuration, l'échange et l'opérateur de décomposition ..."),
  xp: 50,
  syntax: ["[$a, $b] =", "[\"k\" => $v] =", "...$array", "[...$a, ...$b]"],
  doc: "guide-arrays",
  steps: [
    {
      kind: "discover",
      title: L("Take an array apart", "Démonter un tableau"),
      body: [
        L(
          "Often an array holds a few values you want in separate variables. Instead of three lines like `$x = $point[0];`, **destructuring** does it in one: `[$x, $y, $z] = $point;`. The brackets on the left of `=` describe the shape you expect.",
          "Souvent un tableau contient quelques valeurs que tu veux dans des variables séparées. Au lieu de trois lignes comme `$x = $point[0];`, la **déstructuration** le fait en une : `[$x, $y, $z] = $point;`. Les crochets à gauche du `=` décrivent la forme attendue.",
        ),
        L(
          "Skip an item by leaving its place empty: `[, $second] = $list;`. With associative arrays, name the keys: `[\"name\" => $name, \"age\" => $age] = $user;`. (Old code uses `list($a, $b) = …`, which does the same.)",
          "Saute un élément en laissant sa place vide : `[, $second] = $list;`. Avec des tableaux associatifs, nomme les clés : `[\"name\" => $name, \"age\" => $age] = $user;`. (L'ancien code utilise `list($a, $b) = …`, qui fait pareil.)",
        ),
      ],
      example: {
        code: `<?php\n$point = [3, 7, 1];\n[$x, $y, $z] = $point;\necho "x=$x y=$y z=$z\\n";\n\n[, $second] = ["gold", "silver", "bronze"];\necho $second, "\\n";\n\n$user = ["name" => "Ada", "age" => 36];\n["name" => $name, "age" => $age] = $user;\necho "$name is $age";\n`,
      },
    },
    {
      kind: "discover",
      title: L("Swap and loop", "Échanger et boucler"),
      body: [
        L(
          "Swapping two variables used to need a temporary third one. With destructuring it's one line: `[$a, $b] = [$b, $a];`. PHP builds the right-hand array first, then unpacks it.",
          "Échanger deux variables demandait une troisième variable temporaire. Avec la déstructuration, c'est une ligne : `[$a, $b] = [$b, $a];`. PHP construit d'abord le tableau de droite, puis le déballe.",
        ),
        L(
          "Destructuring also works in `foreach`, which is perfect for lists of small records: `foreach ($points as [$x, $y])`.",
          "La déstructuration marche aussi dans `foreach`, parfait pour des listes de petits enregistrements : `foreach ($points as [$x, $y])`.",
        ),
      ],
      example: {
        code: `<?php\n$a = "left";\n$b = "right";\n[$a, $b] = [$b, $a];\necho "$a $b\\n";\n\n$moves = [[0, 1], [2, 3], [5, 8]];\nforeach ($moves as [$from, $to]) {\n    echo "$from -> $to\\n";\n}\n`,
      },
    },
    {
      kind: "discover",
      title: L("Spread: the three dots", "La décomposition : les trois points"),
      body: [
        L(
          "`...` does the opposite of destructuring: it **spreads** an array into separate values. In a function call, `max(...$numbers)` is the same as `max(4, 9, 2)`. Inside brackets, `[...$a, ...$b]` builds a new array from both.",
          "`...` fait l'inverse de la déstructuration : il **étale** un tableau en valeurs séparées. Dans un appel de fonction, `max(...$numbers)` revient à `max(4, 9, 2)`. Entre crochets, `[...$a, ...$b]` construit un nouveau tableau à partir des deux.",
        ),
      ],
      example: {
        code: `<?php\n$numbers = [4, 9, 2];\necho max(...$numbers), "\\n";\n\n$fruits = ["apple", "pear"];\n$veggies = ["leek", "kale"];\n$basket = [...$fruits, "bread", ...$veggies];\necho implode(", ", $basket), "\\n";\n\n$defaults = ["color" => "blue", "size" => "M"];\n$choice = ["size" => "L"];\nprint_r([...$defaults, ...$choice]);\n`,
        caption: L("With string keys, a later value overwrites an earlier one, like array_merge().", "Avec des clés texte, une valeur plus tardive écrase la précédente, comme array_merge()."),
      },
      callout: {
        tone: "version",
        text: L(
          "Spreading arrays with **string keys** needs PHP 8.1. On PHP 7.4 and 8.0 the last example stops with a fatal error: try it with the version picker.",
          "Décomposer des tableaux à **clés texte** demande PHP 8.1. En PHP 7.4 et 8.0, le dernier exemple s'arrête sur une erreur fatale : essaie-le avec le sélecteur de version.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Watch the values move", "Regarde les valeurs bouger"),
      body: L(
        "Step through and watch the Variables panel: a single line creates or changes several variables at once.",
        "Avance pas à pas et surveille le panneau Variables : une seule ligne crée ou modifie plusieurs variables à la fois.",
      ),
      code: `<?php\n$rgb = [255, 128, 0];\n[$red, $green, $blue] = $rgb;\n[$red, $blue] = [$blue, $red];\n$mixed = [...$rgb, $red];\necho implode(",", $mixed);\n`,
      notes: {
        3: L("Three variables created in one line: 255, 128 and 0.", "Trois variables créées en une ligne : 255, 128 et 0."),
        4: L("Swap: $red and $blue exchange their values.", "Échange : $red et $blue échangent leurs valeurs."),
        5: L("The spread copies $rgb's items, then $red (now 0) is added.", "La décomposition copie les éléments de $rgb, puis $red (qui vaut 0 maintenant) est ajouté."),
      },
    },
    {
      kind: "quiz",
      title: L("Nested unpacking", "Déballage imbriqué"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n[$a, [$b, $c]] = [1, [2, 3]];\necho $a + $b * $c;\n`,
      options: ["7", "9", "6", "123"],
      answer: 0,
      explain: L(
        "The pattern mirrors the data: `$a` = 1, `$b` = 2, `$c` = 3. Then 1 + 2 × 3 = 7 (multiplication first).",
        "Le motif reflète les données : `$a` = 1, `$b` = 2, `$c` = 3. Puis 1 + 2 × 3 = 7 (la multiplication d'abord).",
      ),
    },
    {
      kind: "try",
      title: L("One-line swap", "Échange en une ligne"),
      body: L(
        "Swap `$left` and `$right` with a single destructuring assignment (no temporary variable), so the script prints `R L`.",
        "Échange `$left` et `$right` avec une seule affectation par déstructuration (sans variable temporaire), pour que le script affiche `R L`.",
      ),
      files: { "index.php": `<?php\n$left = "L";\n$right = "R";\n\n// Swap them here\n\necho "$left $right";\n` },
      solution: { "index.php": `<?php\n$left = "L";\n$right = "R";\n\n[$left, $right] = [$right, $left];\n\necho "$left $right";\n` },
      objectives: [
        {
          id: "swap",
          label: L("Print R L, swapping with [ … ] = [ … ]", "Afficher R L, en échangeant avec [ … ] = [ … ]"),
          check: all(outputIs("R L"), uses(/\[\s*\$left\s*,\s*\$right\s*\]\s*=\s*\[\s*\$right\s*,\s*\$left\s*\]/)),
          hints: [
            L("Build an array with the values in the new order, and unpack it into the variables.", "Construis un tableau avec les valeurs dans le nouvel ordre, et déballe-le dans les variables."),
            L("`[$a, $b] = [$b, $a];`", "`[$a, $b] = [$b, $a];`"),
            L("Write `[$left, $right] = [$right, $left];` where the comment is.", "Écris `[$left, $right] = [$right, $left];` à la place du commentaire."),
          ],
        },
      ],
      cheat: "arrays",
    },
    {
      kind: "challenge",
      title: L("Guest list", "Liste d'invités"),
      body: L(
        "Each guest is `[name, age, city]`. Print one line per guest like `Ada (36) lives in London`, destructuring in the `foreach`. Then merge `$guests` and `$lateGuests` into one array with the spread operator and print `Guests: 4`.",
        "Chaque invité est `[nom, âge, ville]`. Affiche une ligne par invité comme `Ada (36) lives in London`, en déstructurant dans le `foreach`. Puis fusionne `$guests` et `$lateGuests` en un seul tableau avec l'opérateur de décomposition et affiche `Guests: 4`.",
      ),
      files: {
        "index.php": `<?php\n$guests = [\n    ["Ada", 36, "London"],\n    ["Linus", 21, "Helsinki"],\n    ["Grace", 85, "New York"],\n];\n$lateGuests = [["Rasmus", 27, "Qeqertarsuaq"]];\n\n`,
      },
      solution: {
        "index.php": `<?php\n$guests = [\n    ["Ada", 36, "London"],\n    ["Linus", 21, "Helsinki"],\n    ["Grace", 85, "New York"],\n];\n$lateGuests = [["Rasmus", 27, "Qeqertarsuaq"]];\n\nforeach ($guests as [$name, $age, $city]) {\n    echo "$name ($age) lives in $city\\n";\n}\n\n$everyone = [...$guests, ...$lateGuests];\necho "Guests: " . count($everyone);\n`,
      },
      objectives: [
        {
          id: "lines",
          label: L("Print the three guests, destructuring in foreach", "Afficher les trois invités, en déstructurant dans foreach"),
          check: all(
            outputLines(["Ada (36) lives in London", "Linus (21) lives in Helsinki", "Grace (85) lives in New York"]),
            uses(/foreach\s*\(\s*\$guests\s+as\s*\[/),
          ),
          hints: [
            L("Put the destructuring pattern right after `as`.", "Mets le motif de déstructuration juste après `as`."),
            L("`foreach ($guests as [$name, $age, $city]) { … }`", "`foreach ($guests as [$name, $age, $city]) { … }`"),
            L("Inside the loop: `echo \"$name ($age) lives in $city\\n\";`", "Dans la boucle : `echo \"$name ($age) lives in $city\\n\";`"),
          ],
        },
        {
          id: "merge",
          label: L("Last line: Guests: 4, merged with ...", "Dernière ligne : Guests: 4, fusionné avec ..."),
          check: all((c) => lines(c.out).at(-1) === "Guests: 4", uses(/\.\.\.\s*\$guests/), uses(/\.\.\.\s*\$lateGuests/)),
          hints: [
            L("Spread both arrays inside a new pair of brackets.", "Décompose les deux tableaux dans une nouvelle paire de crochets."),
            L("`$everyone = [...$guests, ...$lateGuests];`", "`$everyone = [...$guests, ...$lateGuests];`"),
            L("Then `echo \"Guests: \" . count($everyone);`", "Puis `echo \"Guests: \" . count($everyone);`"),
          ],
        },
      ],
      cheat: "arrays",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`[$a, $b] = $array` unpacks values; `[\"key\" => $v] = $array` unpacks by key.", "`[$a, $b] = $tableau` déballe des valeurs ; `[\"clé\" => $v] = $tableau` déballe par clé."),
    L("`[$a, $b] = [$b, $a]` swaps two variables in one line.", "`[$a, $b] = [$b, $a]` échange deux variables en une ligne."),
    L("`foreach ($rows as [$x, $y])` destructures each item.", "`foreach ($lignes as [$x, $y])` déstructure chaque élément."),
    L("`...` spreads an array into a call or a new array; string keys need PHP 8.1.", "`...` étale un tableau dans un appel ou un nouveau tableau ; les clés texte demandent PHP 8.1."),
  ],
};

const GRADES = `$students = [\n    "Ada" => [18, 15, 17],\n    "Linus" => [12, 14, 9],\n    "Grace" => [19, 20, 18],\n    "Rasmus" => [10, 8, 12],\n];\n`;

const GRADEBOOK_PART1 = `<?php\n${GRADES}\n$averages = [];\nforeach ($students as $name => $grades) {\n    $averages[$name] = round(array_sum($grades) / count($grades), 1);\n    echo "$name: {$averages[$name]}\\n";\n}\n\narsort($averages);\necho "Top: " . array_key_first($averages) . "\\n";\n`;

export const bossGradebook: Lesson = {
  id: "boss-gradebook",
  chapterId: CH,
  boss: true,
  title: L("Boss: the grade book", "Boss : le carnet de notes"),
  tagline: L("Averages, rankings and filters on real data", "Moyennes, classements et filtres sur de vraies données"),
  xp: 80,
  syntax: ["foreach", "array_sum", "count", "round", "arsort", "array_filter", "implode"],
  doc: "guide-arrays",
  steps: [
    {
      kind: "discover",
      title: L("The teacher needs you", "La prof a besoin de toi"),
      body: [
        L(
          "A teacher keeps her students' grades in an associative array: each name maps to a list of grades out of 20. She wants each average, the best student, who passed (average of 12 or more) and the class average.",
          "Une prof garde les notes de ses élèves dans un tableau associatif : chaque nom pointe vers une liste de notes sur 20. Elle veut chaque moyenne, le meilleur élève, qui a réussi (moyenne de 12 ou plus) et la moyenne de la classe.",
        ),
        L(
          "Everything from this chapter is in play: nested arrays, `foreach` with keys, `array_sum` and `count`, sorting with keys, filtering and `implode`. Plan before you code: what do you compute first, and where do you store it?",
          "Tout ce chapitre entre en jeu : tableaux imbriqués, `foreach` avec les clés, `array_sum` et `count`, tri avec les clés, filtrage et `implode`. Planifie avant de coder : que calcules-tu d'abord, et où le ranges-tu ?",
        ),
      ],
      example: {
        code: `<?php\n$grades = [18, 15, 17];\necho array_sum($grades) / count($grades), "\\n";\necho round(array_sum($grades) / count($grades), 1);\n`,
        caption: L("round($x, 1) keeps one decimal.", "round($x, 1) garde une décimale."),
      },
    },
    {
      kind: "quiz",
      title: L("Rounding check", "Vérifie l'arrondi"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho round(57 / 3, 1);\n`,
      options: ["19", "19.0", "19.00", "19.1"],
      answer: 0,
      explain: L(
        "57 / 3 is exactly 19. `round(19, 1)` returns the float 19.0, and echo prints a whole float without decimals: `19`.",
        "57 / 3 vaut exactement 19. `round(19, 1)` renvoie le float 19.0, et echo affiche un float entier sans décimales : `19`.",
      ),
    },
    {
      kind: "challenge",
      title: L("Averages and the top student", "Moyennes et meilleur élève"),
      body: L(
        "Print each student's average rounded to one decimal, like `Ada: 16.7`, in the order of the array. Then print `Top: Grace` (the best average), computed from your data.",
        "Affiche la moyenne de chaque élève arrondie à une décimale, comme `Ada: 16.7`, dans l'ordre du tableau. Puis affiche `Top: Grace` (la meilleure moyenne), calculé à partir de tes données.",
      ),
      files: { "index.php": `<?php\n${GRADES}\n` },
      solution: { "index.php": GRADEBOOK_PART1 },
      objectives: [
        {
          id: "averages",
          label: L("Print Ada: 16.7, Linus: 11.7, Grace: 19, Rasmus: 10", "Afficher Ada: 16.7, Linus: 11.7, Grace: 19, Rasmus: 10"),
          check: all(outputLines(["Ada: 16.7", "Linus: 11.7", "Grace: 19", "Rasmus: 10"]), uses(/\bforeach\s*\(/)),
          hints: [
            L("Loop over the students with their name as key; each value is a list of grades.", "Boucle sur les élèves avec leur nom en clé ; chaque valeur est une liste de notes."),
            L("`foreach ($students as $name => $grades)` and `round(array_sum($grades) / count($grades), 1)`.", "`foreach ($students as $name => $grades)` et `round(array_sum($grades) / count($grades), 1)`."),
            L("Store each average in `$averages[$name]` (you'll need it again), then `echo \"$name: {$averages[$name]}\\n\";`", "Range chaque moyenne dans `$averages[$name]` (tu en auras encore besoin), puis `echo \"$name: {$averages[$name]}\\n\";`"),
          ],
        },
        {
          id: "top",
          label: L("Print Top: Grace", "Afficher Top: Grace"),
          check: (c) => lines(c.out).at(-1) === "Top: Grace",
          hints: [
            L("Sort the averages from best to worst while keeping the names, then take the first key.", "Trie les moyennes de la meilleure à la moins bonne en gardant les noms, puis prends la première clé."),
            L("`arsort($averages);` then `array_key_first($averages)` gives the best name.", "`arsort($averages);` puis `array_key_first($averages)` donne le meilleur nom."),
            L("After the loop: `arsort($averages); echo \"Top: \" . array_key_first($averages) . \"\\n\";`", "Après la boucle : `arsort($averages); echo \"Top: \" . array_key_first($averages) . \"\\n\";`"),
          ],
        },
      ],
      cheat: "array-functions",
    },
    {
      kind: "challenge",
      title: L("Who passed, and the class average", "Qui a réussi, et la moyenne de la classe"),
      body: L(
        "Add two lines at the end. `Passed: Ada, Grace`: the students with an average of 12 or more, in the array's original order, using `array_filter`. Then `Class average: 14.3`: the average of every grade, rounded to one decimal.",
        "Ajoute deux lignes à la fin. `Passed: Ada, Grace` : les élèves avec une moyenne de 12 ou plus, dans l'ordre d'origine du tableau, avec `array_filter`. Puis `Class average: 14.3` : la moyenne de toutes les notes, arrondie à une décimale.",
      ),
      files: { "index.php": GRADEBOOK_PART1 },
      solution: {
        "index.php": `<?php\n${GRADES}\n$averages = [];\nforeach ($students as $name => $grades) {\n    $averages[$name] = round(array_sum($grades) / count($grades), 1);\n    echo "$name: {$averages[$name]}\\n";\n}\n\n$ranked = $averages;\narsort($ranked);\necho "Top: " . array_key_first($ranked) . "\\n";\n\n$passed = array_filter($averages, fn($avg) => $avg >= 12);\necho "Passed: " . implode(", ", array_keys($passed)) . "\\n";\n\n$all = array_merge(...array_values($students));\necho "Class average: " . round(array_sum($all) / count($all), 1);\n`,
      },
      objectives: [
        {
          id: "passed",
          label: L("Print Passed: Ada, Grace (with array_filter)", "Afficher Passed: Ada, Grace (avec array_filter)"),
          check: all(outputLines(["Passed: Ada, Grace"]), uses(/array_filter\s*\(/)),
          hints: [
            L("Filter the averages (name => average), keep those ≥ 12, then join their names. Careful: if you sorted `$averages`, the order changed.", "Filtre les moyennes (nom => moyenne), garde celles ≥ 12, puis colle leurs noms. Attention : si tu as trié `$averages`, l'ordre a changé."),
            L("Sort a copy (`$ranked = $averages; arsort($ranked);`) so `$averages` keeps the original order. Then `array_filter($averages, fn($avg) => $avg >= 12)`.", "Trie une copie (`$ranked = $averages; arsort($ranked);`) pour que `$averages` garde l'ordre d'origine. Puis `array_filter($averages, fn($avg) => $avg >= 12)`."),
            L("`echo \"Passed: \" . implode(\", \", array_keys($passed)) . \"\\n\";` The names are the keys.", "`echo \"Passed: \" . implode(\", \", array_keys($passed)) . \"\\n\";` Les noms sont les clés."),
          ],
        },
        {
          id: "class",
          label: L("Last line: Class average: 14.3", "Dernière ligne : Class average: 14.3"),
          check: (c) => lines(c.out).at(-1) === "Class average: 14.3",
          hints: [
            L("Gather all 12 grades in one list, or add up all sums and all counts.", "Rassemble les 12 notes dans une liste, ou additionne toutes les sommes et tous les comptes."),
            L("`array_merge(...array_values($students))` flattens the lists of grades into one.", "`array_merge(...array_values($students))` aplatit les listes de notes en une seule."),
            L("`$all = array_merge(...array_values($students)); echo \"Class average: \" . round(array_sum($all) / count($all), 1);`", "`$all = array_merge(...array_values($students)); echo \"Class average: \" . round(array_sum($all) / count($all), 1);`"),
          ],
        },
        {
          id: "kept",
          label: L("The averages and Top lines are still there", "Les lignes des moyennes et Top sont toujours là"),
          check: all(outputLines(["Ada: 16.7", "Linus: 11.7", "Grace: 19", "Rasmus: 10", "Top: Grace"]), clean),
          hints: [
            L("Only add code: the first part already works.", "Ajoute seulement du code : la première partie marche déjà."),
            L("If a warning appeared, read it in the Problems tab: it gives the line.", "Si un avertissement est apparu, lis-le dans l'onglet Problèmes : il donne la ligne."),
            L("Compare with the solution of the previous challenge.", "Compare avec la solution du défi précédent."),
          ],
        },
      ],
      cheat: "array-functions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Nested arrays model real data: name → list of grades.", "Les tableaux imbriqués modélisent de vraies données : nom → liste de notes."),
    L("Store intermediate results (like `$averages`) so later steps can reuse them.", "Range les résultats intermédiaires (comme `$averages`) pour que les étapes suivantes les réutilisent."),
    L("Sorting changes the array: sort a copy when you still need the original order.", "Trier modifie le tableau : trie une copie quand tu as encore besoin de l'ordre d'origine."),
    L("`array_filter` + `array_keys` + `implode` turn data into a readable report.", "`array_filter` + `array_keys` + `implode` transforment des données en rapport lisible."),
  ],
};

export const ARRAYS: Lesson[] = [arrayBasics, assocArrays, arrayFunctions, destructuring, bossGradebook];
