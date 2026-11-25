import type { DocPage } from "../types";
import { md } from "./md";

/** Printable one-page summaries. Table cells never contain a pipe character (it splits cells). */
export const CHEAT_PAGES: DocPage[] = [
  {
    slug: "cheat-syntax",
    section: "cheats",
    icon: "Code",
    printable: true,
    lesson: "hello-php",
    title: { en: "PHP syntax on one page", fr: "La syntaxe PHP sur une page" },
    lead: { en: "Everything you type every day, from echo to classes.", fr: "Tout ce que tu tapes tous les jours, d'echo aux classes." },
    body: {
      en: md`
## Basics

| Syntax | Meaning |
|---|---|
| ´<?php´ | Start of PHP code |
| ´echo "Hi\n";´ | Print, then a new line |
| ´// note´ ´# note´ ´/* note */´ | Comments |
| ´$x = 5;´ | Assign a variable |
| ´const MAX = 10;´ | Constant |
| ´var_dump($x);´ | Show type and value |

## Operators

| Syntax | Meaning |
|---|---|
| ´+ - * / % **´ | Maths (´%´ remainder, ´**´ power) |
| ´.´ ´.=´ | Join strings, append |
| ´=== !== == !=´ | Compare (prefer the strict ´===´) |
| ´< > <= >= <=>´ | Order, spaceship |
| ´&& ! and or xor´ | Logic (or is two pipe characters) |
| ´??´ ´??=´ | Fallback if null, assign if null |
| ´?->´ | Nullsafe call (8.0) |
| ´$a ? $b : $c´ | Ternary |

## Strings

| Syntax | Meaning |
|---|---|
| ´"Hi $name"´ | Interpolation |
| ´"{$user['name']}"´ | Braces for arrays and properties |
| ´'raw $text'´ | No interpolation |
| ´<<<TXT ... TXT;´ | Heredoc |

## Arrays

| Syntax | Meaning |
|---|---|
| ´[1, 2, 3]´ | List |
| ´['a' => 1]´ | Associative |
| ´$a[] = 4;´ | Append |
| ´[$x, $y] = $pair;´ | Destructure |
| ´[...$a, ...$b]´ | Spread |

## Control flow

´´´php
if ($a > 0) { } elseif ($a < 0) { } else { }
$t = match ($code) { 200 => "OK", default => "Error" };
for ($i = 0; $i < 10; $i++) { }
foreach ($items as $key => $value) { }
while ($running) { }
´´´

## Functions

´´´php
function add(int $a, int $b = 0): int { return $a + $b; }
add(b: 2, a: 1);                 // named arguments
$double = fn($x) => $x * 2;      // arrow function
$len = strlen(...);              // first-class callable
´´´

## Classes

´´´php
final class User extends Person implements JsonSerializable
{
    use HasTimestamps;
    public const ROLE = 'user';

    public function __construct(private readonly string $name) {}

    public function name(): string { return $this->name; }
    public static function guest(): static { return new static('guest'); }
}
´´´

## Errors

´´´php
try { risky(); }
catch (InvalidArgumentException $e) { echo $e->getMessage(); }
finally { cleanup(); }
throw new RuntimeException("Oops");
´´´
`,
      fr: md`
## Bases

| Syntaxe | Signification |
|---|---|
| ´<?php´ | Début du code PHP |
| ´echo "Hi\n";´ | Afficher, puis retour à la ligne |
| ´// note´ ´# note´ ´/* note */´ | Commentaires |
| ´$x = 5;´ | Affecter une variable |
| ´const MAX = 10;´ | Constante |
| ´var_dump($x);´ | Montrer type et valeur |

## Opérateurs

| Syntaxe | Signification |
|---|---|
| ´+ - * / % **´ | Calculs (´%´ reste, ´**´ puissance) |
| ´.´ ´.=´ | Coller des chaînes, ajouter |
| ´=== !== == !=´ | Comparer (préfère le strict ´===´) |
| ´< > <= >= <=>´ | Ordre, vaisseau spatial |
| ´&& ! and or xor´ | Logique (ou s'écrit avec deux pipes) |
| ´??´ ´??=´ | Repli si null, affecter si null |
| ´?->´ | Appel nullsafe (8.0) |
| ´$a ? $b : $c´ | Ternaire |

## Chaînes

| Syntaxe | Signification |
|---|---|
| ´"Hi $name"´ | Interpolation |
| ´"{$user['name']}"´ | Accolades pour tableaux et propriétés |
| ´'raw $text'´ | Pas d'interpolation |
| ´<<<TXT ... TXT;´ | Heredoc |

## Tableaux

| Syntaxe | Signification |
|---|---|
| ´[1, 2, 3]´ | Liste |
| ´['a' => 1]´ | Associatif |
| ´$a[] = 4;´ | Ajouter à la fin |
| ´[$x, $y] = $pair;´ | Déstructurer |
| ´[...$a, ...$b]´ | Étaler |

## Contrôle

´´´php
if ($a > 0) { } elseif ($a < 0) { } else { }
$t = match ($code) { 200 => "OK", default => "Error" };
for ($i = 0; $i < 10; $i++) { }
foreach ($items as $key => $value) { }
while ($running) { }
´´´

## Fonctions

´´´php
function add(int $a, int $b = 0): int { return $a + $b; }
add(b: 2, a: 1);                 // arguments nommés
$double = fn($x) => $x * 2;      // fonction fléchée
$len = strlen(...);              // callable de première classe
´´´

## Classes

´´´php
final class User extends Person implements JsonSerializable
{
    use HasTimestamps;
    public const ROLE = 'user';

    public function __construct(private readonly string $name) {}

    public function name(): string { return $this->name; }
    public static function guest(): static { return new static('guest'); }
}
´´´

## Erreurs

´´´php
try { risky(); }
catch (InvalidArgumentException $e) { echo $e->getMessage(); }
finally { cleanup(); }
throw new RuntimeException("Oops");
´´´
`,
    },
  },
  {
    slug: "cheat-functions",
    section: "cheats",
    icon: "SquareFunction",
    printable: true,
    lesson: "string-functions",
    title: { en: "The 60 most useful functions", fr: "Les 60 fonctions les plus utiles" },
    lead: { en: "Built-in functions you'll reach for every week, grouped by job.", fr: "Les fonctions intégrées que tu utiliseras chaque semaine, rangées par usage." },
    body: {
      en: md`
## Strings

| Function | Does |
|---|---|
| ´strlen($s)´ | Length in bytes |
| ´mb_strlen($s)´ | Length in characters |
| ´str_contains($s, $part)´ | Contains? (8.0) |
| ´str_starts_with()´ / ´str_ends_with()´ | Starts / ends with? (8.0) |
| ´strpos($s, $part)´ | Position, or false |
| ´substr($s, $start, $len)´ | Part of a string |
| ´str_replace($from, $to, $s)´ | Replace |
| ´trim($s)´ | Strip spaces at both ends |
| ´strtolower()´ / ´strtoupper()´ | Change case |
| ´ucfirst()´ / ´ucwords()´ | Capitalise first letter / each word |
| ´explode($sep, $s)´ | String → array |
| ´implode($sep, $a)´ | Array → string |
| ´sprintf($format, ...)´ | Build text from a template |
| ´str_pad($s, $len, $pad)´ | Pad to a length |
| ´str_repeat($s, $n)´ | Repeat |
| ´number_format($n, 2)´ | 1,234.50 |
| ´htmlspecialchars($s)´ | Escape for HTML |

## Arrays

| Function | Does |
|---|---|
| ´count($a)´ | Number of items |
| ´in_array($v, $a, true)´ | Value present? |
| ´array_key_exists($k, $a)´ | Key present? |
| ´array_keys($a)´ / ´array_values($a)´ | Keys / values |
| ´array_map($fn, $a)´ | Transform each value |
| ´array_filter($a, $fn)´ | Keep matching values |
| ´array_reduce($a, $fn, $init)´ | Fold into one value |
| ´array_sum($a)´ | Total |
| ´array_merge($a, $b)´ | Merge |
| ´array_slice($a, $offset, $len)´ | Part of an array |
| ´array_search($v, $a)´ | Key of a value |
| ´array_unique($a)´ | Remove duplicates |
| ´array_column($rows, $col)´ | One field from each row |
| ´array_combine($keys, $values)´ | Build a map |
| ´sort()´ / ´usort()´ / ´ksort()´ | Sort by value / callback / key |
| ´range($from, $to)´ | List of numbers |
| ´array_find($a, $fn)´ | First match (8.4) |

## Maths

| Function | Does |
|---|---|
| ´round($x, 2)´ | Round to 2 decimals |
| ´floor()´ / ´ceil()´ | Round down / up |
| ´intdiv($a, $b)´ | Whole-number division |
| ´abs($x)´ | Absolute value |
| ´max()´ / ´min()´ | Largest / smallest |
| ´random_int($min, $max)´ | Secure random integer |
| ´sqrt($x)´ / ´pow($x, $y)´ | Square root / power |

## Types

| Function | Does |
|---|---|
| ´var_dump($x)´ | Debug output with types |
| ´print_r($x)´ | Readable output |
| ´isset($x)´ / ´empty($x)´ | Set and not null / missing or falsy |
| ´is_int()´ / ´is_string()´ / ´is_array()´ | Type checks |
| ´intval()´ / ´floatval()´ | Convert to number |
| ´get_debug_type($x)´ | Type name (8.0) |

## Data, dates and more

| Function | Does |
|---|---|
| ´json_encode($x)´ / ´json_decode($j, true)´ | To and from JSON |
| ´date('Y-m-d')´ | Today, formatted |
| ´new DateTimeImmutable($s)´ | A date object |
| ´preg_match($re, $s, $m)´ | Regex match |
| ´preg_replace($re, $to, $s)´ | Regex replace |
| ´filter_var($v, FILTER_VALIDATE_EMAIL)´ | Validate input |
| ´password_hash()´ / ´password_verify()´ | Store and check passwords |
| ´file_get_contents($path)´ | Read a whole file |
| ´file_put_contents($path, $data)´ | Write a file |
`,
      fr: md`
## Chaînes

| Fonction | Fait |
|---|---|
| ´strlen($s)´ | Longueur en octets |
| ´mb_strlen($s)´ | Longueur en caractères |
| ´str_contains($s, $part)´ | Contient ? (8.0) |
| ´str_starts_with()´ / ´str_ends_with()´ | Commence / finit par ? (8.0) |
| ´strpos($s, $part)´ | Position, ou false |
| ´substr($s, $start, $len)´ | Une partie de la chaîne |
| ´str_replace($from, $to, $s)´ | Remplacer |
| ´trim($s)´ | Retirer les espaces aux deux bouts |
| ´strtolower()´ / ´strtoupper()´ | Changer la casse |
| ´ucfirst()´ / ´ucwords()´ | Majuscule à la première lettre / à chaque mot |
| ´explode($sep, $s)´ | Chaîne → tableau |
| ´implode($sep, $a)´ | Tableau → chaîne |
| ´sprintf($format, ...)´ | Construire un texte à partir d'un modèle |
| ´str_pad($s, $len, $pad)´ | Compléter jusqu'à une longueur |
| ´str_repeat($s, $n)´ | Répéter |
| ´number_format($n, 2)´ | 1,234.50 |
| ´htmlspecialchars($s)´ | Échapper pour le HTML |

## Tableaux

| Fonction | Fait |
|---|---|
| ´count($a)´ | Nombre d'éléments |
| ´in_array($v, $a, true)´ | Valeur présente ? |
| ´array_key_exists($k, $a)´ | Clé présente ? |
| ´array_keys($a)´ / ´array_values($a)´ | Clés / valeurs |
| ´array_map($fn, $a)´ | Transformer chaque valeur |
| ´array_filter($a, $fn)´ | Garder les valeurs qui passent |
| ´array_reduce($a, $fn, $init)´ | Réduire à une seule valeur |
| ´array_sum($a)´ | Total |
| ´array_merge($a, $b)´ | Fusionner |
| ´array_slice($a, $offset, $len)´ | Une partie du tableau |
| ´array_search($v, $a)´ | Clé d'une valeur |
| ´array_unique($a)´ | Retirer les doublons |
| ´array_column($rows, $col)´ | Un champ de chaque ligne |
| ´array_combine($keys, $values)´ | Construire un dictionnaire |
| ´sort()´ / ´usort()´ / ´ksort()´ | Trier par valeur / callback / clé |
| ´range($from, $to)´ | Liste de nombres |
| ´array_find($a, $fn)´ | Première correspondance (8.4) |

## Maths

| Fonction | Fait |
|---|---|
| ´round($x, 2)´ | Arrondir à 2 décimales |
| ´floor()´ / ´ceil()´ | Arrondir en dessous / au-dessus |
| ´intdiv($a, $b)´ | Division entière |
| ´abs($x)´ | Valeur absolue |
| ´max()´ / ´min()´ | Plus grand / plus petit |
| ´random_int($min, $max)´ | Entier aléatoire sûr |
| ´sqrt($x)´ / ´pow($x, $y)´ | Racine carrée / puissance |

## Types

| Fonction | Fait |
|---|---|
| ´var_dump($x)´ | Affichage de débogage avec les types |
| ´print_r($x)´ | Affichage lisible |
| ´isset($x)´ / ´empty($x)´ | Défini et non null / absent ou faux |
| ´is_int()´ / ´is_string()´ / ´is_array()´ | Tests de type |
| ´intval()´ / ´floatval()´ | Convertir en nombre |
| ´get_debug_type($x)´ | Nom du type (8.0) |

## Données, dates et plus

| Fonction | Fait |
|---|---|
| ´json_encode($x)´ / ´json_decode($j, true)´ | Vers et depuis JSON |
| ´date('Y-m-d')´ | Aujourd'hui, formaté |
| ´new DateTimeImmutable($s)´ | Un objet date |
| ´preg_match($re, $s, $m)´ | Correspondance regex |
| ´preg_replace($re, $to, $s)´ | Remplacement regex |
| ´filter_var($v, FILTER_VALIDATE_EMAIL)´ | Valider une saisie |
| ´password_hash()´ / ´password_verify()´ | Stocker et vérifier des mots de passe |
| ´file_get_contents($path)´ | Lire un fichier entier |
| ´file_put_contents($path, $data)´ | Écrire un fichier |
`,
    },
  },
  {
    slug: "cheat-oop",
    section: "cheats",
    icon: "Boxes",
    printable: true,
    lesson: "classes-objects",
    title: { en: "OOP at a glance", fr: "La POO en un coup d'œil" },
    lead: { en: "Classes, inheritance, interfaces, traits, enums and immutability on one page.", fr: "Classes, héritage, interfaces, traits, enums et immutabilité sur une page." },
    body: {
      en: md`
## Keywords

| Keyword | Meaning |
|---|---|
| ´class´ / ´new´ | Blueprint / build an object |
| ´$this´ / ´self´ / ´static´ / ´parent´ | Current object / this class / called class / parent class |
| ´public´ / ´protected´ / ´private´ | Visible to all / family / this class |
| ´extends´ | Inherit from one class |
| ´implements´ | Fulfil one or more interfaces |
| ´abstract´ | Can't be instantiated; children must implement |
| ´final´ | Can't be extended or overridden |
| ´static´ | Belongs to the class, not an object |
| ´readonly´ | Set once (8.1), whole class (8.2) |
| ´interface´ | A contract of methods |
| ´trait´ / ´use´ | Reusable methods copied into a class |
| ´enum´ / ´case´ | A fixed set of values (8.1) |
| ´instanceof´ | Type check |
| ´clone´ | Shallow copy (with new values in 8.5) |

## A complete example

´´´php
interface HasArea { public function area(): float; }

abstract class Shape implements HasArea
{
    public function describe(): string
    {
        return sprintf("%s with area %.1f", static::class, $this->area());
    }
}

final class Rect extends Shape
{
    public function __construct(
        private readonly float $w,
        private readonly float $h,
    ) {}

    public function area(): float { return $this->w * $this->h; }
}

echo (new Rect(2, 3))->describe(); // Rect with area 6.0
´´´

## Magic methods

| Method | Called when |
|---|---|
| ´__construct()´ | ´new´ |
| ´__toString()´ | The object is used as a string |
| ´__get($n)´ / ´__set($n, $v)´ | Reading / writing an inaccessible property |
| ´__call($m, $args)´ | Calling an inaccessible method |
| ´__invoke()´ | The object is called like a function |
| ´__clone()´ | After ´clone´ |

## Enums

´´´php
enum Status: string
{
    case Draft = 'draft';
    case Live = 'live';
    public function label(): string { return ucfirst($this->value); }
}
Status::from('live')->label();   // "Live"
Status::tryFrom('nope');         // null
Status::cases();                 // [Status::Draft, Status::Live]
´´´

## Modern property features

| Feature | Version |
|---|---|
| Typed properties ´public int $n´ | 7.4 |
| Constructor promotion | 8.0 |
| ´readonly´ properties | 8.1 |
| ´readonly class´ | 8.2 |
| Property hooks ´{ get => …; set => …; }´ | 8.4 |
| Asymmetric visibility ´public private(set)´ | 8.4 |
| ´clone($obj, ['prop' => $v])´ | 8.5 |
`,
      fr: md`
## Mots-clés

| Mot-clé | Signification |
|---|---|
| ´class´ / ´new´ | Plan / construire un objet |
| ´$this´ / ´self´ / ´static´ / ´parent´ | Objet courant / cette classe / classe appelée / classe parente |
| ´public´ / ´protected´ / ´private´ | Visible par tous / la famille / cette classe |
| ´extends´ | Hériter d'une classe |
| ´implements´ | Respecter une ou plusieurs interfaces |
| ´abstract´ | Pas instanciable ; les enfants doivent implémenter |
| ´final´ | Pas héritable ni redéfinissable |
| ´static´ | Appartient à la classe, pas à un objet |
| ´readonly´ | Affecté une fois (8.1), toute la classe (8.2) |
| ´interface´ | Un contrat de méthodes |
| ´trait´ / ´use´ | Des méthodes réutilisables copiées dans une classe |
| ´enum´ / ´case´ | Un ensemble fixe de valeurs (8.1) |
| ´instanceof´ | Test de type |
| ´clone´ | Copie superficielle (avec de nouvelles valeurs en 8.5) |

## Un exemple complet

´´´php
interface HasArea { public function area(): float; }

abstract class Shape implements HasArea
{
    public function describe(): string
    {
        return sprintf("%s with area %.1f", static::class, $this->area());
    }
}

final class Rect extends Shape
{
    public function __construct(
        private readonly float $w,
        private readonly float $h,
    ) {}

    public function area(): float { return $this->w * $this->h; }
}

echo (new Rect(2, 3))->describe(); // Rect with area 6.0
´´´

## Méthodes magiques

| Méthode | Appelée quand |
|---|---|
| ´__construct()´ | ´new´ |
| ´__toString()´ | L'objet est utilisé comme une chaîne |
| ´__get($n)´ / ´__set($n, $v)´ | Lecture / écriture d'une propriété inaccessible |
| ´__call($m, $args)´ | Appel d'une méthode inaccessible |
| ´__invoke()´ | L'objet est appelé comme une fonction |
| ´__clone()´ | Après ´clone´ |

## Enums

´´´php
enum Status: string
{
    case Draft = 'draft';
    case Live = 'live';
    public function label(): string { return ucfirst($this->value); }
}
Status::from('live')->label();   // "Live"
Status::tryFrom('nope');         // null
Status::cases();                 // [Status::Draft, Status::Live]
´´´

## Fonctionnalités modernes des propriétés

| Fonctionnalité | Version |
|---|---|
| Propriétés typées ´public int $n´ | 7.4 |
| Promotion de constructeur | 8.0 |
| Propriétés ´readonly´ | 8.1 |
| ´readonly class´ | 8.2 |
| Hooks de propriétés ´{ get => …; set => …; }´ | 8.4 |
| Visibilité asymétrique ´public private(set)´ | 8.4 |
| ´clone($obj, ['prop' => $v])´ | 8.5 |
`,
    },
  },
  {
    slug: "cheat-versions",
    section: "cheats",
    icon: "History",
    printable: true,
    lesson: "php80",
    title: { en: "What each version added", fr: "Ce que chaque version a ajouté" },
    lead: { en: "PHP 7.0 to 8.5 in one table. Versions 7.4 to 8.5 run in this app.", fr: "PHP 7.0 à 8.5 dans un tableau. Les versions 7.4 à 8.5 tournent dans cette appli." },
    body: {
      en: md`
| Version | Year | Added | Example |
|---|---|---|---|
| 7.0 | 2015 | Scalar and return types | ´function f(int $x): string´ |
| 7.0 | 2015 | Null coalescing, spaceship | ´$a ?? 'x'´, ´$a <=> $b´ |
| 7.0 | 2015 | Anonymous classes | ´new class { }´ |
| 7.1 | 2016 | Nullable types, void | ´?int´, ´: void´ |
| 7.1 | 2016 | Short destructuring with keys | ´['id' => $id] = $row;´ |
| 7.1 | 2016 | Multi-catch | ´catch (A ... B $e)´ with a pipe |
| 7.2 | 2017 | object type, Argon2 | ´function f(object $o)´ |
| 7.3 | 2018 | Flexible heredoc, array_key_first | ´array_key_first($a)´ |
| 7.4 | 2019 | Typed properties | ´public int $n = 0;´ |
| 7.4 | 2019 | Arrow functions | ´fn($x) => $x * 2´ |
| 7.4 | 2019 | ??=, spread in arrays, separators | ´$a ??= [];´ ´[...$a]´ ´1_000´ |
| 8.0 | 2020 | match | ´match ($x) { 1 => 'a', default => 'b' }´ |
| 8.0 | 2020 | Named arguments | ´f(name: 'Ada')´ |
| 8.0 | 2020 | Nullsafe operator | ´$u?->address?->city´ |
| 8.0 | 2020 | Constructor promotion | ´__construct(private int $x) {}´ |
| 8.0 | 2020 | Union types, mixed, static | ´int´ or ´string´ joined by a pipe |
| 8.0 | 2020 | Attributes, throw expression | ´#[Route]´, ´?? throw new E()´ |
| 8.0 | 2020 | New string functions | ´str_contains()´ |
| 8.1 | 2021 | Enums | ´enum Suit { case Hearts; }´ |
| 8.1 | 2021 | Readonly properties | ´public readonly int $id;´ |
| 8.1 | 2021 | First-class callables | ´strlen(...)´ |
| 8.1 | 2021 | never, new in initializers | ´: never´, ´$l = new Logger()´ as default |
| 8.2 | 2022 | Readonly classes | ´readonly class Point {}´ |
| 8.2 | 2022 | DNF types, true/false/null types | ´(A&B)´ or null |
| 8.2 | 2022 | Random extension | ´new Random\Randomizer()´ |
| 8.3 | 2023 | Typed class constants | ´const string NAME = 'x';´ |
| 8.3 | 2023 | Override attribute | ´#[\Override]´ |
| 8.3 | 2023 | json_validate | ´json_validate($s)´ |
| 8.4 | 2024 | Property hooks | ´public string $n { set => trim($value); }´ |
| 8.4 | 2024 | Asymmetric visibility | ´public private(set) int $n;´ |
| 8.4 | 2024 | new without parentheses | ´new Foo()->bar()´ |
| 8.4 | 2024 | array_find and friends | ´array_find($a, fn($v) => $v > 1)´ |
| 8.5 | 2025 | Pipe operator | pipe ´$s´ into ´trim(...)´, then the next callable |
| 8.5 | 2025 | Clone with | ´clone($this, ['x' => 1])´ |
| 8.5 | 2025 | array_first, array_last | ´array_first($a)´ |
| 8.5 | 2025 | NoDiscard, URI extension | ´#[\NoDiscard]´, ´Uri\Rfc3986\Uri::parse()´ |
`,
      fr: md`
| Version | Année | Ajout | Exemple |
|---|---|---|---|
| 7.0 | 2015 | Types scalaires et de retour | ´function f(int $x): string´ |
| 7.0 | 2015 | Coalescence nulle, vaisseau spatial | ´$a ?? 'x'´, ´$a <=> $b´ |
| 7.0 | 2015 | Classes anonymes | ´new class { }´ |
| 7.1 | 2016 | Types nullables, void | ´?int´, ´: void´ |
| 7.1 | 2016 | Déstructuration courte avec clés | ´['id' => $id] = $row;´ |
| 7.1 | 2016 | Multi-catch | ´catch (A ... B $e)´ avec un pipe |
| 7.2 | 2017 | Type object, Argon2 | ´function f(object $o)´ |
| 7.3 | 2018 | Heredoc flexible, array_key_first | ´array_key_first($a)´ |
| 7.4 | 2019 | Propriétés typées | ´public int $n = 0;´ |
| 7.4 | 2019 | Fonctions fléchées | ´fn($x) => $x * 2´ |
| 7.4 | 2019 | ??=, spread dans les tableaux, séparateurs | ´$a ??= [];´ ´[...$a]´ ´1_000´ |
| 8.0 | 2020 | match | ´match ($x) { 1 => 'a', default => 'b' }´ |
| 8.0 | 2020 | Arguments nommés | ´f(name: 'Ada')´ |
| 8.0 | 2020 | Opérateur nullsafe | ´$u?->address?->city´ |
| 8.0 | 2020 | Promotion de constructeur | ´__construct(private int $x) {}´ |
| 8.0 | 2020 | Types union, mixed, static | ´int´ ou ´string´ reliés par un pipe |
| 8.0 | 2020 | Attributs, throw en expression | ´#[Route]´, ´?? throw new E()´ |
| 8.0 | 2020 | Nouvelles fonctions de chaînes | ´str_contains()´ |
| 8.1 | 2021 | Enums | ´enum Suit { case Hearts; }´ |
| 8.1 | 2021 | Propriétés readonly | ´public readonly int $id;´ |
| 8.1 | 2021 | Callables de première classe | ´strlen(...)´ |
| 8.1 | 2021 | never, new dans les initialiseurs | ´: never´, ´$l = new Logger()´ par défaut |
| 8.2 | 2022 | Classes readonly | ´readonly class Point {}´ |
| 8.2 | 2022 | Types DNF, types true/false/null | ´(A&B)´ ou null |
| 8.2 | 2022 | Extension Random | ´new Random\Randomizer()´ |
| 8.3 | 2023 | Constantes de classe typées | ´const string NAME = 'x';´ |
| 8.3 | 2023 | Attribut Override | ´#[\Override]´ |
| 8.3 | 2023 | json_validate | ´json_validate($s)´ |
| 8.4 | 2024 | Hooks de propriétés | ´public string $n { set => trim($value); }´ |
| 8.4 | 2024 | Visibilité asymétrique | ´public private(set) int $n;´ |
| 8.4 | 2024 | new sans parenthèses | ´new Foo()->bar()´ |
| 8.4 | 2024 | array_find et compagnie | ´array_find($a, fn($v) => $v > 1)´ |
| 8.5 | 2025 | Opérateur pipe | fait passer ´$s´ dans ´trim(...)´, puis dans le callable suivant |
| 8.5 | 2025 | Clone avec valeurs | ´clone($this, ['x' => 1])´ |
| 8.5 | 2025 | array_first, array_last | ´array_first($a)´ |
| 8.5 | 2025 | NoDiscard, extension URI | ´#[\NoDiscard]´, ´Uri\Rfc3986\Uri::parse()´ |
`,
    },
  },
  {
    slug: "cheat-errors",
    section: "cheats",
    icon: "Bug",
    printable: true,
    lesson: "warnings-notices",
    title: { en: "Error messages decoded", fr: "Les messages d'erreur décodés" },
    lead: { en: "The PHP 8 messages you'll meet most, what they mean, and the usual fix.", fr: "Les messages de PHP 8 que tu croiseras le plus, ce qu'ils veulent dire, et la correction habituelle." },
    body: {
      en: md`
| Message | Means | Usual fix |
|---|---|---|
| ´syntax error, unexpected token "echo"´ | PHP couldn't parse the file | Look for a missing ´;´ or ´)´ at the end of the previous line |
| ´syntax error, unexpected end of file´ | A block was never closed | Count your ´{´ and ´}´ |
| ´Undefined variable $total´ | The variable was never assigned (or misspelled) | Assign it first; check capitals |
| ´Undefined array key "email"´ | Reading a key that doesn't exist | ´$a["email"] ?? null´ or ´isset()´ first |
| ´Undefined array key 3´ | Index past the end of a list | Loop to ´count($a) - 1´, use ´<´ not ´<=´ |
| ´Uninitialized string offset 10´ | Reading past the end of a string | Check ´strlen()´ first |
| ´Call to undefined function nope()´ | No function with that name | Fix the name, add the ´require´, or check the PHP version |
| ´Call to undefined method A::go()´ | The class has no such method | Fix the name or the object's class |
| ´Class "Nope" not found´ | Class not loaded or wrong namespace | Add ´use´, ´require´ or fix the autoloader |
| ´Call to a member function save() on null´ | The variable holds null, not an object | Find why it's null; use ´?->´ or check first |
| ´Attempt to read property "name" on null´ | Same, when reading a property | Same |
| ´f(): Argument #1 ($x) must be of type int, string given´ | TypeError: wrong argument type | Pass the right type or convert it |
| ´f(): Return value must be of type int, string returned´ | The function returned the wrong type | Fix the return statement or the declared type |
| ´Too few arguments to function f(), 1 passed … and exactly 2 expected´ | ArgumentCountError | Pass every required argument |
| ´Unsupported operand types: string + int´ | Maths on a non-numeric string | Convert or validate the input |
| ´A non-numeric value encountered´ | Maths on a partly numeric string like "5 apples" | Clean the input first |
| ´Division by zero´ / ´Modulo by zero´ | DivisionByZeroError | Check the divisor before dividing |
| ´Array to string conversion´ | Echoing an array | Use ´print_r´, ´implode´ or ´json_encode´ |
| ´Unhandled match case 5´ | UnhandledMatchError: no arm matched | Add the case or a ´default´ arm |
| ´Cannot modify readonly property A::$x´ | Writing a readonly property after construction | Create a new object instead |
| ´Cannot access private property A::$p´ | Visibility rules | Add a public method (getter) |
| ´Cannot instantiate abstract class A´ | ´new´ on an abstract class | Instantiate a concrete child class |
| ´Class C contains 1 abstract method and must therefore be declared abstract or implement the remaining method´ | An interface or abstract method isn't implemented | Implement every required method |
| ´foreach() argument must be of type array or object, null given´ | Looping over null | Default to ´[]´: ´foreach ($a ?? [] as …)´ |
| ´Undefined constant "MAX"´ | Constant not defined (or a missing ´$´) | Define it, or add the ´$´ |
| ´Creation of dynamic property D::$x is deprecated´ | Setting an undeclared property (8.2) | Declare the property in the class |
| ´Passing null to parameter #1 ($string) of type string is deprecated´ | null given to an internal function (8.1) | Default to ´""´ with ´??´ |
`,
      fr: md`
| Message | Signifie | Correction habituelle |
|---|---|---|
| ´syntax error, unexpected token "echo"´ | PHP n'a pas pu lire le fichier | Cherche un ´;´ ou une ´)´ manquant à la fin de la ligne d'avant |
| ´syntax error, unexpected end of file´ | Un bloc n'a jamais été fermé | Compte tes ´{´ et ´}´ |
| ´Undefined variable $total´ | La variable n'a jamais été affectée (ou est mal écrite) | Affecte-la d'abord ; vérifie les majuscules |
| ´Undefined array key "email"´ | Lecture d'une clé qui n'existe pas | ´$a["email"] ?? null´ ou ´isset()´ avant |
| ´Undefined array key 3´ | Indice au-delà de la fin d'une liste | Boucle jusqu'à ´count($a) - 1´, utilise ´<´ et pas ´<=´ |
| ´Uninitialized string offset 10´ | Lecture au-delà de la fin d'une chaîne | Vérifie ´strlen()´ avant |
| ´Call to undefined function nope()´ | Aucune fonction de ce nom | Corrige le nom, ajoute le ´require´, ou vérifie la version de PHP |
| ´Call to undefined method A::go()´ | La classe n'a pas cette méthode | Corrige le nom ou la classe de l'objet |
| ´Class "Nope" not found´ | Classe non chargée ou mauvais namespace | Ajoute ´use´, ´require´ ou corrige l'autoloader |
| ´Call to a member function save() on null´ | La variable contient null, pas un objet | Trouve pourquoi elle est null ; utilise ´?->´ ou vérifie avant |
| ´Attempt to read property "name" on null´ | Pareil, en lisant une propriété | Pareil |
| ´f(): Argument #1 ($x) must be of type int, string given´ | TypeError : mauvais type d'argument | Passe le bon type ou convertis-le |
| ´f(): Return value must be of type int, string returned´ | La fonction a renvoyé le mauvais type | Corrige le return ou le type déclaré |
| ´Too few arguments to function f(), 1 passed … and exactly 2 expected´ | ArgumentCountError | Passe tous les arguments obligatoires |
| ´Unsupported operand types: string + int´ | Calcul sur une chaîne non numérique | Convertis ou valide la saisie |
| ´A non-numeric value encountered´ | Calcul sur une chaîne en partie numérique comme « 5 apples » | Nettoie la saisie d'abord |
| ´Division by zero´ / ´Modulo by zero´ | DivisionByZeroError | Vérifie le diviseur avant de diviser |
| ´Array to string conversion´ | Un echo sur un tableau | Utilise ´print_r´, ´implode´ ou ´json_encode´ |
| ´Unhandled match case 5´ | UnhandledMatchError : aucune branche ne correspond | Ajoute le cas ou une branche ´default´ |
| ´Cannot modify readonly property A::$x´ | Écriture d'une propriété readonly après la construction | Crée un nouvel objet à la place |
| ´Cannot access private property A::$p´ | Règles de visibilité | Ajoute une méthode publique (getter) |
| ´Cannot instantiate abstract class A´ | ´new´ sur une classe abstraite | Instancie une classe enfant concrète |
| ´Class C contains 1 abstract method and must therefore be declared abstract or implement the remaining method´ | Une méthode d'interface ou abstraite n'est pas implémentée | Implémente chaque méthode requise |
| ´foreach() argument must be of type array or object, null given´ | Boucle sur null | Valeur par défaut ´[]´ : ´foreach ($a ?? [] as …)´ |
| ´Undefined constant "MAX"´ | Constante non définie (ou ´$´ oublié) | Définis-la, ou ajoute le ´$´ |
| ´Creation of dynamic property D::$x is deprecated´ | Propriété non déclarée affectée (8.2) | Déclare la propriété dans la classe |
| ´Passing null to parameter #1 ($string) of type string is deprecated´ | null passé à une fonction interne (8.1) | Valeur par défaut ´""´ avec ´??´ |
`,
    },
  },
];
