import { e } from "./entry";
import type { RefEntry } from "./types";

const p = String.raw;

export const ARRAYS: RefEntry[] = [
  e("count", "arrays", "count(Countable|array $value, int $mode = COUNT_NORMAL): int", "Number of items in an array.", "Nombre d'éléments d'un tableau.", p`<?php
echo count([1, 2, 3]), "\n";
echo count(["a" => [1, 2], "b" => [3]], COUNT_RECURSIVE);`),
  e("array_map", "arrays", "array_map(?callable $callback, array $array, array ...$arrays): array", "Applies a function to every item and returns the new array.", "Applique une fonction à chaque élément et renvoie le nouveau tableau.", p`<?php
$prices = [10, 20, 30];
$withTax = array_map(fn($p) => $p * 1.2, $prices);
print_r($withTax);
print_r(array_map(fn($a, $b) => "$a-$b", ["x", "y"], [1, 2]));`, { version: "7.4", seeAlso: ["array_filter", "array_reduce"] }),
  e("array_filter", "arrays", "array_filter(array $array, ?callable $callback = null, int $mode = 0): array", "Keeps only the items for which the callback returns true. Keys are preserved.", "Ne garde que les éléments pour lesquels le callback renvoie true. Les clés sont conservées.", p`<?php
$numbers = [1, 2, 3, 4, 5, 6];
$even = array_filter($numbers, fn($n) => $n % 2 === 0);
print_r($even);
print_r(array_values($even));
print_r(array_filter(["a", "", null, "b"]));`, { version: "7.4", noteEn: "Keys are kept: wrap in array_values() to get a clean list.", noteFr: "Les clés sont conservées : enveloppe dans array_values() pour obtenir une liste propre." }),
  e("array_reduce", "arrays", "array_reduce(array $array, callable $callback, mixed $initial = null): mixed", "Combines all items into one value, carrying an accumulator.", "Combine tous les éléments en une seule valeur, en transportant un accumulateur.", p`<?php
$cart = [["price" => 5, "qty" => 2], ["price" => 3, "qty" => 4]];
$total = array_reduce($cart, fn($sum, $item) => $sum + $item["price"] * $item["qty"], 0);
echo "Total: $total";`, { version: "7.4" }),
  e("array_keys / array_values", "arrays", "array_keys(array $array): array", "array_keys returns the keys, array_values the values (reindexed from 0).", "array_keys renvoie les clés, array_values les valeurs (réindexées à partir de 0).", p`<?php
$ages = ["Ada" => 36, "Linus" => 54];
print_r(array_keys($ages));
print_r(array_values($ages));`),
  e("array_merge", "arrays", "array_merge(array ...$arrays): array", "Joins arrays. String keys are overwritten by later arrays; numeric keys are renumbered.", "Joint des tableaux. Les clés texte sont écrasées par les suivantes ; les clés numériques sont renumérotées.", p`<?php
print_r(array_merge([1, 2], [3]));
print_r(array_merge(["color" => "red", "size" => "M"], ["color" => "blue"]));
print_r([...[1, 2], ...[3, 4]]);`, { seeAlso: ["array_combine"] }),
  e("array_combine", "arrays", "array_combine(array $keys, array $values): array", "Builds an array from a list of keys and a list of values.", "Construit un tableau à partir d'une liste de clés et d'une liste de valeurs.", p`<?php
print_r(array_combine(["name", "lang"], ["Rasmus", "PHP"]));`),
  e("array_flip", "arrays", "array_flip(array $array): array", "Swaps keys and values.", "Échange les clés et les valeurs.", p`<?php
print_r(array_flip(["a" => 1, "b" => 2]));`),
  e("array_slice", "arrays", "array_slice(array $array, int $offset, ?int $length = null, bool $preserve_keys = false): array", "Returns a part of an array, without changing the original.", "Renvoie une partie d'un tableau, sans modifier l'original.", p`<?php
$letters = ["a", "b", "c", "d", "e"];
print_r(array_slice($letters, 1, 3));
print_r(array_slice($letters, -2));`),
  e("array_splice", "arrays", "array_splice(array &$array, int $offset, ?int $length = null, mixed $replacement = []): array", "Removes (and optionally replaces) a part of an array, in place. Returns the removed items.", "Retire (et remplace éventuellement) une partie d'un tableau, sur place. Renvoie les éléments retirés.", p`<?php
$queue = ["a", "b", "c", "d"];
$removed = array_splice($queue, 1, 2, ["X"]);
print_r($queue);
print_r($removed);`),
  e("in_array", "arrays", "in_array(mixed $needle, array $haystack, bool $strict = false): bool", "True if a value is in the array. Pass true as third argument to compare strictly.", "Vrai si une valeur est dans le tableau. Passe true en troisième argument pour comparer strictement.", p`<?php
$allowed = ["jpg", "png"];
var_dump(in_array("png", $allowed));
var_dump(in_array("1", [1, 2, 3]));
var_dump(in_array("1", [1, 2, 3], true));`),
  e("array_search", "arrays", "array_search(mixed $needle, array $haystack, bool $strict = false): int|string|false", "Returns the key of the first matching value, or false.", "Renvoie la clé de la première valeur correspondante, ou false.", p`<?php
$colors = ["r" => "red", "g" => "green"];
var_dump(array_search("green", $colors));
var_dump(array_search("blue", $colors));`),
  e("array_key_exists", "arrays", "array_key_exists(string|int $key, array $array): bool", "True if the key exists, even when its value is null (unlike isset).", "Vrai si la clé existe, même si sa valeur est null (contrairement à isset).", p`<?php
$data = ["email" => null];
var_dump(array_key_exists("email", $data));
var_dump(isset($data["email"]));`, { seeAlso: ["isset"] }),
  e("array_unique", "arrays", "array_unique(array $array, int $flags = SORT_STRING): array", "Removes duplicate values (keeps the first key).", "Retire les doublons (garde la première clé).", p`<?php
print_r(array_values(array_unique(["php", "js", "php", "go", "js"])));`),
  e("array_column", "arrays", "array_column(array $array, int|string|null $column_key, int|string|null $index_key = null): array", "Picks one column from a list of rows, optionally indexed by another column.", "Extrait une colonne d'une liste de lignes, éventuellement indexée par une autre colonne.", p`<?php
$users = [
    ["id" => 3, "name" => "Ada"],
    ["id" => 7, "name" => "Linus"],
];
print_r(array_column($users, "name"));
print_r(array_column($users, "name", "id"));`),
  e("array_chunk", "arrays", "array_chunk(array $array, int $length, bool $preserve_keys = false): array", "Splits an array into chunks of a given size.", "Découpe un tableau en morceaux d'une taille donnée.", p`<?php
foreach (array_chunk(range(1, 7), 3) as $i => $page) {
    echo "Page ", $i + 1, ": ", implode(",", $page), "\n";
}`),
  e("array_fill / array_fill_keys", "arrays", "array_fill(int $start_index, int $count, mixed $value): array", "Creates an array filled with the same value.", "Crée un tableau rempli avec la même valeur.", p`<?php
print_r(array_fill(0, 3, "?"));
print_r(array_fill_keys(["a", "b"], 0));`),
  e("range", "arrays", "range(string|int|float $start, string|int|float $end, int|float $step = 1): array", "Creates an array of numbers or letters from start to end.", "Crée un tableau de nombres ou de lettres de début à fin.", p`<?php
echo implode(" ", range(1, 5)), "\n";
echo implode(" ", range(0, 20, 5)), "\n";
echo implode("", range("a", "e"));`),
  e("sort / rsort", "arrays", "sort(array &$array, int $flags = SORT_REGULAR): true", "Sorts a list in place, ascending (sort) or descending (rsort). Keys are reset.", "Trie une liste sur place, croissant (sort) ou décroissant (rsort). Les clés sont réinitialisées.", p`<?php
$n = [5, 3, 9, 1];
sort($n);
echo implode(",", $n), "\n";
rsort($n);
echo implode(",", $n), "\n";
$words = ["banana", "Apple", "cherry"];
sort($words, SORT_FLAG_CASE | SORT_STRING);
echo implode(",", $words);`, { noteEn: "Sorting functions change the array itself and return true, not the sorted array.", noteFr: "Les fonctions de tri modifient le tableau lui-même et renvoient true, pas le tableau trié." }),
  e("asort / arsort / ksort / krsort", "arrays", "asort(array &$array): true", "Sort associative arrays: asort/arsort by value, ksort/krsort by key, keeping key-value pairs.", "Trient les tableaux associatifs : asort/arsort par valeur, ksort/krsort par clé, en gardant les paires.", p`<?php
$scores = ["Bob" => 12, "Ada" => 30, "Cy" => 21];
arsort($scores);
print_r($scores);
ksort($scores);
print_r($scores);`),
  e("usort / uasort / uksort", "arrays", "usort(array &$array, callable $callback): true", "Sort with your own comparison function (return <0, 0 or >0). <=> makes it easy.", "Trient avec ta propre fonction de comparaison (renvoie <0, 0 ou >0). <=> rend ça facile.", p`<?php
$books = [["t" => "Dune", "y" => 1965], ["t" => "Neuromancer", "y" => 1984], ["t" => "Foundation", "y" => 1951]];
usort($books, fn($a, $b) => $a["y"] <=> $b["y"]);
echo implode(", ", array_column($books, "t")), "\n";
usort($books, fn($a, $b) => [strlen($a["t"]), $a["t"]] <=> [strlen($b["t"]), $b["t"]]);
echo implode(", ", array_column($books, "t"));`, { version: "7.4", seeAlso: ["<=>"] }),
  e("array_sum / array_product", "arrays", "array_sum(array $array): int|float", "Adds (or multiplies) all the values.", "Additionne (ou multiplie) toutes les valeurs.", p`<?php
echo array_sum([1, 2, 3.5]), "\n";
echo array_product([2, 3, 4]);`),
  e("array_reverse", "arrays", "array_reverse(array $array, bool $preserve_keys = false): array", "Returns the array in reverse order.", "Renvoie le tableau dans l'ordre inverse.", p`<?php
echo implode(" ", array_reverse(["one", "two", "three"]));`),
  e("array_push / array_pop / array_shift / array_unshift", "arrays", "array_push(array &$array, mixed ...$values): int", "Add or remove at the end (push/pop) or at the start (unshift/shift).", "Ajoutent ou retirent à la fin (push/pop) ou au début (unshift/shift).", p`<?php
$stack = [1, 2];
array_push($stack, 3);
$stack[] = 4;
echo array_pop($stack), " ", array_shift($stack), "\n";
array_unshift($stack, 0);
print_r($stack);`),
  e("array_is_list", "arrays", "array_is_list(array $array): bool", "True when the keys are 0, 1, 2… in order (a list, not a dictionary).", "Vrai quand les clés sont 0, 1, 2… dans l'ordre (une liste, pas un dictionnaire).", p`<?php
var_dump(array_is_list(["a", "b"]));
var_dump(array_is_list([1 => "a", 0 => "b"]));
var_dump(array_is_list(["x" => 1]));`, { since: "8.1", version: "8.1" }),
  e("array_find / array_find_key", "arrays", "array_find(array $array, callable $callback): mixed", "Returns the first value (or key) for which the callback returns true, or null.", "Renvoie la première valeur (ou clé) pour laquelle le callback renvoie true, ou null.", p`<?php
$users = ["u1" => "ada", "u2" => "linus", "u3" => "lea"];
var_dump(array_find($users, fn($name) => str_starts_with($name, "l")));
var_dump(array_find_key($users, fn($name) => $name === "lea"));
var_dump(array_find($users, fn($name) => $name === "bob"));`, { since: "8.4", version: "8.4" }),
  e("array_any / array_all", "arrays", "array_any(array $array, callable $callback): bool", "array_any: does at least one item pass? array_all: do all items pass?", "array_any : au moins un élément passe-t-il ? array_all : tous passent-ils ?", p`<?php
$ages = [12, 25, 40];
var_dump(array_any($ages, fn($a) => $a < 18));
var_dump(array_all($ages, fn($a) => $a < 18));`, { since: "8.4", version: "8.4" }),
  e("array_first / array_last", "arrays", "array_first(array $array): mixed", "The first or last value of an array (null when empty), whatever the keys.", "La première ou la dernière valeur d'un tableau (null s'il est vide), quelles que soient les clés.", p`<?php
$scores = ["bob" => 12, "ada" => 30, "cy" => 21];
var_dump(array_first($scores));
var_dump(array_last($scores));
var_dump(array_first([]));`, { since: "8.5", version: "8.5" }),
  e("compact / extract", "arrays", "compact(string|array $var_name, ...$var_names): array", "compact builds an array from variable names; extract does the opposite.", "compact construit un tableau à partir de noms de variables ; extract fait l'inverse.", p`<?php
$name = "Ada";
$age = 36;
print_r(compact("name", "age"));
extract(["city" => "London"]);
echo $city;`, { noteEn: "Never extract() user input: it can overwrite any variable.", noteFr: "N'utilise jamais extract() sur des données utilisateur : il peut écraser n'importe quelle variable." }),
  e("array_walk", "arrays", "array_walk(array|object &$array, callable $callback, mixed $arg = null): true", "Calls a function on each item with its key; can modify items by reference.", "Appelle une fonction sur chaque élément avec sa clé ; peut modifier les éléments par référence.", p`<?php
$stock = ["apples" => 3, "pears" => 0];
array_walk($stock, function (&$qty, $fruit) {
    $qty = $qty > 0 ? "$qty in stock" : "sold out";
});
print_r($stock);`),
  e("array_diff / array_intersect", "arrays", "array_diff(array $array, array ...$arrays): array", "array_diff: values not in the other arrays. array_intersect: values in all of them.", "array_diff : valeurs absentes des autres tableaux. array_intersect : valeurs présentes dans tous.", p`<?php
$a = ["php", "js", "go"];
$b = ["js", "rust"];
print_r(array_values(array_diff($a, $b)));
print_r(array_values(array_intersect($a, $b)));`),
];
