import { L, type Txt } from "@/lib/txt";
import type { CheatKey, CheatSheet } from "./types";

/** One row: PHP code (never translated) and what it does. */
const r = (code: string, en: string, fr: string) => ({ code, note: L(en, fr) });
/** One section. */
const s = (en: string, fr: string, rows: CheatSheet["sections"][number]["rows"]) => ({ title: L(en, fr), rows });
const sheet = (key: CheatKey, title: Txt, intro: Txt | undefined, sections: CheatSheet["sections"]): CheatSheet => ({ key, title, intro, sections });

const LIST: CheatSheet[] = [
  sheet("basics", L("PHP basics", "Les bases de PHP"), L("The shape of every PHP script.", "La forme de tout script PHP."), [
    s("Structure", "Structure", [
      r("<?php", "Opening tag: everything after it is PHP code.", "Balise d'ouverture : tout ce qui suit est du code PHP."),
      r('echo "Hi";', "Print text. Every statement ends with ;", "Affiche du texte. Chaque instruction finit par ;"),
      r('echo "a", "b";', "echo accepts several values, separated by commas.", "echo accepte plusieurs valeurs, séparées par des virgules."),
      r('print "Hi";', "Like echo, but takes one value and returns 1.", "Comme echo, mais une seule valeur, et renvoie 1."),
      r('"line\\n"', "\\n is a new line (inside double quotes only).", "\\n est un retour à la ligne (entre guillemets doubles seulement)."),
    ]),
    s("Comments", "Commentaires", [
      r("// one line", "Single-line comment.", "Commentaire sur une ligne."),
      r("# one line", "Also a single-line comment.", "Aussi un commentaire sur une ligne."),
      r("/* several\n   lines */", "Block comment.", "Commentaire sur plusieurs lignes."),
      r("/** @param int $x */", "DocBlock: documents code for editors and tools.", "DocBlock : documente le code pour les éditeurs et outils."),
    ]),
    s("Maths", "Calculs", [
      r("+ - * /", "Add, subtract, multiply, divide (/ may give a float).", "Addition, soustraction, multiplication, division (/ peut donner un float)."),
      r("10 % 3   // 1", "Remainder of a division (modulo).", "Reste d'une division (modulo)."),
      r("2 ** 10  // 1024", "Power.", "Puissance."),
      r("intdiv(7, 2) // 3", "Whole-number division.", "Division entière."),
      r("$x += 5; $i++; $i--;", "Shortcuts: add to, plus one, minus one.", "Raccourcis : ajouter, plus un, moins un."),
      r("round($x, 2) floor() ceil()", "Round to 2 decimals, down, up.", "Arrondir à 2 décimales, vers le bas, vers le haut."),
    ]),
  ]),
  sheet("types", L("Variables and types", "Variables et types"), L("Every value has a type. var_dump() shows it.", "Chaque valeur a un type. var_dump() le montre."), [
    s("Variables", "Variables", [
      r('$name = "Ada";', "Assign a value. Names start with $ and are case-sensitive.", "Affecter une valeur. Les noms commencent par $ et sont sensibles à la casse."),
      r("$a = $b = 0;", "Chain assignments.", "Affectations en chaîne."),
      r("isset($x)", "true if $x exists and is not null.", "true si $x existe et n'est pas null."),
      r("unset($x);", "Delete a variable.", "Supprime une variable."),
      r('const MAX = 10;\ndefine("MIN", 1);', "Constants: no $, can't change.", "Constantes : pas de $, ne changent pas."),
    ]),
    s("The basic types", "Les types de base", [
      r("42  -7  0x1F  1_000_000", "int: whole numbers (_ separators since 7.4).", "int : nombres entiers (séparateurs _ depuis 7.4)."),
      r("3.14  1e3  0.1", "float: decimals (approximate!).", "float : décimaux (approximatifs !)."),
      r("\"text\"  'text'", "string: text.", "string : du texte."),
      r("true  false", "bool: yes or no.", "bool : oui ou non."),
      r("null", "No value.", "Pas de valeur."),
      r("[1, 2]  ['a' => 1]", "array: lists and key → value maps.", "array : listes et dictionnaires clé → valeur."),
    ]),
    s("Inspect and convert", "Inspecter et convertir", [
      r("var_dump($x);", "Type and value: the debugging classic.", "Type et valeur : le classique du débogage."),
      r("gettype($x)  get_debug_type($x)", "Type as text (get_debug_type since 8.0: \"int\", \"string\"…).", "Le type en texte (get_debug_type depuis 8.0 : « int », « string »…)."),
      r("is_int() is_string() is_array()…", "Type checks, return bool.", "Tests de type, renvoient un bool."),
      r('(int) "42"  (float) "3.5"  (string) 7  (bool) 0', "Casts: explicit conversions.", "Casts : conversions explicites."),
      r('intval("12px") // 12', "Read the number at the start of a string.", "Lit le nombre au début d'une chaîne."),
    ]),
    s("Falsy values", "Valeurs « fausses »", [
      r('false  0  0.0  ""  "0"  []  null', "These count as false in an if; everything else is true.", "Ces valeurs comptent comme false dans un if ; tout le reste est vrai."),
    ]),
  ]),
  sheet("strings", L("Strings", "Chaînes de caractères"), L("Quotes, joining and building text.", "Guillemets, concaténation et construction de texte."), [
    s("Quotes", "Guillemets", [
      r('"Hi $name\\n"', "Double quotes: variables and escapes are replaced.", "Guillemets doubles : variables et séquences remplacées."),
      r("'Hi $name\\n'", "Single quotes: printed exactly as written.", "Guillemets simples : affichés tels quels."),
      r('"{$user->name} and {$list[0]}"', "Braces for properties, array items, or when letters follow.", "Accolades pour propriétés, éléments de tableau, ou quand des lettres suivent."),
      r('"Price: \\$5"', "Escape $ and \" with a backslash.", "Échappe $ et \" avec un antislash."),
    ]),
    s("Joining", "Assembler", [
      r('"a" . "b"', "Concatenation (join) with a dot.", "Concaténation avec un point."),
      r('$s .= "more";', "Append to a string.", "Ajouter à la fin d'une chaîne."),
      r('sprintf("%s is %d", $n, $age)', "Build text from a template.", "Construire du texte à partir d'un modèle."),
      r('implode(", ", $items)', "Join an array into a string.", "Assembler un tableau en chaîne."),
    ]),
    s("Multi-line", "Sur plusieurs lignes", [
      r("<<<TXT\n  Hi $name\n  TXT;", "Heredoc: like double quotes, many lines. Closing marker may be indented (7.3+).", "Heredoc : comme les guillemets doubles, sur plusieurs lignes. Le marqueur final peut être indenté (7.3+)."),
      r("<<<'TXT'\n  raw $text\n  TXT;", "Nowdoc: like single quotes.", "Nowdoc : comme les guillemets simples."),
    ]),
    s("Everyday functions", "Fonctions de tous les jours", [
      r("strlen($s)  mb_strlen($s)", "Length in bytes / in characters (use mb_ for accents and emoji).", "Longueur en octets / en caractères (mb_ pour les accents et emoji)."),
      r("strtoupper() strtolower() ucfirst() ucwords()", "Change case.", "Changer la casse."),
      r("trim($s)", "Remove spaces at both ends.", "Retirer les espaces aux deux bouts."),
      r('str_repeat("=", 10)', "Repeat a string.", "Répéter une chaîne."),
      r("$s[0]  $s[-1]", "First and last character.", "Premier et dernier caractère."),
    ]),
  ]),
  sheet("control", L("Conditions", "Conditions"), L("Make decisions with if, match and comparisons.", "Prendre des décisions avec if, match et les comparaisons."), [
    s("if / else", "if / else", [
      r("if ($age >= 18) {\n  …\n} elseif ($age >= 13) {\n  …\n} else {\n  …\n}", "Run one block depending on conditions.", "Exécute un bloc selon les conditions."),
      r('$label = $ok ? "yes" : "no";', "Ternary: an if that gives a value.", "Ternaire : un if qui donne une valeur."),
      r('$name = $input ?? "guest";', "Null coalescing: use the right side if the left is null or missing.", "Coalescence nulle : prend la droite si la gauche est null ou absente."),
      r('$x ??= "default";', "Assign only if null (7.4+).", "Affecte seulement si null (7.4+)."),
    ]),
    s("Comparisons", "Comparaisons", [
      r("===  !==", "Same value AND same type. Use these by default.", "Même valeur ET même type. À utiliser par défaut."),
      r("==  !=", "Same value after conversion (\"1\" == 1 is true).", "Même valeur après conversion (\"1\" == 1 est vrai)."),
      r("<  >  <=  >=", "Order.", "Ordre."),
      r("$a <=> $b", "Spaceship: -1, 0 or 1. Perfect for sorting.", "Vaisseau spatial : -1, 0 ou 1. Parfait pour trier."),
    ]),
    s("Logic", "Logique", [
      r("&&  ||  !", "And, or, not.", "Et, ou, non."),
      r("($a && $b) || $c", "Use parentheses to make priority obvious.", "Utilise des parenthèses pour rendre la priorité évidente."),
    ]),
    s("match and switch", "match et switch", [
      r('$t = match ($code) {\n  200, 201 => "OK",\n  404 => "Not found",\n  default => "Error",\n};', "match (8.0+): strict ===, returns a value, no break needed.", "match (8.0+) : strict ===, renvoie une valeur, pas de break."),
      r("match (true) {\n  $n < 0 => \"neg\",\n  default => \"pos\",\n}", "match(true): pick the first true condition.", "match(true) : prend la première condition vraie."),
      r("switch ($x) {\n  case 1: …; break;\n  default: …\n}", "switch: loose ==, needs break.", "switch : comparaison souple ==, nécessite break."),
    ]),
  ]),
  sheet("loops", L("Loops", "Boucles"), L("Repeat work.", "Répéter un travail."), [
    s("The four loops", "Les quatre boucles", [
      r("for ($i = 0; $i < 5; $i++) { … }", "Count: start; keep going while; step.", "Compter : départ ; tant que ; pas."),
      r("while ($n > 0) { $n--; }", "Repeat while a condition is true.", "Répète tant qu'une condition est vraie."),
      r("do { … } while ($again);", "Runs at least once.", "S'exécute au moins une fois."),
      r("foreach ($items as $item) { … }", "Every value of an array.", "Chaque valeur d'un tableau."),
      r("foreach ($map as $key => $value) { … }", "Keys and values.", "Clés et valeurs."),
    ]),
    s("Control the loop", "Contrôler la boucle", [
      r("break;", "Leave the loop now.", "Sortir de la boucle maintenant."),
      r("continue;", "Skip to the next round.", "Passer au tour suivant."),
      r("break 2;", "Leave two nested loops.", "Sortir de deux boucles imbriquées."),
      r("foreach ($a as &$v) { $v *= 2; }\nunset($v);", "By reference: change items in place (unset afterwards!).", "Par référence : modifie les éléments (unset ensuite !)."),
    ]),
    s("Handy", "Pratique", [
      r("range(1, 10)  range('a', 'e')", "Build a list of numbers or letters.", "Construit une liste de nombres ou de lettres."),
      r("count($items)", "Number of items.", "Nombre d'éléments."),
    ]),
  ]),
  sheet("arrays", L("Arrays", "Tableaux"), L("PHP arrays are both lists and dictionaries.", "Les tableaux PHP sont à la fois des listes et des dictionnaires."), [
    s("Create and read", "Créer et lire", [
      r('$fruits = ["apple", "pear"];', "A list: keys 0, 1, 2…", "Une liste : clés 0, 1, 2…"),
      r('$user = ["name" => "Ada", "age" => 36];', "Associative array: your own keys.", "Tableau associatif : tes propres clés."),
      r('$fruits[0]  $user["name"]', "Read one item.", "Lire un élément."),
      r('$fruits[] = "kiwi";', "Append at the end.", "Ajouter à la fin."),
      r('$user["city"] = "London";', "Add or change a key.", "Ajouter ou changer une clé."),
      r('unset($user["age"]);', "Remove a key.", "Supprimer une clé."),
      r("$m[1][2]", "Nested arrays.", "Tableaux imbriqués."),
    ]),
    s("Check", "Vérifier", [
      r("count($a)", "How many items.", "Combien d'éléments."),
      r('isset($a["k"])  array_key_exists("k", $a)', "Does the key exist? (isset is false for null values).", "La clé existe-t-elle ? (isset est faux pour une valeur null)."),
      r("in_array($v, $a, true)", "Is the value there? (true = strict).", "La valeur est-elle là ? (true = strict)."),
      r('$a["k"] ?? "default"', "Read with a fallback, no warning.", "Lire avec une valeur par défaut, sans avertissement."),
    ]),
    s("Show", "Afficher", [
      r("print_r($a);", "Readable dump.", "Affichage lisible."),
      r("var_dump($a);", "Dump with types.", "Affichage avec les types."),
      r('implode(", ", $a)', "Join values into a string.", "Assembler les valeurs en chaîne."),
      r('explode(",", "a,b")', "Split a string into an array.", "Découper une chaîne en tableau."),
    ]),
    s("Unpack", "Déballer", [
      r("[$a, $b] = [1, 2];", "Destructuring a list.", "Déstructurer une liste."),
      r('["name" => $n] = $user;', "Destructuring by key.", "Déstructurer par clé."),
      r("[$a, $b] = [$b, $a];", "Swap two variables.", "Échanger deux variables."),
      r("[...$a, ...$b]", "Spread: merge lists (string keys since 8.1).", "Spread : fusionner des listes (clés texte depuis 8.1)."),
    ]),
  ]),
  sheet("array-functions", L("Array functions", "Fonctions de tableaux"), L("Transform data without writing loops.", "Transformer des données sans écrire de boucles."), [
    s("Transform", "Transformer", [
      r("array_map(fn($x) => $x * 2, $a)", "New array with each value transformed.", "Nouveau tableau avec chaque valeur transformée."),
      r("array_filter($a, fn($x) => $x > 0)", "Keep the values that pass (keys are kept!).", "Garde les valeurs qui passent (les clés sont conservées !)."),
      r("array_values($a)", "Re-index 0, 1, 2… (after filter).", "Ré-indexe 0, 1, 2… (après un filter)."),
      r("array_reduce($a, fn($carry, $x) => $carry + $x, 0)", "Fold everything into one value.", "Réduit tout en une seule valeur."),
      r("array_column($rows, 'name', 'id')", "Pick one field from a list of rows.", "Extrait un champ d'une liste de lignes."),
    ]),
    s("Sort", "Trier", [
      r("sort($a)  rsort($a)", "Sort values, re-index (modifies $a).", "Trie les valeurs, ré-indexe (modifie $a)."),
      r("asort($a)  arsort($a)", "Sort by value, keep keys.", "Trie par valeur, garde les clés."),
      r("ksort($a)  krsort($a)", "Sort by key.", "Trie par clé."),
      r("usort($a, fn($x, $y) => $x['age'] <=> $y['age'])", "Sort with your own comparison.", "Trie avec ta propre comparaison."),
    ]),
    s("Combine and slice", "Combiner et découper", [
      r("array_merge($a, $b)", "Merge (string keys overwrite).", "Fusionner (les clés texte écrasent)."),
      r("array_slice($a, 1, 2)", "Part of an array (doesn't modify it).", "Une partie du tableau (sans le modifier)."),
      r("array_keys($a)  array_values($a)", "Just the keys / just the values.", "Seulement les clés / les valeurs."),
      r("array_unique($a)  array_reverse($a)", "Remove duplicates / reverse.", "Retirer les doublons / inverser."),
      r("array_sum($a)  max($a)  min($a)", "Totals and extremes.", "Total et extrêmes."),
      r("array_search($v, $a)", "Key of a value, or false.", "Clé d'une valeur, ou false."),
    ]),
    s("Newer helpers", "Aides récentes", [
      r("array_key_first($a)  array_key_last($a)", "First / last key (7.3+).", "Première / dernière clé (7.3+)."),
      r("array_is_list($a)", "Keys are 0, 1, 2…? (8.1+)", "Les clés sont-elles 0, 1, 2… ? (8.1+)"),
      r("array_find($a, fn($v) => $v > 2)", "First matching value, or null (8.4+). Also array_any, array_all.", "Première valeur qui correspond, ou null (8.4+). Aussi array_any, array_all."),
      r("array_first($a)  array_last($a)", "First / last value (8.5+).", "Première / dernière valeur (8.5+)."),
    ]),
  ]),
  sheet("functions", L("Functions", "Fonctions"), L("Name a piece of code and reuse it.", "Nommer un morceau de code et le réutiliser."), [
    s("Define and call", "Définir et appeler", [
      r("function greet(string $name): string {\n  return \"Hi $name\";\n}", "Parameters in, return value out.", "Des paramètres en entrée, une valeur de retour en sortie."),
      r('greet("Ada");', "Call it.", "L'appeler."),
      r('function hi($name = "you") { … }', "Default value: the argument becomes optional.", "Valeur par défaut : l'argument devient facultatif."),
      r("function sum(int ...$nums) { … }", "Variadic: any number of arguments, as an array.", "Variadique : autant d'arguments qu'on veut, en tableau."),
      r("sum(...$list);", "Spread an array into arguments.", "Étaler un tableau en arguments."),
    ]),
    s("Named arguments (8.0+)", "Arguments nommés (8.0+)", [
      r('greet(name: "Ada");', "Pass arguments by name, in any order.", "Passer les arguments par leur nom, dans n'importe quel ordre."),
      r('str_pad("7", 3, pad_type: STR_PAD_LEFT, pad_string: "0")', "Skip optional ones you don't need.", "Sauter les facultatifs inutiles."),
    ]),
    s("Types", "Types", [
      r("int float string bool array", "Scalar and array types.", "Types scalaires et tableau."),
      r("?string", "Nullable: string or null.", "Nullable : string ou null."),
      r("int|string", "Union type (8.0+).", "Type union (8.0+)."),
      r(": void  : never  : static  mixed", "Return nothing / never returns / same class / anything.", "Ne renvoie rien / ne revient jamais / même classe / n'importe quoi."),
      r("declare(strict_types=1);", "First line: no silent conversions of arguments.", "Première ligne : pas de conversion silencieuse des arguments."),
    ]),
    s("References", "Références", [
      r("function addOne(int &$n) { $n++; }", "& lets the function change the caller's variable.", "& permet à la fonction de modifier la variable de l'appelant."),
    ]),
  ]),
  sheet("closures", L("Closures and callables", "Closures et callables"), L("Functions are values too.", "Les fonctions sont aussi des valeurs."), [
    s("Anonymous functions", "Fonctions anonymes", [
      r("$double = function ($x) { return $x * 2; };", "A function stored in a variable.", "Une fonction rangée dans une variable."),
      r("$double(4);", "Call it like a function.", "L'appeler comme une fonction."),
      r("function () use ($rate) { … }", "use: capture outer variables (by value).", "use : capture des variables extérieures (par valeur)."),
      r("function () use (&$count) { $count++; }", "Capture by reference to modify it.", "Capture par référence pour la modifier."),
    ]),
    s("Arrow functions (7.4+)", "Fonctions fléchées (7.4+)", [
      r("fn($x) => $x * $rate", "One expression, captures outer variables automatically.", "Une seule expression, capture automatiquement les variables extérieures."),
      r("array_map(fn($p) => $p['name'], $people)", "Perfect for callbacks.", "Parfaites pour les callbacks."),
    ]),
    s("Callables", "Callables", [
      r("strlen(...)", "First-class callable syntax (8.1+): a Closure from a function.", "Syntaxe callable de première classe (8.1+) : une Closure à partir d'une fonction."),
      r("$obj->method(...)  Foo::bar(...)", "Same for methods.", "Pareil pour les méthodes."),
      r("'strtoupper'  [$obj, 'm']", "Old-style callables (strings and arrays).", "Anciens callables (chaînes et tableaux)."),
      r("is_callable($f)", "Can it be called?", "Peut-on l'appeler ?"),
      r('$x |> trim(...) |> strtoupper(...)', "Pipe operator (8.5+): pass a value through functions.", "Opérateur pipe (8.5+) : fait passer une valeur dans des fonctions."),
    ]),
  ]),
  sheet("string-functions", L("String functions", "Fonctions de chaînes"), L("Search, cut, replace and format text.", "Chercher, couper, remplacer et formater du texte."), [
    s("Search", "Chercher", [
      r('str_contains($s, "php")', "Contains? (8.0+)", "Contient ? (8.0+)"),
      r('str_starts_with($s, "http")  str_ends_with()', "Starts / ends with? (8.0+)", "Commence / finit par ? (8.0+)"),
      r('strpos($s, "x")', "Position of the first match, or false (compare with !== false).", "Position de la première occurrence, ou false (compare avec !== false)."),
      r("substr_count($s, \"a\")", "Count occurrences.", "Compter les occurrences."),
    ]),
    s("Cut and replace", "Couper et remplacer", [
      r("substr($s, 0, 5)  substr($s, -3)", "Part of a string (negative = from the end).", "Une partie de la chaîne (négatif = depuis la fin)."),
      r('str_replace("a", "b", $s)', "Replace every occurrence.", "Remplacer toutes les occurrences."),
      r('explode(" ", $s)  str_split($s, 2)', "Split into an array.", "Découper en tableau."),
      r("trim() ltrim() rtrim()", "Strip spaces (or other characters).", "Retirer les espaces (ou d'autres caractères)."),
      r("strrev($s)", "Reverse.", "Inverser."),
    ]),
    s("Shape", "Mettre en forme", [
      r('str_pad("7", 3, "0", STR_PAD_LEFT) // 007', "Pad to a length.", "Compléter jusqu'à une longueur."),
      r("ucwords(\"hello world\")", "Capital on every word.", "Majuscule à chaque mot."),
      r("wordwrap($s, 40, \"\\n\", true)", "Wrap long text.", "Couper un texte long en lignes."),
      r("nl2br($s)", "New lines → <br> for HTML.", "Retours à la ligne → <br> pour le HTML."),
    ]),
    s("Multibyte (accents, emoji)", "Multi-octets (accents, emoji)", [
      r('mb_strlen("été") // 3', "Characters, not bytes (strlen gives 5).", "Caractères, pas octets (strlen donne 5)."),
      r("mb_substr() mb_strtoupper()", "Safe versions for UTF-8 text.", "Versions sûres pour le texte UTF-8."),
      r("mb_str_pad() mb_trim() mb_ucfirst()", "Added in 8.3 / 8.4.", "Ajoutées en 8.3 / 8.4."),
    ]),
  ]),
  sheet("regex", L("Regular expressions", "Expressions régulières"), L("Patterns for searching and validating text (PCRE).", "Des motifs pour chercher et valider du texte (PCRE)."), [
    s("Functions", "Fonctions", [
      r("preg_match('/\\d+/', $s, $m)", "1 if found, 0 if not; $m gets the matches.", "1 si trouvé, 0 sinon ; $m reçoit les correspondances."),
      r("preg_match_all('/a/', $s, $m)", "Count and collect every match.", "Compte et récupère toutes les correspondances."),
      r("preg_replace('/\\s+/', ' ', $s)", "Replace with a pattern.", "Remplacer avec un motif."),
      r("preg_split('/[,;]/', $s)", "Split on a pattern.", "Découper selon un motif."),
      r("preg_replace_callback($re, fn($m) => …, $s)", "Compute each replacement.", "Calculer chaque remplacement."),
    ]),
    s("Pattern pieces", "Morceaux de motif", [
      r("\\d \\w \\s .", "Digit, word character, space, any character.", "Chiffre, caractère de mot, espace, n'importe quel caractère."),
      r("[a-z] [^0-9]", "One of these / none of these.", "Un de ceux-ci / aucun de ceux-ci."),
      r("* + ? {2,4}", "0+, 1+, 0 or 1, between 2 and 4.", "0 ou plus, 1 ou plus, 0 ou 1, entre 2 et 4."),
      r("^ $", "Start and end of the string.", "Début et fin de la chaîne."),
      r("(\\d+)  (?<year>\\d{4})", "Capture group, named group.", "Groupe de capture, groupe nommé."),
      r("/i  /m  /u", "Flags: case-insensitive, multi-line, UTF-8.", "Options : insensible à la casse, multi-ligne, UTF-8."),
    ]),
  ]),
  sheet("dates", L("Dates and times", "Dates et heures"), L("Prefer DateTimeImmutable: it never changes behind your back.", "Préfère DateTimeImmutable : il ne change jamais dans ton dos."), [
    s("Create", "Créer", [
      r("new DateTimeImmutable()", "Now.", "Maintenant."),
      r('new DateTimeImmutable("2024-03-15 14:30")', "A given date.", "Une date donnée."),
      r('DateTimeImmutable::createFromFormat("d/m/Y", "15/03/2024")', "Parse a custom format.", "Lire un format personnalisé."),
      r('new DateTimeZone("Europe/Paris")', "Time zones (default here: UTC).", "Fuseaux horaires (par défaut ici : UTC)."),
    ]),
    s("Change and compare", "Modifier et comparer", [
      r('$d->modify("+1 day")', "Returns a new date (immutable).", "Renvoie une nouvelle date (immuable)."),
      r('$d->add(new DateInterval("P1M2D"))', "Add 1 month 2 days.", "Ajouter 1 mois 2 jours."),
      r("$a->diff($b)->days", "Days between two dates.", "Jours entre deux dates."),
      r("$a < $b", "Dates compare with < > ==.", "Les dates se comparent avec < > ==."),
    ]),
    s("Format", "Formater", [
      r('$d->format("Y-m-d H:i")', "2024-03-15 14:30", "2024-03-15 14:30"),
      r('$d->format("l jS F Y")', "Friday 15th March 2024", "Friday 15th March 2024 (en anglais)"),
      r("Y m d H i s", "Year, month, day, hour, minutes, seconds.", "Année, mois, jour, heure, minutes, secondes."),
      r("D l N", "Day name short / long, day of week 1–7.", "Nom du jour court / long, jour de la semaine 1–7."),
      r("time()  date('Y')", "Unix timestamp; quick formatting of now.", "Timestamp Unix ; formatage rapide de maintenant."),
    ]),
  ]),
  sheet("json", L("JSON", "JSON"), L("The format every API speaks.", "Le format que parlent toutes les API."), [
    s("Encode", "Encoder", [
      r("json_encode($data)", "PHP value → JSON string.", "Valeur PHP → chaîne JSON."),
      r("JSON_PRETTY_PRINT", "Indented, readable output.", "Sortie indentée et lisible."),
      r("JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE", "Keep / and accents as they are.", "Garder / et les accents tels quels."),
      r("JSON_THROW_ON_ERROR", "Throw JsonException instead of returning false.", "Lever JsonException au lieu de renvoyer false."),
    ]),
    s("Decode", "Décoder", [
      r("json_decode($json, true)", "JSON → associative array.", "JSON → tableau associatif."),
      r("json_decode($json)", "JSON → stdClass objects ($o->name).", "JSON → objets stdClass ($o->name)."),
      r("json_decode($j, flags: JSON_THROW_ON_ERROR)", "Fail loudly on broken JSON.", "Échouer clairement sur un JSON cassé."),
      r("json_validate($json)", "Is it valid JSON? (8.3+)", "Est-ce du JSON valide ? (8.3+)"),
    ]),
    s("Objects", "Objets", [
      r("class P implements JsonSerializable {\n  public function jsonSerialize(): mixed { … }\n}", "Control how an object becomes JSON.", "Contrôler comment un objet devient du JSON."),
    ]),
  ]),
  sheet("oop", L("Classes and objects", "Classes et objets"), L("A class is a blueprint; an object is one thing built from it.", "Une classe est un plan ; un objet est une chose construite à partir de lui."), [
    s("Basics", "Bases", [
      r("class User {\n  public string $name = \"\";\n  public function greet(): string {\n    return \"Hi {$this->name}\";\n  }\n}", "Properties (data) and methods (behaviour).", "Propriétés (données) et méthodes (comportement)."),
      r("$u = new User();", "Create an object.", "Créer un objet."),
      r('$u->name = "Ada";  $u->greet();', "Use -> for properties and methods.", "-> pour les propriétés et méthodes."),
      r("$this", "The current object, inside a method.", "L'objet courant, dans une méthode."),
    ]),
    s("Constructor", "Constructeur", [
      r("public function __construct(string $name) {\n  $this->name = $name;\n}", "Runs on new User(…).", "S'exécute lors de new User(…)."),
      r("public function __construct(\n  private string $name,\n) {}", "Constructor promotion (8.0+): declares and assigns.", "Promotion de constructeur (8.0+) : déclare et affecte."),
    ]),
    s("Visibility", "Visibilité", [
      r("public", "Usable from anywhere.", "Utilisable partout."),
      r("protected", "This class and its children.", "Cette classe et ses enfants."),
      r("private", "This class only.", "Cette classe seulement."),
      r("public private(set) int $n", "Asymmetric visibility (8.4+): read anywhere, write inside.", "Visibilité asymétrique (8.4+) : lecture partout, écriture à l'intérieur."),
    ]),
    s("Useful checks", "Vérifications utiles", [
      r("$u instanceof User", "Is it a User (or a child)?", "Est-ce un User (ou un enfant) ?"),
      r("$u::class  get_class($u)", "Class name.", "Nom de la classe."),
      r("$copy = clone $u;", "Shallow copy.", "Copie superficielle."),
    ]),
  ]),
  sheet("inheritance", L("Inheritance", "Héritage"), L("Share code between related classes.", "Partager du code entre classes apparentées."), [
    s("extends", "extends", [
      r("class Admin extends User { … }", "Admin gets everything User has.", "Admin reçoit tout ce qu'a User."),
      r("public function greet(): string { … }", "Override a parent method with the same name.", "Redéfinir une méthode du parent avec le même nom."),
      r("parent::greet()  parent::__construct($n)", "Call the parent's version.", "Appeler la version du parent."),
      r("#[\\Override]", "Fail if no parent method matches (8.3+).", "Erreur si aucune méthode parente ne correspond (8.3+)."),
    ]),
    s("abstract and final", "abstract et final", [
      r("abstract class Shape {\n  abstract public function area(): float;\n}", "Can't be created; children must implement area().", "Ne peut pas être créée ; les enfants doivent implémenter area()."),
      r("final class Money { … }", "Can't be extended.", "Ne peut pas être étendue."),
      r("final public function id() { … }", "Can't be overridden.", "Ne peut pas être redéfinie."),
    ]),
    s("Polymorphism", "Polymorphisme", [
      r("foreach ($shapes as $s) echo $s->area();", "Same call, each class answers its own way.", "Même appel, chaque classe répond à sa façon."),
      r("static::create()  new static()", "Late static binding: the class actually called.", "Liaison statique tardive : la classe réellement appelée."),
    ]),
  ]),
  sheet("interfaces-traits", L("Interfaces and traits", "Interfaces et traits"), L("Contracts and reusable code.", "Contrats et code réutilisable."), [
    s("Interfaces", "Interfaces", [
      r("interface Shape {\n  public function area(): float;\n}", "A contract: methods without bodies.", "Un contrat : des méthodes sans corps."),
      r("class Circle implements Shape, JsonSerializable", "A class can implement several.", "Une classe peut en implémenter plusieurs."),
      r("function total(Shape ...$s)", "Type-hint the interface, not the class.", "Typer avec l'interface, pas la classe."),
      r("interface A extends B, C", "Interfaces can extend interfaces.", "Les interfaces peuvent étendre des interfaces."),
      r("Countable  IteratorAggregate  Stringable", "Built-in interfaces.", "Interfaces intégrées."),
    ]),
    s("Traits", "Traits", [
      r("trait Greets {\n  public function hi() { return \"Hi\"; }\n}", "Methods to copy into classes.", "Des méthodes à copier dans des classes."),
      r("class User { use Greets; }", "Use a trait (several allowed).", "Utiliser un trait (plusieurs possibles)."),
      r("use A, B { A::hi insteadof B; }", "Resolve name conflicts.", "Résoudre les conflits de noms."),
    ]),
  ]),
  sheet("enums", L("Enums (8.1+)", "Enums (8.1+)"), L("A fixed list of possible values.", "Une liste fixe de valeurs possibles."), [
    s("Pure enums", "Enums purs", [
      r("enum Suit { case Hearts; case Spades; }", "Each case is a single object.", "Chaque cas est un objet unique."),
      r("$s = Suit::Hearts;", "Use a case.", "Utiliser un cas."),
      r("$s === Suit::Hearts", "Compare with ===.", "Comparer avec ===."),
      r("Suit::cases()", "Every case, as an array.", "Tous les cas, en tableau."),
      r("$s->name // \"Hearts\"", "The case's name.", "Le nom du cas."),
    ]),
    s("Backed enums", "Enums typés (backed)", [
      r("enum Status: string {\n  case Draft = 'draft';\n  case Live = 'live';\n}", "Each case has a scalar value (int or string).", "Chaque cas a une valeur scalaire (int ou string)."),
      r("$st->value", "The stored value.", "La valeur stockée."),
      r("Status::from('live')", "Value → case (ValueError if unknown).", "Valeur → cas (ValueError si inconnue)."),
      r("Status::tryFrom('x') // null", "Value → case or null.", "Valeur → cas ou null."),
    ]),
    s("Behaviour", "Comportement", [
      r("public function label(): string {\n  return match ($this) { … };\n}", "Enums can have methods and constants.", "Les enums peuvent avoir des méthodes et des constantes."),
      r("enum Status: string implements HasLabel", "And implement interfaces.", "Et implémenter des interfaces."),
    ]),
  ]),
  sheet("errors", L("Errors and warnings", "Erreurs et avertissements"), L("Read the message: it says what, where and often why.", "Lis le message : il dit quoi, où et souvent pourquoi."), [
    s("Levels", "Niveaux", [
      r("Parse error", "Invalid syntax: nothing runs. Look at the line before too.", "Syntaxe invalide : rien ne s'exécute. Regarde aussi la ligne d'avant."),
      r("Fatal error / Uncaught Error", "The script stops here.", "Le script s'arrête ici."),
      r("Warning", "Something is wrong, the script continues.", "Quelque chose cloche, le script continue."),
      r("Notice", "Minor issue (most became warnings in 8.0).", "Problème mineur (la plupart sont devenus des warnings en 8.0)."),
      r("Deprecated", "Still works, will be removed in a later version.", "Marche encore, sera retiré dans une version future."),
    ]),
    s("Classic messages", "Messages classiques", [
      r("Undefined variable $x", "Typo or variable never assigned.", "Faute de frappe ou variable jamais affectée."),
      r('Undefined array key "k"', "Use isset() or ?? before reading.", "Utilise isset() ou ?? avant de lire."),
      r("Call to undefined function f()", "Typo, missing require, or a newer PHP function.", "Faute de frappe, require manquant, ou fonction d'une version plus récente."),
      r("Argument #1 ($x) must be of type int, string given", "TypeError: wrong type passed.", "TypeError : mauvais type passé."),
      r("Call to a member function f() on null", "The object you expected is null.", "L'objet attendu est null."),
    ]),
    s("Report", "Signaler", [
      r('trigger_error("msg", E_USER_WARNING);', "Raise your own warning.", "Lever ton propre avertissement."),
      r("error_reporting(E_ALL);", "Show everything while developing.", "Tout afficher pendant le développement."),
      r("@$a['k']", "@ hides an error: avoid it.", "@ cache une erreur : à éviter."),
    ]),
  ]),
  sheet("exceptions", L("Exceptions", "Exceptions"), L("Stop normal flow and let a caller handle the problem.", "Interrompre le flux normal et laisser un appelant gérer le problème."), [
    s("Throw and catch", "Lever et attraper", [
      r('throw new InvalidArgumentException("Bad id");', "Stop and report a problem.", "S'arrêter et signaler un problème."),
      r("try {\n  …\n} catch (InvalidArgumentException $e) {\n  echo $e->getMessage();\n} finally {\n  …\n}", "Handle it; finally always runs.", "Le gérer ; finally s'exécute toujours."),
      r("catch (TypeError | ValueError $e)", "Several types in one catch (7.1+).", "Plusieurs types dans un catch (7.1+)."),
      r("catch (Throwable $e)", "Catch everything (Exception and Error).", "Tout attraper (Exception et Error)."),
      r("catch (Exception)", "No variable needed (8.0+).", "Pas besoin de variable (8.0+)."),
    ]),
    s("Your own", "Les tiennes", [
      r("class NotFound extends RuntimeException {}", "Custom exception type.", "Type d'exception personnalisé."),
      r("throw new AppError(\"…\", previous: $e);", "Wrap the cause (getPrevious()).", "Envelopper la cause (getPrevious())."),
      r("$x = $y ?? throw new LogicException();", "throw is an expression (8.0+).", "throw est une expression (8.0+)."),
    ]),
    s("Inspect", "Inspecter", [
      r("$e->getMessage() getCode() getFile() getLine()", "What and where.", "Quoi et où."),
      r("$e->getTraceAsString()", "The call stack that led here.", "La pile d'appels qui a mené ici."),
    ]),
    s("Hierarchy", "Hiérarchie", [
      r("Throwable → Error → TypeError, ValueError, ArgumentCountError, DivisionByZeroError", "Engine errors.", "Erreurs du moteur."),
      r("Throwable → Exception → RuntimeException, LogicException, InvalidArgumentException, JsonException", "Exceptions for your code.", "Exceptions pour ton code."),
    ]),
  ]),
  sheet("null-safety", L("Handling null", "Gérer null"), L("Most crashes start with an unexpected null.", "La plupart des plantages commencent par un null inattendu."), [
    s("Operators", "Opérateurs", [
      r('$name = $user["name"] ?? "guest";', "?? : fallback when null or missing, no warning.", "?? : valeur de repli si null ou absent, sans avertissement."),
      r('$cfg["debug"] ??= false;', "??= : set only if null (7.4+).", "??= : affecte seulement si null (7.4+)."),
      r("$user?->address?->city", "?-> : stop and give null if something is null (8.0+).", "?-> : s'arrête et donne null si quelque chose est null (8.0+)."),
      r('$v ?: "default"', "?: falls back on any falsy value (0, \"\" too).", "?: se replie sur toute valeur fausse (0, \"\" aussi)."),
    ]),
    s("Types", "Types", [
      r("function find(int $id): ?User", "May return null: callers must handle it.", "Peut renvoyer null : l'appelant doit le gérer."),
      r("function f(?string $s = null)", "Explicitly nullable parameter (implicit `string $s = null` is deprecated in 8.4).", "Paramètre explicitement nullable (l'implicite `string $s = null` est déprécié en 8.4)."),
    ]),
    s("Checks", "Vérifications", [
      r("$x === null  is_null($x)", "Exactly null?", "Exactement null ?"),
      r("isset($a, $b)", "All set and not null?", "Tous définis et non null ?"),
      r("empty($x)", "Missing or falsy?", "Absent ou faux ?"),
    ]),
  ]),
  sheet("debugging", L("Debugging", "Débogage"), L("Look at real values instead of guessing.", "Regarde les vraies valeurs au lieu de deviner."), [
    s("Look inside", "Regarder dedans", [
      r("var_dump($x);", "Type and value.", "Type et valeur."),
      r("print_r($array);", "Readable arrays and objects.", "Tableaux et objets lisibles."),
      r("var_export($x);", "As valid PHP code.", "En code PHP valide."),
      r("echo json_encode($x, JSON_PRETTY_PRINT);", "Readable nested data.", "Données imbriquées lisibles."),
      r("die(var_dump($x));", "Dump and stop here.", "Afficher et s'arrêter ici."),
    ]),
    s("Where am I?", "Où suis-je ?", [
      r("__LINE__  __FILE__  __FUNCTION__  __METHOD__", "Magic constants.", "Constantes magiques."),
      r("debug_print_backtrace();", "Print the call stack.", "Afficher la pile d'appels."),
      r("(new Exception)->getTraceAsString()", "The stack as a string.", "La pile en texte."),
    ]),
    s("Reading a stack trace", "Lire une stack trace", [
      r("#0 index.php(3): intdiv(1, 0)", "Innermost call first: where it blew up.", "L'appel le plus profond d'abord : là où ça a explosé."),
      r("#1 index.php(7): divide(1, 0)", "Then who called it, and from which line.", "Puis qui l'a appelé, et depuis quelle ligne."),
      r("#2 {main}", "The top level of the script.", "Le niveau principal du script."),
    ]),
    s("Guard rails", "Garde-fous", [
      r('assert($total >= 0, "negative total");', "Fail fast during development.", "Échouer vite pendant le développement."),
      r("declare(strict_types=1);", "Catch type mix-ups early.", "Détecter tôt les confusions de types."),
    ]),
  ]),
  sheet("namespaces", L("Namespaces and autoloading", "Namespaces et autoloading"), L("Organise code into folders without name clashes.", "Organiser le code en dossiers sans conflits de noms."), [
    s("Namespaces", "Namespaces", [
      r("namespace App\\Models;", "First statement of the file (after declare).", "Première instruction du fichier (après declare)."),
      r("use App\\Models\\User;", "Import a class name.", "Importer un nom de classe."),
      r("use App\\Models\\User as Member;", "Import with an alias.", "Importer avec un alias."),
      r("use function App\\Support\\slugify;", "Import a function.", "Importer une fonction."),
      r("\\strlen($s)  new \\DateTime()", "Leading \\ = global namespace.", "\\ au début = namespace global."),
      r("User::class", "Fully qualified name as a string.", "Nom complet en chaîne."),
    ]),
    s("Loading files", "Charger des fichiers", [
      r("require __DIR__ . '/src/User.php';", "Include a file; fatal error if missing.", "Inclure un fichier ; erreur fatale s'il manque."),
      r("require_once …  include …", "Only once / only a warning if missing.", "Une seule fois / juste un avertissement s'il manque."),
      r("spl_autoload_register(function ($class) {\n  require __DIR__ . '/src/' . str_replace('\\\\', '/', $class) . '.php';\n});", "Load classes on first use.", "Charge les classes à la première utilisation."),
      r("require 'vendor/autoload.php';", "Composer's autoloader (PSR-4).", "L'autoloader de Composer (PSR-4)."),
    ]),
  ]),
  sheet("generators", L("Generators and iterators", "Générateurs et itérateurs"), L("Produce values one at a time.", "Produire des valeurs une par une."), [
    s("Generators", "Générateurs", [
      r("function numbers() {\n  yield 1;\n  yield 2;\n}", "yield makes a function a generator.", "yield fait d'une fonction un générateur."),
      r("foreach (numbers() as $n) { … }", "Loop over it like an array.", "Boucler dessus comme sur un tableau."),
      r("yield $key => $value;", "Yield keys too.", "Produire aussi des clés."),
      r("yield from other();", "Delegate to another generator or array.", "Déléguer à un autre générateur ou tableau."),
      r("$g->getReturn()", "Value of return, after the loop.", "Valeur du return, après la boucle."),
      r("iterator_to_array($g)", "Collect into an array.", "Rassembler en tableau."),
    ]),
    s("Iterators", "Itérateurs", [
      r("class Bag implements IteratorAggregate {\n  public function getIterator(): Iterator {\n    yield from $this->items;\n  }\n}", "Make your objects foreach-able.", "Rendre tes objets parcourables avec foreach."),
      r("Countable  ArrayAccess", "count($obj) and $obj['k'] on your objects.", "count($obj) et $obj['k'] sur tes objets."),
      r("iterable", "Type for arrays and Traversables.", "Type pour les tableaux et Traversables."),
    ]),
  ]),
  sheet("attributes", L("Attributes (8.0+)", "Attributs (8.0+)"), L("Structured metadata on code, read with Reflection.", "Des métadonnées structurées sur le code, lues avec la Reflection."), [
    s("Use", "Utiliser", [
      r("#[Route('/users', methods: ['GET'])]", "Attach data to a class, method, property or parameter.", "Attacher des données à une classe, méthode, propriété ou paramètre."),
      r("#[\\Override]", "Must override a parent method (8.3+).", "Doit redéfinir une méthode parente (8.3+)."),
      r("#[\\Deprecated('use g()')]", "Mark your own function deprecated (8.4+).", "Marquer ta propre fonction dépréciée (8.4+)."),
      r("#[\\NoDiscard]", "Warn when the return value is ignored (8.5+).", "Avertir quand la valeur de retour est ignorée (8.5+)."),
      r("#[\\SensitiveParameter]", "Hide a parameter from stack traces (8.2+).", "Cacher un paramètre des stack traces (8.2+)."),
    ]),
    s("Declare and read", "Déclarer et lire", [
      r("#[Attribute]\nclass Route {\n  public function __construct(public string $path) {}\n}", "An attribute is a class marked #[Attribute].", "Un attribut est une classe marquée #[Attribute]."),
      r("$ref = new ReflectionClass(Ctrl::class);", "Reflection inspects code.", "La Reflection inspecte le code."),
      r("$ref->getMethod('x')->getAttributes(Route::class)", "Find attributes.", "Trouver les attributs."),
      r("$attr->newInstance()->path", "Build the attribute object.", "Construire l'objet attribut."),
    ]),
  ]),
  sheet("web", L("Requests and forms", "Requêtes et formulaires"), L("What PHP receives when someone visits a page.", "Ce que PHP reçoit quand quelqu'un visite une page."), [
    s("Superglobals", "Superglobales", [
      r("$_GET['q']", "Query string: /search?q=php", "Chaîne de requête : /search?q=php"),
      r("$_POST['email']", "Submitted form fields (method=\"post\").", "Champs de formulaire envoyés (method=\"post\")."),
      r("$_SERVER['REQUEST_METHOD']", "\"GET\" or \"POST\"…", "« GET » ou « POST »…"),
      r("$_COOKIE  $_SESSION  $_FILES", "Cookies, session data, uploads.", "Cookies, données de session, fichiers envoyés."),
      r("$_GET['page'] ?? 1", "Always provide a default.", "Prévois toujours une valeur par défaut."),
    ]),
    s("Validate input", "Valider les entrées", [
      r("filter_var($email, FILTER_VALIDATE_EMAIL)", "The value, or false.", "La valeur, ou false."),
      r("filter_var($n, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]])", "Integer in a range.", "Entier dans un intervalle."),
      r("trim($_POST['name'] ?? '')", "Clean up text input.", "Nettoyer une saisie texte."),
    ]),
    s("Respond", "Répondre", [
      r("header('Content-Type: application/json');", "Send a header (before any output).", "Envoyer un en-tête (avant toute sortie)."),
      r("http_response_code(404);", "Set the status code.", "Définir le code de statut."),
      r("echo json_encode($data);", "A JSON API response.", "Une réponse d'API JSON."),
      r("header('Location: /done'); exit;", "Redirect.", "Rediriger."),
    ]),
  ]),
  sheet("security", L("Security essentials", "L'essentiel de la sécurité"), L("Never trust input. Escape output. Hash passwords.", "Ne jamais faire confiance aux entrées. Échapper la sortie. Hacher les mots de passe."), [
    s("XSS: escape output", "XSS : échapper la sortie", [
      r("htmlspecialchars($text)", "Turn < > & \" ' into HTML entities before printing user text.", "Transforme < > & \" ' en entités HTML avant d'afficher du texte utilisateur."),
      r("function e(string $s): string {\n  return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');\n}", "A short helper you call everywhere.", "Une petite aide à appeler partout."),
      r("json_encode($data)", "Safe way to pass data to JavaScript.", "Façon sûre de passer des données au JavaScript."),
    ]),
    s("SQL injection", "Injection SQL", [
      r('$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");\n$stmt->execute([$id]);', "Prepared statements: data never becomes SQL.", "Requêtes préparées : les données ne deviennent jamais du SQL."),
      r('"... WHERE id = $id"', "NEVER put input inside SQL strings.", "NE JAMAIS mettre une entrée dans une chaîne SQL."),
    ]),
    s("Passwords and secrets", "Mots de passe et secrets", [
      r("password_hash($pw, PASSWORD_DEFAULT)", "Store this, never the password.", "Stocke ceci, jamais le mot de passe."),
      r("password_verify($pw, $hash)", "Check a login.", "Vérifier une connexion."),
      r("random_bytes(16)  bin2hex()  random_int(1, 6)", "Cryptographically secure randomness.", "Aléatoire cryptographiquement sûr."),
      r("hash_equals($a, $b)", "Compare secrets in constant time.", "Comparer des secrets en temps constant."),
    ]),
  ]),
  sheet("pdo", L("Databases with PDO", "Bases de données avec PDO"), L("One API for SQLite, MySQL, PostgreSQL…", "Une seule API pour SQLite, MySQL, PostgreSQL…"), [
    s("Connect", "Se connecter", [
      r('$pdo = new PDO("sqlite::memory:");', "In-memory SQLite (works here).", "SQLite en mémoire (fonctionne ici)."),
      r('new PDO("mysql:host=db;dbname=app", $user, $pass)', "MySQL / MariaDB.", "MySQL / MariaDB."),
      r("$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);", "Throw on SQL errors (default since 8.0).", "Lever une exception sur erreur SQL (par défaut depuis 8.0)."),
    ]),
    s("Query", "Requêter", [
      r('$pdo->exec("CREATE TABLE …");', "Run SQL without results.", "Exécuter du SQL sans résultat."),
      r('$st = $pdo->prepare("INSERT INTO t (name) VALUES (:name)");\n$st->execute(["name" => $n]);', "Named placeholders.", "Marqueurs nommés."),
      r('$st = $pdo->prepare("SELECT * FROM t WHERE id = ?");\n$st->execute([$id]);', "Positional placeholders.", "Marqueurs positionnels."),
      r("$pdo->lastInsertId()", "Id of the last inserted row.", "Id de la dernière ligne insérée."),
    ]),
    s("Fetch", "Récupérer", [
      r("$st->fetch(PDO::FETCH_ASSOC)", "One row as an array, or false.", "Une ligne en tableau, ou false."),
      r("$st->fetchAll(PDO::FETCH_ASSOC)", "Every row.", "Toutes les lignes."),
      r("$st->fetchColumn()", "First column of the next row.", "Première colonne de la ligne suivante."),
      r("$pdo->beginTransaction(); … $pdo->commit();", "All-or-nothing changes (rollBack() on error).", "Changements tout-ou-rien (rollBack() en cas d'erreur)."),
    ]),
  ]),
  sheet("testing", L("Testing", "Tests"), L("Code that checks your code.", "Du code qui vérifie ton code."), [
    s("Plain PHP", "PHP simple", [
      r("assert(add(2, 2) === 4);", "Throws AssertionError if false (when assertions are on).", "Lève AssertionError si faux (quand les assertions sont actives)."),
      r('function check(bool $ok, string $name) {\n  echo ($ok ? "✓ " : "✗ ") . $name . "\\n";\n}', "A tiny test helper.", "Une petite aide de test."),
    ]),
    s("PHPUnit", "PHPUnit", [
      r("final class CartTest extends TestCase { … }", "One test class per class under test.", "Une classe de test par classe testée."),
      r("public function testTotalIsZeroWhenEmpty(): void", "Each test is a public method starting with test (or #[Test]).", "Chaque test est une méthode publique qui commence par test (ou #[Test])."),
      r("$this->assertSame(4, add(2, 2));", "Strict equality (prefer it over assertEquals).", "Égalité stricte (préfère-la à assertEquals)."),
      r("$this->expectException(InvalidArgumentException::class);", "The next call must throw.", "L'appel suivant doit lever une exception."),
      r("vendor/bin/phpunit", "Run the suite.", "Lancer la suite."),
    ]),
    s("Good habits", "Bonnes habitudes", [
      r("Arrange → Act → Assert", "Set up, do one thing, check the result.", "Préparer, faire une chose, vérifier le résultat."),
      r("#[DataProvider('cases')]", "Same test, many inputs.", "Même test, plusieurs entrées."),
    ]),
  ]),
  sheet("php7", L("PHP 7.0 – 7.4", "PHP 7.0 – 7.4"), L("The releases that made PHP fast and typed.", "Les versions qui ont rendu PHP rapide et typé."), [
    s("7.0 (2015)", "7.0 (2015)", [
      r("function f(int $x): string", "Scalar type declarations and return types.", "Déclarations de types scalaires et types de retour."),
      r('$a ?? "default"', "Null coalescing operator.", "Opérateur de coalescence nulle."),
      r("$a <=> $b", "Spaceship operator.", "Opérateur vaisseau spatial."),
      r("new class { … }", "Anonymous classes. Plus: about twice as fast as PHP 5.6.", "Classes anonymes. Et : environ deux fois plus rapide que PHP 5.6."),
    ]),
    s("7.1 – 7.3", "7.1 – 7.3", [
      r("?int  : void", "Nullable types, void return (7.1).", "Types nullables, retour void (7.1)."),
      r("[$a, $b] = $arr;  ['k' => $v] = $arr;", "Short list() and keys in destructuring (7.1).", "list() court et clés dans la déstructuration (7.1)."),
      r("catch (A | B $e)", "Multi-catch (7.1).", "Multi-catch (7.1)."),
      r("object", "object type (7.2).", "Type object (7.2)."),
      r("array_key_first()  is_countable()", "New helpers; flexible heredoc; trailing commas in calls (7.3).", "Nouvelles aides ; heredoc flexible ; virgules finales dans les appels (7.3)."),
    ]),
    s("7.4 (2019)", "7.4 (2019)", [
      r("public int $count = 0;", "Typed properties.", "Propriétés typées."),
      r("fn($x) => $x * 2", "Arrow functions.", "Fonctions fléchées."),
      r("$a ??= [];", "Null coalescing assignment.", "Affectation de coalescence nulle."),
      r("[...$a, ...$b]  1_000_000", "Spread in arrays, numeric separator.", "Spread dans les tableaux, séparateur numérique."),
    ]),
  ]),
  sheet("php80", L("PHP 8.0 (2020)", "PHP 8.0 (2020)"), L("The biggest modernisation since PHP 7.", "La plus grande modernisation depuis PHP 7."), [
    s("New syntax", "Nouvelle syntaxe", [
      r("match ($x) { 1, 2 => 'low', default => 'high' }", "match expression.", "Expression match."),
      r('setcookie(name: "id", httponly: true);', "Named arguments.", "Arguments nommés."),
      r("$user?->address?->city", "Nullsafe operator.", "Opérateur nullsafe."),
      r("public function __construct(private int $x) {}", "Constructor property promotion.", "Promotion des propriétés du constructeur."),
      r("int|string  mixed  : static", "Union types, mixed, static return.", "Types union, mixed, retour static."),
      r("#[Attribute]", "Attributes.", "Attributs."),
      r("$x ?? throw new Exception();", "throw as an expression.", "throw comme expression."),
    ]),
    s("New functions", "Nouvelles fonctions", [
      r("str_contains()  str_starts_with()  str_ends_with()", "String searches without strpos tricks.", "Recherches de chaînes sans astuce strpos."),
      r("get_debug_type()", "Readable type names.", "Noms de types lisibles."),
    ]),
    s("Behaviour changes", "Changements de comportement", [
      r('0 == "a"  // false (true in 7.x)', "Saner number/string comparisons.", "Comparaisons nombre/chaîne plus saines."),
      r('"abc" * 1  // TypeError', "Arithmetic on non-numeric strings throws.", "L'arithmétique sur chaînes non numériques lève une erreur."),
      r("strlen([])  // TypeError", "Internal functions throw on wrong types.", "Les fonctions internes lèvent une erreur sur un mauvais type."),
      r("Warning: Undefined variable", "Many notices became warnings. Plus: the JIT compiler.", "Beaucoup de notices sont devenues des warnings. Et : le compilateur JIT."),
    ]),
  ]),
  sheet("php81", L("PHP 8.1 (2021)", "PHP 8.1 (2021)"), undefined, [
    s("Headline features", "Fonctionnalités phares", [
      r("enum Status: string { case Draft = 'draft'; }", "Enumerations.", "Énumérations."),
      r("public readonly string $id;", "Readonly properties: set once.", "Propriétés readonly : affectées une seule fois."),
      r("strlen(...)", "First-class callable syntax.", "Syntaxe callable de première classe."),
      r("public function __construct(private Logger $l = new NullLogger())", "new in initializers.", "new dans les initialiseurs."),
      r("function stop(): never", "never return type.", "Type de retour never."),
      r("A&B", "Pure intersection types.", "Types intersection purs."),
      r("new Fiber(fn() => …)", "Fibers (not runnable in this browser build).", "Fibers (non exécutables dans cette version navigateur)."),
    ]),
    s("Smaller", "Plus petits", [
      r("[...$a, ...['k' => 1]]", "Spread arrays with string keys.", "Spread de tableaux avec des clés texte."),
      r("array_is_list($a)", "Is it a 0, 1, 2… list?", "Est-ce une liste 0, 1, 2… ?"),
      r("0o17", "Explicit octal prefix.", "Préfixe octal explicite."),
    ]),
  ]),
  sheet("php82", L("PHP 8.2 (2022)", "PHP 8.2 (2022)"), undefined, [
    s("Features", "Fonctionnalités", [
      r("readonly class Point { … }", "Every property readonly.", "Toutes les propriétés en readonly."),
      r("(A&B)|null", "DNF types: unions of intersections.", "Types DNF : unions d'intersections."),
      r(": true  : false  : null", "true, false and null as standalone types.", "true, false et null comme types autonomes."),
      r("new Random\\Randomizer()", "The Random extension.", "L'extension Random."),
      r("const X in traits", "Constants in traits.", "Constantes dans les traits."),
      r("#[\\SensitiveParameter]", "Hide secrets from stack traces.", "Cacher les secrets des stack traces."),
    ]),
    s("Deprecations", "Dépréciations", [
      r("$obj->undeclared = 1;", "Dynamic properties are deprecated (use #[AllowDynamicProperties] or declare them).", "Les propriétés dynamiques sont dépréciées (utilise #[AllowDynamicProperties] ou déclare-les)."),
      r('"${var}"', "Use \"{$var}\" instead.", "Utilise \"{$var}\" à la place."),
    ]),
  ]),
  sheet("php83", L("PHP 8.3 (2023)", "PHP 8.3 (2023)"), undefined, [
    s("Features", "Fonctionnalités", [
      r("const string NAME = 'x';", "Typed class constants.", "Constantes de classe typées."),
      r("#[\\Override]", "Check that a method really overrides a parent.", "Vérifie qu'une méthode redéfinit vraiment un parent."),
      r("json_validate($s)", "Validate JSON without decoding.", "Valider du JSON sans le décoder."),
      r("Foo::{$name}", "Dynamic class constant fetch.", "Accès dynamique aux constantes de classe."),
      r("mb_str_pad()  str_increment('a9')", "New string helpers.", "Nouvelles aides pour les chaînes."),
      r("$r->getBytesFromString('abc', 5)", "More Randomizer methods.", "Plus de méthodes Randomizer."),
    ]),
    s("Also", "Aussi", [
      r("readonly props can be re-set in __clone", "Deep-cloning readonly objects.", "Clonage profond d'objets readonly."),
    ]),
  ]),
  sheet("php84", L("PHP 8.4 (2024)", "PHP 8.4 (2024)"), undefined, [
    s("Features", "Fonctionnalités", [
      r("public string $name { set => ucfirst($value); }", "Property hooks: logic on get/set.", "Hooks de propriétés : de la logique au get/set."),
      r("public int $area { get => $this->w * $this->h; }", "Virtual (computed) property.", "Propriété virtuelle (calculée)."),
      r("public private(set) int $count = 0;", "Asymmetric visibility.", "Visibilité asymétrique."),
      r("new Foo()->bar()", "No more parentheses around new.", "Plus de parenthèses autour de new."),
      r("array_find() array_find_key() array_any() array_all()", "Search arrays with a callback.", "Chercher dans un tableau avec un callback."),
      r("#[\\Deprecated]", "Deprecate your own functions.", "Déprécier tes propres fonctions."),
      r("mb_trim()  mb_ucfirst()", "Multibyte helpers.", "Aides multi-octets."),
    ]),
    s("Deprecations", "Dépréciations", [
      r("function f(int $x = null)", "Implicitly nullable parameters: write ?int.", "Paramètres implicitement nullables : écris ?int."),
    ]),
  ]),
  sheet("php85", L("PHP 8.5 (2025)", "PHP 8.5 (2025)"), undefined, [
    s("Features", "Fonctionnalités", [
      r('$slug = $title |> trim(...) |> strtolower(...);', "Pipe operator: left value goes into the next callable.", "Opérateur pipe : la valeur de gauche entre dans le callable suivant."),
      r("clone($this, ['x' => 5])", "Clone with new property values (great for readonly withers).", "Cloner avec de nouvelles valeurs (idéal pour les withers readonly)."),
      r("array_first($a)  array_last($a)", "First and last values.", "Premières et dernières valeurs."),
      r("#[\\NoDiscard]", "Warn when a return value is ignored; (void) silences it.", "Avertit quand une valeur de retour est ignorée ; (void) le fait taire."),
      r("Uri\\Rfc3986\\Uri::parse($url)", "Standards-compliant URI parsing.", "Analyse d'URI conforme aux standards."),
      r("public function __construct(final public int $x)", "final on promoted properties.", "final sur les propriétés promues."),
      r("const F = static function () { … };", "Closures in constant expressions.", "Closures dans les expressions constantes."),
    ]),
    s("Also", "Aussi", [
      r("Fatal error … Stack trace:", "Fatal errors now include a backtrace.", "Les erreurs fatales incluent désormais une trace."),
      r("get_error_handler()  get_exception_handler()", "Read the current handlers.", "Lire les gestionnaires actuels."),
      r("`ls`  (boolean)  (integer)", "Deprecated: backticks and non-canonical casts.", "Dépréciés : backticks et casts non canoniques."),
    ]),
  ]),
];

export const CHEATS = Object.fromEntries(LIST.map((c) => [c.key, c])) as Record<CheatKey, CheatSheet>;

export const cheatFor = (key?: string): CheatSheet | null => (key && key in CHEATS ? CHEATS[key as CheatKey] : null);
