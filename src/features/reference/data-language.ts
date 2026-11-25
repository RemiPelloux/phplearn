import { e } from "./entry";
import type { RefEntry } from "./types";

const p = String.raw;

export const LANGUAGE: RefEntry[] = [
  e("echo", "language", "echo string ...$values", "Prints one or more values. Not a function: no parentheses needed.", "Affiche une ou plusieurs valeurs. Ce n'est pas une fonction : pas besoin de parenthèses.", p`<?php
$name = "Ada";
echo "Hello, ", $name, "!\n";
echo 'Single quotes: $name', "\n";`, { seeAlso: ["print", "printf"] }),
  e("print", "language", "print string $value: int", "Prints one value and returns 1, so it can be used inside an expression.", "Affiche une valeur et renvoie 1, donc on peut l'utiliser dans une expression.", p`<?php
$result = print "Printed!\n";
echo "print returned $result\n";`, { seeAlso: ["echo"] }),
  e("if / elseif / else", "language", "if (cond) { … } elseif (cond) { … } else { … }", "Runs a block only when a condition is true.", "Exécute un bloc seulement si une condition est vraie.", p`<?php
$temp = 18;
if ($temp >= 25) {
    echo "Hot\n";
} elseif ($temp >= 15) {
    echo "Mild\n";
} else {
    echo "Cold\n";
}`, { seeAlso: ["match", "switch"] }),
  e("match", "language", "match (expr) { value1, value2 => result, default => result }", "Compares a value strictly (===) and returns the result of the matching arm. It's an expression, so you can assign it.", "Compare une valeur strictement (===) et renvoie le résultat de la branche correspondante. C'est une expression, on peut donc l'affecter.", p`<?php
$code = 404;
$text = match ($code) {
    200, 201 => "OK",
    404 => "Not found",
    500 => "Server error",
    default => "Unknown",
};
echo $text, "\n";
$age = 15;
echo match (true) {
    $age < 13 => "child",
    $age < 18 => "teen",
    default => "adult",
};`, { since: "8.0", version: "8.0", noteEn: "No match and no default throws an UnhandledMatchError.", noteFr: "Sans branche correspondante ni default, une UnhandledMatchError est levée.", seeAlso: ["switch"] }),
  e("switch", "language", "switch (expr) { case v: …; break; default: … }", "Older multi-branch statement. Uses loose comparison (==) and falls through without break.", "Ancienne instruction à plusieurs branches. Compare de façon souple (==) et continue sans break.", p`<?php
$day = "sat";
switch ($day) {
    case "sat":
    case "sun":
        echo "Weekend\n";
        break;
    default:
        echo "Weekday\n";
}`, { noteEn: "Forgetting break runs the next case too. Prefer match for new code.", noteFr: "Oublier break exécute aussi le case suivant. Préfère match pour du code neuf.", seeAlso: ["match"] }),
  e("foreach", "language", "foreach ($array as $key => $value) { … }", "Loops over every item of an array (or iterable), with or without the key.", "Parcourt chaque élément d'un tableau (ou itérable), avec ou sans la clé.", p`<?php
$prices = ["apple" => 1.2, "pear" => 0.8];
foreach ($prices as $fruit => $price) {
    echo "$fruit: $price\n";
}
foreach ([10, 20] as $n) {
    echo $n * 2, "\n";
}`, { seeAlso: ["for", "while"] }),
  e("for", "language", "for (init; condition; step) { … }", "Classic counting loop: start, keep going while the condition holds, step after each turn.", "Boucle de comptage classique : départ, continue tant que la condition tient, pas après chaque tour.", p`<?php
for ($i = 1; $i <= 5; $i++) {
    echo $i, " ";
}
echo "\n";
for ($i = 10; $i > 0; $i -= 3) {
    echo $i, " ";
}`, { seeAlso: ["foreach", "while"] }),
  e("while / do-while", "language", "while (cond) { … }  do { … } while (cond);", "Repeats while a condition is true. do-while always runs at least once.", "Répète tant qu'une condition est vraie. do-while s'exécute toujours au moins une fois.", p`<?php
$n = 1;
while ($n < 100) {
    $n *= 3;
}
echo $n, "\n";
$tries = 0;
do {
    $tries++;
} while ($tries < 0);
echo "Ran $tries time(s)";`, { seeAlso: ["for", "break / continue"] }),
  e("break / continue", "language", "break [n];  continue [n];", "break leaves a loop; continue skips to the next turn. A number targets outer loops.", "break quitte une boucle ; continue passe au tour suivant. Un nombre vise les boucles extérieures.", p`<?php
foreach ([1, 2, 3, 4, 5, 6] as $n) {
    if ($n % 2 === 0) continue;
    if ($n > 4) break;
    echo $n, " ";
}`),
  e("function", "language", "function name(type $param = default): returnType { … }", "Declares a named, reusable block of code with typed parameters and a return type.", "Déclare un bloc de code nommé et réutilisable, avec des paramètres typés et un type de retour.", p`<?php
function greet(string $name, string $greeting = "Hello"): string {
    return "$greeting, $name!";
}
echo greet("Ada"), "\n";
echo greet("Linus", "Hi"), "\n";
echo greet(greeting: "Hey", name: "Grace");`, { noteEn: "Named arguments (name: value) need PHP 8.0+.", noteFr: "Les arguments nommés (nom: valeur) demandent PHP 8.0+.", version: "8.0", seeAlso: ["fn", "return"] }),
  e("fn", "language", "fn(params) => expression", "Arrow function: a one-expression closure that captures outer variables automatically.", "Fonction fléchée : une closure d'une seule expression qui capture les variables extérieures automatiquement.", p`<?php
$rate = 1.2;
$withTax = fn(float $price): float => round($price * $rate, 2);
echo $withTax(10), "\n";
print_r(array_map(fn($n) => $n ** 2, [1, 2, 3]));`, { since: "7.4", version: "7.4", seeAlso: ["function", "array_map"] }),
  e("return", "language", "return expr;", "Ends a function and sends a value back to the caller.", "Termine une fonction et renvoie une valeur à l'appelant.", p`<?php
function sign(int $n): string {
    if ($n > 0) return "positive";
    if ($n < 0) return "negative";
    return "zero";
}
echo sign(-4), " ", sign(0);`),
  e("require / include", "language", "require 'file.php';  require_once 'file.php';", "Loads and runs another PHP file. require stops with a fatal error if it's missing; include only warns.", "Charge et exécute un autre fichier PHP. require s'arrête sur une erreur fatale s'il manque ; include ne fait qu'avertir.", p`<?php
file_put_contents("/tmp/config.php", '<?php return ["debug" => true, "name" => "demo"];');
$config = require "/tmp/config.php";
echo $config["name"], "\n";
var_dump($config["debug"]);`, { noteEn: "Use the _once variants for files that define functions or classes.", noteFr: "Utilise les variantes _once pour les fichiers qui définissent des fonctions ou des classes." }),
  e("isset", "language", "isset(mixed $var, mixed ...$vars): bool", "True when a variable (or array key) exists and is not null. Never warns.", "Vrai quand une variable (ou une clé) existe et n'est pas null. N'avertit jamais.", p`<?php
$user = ["name" => "Ada", "email" => null];
var_dump(isset($user["name"]));
var_dump(isset($user["email"]));
var_dump(isset($user["phone"]));
var_dump(isset($nope));`, { seeAlso: ["empty", "array_key_exists", "??"] }),
  e("unset", "language", "unset(mixed $var, mixed ...$vars): void", "Destroys a variable or removes an array key.", "Détruit une variable ou retire une clé d'un tableau.", p`<?php
$cart = ["apple" => 2, "pear" => 1];
unset($cart["apple"]);
print_r($cart);
$x = 5;
unset($x);
var_dump(isset($x));`),
  e("empty", "language", "empty(mixed $var): bool", "True for a missing variable or a falsy value: \"\", \"0\", 0, 0.0, null, false, [].", "Vrai pour une variable absente ou une valeur fausse : \"\", \"0\", 0, 0.0, null, false, [].", p`<?php
foreach (["", "0", "a", 0, [], [0], null] as $v) {
    echo var_export($v, true), " => ", empty($v) ? "empty" : "not empty", "\n";
}`, { noteEn: "\"0\" counts as empty: a classic trap for form fields.", noteFr: "\"0\" compte comme vide : un piège classique pour les champs de formulaire." }),
  e("[] = / list()", "language", "[$a, $b] = $array;  ['key' => $x] = $array;", "Destructuring: unpacks array items into variables, by position or by key.", "Déstructuration : extrait des éléments d'un tableau dans des variables, par position ou par clé.", p`<?php
[$first, , $third] = ["a", "b", "c"];
echo "$first $third\n";
["name" => $name, "age" => $age] = ["name" => "Ada", "age" => 36];
echo "$name is $age\n";
$a = 1; $b = 2;
[$a, $b] = [$b, $a];
echo "$a $b";`, { since: "7.1", seeAlso: ["foreach"] }),
  e("??", "language", "$value ?? $default", "Null coalescing: the left value if it exists and isn't null, otherwise the right one. No warning for missing keys.", "Coalescence nulle : la valeur de gauche si elle existe et n'est pas null, sinon celle de droite. Pas d'avertissement pour une clé absente.", p`<?php
$query = ["page" => "3"];
$page = $query["page"] ?? "1";
$sort = $query["sort"] ?? "name";
echo "page=$page sort=$sort\n";
echo null ?? false ?? "never", "|";
var_dump(null ?? false);`, { since: "7.0", seeAlso: ["??=", "isset"] }),
  e("??=", "language", "$var ??= $default;", "Assigns only if the variable is missing or null.", "N'affecte que si la variable est absente ou null.", p`<?php
$settings = ["theme" => "dark"];
$settings["theme"] ??= "light";
$settings["lang"] ??= "en";
print_r($settings);`, { since: "7.4", version: "7.4", seeAlso: ["??"] }),
  e("?->", "language", "$object?->method()?->property", "Nullsafe operator: stops and returns null if the left side is null, instead of an error.", "Opérateur nullsafe : s'arrête et renvoie null si la partie gauche est null, au lieu d'une erreur.", p`<?php
class Address { public function __construct(public string $city) {} }
class User { public function __construct(public ?Address $address = null) {} }
$a = new User(new Address("Lyon"));
$b = new User();
echo $a->address?->city ?? "unknown", "\n";
echo $b->address?->city ?? "unknown", "\n";`, { since: "8.0", version: "8.0", seeAlso: ["??"] }),
  e("<=>", "language", "$a <=> $b", "Spaceship operator: -1, 0 or 1 when the left side is smaller, equal or greater. Perfect for usort.", "Opérateur vaisseau : -1, 0 ou 1 quand la gauche est plus petite, égale ou plus grande. Parfait pour usort.", p`<?php
echo 1 <=> 2, " ", 2 <=> 2, " ", 3 <=> 2, "\n";
$people = [["n" => "Bo", "age" => 40], ["n" => "Al", "age" => 25]];
usort($people, fn($x, $y) => $x["age"] <=> $y["age"]);
echo implode(", ", array_column($people, "n"));`, { since: "7.0", seeAlso: ["usort"] }),
  e("== / ===", "language", "$a == $b  $a === $b", "== compares after converting types; === also requires the same type. Prefer ===.", "== compare après conversion des types ; === exige aussi le même type. Préfère ===.", p`<?php
var_dump(1 == "1");
var_dump(1 === "1");
var_dump(null == false);
var_dump("abc" == 0);`, { noteEn: "\"abc\" == 0 was true before PHP 8.0.", noteFr: "\"abc\" == 0 valait true avant PHP 8.0." }),
  e("instanceof", "language", "$object instanceof ClassName", "True when an object is of a class, a subclass, or implements an interface.", "Vrai quand un objet est d'une classe, d'une sous-classe, ou implémente une interface.", p`<?php
interface Shape {}
class Circle implements Shape {}
$c = new Circle();
var_dump($c instanceof Circle);
var_dump($c instanceof Shape);
var_dump($c instanceof ArrayAccess);`),
  e("new", "language", "new ClassName(args)", "Creates an object and calls its constructor.", "Crée un objet et appelle son constructeur.", p`<?php
class Point {
    public function __construct(public int $x = 0, public int $y = 0) {}
}
$p = new Point(3, 4);
echo "($p->x, $p->y)\n";
$date = new DateTimeImmutable("2024-02-29");
echo $date->format("l");`, { version: "8.0", seeAlso: ["clone"] }),
  e("clone", "language", "clone $object", "Makes a shallow copy of an object. Objects are otherwise shared by handle.", "Fait une copie superficielle d'un objet. Sinon, les objets sont partagés par référence.", p`<?php
class Counter { public int $n = 0; }
$a = new Counter();
$b = $a;
$c = clone $a;
$a->n = 5;
echo $b->n, " ", $c->n;`, { seeAlso: ["new"] }),
  e("static", "language", "static $var = init;  static::method()  public static function", "A static variable keeps its value between calls; static members belong to the class, not to objects.", "Une variable static garde sa valeur entre les appels ; les membres static appartiennent à la classe, pas aux objets.", p`<?php
function nextId(): int {
    static $id = 0;
    return ++$id;
}
echo nextId(), nextId(), nextId(), "\n";
class Temp {
    public static function c2f(float $c): float { return $c * 9 / 5 + 32; }
}
echo Temp::c2f(100);`),
  e("yield", "language", "yield $value;  yield $key => $value;", "Turns a function into a generator: it produces values one at a time, on demand.", "Transforme une fonction en générateur : il produit les valeurs une par une, à la demande.", p`<?php
function countdown(int $from): Generator {
    for ($i = $from; $i > 0; $i--) {
        yield $i;
    }
    return "Liftoff!";
}
$gen = countdown(3);
foreach ($gen as $n) echo $n, " ";
echo $gen->getReturn();`, { seeAlso: ["foreach"] }),
  e("throw", "language", "throw new Exception(message)", "Raises an exception. Since PHP 8.0 throw is an expression and can be used after ?? or =>.", "Lève une exception. Depuis PHP 8.0, throw est une expression utilisable après ?? ou =>.", p`<?php
function age(array $user): int {
    return $user["age"] ?? throw new InvalidArgumentException("age is missing");
}
try {
    echo age(["age" => 30]), "\n";
    echo age([]);
} catch (InvalidArgumentException $e) {
    echo "Error: ", $e->getMessage();
}`, { version: "8.0", seeAlso: ["try / catch / finally"] }),
  e("try / catch / finally", "language", "try { … } catch (Type $e) { … } finally { … }", "Catches exceptions thrown in the try block; finally always runs.", "Attrape les exceptions levées dans le bloc try ; finally s'exécute toujours.", p`<?php
function divide(int $a, int $b): int {
    return intdiv($a, $b);
}
try {
    echo divide(10, 2), "\n";
    echo divide(1, 0), "\n";
} catch (DivisionByZeroError $e) {
    echo "Caught: ", $e->getMessage(), "\n";
} finally {
    echo "Done";
}`, { noteEn: "Catch several types with |: catch (TypeError | ValueError $e). PHP 8 lets you omit the variable.", noteFr: "Attrape plusieurs types avec | : catch (TypeError | ValueError $e). PHP 8 permet d'omettre la variable." }),
  e("declare(strict_types=1)", "language", "declare(strict_types=1);", "Must be the first statement of a file. Scalar type declarations then refuse conversions: passing \"5\" to an int parameter throws a TypeError.", "Doit être la première instruction du fichier. Les types scalaires refusent alors les conversions : passer \"5\" à un paramètre int lève une TypeError.", p`<?php
declare(strict_types=1);
function double(int $n): int { return $n * 2; }
echo double(5), "\n";
try {
    echo double("5");
} catch (TypeError $e) {
    echo "TypeError: ", $e->getMessage();
}`, { since: "7.0" }),
  e("const / define", "language", "const NAME = value;  define('NAME', value);", "Declares a constant: a value that can't change. Class constants use const inside a class.", "Déclare une constante : une valeur qui ne peut pas changer. Les constantes de classe utilisent const dans une classe.", p`<?php
const APP = "PHP Learn";
define("MAX_USERS", 100);
class Http { const OK = 200; }
echo APP, " ", MAX_USERS, " ", Http::OK, "\n";
echo PHP_INT_MAX, "\n", PHP_EOL === "\n" ? "unix" : "other";`),
  e("enum", "language", "enum Name: string { case A = 'a'; }", "A type with a fixed list of possible values. Backed enums have a string or int value.", "Un type avec une liste fixe de valeurs possibles. Les enums adossées ont une valeur string ou int.", p`<?php
enum Suit: string {
    case Hearts = "H";
    case Spades = "S";
    public function color(): string {
        return match ($this) {
            Suit::Hearts => "Red",
            Suit::Spades => "Black",
        };
    }
}
echo Suit::Hearts->color(), "\n";
echo Suit::from("S")->name, "\n";
var_dump(Suit::tryFrom("X"));`, { since: "8.1", version: "8.1", seeAlso: ["enum cases / from / tryFrom"] }),
  e("readonly", "language", "public readonly string $name;", "A property that can be set once, from inside the class, then never changed.", "Une propriété qu'on peut définir une fois, depuis la classe, puis jamais modifier.", p`<?php
final class Money {
    public function __construct(public readonly int $cents) {}
}
$m = new Money(500);
echo $m->cents, "\n";
try {
    $m->cents = 1;
} catch (Error $e) {
    echo get_class($e), ": ", $e->getMessage();
}`, { since: "8.1", version: "8.1" }),
];
