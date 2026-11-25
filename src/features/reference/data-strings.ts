import { e } from "./entry";
import type { RefEntry } from "./types";

const p = String.raw;

export const STRINGS: RefEntry[] = [
  e("strlen", "strings", "strlen(string $string): int", "Length of a string in bytes.", "Longueur d'une chaîne en octets.", p`<?php
echo strlen("hello"), "\n";
echo strlen("café"), "\n";
echo mb_strlen("café");`, { noteEn: "Accented letters take several bytes: use mb_strlen to count characters.", noteFr: "Les lettres accentuées prennent plusieurs octets : utilise mb_strlen pour compter les caractères.", seeAlso: ["mb_strlen"] }),
  e("mb_strlen", "strings", "mb_strlen(string $string, ?string $encoding = null): int", "Length in characters, UTF-8 aware.", "Longueur en caractères, compatible UTF-8.", p`<?php
$word = "naïve 🐘";
echo strlen($word), " bytes, ", mb_strlen($word), " characters";`, { seeAlso: ["strlen"] }),
  e("str_contains", "strings", "str_contains(string $haystack, string $needle): bool", "True if the text contains the given substring (case-sensitive).", "Vrai si le texte contient la sous-chaîne donnée (sensible à la casse).", p`<?php
$email = "ada@example.com";
var_dump(str_contains($email, "@"));
var_dump(str_contains($email, "Example"));`, { since: "8.0", version: "8.0", seeAlso: ["strpos", "str_starts_with"] }),
  e("str_starts_with", "strings", "str_starts_with(string $haystack, string $needle): bool", "True if the text starts with the given prefix.", "Vrai si le texte commence par le préfixe donné.", p`<?php
$url = "https://php.net";
var_dump(str_starts_with($url, "https://"));
var_dump(str_starts_with($url, "http://"));`, { since: "8.0", version: "8.0", seeAlso: ["str_ends_with"] }),
  e("str_ends_with", "strings", "str_ends_with(string $haystack, string $needle): bool", "True if the text ends with the given suffix.", "Vrai si le texte finit par le suffixe donné.", p`<?php
foreach (["photo.jpg", "notes.txt"] as $file) {
    echo $file, ": ", str_ends_with($file, ".jpg") ? "image" : "other", "\n";
}`, { since: "8.0", version: "8.0" }),
  e("substr", "strings", "substr(string $string, int $offset, ?int $length = null): string", "Extracts part of a string. A negative offset counts from the end.", "Extrait une partie d'une chaîne. Un offset négatif compte depuis la fin.", p`<?php
$s = "Hello, world";
echo substr($s, 0, 5), "\n";
echo substr($s, 7), "\n";
echo substr($s, -5, 3);`, { seeAlso: ["mb_substr", "strpos"] }),
  e("mb_substr", "strings", "mb_substr(string $string, int $start, ?int $length = null): string", "Like substr, counting characters instead of bytes.", "Comme substr, en comptant des caractères au lieu d'octets.", p`<?php
echo mb_substr("Ça va très bien", 0, 6);`),
  e("strpos", "strings", "strpos(string $haystack, string $needle, int $offset = 0): int|false", "Position of the first occurrence, or false if not found.", "Position de la première occurrence, ou false si absente.", p`<?php
$s = "banana";
var_dump(strpos($s, "an"));
var_dump(strpos($s, "x"));
if (strpos($s, "b") !== false) echo "found at the start";`, { noteEn: "Position 0 is falsy: always compare with !== false.", noteFr: "La position 0 est fausse : compare toujours avec !== false.", seeAlso: ["str_contains", "stripos"] }),
  e("str_replace", "strings", "str_replace(array|string $search, array|string $replace, string|array $subject): string|array", "Replaces every occurrence of a text (or a list of texts).", "Remplace chaque occurrence d'un texte (ou d'une liste de textes).", p`<?php
echo str_replace("cat", "dog", "cat and cat"), "\n";
echo str_replace(["a", "e"], ["4", "3"], "release"), "\n";
echo str_ireplace("HELLO", "Bye", "hello there");`, { seeAlso: ["preg_replace"] }),
  e("str_pad", "strings", "str_pad(string $string, int $length, string $pad = ' ', int $type = STR_PAD_RIGHT): string", "Pads a string to a given length, on the right, left or both sides.", "Complète une chaîne jusqu'à une longueur donnée, à droite, à gauche ou des deux côtés.", p`<?php
echo str_pad("7", 3, "0", STR_PAD_LEFT), "\n";
echo "[", str_pad("Hi", 8, "-", STR_PAD_BOTH), "]\n";
echo str_pad("Item", 10, "."), "9.99";`, { seeAlso: ["mb_str_pad", "sprintf"] }),
  e("mb_str_pad", "strings", "mb_str_pad(string $string, int $length, string $pad = ' ', int $type = STR_PAD_RIGHT): string", "str_pad that counts characters, not bytes.", "str_pad qui compte des caractères et non des octets.", p`<?php
echo "[", str_pad("été", 6, "*"), "]\n";
echo "[", mb_str_pad("été", 6, "*"), "]";`, { since: "8.3", version: "8.3" }),
  e("str_repeat", "strings", "str_repeat(string $string, int $times): string", "Repeats a string several times.", "Répète une chaîne plusieurs fois.", p`<?php
echo str_repeat("=-", 5), "\n";
for ($i = 1; $i <= 3; $i++) echo str_repeat("*", $i), "\n";`),
  e("explode", "strings", "explode(string $separator, string $string, int $limit = PHP_INT_MAX): array", "Splits a string into an array on a separator.", "Découpe une chaîne en tableau selon un séparateur.", p`<?php
$parts = explode(",", "red,green,blue");
print_r($parts);
[$user, $domain] = explode("@", "ada@php.net");
echo $domain;`, { seeAlso: ["implode", "preg_split", "str_split"] }),
  e("implode", "strings", "implode(string $separator, array $array): string", "Joins array items into a string with a separator.", "Joint les éléments d'un tableau en une chaîne avec un séparateur.", p`<?php
echo implode(", ", ["Ada", "Grace", "Linus"]), "\n";
echo implode(" > ", ["Home", "Blog", "Post"]);`, { seeAlso: ["explode"] }),
  e("str_split", "strings", "str_split(string $string, int $length = 1): array", "Splits a string into chunks of a given length.", "Découpe une chaîne en morceaux d'une longueur donnée.", p`<?php
print_r(str_split("abcdef", 2));
echo implode("-", str_split("4111111111111111", 4));`),
  e("trim", "strings", "trim(string $string, string $characters = \" \\n\\r\\t\\v\\0\"): string", "Removes whitespace (or given characters) from both ends. ltrim and rtrim do one side.", "Retire les espaces (ou les caractères donnés) aux deux bouts. ltrim et rtrim font un seul côté.", p`<?php
echo "[", trim("   hi  "), "]\n";
echo "[", rtrim("1,2,3,", ","), "]\n";
echo "[", ltrim("0042", "0"), "]";`, { seeAlso: ["mb_trim"] }),
  e("mb_trim", "strings", "mb_trim(string $string, ?string $characters = null): string", "Unicode-aware trim (also removes non-breaking and other Unicode spaces).", "trim compatible Unicode (retire aussi les espaces insécables et autres espaces Unicode).", p`<?php
$s = "\u{00A0}\u{3000}hello\u{00A0}";
echo strlen(trim($s)), " bytes after trim\n";
echo "[", mb_trim($s), "]";`, { since: "8.4", version: "8.4" }),
  e("strtolower / strtoupper", "strings", "strtolower(string $string): string", "Converts to lower or upper case (ASCII letters). Use mb_strtolower for accents.", "Convertit en minuscules ou majuscules (lettres ASCII). Utilise mb_strtolower pour les accents.", p`<?php
echo strtoupper("hello"), " ", strtolower("WORLD"), "\n";
echo mb_strtoupper("élève");`),
  e("ucfirst / ucwords", "strings", "ucfirst(string $string): string", "Upper-cases the first letter of the string, or of every word.", "Met en majuscule la première lettre de la chaîne, ou de chaque mot.", p`<?php
echo ucfirst("hello world"), "\n";
echo ucwords("hello big world"), "\n";
echo lcfirst("PHP");`),
  e("sprintf", "strings", "sprintf(string $format, mixed ...$values): string", "Builds a string from a format: %s text, %d integer, %.2f float with 2 decimals, %05d zero-padded.", "Construit une chaîne à partir d'un format : %s texte, %d entier, %.2f float à 2 décimales, %05d complété de zéros.", p`<?php
echo sprintf("%s is %d years old", "Ada", 36), "\n";
echo sprintf("Total: %.2f EUR", 12.5), "\n";
echo sprintf("Invoice #%05d", 42), "\n";
echo sprintf("[%-6s|%6s]", "left", "right");`, { seeAlso: ["printf", "number_format"] }),
  e("printf", "strings", "printf(string $format, mixed ...$values): int", "Like sprintf, but prints the result directly.", "Comme sprintf, mais affiche directement le résultat.", p`<?php
$items = ["Coffee" => 2.5, "Croissant" => 1.2];
foreach ($items as $name => $price) {
    printf("%-10s %5.2f\n", $name, $price);
}`),
  e("number_format", "strings", "number_format(float $num, int $decimals = 0, ?string $dec = '.', ?string $thousands = ','): string", "Formats a number with grouped thousands and fixed decimals.", "Formate un nombre avec séparateur de milliers et décimales fixes.", p`<?php
echo number_format(1234567.891), "\n";
echo number_format(1234567.891, 2), "\n";
echo number_format(1234567.891, 2, ",", " ");`),
  e("nl2br", "strings", "nl2br(string $string): string", "Inserts <br /> before each new line, for showing text in HTML.", "Insère <br /> avant chaque retour à la ligne, pour afficher du texte en HTML.", p`<?php
echo nl2br("line one\nline two");`),
  e("htmlspecialchars", "strings", "htmlspecialchars(string $string, int $flags = ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML401): string", "Escapes & < > \" ' so user text can't inject HTML or scripts (XSS).", "Échappe & < > \" ' pour que le texte d'un utilisateur ne puisse pas injecter du HTML ou des scripts (XSS).", p`<?php
$comment = '<script>alert("hi")</script> & more';
echo htmlspecialchars($comment);`, { noteEn: "Escape every value you print into HTML, at the moment you print it.", noteFr: "Échappe chaque valeur que tu affiches dans du HTML, au moment où tu l'affiches." }),
  e("wordwrap", "strings", "wordwrap(string $string, int $width = 75, string $break = \"\\n\", bool $cut = false): string", "Wraps text to a given line width.", "Coupe un texte à une largeur de ligne donnée.", p`<?php
echo wordwrap("The quick brown fox jumps over the lazy dog", 15, "\n", true);`),
  e("strrev", "strings", "strrev(string $string): string", "Reverses a string (byte by byte).", "Inverse une chaîne (octet par octet).", p`<?php
echo strrev("stressed"), "\n";
$w = "level";
echo $w === strrev($w) ? "palindrome" : "no";`),
  e("similar_text / levenshtein", "strings", "levenshtein(string $a, string $b): int", "Measure how close two strings are: levenshtein counts the edits needed, similar_text counts common characters.", "Mesurent la proximité de deux chaînes : levenshtein compte les modifications nécessaires, similar_text les caractères communs.", p`<?php
echo levenshtein("kitten", "sitting"), " edits\n";
similar_text("Hello", "World", $percent);
echo round($percent), "% similar\n";
$words = ["apple", "banana", "cherry"];
$input = "banan";
usort($words, fn($a, $b) => levenshtein($input, $a) <=> levenshtein($input, $b));
echo "Did you mean ", $words[0], "?";`),
  e("str_word_count", "strings", "str_word_count(string $string): int", "Counts the words in a string (ASCII letters).", "Compte les mots d'une chaîne (lettres ASCII).", p`<?php
echo str_word_count("PHP is a popular general-purpose language");`),
  e("strtr", "strings", "strtr(string $string, array $replace_pairs): string", "strtr replaces several substrings at once, longest first, without re-replacing.", "strtr remplace plusieurs sous-chaînes d'un coup, les plus longues d'abord, sans remplacer deux fois.", p`<?php
$template = "Hello {name}, you owe {amount}.";
echo strtr($template, ["{name}" => "Ada", "{amount}" => "12 EUR"]);`, { seeAlso: ["str_replace"] }),
];
