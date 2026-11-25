import { e } from "./entry";
import type { RefEntry } from "./types";

const p = String.raw;

export const MATH: RefEntry[] = [
  e("abs", "math", "abs(int|float $num): int|float", "Absolute value (removes the minus sign).", "Valeur absolue (retire le signe moins).", p`<?php
echo abs(-7), " ", abs(3.5);`),
  e("round", "math", "round(int|float $num, int $precision = 0, int $mode = PHP_ROUND_HALF_UP): float", "Rounds to the nearest value, with optional decimals (or negative precision for tens, hundreds…).", "Arrondit à la valeur la plus proche, avec des décimales optionnelles (ou une précision négative pour les dizaines, centaines…).", p`<?php
echo round(3.14159, 2), "\n";
echo round(2.5), " ", round(-2.5), "\n";
echo round(1234, -2);`),
  e("floor / ceil", "math", "floor(int|float $num): float", "floor rounds down, ceil rounds up. Both return floats.", "floor arrondit vers le bas, ceil vers le haut. Les deux renvoient des floats.", p`<?php
var_dump(floor(4.8), ceil(4.2));
echo (int) ceil(10 / 3), " pages";`),
  e("intdiv", "math", "intdiv(int $num1, int $num2): int", "Integer division: the whole part of a division. Throws DivisionByZeroError on 0.", "Division entière : la partie entière d'une division. Lève DivisionByZeroError sur 0.", p`<?php
echo intdiv(17, 5), " remainder ", 17 % 5;`, { since: "7.0" }),
  e("% / fmod", "math", "$a % $b  fmod(float $num1, float $num2): float", "% is the integer remainder; fmod works with floats.", "% est le reste entier ; fmod marche avec des floats.", p`<?php
echo 10 % 3, " ", -10 % 3, "\n";
echo fmod(7.5, 2);`),
  e("max / min", "math", "max(mixed $value, mixed ...$values): mixed", "The biggest or smallest value, from arguments or one array.", "La plus grande ou la plus petite valeur, parmi les arguments ou un tableau.", p`<?php
echo max(3, 9, 4), " ", min([7, 2, 8]), "\n";
echo max("apple", "pear");`),
  e("random_int", "math", "random_int(int $min, int $max): int", "A cryptographically secure random integer between min and max (inclusive).", "Un entier aléatoire sécurisé entre min et max (inclus).", p`<?php
$dice = random_int(1, 6);
echo $dice >= 1 && $dice <= 6 ? "A die roll between 1 and 6" : "impossible";`, { since: "7.0", noteEn: "Use it for tokens and games; mt_rand is faster but predictable.", noteFr: "Utilise-le pour les jetons et les jeux ; mt_rand est plus rapide mais prévisible." }),
  e("** / pow / sqrt", "math", "$base ** $exp  sqrt(float $num): float", "Powers and square roots.", "Puissances et racines carrées.", p`<?php
echo 2 ** 10, " ", pow(3, 2), " ", sqrt(144), "\n";
echo round(sqrt(2), 4);`),
  e("is_numeric", "math", "is_numeric(mixed $value): bool", "True for numbers and numeric strings like \"12\", \"1.5\" or \"1e3\".", "Vrai pour les nombres et les chaînes numériques comme \"12\", \"1.5\" ou \"1e3\".", p`<?php
foreach (["42", "4.2", "1e3", "12abc", "", " 7"] as $v) {
    echo var_export($v, true), ": ", is_numeric($v) ? "numeric" : "no", "\n";
}`),
  e("PHP_INT_MAX / PHP_FLOAT_EPSILON", "math", "PHP_INT_MAX  PHP_FLOAT_EPSILON", "Limits of numbers: the biggest int, and the smallest float difference. Ints overflow into floats.", "Les limites des nombres : le plus grand int, et le plus petit écart de float. Les ints débordent en floats.", p`<?php
echo PHP_INT_MAX, "\n";
var_dump(PHP_INT_MAX + 1);
var_dump(abs(0.1 + 0.2 - 0.3) < PHP_FLOAT_EPSILON);`),
  e("base_convert / bindec / dechex", "math", "base_convert(string $num, int $from, int $to): string", "Convert numbers between bases (binary, hexadecimal…).", "Convertissent des nombres entre bases (binaire, hexadécimal…).", p`<?php
echo decbin(10), " ", bindec("1010"), " ", dechex(255), " ", base_convert("ff", 16, 2);`),
];

