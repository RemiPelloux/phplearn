import { L } from "@/lib/txt";
import type { VersionFeature, VersionInfo } from "./types";

const p = String.raw;

function f(id: string, titleEn: string, titleFr: string, bodyEn: string, bodyFr: string, after: string, extra: Partial<VersionFeature> = {}): VersionFeature {
  return { id, title: L(titleEn, titleFr), body: L(bodyEn, bodyFr), after, ...extra };
}

export const VERSIONS_TIMELINE: VersionInfo[] = [
  {
    version: "7.0",
    released: "2015-12-03",
    headline: L("Twice as fast, and types arrive", "Deux fois plus rapide, et les types arrivent"),
    summary: L(
      "A new engine (PHPNG) roughly doubled performance and halved memory use. PHP 7.0 also brought scalar type declarations, return types, ?? and <=>, and turned most fatal errors into catchable Error exceptions.",
      "Un nouveau moteur (PHPNG) a environ doublé les performances et divisé la mémoire par deux. PHP 7.0 a aussi apporté les types scalaires, les types de retour, ?? et <=>, et transformé la plupart des erreurs fatales en exceptions Error attrapables.",
    ),
    features: [
      f("scalar-types", "Scalar type declarations", "Types scalaires", "Parameters can be typed int, float, string and bool. Add declare(strict_types=1) to refuse conversions.", "Les paramètres peuvent être typés int, float, string et bool. Ajoute declare(strict_types=1) pour refuser les conversions.", p`<?php
function add(int $a, int $b) {
    return $a + $b;
}
var_dump(add(2, "3"));`),
      f("return-types", "Return type declarations", "Types de retour", "Declare what a function returns after a colon.", "Déclare ce qu'une fonction renvoie après deux-points.", p`<?php
function half(int $n): float {
    return $n / 2;
}
var_dump(half(5));`),
      f("null-coalescing", "The ?? operator", "L'opérateur ??", "Use a default when a value is missing or null, without isset().", "Utilise une valeur par défaut quand une valeur manque ou est null, sans isset().", p`<?php
$get = ["user" => "ada"];
echo $get["user"] ?? "guest", " / ", $get["lang"] ?? "en";`, {
        before: p`<?php
$get = ["user" => "ada"];
echo isset($get["lang"]) ? $get["lang"] : "en";`,
      }),
      f("spaceship", "The <=> operator", "L'opérateur <=>", "Compares two values and returns -1, 0 or 1: ideal for sorting.", "Compare deux valeurs et renvoie -1, 0 ou 1 : idéal pour trier.", p`<?php
$n = [3, 1, 2];
usort($n, function ($a, $b) { return $b <=> $a; });
echo implode(",", $n);`),
      f("anonymous-classes", "Anonymous classes", "Classes anonymes", "Create a one-off object from a class with no name.", "Crée un objet ponctuel à partir d'une classe sans nom.", p`<?php
$logger = new class {
    public function log($msg) { echo "[log] $msg\n"; }
};
$logger->log("started");`),
      f("throwable", "Errors become exceptions", "Les erreurs deviennent des exceptions", "Many fatal errors now throw Error objects you can catch, next to Exception, under the Throwable interface.", "Beaucoup d'erreurs fatales lèvent désormais des objets Error attrapables, à côté d'Exception, sous l'interface Throwable.", p`<?php
try {
    undefinedFunction();
} catch (Error $e) {
    echo get_class($e), ": ", $e->getMessage();
}`),
      f("intdiv-random", "intdiv() and random_int()", "intdiv() et random_int()", "Integer division and secure random numbers became built in.", "La division entière et les nombres aléatoires sécurisés sont devenus natifs.", p`<?php
echo intdiv(7, 2), "\n";
$n = random_int(1, 10);
echo $n >= 1 && $n <= 10 ? "random_int ok" : "?";`),
      f("yield-from", "Generator delegation (yield from)", "Délégation de générateur (yield from)", "A generator can yield every value of another generator or array.", "Un générateur peut produire toutes les valeurs d'un autre générateur ou tableau.", p`<?php
function inner() { yield 1; yield 2; }
function outer() { yield 0; yield from inner(); yield 3; }
foreach (outer() as $v) echo $v;`),
    ],
    breaking: [
      f("removed-mysql", "Old extensions removed", "Anciennes extensions supprimées", "mysql_* functions, ereg and ASP-style tags were removed. Use PDO or mysqli.", "Les fonctions mysql_*, ereg et les balises style ASP ont été supprimées. Utilise PDO ou mysqli.", p`<?php
var_dump(function_exists("mysql_connect"));
var_dump(class_exists("PDO"));`),
    ],
    deprecations: [L("PHP 4-style constructors (a method named like its class).", "Les constructeurs style PHP 4 (une méthode du même nom que la classe).")],
  },
  {
    version: "7.1",
    released: "2016-12-01",
    headline: L("Nullable types, void and multi-catch", "Types nullables, void et multi-catch"),
    summary: L(
      "PHP 7.1 rounded out the type system with ?nullable types and void, and made everyday code shorter with [] destructuring, keys in list(), multi-catch and negative string offsets.",
      "PHP 7.1 a complété le système de types avec les types ?nullables et void, et raccourci le code de tous les jours avec la déstructuration [], les clés dans list(), le multi-catch et les offsets négatifs.",
    ),
    features: [
      f("nullable", "Nullable types (?string)", "Types nullables (?string)", "Prefix a type with ? to also allow null.", "Préfixe un type par ? pour autoriser aussi null.", p`<?php
function greet(?string $name): string {
    return "Hello " . ($name ?? "stranger");
}
echo greet(null), " / ", greet("Ada");`),
      f("void", "void return type", "Type de retour void", "Says a function returns nothing.", "Indique qu'une fonction ne renvoie rien.", p`<?php
function logLine(string $msg): void {
    echo "> $msg\n";
}
logLine("saved");`),
      f("destructuring", "[] destructuring and keys", "Déstructuration [] et clés", "Unpack arrays with [] (or list()) and pick values by key.", "Déstructure des tableaux avec [] (ou list()) et choisis des valeurs par clé.", p`<?php
[$a, $b] = [1, 2];
["id" => $id, "name" => $name] = ["id" => 7, "name" => "Ada"];
echo "$a $b $id $name";`, {
        before: p`<?php
list($a, $b) = array(1, 2);
$row = array("id" => 7, "name" => "Ada");
$id = $row["id"];
echo "$a $b $id";`,
      }),
      f("multi-catch", "Catching several exceptions", "Attraper plusieurs exceptions", "One catch block for several types, separated by |.", "Un seul bloc catch pour plusieurs types, séparés par |.", p`<?php
foreach ([new InvalidArgumentException("bad input"), new LengthException("too long")] as $ex) {
    try {
        throw $ex;
    } catch (InvalidArgumentException | LengthException $e) {
        echo get_class($e), ": ", $e->getMessage(), "\n";
    }
}`),
      f("negative-offsets", "Negative string offsets", "Offsets négatifs dans les chaînes", "$s[-1] reads the last character.", "$s[-1] lit le dernier caractère.", p`<?php
$word = "PHP Learn";
echo $word[-1], " ", substr($word, -5);`),
      f("const-visibility", "Class constant visibility", "Visibilité des constantes de classe", "Constants can be private or protected.", "Les constantes peuvent être private ou protected.", p`<?php
class Config {
    private const SECRET = "s3cr3t";
    public const VERSION = "1.0";
    public static function hint() { return strlen(self::SECRET) . " chars"; }
}
echo Config::VERSION, " / ", Config::hint();`),
      f("iterable", "iterable pseudo-type", "Le pseudo-type iterable", "Accepts arrays and Traversable objects (like generators).", "Accepte les tableaux et les objets Traversable (comme les générateurs).", p`<?php
function total(iterable $items): int {
    $sum = 0;
    foreach ($items as $i) $sum += $i;
    return $sum;
}
function gen() { yield 4; yield 5; }
echo total([1, 2, 3]), " ", total(gen());`),
    ],
    breaking: [
      f("too-few-args", "Too few arguments throws", "Trop peu d'arguments lève une erreur", "Calling a user function with missing arguments now throws ArgumentCountError instead of a warning.", "Appeler une fonction avec des arguments manquants lève désormais ArgumentCountError au lieu d'un avertissement.", p`<?php
function pair($a, $b) { return [$a, $b]; }
try {
    pair(1);
} catch (ArgumentCountError $e) {
    echo get_class($e);
}`),
    ],
  },
  {
    version: "7.2",
    released: "2017-11-30",
    headline: L("object type, Sodium and Argon2", "Le type object, Sodium et Argon2"),
    summary: L(
      "PHP 7.2 added the object type and modern cryptography in the core (libsodium, Argon2 password hashing), and started cleaning up old functions like create_function() and each().",
      "PHP 7.2 a ajouté le type object et une cryptographie moderne dans le cœur (libsodium, hachage Argon2), et commencé à nettoyer de vieilles fonctions comme create_function() et each().",
    ),
    features: [
      f("object-type", "The object type", "Le type object", "Accept or return any object.", "Accepte ou renvoie n'importe quel objet.", p`<?php
function describe(object $o): string {
    return get_class($o);
}
echo describe(new ArrayObject()), " ", describe(new stdClass());`),
      f("argon2", "Argon2 password hashing", "Hachage de mot de passe Argon2", "password_hash() can use the Argon2 algorithm when PHP is built with it; PASSWORD_DEFAULT stays bcrypt and is always safe.", "password_hash() peut utiliser l'algorithme Argon2 quand PHP est compilé avec ; PASSWORD_DEFAULT reste bcrypt et est toujours sûr.", p`<?php
$hash = password_hash("correct horse", PASSWORD_DEFAULT);
var_dump(password_verify("correct horse", $hash));
var_dump(password_verify("wrong", $hash));`),
      f("param-widening", "Parameter type widening", "Élargissement des types de paramètres", "A child method may drop a parameter's type (accept more).", "Une méthode enfant peut retirer le type d'un paramètre (accepter plus).", p`<?php
class Base { public function set(array $v) { return "array"; } }
class Loose extends Base { public function set($v) { return gettype($v); } }
echo (new Loose())->set("text");`),
      f("trailing-comma-use", "Trailing comma in grouped use", "Virgule finale dans les use groupés", "use App\\{A, B,}; is allowed.", "use App\\{A, B,}; est autorisé.", p`<?php
namespace App\Models { class User {} class Post {} }
namespace Demo {
    use App\Models\{User, Post,};
    echo User::class, " ", Post::class;
}`),
    ],
    breaking: [
      f("count-warning", "count() on non-countables warns", "count() sur des non-comptables avertit", "count(null) or count(\"text\") started warning in 7.2; since PHP 8.0 it throws a TypeError.", "count(null) ou count(\"text\") ont commencé à avertir en 7.2 ; depuis PHP 8.0, une TypeError est levée.", p`<?php
try {
    echo count("text");
} catch (TypeError $e) {
    echo "TypeError: ", $e->getMessage();
}`, { compare: ["7.4", "8.0"] }),
    ],
    deprecations: [
      L("create_function() (use closures).", "create_function() (utilise des closures)."),
      L("each() (use foreach).", "each() (utilise foreach)."),
      L("__autoload() (use spl_autoload_register()).", "__autoload() (utilise spl_autoload_register())."),
    ],
  },
  {
    version: "7.3",
    released: "2018-12-06",
    headline: L("Flexible heredoc and trailing commas", "Heredoc flexible et virgules finales"),
    summary: L(
      "A comfort release: indentable heredoc, trailing commas in calls, array_key_first()/array_key_last(), is_countable() and JSON_THROW_ON_ERROR.",
      "Une version de confort : heredoc indentable, virgules finales dans les appels, array_key_first()/array_key_last(), is_countable() et JSON_THROW_ON_ERROR.",
    ),
    features: [
      f("flexible-heredoc", "Flexible heredoc", "Heredoc flexible", "The closing marker can be indented; that indentation is removed from every line.", "Le marqueur de fin peut être indenté ; cette indentation est retirée de chaque ligne.", p`<?php
function card($name) {
    return <<<TXT
        Name: $name
        Role: developer
        TXT;
}
echo card("Ada");`),
      f("trailing-comma-calls", "Trailing comma in calls", "Virgule finale dans les appels", "A comma after the last argument makes diffs cleaner.", "Une virgule après le dernier argument rend les diffs plus propres.", p`<?php
echo implode(
    ", ",
    ["a", "b"],
);`),
      f("array-key-first", "array_key_first() / array_key_last()", "array_key_first() / array_key_last()", "Get the first or last key without moving the array pointer.", "Obtiens la première ou dernière clé sans déplacer le pointeur du tableau.", p`<?php
$scores = ["bob" => 3, "ada" => 9, "cy" => 5];
echo array_key_first($scores), " ", array_key_last($scores);`),
      f("is-countable", "is_countable()", "is_countable()", "Checks whether count() can be used on a value.", "Vérifie si count() peut s'utiliser sur une valeur.", p`<?php
foreach ([[1, 2], new ArrayObject([1]), "text"] as $v) {
    echo is_countable($v) ? count($v) : "not countable", "\n";
}`),
      f("json-throw", "JSON_THROW_ON_ERROR", "JSON_THROW_ON_ERROR", "json_decode() and json_encode() can throw JsonException instead of returning null silently.", "json_decode() et json_encode() peuvent lever JsonException au lieu de renvoyer null en silence.", p`<?php
try {
    json_decode("{oops", false, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "JsonException: ", $e->getMessage();
}`),
    ],
    deprecations: [L("Case-insensitive constants (define() with true as third argument).", "Les constantes insensibles à la casse (define() avec true en troisième argument).")],
  },
  {
    version: "7.4",
    released: "2019-11-28",
    headline: L("Typed properties and arrow functions", "Propriétés typées et fonctions fléchées"),
    summary: L(
      "The last big 7.x release: typed class properties, fn() arrow functions, ??=, spread in arrays and 1_000_000 number separators. Its active support ended in 2021 and security support in November 2022.",
      "La dernière grosse version 7.x : propriétés de classe typées, fonctions fléchées fn(), ??=, spread dans les tableaux et séparateurs 1_000_000. Son support actif s'est terminé en 2021 et le support sécurité en novembre 2022.",
    ),
    features: [
      f("typed-properties", "Typed properties", "Propriétés typées", "Class properties can have types, checked on every assignment.", "Les propriétés de classe peuvent avoir un type, vérifié à chaque affectation.", p`<?php
class User {
    public int $id;
    public string $name = "anonymous";
}
$u = new User();
$u->id = "42";
var_dump($u->id);
try {
    $u->id = "forty-two";
} catch (TypeError $e) {
    echo "TypeError";
}`),
      f("arrow-functions", "Arrow functions", "Fonctions fléchées", "fn($x) => expr: short closures that capture outer variables automatically.", "fn($x) => expr : des closures courtes qui capturent les variables extérieures automatiquement.", p`<?php
$factor = 3;
print_r(array_map(fn($n) => $n * $factor, [1, 2, 3]));`, {
        before: p`<?php
$factor = 3;
print_r(array_map(function ($n) use ($factor) { return $n * $factor; }, [1, 2, 3]));`,
      }),
      f("null-coalescing-assign", "The ??= operator", "L'opérateur ??=", "Assign a default only when the value is missing or null.", "Affecte une valeur par défaut seulement si la valeur manque ou est null.", p`<?php
$options = ["color" => "red"];
$options["color"] ??= "blue";
$options["size"] ??= "M";
echo json_encode($options);`),
      f("spread-arrays", "Spread in array expressions", "Spread dans les tableaux", "[...$a, ...$b] merges lists (string keys come in PHP 8.1).", "[...$a, ...$b] fusionne des listes (les clés texte arrivent en PHP 8.1).", p`<?php
$fruits = ["apple", "pear"];
$more = ["kiwi", ...$fruits, "fig"];
echo implode(", ", $more);`),
      f("numeric-separator", "Numeric literal separator", "Séparateur dans les nombres", "Write 1_000_000 for readability.", "Écris 1_000_000 pour la lisibilité.", p`<?php
$budget = 1_250_000;
echo $budget * 2, " ", 0xFF_FF;`),
      f("covariance", "Covariant returns", "Retours covariants", "A child method can return a more specific type than its parent.", "Une méthode enfant peut renvoyer un type plus précis que son parent.", p`<?php
class Animal {}
class Dog extends Animal {}
class Shelter { public function adopt(): Animal { return new Animal(); } }
class DogShelter extends Shelter { public function adopt(): Dog { return new Dog(); } }
echo get_class((new DogShelter())->adopt());`),
    ],
    deprecations: [
      L("Nested ternaries without parentheses (a ? b : c ? d : e).", "Les ternaires imbriqués sans parenthèses (a ? b : c ? d : e)."),
      L("Curly brace offsets: $str{0} (use $str[0]).", "Les offsets avec accolades : $str{0} (utilise $str[0])."),
      L("The real type and (real) cast.", "Le type real et le cast (real)."),
    ],
  },
  {
    version: "8.0",
    released: "2020-11-26",
    headline: L("match, named arguments, attributes and the JIT", "match, arguments nommés, attributs et le JIT"),
    summary: L(
      "A major release that reshaped everyday PHP: match, named arguments, constructor promotion, union types, the nullsafe operator, attributes and a JIT compiler. It also fixed long-standing comparison surprises, which can break old code.",
      "Une version majeure qui a transformé le PHP de tous les jours : match, arguments nommés, promotion du constructeur, types union, opérateur nullsafe, attributs et un compilateur JIT. Elle a aussi corrigé de vieilles surprises de comparaison, ce qui peut casser du vieux code.",
    ),
    features: [
      f("match", "match expression", "L'expression match", "Strict comparison, returns a value, no fall-through, and an error if nothing matches.", "Comparaison stricte, renvoie une valeur, pas de passage au cas suivant, et une erreur si rien ne correspond.", p`<?php
$status = 404;
echo match ($status) {
    200 => "OK",
    404 => "Not Found",
    default => "Other",
};`, {
        before: p`<?php
$status = 404;
switch ($status) {
    case 200: $text = "OK"; break;
    case 404: $text = "Not Found"; break;
    default: $text = "Other";
}
echo $text;`,
        compare: ["7.4", "8.0"],
      }),
      f("named-args", "Named arguments", "Arguments nommés", "Pass arguments by name, in any order, and skip optional ones.", "Passe des arguments par leur nom, dans n'importe quel ordre, et saute les optionnels.", p`<?php
echo str_pad(string: "7", length: 3, pad_type: STR_PAD_LEFT, pad_string: "0"), "\n";
echo htmlspecialchars("<b>", double_encode: false);`, { compare: ["7.4", "8.0"] }),
      f("promotion", "Constructor property promotion", "Promotion des propriétés du constructeur", "Declare and assign properties directly in the constructor signature.", "Déclare et affecte les propriétés directement dans la signature du constructeur.", p`<?php
class Point {
    public function __construct(public int $x = 0, public int $y = 0) {}
}
$p = new Point(3, 4);
echo "$p->x,$p->y";`, {
        before: p`<?php
class Point {
    public $x;
    public $y;
    public function __construct($x = 0, $y = 0) {
        $this->x = $x;
        $this->y = $y;
    }
}
$p = new Point(3, 4);
echo "$p->x,$p->y";`,
        compare: ["7.4", "8.0"],
      }),
      f("union-types", "Union types", "Types union", "A value can be one of several types: int|float.", "Une valeur peut être de plusieurs types : int|float.", p`<?php
function double(int|float $n): int|float { return $n * 2; }
var_dump(double(2), double(1.5));`, { compare: ["7.4", "8.0"] }),
      f("nullsafe", "Nullsafe operator ?->", "Opérateur nullsafe ?->", "Stop a chain of calls at the first null.", "Arrête une chaîne d'appels au premier null.", p`<?php
class Session { public ?object $user = null; }
$s = new Session();
var_dump($s->user?->name);`, { compare: ["7.4", "8.0"] }),
      f("str-contains", "str_contains() & co", "str_contains() et cie", "str_contains, str_starts_with and str_ends_with replace strpos tricks.", "str_contains, str_starts_with et str_ends_with remplacent les astuces avec strpos.", p`<?php
var_dump(str_contains("Hello PHP", "PHP"));`, {
        before: p`<?php
var_dump(strpos("Hello PHP", "PHP") !== false);`,
        compare: ["7.4", "8.0"],
      }),
      f("attributes", "Attributes", "Attributs", "Structured metadata #[...] on classes, methods and parameters, readable with Reflection.", "Des métadonnées structurées #[...] sur les classes, méthodes et paramètres, lisibles par Reflection.", p`<?php
#[Attribute]
class Route { public function __construct(public string $path) {} }
class HomeController {
    #[Route("/home")]
    public function index() {}
}
$m = new ReflectionMethod(HomeController::class, "index");
foreach ($m->getAttributes() as $a) {
    echo $a->getName(), " ", $a->newInstance()->path;
}`, { compare: ["7.4", "8.0"] }),
      f("throw-expression", "throw is an expression", "throw est une expression", "Use throw after ??, ?: or in arrow functions.", "Utilise throw après ??, ?: ou dans une fonction fléchée.", p`<?php
$config = ["db" => "sqlite"];
try {
    $host = $config["host"] ?? throw new RuntimeException("host missing");
} catch (RuntimeException $e) {
    echo $e->getMessage();
}`, { compare: ["7.4", "8.0"] }),
    ],
    breaking: [
      f("string-number-comparison", "Saner string to number comparison", "Comparaison chaîne/nombre plus saine", "0 == \"abc\" was true in PHP 7 (the string became 0). PHP 8 compares as strings when the string isn't numeric.", "0 == \"abc\" valait true en PHP 7 (la chaîne devenait 0). PHP 8 compare en tant que chaînes quand la chaîne n'est pas numérique.", p`<?php
var_dump(0 == "abc");
var_dump("1" == "01");
var_dump(100 == "1e2");
var_dump(null == false);`, { compare: ["7.4", "8.0"] }),
      f("arithmetic-strings", "Arithmetic on non-numeric strings", "Calculs sur des chaînes non numériques", "\"abc\" * 2 gave a warning and 0 in PHP 7; PHP 8 throws a TypeError.", "\"abc\" * 2 donnait un avertissement et 0 en PHP 7 ; PHP 8 lève une TypeError.", p`<?php
try {
    var_dump("abc" * 2);
} catch (TypeError $e) {
    echo "TypeError: ", $e->getMessage();
}`, { compare: ["7.4", "8.0"] }),
      f("undefined-variable", "Louder warnings", "Des avertissements plus forts", "Undefined variables and array keys went from Notice to Warning.", "Les variables et clés indéfinies sont passées de Notice à Warning.", p`<?php
echo $missing ?? "", "|";
$list = [];
echo @$list["x"], "ok";
echo $nope;`, { compare: ["7.4", "8.0"] }),
      f("internal-type-errors", "TypeError from built-in functions", "TypeError depuis les fonctions natives", "Passing a wrong type to a built-in function throws a TypeError instead of a warning and null.", "Passer un mauvais type à une fonction native lève une TypeError au lieu d'un avertissement et de null.", p`<?php
try {
    var_dump(strlen([]));
} catch (TypeError $e) {
    echo "TypeError: ", $e->getMessage();
}`, { compare: ["7.4", "8.0"] }),
    ],
  },
  {
    version: "8.1",
    released: "2021-11-25",
    headline: L("Enums, readonly and fibers", "Enums, readonly et fibers"),
    summary: L(
      "PHP 8.1 added real enumerations, readonly properties, first-class callable syntax, the never type, new in initializers, intersection types and Fibers, the building block for async libraries.",
      "PHP 8.1 a ajouté de vraies énumérations, les propriétés readonly, la syntaxe des callables de première classe, le type never, new dans les initialiseurs, les types intersection et les Fibers, la brique de base des bibliothèques asynchrones.",
    ),
    features: [
      f("enums", "Enumerations", "Énumérations", "A type with a fixed set of cases, optionally backed by a string or int.", "Un type avec un ensemble fixe de cas, éventuellement adossés à une chaîne ou un entier.", p`<?php
enum Status: string {
    case Active = "active";
    case Banned = "banned";
}
$s = Status::from("banned");
echo $s->name, " ", count(Status::cases());`, {
        before: p`<?php
class Status {
    const ACTIVE = "active";
    const BANNED = "banned";
}
echo Status::BANNED;`,
        compare: ["8.0", "8.1"],
      }),
      f("readonly-props", "Readonly properties", "Propriétés readonly", "Set once, then immutable.", "Définies une fois, puis immuables.", p`<?php
class Order {
    public function __construct(public readonly int $id) {}
}
$o = new Order(7);
try { $o->id = 8; } catch (Error $e) { echo $e->getMessage(); }`, { compare: ["8.0", "8.1"] }),
      f("first-class-callable", "First-class callable syntax", "Syntaxe des callables de première classe", "strlen(...) creates a Closure from any function or method.", "strlen(...) crée une Closure à partir de n'importe quelle fonction ou méthode.", p`<?php
$len = strlen(...);
echo $len("hello"), " ", implode(",", array_map(strtoupper(...), ["a", "b"]));`, { compare: ["8.0", "8.1"] }),
      f("new-in-initializers", "new in initializers", "new dans les initialiseurs", "Default parameter values can create objects.", "Les valeurs par défaut des paramètres peuvent créer des objets.", p`<?php
class Logger { public function log($m) { echo "LOG: $m\n"; } }
class Service {
    public function __construct(private Logger $logger = new Logger()) {}
    public function run() { $this->logger->log("running"); }
}
(new Service())->run();`, { compare: ["8.0", "8.1"] }),
      f("never", "never return type", "Type de retour never", "For functions that never return (they throw or exit).", "Pour les fonctions qui ne reviennent jamais (elles lèvent une exception ou quittent).", p`<?php
function fail(string $msg): never {
    throw new RuntimeException($msg);
}
try { fail("stop"); } catch (RuntimeException $e) { echo "caught ", $e->getMessage(), "\n"; }
$type = (new ReflectionFunction("fail"))->getReturnType();
echo $type->isBuiltin() ? "never is a built-in type" : "never is read as a class name";`, { compare: ["8.0", "8.1"] }),
      f("array-is-list", "array_is_list() and string-key unpacking", "array_is_list() et spread avec clés texte", "Check for a list, and spread arrays with string keys.", "Vérifie qu'un tableau est une liste, et utilise spread avec des clés texte.", p`<?php
var_dump(array_is_list([1, 2]));
$defaults = ["color" => "red", "size" => "M"];
print_r([...$defaults, "size" => "L"]);`, { compare: ["8.0", "8.1"] }),
      f("fibers", "Fibers", "Fibers", "Pause and resume a function: the foundation of async PHP libraries (Revolt, AMPHP, ReactPHP). Fibers can't run in this in-browser PHP, so the example only inspects the class.", "Mettre en pause et reprendre une fonction : la fondation des bibliothèques PHP asynchrones (Revolt, AMPHP, ReactPHP). Les Fibers ne peuvent pas s'exécuter dans ce PHP du navigateur, l'exemple inspecte donc seulement la classe.", p`<?php
// $fiber = new Fiber(fn() => Fiber::suspend("paused"));
// echo $fiber->start();   // "paused"
// $fiber->resume();
var_dump(class_exists("Fiber"));
if (class_exists("Fiber")) {
    echo implode(", ", array_map(fn($m) => $m->getName(), (new ReflectionClass("Fiber"))->getMethods()));
}`, { compare: ["8.0", "8.1"] }),
      f("octal", "Explicit octal 0o", "Octal explicite 0o", "Write octal numbers as 0o16 instead of a confusing leading zero.", "Écris les nombres octaux 0o16 au lieu d'un zéro initial déroutant.", p`<?php
var_dump(0o16 === 016);
echo 0o755;`, { compare: ["8.0", "8.1"] }),
    ],
    breaking: [
      f("null-to-internal", "Passing null to non-nullable built-in parameters", "Passer null à des paramètres natifs non nullables", "strlen(null) and similar calls became deprecated: fix the null at the source.", "strlen(null) et appels similaires sont devenus dépréciés : corrige le null à la source.", p`<?php
$name = null;
echo strlen($name);`, { compare: ["8.0", "8.1"] }),
    ],
    deprecations: [
      L("Passing null to non-nullable parameters of built-in functions.", "Passer null aux paramètres non nullables des fonctions natives."),
      L("Serializable without __serialize()/__unserialize().", "Serializable sans __serialize()/__unserialize()."),
      L("Implicit conversion of floats with a fractional part to int keys.", "La conversion implicite de floats avec décimales en clés entières."),
    ],
  },
  {
    version: "8.2",
    released: "2022-12-08",
    headline: L("Readonly classes and DNF types", "Classes readonly et types DNF"),
    summary: L(
      "PHP 8.2 made whole classes readonly, added DNF types, standalone null/false/true types and the Random extension, and deprecated dynamic properties, a common source of typos.",
      "PHP 8.2 a rendu des classes entières readonly, ajouté les types DNF, les types autonomes null/false/true et l'extension Random, et déprécié les propriétés dynamiques, une source fréquente de fautes de frappe.",
    ),
    features: [
      f("readonly-classes", "Readonly classes", "Classes readonly", "Every property of the class is readonly.", "Chaque propriété de la classe est readonly.", p`<?php
readonly class Coordinates {
    public function __construct(public float $lat, public float $lng) {}
}
$c = new Coordinates(48.85, 2.35);
echo $c->lat, ",", $c->lng;`, { compare: ["8.1", "8.2"] }),
      f("dnf-types", "DNF types", "Types DNF", "Combine union and intersection types: (A&B)|null.", "Combine types union et intersection : (A&B)|null.", p`<?php
function count_it((Countable&ArrayAccess)|null $c): int {
    return $c === null ? 0 : count($c);
}
echo count_it(new ArrayObject([1, 2, 3])), " ", count_it(null);`, { compare: ["8.1", "8.2"] }),
      f("true-false-null", "true, false and null types", "Types true, false et null", "Use true, false and null as standalone types.", "Utilise true, false et null comme types autonomes.", p`<?php
function alwaysFalse(): false { return false; }
function isOn(): true { return true; }
var_dump(alwaysFalse(), isOn());`, { compare: ["8.1", "8.2"] }),
      f("random-ext", "Random extension", "Extension Random", "An object-oriented, seedable random number API.", "Une API orientée objet de nombres aléatoires, avec graine.", p`<?php
$rng = new Random\Randomizer(new Random\Engine\Mt19937(42));
echo $rng->getInt(1, 100), " ", $rng->getInt(1, 100);`, { compare: ["8.1", "8.2"] }),
      f("trait-constants", "Constants in traits", "Constantes dans les traits", "Traits can declare constants.", "Les traits peuvent déclarer des constantes.", p`<?php
trait HasVersion { public const VERSION = "2.0"; }
class Api { use HasVersion; }
echo Api::VERSION;`, { compare: ["8.1", "8.2"] }),
    ],
    breaking: [
      f("dynamic-properties", "Dynamic properties deprecated", "Propriétés dynamiques dépréciées", "Creating a property that isn't declared now emits a deprecation (it will become an error). Declare it, or use #[AllowDynamicProperties].", "Créer une propriété non déclarée émet désormais une dépréciation (ce sera une erreur). Déclare-la, ou utilise #[AllowDynamicProperties].", p`<?php
class User { public string $name = "Ada"; }
$u = new User();
$u->nmae = "typo";
echo "done";`, { compare: ["8.1", "8.2"] }),
    ],
    deprecations: [
      L("Dynamic properties on classes without #[AllowDynamicProperties].", "Les propriétés dynamiques sur les classes sans #[AllowDynamicProperties]."),
      L("${var} string interpolation (use {$var}).", "L'interpolation ${var} (utilise {$var})."),
      L("utf8_encode() and utf8_decode().", "utf8_encode() et utf8_decode()."),
    ],
  },
  {
    version: "8.3",
    released: "2023-11-23",
    headline: L("Typed class constants and json_validate()", "Constantes de classe typées et json_validate()"),
    summary: L(
      "PHP 8.3 typed class constants, added the #[\\Override] attribute, dynamic class constant fetch, json_validate(), mb_str_pad() and new Randomizer methods.",
      "PHP 8.3 a typé les constantes de classe, ajouté l'attribut #[\\Override], l'accès dynamique aux constantes de classe, json_validate(), mb_str_pad() et de nouvelles méthodes Randomizer.",
    ),
    features: [
      f("typed-constants", "Typed class constants", "Constantes de classe typées", "Class constants can declare a type.", "Les constantes de classe peuvent déclarer un type.", p`<?php
class Http {
    const int OK = 200;
    const string NAME = "http";
}
echo Http::OK, " ", Http::NAME;`, { compare: ["8.2", "8.3"] }),
      f("override", "#[\\Override]", "#[\\Override]", "Marks a method that must override a parent method: a typo in its name becomes an error.", "Marque une méthode qui doit redéfinir une méthode parente : une faute dans son nom devient une erreur.", p`<?php
class Base { public function render(): string { return "base"; } }
class Page extends Base {
    #[\Override]
    public function render(): string { return "page"; }
}
echo (new Page())->render(), "\n";
var_dump(class_exists("Override"));
// Rename render() to rendr() above: PHP 8.3 refuses to compile it.`, { compare: ["8.2", "8.3"] }),
      f("dynamic-const", "Dynamic class constant fetch", "Accès dynamique aux constantes", "Read a class constant whose name is in a variable: Foo::{$name}.", "Lis une constante de classe dont le nom est dans une variable : Foo::{$name}.", p`<?php
class Colors { const RED = "#f00"; const BLUE = "#00f"; }
$name = "BLUE";
echo Colors::{$name};`, { compare: ["8.2", "8.3"] }),
      f("json-validate", "json_validate()", "json_validate()", "Check JSON without decoding it.", "Vérifie du JSON sans le décoder.", p`<?php
var_dump(json_validate('{"a":1}'), json_validate("{a:1}"));`, { compare: ["8.2", "8.3"] }),
      f("mb-str-pad", "mb_str_pad()", "mb_str_pad()", "Pads multibyte strings correctly.", "Complète correctement les chaînes multioctets.", p`<?php
echo "[", mb_str_pad("été", 5, "·"), "]";`, { compare: ["8.2", "8.3"] }),
      f("str-increment", "str_increment()", "str_increment()", "Increment a string like \"a9\" → \"b0\" explicitly.", "Incrémente une chaîne comme \"a9\" → \"b0\" de façon explicite.", p`<?php
echo str_increment("a9"), " ", str_increment("Az"), " ", str_decrement("b0");`, { compare: ["8.2", "8.3"] }),
    ],
  },
  {
    version: "8.4",
    released: "2024-11-21",
    headline: L("Property hooks and asymmetric visibility", "Hooks de propriétés et visibilité asymétrique"),
    summary: L(
      "PHP 8.4 lets properties run code when read or written (hooks), have a different visibility for writing (public private(set)), adds array_find() and friends, #[\\Deprecated], lazy objects and new MyClass()->method() without extra parentheses.",
      "PHP 8.4 permet aux propriétés d'exécuter du code à la lecture ou à l'écriture (hooks), d'avoir une visibilité différente en écriture (public private(set)), ajoute array_find() et compagnie, #[\\Deprecated], les objets paresseux et new MaClasse()->methode() sans parenthèses supplémentaires.",
    ),
    features: [
      f("property-hooks", "Property hooks", "Hooks de propriétés", "get and set code attached to a property, replacing many getters and setters.", "Du code get et set attaché à une propriété, qui remplace beaucoup de getters et setters.", p`<?php
class User {
    public string $email {
        set(string $value) {
            $this->email = strtolower(trim($value));
        }
    }
    public string $domain {
        get => substr($this->email, strpos($this->email, "@") + 1);
    }
}
$u = new User();
$u->email = "  Ada@Example.COM ";
echo $u->email, " ", $u->domain;`, { compare: ["8.3", "8.4"] }),
      f("asymmetric-visibility", "Asymmetric visibility", "Visibilité asymétrique", "Readable from everywhere, writable only inside the class: public private(set).", "Lisible partout, modifiable seulement dans la classe : public private(set).", p`<?php
class Counter {
    public private(set) int $count = 0;
    public function increment(): void { $this->count++; }
}
$c = new Counter();
$c->increment();
echo $c->count, "\n";
try { $c->count = 10; } catch (Error $e) { echo $e->getMessage(); }`, { compare: ["8.3", "8.4"] }),
      f("array-find", "array_find(), array_any(), array_all()", "array_find(), array_any(), array_all()", "Search arrays with a callback, without writing a loop.", "Cherche dans des tableaux avec un callback, sans écrire de boucle.", p`<?php
$users = [["name" => "Ada", "admin" => false], ["name" => "Root", "admin" => true]];
echo array_find($users, fn($u) => $u["admin"])["name"], "\n";
var_dump(array_any($users, fn($u) => $u["admin"]), array_all($users, fn($u) => $u["admin"]));`, { compare: ["8.3", "8.4"] }),
      f("new-without-parens", "new without parentheses", "new sans parenthèses", "Chain a call on a new object directly: new Foo()->bar().", "Enchaîne un appel sur un nouvel objet directement : new Foo()->bar().", p`<?php
class Greeter { public function hi() { return "hi!"; } }
echo new Greeter()->hi();`, {
        before: p`<?php
class Greeter { public function hi() { return "hi!"; } }
echo (new Greeter())->hi();`,
        compare: ["8.3", "8.4"],
      }),
      f("deprecated-attr", "#[\\Deprecated]", "#[\\Deprecated]", "Mark your own functions as deprecated: callers get a real deprecation notice.", "Marque tes propres fonctions comme dépréciées : les appelants reçoivent une vraie notice de dépréciation.", p`<?php
#[\Deprecated(message: "use newApi() instead", since: "2.0")]
function oldApi() { return "old"; }
echo oldApi();`, { compare: ["8.3", "8.4"] }),
      f("mb-trim", "mb_trim(), mb_ucfirst()", "mb_trim(), mb_ucfirst()", "Multibyte versions of trim and ucfirst.", "Versions multioctets de trim et ucfirst.", p`<?php
echo mb_ucfirst("éléphant"), " [", mb_trim("\u{3000}hi\u{3000}"), "]";`, { compare: ["8.3", "8.4"] }),
    ],
    breaking: [
      f("implicit-nullable", "Implicitly nullable parameters deprecated", "Paramètres implicitement nullables dépréciés", "function f(string $s = null) is deprecated: write ?string $s = null.", "function f(string $s = null) est déprécié : écris ?string $s = null.", p`<?php
function greet(string $name = null) {
    return "Hi " . ($name ?? "you");
}
echo greet();`, { compare: ["8.3", "8.4"] }),
    ],
    deprecations: [
      L("Implicitly nullable parameter types (Type $x = null).", "Les types de paramètres implicitement nullables (Type $x = null)."),
      L("Calling session_set_save_handler() with more than two arguments, and several old mysqli and DOM APIs.", "Appeler session_set_save_handler() avec plus de deux arguments, et plusieurs anciennes API mysqli et DOM."),
    ],
  },
  {
    version: "8.5",
    released: "2025-11-20",
    headline: L("The pipe operator and clone with", "L'opérateur pipe et clone with"),
    summary: L(
      "PHP 8.5 adds the |> pipe operator to chain calls left to right, clone() with new property values, array_first()/array_last(), the #[\\NoDiscard] attribute, a built-in URI extension, closures in constant expressions, and backtraces for fatal errors.",
      "PHP 8.5 ajoute l'opérateur pipe |> pour enchaîner les appels de gauche à droite, clone() avec de nouvelles valeurs de propriétés, array_first()/array_last(), l'attribut #[\\NoDiscard], une extension URI native, les closures dans les expressions constantes, et des traces pour les erreurs fatales.",
    ),
    features: [
      f("pipe", "Pipe operator |>", "Opérateur pipe |>", "Pass a value through a chain of single-argument callables, read left to right.", "Fais passer une valeur dans une chaîne de callables à un argument, de gauche à droite.", p`<?php
$slug = "  Hello PHP World  "
    |> trim(...)
    |> strtolower(...)
    |> (fn($s) => str_replace(" ", "-", $s));
echo $slug;`, {
        before: p`<?php
$slug = str_replace(" ", "-", strtolower(trim("  Hello PHP World  ")));
echo $slug;`,
        compare: ["8.4", "8.5"],
      }),
      f("clone-with", "clone with new values", "clone avec de nouvelles valeurs", "clone($object, [...]) copies an object and changes some properties, even readonly ones (from inside the class scope).", "clone($objet, [...]) copie un objet et change certaines propriétés, même readonly (depuis la portée de la classe).", p`<?php
final class Color {
    public function __construct(public readonly int $r, public readonly int $g, public readonly int $b) {}
    public function withRed(int $r): static { return clone($this, ["r" => $r]); }
}
$blue = new Color(0, 0, 255);
$purple = $blue->withRed(128);
echo "$purple->r,$purple->g,$purple->b";`, { compare: ["8.4", "8.5"] }),
      f("array-first-last", "array_first() and array_last()", "array_first() et array_last()", "Get the first or last value of any array.", "Obtiens la première ou la dernière valeur de n'importe quel tableau.", p`<?php
$queue = ["x" => "first", "y" => "middle", "z" => "last"];
echo array_first($queue), " / ", array_last($queue);`, {
        before: p`<?php
$queue = ["x" => "first", "y" => "middle", "z" => "last"];
echo $queue[array_key_first($queue)], " / ", $queue[array_key_last($queue)];`,
        compare: ["8.4", "8.5"],
      }),
      f("nodiscard", "#[\\NoDiscard]", "#[\\NoDiscard]", "Warns when the return value of a function is ignored. Cast to (void) to ignore it on purpose.", "Avertit quand la valeur de retour d'une fonction est ignorée. Utilise le cast (void) pour l'ignorer exprès.", p`<?php
#[\NoDiscard("the new list is returned, the original is unchanged")]
function withItem(array $list, string $item): array {
    return [...$list, $item];
}
$list = ["a"];
withItem($list, "b");
$list = withItem($list, "c");
echo implode(",", $list);`, { compare: ["8.4", "8.5"] }),
      f("uri", "URI extension", "Extension URI", "Parse and normalize URLs following RFC 3986 and the WHATWG URL standard.", "Analyse et normalise des URL selon la RFC 3986 et le standard URL du WHATWG.", p`<?php
$uri = new Uri\Rfc3986\Uri("https://php.net/releases/8.5/?lang=en#pipe");
echo $uri->getHost(), " ", $uri->getPath(), " ", $uri->getQuery();`, { compare: ["8.4", "8.5"] }),
      f("closures-in-const", "Closures in constant expressions", "Closures dans les expressions constantes", "Static closures and first-class callables can be used as default values, constants and attribute arguments.", "Les closures statiques et les callables de première classe peuvent servir de valeurs par défaut, de constantes et d'arguments d'attributs.", p`<?php
function transform(array $items, Closure $fn = static function (string $s): string { return strtoupper($s); }): array {
    return array_map($fn, $items);
}
echo implode(",", transform(["a", "b"]));`, { compare: ["8.4", "8.5"] }),
    ],
    breaking: [
      f("noncanonical-casts", "Non-canonical casts deprecated", "Casts non canoniques dépréciés", "(boolean), (integer), (double) and (binary) are deprecated: write (bool), (int), (float) and (string).", "(boolean), (integer), (double) et (binary) sont dépréciés : écris (bool), (int), (float) et (string).", p`<?php
$casts = [(boolean) 1, (integer) "2"];
var_dump($casts);`, { compare: ["8.4", "8.5"] }),
    ],
    deprecations: [
      L("The backtick operator (use shell_exec()).", "L'opérateur backtick (utilise shell_exec())."),
      L("Non-canonical casts: (boolean), (integer), (double), (binary).", "Les casts non canoniques : (boolean), (integer), (double), (binary)."),
      L("Using null as an array offset, and a semicolon after case in switch.", "Utiliser null comme index de tableau, et un point-virgule après case dans un switch."),
    ],
  },
];
