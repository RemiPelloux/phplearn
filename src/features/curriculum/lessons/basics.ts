import { L } from "@/lib/txt";
import { all, clean, outputHas, outputIs, outputLines, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "basics";

export const helloPhp: Lesson = {
  id: "hello-php",
  chapterId: CH,
  title: L("Hello, PHP", "Bonjour, PHP"),
  tagline: L("Your first script, echo, and how PHP runs", "Ton premier script, echo, et comment PHP s'exécute"),
  xp: 40,
  syntax: ["<?php", "echo", ";", "//"],
  doc: "guide-how-php-runs",
  steps: [
    {
      kind: "discover",
      title: L("What is PHP?", "C'est quoi, PHP ?"),
      body: [
        L(
          "PHP is a programming language made for the web. About three websites out of four that use a server-side language use PHP: WordPress, Wikipedia, Facebook's early days, and countless shops and APIs.",
          "PHP est un langage de programmation fait pour le web. Environ trois sites sur quatre qui utilisent un langage côté serveur utilisent PHP : WordPress, Wikipédia, les débuts de Facebook, et d'innombrables boutiques et API.",
        ),
        L(
          "A PHP program is a text file ending in `.php`. When someone visits a page, the server runs the file from top to bottom, and **whatever the script prints becomes the page** (HTML, JSON or plain text).",
          "Un programme PHP est un fichier texte qui finit par `.php`. Quand quelqu'un visite une page, le serveur exécute le fichier de haut en bas, et **tout ce que le script affiche devient la page** (du HTML, du JSON ou du texte).",
        ),
        L(
          "Here you run real PHP, right in your browser: the same interpreter as on a server, from version 7.4 to 8.5. Nothing to install.",
          "Ici tu exécutes du vrai PHP, directement dans ton navigateur : le même interpréteur que sur un serveur, de la version 7.4 à la 8.5. Rien à installer.",
        ),
      ],
      scene: "request",
    },
    {
      kind: "discover",
      title: L("Your first line of PHP", "Ta première ligne de PHP"),
      body: [
        L(
          "Every PHP file starts with the opening tag `<?php`. It tells PHP: \"from here on, this is code\".",
          "Chaque fichier PHP commence par la balise d'ouverture `<?php`. Elle dit à PHP : « à partir d'ici, c'est du code ».",
        ),
        L(
          "`echo` prints text. Text goes between quotes, and each instruction ends with a semicolon `;`, like a full stop at the end of a sentence.",
          "`echo` affiche du texte. Le texte se met entre guillemets, et chaque instruction finit par un point-virgule `;`, comme le point à la fin d'une phrase.",
        ),
        L("Press **Run** to execute the example. The result appears below it.", "Appuie sur **Exécuter** pour lancer l'exemple. Le résultat s'affiche en dessous."),
      ],
      example: {
        code: `<?php\necho "Hello, world!";\n`,
        caption: L("A complete PHP program.", "Un programme PHP complet."),
      },
      callout: {
        tone: "tip",
        text: L(
          "`\\n` inside double quotes means \"new line\". Without it, two echos print on the same line.",
          "`\\n` entre guillemets doubles veut dire « nouvelle ligne ». Sans lui, deux echo s'affichent sur la même ligne.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Watch PHP run, line by line", "Regarde PHP s'exécuter, ligne par ligne"),
      body: L(
        "PHP runs statements in order, from top to bottom. Press Next step to move the arrow and watch the output grow. This is the Trace view: you'll use it to understand any program.",
        "PHP exécute les instructions dans l'ordre, de haut en bas. Appuie sur Étape suivante pour avancer la flèche et regarder la sortie grandir. C'est la vue Trace : tu t'en serviras pour comprendre n'importe quel programme.",
      ),
      code: `<?php\n// Lines starting with // are comments: PHP ignores them.\necho "Line one\\n";\necho "Line two\\n";\necho "Done!";\n`,
      notes: {
        3: L("The first echo prints \"Line one\" and a new line.", "Le premier echo affiche « Line one » et un retour à la ligne."),
        4: L("Then the second one. Order matters.", "Puis le deuxième. L'ordre compte."),
        5: L("Last statement: the script ends here, and its output is the result.", "Dernière instruction : le script s'arrête ici, et sa sortie est le résultat."),
      },
    },
    {
      kind: "try",
      title: L("Say hello", "Dis bonjour"),
      body: L(
        "Make the program print exactly `Hello, PHP!`. Edit the code on the right, then press **Run** (or Ctrl+Enter).",
        "Fais afficher exactement `Hello, PHP!` au programme. Modifie le code à droite, puis appuie sur **Exécuter** (ou Ctrl+Entrée).",
      ),
      files: { "index.php": `<?php\necho "Hello, world!";\n` },
      solution: { "index.php": `<?php\necho "Hello, PHP!";\n` },
      objectives: [
        {
          id: "hello",
          label: L("The output is exactly: Hello, PHP!", "La sortie est exactement : Hello, PHP!"),
          check: outputIs("Hello, PHP!"),
          hints: [
            L("Only the text between the quotes needs to change.", "Seul le texte entre les guillemets doit changer."),
            L("Replace `world` with `PHP`, keep the quotes and the semicolon.", "Remplace `world` par `PHP`, garde les guillemets et le point-virgule."),
            L("The line should be: `echo \"Hello, PHP!\";`", "La ligne doit être : `echo \"Hello, PHP!\";`"),
          ],
        },
      ],
      cheat: "basics",
    },
    {
      kind: "try",
      title: L("Fix a syntax error", "Corrige une erreur de syntaxe"),
      body: L(
        "This script is broken. Press **Run** first: PHP refuses to start and shows a **Parse error** in the Problems tab, with the line where it got confused. Read it, then fix the code.",
        "Ce script est cassé. Appuie d'abord sur **Exécuter** : PHP refuse de démarrer et affiche une **Parse error** dans l'onglet Problèmes, avec la ligne où il s'est perdu. Lis-la, puis corrige le code.",
      ),
      files: { "index.php": `<?php\necho "Ready?\\n"\necho "Go!";\n` },
      solution: { "index.php": `<?php\necho "Ready?\\n";\necho "Go!";\n` },
      objectives: [
        {
          id: "fixed",
          label: L("The script runs and prints both lines", "Le script s'exécute et affiche les deux lignes"),
          check: all(clean, outputLines(["Ready?", "Go!"])),
          hints: [
            L(
              "PHP reports the error on line 3, but the real mistake is often at the end of the line before.",
              "PHP signale l'erreur ligne 3, mais la vraie faute est souvent à la fin de la ligne d'avant.",
            ),
            L("Every statement ends with `;`. Look at line 2.", "Chaque instruction finit par `;`. Regarde la ligne 2."),
            L("Add a semicolon after `\"Ready?\\n\"` on line 2.", "Ajoute un point-virgule après `\"Ready?\\n\"` à la ligne 2."),
          ],
        },
      ],
      cheat: "basics",
    },
    {
      kind: "quiz",
      title: L("Predict the output", "Devine la sortie"),
      question: L("What does this program print?", "Qu'affiche ce programme ?"),
      code: `<?php\necho "A";\n// echo "B";\necho "C";\n`,
      options: ["ABC", "AC", "A\nC", "C"],
      answer: 1,
      explain: L(
        "Line 3 is a comment, so it never runs. There is no `\\n` either, so A and C are printed side by side: `AC`.",
        "La ligne 3 est un commentaire : elle ne s'exécute jamais. Il n'y a pas de `\\n` non plus, donc A et C s'affichent côte à côte : `AC`.",
      ),
    },
    {
      kind: "challenge",
      title: L("Your business card", "Ta carte de visite"),
      body: L(
        "Write a script that prints three lines: your name, your job (or the job you want), and the line `Powered by PHP`. Use one `echo` per line and a comment at the top.",
        "Écris un script qui affiche trois lignes : ton nom, ton métier (ou celui que tu veux), et la ligne `Powered by PHP`. Utilise un `echo` par ligne et un commentaire en haut.",
      ),
      files: { "index.php": `<?php\n\n` },
      solution: { "index.php": `<?php\n// My business card\necho "Ada Lovelace\\n";\necho "Developer\\n";\necho "Powered by PHP";\n` },
      objectives: [
        {
          id: "three-lines",
          label: L("Print at least three lines", "Afficher au moins trois lignes"),
          check: (c) => c.out.trim().split("\n").filter((l) => l.trim()).length >= 3,
          hints: [
            L("Each line needs its own text followed by a new line.", "Chaque ligne a besoin de son texte suivi d'un retour à la ligne."),
            L("End each text with `\\n` inside double quotes: `echo \"Ada\\n\";`", "Termine chaque texte par `\\n` entre guillemets doubles : `echo \"Ada\\n\";`"),
            L("Write three lines like `echo \"Ada Lovelace\\n\";`, `echo \"Developer\\n\";`, `echo \"Powered by PHP\";`", "Écris trois lignes comme `echo \"Ada Lovelace\\n\";`, `echo \"Developer\\n\";`, `echo \"Powered by PHP\";`"),
          ],
        },
        {
          id: "powered",
          label: L("One line is exactly: Powered by PHP", "Une ligne est exactement : Powered by PHP"),
          check: (c) => c.out.split("\n").some((l) => l.trim() === "Powered by PHP"),
          hints: [
            L("Check the spelling and the capitals.", "Vérifie l'orthographe et les majuscules."),
            L("`echo \"Powered by PHP\";` on its own line.", "`echo \"Powered by PHP\";` sur sa propre ligne."),
            L("Make sure nothing else is printed on that same line (add `\\n` to the line before).", "Vérifie que rien d'autre ne s'affiche sur cette ligne (ajoute `\\n` à la ligne d'avant)."),
          ],
        },
        {
          id: "comment",
          label: L("Add a comment (// …)", "Ajouter un commentaire (// …)"),
          check: (c) => /(^|\n)\s*(\/\/|#(?!\[)|\/\*)/.test(c.files["index.php"] ?? ""),
          hints: [
            L("A comment is a note for humans that PHP skips.", "Un commentaire est une note pour les humains que PHP ignore."),
            L("Start a line with `//`.", "Commence une ligne par `//`."),
            L("Add `// My business card` right after `<?php`.", "Ajoute `// My business card` juste après `<?php`."),
          ],
        },
      ],
      cheat: "basics",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A PHP file starts with `<?php` and runs from top to bottom.", "Un fichier PHP commence par `<?php` et s'exécute de haut en bas."),
    L("`echo` prints text; `\\n` starts a new line.", "`echo` affiche du texte ; `\\n` commence une nouvelle ligne."),
    L("Each statement ends with `;`. A missing one causes a Parse error.", "Chaque instruction finit par `;`. S'il en manque un, c'est une Parse error."),
    L("Comments (`//`, `#`, `/* */`) are notes PHP ignores.", "Les commentaires (`//`, `#`, `/* */`) sont des notes que PHP ignore."),
  ],
};

export const variables: Lesson = {
  id: "variables",
  chapterId: CH,
  title: L("Variables and types", "Variables et types"),
  tagline: L("Store values in $boxes and meet PHP's types", "Range des valeurs dans des $boîtes et découvre les types de PHP"),
  xp: 50,
  syntax: ["$name", "=", "var_dump", "gettype", "int", "float", "string", "bool", "null"],
  doc: "guide-types",
  steps: [
    {
      kind: "discover",
      title: L("A variable is a labelled box", "Une variable est une boîte avec une étiquette"),
      body: [
        L(
          "A variable stores a value so you can use it later. In PHP, every variable name starts with a dollar sign: `$name`, `$age`, `$total`.",
          "Une variable garde une valeur pour s'en servir plus tard. En PHP, chaque nom de variable commence par un dollar : `$name`, `$age`, `$total`.",
        ),
        L(
          "The `=` sign puts a value in the box (it means \"assign\", not \"is equal to\"). You can change the value later: the box keeps only the latest one.",
          "Le signe `=` met une valeur dans la boîte (il veut dire « affecter », pas « est égal à »). Tu peux changer la valeur plus tard : la boîte ne garde que la dernière.",
        ),
      ],
      scene: "variables",
      example: { code: `<?php\n$name = "Ada";\n$age = 36;\necho $name;\necho "\\n";\n$age = $age + 1;\necho $age;\n` },
    },
    {
      kind: "discover",
      title: L("Every value has a type", "Chaque valeur a un type"),
      body: [
        L(
          "PHP has a few basic types: `int` (whole numbers), `float` (decimals), `string` (text), `bool` (`true` or `false`) and `null` (no value).",
          "PHP a quelques types de base : `int` (nombres entiers), `float` (décimaux), `string` (texte), `bool` (`true` ou `false`) et `null` (pas de valeur).",
        ),
        L(
          "`var_dump()` shows a value **and** its type. It's the most useful debugging tool in PHP: when in doubt, var_dump it.",
          "`var_dump()` affiche une valeur **et** son type. C'est l'outil de débogage le plus utile en PHP : dans le doute, var_dump.",
        ),
      ],
      scene: "types",
      example: {
        code: `<?php\nvar_dump(42);\nvar_dump(3.14);\nvar_dump("hello");\nvar_dump(true);\nvar_dump(null);\n`,
        caption: L("string(5) means: a string of 5 bytes.", "string(5) veut dire : une chaîne de 5 octets."),
      },
    },
    {
      kind: "watch",
      title: L("Watch the variables change", "Regarde les variables changer"),
      body: L(
        "Step through this program and keep an eye on the Variables panel: each assignment updates a box. Changed values are highlighted.",
        "Avance dans ce programme en surveillant le panneau Variables : chaque affectation met à jour une boîte. Les valeurs modifiées sont surlignées.",
      ),
      code: `<?php\n$price = 20;\n$quantity = 3;\n$total = $price * $quantity;\n$paid = false;\n$total = $total - 5;\n$paid = true;\necho "Total: $total";\n`,
      notes: {
        2: L("`$price` is created with the int 20.", "`$price` est créée avec l'entier 20."),
        4: L("PHP computes `20 * 3` first, then stores 60 in `$total`.", "PHP calcule d'abord `20 * 3`, puis range 60 dans `$total`."),
        5: L("A bool: only `true` or `false`.", "Un booléen : seulement `true` ou `false`."),
        6: L("Reads the old value (60), subtracts 5, stores 55. The old value is gone.", "Lit l'ancienne valeur (60), retire 5, range 55. L'ancienne valeur a disparu."),
        8: L("Inside double quotes, `$total` is replaced by its value.", "Entre guillemets doubles, `$total` est remplacée par sa valeur."),
      },
    },
    {
      kind: "quiz",
      title: L("What's the type?", "Quel est le type ?"),
      question: L("What does `var_dump(\"42\");` print?", "Qu'affiche `var_dump(\"42\");` ?"),
      code: `<?php\nvar_dump("42");\n`,
      options: ["int(42)", 'string(2) "42"', "float(42)", "42"],
      answer: 1,
      explain: L(
        "The quotes make it text: a string of 2 characters that happen to be digits. `42` without quotes would be an int.",
        "Les guillemets en font du texte : une chaîne de 2 caractères qui sont des chiffres. `42` sans guillemets serait un int.",
      ),
    },
    {
      kind: "try",
      title: L("Make a profile", "Crée un profil"),
      body: L(
        "Create three variables: `$name` (a string), `$age` (an int) and `$isStudent` (a bool). The last line prints them with var_dump so you can check the types.",
        "Crée trois variables : `$name` (une chaîne), `$age` (un entier) et `$isStudent` (un booléen). La dernière ligne les affiche avec var_dump pour vérifier les types.",
      ),
      files: { "index.php": `<?php\n// Create $name, $age and $isStudent here\n\n\nvar_dump($name, $age, $isStudent);\n` },
      solution: { "index.php": `<?php\n$name = "Lin";\n$age = 28;\n$isStudent = true;\n\nvar_dump($name, $age, $isStudent);\n` },
      objectives: [
        {
          id: "name",
          label: L("$name holds a string", "$name contient une chaîne"),
          check: (c) => c.r.globals.name?.[0] === "string",
          hints: [
            L("Text goes between quotes.", "Le texte se met entre guillemets."),
            L("`$name = \"…\";`", "`$name = \"…\";`"),
            L("Add `$name = \"Lin\";` on line 3.", "Ajoute `$name = \"Lin\";` à la ligne 3."),
          ],
        },
        {
          id: "age",
          label: L("$age holds an int", "$age contient un entier"),
          check: (c) => c.r.globals.age?.[0] === "int",
          hints: [
            L("Numbers go without quotes, or they become strings.", "Les nombres s'écrivent sans guillemets, sinon ce sont des chaînes."),
            L("`$age = 28;`", "`$age = 28;`"),
            L("Add `$age = 28;` (no quotes, no decimal point).", "Ajoute `$age = 28;` (sans guillemets ni virgule)."),
          ],
        },
        {
          id: "student",
          label: L("$isStudent holds a bool", "$isStudent contient un booléen"),
          check: (c) => c.r.globals.isStudent?.[0] === "bool",
          hints: [
            L("A bool is `true` or `false`, without quotes.", "Un booléen vaut `true` ou `false`, sans guillemets."),
            L("`$isStudent = true;`", "`$isStudent = true;`"),
            L("Add `$isStudent = true;` before the var_dump line.", "Ajoute `$isStudent = true;` avant la ligne var_dump."),
          ],
        },
      ],
      cheat: "types",
    },
    {
      kind: "discover",
      title: L("Undefined variables", "Variables non définies"),
      body: [
        L(
          "Using a variable that was never assigned is a mistake PHP warns you about: `Warning: Undefined variable $x`. The script keeps going, and the variable counts as `null`.",
          "Utiliser une variable jamais affectée est une erreur que PHP signale : `Warning: Undefined variable $x`. Le script continue, et la variable vaut `null`.",
        ),
        L(
          "Names are case-sensitive: `$Total` and `$total` are two different boxes. That's a classic source of this warning.",
          "Les noms sont sensibles à la casse : `$Total` et `$total` sont deux boîtes différentes. C'est une source classique de cet avertissement.",
        ),
      ],
      example: { code: `<?php\n$total = 10;\necho $Total;\necho "still running";\n`, caption: L("Look at the Problems tab.", "Regarde l'onglet Problèmes.") },
      callout: {
        tone: "version",
        text: L(
          "PHP 7.4 called this a *Notice*; PHP 8 made it a *Warning*: sloppier code gets louder feedback in newer versions.",
          "PHP 7.4 appelait ça une *Notice* ; PHP 8 en a fait un *Warning* : le code négligé reçoit des alertes plus fortes dans les versions récentes.",
        ),
      },
    },
    {
      kind: "challenge",
      title: L("Fix the shopping cart", "Répare le panier"),
      body: L(
        "This cart script has bugs: it prints warnings and a wrong total. Make it run cleanly and print `Total: 45`. Use the Problems tab and the Trace to find what's wrong.",
        "Ce script de panier a des bugs : il affiche des avertissements et un mauvais total. Fais-le tourner sans erreur et afficher `Total: 45`. Utilise l'onglet Problèmes et la Trace pour trouver ce qui cloche.",
      ),
      files: { "index.php": `<?php\n$bookPrice = 15;\n$bookCount = 2;\n$penPrice = "5";\n$penCount = 3;\n\n$total = $bookprice * $bookCount + $penPrice * $pencount;\necho "Total: $total";\n` },
      solution: { "index.php": `<?php\n$bookPrice = 15;\n$bookCount = 2;\n$penPrice = 5;\n$penCount = 3;\n\n$total = $bookPrice * $bookCount + $penPrice * $penCount;\necho "Total: $total";\n` },
      objectives: [
        {
          id: "no-warnings",
          label: L("No warnings", "Aucun avertissement"),
          check: clean,
          hints: [
            L("Each warning names a variable that doesn't exist. Compare it with the names above.", "Chaque avertissement nomme une variable qui n'existe pas. Compare avec les noms au-dessus."),
            L("Variable names are case-sensitive: `$bookprice` is not `$bookPrice`.", "Les noms de variables sont sensibles à la casse : `$bookprice` n'est pas `$bookPrice`."),
            L("On line 7, write `$bookPrice` and `$penCount` with the same capitals as where they are defined.", "Ligne 7, écris `$bookPrice` et `$penCount` avec les mêmes majuscules que là où elles sont définies."),
          ],
        },
        {
          id: "total",
          label: L("It prints: Total: 45", "Ça affiche : Total: 45"),
          check: outputIs("Total: 45"),
          hints: [
            L("15 × 2 + 5 × 3 = 45. Once the names are fixed, the maths works.", "15 × 2 + 5 × 3 = 45. Une fois les noms corrigés, le calcul marche."),
            L("Check the Variables panel after the run: is every value there?", "Regarde le panneau Variables après l'exécution : chaque valeur y est-elle ?"),
            L("Fix the names on line 7. Bonus: write `$penPrice = 5;` without quotes, since it's a number.", "Corrige les noms ligne 7. Bonus : écris `$penPrice = 5;` sans guillemets, c'est un nombre."),
          ],
        },
      ],
      cheat: "types",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Variables start with `$` and are assigned with `=`.", "Les variables commencent par `$` et s'affectent avec `=`."),
    L("Basic types: int, float, string, bool and null.", "Types de base : int, float, string, bool et null."),
    L("`var_dump()` shows the type and the value: your first debugging tool.", "`var_dump()` montre le type et la valeur : ton premier outil de débogage."),
    L("Names are case-sensitive; an unknown variable gives a warning and counts as null.", "Les noms sont sensibles à la casse ; une variable inconnue donne un avertissement et vaut null."),
  ],
};

export const strings: Lesson = {
  id: "strings",
  chapterId: CH,
  title: L("Working with text", "Travailler avec du texte"),
  tagline: L("Quotes, concatenation, interpolation and heredoc", "Guillemets, concaténation, interpolation et heredoc"),
  xp: 50,
  syntax: ['"…"', "'…'", ".", ".=", "{$var}", "strlen", "strtoupper", "<<<"],
  doc: "guide-strings",
  steps: [
    {
      kind: "discover",
      title: L("Single or double quotes?", "Guillemets simples ou doubles ?"),
      body: [
        L(
          "Strings can use single quotes `'…'` or double quotes `\"…\"`. The difference: inside **double** quotes, PHP replaces variables by their value and understands escapes like `\\n`. Single quotes print everything as written.",
          "Les chaînes s'écrivent entre guillemets simples `'…'` ou doubles `\"…\"`. La différence : entre guillemets **doubles**, PHP remplace les variables par leur valeur et comprend les séquences comme `\\n`. Les simples affichent tout tel quel.",
        ),
        L(
          "Replacing variables inside a string is called **interpolation**. Wrap the variable in braces `{$name}` when letters follow it, or for array items and properties.",
          "Remplacer des variables dans une chaîne s'appelle l'**interpolation**. Entoure la variable d'accolades `{$name}` quand des lettres la suivent, ou pour un élément de tableau ou une propriété.",
        ),
      ],
      example: { code: `<?php\n$name = "Ada";\necho "Hi $name!\\n";\necho 'Hi $name!\\n';\necho "\\n";\necho "{$name}'s laptop\\n";\n` },
    },
    {
      kind: "discover",
      title: L("Gluing strings together", "Coller des chaînes"),
      body: [
        L(
          "The dot `.` joins strings: it's called **concatenation**. `.=` adds to the end of an existing string, handy to build text step by step.",
          "Le point `.` colle des chaînes : c'est la **concaténation**. `.=` ajoute à la fin d'une chaîne existante, pratique pour construire un texte petit à petit.",
        ),
        L(
          "PHP also has hundreds of string functions. A few you'll use every day: `strlen()` (length), `strtoupper()`, `strtolower()`, `ucfirst()`, `str_repeat()`, `trim()`.",
          "PHP a aussi des centaines de fonctions de chaînes. Quelques-unes que tu utiliseras tous les jours : `strlen()` (longueur), `strtoupper()`, `strtolower()`, `ucfirst()`, `str_repeat()`, `trim()`.",
        ),
      ],
      example: {
        code: `<?php\n$first = "grace";\n$last = "hopper";\n$full = ucfirst($first) . " " . ucfirst($last);\necho $full . "\\n";\necho strlen($full) . " characters\\n";\n$line = str_repeat("=", 12);\n$line .= ">";\necho $line;\n`,
      },
      callout: {
        tone: "warn",
        text: L(
          "In PHP, `+` is only for numbers. `\"a\" + \"b\"` throws a TypeError in PHP 8: use the dot to join text.",
          "En PHP, `+` est réservé aux nombres. `\"a\" + \"b\"` lève une TypeError en PHP 8 : utilise le point pour coller du texte.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Spot the difference", "Trouve la différence"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$n = 3;\necho 'n = $n' . " and " . "n = $n";\n`,
      options: ["n = 3 and n = 3", "n = $n and n = 3", "n = $n and n = $n", "n = 3 and n = $n"],
      answer: 1,
      explain: L(
        "Single quotes print `$n` literally; double quotes replace it with 3. The dots glue the three pieces.",
        "Les guillemets simples affichent `$n` tel quel ; les doubles le remplacent par 3. Les points collent les trois morceaux.",
      ),
    },
    {
      kind: "try",
      title: L("Build a greeting", "Construis une salutation"),
      body: L(
        "Using `$first` and `$city`, print exactly `Welcome, Linus from Helsinki!` Use interpolation or concatenation, your choice. Don't type the name or city directly: use the variables.",
        "Avec `$first` et `$city`, affiche exactement `Welcome, Linus from Helsinki!` Utilise l'interpolation ou la concaténation, au choix. N'écris pas le nom ni la ville en dur : utilise les variables.",
      ),
      files: { "index.php": `<?php\n$first = "Linus";\n$city = "Helsinki";\n\n// Print: Welcome, Linus from Helsinki!\n` },
      solution: { "index.php": `<?php\n$first = "Linus";\n$city = "Helsinki";\n\necho "Welcome, $first from $city!";\n` },
      objectives: [
        {
          id: "greet",
          label: L("Print: Welcome, Linus from Helsinki!", "Afficher : Welcome, Linus from Helsinki!"),
          check: all(outputIs("Welcome, Linus from Helsinki!"), uses(/\$first/), uses(/\$city/), (c) => !/echo[^;]*Linus/.test(c.code)),
          hints: [
            L("Double quotes let you put variables right inside the text.", "Les guillemets doubles permettent de mettre les variables directement dans le texte."),
            L("`echo \"Welcome, $first from …\";`", "`echo \"Welcome, $first from …\";`"),
            L("`echo \"Welcome, $first from $city!\";`", "`echo \"Welcome, $first from $city!\";`"),
          ],
        },
      ],
      cheat: "strings",
    },
    {
      kind: "discover",
      title: L("Long text: heredoc", "Texte long : heredoc"),
      body: [
        L(
          "For several lines of text, use a **heredoc**: `<<<TXT` starts it, and `TXT;` on its own line ends it. Variables are interpolated, like in double quotes. (A **nowdoc**, `<<<'TXT'`, works like single quotes.)",
          "Pour plusieurs lignes de texte, utilise un **heredoc** : `<<<TXT` le commence, et `TXT;` sur sa propre ligne le termine. Les variables sont interpolées, comme entre guillemets doubles. (Un **nowdoc**, `<<<'TXT'`, se comporte comme les guillemets simples.)",
        ),
      ],
      example: {
        code: `<?php\n$user = "Rasmus";\n$count = 3;\necho <<<TXT\n    Hello $user,\n    you have $count new messages.\n    TXT;\n`,
        caption: L("Since PHP 7.3, the closing marker can be indented: that indentation is removed from every line.", "Depuis PHP 7.3, le marqueur de fin peut être indenté : cette indentation est retirée de chaque ligne."),
      },
    },
    {
      kind: "challenge",
      title: L("Format a username", "Formate un nom d'utilisateur"),
      body: L(
        "A user typed their name with extra spaces and random capitals. Clean it up: print the name trimmed with a capital first letter (`Margaret`), then on a new line its length in the form `Length: 8`.",
        "Un utilisateur a tapé son nom avec des espaces en trop et des majuscules au hasard. Nettoie-le : affiche le nom sans espaces avec une majuscule au début (`Margaret`), puis à la ligne sa longueur sous la forme `Length: 8`.",
      ),
      files: { "index.php": `<?php\n$input = "   mARGARET  ";\n\n// 1. Remove the spaces around it\n// 2. Lowercase everything, then uppercase the first letter\n// 3. Print the name, then "Length: " and its length\n` },
      solution: {
        "index.php": `<?php\n$input = "   mARGARET  ";\n\n$clean = ucfirst(strtolower(trim($input)));\necho $clean . "\\n";\necho "Length: " . strlen($clean);\n`,
      },
      objectives: [
        {
          id: "name",
          label: L("First line: Margaret", "Première ligne : Margaret"),
          check: (c) => c.out.split("\n")[0] === "Margaret",
          hints: [
            L("Three functions, applied one after the other: trim, strtolower, ucfirst.", "Trois fonctions, appliquées l'une après l'autre : trim, strtolower, ucfirst."),
            L("Functions can be nested: the inner one runs first. `ucfirst(strtolower(...))`.", "Les fonctions s'imbriquent : la plus intérieure s'exécute d'abord. `ucfirst(strtolower(...))`."),
            L("`$clean = ucfirst(strtolower(trim($input)));` then `echo $clean . \"\\n\";`", "`$clean = ucfirst(strtolower(trim($input)));` puis `echo $clean . \"\\n\";`"),
          ],
        },
        {
          id: "length",
          label: L("Second line: Length: 8", "Deuxième ligne : Length: 8"),
          check: (c) => c.out.split("\n")[1]?.trim() === "Length: 8",
          hints: [
            L("`strlen()` counts the characters of the cleaned name, not of `$input`.", "`strlen()` compte les caractères du nom nettoyé, pas de `$input`."),
            L("Glue the label and the number with a dot.", "Colle le libellé et le nombre avec un point."),
            L("`echo \"Length: \" . strlen($clean);`", "`echo \"Length: \" . strlen($clean);`"),
          ],
        },
      ],
      cheat: "strings",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Double quotes interpolate variables and escapes; single quotes don't.", "Les guillemets doubles interpolent variables et séquences ; les simples non."),
    L("`.` joins strings, `.=` appends. `+` is only for numbers.", "`.` colle des chaînes, `.=` ajoute à la fin. `+` est réservé aux nombres."),
    L("`strlen`, `trim`, `strtoupper`, `ucfirst`… can be nested: the inner call runs first.", "`strlen`, `trim`, `strtoupper`, `ucfirst`… s'imbriquent : l'appel intérieur s'exécute d'abord."),
    L("Heredoc (`<<<TXT`) is great for multi-line text.", "Le heredoc (`<<<TXT`) est idéal pour du texte sur plusieurs lignes."),
  ],
};

export const numbers: Lesson = {
  id: "numbers",
  chapterId: CH,
  title: L("Numbers and maths", "Nombres et calculs"),
  tagline: L("Operators, integer vs float, rounding and type juggling", "Opérateurs, entiers et décimaux, arrondis et conversions"),
  xp: 50,
  syntax: ["+ - * /", "%", "**", "intdiv", "round", "++", "+=", "(int)"],
  doc: "guide-types",
  steps: [
    {
      kind: "discover",
      title: L("The arithmetic operators", "Les opérateurs arithmétiques"),
      body: [
        L(
          "`+ - * /` work as in maths, with the usual priority: `*` and `/` before `+` and `-`. Use parentheses to change the order.",
          "`+ - * /` marchent comme en maths, avec la priorité habituelle : `*` et `/` avant `+` et `-`. Utilise des parenthèses pour changer l'ordre.",
        ),
        L(
          "`%` gives the remainder of a division (`10 % 3` is 1), `**` is a power (`2 ** 10` is 1024), and `intdiv()` divides without decimals.",
          "`%` donne le reste d'une division (`10 % 3` vaut 1), `**` est une puissance (`2 ** 10` vaut 1024), et `intdiv()` divise sans décimales.",
        ),
        L(
          "`/` always gives a float when the result isn't whole: `7 / 2` is `3.5`.",
          "`/` donne un float dès que le résultat n'est pas entier : `7 / 2` vaut `3.5`.",
        ),
      ],
      example: { code: `<?php\necho 2 + 3 * 4, "\\n";\necho (2 + 3) * 4, "\\n";\necho 10 % 3, "\\n";\necho 2 ** 10, "\\n";\necho 7 / 2, "\\n";\necho intdiv(7, 2), "\\n";\n` },
      callout: {
        tone: "tip",
        text: L("`echo` accepts several values separated by commas.", "`echo` accepte plusieurs valeurs séparées par des virgules."),
      },
    },
    {
      kind: "discover",
      title: L("Shortcuts and rounding", "Raccourcis et arrondis"),
      body: [
        L(
          "`$x += 5` is short for `$x = $x + 5` (and there's `-=`, `*=`, `/=`, `.=`…). `$i++` adds one, `$i--` removes one.",
          "`$x += 5` est le raccourci de `$x = $x + 5` (et il y a `-=`, `*=`, `/=`, `.=`…). `$i++` ajoute un, `$i--` retire un.",
        ),
        L(
          "Floats are approximations: `0.1 + 0.2` is not exactly `0.3`. Round for display with `round($x, 2)`, `floor()` (down) or `ceil()` (up). For money, store cents as integers.",
          "Les floats sont des approximations : `0.1 + 0.2` ne vaut pas exactement `0.3`. Arrondis pour l'affichage avec `round($x, 2)`, `floor()` (vers le bas) ou `ceil()` (vers le haut). Pour l'argent, stocke des centimes en entiers.",
        ),
      ],
      example: { code: `<?php\n$score = 10;\n$score += 5;\n$score++;\nvar_dump($score);\n\nvar_dump(0.1 + 0.2 == 0.3);\nvar_dump(round(0.1 + 0.2, 2));\nvar_dump(floor(4.7), ceil(4.2));\n` },
    },
    {
      kind: "watch",
      title: L("Step through a calculation", "Avance dans un calcul"),
      body: L(
        "A tip calculator. Watch each variable get its type: some steps turn an int into a float.",
        "Un calculateur de pourboire. Regarde chaque variable recevoir son type : certaines étapes transforment un int en float.",
      ),
      code: `<?php\n$bill = 84;\n$people = 4;\n$tipPercent = 15;\n$tip = $bill * $tipPercent / 100;\n$total = $bill + $tip;\n$each = round($total / $people, 2);\necho "Each pays $each";\n`,
      notes: {
        5: L("84 × 15 = 1260, then / 100 = 12.6: a float.", "84 × 15 = 1260, puis / 100 = 12.6 : un float."),
        6: L("int + float gives a float: 96.6.", "int + float donne un float : 96.6."),
        7: L("96.6 / 4 = 24.15, rounded to 2 decimals.", "96.6 / 4 = 24.15, arrondi à 2 décimales."),
      },
    },
    {
      kind: "try",
      title: L("Seconds to minutes", "Des secondes aux minutes"),
      body: L(
        "Convert `$seconds` into minutes and remaining seconds. For 754 seconds, print exactly `12 min 34 s`. Use `intdiv()` and `%`.",
        "Convertis `$seconds` en minutes et secondes restantes. Pour 754 secondes, affiche exactement `12 min 34 s`. Utilise `intdiv()` et `%`.",
      ),
      files: { "index.php": `<?php\n$seconds = 754;\n\n$minutes = 0; // fix me\n$rest = 0;    // fix me\n\necho "$minutes min $rest s";\n` },
      solution: { "index.php": `<?php\n$seconds = 754;\n\n$minutes = intdiv($seconds, 60);\n$rest = $seconds % 60;\n\necho "$minutes min $rest s";\n` },
      objectives: [
        {
          id: "convert",
          label: L("Print: 12 min 34 s", "Afficher : 12 min 34 s"),
          check: all(outputIs("12 min 34 s"), uses(/%/)),
          hints: [
            L("Minutes: how many whole 60s fit in 754. Seconds: what's left over.", "Minutes : combien de 60 entiers tiennent dans 754. Secondes : ce qui reste."),
            L("`intdiv($seconds, 60)` and `$seconds % 60`.", "`intdiv($seconds, 60)` et `$seconds % 60`."),
            L("`$minutes = intdiv($seconds, 60);` and `$rest = $seconds % 60;`", "`$minutes = intdiv($seconds, 60);` et `$rest = $seconds % 60;`"),
          ],
        },
      ],
      cheat: "basics",
    },
    {
      kind: "discover",
      title: L("Type juggling", "Les conversions automatiques"),
      body: [
        L(
          "PHP converts types on the fly when it can: `\"5\" + 3` gives `8`, because the string looks like a number. This is called **type juggling**.",
          "PHP convertit les types à la volée quand il peut : `\"5\" + 3` donne `8`, parce que la chaîne ressemble à un nombre. On appelle ça le **type juggling**.",
        ),
        L(
          "You can also convert explicitly with a cast: `(int) \"42\"`, `(float) \"3.5\"`, `(string) 10`, `(bool) 0`. Be explicit: it makes your intent clear.",
          "Tu peux aussi convertir explicitement avec un cast : `(int) \"42\"`, `(float) \"3.5\"`, `(string) 10`, `(bool) 0`. Sois explicite : ton intention est plus claire.",
        ),
      ],
      example: { code: `<?php\nvar_dump("5" + 3);\nvar_dump((int) "42 apples");\nvar_dump((bool) 0, (bool) "0", (bool) "hello");\nvar_dump("10" . 5);\n` },
      callout: {
        tone: "version",
        text: L(
          "Since PHP 8, `\"abc\" + 1` throws a TypeError, and `\"5 apples\" + 1` gives a warning. PHP 7 silently turned them into numbers. You'll compare both later in the course.",
          "Depuis PHP 8, `\"abc\" + 1` lève une TypeError, et `\"5 apples\" + 1` donne un avertissement. PHP 7 les transformait en nombres sans rien dire. Tu compareras les deux plus loin dans le cours.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Predict the result", "Devine le résultat"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$a = "3";\n$b = 4;\necho $a . $b, " ", $a + $b;\n`,
      options: ["7 7", "34 34", "34 7", "7 34"],
      answer: 2,
      explain: L(
        "The dot joins text: \"3\" . 4 gives \"34\". The plus adds numbers: \"3\" is converted to 3, so 3 + 4 gives 7.",
        "Le point colle du texte : \"3\" . 4 donne \"34\". Le plus additionne : \"3\" est converti en 3, donc 3 + 4 donne 7.",
      ),
    },
    {
      kind: "challenge",
      title: L("Pizza party", "Soirée pizza"),
      body: L(
        "12 friends, each eats 3 slices, a pizza has 8 slices and costs 11.50. Compute how many pizzas to order (round **up**) and the price per person rounded to 2 decimals. Print `Pizzas: 5` then `Per person: 4.79`.",
        "12 amis, chacun mange 3 parts, une pizza a 8 parts et coûte 11.50. Calcule combien de pizzas commander (arrondi **au-dessus**) et le prix par personne arrondi à 2 décimales. Affiche `Pizzas: 5` puis `Per person: 4.79`.",
      ),
      files: { "index.php": `<?php\n$friends = 12;\n$slicesEach = 3;\n$slicesPerPizza = 8;\n$pizzaPrice = 11.50;\n\n` },
      solution: {
        "index.php": `<?php\n$friends = 12;\n$slicesEach = 3;\n$slicesPerPizza = 8;\n$pizzaPrice = 11.50;\n\n$pizzas = (int) ceil($friends * $slicesEach / $slicesPerPizza);\n$perPerson = round($pizzas * $pizzaPrice / $friends, 2);\necho "Pizzas: $pizzas\\n";\necho "Per person: $perPerson";\n`,
      },
      objectives: [
        {
          id: "pizzas",
          label: L("Print: Pizzas: 5", "Afficher : Pizzas: 5"),
          check: outputHas(/^Pizzas: 5$/m),
          hints: [
            L("36 slices are needed; 36 / 8 = 4.5, and you can't order half a pizza.", "Il faut 36 parts ; 36 / 8 = 4.5, et on ne commande pas une demi-pizza."),
            L("`ceil()` rounds up. Cast to int so it prints `5` and not `5.0`… or just let echo print it.", "`ceil()` arrondit au-dessus. Convertis en int pour afficher `5`… ou laisse echo l'afficher."),
            L("`$pizzas = (int) ceil($friends * $slicesEach / $slicesPerPizza);` then `echo \"Pizzas: $pizzas\\n\";`", "`$pizzas = (int) ceil($friends * $slicesEach / $slicesPerPizza);` puis `echo \"Pizzas: $pizzas\\n\";`"),
          ],
        },
        {
          id: "price",
          label: L("Print: Per person: 4.79", "Afficher : Per person: 4.79"),
          check: outputHas(/^Per person: 4\.79$/m),
          hints: [
            L("Total price = pizzas × price; then share it between the friends.", "Prix total = pizzas × prix ; puis partage-le entre les amis."),
            L("5 × 11.50 = 57.5, / 12 = 4.7916…; `round(…, 2)` keeps two decimals.", "5 × 11.50 = 57.5, / 12 = 4.7916… ; `round(…, 2)` garde deux décimales."),
            L("`$perPerson = round($pizzas * $pizzaPrice / $friends, 2);` then `echo \"Per person: $perPerson\";`", "`$perPerson = round($pizzas * $pizzaPrice / $friends, 2);` puis `echo \"Per person: $perPerson\";`"),
          ],
        },
      ],
      cheat: "basics",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`+ - * / % **` with the usual priority; parentheses change it.", "`+ - * / % **` avec la priorité habituelle ; les parenthèses la changent."),
    L("`/` can give a float; `intdiv()` and `%` give the whole part and the remainder.", "`/` peut donner un float ; `intdiv()` et `%` donnent la partie entière et le reste."),
    L("Floats are approximate: round for display, use integer cents for money.", "Les floats sont approximatifs : arrondis pour l'affichage, utilise des centimes entiers pour l'argent."),
    L("PHP converts types automatically; casts like `(int)` make it explicit.", "PHP convertit les types automatiquement ; les casts comme `(int)` le rendent explicite."),
  ],
};

export const BASICS = [helloPhp, variables, strings, numbers];