export const TYPES: RefEntry[] = [
  e("var_dump", "types", "var_dump(mixed $value, mixed ...$values): void", "Prints a value with its type and size. The first debugging tool to reach for.", "Affiche une valeur avec son type et sa taille. Le premier outil de débogage.", p`<?php
var_dump(42, "42", 4.2, true, null, [1, "a" => 2]);`, { seeAlso: ["print_r", "var_export"] }),
  e("print_r", "types", "print_r(mixed $value, bool $return = false): string|true", "Prints arrays and objects in a readable way (no types).", "Affiche tableaux et objets de façon lisible (sans les types).", p`<?php
print_r(["name" => "Ada", "langs" => ["en", "fr"]]);
$text = print_r([1, 2], true);
echo strlen($text), " characters";`),
  e("var_export", "types", "var_export(mixed $value, bool $return = false): ?string", "Prints a value as valid PHP code.", "Affiche une valeur sous forme de code PHP valide.", p`<?php
var_export(["debug" => true, "level" => 3]);
echo "\n";
var_export(1.0);`),
  e("gettype", "types", "gettype(mixed $value): string", "The type name: integer, double, string, boolean, array, object, NULL…", "Le nom du type : integer, double, string, boolean, array, object, NULL…", p`<?php
foreach ([1, 1.5, "a", true, [], null] as $v) echo gettype($v), " ";`, { seeAlso: ["get_debug_type"] }),
  e("get_debug_type", "types", "get_debug_type(mixed $value): string", "The type name as you'd write it in code: int, float, string, bool, null, or the class name.", "Le nom du type tel qu'on l'écrit dans le code : int, float, string, bool, null, ou le nom de la classe.", p`<?php
foreach ([1, 1.5, "a", true, [], null, new ArrayObject()] as $v) echo get_debug_type($v), " ";`, { since: "8.0", version: "8.0" }),
  e("is_int / is_string / is_array…", "types", "is_int(mixed $value): bool", "Check a type: is_int, is_float, is_string, is_bool, is_array, is_null, is_object, is_callable, is_iterable.", "Vérifient un type : is_int, is_float, is_string, is_bool, is_array, is_null, is_object, is_callable, is_iterable.", p`<?php
$v = "12";
var_dump(is_int($v), is_string($v), is_numeric($v), is_array([]), is_null(null));`),
  e("intval / floatval / boolval / strval", "types", "intval(mixed $value, int $base = 10): int", "Convert a value to a type. Same as the (int), (float), (bool), (string) casts.", "Convertissent une valeur en un type. Comme les casts (int), (float), (bool), (string).", p`<?php
var_dump(intval("42px"), (int) "0x1A", intval("1A", 16));
var_dump(floatval("3.14abc"), boolval("0"), strval(7));`),
  e("settype", "types", "settype(mixed &$var, string $type): bool", "Changes the type of a variable in place.", "Change le type d'une variable sur place.", p`<?php
$v = "123";
settype($v, "integer");
var_dump($v);`),
  e("json_encode (types)", "types", "json_encode(mixed $value, int $flags = 0): string|false", "Turns arrays and objects into JSON. Lists become [ ], associative arrays become { }.", "Transforme tableaux et objets en JSON. Les listes deviennent [ ], les tableaux associatifs { }.", p`<?php
echo json_encode([1, 2, 3]), "\n";
echo json_encode(["a" => 1, "b" => null]), "\n";
echo json_encode([]), " ", json_encode(new stdClass());`, { seeAlso: ["json_encode"] }),
];

export const OUTPUT: RefEntry[] = [
  e("ob_start / ob_get_clean", "output", "ob_start(): bool  ob_get_clean(): string|false", "Output buffering: capture everything printed into a string instead of sending it.", "Mise en tampon : capture tout ce qui est affiché dans une chaîne au lieu de l'envoyer.", p`<?php
ob_start();
echo "Hello ";
print "from a buffer";
$html = ob_get_clean();
echo strtoupper($html);`),
  e("printf (output)", "output", "printf(string $format, mixed ...$values): int", "Formatted printing; returns the number of bytes printed.", "Affichage formaté ; renvoie le nombre d'octets affichés.", p`<?php
$n = printf("%s scored %d%%\n", "Ada", 95);
echo "($n bytes)";`, { seeAlso: ["sprintf"] }),
  e("PHP_EOL", "output", "PHP_EOL", "The end-of-line string for the current system (\"\\n\" on Linux and macOS).", "La fin de ligne du système (\"\\n\" sur Linux et macOS).", p`<?php
echo "Line 1", PHP_EOL, "Line 2", PHP_EOL;`),
  e("<?= ?>", "output", "<?= $value ?>", "Short echo tag: prints a value inside an HTML template.", "Balise courte d'echo : affiche une valeur dans un gabarit HTML.", p`<?php $items = ["Tea", "Coffee"]; ?>
<ul>
<?php foreach ($items as $item): ?>
  <li><?= htmlspecialchars($item) ?></li>
<?php endforeach; ?>
</ul>`),
];

