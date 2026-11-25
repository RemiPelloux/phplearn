import { L } from "@/lib/txt";
import { all, avoids, clean, outputIs, outputLines, uses } from "../checks";
import type { Check, Lesson } from "../types";

const CH = "control";

/** Non-empty output lines, trimmed. */
const lines = (out: string) =>
  out
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l !== "");

const fizz = (n: number) => (n % 15 === 0 ? "FizzBuzz" : n % 3 === 0 ? "Fizz" : n % 5 === 0 ? "Buzz" : String(n));

/** Lines 1..20 of FizzBuzz, as far as `rule` says (e.g. only check the Fizz lines). */
const fizzLines =
  (pick: (n: number) => boolean): Check =>
  (c) => {
    const got = lines(c.out);
    for (let n = 1; n <= 20; n++) if (pick(n) && got[n - 1] !== fizz(n)) return false;
    return got.length >= 20;
  };

export const conditions: Lesson = {
  id: "conditions",
  chapterId: CH,
  title: L("Making decisions", "Prendre des décisions"),
  tagline: L("if, elseif, else and combining conditions", "if, elseif, else et conditions combinées"),
  xp: 50,
  syntax: ["if", "elseif", "else", "&&", "||", "!", "< > <= >="],
  doc: "guide-control-flow",
  steps: [
    {
      kind: "discover",
      title: L("Code that chooses", "Du code qui choisit"),
      body: [
        L(
          "So far your scripts ran every line, top to bottom. Real programs need to **choose**: show a discount only to members, refuse a password that's too short, say \"Good morning\" or \"Good evening\".",
          "Jusqu'ici tes scripts exécutaient chaque ligne, de haut en bas. Les vrais programmes doivent **choisir** : montrer une remise seulement aux membres, refuser un mot de passe trop court, dire « Bonjour » ou « Bonsoir ».",
        ),
        L(
          "`if (condition) { … }` runs the block between braces only when the condition is `true`. `else { … }` runs when it's `false`. The condition is usually a comparison: `<`, `>`, `<=`, `>=`.",
          "`if (condition) { … }` exécute le bloc entre accolades seulement si la condition vaut `true`. `else { … }` s'exécute quand elle vaut `false`. La condition est souvent une comparaison : `<`, `>`, `<=`, `>=`.",
        ),
      ],
      example: {
        code: `<?php\n$temperature = 28;\n\nif ($temperature > 25) {\n    echo "It's hot: wear a t-shirt.";\n} else {\n    echo "Take a jacket.";\n}\n`,
        caption: L("Change 28 to 12 and run it again.", "Remplace 28 par 12 et relance."),
      },
    },
    {
      kind: "discover",
      title: L("More than two choices", "Plus de deux choix"),
      body: [
        L(
          "`elseif` adds another test. PHP checks the conditions **in order** and runs the first block whose condition is true, then skips the rest. That's why the order of your tests matters.",
          "`elseif` ajoute un autre test. PHP vérifie les conditions **dans l'ordre** et exécute le premier bloc dont la condition est vraie, puis saute le reste. C'est pour ça que l'ordre des tests compte.",
        ),
        L(
          "Combine conditions with `&&` (and: both must be true), `||` (or: at least one), and `!` (not: flips true and false). Parentheses make complex conditions readable.",
          "Combine des conditions avec `&&` (et : les deux doivent être vraies), `||` (ou : au moins une), et `!` (non : inverse vrai et faux). Les parenthèses rendent les conditions complexes lisibles.",
        ),
      ],
      example: {
        code: `<?php\n$age = 16;\n$withParent = true;\n\nif ($age >= 18) {\n    echo "You can watch the movie.\\n";\n} elseif ($age >= 12 && $withParent) {\n    echo "OK, with a parent.\\n";\n} else {\n    echo "Sorry, too young.\\n";\n}\n\n$isWeekend = false;\nif (!$isWeekend) {\n    echo "Back to work!";\n}\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "`=` assigns, `==` and `===` compare. Writing `if ($age = 18)` sets `$age` to 18 and is always true: a classic bug.",
          "`=` affecte, `==` et `===` comparent. Écrire `if ($age = 18)` met `$age` à 18 et c'est toujours vrai : un bug classique.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Watch PHP skip blocks", "Regarde PHP sauter des blocs"),
      body: L(
        "Step through this grading script. Notice the arrow jumps straight to the right branch: the other blocks never run.",
        "Avance dans ce script de notation. Remarque que la flèche saute directement à la bonne branche : les autres blocs ne s'exécutent jamais.",
      ),
      code: `<?php\n$score = 74;\n$grade = "?";\n\nif ($score >= 90) {\n    $grade = "A";\n} elseif ($score >= 70) {\n    $grade = "B";\n} else {\n    $grade = "C";\n}\n\necho "Score $score: grade $grade";\n`,
      notes: {
        2: L("The score to grade: 74.", "La note à évaluer : 74."),
        8: L("74 >= 90 was false, 74 >= 70 is true: this block runs and the rest is skipped.", "74 >= 90 était faux, 74 >= 70 est vrai : ce bloc s'exécute et le reste est sauté."),
        13: L("Lines 6 and 10 never ran. Only one branch of an if/elseif/else runs.", "Les lignes 6 et 10 ne se sont jamais exécutées. Une seule branche d'un if/elseif/else s'exécute."),
      },
    },
    {
      kind: "quiz",
      title: L("Which branch?", "Quelle branche ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$points = 50;\nif ($points > 10) {\n    echo "bronze";\n} elseif ($points > 40) {\n    echo "gold";\n} else {\n    echo "none";\n}\n`,
      options: ["gold", "bronze", "bronzegold", "none"],
      answer: 1,
      explain: L(
        "50 > 10 is already true, so the first block runs and PHP skips the rest, even though 50 > 40 is also true. Put the strictest test first: `> 40` before `> 10`.",
        "50 > 10 est déjà vrai, donc le premier bloc s'exécute et PHP saute le reste, même si 50 > 40 est vrai aussi. Mets le test le plus strict en premier : `> 40` avant `> 10`.",
      ),
    },
    {
      kind: "try",
      title: L("Adult or minor?", "Majeur ou mineur ?"),
      body: L(
        "Print `Minor` when `$age` is under 18, and `Adult` otherwise. Use an `if` / `else`, then change the age to check both branches.",
        "Affiche `Minor` quand `$age` est inférieur à 18, et `Adult` sinon. Utilise un `if` / `else`, puis change l'âge pour vérifier les deux branches.",
      ),
      files: { "index.php": `<?php\n$age = 15;\n\n// Print "Minor" or "Adult"\n` },
      solution: { "index.php": `<?php\n$age = 15;\n\nif ($age < 18) {\n    echo "Minor";\n} else {\n    echo "Adult";\n}\n` },
      objectives: [
        {
          id: "minor",
          label: L("With $age = 15, it prints: Minor", "Avec $age = 15, ça affiche : Minor"),
          check: all(outputIs("Minor"), uses(/\bif\s*\(/), uses(/\belse\b/), uses(/\$age\s*=\s*15\b/)),
          hints: [
            L("You need a condition on `$age` and two blocks: one for each answer.", "Il te faut une condition sur `$age` et deux blocs : un par réponse."),
            L("`if ($age < 18) { echo \"Minor\"; } else { … }`", "`if ($age < 18) { echo \"Minor\"; } else { … }`"),
            L("Write `if ($age < 18) {` then `echo \"Minor\";` then `} else {` then `echo \"Adult\";` then `}`. Keep `$age = 15`.", "Écris `if ($age < 18) {` puis `echo \"Minor\";` puis `} else {` puis `echo \"Adult\";` puis `}`. Garde `$age = 15`."),
          ],
        },
      ],
      cheat: "control",
    },
    {
      kind: "challenge",
      title: L("Cinema ticket", "Billet de cinéma"),
      body: L(
        "Prices: children under 12 pay 5, seniors (65 and over) pay 6, students pay 7, everyone else pays 10. A child or a senior who is also a student still pays the child or senior price. Print `Price: 7` for the values given, and use `&&` or `||` somewhere.",
        "Tarifs : les enfants de moins de 12 ans paient 5, les seniors (65 ans et plus) 6, les étudiants 7, tous les autres 10. Un enfant ou un senior qui est aussi étudiant paie quand même le tarif enfant ou senior. Affiche `Price: 7` pour les valeurs données, et utilise `&&` ou `||` quelque part.",
      ),
      files: { "index.php": `<?php\n$age = 22;\n$isStudent = true;\n\n$price = 10;\n// Decide the price here\n\necho "Price: $price";\n` },
      solution: {
        "index.php": `<?php\n$age = 22;\n$isStudent = true;\n\nif ($age < 12) {\n    $price = 5;\n} elseif ($age >= 65) {\n    $price = 6;\n} elseif ($isStudent && $age >= 12) {\n    $price = 7;\n} else {\n    $price = 10;\n}\n\necho "Price: $price";\n`,
      },
      objectives: [
        {
          id: "price",
          label: L("With age 22 and a student: Price: 7", "Avec 22 ans et étudiant : Price: 7"),
          check: all(outputIs("Price: 7"), uses(/\$age\s*=\s*22\b/), uses(/\bif\s*\(/)),
          hints: [
            L("Test the special cases from the most specific to the most general: child, senior, student, then everyone else.", "Teste les cas particuliers du plus précis au plus général : enfant, senior, étudiant, puis tout le monde."),
            L("`if ($age < 12) { … } elseif ($age >= 65) { … } elseif ($isStudent) { … } else { … }`", "`if ($age < 12) { … } elseif ($age >= 65) { … } elseif ($isStudent) { … } else { … }`"),
            L("Set `$price = 5;`, `6`, `7` or `10` in each block, and keep the final `echo`.", "Mets `$price = 5;`, `6`, `7` ou `10` dans chaque bloc, et garde le `echo` final."),
          ],
        },
        {
          id: "logic",
          label: L("Use && or || in a condition", "Utiliser && ou || dans une condition"),
          check: uses(/&&|\|\||\band\b|\bor\b/),
          hints: [
            L("A student discount only makes sense for someone who isn't a child or a senior.", "Le tarif étudiant n'a de sens que pour quelqu'un qui n'est ni enfant ni senior."),
            L("`$isStudent && $age >= 12` is true only when both parts are true.", "`$isStudent && $age >= 12` n'est vrai que si les deux parties sont vraies."),
            L("Write the student test as `elseif ($isStudent && $age >= 12) {`.", "Écris le test étudiant comme `elseif ($isStudent && $age >= 12) {`."),
          ],
        },
      ],
      cheat: "control",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`if` runs a block only when its condition is true; `else` handles the other case.", "`if` exécute un bloc seulement si sa condition est vraie ; `else` gère l'autre cas."),
    L("With `elseif`, only the first true branch runs, so order your tests from strictest to loosest.", "Avec `elseif`, seule la première branche vraie s'exécute : ordonne les tests du plus strict au plus large."),
    L("`&&` (and), `||` (or) and `!` (not) combine conditions.", "`&&` (et), `||` (ou) et `!` (non) combinent des conditions."),
    L("`=` assigns, comparisons use `==`, `===`, `<`, `>`…", "`=` affecte, les comparaisons utilisent `==`, `===`, `<`, `>`…"),
  ],
};

export const comparisons: Lesson = {
  id: "comparisons",
  chapterId: CH,
  title: L("Comparing values", "Comparer des valeurs"),
  tagline: L("== vs ===, truthy and falsy, and the spaceship <=>", "== contre ===, valeurs vraies et fausses, et le vaisseau <=>"),
  xp: 50,
  syntax: ["==", "===", "!=", "!==", "<=>", "strcmp"],
  doc: "guide-control-flow",
  steps: [
    {
      kind: "discover",
      title: L("Loose == or strict ===?", "Souple == ou strict === ?"),
      body: [
        L(
          "PHP has two ways to test equality. `==` (loose) converts the values to a common type first, so `1 == \"1\"` is true. `===` (strict) also compares the **types**: `1 === \"1\"` is false, because one is an int and the other a string.",
          "PHP a deux façons de tester l'égalité. `==` (souple) convertit d'abord les valeurs vers un type commun, donc `1 == \"1\"` est vrai. `===` (strict) compare aussi les **types** : `1 === \"1\"` est faux, car l'un est un int et l'autre une chaîne.",
        ),
        L(
          "Loose comparison hides surprises. The rule of thumb used by most PHP teams: **use `===` and `!==` by default**, and only use `==` when you really want the conversion.",
          "La comparaison souple cache des surprises. La règle de la plupart des équipes PHP : **utilise `===` et `!==` par défaut**, et `==` seulement quand tu veux vraiment la conversion.",
        ),
      ],
      example: {
        code: `<?php\nvar_dump(1 == "1");\nvar_dump(1 === "1");\nvar_dump("10" == "1e1");\nvar_dump(100 == "1e2");\nvar_dump(null == false);\nvar_dump(null === false);\n`,
        caption: L("\"1e1\" is scientific notation for 10: loose comparison treats both as numbers.", "« 1e1 » est la notation scientifique de 10 : la comparaison souple traite les deux comme des nombres."),
      },
      callout: {
        tone: "version",
        text: L(
          "In PHP 7, `0 == \"a\"` was **true** (the string became 0). PHP 8 compares a number and a non-numeric string as strings, so it's now false. Same code, different answer: one more reason to prefer `===`.",
          "En PHP 7, `0 == \"a\"` était **vrai** (la chaîne devenait 0). PHP 8 compare un nombre et une chaîne non numérique comme des chaînes, donc c'est maintenant faux. Même code, réponse différente : une raison de plus de préférer `===`.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Truthy and falsy", "Vrai-ish et faux-ish"),
      body: [
        L(
          "`if` doesn't need a real bool: PHP converts the value. These count as **false**: `false`, `0`, `0.0`, `\"\"` (empty string), `\"0\"`, `[]` (empty array) and `null`. Everything else is true, even `\"false\"` or `\" \"`.",
          "`if` n'a pas besoin d'un vrai booléen : PHP convertit la valeur. Comptent comme **faux** : `false`, `0`, `0.0`, `\"\"` (chaîne vide), `\"0\"`, `[]` (tableau vide) et `null`. Tout le reste est vrai, même `\"false\"` ou `\" \"`.",
        ),
        L(
          "Watch out for `\"0\"`: a form field where the user typed 0 is falsy. When 0 is a valid answer, test explicitly: `if ($qty !== \"\")`.",
          "Attention à `\"0\"` : un champ de formulaire où l'utilisateur a tapé 0 est faux. Quand 0 est une réponse valable, teste explicitement : `if ($qty !== \"\")`.",
        ),
      ],
      example: {
        code: `<?php\n$values = [0, "0", "", "false", " ", null, [], 0.0, "abc"];\nforeach ($values as $v) {\n    echo var_export($v, true), " is ", $v ? "truthy" : "falsy", "\\n";\n}\n`,
        caption: L("`? :` is the ternary operator: condition ? if-true : if-false.", "`? :` est l'opérateur ternaire : condition ? si-vrai : si-faux."),
      },
    },
    {
      kind: "quiz",
      title: L("Loose or strict?", "Souple ou strict ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nvar_dump(1 == "1", 1 === "1");\n`,
      options: ["bool(true)\nbool(true)", "bool(true)\nbool(false)", "bool(false)\nbool(false)", "bool(false)\nbool(true)"],
      answer: 1,
      explain: L(
        "`==` converts \"1\" to the number 1, so they're equal. `===` sees an int and a string: different types, so false.",
        "`==` convertit « 1 » en nombre 1, donc ils sont égaux. `===` voit un int et une chaîne : types différents, donc faux.",
      ),
    },
    {
      kind: "try",
      title: L("Secure the door", "Sécurise la porte"),
      body: L(
        "The secret code is the int `7`. The user typed `\"007\"`. With loose `==`, PHP converts \"007\" to 7 and lets them in! Fix the comparison so it prints `Access denied`.",
        "Le code secret est l'entier `7`. L'utilisateur a tapé `\"007\"`. Avec le `==` souple, PHP convertit « 007 » en 7 et le laisse entrer ! Corrige la comparaison pour que ça affiche `Access denied`.",
      ),
      files: { "index.php": `<?php\n$secret = 7;\n$typed = "007";\n\nif ($typed == $secret) {\n    echo "Access granted";\n} else {\n    echo "Access denied";\n}\n` },
      solution: { "index.php": `<?php\n$secret = 7;\n$typed = "007";\n\nif ($typed === $secret) {\n    echo "Access granted";\n} else {\n    echo "Access denied";\n}\n` },
      objectives: [
        {
          id: "strict",
          label: L("Use === and print: Access denied", "Utiliser === et afficher : Access denied"),
          check: all(outputIs("Access denied"), uses(/===/), uses(/\$typed\s*=\s*"007"/)),
          hints: [
            L("The values look equal once converted, but their types differ.", "Les valeurs semblent égales une fois converties, mais leurs types diffèrent."),
            L("The strict operator compares type and value: `===`.", "L'opérateur strict compare le type et la valeur : `===`."),
            L("On line 5, replace `==` with `===`.", "Ligne 5, remplace `==` par `===`."),
          ],
        },
      ],
      cheat: "control",
    },
    {
      kind: "discover",
      title: L("The spaceship <=> and comparing text", "Le vaisseau <=> et comparer du texte"),
      body: [
        L(
          "`$a <=> $b` (the \"spaceship\" operator, PHP 7.0+) returns `-1` if `$a` is smaller, `0` if they're equal, `1` if `$a` is bigger. It's exactly what sorting functions need, as you'll see with arrays.",
          "`$a <=> $b` (l'opérateur « vaisseau spatial », PHP 7.0+) renvoie `-1` si `$a` est plus petit, `0` s'ils sont égaux, `1` si `$a` est plus grand. C'est exactement ce dont les fonctions de tri ont besoin, tu le verras avec les tableaux.",
        ),
        L(
          "Strings compare character by character, like a dictionary: `\"apple\" < \"banana\"`. Careful: uppercase letters come before lowercase ones (`\"Zoe\" < \"adam\"`). `strcmp()` and `strcasecmp()` (ignores case) give the same -/0/+ answer.",
          "Les chaînes se comparent caractère par caractère, comme un dictionnaire : `\"apple\" < \"banana\"`. Attention : les majuscules passent avant les minuscules (`\"Zoe\" < \"adam\"`). `strcmp()` et `strcasecmp()` (ignore la casse) donnent la même réponse -/0/+.",
        ),
      ],
      example: {
        code: `<?php\necho 3 <=> 5, "\\n";\necho 5 <=> 5, "\\n";\necho 9 <=> 5, "\\n";\nvar_dump("apple" < "banana");\nvar_dump("Zoe" < "adam");\necho strcasecmp("Zoe", "adam") > 0 ? "Zoe after adam" : "Zoe before adam";\n`,
      },
    },
    {
      kind: "challenge",
      title: L("Who wins?", "Qui gagne ?"),
      body: L(
        "Compare the two scores with the spaceship operator. Print the result on the first line (`Result: 1`), then on the second line `Alice wins`, `Bob wins` or `Draw` depending on that result.",
        "Compare les deux scores avec l'opérateur vaisseau spatial. Affiche le résultat sur la première ligne (`Result: 1`), puis sur la deuxième `Alice wins`, `Bob wins` ou `Draw` selon ce résultat.",
      ),
      files: { "index.php": `<?php\n$alice = 42;\n$bob = 37;\n\n$result = 0; // use <=> here\necho "Result: $result\\n";\n` },
      solution: {
        "index.php": `<?php\n$alice = 42;\n$bob = 37;\n\n$result = $alice <=> $bob;\necho "Result: $result\\n";\n\nif ($result === 1) {\n    echo "Alice wins";\n} elseif ($result === -1) {\n    echo "Bob wins";\n} else {\n    echo "Draw";\n}\n`,
      },
      objectives: [
        {
          id: "spaceship",
          label: L("First line: Result: 1, computed with <=>", "Première ligne : Result: 1, calculé avec <=>"),
          check: all((c) => lines(c.out)[0] === "Result: 1", uses(/<=>/)),
          hints: [
            L("The spaceship operator compares two values and gives -1, 0 or 1.", "L'opérateur vaisseau compare deux valeurs et donne -1, 0 ou 1."),
            L("`$result = $alice <=> $bob;`", "`$result = $alice <=> $bob;`"),
            L("Replace `$result = 0;` with `$result = $alice <=> $bob;`.", "Remplace `$result = 0;` par `$result = $alice <=> $bob;`."),
          ],
        },
        {
          id: "winner",
          label: L("Second line: Alice wins (decided from $result)", "Deuxième ligne : Alice wins (décidé à partir de $result)"),
          check: all((c) => lines(c.out)[1] === "Alice wins", uses(/if\s*\(\s*\$result/)),
          hints: [
            L("Three possible results, three possible messages.", "Trois résultats possibles, trois messages possibles."),
            L("`if ($result === 1) { … } elseif ($result === -1) { … } else { … }`", "`if ($result === 1) { … } elseif ($result === -1) { … } else { … }`"),
            L("Add an if/elseif/else on `$result` that echoes `Alice wins`, `Bob wins` or `Draw`.", "Ajoute un if/elseif/else sur `$result` qui affiche `Alice wins`, `Bob wins` ou `Draw`."),
          ],
        },
      ],
      cheat: "control",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`==` converts types before comparing; `===` compares type and value. Prefer `===`.", "`==` convertit les types avant de comparer ; `===` compare type et valeur. Préfère `===`."),
    L("Falsy values: false, 0, 0.0, \"\", \"0\", [] and null. Everything else is truthy.", "Valeurs fausses : false, 0, 0.0, \"\", \"0\", [] et null. Tout le reste est vrai."),
    L("`<=>` returns -1, 0 or 1: the building block of sorting.", "`<=>` renvoie -1, 0 ou 1 : la brique de base du tri."),
    L("PHP 8 changed how numbers compare to non-numeric strings: `0 == \"a\"` is now false.", "PHP 8 a changé la comparaison des nombres avec les chaînes non numériques : `0 == \"a\"` est maintenant faux."),
  ],
};

export const matchSwitch: Lesson = {
  id: "match-switch",
  chapterId: CH,
  title: L("switch and match", "switch et match"),
  tagline: L("Pick one value among many, the old and the modern way", "Choisir une valeur parmi plusieurs, à l'ancienne et à la moderne"),
  xp: 50,
  syntax: ["switch", "case", "break", "default", "match", "=>"],
  doc: "guide-control-flow",
  steps: [
    {
      kind: "discover",
      title: L("switch: many cases, one variable", "switch : plusieurs cas, une variable"),
      body: [
        L(
          "When you compare one variable against many possible values, a long `if / elseif` chain gets noisy. `switch` lists the cases instead: PHP jumps to the matching `case` and runs from there.",
          "Quand tu compares une variable à beaucoup de valeurs possibles, une longue chaîne de `if / elseif` devient lourde. `switch` liste les cas à la place : PHP saute au `case` qui correspond et exécute à partir de là.",
        ),
        L(
          "The catch: switch keeps running into the next cases until it meets `break`. Forget one `break` and two cases run. That's called **fall-through**. `default` handles every other value.",
          "Le piège : switch continue d'exécuter les cas suivants jusqu'à rencontrer `break`. Oublie un `break` et deux cas s'exécutent. On appelle ça le **fall-through**. `default` gère toutes les autres valeurs.",
        ),
      ],
      example: {
        code: `<?php\n$day = "sat";\n\nswitch ($day) {\n    case "sat":\n    case "sun":\n        echo "Weekend!";\n        break;\n    case "mon":\n        echo "Back to work.";\n        break;\n    default:\n        echo "Weekday.";\n}\n`,
        caption: L("Two cases with no code between them share the same block: that fall-through is on purpose.", "Deux cas sans code entre eux partagent le même bloc : ce fall-through-là est voulu."),
      },
    },
    {
      kind: "watch",
      title: L("The missing break", "Le break oublié"),
      body: L(
        "Here a `break` is missing. Step through and watch PHP fall from the \"orange\" case straight into the \"red\" one.",
        "Ici il manque un `break`. Avance pas à pas et regarde PHP tomber du cas « orange » directement dans le cas « red ».",
      ),
      code: `<?php\n$light = "orange";\n$action = "";\n\nswitch ($light) {\n    case "green":\n        $action = "go";\n        break;\n    case "orange":\n        $action = "slow down";\n    case "red":\n        $action = "stop";\n        break;\n}\n\necho "Action: $action";\n`,
      notes: {
        10: L("The orange case runs: $action becomes \"slow down\"…", "Le cas orange s'exécute : $action devient « slow down »…"),
        12: L("…but there's no break, so the red case runs too and overwrites it!", "…mais il n'y a pas de break, donc le cas red s'exécute aussi et l'écrase !"),
        16: L("Result: \"stop\". A bug caused by one missing line.", "Résultat : « stop ». Un bug causé par une seule ligne manquante."),
      },
    },
    {
      kind: "discover",
      title: L("match: the modern switch", "match : le switch moderne"),
      body: [
        L(
          "PHP 8.0 added `match`. It's an **expression**: it returns a value you can store or echo. Each arm is `value => result`, there's no `break` and no fall-through, and several values can share an arm with commas.",
          "PHP 8.0 a ajouté `match`. C'est une **expression** : elle renvoie une valeur que tu peux ranger ou afficher. Chaque branche s'écrit `valeur => résultat`, il n'y a ni `break` ni fall-through, et plusieurs valeurs peuvent partager une branche avec des virgules.",
        ),
        L(
          "`match` compares with `===` (strict), and if no arm matches and there's no `default`, it throws an `UnhandledMatchError` instead of silently doing nothing. Errors you can see are errors you can fix.",
          "`match` compare avec `===` (strict), et si aucune branche ne correspond et qu'il n'y a pas de `default`, il lève une `UnhandledMatchError` au lieu de ne rien faire en silence. Une erreur visible est une erreur qu'on peut corriger.",
        ),
      ],
      examples: [
        {
          code: `<?php\n$day = "sun";\n\n$kind = match ($day) {\n    "sat", "sun" => "Weekend!",\n    "mon" => "Back to work.",\n    default => "Weekday.",\n};\n\necho $kind;\n`,
        },
        {
          code: `<?php\n$size = "XL";\necho match ($size) {\n    "S" => "small",\n    "M" => "medium",\n    "L" => "large",\n};\n`,
          caption: L("No arm for \"XL\" and no default: look at the Problems tab.", "Pas de branche pour « XL » ni de default : regarde l'onglet Problèmes."),
        },
      ],
      callout: {
        tone: "version",
        text: L(
          "`match` only exists since PHP 8.0. On PHP 7.4 the same code is a Parse error. Switch the version picker to 7.4 and run it to see.",
          "`match` n'existe que depuis PHP 8.0. En PHP 7.4, le même code est une Parse error. Passe le sélecteur de version sur 7.4 et exécute-le pour voir.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Strict match", "match est strict"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$x = "1";\necho match ($x) {\n    1 => "int",\n    "1" => "string",\n    default => "other",\n};\n`,
      options: ["int", "string", "other", "1"],
      answer: 1,
      explain: L(
        "`match` uses `===`: the string \"1\" is not identical to the int 1, so the second arm wins. A `switch` (loose `==`) would have picked the first one.",
        "`match` utilise `===` : la chaîne « 1 » n'est pas identique à l'entier 1, donc c'est la deuxième branche. Un `switch` (`==` souple) aurait choisi la première.",
      ),
    },
    {
      kind: "try",
      title: L("From switch to match", "De switch à match"),
      body: L(
        "Rewrite this `switch` as a `match` expression stored in `$name`. The output must stay `Wednesday`, and there should be no `switch` left.",
        "Réécris ce `switch` en une expression `match` rangée dans `$name`. La sortie doit rester `Wednesday`, et il ne doit plus y avoir de `switch`.",
      ),
      files: {
        "index.php": `<?php\n$n = 3;\n\nswitch ($n) {\n    case 1:\n        $name = "Monday";\n        break;\n    case 2:\n        $name = "Tuesday";\n        break;\n    case 3:\n        $name = "Wednesday";\n        break;\n    default:\n        $name = "Another day";\n}\n\necho $name;\n`,
      },
      solution: {
        "index.php": `<?php\n$n = 3;\n\n$name = match ($n) {\n    1 => "Monday",\n    2 => "Tuesday",\n    3 => "Wednesday",\n    default => "Another day",\n};\n\necho $name;\n`,
      },
      objectives: [
        {
          id: "match",
          label: L("Use match (no switch) and print: Wednesday", "Utiliser match (sans switch) et afficher : Wednesday"),
          check: all(outputIs("Wednesday"), uses(/\bmatch\s*\(/), avoids(/\bswitch\s*\(/)),
          hints: [
            L("Each `case X: $name = Y; break;` becomes one arm `X => Y,`.", "Chaque `case X: $name = Y; break;` devient une branche `X => Y,`."),
            L("`$name = match ($n) { 1 => \"Monday\", …, default => \"Another day\" };`", "`$name = match ($n) { 1 => \"Monday\", …, default => \"Another day\" };`"),
            L("Replace the whole switch with `$name = match ($n) {` then the four arms `1 => \"Monday\",` `2 => \"Tuesday\",` `3 => \"Wednesday\",` `default => \"Another day\",` then `};`.", "Remplace tout le switch par `$name = match ($n) {` puis les quatre branches `1 => \"Monday\",` `2 => \"Tuesday\",` `3 => \"Wednesday\",` `default => \"Another day\",` puis `};`."),
          ],
        },
      ],
      cheat: "control",
    },
    {
      kind: "discover",
      title: L("match (true) for ranges", "match (true) pour des intervalles"),
      body: [
        L(
          "`match` compares values, so how do you test ranges like \"between 18 and 25\"? Match on `true`: each arm is a condition, and the first one that is `true` wins.",
          "`match` compare des valeurs, alors comment tester des intervalles comme « entre 18 et 25 » ? Fais un match sur `true` : chaque branche est une condition, et la première qui vaut `true` gagne.",
        ),
      ],
      example: {
        code: `<?php\n$temp = 31;\n\necho match (true) {\n    $temp < 0 => "Freezing",\n    $temp < 15 => "Cold",\n    $temp < 25 => "Mild",\n    default => "Hot",\n};\n`,
      },
    },
    {
      kind: "challenge",
      title: L("Status board", "Tableau de statuts"),
      body: L(
        "Print two lines with two `match` expressions. Line 1: the HTTP status as `404: Not Found` (200 → OK, 301 and 302 → Redirect, 404 → Not Found, anything else → Error). Line 2: the battery level as a word (below 20 → Low, below 80 → OK, otherwise Full), so `Battery: Low`.",
        "Affiche deux lignes avec deux expressions `match`. Ligne 1 : le statut HTTP sous la forme `404: Not Found` (200 → OK, 301 et 302 → Redirect, 404 → Not Found, sinon → Error). Ligne 2 : le niveau de batterie en mot (moins de 20 → Low, moins de 80 → OK, sinon Full), donc `Battery: Low`.",
      ),
      files: { "index.php": `<?php\n$status = 404;\n$battery = 12;\n\n// Line 1: "404: Not Found"\n\n// Line 2: "Battery: Low"\n` },
      solution: {
        "index.php": `<?php\n$status = 404;\n$battery = 12;\n\n$label = match ($status) {\n    200 => "OK",\n    301, 302 => "Redirect",\n    404 => "Not Found",\n    default => "Error",\n};\necho "$status: $label\\n";\n\n$level = match (true) {\n    $battery < 20 => "Low",\n    $battery < 80 => "OK",\n    default => "Full",\n};\necho "Battery: $level";\n`,
      },
      objectives: [
        {
          id: "status",
          label: L("Line 1: 404: Not Found", "Ligne 1 : 404: Not Found"),
          check: all((c) => lines(c.out)[0] === "404: Not Found", uses(/\bmatch\s*\(\s*\$status/)),
          hints: [
            L("One match on `$status`, with a shared arm for 301 and 302.", "Un match sur `$status`, avec une branche partagée pour 301 et 302."),
            L("`$label = match ($status) { 200 => \"OK\", 301, 302 => \"Redirect\", 404 => \"Not Found\", default => \"Error\" };`", "`$label = match ($status) { 200 => \"OK\", 301, 302 => \"Redirect\", 404 => \"Not Found\", default => \"Error\" };`"),
            L("Then `echo \"$status: $label\\n\";` (don't forget the new line).", "Puis `echo \"$status: $label\\n\";` (n'oublie pas le retour à la ligne)."),
          ],
        },
        {
          id: "battery",
          label: L("Line 2: Battery: Low, using match (true)", "Ligne 2 : Battery: Low, avec match (true)"),
          check: all((c) => lines(c.out)[1] === "Battery: Low", uses(/\bmatch\s*\(\s*true\s*\)/)),
          hints: [
            L("Ranges need `match (true)` with a condition in each arm.", "Les intervalles demandent `match (true)` avec une condition dans chaque branche."),
            L("`match (true) { $battery < 20 => \"Low\", $battery < 80 => \"OK\", default => \"Full\" }`", "`match (true) { $battery < 20 => \"Low\", $battery < 80 => \"OK\", default => \"Full\" }`"),
            L("Store it in `$level`, then `echo \"Battery: $level\";`.", "Range-le dans `$level`, puis `echo \"Battery: $level\";`."),
          ],
        },
        {
          id: "clean",
          label: L("No errors", "Aucune erreur"),
          check: clean,
          hints: [
            L("An UnhandledMatchError means a value had no arm: add a `default`.", "Une UnhandledMatchError signifie qu'une valeur n'avait pas de branche : ajoute un `default`."),
            L("Each match ends with `};` (it's an expression inside a statement).", "Chaque match finit par `};` (c'est une expression dans une instruction)."),
            L("Check the Problems tab: it gives the line and the reason.", "Regarde l'onglet Problèmes : il donne la ligne et la raison."),
          ],
        },
      ],
      cheat: "control",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`switch` jumps to a matching case and runs until `break`; a missing break falls through.", "`switch` saute au cas correspondant et s'exécute jusqu'au `break` ; un break oublié fait tomber dans le cas suivant."),
    L("`match` (PHP 8.0+) returns a value, compares strictly and never falls through.", "`match` (PHP 8.0+) renvoie une valeur, compare strictement et ne tombe jamais dans le cas suivant."),
    L("Several values can share an arm: `301, 302 => …`.", "Plusieurs valeurs peuvent partager une branche : `301, 302 => …`."),
    L("No matching arm and no default: `UnhandledMatchError`. `match (true)` tests ranges.", "Aucune branche et pas de default : `UnhandledMatchError`. `match (true)` teste des intervalles."),
  ],
};

export const loops: Lesson = {
  id: "loops",
  chapterId: CH,
  title: L("Loops", "Les boucles"),
  tagline: L("while, do-while, for, foreach, break and continue", "while, do-while, for, foreach, break et continue"),
  xp: 50,
  syntax: ["while", "do … while", "for", "foreach", "break", "continue"],
  doc: "guide-control-flow",
  steps: [
    {
      kind: "discover",
      title: L("Repeat without copy-pasting", "Répéter sans copier-coller"),
      body: [
        L(
          "Printing 1 to 100 with 100 `echo` lines would be silly. A **loop** repeats a block as long as a condition is true. Each repetition is called an **iteration**.",
          "Afficher de 1 à 100 avec 100 lignes `echo`, ce serait idiot. Une **boucle** répète un bloc tant qu'une condition est vraie. Chaque répétition s'appelle une **itération**.",
        ),
        L(
          "`while (condition) { … }` checks the condition **before** each iteration. Something inside the loop must eventually make the condition false, or it never stops.",
          "`while (condition) { … }` vérifie la condition **avant** chaque itération. Quelque chose dans la boucle doit finir par rendre la condition fausse, sinon elle ne s'arrête jamais.",
        ),
      ],
      scene: "loop",
      example: { code: `<?php\n$i = 1;\nwhile ($i <= 5) {\n    echo "Lap $i\\n";\n    $i++;\n}\necho "Finished!";\n` },
      callout: {
        tone: "warn",
        text: L(
          "Forget `$i++` and the loop runs forever. Here the app stops a script after 300,000 steps and tells you; on a real server it would hang until a timeout.",
          "Oublie `$i++` et la boucle tourne à l'infini. Ici l'appli arrête un script après 300 000 étapes et te prévient ; sur un vrai serveur, il resterait bloqué jusqu'à un délai d'expiration.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("for and do-while", "for et do-while"),
      body: [
        L(
          "`for` packs the three parts of a counting loop on one line: `for (start; condition; step)`. Use it when you know how many times to repeat.",
          "`for` regroupe les trois parties d'une boucle qui compte sur une ligne : `for (début; condition; pas)`. Utilise-la quand tu sais combien de fois répéter.",
        ),
        L(
          "`do { … } while (condition);` checks the condition **after** the block, so it always runs at least once. Handy for \"try, then check if we should try again\".",
          "`do { … } while (condition);` vérifie la condition **après** le bloc, donc il s'exécute toujours au moins une fois. Pratique pour « essaie, puis vérifie s'il faut recommencer ».",
        ),
      ],
      examples: [
        { code: `<?php\nfor ($i = 10; $i >= 0; $i -= 2) {\n    echo $i, " ";\n}\n` },
        { code: `<?php\n$tries = 0;\ndo {\n    $tries++;\n    echo "Attempt $tries\\n";\n} while ($tries < 3);\n` },
      ],
    },
    {
      kind: "watch",
      title: L("Inside a for loop", "Dans une boucle for"),
      body: L(
        "Step through and watch `$i` and `$sum` in the Variables panel. The same line runs again and again, with different values each time.",
        "Avance pas à pas en surveillant `$i` et `$sum` dans le panneau Variables. La même ligne s'exécute encore et encore, avec des valeurs différentes à chaque fois.",
      ),
      code: `<?php\n$sum = 0;\nfor ($i = 1; $i <= 4; $i++) {\n    $sum += $i;\n}\necho "Sum: $sum";\n`,
      notes: {
        2: L("Start with an empty total.", "On commence avec un total vide."),
        4: L("Runs once per iteration: adds 1, then 2, then 3, then 4.", "S'exécute une fois par itération : ajoute 1, puis 2, puis 3, puis 4."),
        6: L("When $i reaches 5, the condition $i <= 4 is false: the loop ends and PHP continues here.", "Quand $i atteint 5, la condition $i <= 4 est fausse : la boucle s'arrête et PHP continue ici."),
      },
    },
    {
      kind: "discover",
      title: L("foreach, break and continue", "foreach, break et continue"),
      body: [
        L(
          "`foreach` walks through every item of a list, no counter needed: `foreach ($list as $item)`. It's the loop you'll use most in PHP. You'll see much more of it in the arrays chapter.",
          "`foreach` parcourt chaque élément d'une liste, sans compteur : `foreach ($list as $item)`. C'est la boucle que tu utiliseras le plus en PHP. Tu la reverras beaucoup dans le chapitre sur les tableaux.",
        ),
        L(
          "`continue` skips the rest of the current iteration and jumps to the next one. `break` leaves the loop completely.",
          "`continue` saute le reste de l'itération en cours et passe à la suivante. `break` quitte complètement la boucle.",
        ),
      ],
      example: {
        code: `<?php\n$guests = ["Ada", "Bob", "Cleo", "Dan", "Eve"];\nforeach ($guests as $name) {\n    if ($name === "Bob") {\n        continue; // Bob cancelled\n    }\n    if ($name === "Dan") {\n        break; // the room is full\n    }\n    echo "Welcome, $name\\n";\n}\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Skipping a lap", "Sauter un tour"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfor ($i = 1; $i <= 5; $i++) {\n    if ($i === 3) {\n        continue;\n    }\n    echo $i;\n}\n`,
      options: ["12345", "12", "1245", "345"],
      answer: 2,
      explain: L(
        "When `$i` is 3, `continue` skips the echo and moves to 4. With `break` instead, it would have printed only `12`.",
        "Quand `$i` vaut 3, `continue` saute le echo et passe à 4. Avec `break` à la place, ça n'aurait affiché que `12`.",
      ),
    },
    {
      kind: "try",
      title: L("Countdown", "Compte à rebours"),
      body: L(
        "Use a loop to print a countdown from 5 to 1, one number per line, then `Liftoff!` on the last line.",
        "Utilise une boucle pour afficher un compte à rebours de 5 à 1, un nombre par ligne, puis `Liftoff!` sur la dernière ligne.",
      ),
      files: { "index.php": `<?php\n// Print 5, 4, 3, 2, 1 (one per line) with a loop\n\necho "Liftoff!";\n` },
      solution: { "index.php": `<?php\nfor ($i = 5; $i >= 1; $i--) {\n    echo "$i\\n";\n}\necho "Liftoff!";\n` },
      objectives: [
        {
          id: "countdown",
          label: L("Print 5 4 3 2 1 then Liftoff!, one per line, with a loop", "Afficher 5 4 3 2 1 puis Liftoff!, un par ligne, avec une boucle"),
          check: all(outputIs("5\n4\n3\n2\n1\nLiftoff!"), uses(/\b(for|while|foreach)\s*\(/)),
          hints: [
            L("Count down: start at 5, go while the number is at least 1, subtract one each time.", "Compte à rebours : commence à 5, continue tant que le nombre vaut au moins 1, retire un à chaque fois."),
            L("`for ($i = 5; $i >= 1; $i--) { … }`", "`for ($i = 5; $i >= 1; $i--) { … }`"),
            L("Inside the loop: `echo \"$i\\n\";`. Keep the Liftoff line after the loop.", "Dans la boucle : `echo \"$i\\n\";`. Garde la ligne Liftoff après la boucle."),
          ],
        },
      ],
      cheat: "loops",
    },
    {
      kind: "challenge",
      title: L("Times table", "Table de multiplication"),
      body: L(
        "Print the 7 times table from `7 x 1 = 7` to `7 x 10 = 70`, one line each, with a loop. Then add up all the results and print `Total: 385` on a last line.",
        "Affiche la table de 7 de `7 x 1 = 7` à `7 x 10 = 70`, une ligne chacun, avec une boucle. Puis additionne tous les résultats et affiche `Total: 385` sur une dernière ligne.",
      ),
      files: { "index.php": `<?php\n$n = 7;\n$total = 0;\n\n` },
      solution: {
        "index.php": `<?php\n$n = 7;\n$total = 0;\n\nfor ($i = 1; $i <= 10; $i++) {\n    $result = $n * $i;\n    $total += $result;\n    echo "$n x $i = $result\\n";\n}\necho "Total: $total";\n`,
      },
      objectives: [
        {
          id: "table",
          label: L("Ten lines from 7 x 1 = 7 to 7 x 10 = 70", "Dix lignes de 7 x 1 = 7 à 7 x 10 = 70"),
          check: all(
            outputLines(Array.from({ length: 10 }, (_, k) => `7 x ${k + 1} = ${7 * (k + 1)}`)),
            uses(/\b(for|while)\s*\(/),
          ),
          hints: [
            L("A counter `$i` from 1 to 10; each line shows `$n`, `$i` and their product.", "Un compteur `$i` de 1 à 10 ; chaque ligne montre `$n`, `$i` et leur produit."),
            L("`for ($i = 1; $i <= 10; $i++) { echo \"$n x $i = \" . $n * $i . \"\\n\"; }`", "`for ($i = 1; $i <= 10; $i++) { echo \"$n x $i = \" . $n * $i . \"\\n\"; }`"),
            L("Store the product first: `$result = $n * $i;` then `echo \"$n x $i = $result\\n\";`.", "Range d'abord le produit : `$result = $n * $i;` puis `echo \"$n x $i = $result\\n\";`."),
          ],
        },
        {
          id: "total",
          label: L("Last line: Total: 385", "Dernière ligne : Total: 385"),
          check: (c) => lines(c.out).at(-1) === "Total: 385",
          hints: [
            L("Add each result to `$total` inside the loop, print it once after the loop.", "Ajoute chaque résultat à `$total` dans la boucle, affiche-le une fois après la boucle."),
            L("`$total += $result;` inside, `echo \"Total: $total\";` after the closing brace.", "`$total += $result;` dedans, `echo \"Total: $total\";` après l'accolade fermante."),
            L("If you see Total printed ten times, the echo is inside the loop: move it below the `}`.", "Si Total s'affiche dix fois, le echo est dans la boucle : déplace-le sous le `}`."),
          ],
        },
      ],
      cheat: "loops",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`while` checks before each iteration; `do-while` runs at least once.", "`while` vérifie avant chaque itération ; `do-while` s'exécute au moins une fois."),
    L("`for (start; condition; step)` is the classic counting loop.", "`for (début; condition; pas)` est la boucle classique pour compter."),
    L("`foreach ($list as $item)` walks through every item of an array.", "`foreach ($list as $item)` parcourt chaque élément d'un tableau."),
    L("`continue` skips to the next iteration, `break` leaves the loop. Always make sure a loop can end.", "`continue` passe à l'itération suivante, `break` quitte la boucle. Vérifie toujours qu'une boucle peut se terminer."),
  ],
};

export const bossFizzbuzz: Lesson = {
  id: "boss-fizzbuzz",
  chapterId: CH,
  boss: true,
  title: L("Boss: FizzBuzz", "Boss : FizzBuzz"),
  tagline: L("The most famous coding interview question", "La question d'entretien de code la plus célèbre"),
  xp: 80,
  syntax: ["for", "%", "if / elseif", "match (true)"],
  doc: "guide-control-flow",
  steps: [
    {
      kind: "discover",
      title: L("The rules of FizzBuzz", "Les règles de FizzBuzz"),
      body: [
        L(
          "Count from 1 to 20. For multiples of 3, say **Fizz** instead of the number. For multiples of 5, say **Buzz**. For multiples of both 3 and 5 (so of 15), say **FizzBuzz**. Otherwise, say the number.",
          "Compte de 1 à 20. Pour les multiples de 3, dis **Fizz** à la place du nombre. Pour les multiples de 5, dis **Buzz**. Pour les multiples de 3 et de 5 à la fois (donc de 15), dis **FizzBuzz**. Sinon, dis le nombre.",
        ),
        L(
          "It mixes everything from this chapter: a loop, the modulo `%` to test multiples (`$n % 3 === 0` means \"divisible by 3\"), and conditions in the right order.",
          "Il mélange tout ce chapitre : une boucle, le modulo `%` pour tester les multiples (`$n % 3 === 0` veut dire « divisible par 3 »), et des conditions dans le bon ordre.",
        ),
      ],
      example: {
        code: `<?php\nforeach ([9, 10, 11] as $n) {\n    echo "$n % 3 = ", $n % 3, " | $n % 5 = ", $n % 5, "\\n";\n}\n`,
        caption: L("A remainder of 0 means \"divisible\".", "Un reste de 0 veut dire « divisible »."),
      },
    },
    {
      kind: "quiz",
      title: L("Warm-up: remainders", "Échauffement : les restes"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho 10 % 3, 15 % 5;\n`,
      options: ["10", "31", "3.33", "13"],
      answer: 0,
      explain: L(
        "10 ÷ 3 = 3 remainder **1**, and 15 ÷ 5 = 3 remainder **0**. echo prints 1 then 0 side by side: `10`.",
        "10 ÷ 3 = 3 reste **1**, et 15 ÷ 5 = 3 reste **0**. echo affiche 1 puis 0 côte à côte : `10`.",
      ),
    },
    {
      kind: "challenge",
      title: L("Defeat FizzBuzz", "Bats FizzBuzz"),
      body: L(
        "Print FizzBuzz from 1 to 20, one value per line. Each objective checks a different rule, so you can see which one is still wrong.",
        "Affiche FizzBuzz de 1 à 20, une valeur par ligne. Chaque objectif vérifie une règle différente, pour voir laquelle est encore fausse.",
      ),
      files: { "index.php": `<?php\nfor ($n = 1; $n <= 20; $n++) {\n    echo $n, "\\n";\n}\n` },
      solution: {
        "index.php": `<?php\nfor ($n = 1; $n <= 20; $n++) {\n    if ($n % 15 === 0) {\n        echo "FizzBuzz\\n";\n    } elseif ($n % 3 === 0) {\n        echo "Fizz\\n";\n    } elseif ($n % 5 === 0) {\n        echo "Buzz\\n";\n    } else {\n        echo $n, "\\n";\n    }\n}\n`,
      },
      objectives: [
        {
          id: "fizz",
          label: L("Multiples of 3 (only) print Fizz", "Les multiples de 3 (seulement) affichent Fizz"),
          check: fizzLines((n) => n % 3 === 0 && n % 15 !== 0),
          hints: [
            L("Test whether the remainder of `$n` divided by 3 is zero.", "Teste si le reste de `$n` divisé par 3 vaut zéro."),
            L("`if ($n % 3 === 0) { echo \"Fizz\\n\"; } else { echo $n, \"\\n\"; }`", "`if ($n % 3 === 0) { echo \"Fizz\\n\"; } else { echo $n, \"\\n\"; }`"),
            L("Replace the single echo in the loop with an if/else that prints Fizz for multiples of 3 and the number otherwise.", "Remplace le echo unique de la boucle par un if/else qui affiche Fizz pour les multiples de 3 et le nombre sinon."),
          ],
        },
        {
          id: "buzz",
          label: L("Multiples of 5 (only) print Buzz", "Les multiples de 5 (seulement) affichent Buzz"),
          check: fizzLines((n) => n % 5 === 0 && n % 15 !== 0),
          hints: [
            L("Add a second test with `elseif`.", "Ajoute un deuxième test avec `elseif`."),
            L("`elseif ($n % 5 === 0) { echo \"Buzz\\n\"; }`", "`elseif ($n % 5 === 0) { echo \"Buzz\\n\"; }`"),
            L("Put the Buzz test between the Fizz test and the final `else`.", "Place le test Buzz entre le test Fizz et le `else` final."),
          ],
        },
        {
          id: "fizzbuzz",
          label: L("Multiples of 15 print FizzBuzz", "Les multiples de 15 affichent FizzBuzz"),
          check: fizzLines((n) => n % 15 === 0),
          hints: [
            L("15 is a multiple of 3, so the Fizz test catches it first. Order matters!", "15 est un multiple de 3, donc le test Fizz l'attrape en premier. L'ordre compte !"),
            L("Test `$n % 15 === 0` (or `$n % 3 === 0 && $n % 5 === 0`) **before** the others.", "Teste `$n % 15 === 0` (ou `$n % 3 === 0 && $n % 5 === 0`) **avant** les autres."),
            L("Start the chain with `if ($n % 15 === 0) { echo \"FizzBuzz\\n\"; } elseif ($n % 3 === 0) { … }`.", "Commence la chaîne par `if ($n % 15 === 0) { echo \"FizzBuzz\\n\"; } elseif ($n % 3 === 0) { … }`."),
          ],
        },
        {
          id: "numbers",
          label: L("All 20 lines are right, numbers included", "Les 20 lignes sont justes, nombres compris"),
          check: all(fizzLines(() => true), (c) => lines(c.out).length === 20),
          hints: [
            L("Every other number is printed as is, one per line.", "Tous les autres nombres s'affichent tels quels, un par ligne."),
            L("The final `else` prints `$n` followed by a new line.", "Le `else` final affiche `$n` suivi d'un retour à la ligne."),
            L("Compare your output with: 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz.", "Compare ta sortie avec : 1, 2, Fizz, 4, Buzz, Fizz, 7, 8, Fizz, Buzz, 11, Fizz, 13, 14, FizzBuzz, 16, 17, Fizz, 19, Buzz."),
          ],
        },
      ],
      cheat: "loops",
    },
    {
      kind: "challenge",
      title: L("The twist: keep score", "Le rebondissement : compte les points"),
      body: L(
        "The boss strikes back! Keep your FizzBuzz, and count how many times each word was printed. After the 20 lines, print one more line exactly like `Fizz: 5, Buzz: 3, FizzBuzz: 1`.",
        "Le boss contre-attaque ! Garde ton FizzBuzz, et compte combien de fois chaque mot a été affiché. Après les 20 lignes, affiche une ligne de plus exactement comme `Fizz: 5, Buzz: 3, FizzBuzz: 1`.",
      ),
      files: {
        "index.php": `<?php\n$fizz = 0;\n$buzz = 0;\n$fizzbuzz = 0;\n\nfor ($n = 1; $n <= 20; $n++) {\n    if ($n % 15 === 0) {\n        echo "FizzBuzz\\n";\n    } elseif ($n % 3 === 0) {\n        echo "Fizz\\n";\n    } elseif ($n % 5 === 0) {\n        echo "Buzz\\n";\n    } else {\n        echo $n, "\\n";\n    }\n}\n`,
      },
      solution: {
        "index.php": `<?php\n$fizz = 0;\n$buzz = 0;\n$fizzbuzz = 0;\n\nfor ($n = 1; $n <= 20; $n++) {\n    if ($n % 15 === 0) {\n        echo "FizzBuzz\\n";\n        $fizzbuzz++;\n    } elseif ($n % 3 === 0) {\n        echo "Fizz\\n";\n        $fizz++;\n    } elseif ($n % 5 === 0) {\n        echo "Buzz\\n";\n        $buzz++;\n    } else {\n        echo $n, "\\n";\n    }\n}\necho "Fizz: $fizz, Buzz: $buzz, FizzBuzz: $fizzbuzz";\n`,
      },
      objectives: [
        {
          id: "still",
          label: L("The 20 FizzBuzz lines are still right", "Les 20 lignes FizzBuzz sont toujours justes"),
          check: fizzLines(() => true),
          hints: [
            L("Don't break what already works: only add lines.", "Ne casse pas ce qui marche déjà : ajoute seulement des lignes."),
            L("The counters go inside the existing branches, next to each echo.", "Les compteurs vont dans les branches existantes, à côté de chaque echo."),
            L("If a line changed, compare with the previous challenge's solution.", "Si une ligne a changé, compare avec la solution du défi précédent."),
          ],
        },
        {
          id: "score",
          label: L("Last line: Fizz: 5, Buzz: 3, FizzBuzz: 1", "Dernière ligne : Fizz: 5, Buzz: 3, FizzBuzz: 1"),
          check: all((c) => lines(c.out).at(-1) === "Fizz: 5, Buzz: 3, FizzBuzz: 1", (c) => lines(c.out).length === 21, uses(/\$fizz\s*(\+\+|\+=)|\+\+\s*\$fizz\b/)),
          hints: [
            L("Each branch adds one to its own counter. Print the counters once, after the loop.", "Chaque branche ajoute un à son propre compteur. Affiche les compteurs une fois, après la boucle."),
            L("`$fizz++;` in the Fizz branch, `$buzz++;` in Buzz, `$fizzbuzz++;` in FizzBuzz.", "`$fizz++;` dans la branche Fizz, `$buzz++;` dans Buzz, `$fizzbuzz++;` dans FizzBuzz."),
            L("After the loop's closing brace: `echo \"Fizz: $fizz, Buzz: $buzz, FizzBuzz: $fizzbuzz\";`", "Après l'accolade fermante de la boucle : `echo \"Fizz: $fizz, Buzz: $buzz, FizzBuzz: $fizzbuzz\";`"),
          ],
        },
      ],
      cheat: "loops",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`$n % 3 === 0` tests divisibility: the remainder is zero.", "`$n % 3 === 0` teste la divisibilité : le reste vaut zéro."),
    L("In an if/elseif chain, test the most specific case (15) first.", "Dans une chaîne if/elseif, teste le cas le plus précis (15) en premier."),
    L("Counters (`$count++`) inside branches let you measure what a loop did.", "Des compteurs (`$count++`) dans les branches mesurent ce qu'une boucle a fait."),
    L("Splitting a problem into rules, checked one by one, is how you debug anything.", "Découper un problème en règles, vérifiées une par une, c'est comme ça qu'on débogue n'importe quoi."),
  ],
};

export const CONTROL: Lesson[] = [conditions, comparisons, matchSwitch, loops, bossFizzbuzz];
