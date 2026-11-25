import type { DocPage } from "../types";
import { md } from "./md";

/** Guides for the language itself: chapters 1 to 6. */
export const CORE_GUIDES: DocPage[] = [
  {
    slug: "guide-how-php-runs",
    section: "guides",
    icon: "Play",
    lesson: "hello-php",
    more: ["variables"],
    title: { en: "How PHP runs", fr: "Comment PHP s'exécute" },
    lead: {
      en: "A PHP file is a script the server runs from top to bottom for every request. Whatever it prints becomes the response.",
      fr: "Un fichier PHP est un script que le serveur exécute de haut en bas à chaque requête. Tout ce qu'il affiche devient la réponse.",
    },
    body: {
      en: md`
## From a request to a page

When someone opens ´https://example.com/hello.php´, this happens:

1. The browser sends an **HTTP request** to the web server (Nginx, Apache, Caddy…).
2. The server sees a ´.php´ file and hands it to **PHP** (usually PHP-FPM).
3. PHP **compiles** the file to opcodes (cached by OPcache), then **runs** it from the first line to the last.
4. Everything the script prints with ´echo´ (and any HTML outside ´<?php ?>´) is collected into the **response body**.
5. The script ends, its memory is freed, and the server sends the response back.

Each request starts from a blank slate: variables don't survive between two page loads. To remember things, PHP uses a database, files, sessions or cookies.

## The anatomy of a script

´´´php
<?php
// A comment: PHP ignores it.
$name = "world";          // a variable
echo "Hello, $name!\n";   // print something
´´´

| Piece | Meaning |
|---|---|
| ´<?php´ | Opening tag. Everything after it is PHP. |
| ´;´ | Ends a statement, like a full stop. |
| ´//´, ´#´, ´/* */´ | Comments. |
| ´echo´ | Prints text to the output. |
| ´\n´ | A new line, inside double quotes. |

> Tip: In a file that only contains PHP, leave out the closing ´?>´ tag. It prevents stray blank lines from being sent by accident.

## Mixing PHP and HTML

PHP started as a templating language, so you can switch in and out of PHP inside an HTML page:

´´´php
<ul>
<?php foreach (["Tea", "Coffee"] as $drink): ?>
  <li><?= htmlspecialchars($drink) ?></li>
<?php endforeach; ?>
</ul>
´´´

´<?= $x ?>´ is a short way to write ´<?php echo $x; ?>´. Modern apps usually keep logic and HTML apart (templates such as Twig or Blade), but you will meet this style everywhere.

## The command line

PHP also runs without a web server: ´php script.php´ in a terminal. That's how you run scripts, tests (PHPUnit), Composer and tools. In this app, PHP runs inside your browser thanks to WebAssembly: a real PHP interpreter, compiled for the browser, with versions from 7.4 to 8.5.

## When something goes wrong

- A **Parse error** means PHP couldn't read the file at all: nothing runs. The line number points at where PHP got confused; the real mistake is often at the end of the line before (a missing ´;´ or ´)´).
- A **Warning** means something is wrong but the script continues.
- A **Fatal error** or **Uncaught exception** stops the script on the spot.

The Problems tab under the editor lists each one with its line; click it to jump there.
`,
      fr: md`
## D'une requête à une page

Quand quelqu'un ouvre ´https://example.com/hello.php´, voici ce qui se passe :

1. Le navigateur envoie une **requête HTTP** au serveur web (Nginx, Apache, Caddy…).
2. Le serveur voit un fichier ´.php´ et le confie à **PHP** (en général PHP-FPM).
3. PHP **compile** le fichier en opcodes (mis en cache par OPcache), puis l'**exécute** de la première à la dernière ligne.
4. Tout ce que le script affiche avec ´echo´ (et le HTML hors de ´<?php ?>´) est rassemblé dans le **corps de la réponse**.
5. Le script se termine, sa mémoire est libérée, et le serveur renvoie la réponse.

Chaque requête repart de zéro : les variables ne survivent pas entre deux chargements de page. Pour se souvenir de quelque chose, PHP utilise une base de données, des fichiers, des sessions ou des cookies.

## L'anatomie d'un script

´´´php
<?php
// Un commentaire : PHP l'ignore.
$name = "world";          // une variable
echo "Hello, $name!\n";   // afficher quelque chose
´´´

| Élément | Signification |
|---|---|
| ´<?php´ | Balise d'ouverture. Tout ce qui suit est du PHP. |
| ´;´ | Termine une instruction, comme un point. |
| ´//´, ´#´, ´/* */´ | Commentaires. |
| ´echo´ | Affiche du texte dans la sortie. |
| ´\n´ | Un retour à la ligne, entre guillemets doubles. |

> Astuce : dans un fichier qui ne contient que du PHP, n'écris pas la balise de fermeture ´?>´. Ça évite d'envoyer des lignes vides par accident.

## Mélanger PHP et HTML

PHP est né comme langage de gabarits : tu peux entrer et sortir du PHP au milieu d'une page HTML.

´´´php
<ul>
<?php foreach (["Tea", "Coffee"] as $drink): ?>
  <li><?= htmlspecialchars($drink) ?></li>
<?php endforeach; ?>
</ul>
´´´

´<?= $x ?>´ est une façon courte d'écrire ´<?php echo $x; ?>´. Les applications modernes séparent souvent la logique et le HTML (gabarits comme Twig ou Blade), mais tu croiseras ce style partout.

## La ligne de commande

PHP tourne aussi sans serveur web : ´php script.php´ dans un terminal. C'est comme ça qu'on lance des scripts, des tests (PHPUnit), Composer et des outils. Dans cette appli, PHP tourne dans ton navigateur grâce à WebAssembly : un vrai interpréteur PHP, compilé pour le navigateur, de la version 7.4 à la 8.5.

## Quand ça se passe mal

- Une **Parse error** veut dire que PHP n'a pas pu lire le fichier : rien ne s'exécute. Le numéro de ligne indique où PHP s'est perdu ; la vraie faute est souvent à la fin de la ligne d'avant (un ´;´ ou une ´)´ manquant).
- Un **Warning** signale un problème, mais le script continue.
- Une **Fatal error** ou une **exception non attrapée** arrête le script sur-le-champ.

L'onglet Problèmes sous l'éditeur les liste avec leur ligne ; clique pour y aller.
`,
    },
  },
  {
    slug: "guide-types",
    section: "guides",
    icon: "Type",
    lesson: "variables",
    more: ["numbers", "comparisons", "strict-types"],
    title: { en: "Variables and types", fr: "Variables et types" },
    lead: {
      en: "PHP figures out types by itself, converts them when it can, and lets you declare them when you want certainty.",
      fr: "PHP devine les types tout seul, les convertit quand il peut, et te laisse les déclarer quand tu veux des certitudes.",
    },
    body: {
      en: md`
## Variables

A variable is a name that holds a value. It starts with ´$´, followed by a letter or underscore. Names are **case-sensitive**: ´$total´ and ´$Total´ are different.

´´´php
$price = 20;        // create
$price = $price + 5; // change: the old value is gone
$count = $items = 0; // chain
´´´

A variable doesn't need to be declared beforehand, but reading one that was never assigned gives ´Warning: Undefined variable $x´ and the value ´null´.

## The types

| Type | Examples | Notes |
|---|---|---|
| ´int´ | ´42´, ´-7´, ´1_000_000´ | Whole numbers, 64-bit. ´_´ separators since 7.4. |
| ´float´ | ´3.14´, ´1e3´ | Decimals, approximate: ´0.1 + 0.2´ is not exactly ´0.3´. |
| ´string´ | ´"hi"´, ´'hi'´ | Text, a sequence of bytes. |
| ´bool´ | ´true´, ´false´ | Yes or no. |
| ´null´ | ´null´ | "No value". |
| ´array´ | ´[1, 2]´, ´["a" => 1]´ | Ordered list or key/value map. |
| object | ´new User()´ | An instance of a class. |
| callable | ´fn($x) => $x´ | Something you can call. |

´var_dump($x)´ prints the type and value: ´int(42)´, ´string(2) "42"´, ´bool(false)´. ´get_debug_type($x)´ (PHP 8) returns just the type name.

## Type juggling

PHP converts values when an operation needs a different type:

´´´php
var_dump("5" + 3);      // int(8): the string looks like a number
var_dump("10" . 5);     // string(3) "105": the dot joins text
var_dump((int) "42px"); // int(42): explicit cast
´´´

Casts make the conversion explicit: ´(int)´, ´(float)´, ´(string)´, ´(bool)´, ´(array)´.

> Warning: Since PHP 8, ´"abc" + 1´ throws a TypeError and ´"5 apples" + 1´ gives a warning. PHP 7 silently used 0 and 5. Old code that relied on this breaks when upgrading.

## Truthy and falsy

In an ´if´, these values count as false: ´false´, ´0´, ´0.0´, ´""´, ´"0"´, ´[]´ and ´null´. Everything else is true, including ´"false"´ and ´" "´.

## Declaring types

Functions, properties and constants can declare types. PHP then checks them for you:

´´´php
function area(float $w, float $h): float {
    return $w * $h;
}
´´´

By default PHP still converts compatible values (´"3"´ becomes ´3.0´). Put ´declare(strict_types=1);´ as the first statement of a file to refuse that and get a TypeError instead. Nullable types (´?string´), unions (´int|string´, PHP 8) and ´mixed´ cover the rest.

## Constants

´const MAX_USERS = 100;´ or ´define("MAX_USERS", 100);´ create values that never change. No ´$´, and by convention UPPER_CASE.
`,
      fr: md`
## Les variables

Une variable est un nom qui contient une valeur. Elle commence par ´$´, suivi d'une lettre ou d'un tiret bas. Les noms sont **sensibles à la casse** : ´$total´ et ´$Total´ sont différentes.

´´´php
$price = 20;        // créer
$price = $price + 5; // changer : l'ancienne valeur disparaît
$count = $items = 0; // enchaîner
´´´

Pas besoin de déclarer une variable à l'avance, mais lire une variable jamais affectée donne ´Warning: Undefined variable $x´ et la valeur ´null´.

## Les types

| Type | Exemples | Remarques |
|---|---|---|
| ´int´ | ´42´, ´-7´, ´1_000_000´ | Entiers, 64 bits. Séparateurs ´_´ depuis 7.4. |
| ´float´ | ´3.14´, ´1e3´ | Décimaux, approximatifs : ´0.1 + 0.2´ ne vaut pas exactement ´0.3´. |
| ´string´ | ´"hi"´, ´'hi'´ | Du texte, une suite d'octets. |
| ´bool´ | ´true´, ´false´ | Oui ou non. |
| ´null´ | ´null´ | « Pas de valeur ». |
| ´array´ | ´[1, 2]´, ´["a" => 1]´ | Liste ordonnée ou dictionnaire clé/valeur. |
| objet | ´new User()´ | Une instance d'une classe. |
| callable | ´fn($x) => $x´ | Quelque chose qu'on peut appeler. |

´var_dump($x)´ affiche le type et la valeur : ´int(42)´, ´string(2) "42"´, ´bool(false)´. ´get_debug_type($x)´ (PHP 8) renvoie juste le nom du type.

## Les conversions automatiques

PHP convertit les valeurs quand une opération a besoin d'un autre type :

´´´php
var_dump("5" + 3);      // int(8) : la chaîne ressemble à un nombre
var_dump("10" . 5);     // string(3) "105" : le point colle du texte
var_dump((int) "42px"); // int(42) : conversion explicite
´´´

Les casts rendent la conversion explicite : ´(int)´, ´(float)´, ´(string)´, ´(bool)´, ´(array)´.

> Attention : depuis PHP 8, ´"abc" + 1´ lève une TypeError et ´"5 apples" + 1´ donne un avertissement. PHP 7 utilisait 0 et 5 sans rien dire. Le vieux code qui comptait là-dessus casse lors d'une mise à jour.

## Vrai ou faux

Dans un ´if´, ces valeurs comptent comme fausses : ´false´, ´0´, ´0.0´, ´""´, ´"0"´, ´[]´ et ´null´. Tout le reste est vrai, y compris ´"false"´ et ´" "´.

## Déclarer des types

Les fonctions, propriétés et constantes peuvent déclarer des types. PHP les vérifie pour toi :

´´´php
function area(float $w, float $h): float {
    return $w * $h;
}
´´´

Par défaut, PHP convertit encore les valeurs compatibles (´"3"´ devient ´3.0´). Mets ´declare(strict_types=1);´ comme première instruction d'un fichier pour refuser ça et obtenir une TypeError. Les types nullables (´?string´), les unions (´int|string´, PHP 8) et ´mixed´ couvrent le reste.

## Les constantes

´const MAX_USERS = 100;´ ou ´define("MAX_USERS", 100);´ créent des valeurs qui ne changent jamais. Pas de ´$´, et par convention en MAJUSCULES.
`,
    },
  },
  {
    slug: "guide-strings",
    section: "guides",
    icon: "Quote",
    lesson: "strings",
    more: ["string-functions", "formatting"],
    title: { en: "Strings", fr: "Les chaînes de caractères" },
    lead: {
      en: "Four ways to write text, one operator to join it, and the rules that decide when variables are replaced.",
      fr: "Quatre façons d'écrire du texte, un opérateur pour le coller, et les règles qui décident quand les variables sont remplacées.",
    },
    body: {
      en: md`
## Four ways to write a string

| Syntax | Variables replaced? | Escapes like ´\n´? | Use it for |
|---|---|---|---|
| ´'single'´ | No | Only ´\'´ and ´\\´ | Fixed text |
| ´"double"´ | Yes | Yes | Text with values in it |
| heredoc ´<<<TXT´ | Yes | Yes | Long text, templates |
| nowdoc ´<<<'TXT'´ | No | No | Long raw text, code samples |

´´´php
$name = "Ada";
echo 'Hi $name\n';   // Hi $name\n
echo "Hi $name\n";   // Hi Ada + new line
echo "{$name}'s PC"; // braces mark where the name ends
´´´

Use braces for array items and properties: ´"{$user['name']}"´, ´"{$order->total}"´.

## Joining

The dot ´.´ joins strings; ´.=´ appends. ´+´ only adds numbers.

´´´php
$line = "Total: " . 42 . " €";
$html = "<ul>";
$html .= "<li>One</li>";
´´´

For anything with several values, ´sprintf()´ is often clearer: ´sprintf("%s owes %.2f", $name, $amount)´.

## Heredoc

´´´php
$user = "Rasmus";
echo <<<TXT
    Dear $user,
    thanks for PHP!
    TXT;
´´´

Since PHP 7.3 the closing marker can be indented, and that indentation is removed from every line.

## Bytes and characters

A PHP string is a sequence of **bytes**. Accented letters and emoji take several bytes in UTF-8, so ´strlen("été")´ is 5. The ´mb_´ functions count characters: ´mb_strlen("été")´ is 3. Use ´mb_substr´, ´mb_strtoupper´, ´mb_str_pad´ (8.3) when text may contain more than plain English.

## Characters by position

´$s[0]´ is the first byte, ´$s[-1]´ the last. Reading past the end gives ´Warning: Uninitialized string offset´.

> Tip: Strings are values. ´strtoupper($s)´ returns a new string; ´$s´ itself doesn't change unless you assign the result back.
`,
      fr: md`
## Quatre façons d'écrire une chaîne

| Syntaxe | Variables remplacées ? | Séquences comme ´\n´ ? | À utiliser pour |
|---|---|---|---|
| ´'simples'´ | Non | Seulement ´\'´ et ´\\´ | Du texte fixe |
| ´"doubles"´ | Oui | Oui | Du texte avec des valeurs |
| heredoc ´<<<TXT´ | Oui | Oui | Du texte long, des gabarits |
| nowdoc ´<<<'TXT'´ | Non | Non | Du texte brut long, des exemples de code |

´´´php
$name = "Ada";
echo 'Hi $name\n';   // Hi $name\n
echo "Hi $name\n";   // Hi Ada + retour à la ligne
echo "{$name}'s PC"; // les accolades marquent la fin du nom
´´´

Utilise les accolades pour les éléments de tableau et les propriétés : ´"{$user['name']}"´, ´"{$order->total}"´.

## Coller

Le point ´.´ colle des chaînes ; ´.=´ ajoute à la fin. ´+´ ne sert qu'aux nombres.

´´´php
$line = "Total: " . 42 . " €";
$html = "<ul>";
$html .= "<li>One</li>";
´´´

Dès qu'il y a plusieurs valeurs, ´sprintf()´ est souvent plus clair : ´sprintf("%s doit %.2f", $name, $amount)´.

## Heredoc

´´´php
$user = "Rasmus";
echo <<<TXT
    Dear $user,
    thanks for PHP!
    TXT;
´´´

Depuis PHP 7.3, le marqueur final peut être indenté, et cette indentation est retirée de chaque ligne.

## Octets et caractères

Une chaîne PHP est une suite d'**octets**. Les lettres accentuées et les emoji prennent plusieurs octets en UTF-8, donc ´strlen("été")´ vaut 5. Les fonctions ´mb_´ comptent les caractères : ´mb_strlen("été")´ vaut 3. Utilise ´mb_substr´, ´mb_strtoupper´, ´mb_str_pad´ (8.3) dès que le texte peut contenir autre chose que de l'anglais simple.

## Les caractères par position

´$s[0]´ est le premier octet, ´$s[-1]´ le dernier. Lire au-delà de la fin donne ´Warning: Uninitialized string offset´.

> Astuce : les chaînes sont des valeurs. ´strtoupper($s)´ renvoie une nouvelle chaîne ; ´$s´ ne change pas tant que tu ne réaffectes pas le résultat.
`,
    },
  },
  {
    slug: "guide-control-flow",
    section: "guides",
    icon: "GitBranch",
    lesson: "conditions",
    more: ["comparisons", "match-switch", "loops", "boss-fizzbuzz"],
    title: { en: "Conditions and loops", fr: "Conditions et boucles" },
    lead: {
      en: "Choose what runs with if and match, compare values safely, and repeat work with four kinds of loops.",
      fr: "Choisis ce qui s'exécute avec if et match, compare les valeurs sans piège, et répète un travail avec quatre sortes de boucles.",
    },
    body: {
      en: md`
## if, elseif, else

´´´php
if ($age >= 18) {
    echo "adult";
} elseif ($age >= 13) {
    echo "teen";
} else {
    echo "child";
}
´´´

PHP tests the conditions from top to bottom and runs the **first** block whose condition is true.

## Comparing values

| Operator | True when |
|---|---|
| ´===´ | Same value **and** same type |
| ´!==´ | Different value or type |
| ´==´ | Same value after type juggling |
| ´<´ ´>´ ´<=´ ´>=´ | Order |
| ´<=>´ | Returns -1, 0 or 1 (sorting) |

Use ´===´ by default. ´==´ converts types first, which hides bugs: ´"1" == "01"´ is true, and in PHP 7 ´0 == "a"´ was true too (PHP 8 fixed that one).

Combine conditions with ´&&´ (and), the double pipe (or) and ´!´ (not). Parentheses make your intent obvious.

## Short forms

´´´php
$label = $stock > 0 ? "in stock" : "sold out"; // ternary
$name  = $_GET["name"] ?? "guest";             // null coalescing
´´´

´??´ only falls back on ´null´ or a missing key, with no warning. ´?:´ falls back on any falsy value, including ´0´ and ´""´.

## match (PHP 8)

´´´php
$text = match ($status) {
    200, 201 => "OK",
    404      => "Not found",
    default  => "Error",
};
´´´

Unlike ´switch´, ´match´ compares strictly (´===´), returns a value, never falls through to the next case, and throws ´UnhandledMatchError´ if nothing matches and there's no ´default´. ´match (true) { $n < 0 => …, … }´ picks the first condition that is true.

## Loops

| Loop | Use it when |
|---|---|
| ´for ($i = 0; $i < 10; $i++)´ | You count |
| ´foreach ($items as $key => $item)´ | You walk through an array (most common) |
| ´while ($cond)´ | You repeat until something changes |
| ´do { } while ($cond);´ | The body must run at least once |

´break´ leaves a loop, ´continue´ jumps to the next round. ´break 2´ leaves two nested loops.

> Warning: A ´while´ whose condition never becomes false runs forever. Here, a script that runs too many steps is stopped and you see a message; on a server it would hit ´max_execution_time´.

## Watch a loop run

Open the **Trace** tab after a run: every step shows the line, the call stack and the variables. Stepping through a loop is the fastest way to see off-by-one mistakes (´<´ versus ´<=´).
`,
      fr: md`
## if, elseif, else

´´´php
if ($age >= 18) {
    echo "adult";
} elseif ($age >= 13) {
    echo "teen";
} else {
    echo "child";
}
´´´

PHP teste les conditions de haut en bas et exécute le **premier** bloc dont la condition est vraie.

## Comparer des valeurs

| Opérateur | Vrai quand |
|---|---|
| ´===´ | Même valeur **et** même type |
| ´!==´ | Valeur ou type différents |
| ´==´ | Même valeur après conversion |
| ´<´ ´>´ ´<=´ ´>=´ | Ordre |
| ´<=>´ | Renvoie -1, 0 ou 1 (tri) |

Utilise ´===´ par défaut. ´==´ convertit d'abord les types, ce qui cache des bugs : ´"1" == "01"´ est vrai, et en PHP 7 ´0 == "a"´ l'était aussi (PHP 8 a corrigé celui-là).

Combine les conditions avec ´&&´ (et), le double pipe (ou) et ´!´ (non). Les parenthèses rendent ton intention évidente.

## Formes courtes

´´´php
$label = $stock > 0 ? "in stock" : "sold out"; // ternaire
$name  = $_GET["name"] ?? "guest";             // coalescence nulle
´´´

´??´ ne se replie que sur ´null´ ou une clé absente, sans avertissement. ´?:´ se replie sur toute valeur fausse, y compris ´0´ et ´""´.

## match (PHP 8)

´´´php
$text = match ($status) {
    200, 201 => "OK",
    404      => "Not found",
    default  => "Error",
};
´´´

Contrairement à ´switch´, ´match´ compare strictement (´===´), renvoie une valeur, ne « tombe » jamais dans le cas suivant, et lève ´UnhandledMatchError´ si rien ne correspond et qu'il n'y a pas de ´default´. ´match (true) { $n < 0 => …, … }´ prend la première condition vraie.

## Les boucles

| Boucle | Quand l'utiliser |
|---|---|
| ´for ($i = 0; $i < 10; $i++)´ | Pour compter |
| ´foreach ($items as $key => $item)´ | Pour parcourir un tableau (le plus courant) |
| ´while ($cond)´ | Pour répéter jusqu'à ce que quelque chose change |
| ´do { } while ($cond);´ | Quand le corps doit s'exécuter au moins une fois |

´break´ sort d'une boucle, ´continue´ passe au tour suivant. ´break 2´ sort de deux boucles imbriquées.

> Attention : un ´while´ dont la condition ne devient jamais fausse tourne pour toujours. Ici, un script qui fait trop d'étapes est arrêté avec un message ; sur un serveur, il atteindrait ´max_execution_time´.

## Regarder une boucle tourner

Ouvre l'onglet **Trace** après une exécution : chaque étape montre la ligne, la pile d'appels et les variables. Avancer pas à pas dans une boucle est le moyen le plus rapide de voir les erreurs d'un cran (´<´ au lieu de ´<=´).
`,
    },
  },
  {
    slug: "guide-arrays",
    section: "guides",
    icon: "List",
    lesson: "array-basics",
    more: ["assoc-arrays", "array-functions", "destructuring", "boss-gradebook"],
    title: { en: "Arrays", fr: "Les tableaux" },
    lead: {
      en: "One structure for lists, dictionaries, stacks and tables. Learn to build them, read them safely and transform them without loops.",
      fr: "Une seule structure pour les listes, les dictionnaires, les piles et les tables. Apprends à les construire, les lire sans risque et les transformer sans boucle.",
    },
    body: {
      en: md`
## Lists and maps are the same thing

A PHP array is an **ordered map**: every value has a key. When you don't give keys, PHP numbers them 0, 1, 2…

´´´php
$colors = ["red", "green"];            // keys 0 and 1
$user   = ["name" => "Ada", "age" => 36]; // your own keys
$colors[] = "blue";                    // append: key 2
$user["city"] = "London";             // add a key
unset($user["age"]);                   // remove it
´´´

Keys are ints or strings. ´"1"´ as a key becomes the int ´1´. Values can be anything, including other arrays: ´$matrix[1][2]´.

## Reading safely

| You want | Write |
|---|---|
| A value, or a default | ´$user["email"] ?? "none"´ |
| Is the key there (and not null)? | ´isset($user["email"])´ |
| Is the key there at all? | ´array_key_exists("email", $user)´ |
| Is this value in the list? | ´in_array("red", $colors, true)´ |
| How many items? | ´count($colors)´ |

Reading a missing key gives ´Warning: Undefined array key "email"´ and ´null´.

## Looping

´´´php
foreach ($user as $key => $value) {
    echo "$key: $value\n";
}
´´´

## Transforming without loops

´´´php
$prices = [12, 5, 30];
$withTax = array_map(fn($p) => $p * 1.2, $prices);
$cheap   = array_filter($prices, fn($p) => $p < 20);
$total   = array_sum($prices);
$sum2    = array_reduce($prices, fn($carry, $p) => $carry + $p, 0);
´´´

- ´array_map´ returns a new array with each value transformed.
- ´array_filter´ keeps matching values **and their keys**: call ´array_values()´ if you need 0, 1, 2 again.
- ´array_reduce´ folds everything into one value.

## Sorting

| Function | Sorts by | Keeps keys? |
|---|---|---|
| ´sort´ / ´rsort´ | value | No |
| ´asort´ / ´arsort´ | value | Yes |
| ´ksort´ / ´krsort´ | key | Yes |
| ´usort´ | your callback | No |

They modify the array in place and return ´true´. With ´usort´, the spaceship operator does the comparison: ´usort($people, fn($a, $b) => $a["age"] <=> $b["age"]);´

## Destructuring and spreading

´´´php
[$first, $second] = ["a", "b"];
["name" => $name] = $user;
[$a, $b] = [$b, $a];          // swap
$all = [...$colors, ...["black"]];
´´´

## Arrays are copied

Assigning an array to another variable copies it (cheaply, on write). Changing the copy never changes the original, unless you use a reference ´&´.

> Tip: When a list of arrays starts to have a fixed shape (´name´, ´price´, ´qty´…), it's often time for a class. Chapter 6 shows how.
`,
      fr: md`
## Listes et dictionnaires, c'est pareil

Un tableau PHP est un **dictionnaire ordonné** : chaque valeur a une clé. Si tu ne donnes pas de clés, PHP les numérote 0, 1, 2…

´´´php
$colors = ["red", "green"];            // clés 0 et 1
$user   = ["name" => "Ada", "age" => 36]; // tes propres clés
$colors[] = "blue";                    // ajouter : clé 2
$user["city"] = "London";             // ajouter une clé
unset($user["age"]);                   // la supprimer
´´´

Les clés sont des entiers ou des chaînes. ´"1"´ comme clé devient l'entier ´1´. Les valeurs peuvent être n'importe quoi, y compris d'autres tableaux : ´$matrix[1][2]´.

## Lire sans risque

| Tu veux | Écris |
|---|---|
| Une valeur, ou une valeur par défaut | ´$user["email"] ?? "none"´ |
| La clé existe-t-elle (et n'est pas null) ? | ´isset($user["email"])´ |
| La clé existe-t-elle tout court ? | ´array_key_exists("email", $user)´ |
| Cette valeur est-elle dans la liste ? | ´in_array("red", $colors, true)´ |
| Combien d'éléments ? | ´count($colors)´ |

Lire une clé absente donne ´Warning: Undefined array key "email"´ et ´null´.

## Parcourir

´´´php
foreach ($user as $key => $value) {
    echo "$key: $value\n";
}
´´´

## Transformer sans boucle

´´´php
$prices = [12, 5, 30];
$withTax = array_map(fn($p) => $p * 1.2, $prices);
$cheap   = array_filter($prices, fn($p) => $p < 20);
$total   = array_sum($prices);
$sum2    = array_reduce($prices, fn($carry, $p) => $carry + $p, 0);
´´´

- ´array_map´ renvoie un nouveau tableau avec chaque valeur transformée.
- ´array_filter´ garde les valeurs qui passent **et leurs clés** : appelle ´array_values()´ si tu veux retrouver 0, 1, 2.
- ´array_reduce´ réduit tout en une seule valeur.

## Trier

| Fonction | Trie par | Garde les clés ? |
|---|---|---|
| ´sort´ / ´rsort´ | valeur | Non |
| ´asort´ / ´arsort´ | valeur | Oui |
| ´ksort´ / ´krsort´ | clé | Oui |
| ´usort´ | ton callback | Non |

Elles modifient le tableau directement et renvoient ´true´. Avec ´usort´, l'opérateur vaisseau spatial fait la comparaison : ´usort($people, fn($a, $b) => $a["age"] <=> $b["age"]);´

## Déstructurer et étaler

´´´php
[$first, $second] = ["a", "b"];
["name" => $name] = $user;
[$a, $b] = [$b, $a];          // échanger
$all = [...$colors, ...["black"]];
´´´

## Les tableaux sont copiés

Affecter un tableau à une autre variable le copie (à moindre coût, à l'écriture). Modifier la copie ne change jamais l'original, sauf avec une référence ´&´.

> Astuce : quand une liste de tableaux prend une forme fixe (´name´, ´price´, ´qty´…), il est souvent temps d'en faire une classe. Le chapitre 6 montre comment.
`,
    },
  },
  {
    slug: "guide-functions",
    section: "guides",
    icon: "SquareFunction",
    lesson: "functions-basics",
    more: ["typed-functions", "closures", "scope-recursion", "boss-toolkit"],
    title: { en: "Functions", fr: "Les fonctions" },
    lead: {
      en: "Give a name to a piece of logic, describe what goes in and out with types, and pass functions around as values.",
      fr: "Donne un nom à un morceau de logique, décris ce qui entre et sort avec des types, et fais circuler des fonctions comme des valeurs.",
    },
    body: {
      en: md`
## Defining and calling

´´´php
function greet(string $name, string $greeting = "Hello"): string
{
    return "$greeting, $name!";
}

echo greet("Ada");                   // Hello, Ada!
echo greet("Ada", greeting: "Hi");   // named argument (PHP 8)
´´´

- **Parameters** are the inputs, with an optional type and default value.
- ´return´ sends a value back and ends the function. Without it, the function returns ´null´.
- A function can be called before its definition in the same file.

## Types in and out

| Declaration | Accepts |
|---|---|
| ´int $n´ | an int (or a numeric string, without strict types) |
| ´?string $s´ | a string or null |
| ´int´ or ´float´ as a union type (PHP 8) | either type: write them with a pipe between |
| ´array ...$rows´ | any number of arrays (variadic) |
| ´: void´ | returns nothing |
| ´: never´ | never returns (throws or exits), PHP 8.1 |

A wrong type gives a clear TypeError, for example ´greet(): Argument #1 ($name) must be of type string, array given´. That message names the function, the argument and both types: read it before anything else.

## Scope

Variables inside a function are **local**: the function can't see the variables of the script, and the script can't see its variables. Pass what it needs as arguments and return the result. (The ´global´ keyword exists but makes code hard to follow.)

´static $count = 0;´ inside a function keeps its value between calls.

## Functions as values

´´´php
$double = fn(int $x): int => $x * 2;      // arrow function (7.4)
$rate = 1.2;
$withTax = function (float $p) use ($rate) { // closure capturing $rate
    return $p * $rate;
};
$upper = strtoupper(...);                 // first-class callable (8.1)

array_map($double, [1, 2, 3]);           // [2, 4, 6]
´´´

Arrow functions capture outer variables automatically, by value. Classic closures capture only what you list in ´use (...)´; write ´use (&$total)´ to modify it.

## Recursion

A function can call itself, as long as each call gets closer to a stop condition:

´´´php
function factorial(int $n): int
{
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}
´´´

The Trace tab shows the call stack growing (´factorial´ inside ´factorial´…) and shrinking again.

> Tip: Small functions with clear names are the easiest code to test and reuse. If you need the word "and" to describe a function, it probably wants to be two.
`,
      fr: md`
## Définir et appeler

´´´php
function greet(string $name, string $greeting = "Hello"): string
{
    return "$greeting, $name!";
}

echo greet("Ada");                   // Hello, Ada!
echo greet("Ada", greeting: "Hi");   // argument nommé (PHP 8)
´´´

- Les **paramètres** sont les entrées, avec un type et une valeur par défaut facultatifs.
- ´return´ renvoie une valeur et termine la fonction. Sans lui, la fonction renvoie ´null´.
- Une fonction peut être appelée avant sa définition dans le même fichier.

## Des types en entrée et en sortie

| Déclaration | Accepte |
|---|---|
| ´int $n´ | un int (ou une chaîne numérique, sans types stricts) |
| ´?string $s´ | une chaîne ou null |
| ´int´ ou ´float´ en type union (PHP 8) | l'un ou l'autre : écris-les séparés par un pipe |
| ´array ...$rows´ | autant de tableaux qu'on veut (variadique) |
| ´: void´ | ne renvoie rien |
| ´: never´ | ne revient jamais (lève une exception ou quitte), PHP 8.1 |

Un mauvais type donne une TypeError claire, par exemple ´greet(): Argument #1 ($name) must be of type string, array given´. Ce message nomme la fonction, l'argument et les deux types : lis-le avant tout le reste.

## La portée

Les variables d'une fonction sont **locales** : la fonction ne voit pas les variables du script, et le script ne voit pas les siennes. Passe-lui ce dont elle a besoin en arguments et renvoie le résultat. (Le mot-clé ´global´ existe mais rend le code difficile à suivre.)

´static $count = 0;´ dans une fonction garde sa valeur entre deux appels.

## Les fonctions comme valeurs

´´´php
$double = fn(int $x): int => $x * 2;      // fonction fléchée (7.4)
$rate = 1.2;
$withTax = function (float $p) use ($rate) { // closure qui capture $rate
    return $p * $rate;
};
$upper = strtoupper(...);                 // callable de première classe (8.1)

array_map($double, [1, 2, 3]);           // [2, 4, 6]
´´´

Les fonctions fléchées capturent automatiquement les variables extérieures, par valeur. Les closures classiques ne capturent que ce que tu listes dans ´use (...)´ ; écris ´use (&$total)´ pour la modifier.

## La récursivité

Une fonction peut s'appeler elle-même, à condition que chaque appel se rapproche d'une condition d'arrêt :

´´´php
function factorial(int $n): int
{
    return $n <= 1 ? 1 : $n * factorial($n - 1);
}
´´´

L'onglet Trace montre la pile d'appels grandir (´factorial´ dans ´factorial´…) puis rétrécir.

> Astuce : les petites fonctions aux noms clairs sont le code le plus facile à tester et à réutiliser. Si tu as besoin du mot « et » pour décrire une fonction, elle veut sans doute devenir deux.
`,
    },
  },
  {
    slug: "guide-text-data",
    section: "guides",
    icon: "Braces",
    lesson: "string-functions",
    more: ["formatting", "regex", "dates", "json"],
    title: { en: "Text, dates and JSON", fr: "Texte, dates et JSON" },
    lead: {
      en: "The everyday toolbox: search and format text, match patterns, work with dates without surprises, and speak JSON.",
      fr: "La boîte à outils de tous les jours : chercher et formater du texte, reconnaître des motifs, manipuler des dates sans surprise, et parler JSON.",
    },
    body: {
      en: md`
## Searching text

´´´php
str_contains($email, "@");          // PHP 8
str_starts_with($url, "https://");  // PHP 8
strpos($s, "x");                    // position or false
´´´

Before PHP 8, people wrote ´strpos($s, "x") !== false´. The ´!==´ matters: a match at position 0 is falsy.

## Formatting

| Need | Function | Example result |
|---|---|---|
| Template with values | ´sprintf("%s: %.2f", "Total", 9.5)´ | ´Total: 9.50´ |
| Thousands separators | ´number_format(1234567.891, 2)´ | ´1,234,567.89´ |
| French style | ´number_format(1234.5, 2, ",", " ")´ | ´1 234,50´ |
| Zero padding | ´str_pad("7", 3, "0", STR_PAD_LEFT)´ | ´007´ |
| Capitalise words | ´ucwords("hello world")´ | ´Hello World´ |

Common ´sprintf´ placeholders: ´%s´ string, ´%d´ integer, ´%.2f´ float with 2 decimals, ´%05d´ padded with zeros, ´%-10s´ left-aligned in 10 characters.

## Regular expressions

PHP uses PCRE patterns written between delimiters, usually slashes:

´´´php
if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $m)) {
    [$all, $year, $month, $day] = $m;
}
$clean = preg_replace('/\s+/', ' ', $text);
´´´

Write patterns in **single quotes** so backslashes reach PCRE untouched. Add the ´u´ flag for UTF-8 text and ´i´ to ignore case. For a fixed string, ´str_contains´ or ´str_replace´ is simpler and faster than a regex.

## Dates

Use ´DateTimeImmutable´: every change returns a new object, so a date passed to a function can't be modified behind your back.

´´´php
$start = new DateTimeImmutable("2024-01-31");
$next  = $start->modify("+1 month");      // 2024-03-02 (no Feb 31st!)
echo $next->format("Y-m-d");
echo $start->diff($next)->days;           // 31
´´´

| Format | Gives |
|---|---|
| ´Y-m-d´ | 2024-03-15 |
| ´d/m/Y H:i´ | 15/03/2024 14:30 |
| ´l jS F Y´ | Friday 15th March 2024 |
| ´D, d M Y´ | Fri, 15 Mar 2024 |

> Warning: Adding months to the 31st overflows into the next month. When you need "the end of next month", use ´modify("last day of next month")´.

Time zones matter: this app runs in UTC. Pass ´new DateTimeZone("Europe/Paris")´ when a date belongs to a place.

## JSON

´´´php
$json = json_encode(["name" => "Ada", "langs" => ["php"]], JSON_PRETTY_PRINT);
$data = json_decode($json, true);                  // associative array
$data = json_decode($json, flags: JSON_THROW_ON_ERROR); // objects, throws on errors
´´´

Without ´JSON_THROW_ON_ERROR´, broken JSON just returns ´null´ and you must check ´json_last_error_msg()´. PHP 8.3 adds ´json_validate()´ to check a string without decoding it.
`,
      fr: md`
## Chercher dans du texte

´´´php
str_contains($email, "@");          // PHP 8
str_starts_with($url, "https://");  // PHP 8
strpos($s, "x");                    // position ou false
´´´

Avant PHP 8, on écrivait ´strpos($s, "x") !== false´. Le ´!==´ compte : une occurrence en position 0 vaut faux.

## Formater

| Besoin | Fonction | Résultat |
|---|---|---|
| Modèle avec des valeurs | ´sprintf("%s: %.2f", "Total", 9.5)´ | ´Total: 9.50´ |
| Séparateurs de milliers | ´number_format(1234567.891, 2)´ | ´1,234,567.89´ |
| Style français | ´number_format(1234.5, 2, ",", " ")´ | ´1 234,50´ |
| Compléter avec des zéros | ´str_pad("7", 3, "0", STR_PAD_LEFT)´ | ´007´ |
| Majuscule à chaque mot | ´ucwords("hello world")´ | ´Hello World´ |

Les marqueurs ´sprintf´ courants : ´%s´ chaîne, ´%d´ entier, ´%.2f´ décimal à 2 chiffres, ´%05d´ complété par des zéros, ´%-10s´ aligné à gauche sur 10 caractères.

## Les expressions régulières

PHP utilise des motifs PCRE écrits entre délimiteurs, en général des barres obliques :

´´´php
if (preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $date, $m)) {
    [$all, $year, $month, $day] = $m;
}
$clean = preg_replace('/\s+/', ' ', $text);
´´´

Écris les motifs entre **guillemets simples** pour que les antislashs arrivent intacts à PCRE. Ajoute l'option ´u´ pour le texte UTF-8 et ´i´ pour ignorer la casse. Pour une chaîne fixe, ´str_contains´ ou ´str_replace´ est plus simple et plus rapide qu'une regex.

## Les dates

Utilise ´DateTimeImmutable´ : chaque modification renvoie un nouvel objet, donc une date passée à une fonction ne peut pas être changée dans ton dos.

´´´php
$start = new DateTimeImmutable("2024-01-31");
$next  = $start->modify("+1 month");      // 2024-03-02 (pas de 31 février !)
echo $next->format("Y-m-d");
echo $start->diff($next)->days;           // 31
´´´

| Format | Donne |
|---|---|
| ´Y-m-d´ | 2024-03-15 |
| ´d/m/Y H:i´ | 15/03/2024 14:30 |
| ´l jS F Y´ | Friday 15th March 2024 |
| ´D, d M Y´ | Fri, 15 Mar 2024 |

> Attention : ajouter des mois à un 31 déborde sur le mois suivant. Pour « la fin du mois prochain », utilise ´modify("last day of next month")´.

Les fuseaux horaires comptent : cette appli tourne en UTC. Passe ´new DateTimeZone("Europe/Paris")´ quand une date appartient à un lieu.

## JSON

´´´php
$json = json_encode(["name" => "Ada", "langs" => ["php"]], JSON_PRETTY_PRINT);
$data = json_decode($json, true);                  // tableau associatif
$data = json_decode($json, flags: JSON_THROW_ON_ERROR); // objets, exception en cas d'erreur
´´´

Sans ´JSON_THROW_ON_ERROR´, un JSON cassé renvoie simplement ´null´ et tu dois vérifier ´json_last_error_msg()´. PHP 8.3 ajoute ´json_validate()´ pour vérifier une chaîne sans la décoder.
`,
    },
  },
  {
    slug: "guide-oop",
    section: "guides",
    icon: "Boxes",
    lesson: "classes-objects",
    more: ["constructors", "encapsulation", "inheritance", "interfaces-traits", "static-constants", "enums", "immutability", "magic-methods", "boss-bank"],
    title: { en: "Objects and classes", fr: "Objets et classes" },
    lead: {
      en: "Bundle data with the code that works on it. From your first class to interfaces, enums and readonly value objects.",
      fr: "Regroupe des données avec le code qui les manipule. De ta première classe aux interfaces, enums et objets-valeurs readonly.",
    },
    body: {
      en: md`
## Class and object

A **class** is a blueprint; an **object** is one thing built from it with ´new´.

´´´php
final class Product
{
    public function __construct(
        private string $name,
        private int $priceCents,
    ) {}

    public function label(): string
    {
        return sprintf("%s (%.2f €)", $this->name, $this->priceCents / 100);
    }
}

$book = new Product("PHP Book", 2990);
echo $book->label();
´´´

´$this´ is the current object. ´->´ reaches properties and methods. The constructor above uses **promotion** (PHP 8): the parameters become properties in one go.

## Visibility

| Keyword | Who can use it |
|---|---|
| ´public´ | Everyone |
| ´protected´ | The class and its children |
| ´private´ | The class only |

Keep properties private and expose behaviour through methods: the class can then guarantee its own rules (a price can't be negative, a balance can't go below zero). That's **encapsulation**.

PHP 8.4 adds asymmetric visibility (´public private(set) int $count´: readable everywhere, writable inside) and **property hooks** that run code when a property is read or written.

## Inheritance

´´´php
abstract class Shape
{
    abstract public function area(): float;
}

final class Circle extends Shape
{
    public function __construct(private float $r) {}
    public function area(): float { return M_PI * $this->r ** 2; }
}
´´´

A child gets the parent's public and protected members, can override methods and call ´parent::method()´. An ´abstract´ class can't be instantiated; ´final´ forbids extending. Mark overriding methods with ´#[\Override]´ (8.3) to catch typos.

## Interfaces and traits

- An **interface** is a contract: method signatures only. A class can implement many. Type your parameters with interfaces (´function total(Shape ...$shapes)´) so any implementation fits.
- A **trait** is a bundle of methods copied into classes with ´use´. Handy for small shared helpers.

## Static members and constants

´self::MAX´, ´static::create()´, ´Product::count()´: they belong to the class, not to one object. Use them for constants and factory methods; avoid storing changing state in static properties.

## Enums (8.1)

´´´php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
$s = Status::from('draft');
´´´

An enum replaces magic strings: the type system now knows every possible value.

## Immutability

´readonly´ properties (8.1) and classes (8.2) can only be set once, in the constructor. To "change" a value object, return a modified copy (PHP 8.5: ´clone($this, ['amount' => $new])´).

## Magic methods

´__construct´, ´__toString´ (used by ´echo $obj´), ´__get´/´__set´ (missing properties), ´__call´ (missing methods), ´__invoke´ (call the object like a function). Use them sparingly: they hide what the code really does.

> Tip: Start every class ´final´ with private properties. Open it up only when you have a real reason.
`,
      fr: md`
## Classe et objet

Une **classe** est un plan ; un **objet** est une chose construite à partir de ce plan avec ´new´.

´´´php
final class Product
{
    public function __construct(
        private string $name,
        private int $priceCents,
    ) {}

    public function label(): string
    {
        return sprintf("%s (%.2f €)", $this->name, $this->priceCents / 100);
    }
}

$book = new Product("PHP Book", 2990);
echo $book->label();
´´´

´$this´ est l'objet courant. ´->´ accède aux propriétés et aux méthodes. Le constructeur ci-dessus utilise la **promotion** (PHP 8) : les paramètres deviennent des propriétés d'un seul coup.

## La visibilité

| Mot-clé | Qui peut l'utiliser |
|---|---|
| ´public´ | Tout le monde |
| ´protected´ | La classe et ses enfants |
| ´private´ | La classe seulement |

Garde les propriétés privées et expose un comportement par des méthodes : la classe peut alors garantir ses propres règles (un prix ne peut pas être négatif, un solde ne peut pas passer sous zéro). C'est l'**encapsulation**.

PHP 8.4 ajoute la visibilité asymétrique (´public private(set) int $count´ : lisible partout, modifiable à l'intérieur) et les **hooks de propriétés**, qui exécutent du code quand une propriété est lue ou écrite.

## L'héritage

´´´php
abstract class Shape
{
    abstract public function area(): float;
}

final class Circle extends Shape
{
    public function __construct(private float $r) {}
    public function area(): float { return M_PI * $this->r ** 2; }
}
´´´

Un enfant reçoit les membres publics et protégés du parent, peut redéfinir des méthodes et appeler ´parent::method()´. Une classe ´abstract´ ne peut pas être instanciée ; ´final´ interdit l'héritage. Marque les méthodes redéfinies avec ´#[\Override]´ (8.3) pour attraper les fautes de frappe.

## Interfaces et traits

- Une **interface** est un contrat : seulement des signatures de méthodes. Une classe peut en implémenter plusieurs. Type tes paramètres avec des interfaces (´function total(Shape ...$shapes)´) pour que toute implémentation convienne.
- Un **trait** est un paquet de méthodes copié dans des classes avec ´use´. Pratique pour de petites aides partagées.

## Membres statiques et constantes

´self::MAX´, ´static::create()´, ´Product::count()´ : ils appartiennent à la classe, pas à un objet. Utilise-les pour des constantes et des méthodes de fabrique ; évite d'y stocker un état qui change.

## Les enums (8.1)

´´´php
enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';

    public function label(): string
    {
        return ucfirst($this->value);
    }
}
$s = Status::from('draft');
´´´

Une enum remplace les chaînes magiques : le système de types connaît désormais chaque valeur possible.

## L'immutabilité

Les propriétés ´readonly´ (8.1) et les classes ´readonly´ (8.2) ne s'affectent qu'une fois, dans le constructeur. Pour « changer » un objet-valeur, renvoie une copie modifiée (PHP 8.5 : ´clone($this, ['amount' => $new])´).

## Les méthodes magiques

´__construct´, ´__toString´ (utilisée par ´echo $obj´), ´__get´/´__set´ (propriétés absentes), ´__call´ (méthodes absentes), ´__invoke´ (appeler l'objet comme une fonction). Utilise-les avec modération : elles cachent ce que le code fait vraiment.

> Astuce : commence chaque classe en ´final´ avec des propriétés privées. Ouvre-la seulement quand tu as une vraie raison.
`,
    },
  },
  {
    slug: "guide-errors",
    section: "guides",
    icon: "TriangleAlert",
    lesson: "warnings-notices",
    more: ["exceptions", "custom-exceptions", "null-safety", "strict-types", "boss-debug"],
    title: { en: "Errors and exceptions", fr: "Erreurs et exceptions" },
    lead: {
      en: "Warnings, fatal errors and exceptions: what each one means, how to read them, and how to handle failure on purpose.",
      fr: "Avertissements, erreurs fatales et exceptions : ce que chacun veut dire, comment les lire, et comment gérer l'échec volontairement.",
    },
    body: {
      en: md`
## Three families of problems

| Kind | Example | What happens |
|---|---|---|
| Parse error | ´syntax error, unexpected token "echo"´ | Nothing runs: PHP can't read the file |
| Warning, notice, deprecation | ´Undefined array key "id"´ | The script continues, with a probably wrong value |
| Error / exception | ´Call to a member function save() on null´ | The script stops, unless something catches it |

Since PHP 7, most fatal errors are thrown as ´Error´ objects, and PHP 8 turned many old warnings into exceptions (for example ´TypeError´ when an internal function gets the wrong type).

## Reading a message

´´´text
TypeError: total(): Argument #1 ($items) must be of type array, null given,
called in index.php on line 12 and defined in index.php:3
´´´

1. The **kind** (´TypeError´) tells you the category.
2. The **message** says what was wrong, often with both the expected and the actual type.
3. The **location** points at the line. "Called in … line 12" is where the bad value came from.

## Exceptions on purpose

´´´php
function withdraw(int $balance, int $amount): int
{
    if ($amount > $balance) {
        throw new DomainException("Insufficient funds");
    }
    return $balance - $amount;
}

try {
    $balance = withdraw(50, 80);
} catch (DomainException $e) {
    echo "Sorry: " . $e->getMessage();
} finally {
    echo "\nDone.";
}
´´´

- ´throw´ stops the function immediately and climbs up the call stack until a matching ´catch´.
- ´catch´ can list several types: ´catch (A | B $e)´ written with a pipe between them (7.1).
- ´finally´ runs whether or not something was thrown.
- Uncaught, an exception ends the script with ´PHP Fatal error: Uncaught …´ and a stack trace.

## The hierarchy

´Throwable´ is the root. Under it, ´Error´ (problems in the engine: ´TypeError´, ´ValueError´, ´ArgumentCountError´, ´DivisionByZeroError´, ´UnhandledMatchError´…) and ´Exception´ (for your code: ´RuntimeException´, ´LogicException´, ´InvalidArgumentException´, ´JsonException´…).

Create your own by extending one: ´class OrderNotFound extends RuntimeException {}´. A specific class lets callers catch exactly the failure they can handle.

## Handling null

Many errors start with an unexpected ´null´. Defuse them early:

´´´php
$city = $user?->address?->city ?? "unknown";
´´´

## Strict types

´declare(strict_types=1);´ at the top of a file makes PHP refuse to convert arguments silently. ´add("2", 3)´ then throws a TypeError instead of quietly returning 5, so mistakes surface where they happen.

> Tip: Don't silence problems with ´@´ or an empty ´catch´. A warning you hide today is a bug report tomorrow.
`,
      fr: md`
## Trois familles de problèmes

| Genre | Exemple | Ce qui se passe |
|---|---|---|
| Parse error | ´syntax error, unexpected token "echo"´ | Rien ne s'exécute : PHP ne peut pas lire le fichier |
| Warning, notice, deprecation | ´Undefined array key "id"´ | Le script continue, avec une valeur sans doute fausse |
| Error / exception | ´Call to a member function save() on null´ | Le script s'arrête, sauf si quelque chose l'attrape |

Depuis PHP 7, la plupart des erreurs fatales sont levées comme des objets ´Error´, et PHP 8 a transformé beaucoup d'anciens warnings en exceptions (par exemple ´TypeError´ quand une fonction interne reçoit un mauvais type).

## Lire un message

´´´text
TypeError: total(): Argument #1 ($items) must be of type array, null given,
called in index.php on line 12 and defined in index.php:3
´´´

1. Le **genre** (´TypeError´) donne la catégorie.
2. Le **message** dit ce qui n'allait pas, souvent avec le type attendu et le type reçu.
3. L'**emplacement** indique la ligne. « Called in … line 12 » est l'endroit d'où vient la mauvaise valeur.

## Les exceptions volontaires

´´´php
function withdraw(int $balance, int $amount): int
{
    if ($amount > $balance) {
        throw new DomainException("Insufficient funds");
    }
    return $balance - $amount;
}

try {
    $balance = withdraw(50, 80);
} catch (DomainException $e) {
    echo "Sorry: " . $e->getMessage();
} finally {
    echo "\nDone.";
}
´´´

- ´throw´ arrête la fonction immédiatement et remonte la pile d'appels jusqu'à un ´catch´ correspondant.
- ´catch´ peut lister plusieurs types : ´catch (A | B $e)´ avec un pipe entre eux (7.1).
- ´finally´ s'exécute qu'il y ait eu une exception ou non.
- Non attrapée, une exception termine le script avec ´PHP Fatal error: Uncaught …´ et une stack trace.

## La hiérarchie

´Throwable´ est la racine. En dessous, ´Error´ (problèmes du moteur : ´TypeError´, ´ValueError´, ´ArgumentCountError´, ´DivisionByZeroError´, ´UnhandledMatchError´…) et ´Exception´ (pour ton code : ´RuntimeException´, ´LogicException´, ´InvalidArgumentException´, ´JsonException´…).

Crée les tiennes en étendant l'une d'elles : ´class OrderNotFound extends RuntimeException {}´. Une classe précise permet à l'appelant d'attraper exactement l'échec qu'il sait gérer.

## Gérer null

Beaucoup d'erreurs commencent par un ´null´ inattendu. Désamorce-les tôt :

´´´php
$city = $user?->address?->city ?? "unknown";
´´´

## Les types stricts

´declare(strict_types=1);´ en haut d'un fichier fait refuser à PHP les conversions silencieuses d'arguments. ´add("2", 3)´ lève alors une TypeError au lieu de renvoyer 5 sans rien dire : les erreurs apparaissent là où elles se produisent.

> Astuce : ne fais pas taire les problèmes avec ´@´ ou un ´catch´ vide. Un avertissement caché aujourd'hui est un rapport de bug demain.
`,
    },
  },
];