export const FUNCTIONS: RefEntry[] = [
  e("func_get_args / ...$args", "functions", "function f(...$args)", "Variadic parameters collect any number of arguments into an array.", "Les paramètres variadiques collectent un nombre quelconque d'arguments dans un tableau.", p`<?php
function total(float ...$prices): float {
    return array_sum($prices);
}
echo total(1.5, 2, 3), "\n";
$list = [10, 20];
echo total(...$list), "\n";
function legacy() { return count(func_get_args()); }
echo legacy("a", "b", "c");`),
  e("call_user_func", "functions", "call_user_func(callable $callback, mixed ...$args): mixed", "Calls a callable (name, closure, [object, method]) with arguments.", "Appelle un callable (nom, closure, [objet, méthode]) avec des arguments.", p`<?php
echo call_user_func("strtoupper", "hi"), "\n";
echo call_user_func_array("max", [3, 8, 2]), "\n";
$fn = "str_repeat";
echo $fn("ab", 3);`),
  e("is_callable", "functions", "is_callable(mixed $value): bool", "True if the value can be called like a function.", "Vrai si la valeur peut être appelée comme une fonction.", p`<?php
var_dump(is_callable("strlen"), is_callable("nope"), is_callable(fn() => 1));`),
  e("first-class callable strlen(...)", "functions", "$fn = strlen(...);", "Creates a Closure from any function or method with the (...) syntax.", "Crée une Closure à partir de n'importe quelle fonction ou méthode avec la syntaxe (...).", p`<?php
$upper = strtoupper(...);
echo $upper("php"), "\n";
print_r(array_map(trim(...), [" a ", " b"]));`, { since: "8.1", version: "8.1", seeAlso: ["Closure::fromCallable"] }),
  e("Closure::fromCallable", "functions", "Closure::fromCallable(callable $callback): Closure", "Turns a callable into a Closure object (the pre-8.1 way).", "Transforme un callable en objet Closure (la façon d'avant 8.1).", p`<?php
$fn = Closure::fromCallable("ucfirst");
echo $fn("hello"), " ", get_class($fn);`),
  e("function use()", "functions", "function () use ($var, &$ref) { … }", "An anonymous function captures outer variables with use (by value, or by reference with &).", "Une fonction anonyme capture des variables extérieures avec use (par valeur, ou par référence avec &).", p`<?php
$count = 0;
$increment = function () use (&$count) { $count++; };
$increment();
$increment();
echo $count, "\n";
$greeting = "Hi";
$say = function (string $name) use ($greeting) { return "$greeting $name"; };
echo $say("Ada");`, { seeAlso: ["fn"] }),
  e("function_exists", "functions", "function_exists(string $function): bool", "True if a function is defined (built-in or yours).", "Vrai si une fonction est définie (native ou la tienne).", p`<?php
var_dump(function_exists("str_contains"));
function mine() {}
var_dump(function_exists("mine"));`),
];

