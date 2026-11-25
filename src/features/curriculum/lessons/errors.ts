import { L } from "@/lib/txt";
import { all, clean, definesClass, outputHas, outputIs, outputLines, probeIs, probeShows, probeThrows, ran, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "errors";

/** The code without its strings, to look for an operator like `@`. */
const noStrings = (code: string) => code.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, "''");

export const warningsNotices: Lesson = {
  id: "warnings-notices",
  chapterId: CH,
  title: L("When PHP complains", "Quand PHP râle"),
  tagline: L("Notices, warnings, deprecations and fatal errors", "Notices, warnings, dépréciations et erreurs fatales"),
  xp: 60,
  syntax: ["Warning", "Deprecated", "Fatal error", "??", "isset", "@"],
  doc: "guide-errors",
  steps: [
    {
      kind: "discover",
      title: L("Four levels of trouble", "Quatre niveaux de problème"),
      body: [
        L(
          "PHP doesn't just crash or work: it tells you how serious each problem is. A **Deprecated** message means \"this still works, but will be removed in a future version\". A **Notice** or a **Warning** means \"something looks wrong, but I'll keep going\". A **Fatal error** (or an uncaught exception) stops the script on the spot.",
          "PHP ne fait pas que planter ou marcher : il te dit à quel point chaque problème est grave. Un message **Deprecated** veut dire « ça marche encore, mais ce sera retiré dans une version future ». Une **Notice** ou un **Warning** veut dire « quelque chose cloche, mais je continue ». Une **Fatal error** (ou une exception non attrapée) arrête le script net.",
        ),
        L(
          "The dangerous ones are warnings: the script keeps running with a wrong value (usually `null`), so the real bug shows up later, somewhere else. Treat every warning as a bug to fix.",
          "Les plus traîtres sont les warnings : le script continue avec une mauvaise valeur (souvent `null`), donc le vrai bug apparaît plus tard, ailleurs. Traite chaque warning comme un bug à corriger.",
        ),
      ],
      scene: "exception",
      example: {
        code: `<?php\n$user = ["name" => "Ada"];\necho "Hello " . $user["name"] . "\\n";\necho "Email: " . $user["email"] . "\\n";\necho "The script keeps going.\\n";\n`,
        caption: L("Open the Problems tab: the warning gives the key and the line.", "Ouvre l'onglet Problèmes : le warning donne la clé et la ligne."),
      },
    },
    {
      kind: "discover",
      title: L("Read the message, then the line", "Lis le message, puis la ligne"),
      body: [
        L(
          "Every problem has the same shape: a **level** (Warning, Deprecated…), a **message** that says what happened, and a **file and line**. Read the message slowly: it usually names the variable, key or function at fault.",
          "Chaque problème a la même forme : un **niveau** (Warning, Deprecated…), un **message** qui dit ce qui s'est passé, et un **fichier avec une ligne**. Lis le message lentement : il nomme en général la variable, la clé ou la fonction en cause.",
        ),
        L(
          "The first example triggers a deprecation: the code works today, but PHP warns you it won't forever. The second calls a function that doesn't exist: that's an `Error`, and the script stops right there.",
          "Le premier exemple déclenche une dépréciation : le code marche aujourd'hui, mais PHP te prévient que ce ne sera pas toujours le cas. Le second appelle une fonction qui n'existe pas : c'est une `Error`, et le script s'arrête là.",
        ),
      ],
      examples: [
        {
          code: `<?php\nfunction greet(string $name = null): string\n{\n    return "Hi " . ($name ?? "stranger");\n}\necho greet();\n`,
          caption: L("Fix: write `?string $name = null` to say \"string or null\" explicitly.", "Correction : écris `?string $name = null` pour dire explicitement « chaîne ou null »."),
        },
        {
          code: `<?php\necho "Before\\n";\necho strlenn("typo");\necho "After\\n";\n`,
          caption: L("\"After\" is never printed: the script stopped at line 3.", "« After » n'est jamais affiché : le script s'est arrêté ligne 3."),
        },
      ],
      callout: {
        tone: "version",
        text: L(
          "PHP 8 turned many old notices into warnings (undefined variables and array keys) and many warnings into exceptions. PHP 8.4 deprecated implicitly nullable parameters like `string $name = null`.",
          "PHP 8 a transformé beaucoup d'anciennes notices en warnings (variables et clés de tableau indéfinies) et beaucoup de warnings en exceptions. PHP 8.4 a déprécié les paramètres implicitement nullables comme `string $name = null`.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Watch a warning spread", "Regarde un warning se propager"),
      body: L(
        "Step through and watch `$kiwis` in the Variables panel. The warning happens on one line, but its effect (a `null` in the maths) travels to the next ones.",
        "Avance pas à pas et surveille `$kiwis` dans le panneau Variables. Le warning arrive sur une ligne, mais son effet (un `null` dans le calcul) voyage vers les suivantes.",
      ),
      code: `<?php\n$stock = ["apple" => 5, "pear" => 2];\n$apples = $stock["apple"];\n$kiwis = $stock["kiwi"];\n$total = $apples + $kiwis;\necho "Total: $total";\n`,
      notes: {
        3: L("A key that exists: `$apples` gets 5.", "Une clé qui existe : `$apples` reçoit 5."),
        4: L("No \"kiwi\" key: PHP warns *Undefined array key*, and `$kiwis` becomes null.", "Pas de clé « kiwi » : PHP prévient *Undefined array key*, et `$kiwis` devient null."),
        5: L("5 + null = 5. No new warning, but the result is silently wrong.", "5 + null = 5. Pas de nouveau warning, mais le résultat est faux sans bruit."),
        6: L("The output looks fine, which is exactly why warnings are dangerous.", "La sortie a l'air correcte, et c'est justement pour ça que les warnings sont dangereux."),
      },
    },
    {
      kind: "quiz",
      title: L("Does it stop?", "Est-ce que ça s'arrête ?"),
      question: L("What does this script print?", "Qu'affiche ce script ?"),
      code: `<?php\n$list = [10, 20];\necho $list[5];\necho "done";\n`,
      options: ["done", L("Nothing: the script stops at line 3", "Rien : le script s'arrête ligne 3"), "0done", "nulldone"],
      answer: 0,
      explain: L(
        "Index 5 doesn't exist, so PHP raises a warning and uses `null`, which echo prints as an empty string. The script then continues and prints `done`.",
        "L'index 5 n'existe pas : PHP lève un warning et utilise `null`, qu'echo affiche comme une chaîne vide. Le script continue ensuite et affiche `done`.",
      ),
    },
    {
      kind: "discover",
      title: L("Don't hide it, handle it", "Ne le cache pas, gère-le"),
      body: [
        L(
          "The `@` operator silences any warning on an expression: `@$config[\"timezone\"]`. It looks convenient, but the problem is still there; you just stopped seeing it. It also makes code slower and debugging much harder.",
          "L'opérateur `@` fait taire tout warning sur une expression : `@$config[\"timezone\"]`. Ça a l'air pratique, mais le problème est toujours là ; tu as juste arrêté de le voir. Ça ralentit aussi le code et complique beaucoup le débogage.",
        ),
        L(
          "Say what you mean instead: `$config[\"timezone\"] ?? \"UTC\"` gives a default when the key is missing, `isset()` asks \"does it exist and isn't null?\", and `array_key_exists()` asks \"is the key there at all?\".",
          "Dis plutôt ce que tu veux : `$config[\"timezone\"] ?? \"UTC\"` donne une valeur par défaut si la clé manque, `isset()` demande « est-ce que ça existe et n'est pas null ? », et `array_key_exists()` demande « la clé est-elle là ? ».",
        ),
      ],
      example: {
        code: `<?php\n$config = ["debug" => true];\n\n$a = @$config["timezone"];\nvar_dump($a);\n\n$b = $config["timezone"] ?? "UTC";\nvar_dump($b);\n\nvar_dump(isset($config["timezone"]));\nvar_dump(array_key_exists("debug", $config));\n`,
      },
      callout: {
        tone: "warn",
        text: L("`@` never stops exceptions: a `TypeError` or `DivisionByZeroError` still stops the script.", "`@` n'arrête jamais les exceptions : une `TypeError` ou une `DivisionByZeroError` arrête toujours le script."),
      },
    },
    {
      kind: "try",
      title: L("Clean up a profile page", "Nettoie une page de profil"),
      body: L(
        "This profile prints two warnings. Fix them so the script runs cleanly and prints `Email: unknown` when there's no email. One warning is a missing key (use a default), the other is a typo.",
        "Ce profil affiche deux warnings. Corrige-les pour que le script tourne sans problème et affiche `Email: unknown` quand il n'y a pas d'email. L'un est une clé manquante (utilise une valeur par défaut), l'autre une faute de frappe.",
      ),
      files: { "index.php": `<?php\n$user = ["name" => "Grace", "city" => "Arlington"];\n\necho "Name: " . $user["name"] . "\\n";\necho "Email: " . $user["email"] . "\\n";\necho "City: " . $user["City"] . "\\n";\n` },
      solution: { "index.php": `<?php\n$user = ["name" => "Grace", "city" => "Arlington"];\n\necho "Name: " . $user["name"] . "\\n";\necho "Email: " . ($user["email"] ?? "unknown") . "\\n";\necho "City: " . $user["city"] . "\\n";\n` },
      objectives: [
        {
          id: "clean",
          label: L("No warnings", "Aucun warning"),
          check: clean,
          hints: [
            L("Read each warning: it names the missing key and the line.", "Lis chaque warning : il nomme la clé manquante et la ligne."),
            L("Keys are case-sensitive (`City` vs `city`), and `??` gives a default for a missing key.", "Les clés sont sensibles à la casse (`City` contre `city`), et `??` donne une valeur par défaut à une clé manquante."),
            L("Line 5: `($user[\"email\"] ?? \"unknown\")`. Line 6: `$user[\"city\"]`.", "Ligne 5 : `($user[\"email\"] ?? \"unknown\")`. Ligne 6 : `$user[\"city\"]`."),
          ],
        },
        {
          id: "output",
          label: L("Print the name, Email: unknown and the city", "Afficher le nom, Email: unknown et la ville"),
          check: outputLines(["Name: Grace", "Email: unknown", "City: Arlington"]),
          hints: [
            L("Each line should show a value, never an empty spot.", "Chaque ligne doit montrer une valeur, jamais un trou."),
            L("Wrap the `??` expression in parentheses: the dot has a higher priority.", "Mets l'expression `??` entre parenthèses : le point a une priorité plus forte."),
            L("`echo \"Email: \" . ($user[\"email\"] ?? \"unknown\") . \"\\n\";`", "`echo \"Email: \" . ($user[\"email\"] ?? \"unknown\") . \"\\n\";`"),
          ],
        },
      ],
      cheat: "errors",
    },
    {
      kind: "challenge",
      title: L("Silence is not a fix", "Le silence n'est pas une correction"),
      body: L(
        "This score script \"works\" because someone sprinkled `@` everywhere. Remove every `@` and handle the missing player properly so it still prints `Sum: 21` and `Average: 7` (a missing player counts as 0), with no warnings.",
        "Ce script de scores « marche » parce que quelqu'un a saupoudré des `@` partout. Retire tous les `@` et gère correctement le joueur manquant pour afficher encore `Sum: 21` et `Average: 7` (un joueur absent compte 0), sans aucun warning.",
      ),
      files: {
        "index.php": `<?php\n$scores = ["ana" => 12, "bo" => 9];\n$names = ["ana", "bo", "cy"];\n\n$sum = 0;\nforeach ($names as $n) {\n    $sum += @$scores[$n];\n}\n$avg = @($sum / count($names));\n\necho "Sum: $sum\\n";\necho "Average: " . round($avg, 1);\n`,
      },
      solution: {
        "index.php": `<?php\n$scores = ["ana" => 12, "bo" => 9];\n$names = ["ana", "bo", "cy"];\n\n$sum = 0;\nforeach ($names as $n) {\n    $sum += $scores[$n] ?? 0;\n}\n$avg = $sum / count($names);\n\necho "Sum: $sum\\n";\necho "Average: " . round($avg, 1);\n`,
      },
      objectives: [
        {
          id: "no-at",
          label: L("No `@` operator left", "Plus aucun opérateur `@`"),
          check: (c) => !/@/.test(noStrings(c.code)),
          hints: [
            L("Search the code for `@`: there are two.", "Cherche `@` dans le code : il y en a deux."),
            L("Delete them, run, and read the warning that appears.", "Supprime-les, exécute, et lis le warning qui apparaît."),
            L("Line 7 becomes `$sum += $scores[$n];` for now and line 9 `$avg = $sum / count($names);`.", "La ligne 7 devient `$sum += $scores[$n];` pour l'instant et la ligne 9 `$avg = $sum / count($names);`."),
          ],
        },
        {
          id: "clean",
          label: L("No warnings", "Aucun warning"),
          check: clean,
          hints: [
            L("\"cy\" has no score: say what should happen instead of hiding it.", "« cy » n'a pas de score : dis ce qui doit se passer au lieu de le cacher."),
            L("`??` gives a default value when a key is missing.", "`??` donne une valeur par défaut quand une clé manque."),
            L("`$sum += $scores[$n] ?? 0;`", "`$sum += $scores[$n] ?? 0;`"),
          ],
        },
        {
          id: "output",
          label: L("Print Sum: 21 and Average: 7", "Afficher Sum: 21 et Average: 7"),
          check: outputLines(["Sum: 21", "Average: 7"]),
          hints: [
            L("12 + 9 + 0 = 21, divided by 3 players.", "12 + 9 + 0 = 21, divisé par 3 joueurs."),
            L("Keep `count($names)` as the divisor.", "Garde `count($names)` comme diviseur."),
            L("With `?? 0` on line 7 and no `@`, the two echo lines stay as they are.", "Avec `?? 0` à la ligne 7 et sans `@`, les deux lignes echo restent telles quelles."),
          ],
        },
      ],
      cheat: "errors",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Deprecated, Notice, Warning: the script continues. Fatal error or uncaught exception: it stops.", "Deprecated, Notice, Warning : le script continue. Fatal error ou exception non attrapée : il s'arrête."),
    L("Read the level, the message, then the line. The message names the culprit.", "Lis le niveau, le message, puis la ligne. Le message nomme le coupable."),
    L("A warning usually means a `null` is now travelling through your code.", "Un warning veut souvent dire qu'un `null` voyage maintenant dans ton code."),
    L("Don't hide problems with `@`: use `??`, `isset()` or `array_key_exists()`.", "Ne cache pas les problèmes avec `@` : utilise `??`, `isset()` ou `array_key_exists()`."),
  ],
};

export const exceptions: Lesson = {
  id: "exceptions",
  chapterId: CH,
  title: L("Exceptions", "Les exceptions"),
  tagline: L("throw, try, catch and finally", "throw, try, catch et finally"),
  xp: 60,
  syntax: ["throw", "try", "catch", "finally", "Throwable", "A | B"],
  doc: "guide-errors",
  steps: [
    {
      kind: "discover",
      title: L("Throwing an exception", "Lancer une exception"),
      body: [
        L(
          "When a function can't do its job, it shouldn't return a weird value and hope someone notices. It should **throw** an exception: an object that describes what went wrong.",
          "Quand une fonction ne peut pas faire son travail, elle ne devrait pas renvoyer une valeur bizarre en espérant que quelqu'un le remarque. Elle doit **lancer** (throw) une exception : un objet qui décrit ce qui a raté.",
        ),
        L(
          "`throw` stops the function immediately and travels up through every caller. If nobody catches it, the whole script stops with an *Uncaught* error and a stack trace.",
          "`throw` arrête immédiatement la fonction et remonte à travers tous les appelants. Si personne ne l'attrape, tout le script s'arrête avec une erreur *Uncaught* et une trace d'appels.",
        ),
      ],
      scene: "exception",
      example: {
        code: `<?php\nfunction divide(int $a, int $b): float\n{\n    if ($b === 0) {\n        throw new InvalidArgumentException("Cannot divide by zero");\n    }\n    return $a / $b;\n}\n\necho divide(10, 4) . "\\n";\necho divide(1, 0) . "\\n";\necho "never printed";\n`,
        caption: L("The Problems tab shows where it was thrown and who called it.", "L'onglet Problèmes montre où elle a été lancée et qui l'a appelée."),
      },
    },
    {
      kind: "discover",
      title: L("Catching it: try, catch, finally", "L'attraper : try, catch, finally"),
      body: [
        L(
          "Put risky code in a `try` block. If an exception is thrown inside, PHP jumps straight to the matching `catch` block, where `$e` holds the exception (`$e->getMessage()` gives its message).",
          "Mets le code risqué dans un bloc `try`. Si une exception est lancée dedans, PHP saute directement au bloc `catch` correspondant, où `$e` contient l'exception (`$e->getMessage()` donne son message).",
        ),
        L(
          "A `finally` block runs in every case, exception or not: perfect to close a file or release a lock. After the catch, the script continues normally.",
          "Un bloc `finally` s'exécute dans tous les cas, exception ou pas : parfait pour fermer un fichier ou libérer un verrou. Après le catch, le script continue normalement.",
        ),
      ],
      example: {
        code: `<?php\nfunction divide(int $a, int $b): float\n{\n    if ($b === 0) {\n        throw new InvalidArgumentException("Cannot divide by zero");\n    }\n    return $a / $b;\n}\n\ntry {\n    echo divide(1, 0);\n    echo "skipped\\n";\n} catch (InvalidArgumentException $e) {\n    echo "Oops: " . $e->getMessage() . "\\n";\n} finally {\n    echo "Always runs\\n";\n}\necho "The script goes on.";\n`,
      },
    },
    {
      kind: "watch",
      title: L("Follow the jump", "Suis le saut"),
      body: L(
        "Step through and watch the arrow: after the throw, PHP skips the rest of the try block and lands in the catch, then in finally.",
        "Avance pas à pas et regarde la flèche : après le throw, PHP saute le reste du bloc try et atterrit dans le catch, puis dans finally.",
      ),
      code: `<?php\n$orders = 3;\n$boxes = 0;\ntry {\n    $perBox = intdiv($orders, $boxes);\n    echo "Per box: $perBox\\n";\n} catch (DivisionByZeroError $e) {\n    $perBox = 0;\n    echo "No boxes! " . $e->getMessage() . "\\n";\n} finally {\n    echo "Checked $orders orders\\n";\n}\necho "Done";\n`,
      notes: {
        3: L("`$boxes` is 0: trouble ahead.", "`$boxes` vaut 0 : des ennuis en vue."),
        8: L("intdiv() threw a DivisionByZeroError: we land in the catch. Line 6 never ran.", "intdiv() a lancé une DivisionByZeroError : on atterrit dans le catch. La ligne 6 n'a jamais tourné."),
        9: L("`$e->getMessage()` is the text of the error.", "`$e->getMessage()` est le texte de l'erreur."),
        11: L("finally runs whatever happened.", "finally s'exécute quoi qu'il arrive."),
        13: L("The script continues as if nothing happened.", "Le script continue comme si de rien n'était."),
      },
    },
    {
      kind: "discover",
      title: L("Exception or Error?", "Exception ou Error ?"),
      body: [
        L(
          "Everything you can throw implements `Throwable`. It has two families: **`Exception`** for problems your code decides to report (`InvalidArgumentException`, `RuntimeException`…) and **`Error`** for problems PHP itself detects (`TypeError`, `DivisionByZeroError`, `ValueError`…).",
          "Tout ce qu'on peut lancer implémente `Throwable`. Il y a deux familles : **`Exception`** pour les problèmes que ton code décide de signaler (`InvalidArgumentException`, `RuntimeException`…) et **`Error`** pour ceux que PHP détecte lui-même (`TypeError`, `DivisionByZeroError`, `ValueError`…).",
        ),
        L(
          "`catch (Exception $e)` doesn't catch an `Error`. To handle several types the same way, list them with a pipe: `catch (TypeError | ValueError $e)`. `catch (Throwable $e)` catches everything; keep it for the outermost layer (logging, error pages).",
          "`catch (Exception $e)` n'attrape pas une `Error`. Pour traiter plusieurs types de la même façon, liste-les avec une barre : `catch (TypeError | ValueError $e)`. `catch (Throwable $e)` attrape tout ; garde-le pour la couche la plus haute (journalisation, pages d'erreur).",
        ),
      ],
      example: {
        code: `<?php\n$jobs = [\n    fn() => intdiv(1, 0),\n    fn() => str_repeat("x", -1),\n    fn() => throw new RuntimeException("Disk full"),\n];\n\nforeach ($jobs as $job) {\n    try {\n        $job();\n    } catch (DivisionByZeroError | ValueError $e) {\n        echo "Engine error: " . get_class($e) . "\\n";\n    } catch (Exception $e) {\n        echo "App exception: " . $e->getMessage() . "\\n";\n    }\n}\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Trace the letters", "Suis les lettres"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\ntry {\n    echo "A";\n    throw new Exception("x");\n    echo "B";\n} catch (Exception $e) {\n    echo "C";\n} finally {\n    echo "D";\n}\necho "E";\n`,
      options: ["ABCDE", "ACDE", "ACE", "AC"],
      answer: 1,
      explain: L(
        "The throw skips `B` and jumps to the catch (`C`). `finally` always runs (`D`), then the script continues (`E`).",
        "Le throw saute `B` et va au catch (`C`). `finally` s'exécute toujours (`D`), puis le script continue (`E`).",
      ),
    },
    {
      kind: "try",
      title: L("Catch the bad input", "Attrape la mauvaise saisie"),
      body: L(
        "`parseAge(\"abc\")` throws and stops everything, so `Done` is never printed. Wrap the risky call in try/catch and print the exception's message instead.",
        "`parseAge(\"abc\")` lance une exception et arrête tout, donc `Done` n'est jamais affiché. Entoure l'appel risqué d'un try/catch et affiche plutôt le message de l'exception.",
      ),
      files: {
        "index.php": `<?php\nfunction parseAge(string $input): int\n{\n    if (!ctype_digit($input)) {\n        throw new InvalidArgumentException("Invalid age: $input");\n    }\n    return (int) $input;\n}\n\necho parseAge("42") . "\\n";\necho parseAge("abc") . "\\n";\necho "Done";\n`,
      },
      solution: {
        "index.php": `<?php\nfunction parseAge(string $input): int\n{\n    if (!ctype_digit($input)) {\n        throw new InvalidArgumentException("Invalid age: $input");\n    }\n    return (int) $input;\n}\n\necho parseAge("42") . "\\n";\ntry {\n    echo parseAge("abc") . "\\n";\n} catch (InvalidArgumentException $e) {\n    echo $e->getMessage() . "\\n";\n}\necho "Done";\n`,
      },
      objectives: [
        {
          id: "caught",
          label: L("No uncaught exception", "Aucune exception non attrapée"),
          check: all(ran, uses(/catch\s*\(/)),
          hints: [
            L("The exception must be caught before it reaches the top of the script.", "L'exception doit être attrapée avant d'atteindre le haut du script."),
            L("`try { … } catch (InvalidArgumentException $e) { … }` around line 11.", "`try { … } catch (InvalidArgumentException $e) { … }` autour de la ligne 11."),
            L("Put `echo parseAge(\"abc\") . \"\\n\";` inside `try { }` and add `catch (InvalidArgumentException $e) { echo $e->getMessage() . \"\\n\"; }`.", "Mets `echo parseAge(\"abc\") . \"\\n\";` dans `try { }` et ajoute `catch (InvalidArgumentException $e) { echo $e->getMessage() . \"\\n\"; }`."),
          ],
        },
        {
          id: "output",
          label: L("Print 42, Invalid age: abc, then Done", "Afficher 42, Invalid age: abc, puis Done"),
          check: outputLines(["42", "Invalid age: abc", "Done"]),
          hints: [
            L("The message is already written for you, in the exception.", "Le message est déjà écrit pour toi, dans l'exception."),
            L("`$e->getMessage()` returns it.", "`$e->getMessage()` le renvoie."),
            L("In the catch block: `echo $e->getMessage() . \"\\n\";`", "Dans le bloc catch : `echo $e->getMessage() . \"\\n\";`"),
          ],
        },
      ],
      cheat: "exceptions",
    },
    {
      kind: "challenge",
      title: L("A batch that never gives up", "Un traitement qui n'abandonne jamais"),
      body: L(
        "Process every quantity: add the valid ones to the total, print the message of each invalid one, and count every item checked using `finally`. Expected output: the two error messages, then `Total: 35` and `Checked: 4`.",
        "Traite chaque quantité : ajoute les valides au total, affiche le message de chaque invalide, et compte chaque élément vérifié avec `finally`. Sortie attendue : les deux messages d'erreur, puis `Total: 35` et `Checked: 4`.",
      ),
      files: {
        "index.php": `<?php\nfunction parseQuantity(string $raw): int\n{\n    if (!is_numeric($raw)) {\n        throw new InvalidArgumentException("Not a number: $raw");\n    }\n    if ((int) $raw < 0) {\n        throw new RangeException("Negative: $raw");\n    }\n    return (int) $raw;\n}\n\n$inputs = ["10", "x", "25", "-3"];\n$total = 0;\n$checked = 0;\n\nforeach ($inputs as $raw) {\n    $total += parseQuantity($raw);\n}\n\necho "Total: $total\\n";\necho "Checked: $checked";\n`,
      },
      solution: {
        "index.php": `<?php\nfunction parseQuantity(string $raw): int\n{\n    if (!is_numeric($raw)) {\n        throw new InvalidArgumentException("Not a number: $raw");\n    }\n    if ((int) $raw < 0) {\n        throw new RangeException("Negative: $raw");\n    }\n    return (int) $raw;\n}\n\n$inputs = ["10", "x", "25", "-3"];\n$total = 0;\n$checked = 0;\n\nforeach ($inputs as $raw) {\n    try {\n        $total += parseQuantity($raw);\n    } catch (InvalidArgumentException | RangeException $e) {\n        echo $e->getMessage() . "\\n";\n    } finally {\n        $checked++;\n    }\n}\n\necho "Total: $total\\n";\necho "Checked: $checked";\n`,
      },
      objectives: [
        {
          id: "survive",
          label: L("The loop survives bad input", "La boucle survit aux mauvaises saisies"),
          check: all(ran, outputHas("Not a number: x"), outputHas("Negative: -3")),
          hints: [
            L("Two exception types can be thrown: catch both inside the loop.", "Deux types d'exception peuvent être lancés : attrape les deux dans la boucle."),
            L("One catch can list both: `catch (InvalidArgumentException | RangeException $e)`.", "Un seul catch peut lister les deux : `catch (InvalidArgumentException | RangeException $e)`."),
            L("Inside the foreach: `try { $total += parseQuantity($raw); } catch (InvalidArgumentException | RangeException $e) { echo $e->getMessage() . \"\\n\"; }`", "Dans le foreach : `try { $total += parseQuantity($raw); } catch (InvalidArgumentException | RangeException $e) { echo $e->getMessage() . \"\\n\"; }`"),
          ],
        },
        {
          id: "total",
          label: L("Print Total: 35", "Afficher Total: 35"),
          check: outputHas(/^Total: 35$/m),
          hints: [
            L("Only 10 and 25 are valid.", "Seuls 10 et 25 sont valides."),
            L("Keep the `+=` inside the try: it only runs when no exception was thrown.", "Garde le `+=` dans le try : il ne s'exécute que si aucune exception n'est lancée."),
            L("Once the loop catches the errors, the total is right by itself.", "Une fois que la boucle attrape les erreurs, le total est juste tout seul."),
          ],
        },
        {
          id: "finally",
          label: L("Count with finally: Checked: 4", "Compter avec finally : Checked: 4"),
          check: all(uses(/finally/), outputHas(/^Checked: 4$/m)),
          hints: [
            L("Every item must be counted, valid or not.", "Chaque élément doit être compté, valide ou non."),
            L("`finally { … }` after the catch runs for each item.", "`finally { … }` après le catch s'exécute pour chaque élément."),
            L("Add `finally { $checked++; }` after the catch block.", "Ajoute `finally { $checked++; }` après le bloc catch."),
          ],
        },
      ],
      cheat: "exceptions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`throw` stops the function and travels up until something catches it.", "`throw` arrête la fonction et remonte jusqu'à ce que quelque chose l'attrape."),
    L("`try`/`catch` handles it; `finally` always runs; then the script continues.", "`try`/`catch` la gère ; `finally` s'exécute toujours ; puis le script continue."),
    L("`Exception` is for your code's problems, `Error` for PHP's; both are `Throwable`.", "`Exception` sert aux problèmes de ton code, `Error` à ceux de PHP ; les deux sont `Throwable`."),
    L("`catch (A | B $e)` handles several types the same way.", "`catch (A | B $e)` traite plusieurs types de la même façon."),
  ],
};

export const customExceptions: Lesson = {
  id: "custom-exceptions",
  chapterId: CH,
  title: L("Your own exceptions", "Tes propres exceptions"),
  tagline: L("Named exceptions, context and chaining", "Des exceptions nommées, du contexte et du chaînage"),
  xp: 60,
  syntax: ["extends Exception", "getPrevious()", "getCode()", "throw $e"],
  doc: "guide-errors",
  steps: [
    {
      kind: "discover",
      title: L("Give your problems a name", "Donne un nom à tes problèmes"),
      body: [
        L(
          "An exception class can be empty: `class OutOfStockException extends RuntimeException {}`. Its **name** is the useful part: callers can catch exactly this problem and let the others go up.",
          "Une classe d'exception peut être vide : `class OutOfStockException extends RuntimeException {}`. Son **nom** est ce qui compte : les appelants peuvent attraper exactement ce problème et laisser passer les autres.",
        ),
        L(
          "It can also carry **context**: extra properties with the data needed to react (which product, how many were asked), set in its constructor.",
          "Elle peut aussi transporter du **contexte** : des propriétés en plus avec les données utiles pour réagir (quel produit, combien demandés), remplies dans son constructeur.",
        ),
      ],
      scene: "exception",
      example: {
        code: `<?php\nclass OutOfStockException extends RuntimeException\n{\n    public function __construct(public readonly string $product, public readonly int $left)\n    {\n        parent::__construct("Only $left $product left");\n    }\n}\n\nfunction order(string $product, int $qty): void\n{\n    $stock = ["lamp" => 2];\n    if ($qty > ($stock[$product] ?? 0)) {\n        throw new OutOfStockException($product, $stock[$product] ?? 0);\n    }\n    echo "Ordered $qty $product\\n";\n}\n\ntry {\n    order("lamp", 1);\n    order("lamp", 5);\n} catch (OutOfStockException $e) {\n    echo $e->getMessage() . "\\n";\n    echo "Suggest {$e->left} instead of 5";\n}\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Which catch wins?", "Quel catch gagne ?"),
      question: L("PaymentException extends AppException. What does this print?", "PaymentException hérite d'AppException. Qu'affiche ce code ?"),
      code: `<?php\nclass AppException extends Exception {}\nclass PaymentException extends AppException {}\n\ntry {\n    throw new PaymentException("declined");\n} catch (AppException $e) {\n    echo "app:" . $e->getMessage();\n} catch (PaymentException $e) {\n    echo "payment";\n}\n`,
      options: ["payment", "app:declined", "app:declinedpayment", "declined"],
      answer: 1,
      explain: L(
        "PHP tries the catch blocks in order and takes the **first** that matches. A PaymentException *is* an AppException, so the first block wins. Put the most specific types first.",
        "PHP essaie les blocs catch dans l'ordre et prend le **premier** qui correspond. Une PaymentException *est* une AppException, donc le premier bloc gagne. Mets les types les plus précis en premier.",
      ),
    },
    {
      kind: "discover",
      title: L("Chain the cause", "Chaîne la cause"),
      body: [
        L(
          "Low-level errors (a JSON syntax error, a database timeout) mean little to the rest of your app. Catch them and throw your own, more meaningful exception, passing the original as the third argument: `new ConfigException(\"…\", 0, $e)`.",
          "Les erreurs de bas niveau (une erreur de syntaxe JSON, un délai de base de données) ne parlent pas au reste de ton appli. Attrape-les et lance ta propre exception, plus parlante, en passant l'originale en troisième argument : `new ConfigException(\"…\", 0, $e)`.",
        ),
        L(
          "Nothing is lost: `$e->getPrevious()` gives back the original exception, so logs can show the whole story.",
          "Rien n'est perdu : `$e->getPrevious()` rend l'exception d'origine, donc les journaux peuvent montrer toute l'histoire.",
        ),
      ],
      example: {
        code: `<?php\nclass StorageException extends RuntimeException {}\n\nfunction save(string $data): void\n{\n    try {\n        throw new ErrorException("disk quota exceeded");\n    } catch (ErrorException $e) {\n        throw new StorageException("Could not save the report", 0, $e);\n    }\n}\n\ntry {\n    save("report");\n} catch (StorageException $e) {\n    echo $e->getMessage() . "\\n";\n    echo "Because: " . $e->getPrevious()->getMessage();\n}\n`,
      },
    },
    {
      kind: "watch",
      title: L("Watch a rethrow", "Regarde un relancement"),
      body: L(
        "Sometimes you catch an exception just to log it, then let it continue with `throw $e;`. Step through and watch the exception pass through two catch blocks.",
        "Parfois on attrape une exception juste pour la journaliser, puis on la laisse continuer avec `throw $e;`. Avance pas à pas et regarde l'exception traverser deux blocs catch.",
      ),
      code: `<?php\n$log = [];\nfunction charge(int $amount): void\n{\n    global $log;\n    try {\n        throw new RuntimeException("Card declined");\n    } catch (RuntimeException $e) {\n        $log[] = "charge failed: " . $e->getMessage();\n        throw $e;\n    }\n}\n\ntry {\n    charge(30);\n} catch (RuntimeException $e) {\n    echo "Order cancelled\\n";\n}\necho count($log) . " log entry";\n`,
      notes: {
        9: L("Inside charge(): the error is written to the log…", "Dans charge() : l'erreur est écrite dans le journal…"),
        17: L("…then rethrown, so the caller still knows the order failed.", "…puis relancée, donc l'appelant sait toujours que la commande a échoué."),
        19: L("The log kept the detail; the caller handled the consequence.", "Le journal a gardé le détail ; l'appelant a géré la conséquence."),
      },
    },
    {
      kind: "try",
      title: L("Insufficient funds", "Fonds insuffisants"),
      body: L(
        "Create an `InsufficientFundsException` class (extending `Exception`) and make `withdraw()` throw it instead of a plain `Exception`.",
        "Crée une classe `InsufficientFundsException` (qui hérite d'`Exception`) et fais lancer celle-ci par `withdraw()` au lieu d'une `Exception` générique.",
      ),
      files: {
        "index.php": `<?php\n// 1. Create the InsufficientFundsException class here\n\nfunction withdraw(int $balance, int $amount): int\n{\n    if ($amount > $balance) {\n        throw new Exception("Not enough money");\n    }\n    return $balance - $amount;\n}\n\ntry {\n    echo withdraw(100, 30) . "\\n";\n    echo withdraw(10, 50) . "\\n";\n} catch (Exception $e) {\n    echo "Refused: " . $e->getMessage();\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass InsufficientFundsException extends Exception {}\n\nfunction withdraw(int $balance, int $amount): int\n{\n    if ($amount > $balance) {\n        throw new InsufficientFundsException("Not enough money");\n    }\n    return $balance - $amount;\n}\n\ntry {\n    echo withdraw(100, 30) . "\\n";\n    echo withdraw(10, 50) . "\\n";\n} catch (InsufficientFundsException $e) {\n    echo "Refused: " . $e->getMessage();\n}\n`,
      },
      probes: ["withdraw(10, 50)", "withdraw(50, 20)"],
      objectives: [
        {
          id: "class",
          label: L("Define InsufficientFundsException", "Définir InsufficientFundsException"),
          check: definesClass("InsufficientFundsException"),
          hints: [
            L("A custom exception is a class that extends Exception, and it can be empty.", "Une exception perso est une classe qui hérite d'Exception, et elle peut être vide."),
            L("`class Name extends Exception {}`", "`class Name extends Exception {}`"),
            L("Line 2: `class InsufficientFundsException extends Exception {}`", "Ligne 2 : `class InsufficientFundsException extends Exception {}`"),
          ],
        },
        {
          id: "throws",
          label: L("withdraw() throws it when money is short", "withdraw() la lance quand l'argent manque"),
          check: all(probeThrows("withdraw(10, 50)", "InsufficientFundsException"), probeIs("withdraw(50, 20)", 30)),
          hints: [
            L("Only the `throw new …` line needs to change.", "Seule la ligne `throw new …` doit changer."),
            L("Throw your class, with the same message.", "Lance ta classe, avec le même message."),
            L("`throw new InsufficientFundsException(\"Not enough money\");`", "`throw new InsufficientFundsException(\"Not enough money\");`"),
          ],
        },
      ],
      cheat: "exceptions",
    },
    {
      kind: "challenge",
      title: L("A config error with a cause", "Une erreur de config avec sa cause"),
      body: L(
        "`loadConfig()` lets a raw `JsonException` escape. Make it throw a `ConfigException(\"Invalid config file\")` instead, keeping the JSON error as the previous exception. Then catch `ConfigException` and print its message and `Cause: ` + the original message.",
        "`loadConfig()` laisse s'échapper une `JsonException` brute. Fais-lui plutôt lancer une `ConfigException(\"Invalid config file\")`, en gardant l'erreur JSON comme exception précédente. Puis attrape `ConfigException` et affiche son message et `Cause: ` + le message d'origine.",
      ),
      files: {
        "index.php": `<?php\nclass ConfigException extends RuntimeException {}\n\nfunction loadConfig(string $json): array\n{\n    return json_decode($json, true, 512, JSON_THROW_ON_ERROR);\n}\n\ntry {\n    $config = loadConfig('{"debug": true');\n} catch (Exception $e) {\n    echo get_class($e) . ": " . $e->getMessage() . "\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass ConfigException extends RuntimeException {}\n\nfunction loadConfig(string $json): array\n{\n    try {\n        return json_decode($json, true, 512, JSON_THROW_ON_ERROR);\n    } catch (JsonException $e) {\n        throw new ConfigException("Invalid config file", 0, $e);\n    }\n}\n\ntry {\n    $config = loadConfig('{"debug": true');\n} catch (ConfigException $e) {\n    echo $e->getMessage() . "\\n";\n    echo "Cause: " . $e->getPrevious()->getMessage() . "\\n";\n}\n`,
      },
      probes: ["loadConfig('{')", "(function () { try { loadConfig('{'); } catch (ConfigException $e) { return get_class($e->getPrevious()); } return null; })()"],
      objectives: [
        {
          id: "wrap",
          label: L("loadConfig() throws a ConfigException", "loadConfig() lance une ConfigException"),
          check: probeThrows("loadConfig('{')", "ConfigException"),
          hints: [
            L("Catch the JsonException inside loadConfig() and throw your own instead.", "Attrape la JsonException dans loadConfig() et lance la tienne à la place."),
            L("`try { return json_decode(…); } catch (JsonException $e) { throw new ConfigException(…); }`", "`try { return json_decode(…); } catch (JsonException $e) { throw new ConfigException(…); }`"),
            L("In the catch: `throw new ConfigException(\"Invalid config file\", 0, $e);`", "Dans le catch : `throw new ConfigException(\"Invalid config file\", 0, $e);`"),
          ],
        },
        {
          id: "previous",
          label: L("The JsonException is kept as the previous exception", "La JsonException est gardée comme exception précédente"),
          check: probeIs("(function () { try { loadConfig('{'); } catch (ConfigException $e) { return get_class($e->getPrevious()); } return null; })()", "JsonException"),
          hints: [
            L("The constructor of every exception takes (message, code, previous).", "Le constructeur de chaque exception prend (message, code, précédente)."),
            L("Pass `0` as the code and `$e` as the previous one.", "Passe `0` comme code et `$e` comme précédente."),
            L("`new ConfigException(\"Invalid config file\", 0, $e)`", "`new ConfigException(\"Invalid config file\", 0, $e)`"),
          ],
        },
        {
          id: "print",
          label: L("Print the message and its cause", "Afficher le message et sa cause"),
          check: outputLines(["Invalid config file", "Cause: Syntax error"]),
          hints: [
            L("Catch `ConfigException` at the bottom, and ask it for its previous exception.", "Attrape `ConfigException` en bas, et demande-lui son exception précédente."),
            L("`$e->getPrevious()->getMessage()` is \"Syntax error\".", "`$e->getPrevious()->getMessage()` vaut « Syntax error »."),
            L("`echo $e->getMessage() . \"\\n\"; echo \"Cause: \" . $e->getPrevious()->getMessage();`", "`echo $e->getMessage() . \"\\n\"; echo \"Cause: \" . $e->getPrevious()->getMessage();`"),
          ],
        },
      ],
      cheat: "exceptions",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A custom exception is a class extending Exception (or one of its children).", "Une exception perso est une classe qui hérite d'Exception (ou d'un de ses enfants)."),
    L("Its name lets callers catch exactly that problem; properties carry context.", "Son nom permet d'attraper exactement ce problème ; ses propriétés portent le contexte."),
    L("Catch blocks are tried in order: most specific first.", "Les blocs catch sont essayés dans l'ordre : le plus précis d'abord."),
    L("Wrap low-level errors with `new MyException(msg, 0, $e)`; `getPrevious()` finds the cause.", "Enveloppe les erreurs de bas niveau avec `new MyException(msg, 0, $e)` ; `getPrevious()` retrouve la cause."),
  ],
};

export const nullSafety: Lesson = {
  id: "null-safety",
  chapterId: CH,
  title: L("Living with null", "Vivre avec null"),
  tagline: L("??, ??=, ?-> and nullable types", "??, ??=, ?-> et les types nullables"),
  xp: 60,
  syntax: ["??", "??=", "?->", "?string", "isset", "empty"],
  doc: "guide-errors",
  steps: [
    {
      kind: "discover",
      title: L("null, isset and empty", "null, isset et empty"),
      body: [
        L(
          "`null` means \"no value\". It's what you get from a missing array key, an unset variable, or a function that found nothing. Most PHP bugs involving warnings are a `null` arriving where nobody expected it.",
          "`null` veut dire « pas de valeur ». C'est ce que tu obtiens d'une clé absente, d'une variable non définie, ou d'une fonction qui n'a rien trouvé. La plupart des bugs à warnings sont un `null` qui arrive là où personne ne l'attendait.",
        ),
        L(
          "`isset($x)` is true when `$x` exists **and** isn't null. `empty($x)` is true for anything \"falsy\": null, 0, \"\", \"0\", false and []. Neither one warns about undefined variables or keys.",
          "`isset($x)` est vrai quand `$x` existe **et** n'est pas null. `empty($x)` est vrai pour tout ce qui est « faux » : null, 0, \"\", \"0\", false et []. Aucun des deux ne râle pour une variable ou une clé indéfinie.",
        ),
      ],
      example: {
        code: `<?php\n$values = [null, 0, "", "0", "hi", []];\nforeach ($values as $v) {\n    echo str_pad(json_encode($v), 6)\n        . " isset: " . (isset($v) ? "yes" : "no ")\n        . "  empty: " . (empty($v) ? "yes" : "no") . "\\n";\n}\n`,
        caption: L("Surprise: \"0\" is empty, but \"hi\" isn't.", "Surprise : \"0\" est vide, mais \"hi\" non."),
      },
    },
    {
      kind: "discover",
      title: L("Defaults with ?? and ??=", "Des valeurs par défaut avec ?? et ??="),
      body: [
        L(
          "`$a ?? $b` (null coalescing) returns `$a` if it's set and not null, otherwise `$b`. It works on missing keys and properties without any warning: `$_GET[\"page\"] ?? 1`.",
          "`$a ?? $b` (null coalescing) renvoie `$a` s'il existe et n'est pas null, sinon `$b`. Ça marche sur les clés et propriétés absentes sans aucun warning : `$_GET[\"page\"] ?? 1`.",
        ),
        L(
          "`$x ??= $default` assigns only if `$x` is null or missing: perfect to fill in defaults without overwriting real values.",
          "`$x ??= $default` n'affecte que si `$x` est null ou absent : parfait pour remplir des valeurs par défaut sans écraser les vraies.",
        ),
      ],
      example: {
        code: `<?php\n$query = ["sort" => "price"];\n$page = $query["page"] ?? 1;\n$sort = $query["sort"] ?? "name";\necho "page $page, sorted by $sort\\n";\n\n$options = ["color" => "blue"];\n$options["color"] ??= "red";\n$options["size"] ??= "M";\nprint_r($options);\n`,
      },
    },
    {
      kind: "quiz",
      title: L("?? or ?:", "?? ou ?:"),
      question: L("`?:` returns the right side when the left is *falsy*. What does this print?", "`?:` renvoie la partie droite quand la gauche est *fausse*. Qu'affiche ce code ?"),
      code: `<?php\n$name = "";\necho $name ?? "Guest";\necho "|";\necho $name ?: "Guest";\n`,
      options: ["Guest|Guest", "|Guest", "Guest|", "|"],
      answer: 1,
      explain: L(
        "`\"\"` isn't null, so `??` keeps it (prints nothing). But `\"\"` is falsy, so `?:` switches to \"Guest\". Use `??` for missing values, `?:` for empty ones.",
        "`\"\"` n'est pas null, donc `??` le garde (n'affiche rien). Mais `\"\"` est faux, donc `?:` passe à « Guest ». Utilise `??` pour les valeurs absentes, `?:` pour les vides.",
      ),
    },
    {
      kind: "discover",
      title: L("The nullsafe operator ?->", "L'opérateur nullsafe ?->"),
      body: [
        L(
          "A type like `?Address` means \"an Address or null\". Calling a method or reading a property on null gives a warning or an Error. The **nullsafe operator** `?->` stops the chain and returns null as soon as one link is null.",
          "Un type comme `?Address` veut dire « une Address ou null ». Appeler une méthode ou lire une propriété sur null donne un warning ou une Error. L'**opérateur nullsafe** `?->` arrête la chaîne et renvoie null dès qu'un maillon est null.",
        ),
        L("Combine it with `??` to give a fallback for the whole chain.", "Combine-le avec `??` pour donner une valeur de secours à toute la chaîne."),
      ],
      example: {
        code: `<?php\nclass Address\n{\n    public function __construct(public string $city) {}\n}\nclass User\n{\n    public function __construct(private ?Address $address = null) {}\n    public function getAddress(): ?Address\n    {\n        return $this->address;\n    }\n}\n\n$ada = new User(new Address("London"));\n$bob = new User();\necho $ada->getAddress()?->city ?? "unknown", "\\n";\necho $bob->getAddress()?->city ?? "unknown", "\\n";\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "`?->` arrived in PHP 8.0. Before, you had to write `$a = $user->getAddress(); $city = $a !== null ? $a->city : null;`.",
          "`?->` est arrivé avec PHP 8.0. Avant, il fallait écrire `$a = $user->getAddress(); $city = $a !== null ? $a->city : null;`.",
        ),
      },
    },
    {
      kind: "try",
      title: L("User not found", "Utilisateur introuvable"),
      body: L(
        "`findUser()` returns `?array`: an array, or null when the user doesn't exist. The second lookup triggers a warning. Print `Not found` instead, without any warning.",
        "`findUser()` renvoie `?array` : un tableau, ou null quand l'utilisateur n'existe pas. La deuxième recherche déclenche un warning. Affiche plutôt `Not found`, sans aucun warning.",
      ),
      files: {
        "index.php": `<?php\nfunction findUser(int $id): ?array\n{\n    $users = [1 => ["name" => "Ada"], 2 => ["name" => "Linus"]];\n    return $users[$id] ?? null;\n}\n\n$first = findUser(1);\necho $first["name"] . "\\n";\n\n$missing = findUser(3);\necho $missing["name"] . "\\n";\n`,
      },
      solution: {
        "index.php": `<?php\nfunction findUser(int $id): ?array\n{\n    $users = [1 => ["name" => "Ada"], 2 => ["name" => "Linus"]];\n    return $users[$id] ?? null;\n}\n\n$first = findUser(1);\necho $first["name"] . "\\n";\n\n$missing = findUser(3);\necho ($missing["name"] ?? "Not found") . "\\n";\n`,
      },
      objectives: [
        {
          id: "fallback",
          label: L("Print Ada, then Not found, with no warning", "Afficher Ada, puis Not found, sans warning"),
          check: all(clean, outputLines(["Ada", "Not found"])),
          hints: [
            L("`$missing` is null, and reading a key on null warns.", "`$missing` vaut null, et lire une clé sur null provoque un warning."),
            L("`??` works on the whole expression `$missing[\"name\"]`, even when `$missing` is null.", "`??` marche sur toute l'expression `$missing[\"name\"]`, même quand `$missing` vaut null."),
            L("`echo ($missing[\"name\"] ?? \"Not found\") . \"\\n\";`", "`echo ($missing[\"name\"] ?? \"Not found\") . \"\\n\";`"),
          ],
        },
      ],
      cheat: "null-safety",
    },
    {
      kind: "challenge",
      title: L("Defaults and display names", "Valeurs par défaut et noms affichés"),
      body: L(
        "Fill in the missing settings with `??=` (don't overwrite the existing theme), and print each account's display name: its profile nickname, or its email when there's no nickname or no profile at all. No warnings allowed.",
        "Complète les réglages manquants avec `??=` (sans écraser le thème existant), et affiche le nom de chaque compte : le pseudo de son profil, ou son email quand il n'y a pas de pseudo ou pas de profil du tout. Aucun warning autorisé.",
      ),
      files: {
        "index.php": `<?php\nclass Profile\n{\n    public function __construct(public ?string $nickname = null) {}\n}\nclass Account\n{\n    public function __construct(public string $email, public ?Profile $profile = null) {}\n}\n\n$settings = ["theme" => "dark"];\n// 1. Default "lang" to "en" and "theme" to "light", without overwriting\n\n$accounts = [\n    new Account("ada@example.com", new Profile("ada")),\n    new Account("bob@example.com", new Profile()),\n    new Account("cy@example.com"),\n];\n\n// 2. Print the nickname, or the email when there is none\nforeach ($accounts as $account) {\n    echo $account->profile->nickname . "\\n";\n}\n\necho $settings["theme"] . " " . $settings["lang"];\n`,
      },
      solution: {
        "index.php": `<?php\nclass Profile\n{\n    public function __construct(public ?string $nickname = null) {}\n}\nclass Account\n{\n    public function __construct(public string $email, public ?Profile $profile = null) {}\n}\n\n$settings = ["theme" => "dark"];\n$settings["lang"] ??= "en";\n$settings["theme"] ??= "light";\n\n$accounts = [\n    new Account("ada@example.com", new Profile("ada")),\n    new Account("bob@example.com", new Profile()),\n    new Account("cy@example.com"),\n];\n\nforeach ($accounts as $account) {\n    echo ($account->profile?->nickname ?? $account->email) . "\\n";\n}\n\necho $settings["theme"] . " " . $settings["lang"];\n`,
      },
      objectives: [
        {
          id: "defaults",
          label: L("Defaults set with ??= (last line: dark en)", "Valeurs par défaut avec ??= (dernière ligne : dark en)"),
          check: all(uses(/\?\?=/), outputHas(/dark en\s*$/)),
          hints: [
            L("`??=` only assigns when the key is missing or null.", "`??=` n'affecte que si la clé est absente ou null."),
            L("One line per setting: `$settings[\"lang\"] ??= …;`", "Une ligne par réglage : `$settings[\"lang\"] ??= …;`"),
            L("`$settings[\"lang\"] ??= \"en\";` and `$settings[\"theme\"] ??= \"light\";`", "`$settings[\"lang\"] ??= \"en\";` et `$settings[\"theme\"] ??= \"light\";`"),
          ],
        },
        {
          id: "names",
          label: L("Print ada, bob@example.com, cy@example.com", "Afficher ada, bob@example.com, cy@example.com"),
          check: outputLines(["ada", "bob@example.com", "cy@example.com"]),
          hints: [
            L("Two things can be null: the profile, and the nickname.", "Deux choses peuvent être null : le profil, et le pseudo."),
            L("`?->` handles a null profile, `??` gives the fallback.", "`?->` gère un profil null, `??` donne la valeur de secours."),
            L("`echo ($account->profile?->nickname ?? $account->email) . \"\\n\";`", "`echo ($account->profile?->nickname ?? $account->email) . \"\\n\";`"),
          ],
        },
        {
          id: "clean",
          label: L("No warnings", "Aucun warning"),
          check: clean,
          hints: [
            L("Run and read the Problems tab: each warning points to a null.", "Exécute et lis l'onglet Problèmes : chaque warning pointe vers un null."),
            L("Fix the settings first, then the loop.", "Corrige d'abord les réglages, puis la boucle."),
            L("With `??=` for the settings and `?->` + `??` in the loop, every warning disappears.", "Avec `??=` pour les réglages et `?->` + `??` dans la boucle, tous les warnings disparaissent."),
          ],
        },
      ],
      cheat: "null-safety",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`isset()` = exists and not null; `empty()` = falsy (null, 0, \"\", \"0\", false, []).", "`isset()` = existe et pas null ; `empty()` = faux (null, 0, \"\", \"0\", false, [])."),
    L("`??` gives a default for null or missing; `??=` fills in without overwriting.", "`??` donne une valeur par défaut pour null ou absent ; `??=` complète sans écraser."),
    L("`?:` reacts to any falsy value, `??` only to null.", "`?:` réagit à toute valeur fausse, `??` seulement à null."),
    L("`?Type` means \"Type or null\"; `?->` stops a chain at the first null (PHP 8.0).", "`?Type` veut dire « Type ou null » ; `?->` arrête une chaîne au premier null (PHP 8.0)."),
  ],
};

export const strictTypes: Lesson = {
  id: "strict-types",
  chapterId: CH,
  title: L("Strict types", "Les types stricts"),
  tagline: L("declare(strict_types=1), TypeError and return types", "declare(strict_types=1), TypeError et types de retour"),
  xp: 60,
  syntax: ["declare(strict_types=1)", "int|string", ": void", "mixed", "TypeError"],
  doc: "guide-errors",
  steps: [
    {
      kind: "discover",
      title: L("By default, PHP converts for you", "Par défaut, PHP convertit pour toi"),
      body: [
        L(
          "When a function declares `int $a` and you pass `\"5\"`, PHP quietly converts the string to 5. This is **coercive mode**, the default. It's convenient, but it hides mistakes: maybe that `\"5\"` should never have been a string.",
          "Quand une fonction déclare `int $a` et que tu passes `\"5\"`, PHP convertit discrètement la chaîne en 5. C'est le **mode coercitif**, celui par défaut. C'est pratique, mais ça cache des erreurs : peut-être que ce `\"5\"` n'aurait jamais dû être une chaîne.",
        ),
        L(
          "Values that can't be converted at all (like `\"abc\"` for an int) always throw a `TypeError`, even in coercive mode.",
          "Les valeurs impossibles à convertir (comme `\"abc\"` pour un int) lancent toujours une `TypeError`, même en mode coercitif.",
        ),
      ],
      scene: "compile",
      example: {
        code: `<?php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n\nvar_dump(add("5", "10"));\nvar_dump(add(2.0, 3));\nvar_dump(add("abc", 1));\n`,
      },
    },
    {
      kind: "discover",
      title: L("Turn on strict mode", "Active le mode strict"),
      body: [
        L(
          "Write `declare(strict_types=1);` as the **very first statement** of a file. From then on, every call made *from this file* must pass exactly the declared types, or PHP throws a `TypeError`.",
          "Écris `declare(strict_types=1);` comme **toute première instruction** d'un fichier. À partir de là, chaque appel fait *depuis ce fichier* doit passer exactement les types déclarés, sinon PHP lance une `TypeError`.",
        ),
        L(
          "One exception: an int is accepted where a float is expected (no information is lost). Most modern PHP projects put strict types at the top of every file.",
          "Une exception : un int est accepté là où un float est attendu (rien n'est perdu). La plupart des projets PHP modernes mettent les types stricts en haut de chaque fichier.",
        ),
      ],
      example: {
        code: `<?php\ndeclare(strict_types=1);\n\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n\necho add(2, 3), "\\n";\necho add("2", "3"), "\\n";\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Coercive mode", "Mode coercitif"),
      question: L("No strict_types here. What does this print?", "Pas de strict_types ici. Qu'affiche ce code ?"),
      code: `<?php\nfunction half(int $n): float\n{\n    return $n / 2;\n}\nvar_dump(half("8"));\n`,
      options: ["float(4)", "int(4)", L("A TypeError", "Une TypeError"), 'string(1) "4"'],
      answer: 0,
      explain: L(
        "`\"8\"` is converted to the int 8, `8 / 2` gives the int 4, and the `: float` return type converts it to `float(4)`. Types convert both ways in coercive mode.",
        "`\"8\"` est converti en int 8, `8 / 2` donne l'int 4, et le type de retour `: float` le convertit en `float(4)`. Les types convertissent dans les deux sens en mode coercitif.",
      ),
    },
    {
      kind: "discover",
      title: L("Return types and union types", "Types de retour et types union"),
      body: [
        L(
          "After the parentheses, `: int` promises what a function returns. `: void` means it returns nothing, `: ?string` a string or null, and since PHP 8.0 a **union type** `int|string` accepts either. `mixed` accepts anything, and `never` (8.1) is for functions that always throw or exit.",
          "Après les parenthèses, `: int` promet ce que la fonction renvoie. `: void` veut dire qu'elle ne renvoie rien, `: ?string` une chaîne ou null, et depuis PHP 8.0 un **type union** `int|string` accepte l'un ou l'autre. `mixed` accepte tout, et `never` (8.1) sert aux fonctions qui lancent toujours une exception ou quittent.",
        ),
        L(
          "Types are documentation that PHP checks for you: a wrong return is caught right where it happens, not three functions later.",
          "Les types sont une documentation que PHP vérifie pour toi : un mauvais retour est attrapé là où il se produit, pas trois fonctions plus loin.",
        ),
      ],
      example: {
        code: `<?php\ndeclare(strict_types=1);\n\nfunction label(int|string $id): string\n{\n    return "#" . $id;\n}\n\nfunction findPrice(string $item): ?float\n{\n    return ["tea" => 2.5][$item] ?? null;\n}\n\nfunction count3(): int\n{\n    return "3";\n}\n\necho label(7), " ", label("A7"), "\\n";\nvar_dump(findPrice("tea"), findPrice("cake"));\necho count3();\n`,
      },
    },
    {
      kind: "try",
      title: L("Make the call strict", "Rends l'appel strict"),
      body: L(
        "Turn on strict types in this file, run it, and fix the call that breaks so it prints `39.98`.",
        "Active les types stricts dans ce fichier, exécute-le, et corrige l'appel qui casse pour afficher `39.98`.",
      ),
      files: { "index.php": `<?php\nfunction total(float $price, int $quantity): float\n{\n    return $price * $quantity;\n}\n\necho total("19.99", 2);\n` },
      solution: { "index.php": `<?php\ndeclare(strict_types=1);\n\nfunction total(float $price, int $quantity): float\n{\n    return $price * $quantity;\n}\n\necho total(19.99, 2);\n` },
      objectives: [
        {
          id: "strict",
          label: L("declare(strict_types=1) at the top", "declare(strict_types=1) en haut"),
          check: uses(/declare\s*\(\s*strict_types\s*=\s*1\s*\)/),
          hints: [
            L("It must be the first statement, right after `<?php`.", "Ce doit être la première instruction, juste après `<?php`."),
            L("`declare(strict_types=1);`", "`declare(strict_types=1);`"),
            L("Line 2: `declare(strict_types=1);`", "Ligne 2 : `declare(strict_types=1);`"),
          ],
        },
        {
          id: "fixed",
          label: L("No TypeError, and it prints 39.98", "Pas de TypeError, et ça affiche 39.98"),
          check: all(ran, outputIs("39.98")),
          hints: [
            L("In strict mode, `\"19.99\"` is a string, not a float.", "En mode strict, `\"19.99\"` est une chaîne, pas un float."),
            L("Remove the quotes around the price.", "Enlève les guillemets autour du prix."),
            L("`echo total(19.99, 2);`", "`echo total(19.99, 2);`"),
          ],
        },
      ],
      cheat: "errors",
    },
    {
      kind: "challenge",
      title: L("Type a small library", "Type une petite bibliothèque"),
      body: L(
        "These two helpers have no types at all. Add strict types to the file, and declare `slugify(string $title): string` and `average(array $numbers): float`. The average of [2, 4] must come back as the float `3.0`.",
        "Ces deux fonctions n'ont aucun type. Active les types stricts dans le fichier, et déclare `slugify(string $title): string` et `average(array $numbers): float`. La moyenne de [2, 4] doit revenir sous forme du float `3.0`.",
      ),
      files: {
        "index.php": `<?php\n// Add declare(strict_types=1) and type every parameter and return value.\n\nfunction slugify($title)\n{\n    return strtolower(str_replace(" ", "-", trim($title)));\n}\n\nfunction average($numbers)\n{\n    return array_sum($numbers) / count($numbers);\n}\n\necho slugify("  Hello World ") . "\\n";\necho average([2, 4]);\n`,
      },
      solution: {
        "index.php": `<?php\ndeclare(strict_types=1);\n\nfunction slugify(string $title): string\n{\n    return strtolower(str_replace(" ", "-", trim($title)));\n}\n\nfunction average(array $numbers): float\n{\n    return array_sum($numbers) / count($numbers);\n}\n\necho slugify("  Hello World ") . "\\n";\necho average([2, 4]);\n`,
      },
      probes: ["average([2, 4])"],
      objectives: [
        {
          id: "strict",
          label: L("Strict types on", "Types stricts activés"),
          check: uses(/declare\s*\(\s*strict_types\s*=\s*1\s*\)/),
          hints: [
            L("Comments don't count: write the real declare statement.", "Les commentaires ne comptent pas : écris la vraie instruction declare."),
            L("Put it right after `<?php`.", "Place-la juste après `<?php`."),
            L("Line 2: `declare(strict_types=1);`", "Ligne 2 : `declare(strict_types=1);`"),
          ],
        },
        {
          id: "slugify",
          label: L("slugify takes a string and returns a string", "slugify prend une chaîne et renvoie une chaîne"),
          check: uses(/function\s+slugify\s*\(\s*string\s+\$title\s*\)\s*:\s*string/),
          hints: [
            L("The type goes before the parameter, the return type after the parentheses.", "Le type se place avant le paramètre, le type de retour après les parenthèses."),
            L("`function name(type $param): type`", "`function name(type $param): type`"),
            L("`function slugify(string $title): string`", "`function slugify(string $title): string`"),
          ],
        },
        {
          id: "average",
          label: L("average takes an array and returns a float (3.0)", "average prend un tableau et renvoie un float (3.0)"),
          check: all(uses(/function\s+average\s*\(\s*array\s+\$numbers\s*\)\s*:\s*float/), probeShows("average([2, 4])", "3.0")),
          hints: [
            L("6 / 2 gives the int 3 in PHP; a `float` return type turns it into 3.0.", "6 / 2 donne l'int 3 en PHP ; un type de retour `float` le transforme en 3.0."),
            L("Return types still convert int to float in strict mode.", "Les types de retour convertissent toujours int en float en mode strict."),
            L("`function average(array $numbers): float`", "`function average(array $numbers): float`"),
          ],
        },
        {
          id: "output",
          label: L("Still prints hello-world and 3", "Affiche toujours hello-world et 3"),
          check: all(ran, outputLines(["hello-world", "3"])),
          hints: [
            L("The calls at the bottom already pass the right types.", "Les appels en bas passent déjà les bons types."),
            L("If you see a TypeError, read which argument it's about.", "Si tu vois une TypeError, lis de quel argument elle parle."),
            L("Echo prints the float 3.0 as `3`.", "Echo affiche le float 3.0 comme `3`."),
          ],
        },
      ],
      cheat: "errors",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Coercive mode (default) converts compatible values; impossible ones throw TypeError.", "Le mode coercitif (par défaut) convertit les valeurs compatibles ; les impossibles lancent une TypeError."),
    L("`declare(strict_types=1);` must be first, and applies to calls made from that file.", "`declare(strict_types=1);` doit être en premier, et s'applique aux appels faits depuis ce fichier."),
    L("Return types (`: int`, `: void`, `: ?string`) are checked when the function returns.", "Les types de retour (`: int`, `: void`, `: ?string`) sont vérifiés au moment du retour."),
    L("Union types `int|string` (8.0), `mixed`, `never` (8.1) describe more precise contracts.", "Les types union `int|string` (8.0), `mixed`, `never` (8.1) décrivent des contrats plus précis."),
  ],
};

export const debugging: Lesson = {
  id: "debugging",
  chapterId: CH,
  title: L("Debugging like a pro", "Déboguer comme un pro"),
  tagline: L("var_dump, stack traces and the Trace panel", "var_dump, traces d'appels et le panneau Trace"),
  xp: 60,
  syntax: ["var_dump", "print_r", "var_export", "debug_print_backtrace", "#0 … #1"],
  doc: "guide-debugging",
  steps: [
    {
      kind: "discover",
      title: L("Three ways to look inside a value", "Trois façons de regarder dans une valeur"),
      body: [
        L(
          "`var_dump()` shows types and lengths: the most precise. `print_r()` is shorter and easier to read for arrays, but hides types (`true` shows as 1, `null` as nothing). `var_export()` prints valid PHP code you could paste back.",
          "`var_dump()` montre les types et les longueurs : le plus précis. `print_r()` est plus court et plus lisible pour les tableaux, mais cache les types (`true` s'affiche 1, `null` rien du tout). `var_export()` affiche du code PHP valide que tu pourrais recoller.",
        ),
        L(
          "Never debug with `echo` alone: it turns `false`, `null` and `\"\"` into the same nothing.",
          "Ne débogue jamais avec `echo` seul : il transforme `false`, `null` et `\"\"` en un même rien.",
        ),
      ],
      example: {
        code: `<?php\n$cart = ["items" => 2, "paid" => false, "coupon" => null];\n\nvar_dump($cart);\nprint_r($cart);\necho "\\n";\nvar_export($cart);\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Why not echo?", "Pourquoi pas echo ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho true, "|", false, "|", null, "|", 0;\n`,
      options: ["1|||0", "true|false|null|0", "1|0||0", "1|0|null|0"],
      answer: 0,
      explain: L(
        "echo prints true as `1`, and both false and null as an empty string. You can't tell them apart: that's why var_dump exists.",
        "echo affiche true comme `1`, et false comme null comme une chaîne vide. Impossible de les distinguer : c'est pour ça que var_dump existe.",
      ),
    },
    {
      kind: "discover",
      title: L("Reading a stack trace", "Lire une trace d'appels"),
      body: [
        L(
          "When an exception escapes, PHP shows a **stack trace**: the chain of calls that led there. `#0` is where it broke, `#1` is who called that, and so on down to the main script.",
          "Quand une exception s'échappe, PHP montre une **trace d'appels** (stack trace) : la chaîne d'appels qui a mené là. `#0` est l'endroit où ça a cassé, `#1` qui l'a appelé, et ainsi de suite jusqu'au script principal.",
        ),
        L(
          "Read it in both directions: top line to know *what* failed, then down the list to find *your* code that passed the bad value. The bug is often a few frames below the crash.",
          "Lis-la dans les deux sens : la ligne du haut pour savoir *ce qui* a échoué, puis descends la liste pour trouver *ton* code qui a passé la mauvaise valeur. Le bug est souvent quelques lignes sous le plantage.",
        ),
      ],
      example: {
        code: `<?php\nfunction ratio(int $part, int $whole): float\n{\n    return intdiv($part * 100, $whole) / 100;\n}\n\nfunction report(array $stats): string\n{\n    return "Success: " . ratio($stats["ok"], $stats["total"]);\n}\n\necho report(["ok" => 3, "total" => 4]) . "\\n";\necho report(["ok" => 0, "total" => 0]) . "\\n";\n`,
        caption: L("In Problems, open the trace: intdiv ← ratio ← report (line 13).", "Dans Problèmes, ouvre la trace : intdiv ← ratio ← report (ligne 13)."),
      },
      examples: [
        {
          code: `<?php\nfunction a() { b(); }\nfunction b() { c(); }\nfunction c() { debug_print_backtrace(); }\na();\n`,
          caption: L(
            "`debug_print_backtrace()` prints the current call chain without any error. The last frame is the app's launcher running your file.",
            "`debug_print_backtrace()` affiche la chaîne d'appels en cours sans aucune erreur. La dernière ligne est le lanceur de l'appli qui exécute ton fichier.",
          ),
        },
      ],
    },
    {
      kind: "watch",
      title: L("Hunt a logic bug with the Trace", "Traque un bug de logique avec la Trace"),
      body: L(
        "No error here, just a wrong answer: the average should be 14. Step through and watch `$i` and `$sum` in the Variables panel. When does the loop start?",
        "Pas d'erreur ici, juste une mauvaise réponse : la moyenne devrait être 14. Avance pas à pas en surveillant `$i` et `$sum` dans le panneau Variables. Quand la boucle commence-t-elle ?",
      ),
      code: `<?php\n$temps = [12, 15, 11, 18];\n$sum = 0;\nfor ($i = 1; $i < count($temps); $i++) {\n    $sum += $temps[$i];\n}\n$avg = $sum / count($temps);\necho "Average: $avg";\n`,
      notes: {
        3: L("The total starts at 0.", "Le total commence à 0."),
        5: L("Look at `$i`: the first time we get here it's already 1, so 12 (index 0) is skipped!", "Regarde `$i` : la première fois qu'on arrive ici il vaut déjà 1, donc 12 (index 0) est sauté !"),
        7: L("44 / 4 = 11 instead of 56 / 4 = 14. The Trace showed the bug without any error message.", "44 / 4 = 11 au lieu de 56 / 4 = 14. La Trace a montré le bug sans aucun message d'erreur."),
      },
    },
    {
      kind: "try",
      title: L("Fix the average", "Corrige la moyenne"),
      body: L("Now fix the bug you found so the script prints `Average: 14`.", "Corrige maintenant le bug trouvé pour que le script affiche `Average: 14`."),
      files: { "index.php": `<?php\n$temps = [12, 15, 11, 18];\n$sum = 0;\nfor ($i = 1; $i < count($temps); $i++) {\n    $sum += $temps[$i];\n}\n$avg = $sum / count($temps);\necho "Average: $avg";\n` },
      solution: { "index.php": `<?php\n$temps = [12, 15, 11, 18];\n$sum = 0;\nfor ($i = 0; $i < count($temps); $i++) {\n    $sum += $temps[$i];\n}\n$avg = $sum / count($temps);\necho "Average: $avg";\n` },
      objectives: [
        {
          id: "avg",
          label: L("Print: Average: 14", "Afficher : Average: 14"),
          check: outputIs("Average: 14"),
          hints: [
            L("Array indexes start at 0.", "Les index de tableau commencent à 0."),
            L("The loop counter's starting value is wrong.", "La valeur de départ du compteur est fausse."),
            L("`for ($i = 0; …)` (or simply `$sum = array_sum($temps);`).", "`for ($i = 0; …)` (ou simplement `$sum = array_sum($temps);`)."),
          ],
        },
      ],
      cheat: "debugging",
    },
    {
      kind: "challenge",
      title: L("Follow the trace", "Suis la trace"),
      body: L(
        "This order total crashes. Run it, open the stack trace in the Problems tab, and follow it down to the bad data. Fix the data (don't remove the check in parsePrice) so it prints `Total: 61`.",
        "Ce total de commande plante. Exécute-le, ouvre la trace dans l'onglet Problèmes, et descends jusqu'à la donnée fautive. Corrige la donnée (sans retirer la vérification dans parsePrice) pour afficher `Total: 61`.",
      ),
      files: {
        "index.php": `<?php\nfunction parsePrice(string $raw): float\n{\n    if (!is_numeric($raw)) {\n        throw new InvalidArgumentException("Bad price: '$raw'");\n    }\n    return (float) $raw;\n}\n\nfunction lineTotal(array $line): float\n{\n    return parsePrice($line["price"]) * $line["qty"];\n}\n\nfunction orderTotal(array $lines): float\n{\n    $total = 0;\n    foreach ($lines as $line) {\n        $total += lineTotal($line);\n    }\n    return $total;\n}\n\n$order = [\n    ["name" => "Book", "price" => "12.50", "qty" => 2],\n    ["name" => "Pen", "price" => "1,20", "qty" => 5],\n    ["name" => "Bag", "price" => "30", "qty" => 1],\n];\necho "Total: " . orderTotal($order);\n`,
      },
      solution: {
        "index.php": `<?php\nfunction parsePrice(string $raw): float\n{\n    if (!is_numeric($raw)) {\n        throw new InvalidArgumentException("Bad price: '$raw'");\n    }\n    return (float) $raw;\n}\n\nfunction lineTotal(array $line): float\n{\n    return parsePrice($line["price"]) * $line["qty"];\n}\n\nfunction orderTotal(array $lines): float\n{\n    $total = 0;\n    foreach ($lines as $line) {\n        $total += lineTotal($line);\n    }\n    return $total;\n}\n\n$order = [\n    ["name" => "Book", "price" => "12.50", "qty" => 2],\n    ["name" => "Pen", "price" => "1.20", "qty" => 5],\n    ["name" => "Bag", "price" => "30", "qty" => 1],\n];\necho "Total: " . orderTotal($order);\n`,
      },
      objectives: [
        {
          id: "no-crash",
          label: L("No uncaught exception", "Aucune exception non attrapée"),
          check: all(ran, uses(/is_numeric/)),
          hints: [
            L("The message says which price is bad. The trace says which line called with it.", "Le message dit quel prix est mauvais. La trace dit quelle ligne l'a passé."),
            L("PHP writes decimals with a dot, not a comma.", "PHP écrit les décimales avec un point, pas une virgule."),
            L("In the order data, change `\"1,20\"` to `\"1.20\"`.", "Dans les données de commande, change `\"1,20\"` en `\"1.20\"`."),
          ],
        },
        {
          id: "total",
          label: L("Print: Total: 61", "Afficher : Total: 61"),
          check: outputIs("Total: 61"),
          hints: [
            L("25 + 6 + 30 = 61.", "25 + 6 + 30 = 61."),
            L("Once every price parses, the total is right.", "Une fois que tous les prix passent, le total est juste."),
            L("Fix the Pen's price to `\"1.20\"` and run again.", "Corrige le prix du stylo en `\"1.20\"` et relance."),
          ],
        },
      ],
      cheat: "debugging",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("var_dump shows types; print_r is compact; var_export prints PHP code.", "var_dump montre les types ; print_r est compact ; var_export affiche du code PHP."),
    L("echo hides false, null and \"\": don't debug with it.", "echo cache false, null et \"\" : ne débogue pas avec."),
    L("A stack trace goes from the crash (#0) down to the first caller.", "Une trace d'appels va du plantage (#0) jusqu'au premier appelant."),
    L("For wrong results without errors, step through and watch the variables.", "Pour un résultat faux sans erreur, avance pas à pas en surveillant les variables."),
  ],
};

export const bossDebug: Lesson = {
  id: "boss-debug",
  chapterId: CH,
  title: L("Boss: the broken gradebook", "Boss : le carnet de notes cassé"),
  tagline: L("Warnings, a crash and a wrong result, all at once", "Des warnings, un plantage et un faux résultat, tout à la fois"),
  xp: 100,
  boss: true,
  syntax: ["??", "try/catch", "continue", "Trace"],
  doc: "guide-debugging",
  steps: [
    {
      kind: "discover",
      title: L("A debugging checklist", "Une check-list de débogage"),
      body: [
        L(
          "Real bugs come in groups. Fix them one at a time, running after each change: **1.** Read the first problem, not the last. **2.** Go to its line and look at the values (var_dump or the Variables panel). **3.** Ask: what value did I expect here, and where does the wrong one come from? **4.** Fix the cause, not the symptom.",
          "Les vrais bugs arrivent en groupe. Corrige-les un par un, en exécutant après chaque changement : **1.** Lis le premier problème, pas le dernier. **2.** Va à sa ligne et regarde les valeurs (var_dump ou le panneau Variables). **3.** Demande-toi : quelle valeur j'attendais ici, et d'où vient la mauvaise ? **4.** Corrige la cause, pas le symptôme.",
        ),
        L(
          "Missing data is the most common cause: decide what should happen (a default, a skip, an error message) and write it explicitly.",
          "Les données manquantes sont la cause la plus fréquente : décide ce qui doit se passer (une valeur par défaut, un saut, un message d'erreur) et écris-le explicitement.",
        ),
      ],
      scene: "exception",
    },
    {
      kind: "quiz",
      title: L("Skipping an item", "Sauter un élément"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nforeach ([3, 0, 5] as $n) {\n    if ($n === 0) {\n        echo "skip ";\n        continue;\n    }\n    echo 10 / $n > 2 ? "big " : "small ";\n}\n`,
      options: ["big skip small", "big skip big", "big small", "skip big small"],
      answer: 0,
      explain: L(
        "10 / 3 ≈ 3.3 is big. 0 prints \"skip\" and `continue` jumps to the next item, so no division by zero. 10 / 5 = 2 isn't greater than 2: small.",
        "10 / 3 ≈ 3,3 est grand. 0 affiche « skip » et `continue` passe à l'élément suivant, donc pas de division par zéro. 10 / 5 = 2 n'est pas plus grand que 2 : small.",
      ),
    },
    {
      kind: "try",
      title: L("Warm-up: one bug", "Échauffement : un bug"),
      body: L(
        "Before the boss, a small one: this line prints a warning and the wrong name. Fix it to print `Top: Ana`.",
        "Avant le boss, un petit : cette ligne affiche un warning et le mauvais nom. Corrige-la pour afficher `Top: Ana`.",
      ),
      files: { "index.php": `<?php\n$top = ["name" => "Ana", "avg" => 15];\necho "Top: " . $top["Name"];\n` },
      solution: { "index.php": `<?php\n$top = ["name" => "Ana", "avg" => 15];\necho "Top: " . $top["name"];\n` },
      objectives: [
        {
          id: "fix",
          label: L("Print Top: Ana with no warning", "Afficher Top: Ana sans warning"),
          check: all(clean, outputIs("Top: Ana")),
          hints: [
            L("The warning names the key it couldn't find.", "Le warning nomme la clé introuvable."),
            L("Keys are case-sensitive.", "Les clés sont sensibles à la casse."),
            L("`$top[\"name\"]`", "`$top[\"name\"]`"),
          ],
        },
      ],
      cheat: "debugging",
    },
    {
      kind: "challenge",
      title: L("Fix the gradebook", "Répare le carnet de notes"),
      body: L(
        "This report should list every student's average and the best one. Students without grades must show `no grades`. Right now it warns, crashes, and has a typo. Fix it so it runs cleanly and prints exactly the five expected lines.",
        "Ce bulletin doit lister la moyenne de chaque élève et la meilleure. Les élèves sans notes doivent afficher `no grades`. Pour l'instant il râle, plante, et contient une faute de frappe. Corrige-le pour qu'il tourne sans problème et affiche exactement les cinq lignes attendues.",
      ),
      files: {
        "index.php": `<?php\n$students = [\n    ["name" => "Ana", "grades" => [15, 12, 18]],\n    ["name" => "Ben", "grades" => [9, 11]],\n    ["name" => "Cleo", "grades" => []],\n    ["name" => "Dan"],\n];\n\nfunction average(array $grades): float\n{\n    return array_sum($grades) / count($grades);\n}\n\n// Expected output:\n// Ana: 15\n// Ben: 10\n// Cleo: no grades\n// Dan: no grades\n// Best: Ana\n\n$best = null;\nforeach ($students as $student) {\n    $avg = average($student["grades"]);\n    echo $student["name"] . ": " . round($avg, 1) . "\\n";\n    if ($best === null || $avg > $best["avg"]) {\n        $best = ["name" => $student["Name"], "avg" => $avg];\n    }\n}\necho "Best: " . $best["name"];\n`,
      },
      solution: {
        "index.php": `<?php\n$students = [\n    ["name" => "Ana", "grades" => [15, 12, 18]],\n    ["name" => "Ben", "grades" => [9, 11]],\n    ["name" => "Cleo", "grades" => []],\n    ["name" => "Dan"],\n];\n\nfunction average(array $grades): float\n{\n    return array_sum($grades) / count($grades);\n}\n\n$best = null;\nforeach ($students as $student) {\n    $grades = $student["grades"] ?? [];\n    if ($grades === []) {\n        echo $student["name"] . ": no grades\\n";\n        continue;\n    }\n    $avg = average($grades);\n    echo $student["name"] . ": " . round($avg, 1) . "\\n";\n    if ($best === null || $avg > $best["avg"]) {\n        $best = ["name" => $student["name"], "avg" => $avg];\n    }\n}\necho "Best: " . $best["name"];\n`,
      },
      objectives: [
        {
          id: "no-crash",
          label: L("No crash (no uncaught error)", "Pas de plantage (aucune erreur non attrapée)"),
          check: ran,
          hints: [
            L("Cleo has an empty grades list: what is `count([])`?", "Cleo a une liste de notes vide : que vaut `count([])` ?"),
            L("Check for an empty list before calling average(), and `continue` to the next student.", "Vérifie si la liste est vide avant d'appeler average(), et `continue` vers l'élève suivant."),
            L("`$grades = $student[\"grades\"] ?? []; if ($grades === []) { echo $student[\"name\"] . \": no grades\\n\"; continue; }`", "`$grades = $student[\"grades\"] ?? []; if ($grades === []) { echo $student[\"name\"] . \": no grades\\n\"; continue; }`"),
          ],
        },
        {
          id: "clean",
          label: L("No warnings", "Aucun warning"),
          check: clean,
          hints: [
            L("Dan has no \"grades\" key at all, and one key has the wrong capital.", "Dan n'a pas du tout de clé « grades », et une clé a la mauvaise majuscule."),
            L("`$student[\"grades\"] ?? []` handles the missing key.", "`$student[\"grades\"] ?? []` gère la clé absente."),
            L("Use `$grades` (with `?? []`) instead of `$student[\"grades\"]`, and write `$student[\"name\"]` in the `$best` line.", "Utilise `$grades` (avec `?? []`) au lieu de `$student[\"grades\"]`, et écris `$student[\"name\"]` dans la ligne `$best`."),
          ],
        },
        {
          id: "output",
          label: L("Print the five expected lines", "Afficher les cinq lignes attendues"),
          check: outputLines(["Ana: 15", "Ben: 10", "Cleo: no grades", "Dan: no grades", "Best: Ana"]),
          hints: [
            L("Compare your output with the expected lines in the comment.", "Compare ta sortie avec les lignes attendues dans le commentaire."),
            L("Students without grades print `no grades` and are never the best.", "Les élèves sans notes affichent `no grades` et ne sont jamais les meilleurs."),
            L("With the empty check + `continue`, `?? []` and the `name` typo fixed, all five lines are right.", "Avec le test de liste vide + `continue`, le `?? []` et la faute `name` corrigée, les cinq lignes sont justes."),
          ],
        },
      ],
      cheat: "debugging",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Fix one problem at a time, starting with the first, and run after each change.", "Corrige un problème à la fois, en commençant par le premier, et exécute après chaque changement."),
    L("Missing data: decide explicitly (default with `??`, skip with `continue`).", "Données manquantes : décide explicitement (valeur par défaut avec `??`, saut avec `continue`)."),
    L("Prevent errors (check before dividing) rather than hiding them.", "Préviens les erreurs (vérifie avant de diviser) plutôt que de les cacher."),
  ],
};

export const ERRORS: Lesson[] = [warningsNotices, exceptions, customExceptions, nullSafety, strictTypes, debugging, bossDebug];