export const CLASSES: RefEntry[] = [
  e("class_exists / interface_exists", "classes", "class_exists(string $class, bool $autoload = true): bool", "True if a class (or interface, enum, trait) is defined.", "Vrai si une classe (ou interface, enum, trait) est définie.", p`<?php
class Invoice {}
var_dump(class_exists("Invoice"), class_exists("Receipt"), interface_exists("Countable"));`),
  e("method_exists / property_exists", "classes", "method_exists(object|string $object_or_class, string $method): bool", "Check whether a class has a method or a property.", "Vérifient si une classe a une méthode ou une propriété.", p`<?php
class User { public string $name = "Ada"; public function greet() {} }
var_dump(method_exists(User::class, "greet"), property_exists(User::class, "email"));`),
  e("get_class / ::class", "classes", "get_class(object $object): string  Foo::class", "The class name of an object; ::class gives the fully qualified name as a string.", "Le nom de classe d'un objet ; ::class donne le nom complet sous forme de chaîne.", p`<?php
namespace App\Models;
class Post {}
$p = new Post();
echo get_class($p), "\n", Post::class, "\n", $p::class;`, { version: "8.0", noteEn: "$object::class needs PHP 8.0.", noteFr: "$objet::class demande PHP 8.0." }),
  e("enum cases / from / tryFrom", "classes", "Enum::cases(): array  Enum::from(int|string $value): static", "cases() lists all cases; from() finds a case by value (throws), tryFrom() returns null instead.", "cases() liste tous les cas ; from() trouve un cas par sa valeur (lève une erreur), tryFrom() renvoie null à la place.", p`<?php
enum Status: int {
    case Draft = 0;
    case Published = 1;
}
foreach (Status::cases() as $s) echo $s->name, "=", $s->value, " ";
echo "\n", Status::from(1)->name, "\n";
var_dump(Status::tryFrom(9));
try { Status::from(9); } catch (ValueError $e) { echo get_class($e); }`, { since: "8.1", version: "8.1" }),
  e("ReflectionClass", "classes", "new ReflectionClass(object|string $objectOrClass)", "Inspect a class at runtime: methods, properties, attributes, parent…", "Inspecte une classe à l'exécution : méthodes, propriétés, attributs, parent…", p`<?php
class Product {
    public function __construct(public string $name, protected float $price) {}
    public function label(): string { return $this->name; }
}
$r = new ReflectionClass(Product::class);
echo $r->getShortName(), "\n";
foreach ($r->getProperties() as $prop) echo $prop->getName(), " ";
echo "\n";
foreach ($r->getMethods() as $m) echo $m->getName(), " ";`, { version: "8.0" }),
  e("__construct / promotion", "classes", "public function __construct(private string $name) {}", "Constructor property promotion declares and assigns properties straight from the constructor.", "La promotion des propriétés du constructeur déclare et affecte les propriétés directement depuis le constructeur.", p`<?php
class Book {
    public function __construct(
        public string $title,
        public int $pages = 100,
    ) {}
}
$b = new Book("Dune", 412);
echo "$b->title has $b->pages pages";`, { since: "8.0", version: "8.0" }),
  e("__toString", "classes", "public function __toString(): string", "Lets an object be used as a string (echo, concatenation).", "Permet d'utiliser un objet comme une chaîne (echo, concaténation).", p`<?php
class Temperature {
    public function __construct(private float $celsius) {}
    public function __toString(): string { return $this->celsius . "°C"; }
}
echo new Temperature(21.5), "\n";
echo "Today: " . new Temperature(18);`),
  e("interface / implements", "classes", "interface Name { public function m(): T; }", "An interface lists methods a class promises to have.", "Une interface liste les méthodes qu'une classe promet d'avoir.", p`<?php
interface Shape { public function area(): float; }
class Square implements Shape {
    public function __construct(private float $side) {}
    public function area(): float { return $this->side ** 2; }
}
$shapes = [new Square(2), new Square(3)];
echo array_sum(array_map(fn(Shape $s) => $s->area(), $shapes));`),
  e("trait / use", "classes", "trait Name { … }  class C { use Name; }", "A trait is a reusable set of methods copied into classes.", "Un trait est un ensemble de méthodes réutilisables copiées dans des classes.", p`<?php
trait Greets {
    public function hello(): string { return "Hello from " . static::class; }
}
class Robot { use Greets; }
class Person { use Greets; }
echo (new Robot())->hello(), "\n", (new Person())->hello();`),
  e("abstract / extends", "classes", "abstract class A { abstract public function m(); }  class B extends A", "A child class extends a parent; abstract classes can't be created and force children to implement methods.", "Une classe enfant étend un parent ; les classes abstraites ne s'instancient pas et obligent les enfants à implémenter des méthodes.", p`<?php
abstract class Animal {
    public function __construct(protected string $name) {}
    abstract protected function sound(): string;
    public function speak(): string { return "$this->name says " . $this->sound(); }
}
class Cat extends Animal { protected function sound(): string { return "meow"; } }
echo (new Cat("Tom"))->speak();`),
];
