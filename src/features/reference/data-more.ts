import { e } from "./entry";
import type { RefEntry } from "./types";

const p = String.raw;

export const DATES: RefEntry[] = [
  e("date", "dates", "date(string $format, ?int $timestamp = null): string", "Formats a timestamp: Y year, m month, d day, H hour, i minutes, s seconds, l day name, D short day.", "Formate un timestamp : Y année, m mois, d jour, H heure, i minutes, s secondes, l nom du jour, D jour court.", p`<?php
$ts = mktime(14, 30, 0, 7, 14, 2025);
echo date("Y-m-d H:i", $ts), "\n";
echo date("l j F Y", $ts), "\n";
echo date("D, d M y", $ts);`, { noteEn: "Without a timestamp it uses the current time, in the timezone from date_default_timezone_set().", noteFr: "Sans timestamp, il utilise l'heure actuelle, dans le fuseau défini par date_default_timezone_set()." }),
  e("mktime", "dates", "mktime(?int $hour, ?int $minute = null, ?int $second = null, ?int $month = null, ?int $day = null, ?int $year = null): int|false", "Builds a Unix timestamp from parts. Overflowing values roll over.", "Construit un timestamp Unix à partir de ses parties. Les valeurs qui débordent passent au mois suivant.", p`<?php
echo date("Y-m-d", mktime(0, 0, 0, 1, 32, 2025)), "\n";
echo date("Y-m-d", mktime(0, 0, 0, 3, 0, 2024));`),
  e("strtotime", "dates", "strtotime(string $datetime, ?int $baseTimestamp = null): int|false", "Parses English date text (\"+1 week\", \"next monday\") into a timestamp.", "Lit une date en texte anglais (\"+1 week\", \"next monday\") et donne un timestamp.", p`<?php
$base = strtotime("2025-01-15");
echo date("Y-m-d", strtotime("+1 week", $base)), "\n";
echo date("Y-m-d", strtotime("next monday", $base)), "\n";
echo date("Y-m-d", strtotime("last day of next month", $base));`),
  e("DateTimeImmutable", "dates", "new DateTimeImmutable(string $datetime = 'now', ?DateTimeZone $timezone = null)", "An immutable date object: modify() and add() return a new date instead of changing it.", "Un objet date immuable : modify() et add() renvoient une nouvelle date au lieu de la modifier.", p`<?php
$start = new DateTimeImmutable("2025-03-28 09:00", new DateTimeZone("Europe/Paris"));
$end = $start->modify("+3 days");
echo $start->format("D d M H:i T"), "\n";
echo $end->format("D d M H:i T"), "\n";
echo $start->format(DATE_ATOM);`, { noteEn: "Prefer DateTimeImmutable over DateTime: no surprise changes to a shared date.", noteFr: "Préfère DateTimeImmutable à DateTime : pas de modification surprise d'une date partagée." }),
  e("DateInterval / diff", "dates", "$a->diff($b): DateInterval  new DateInterval('P1M2D')", "diff() measures the gap between two dates; DateInterval describes a duration (P1Y2M3D, PT4H).", "diff() mesure l'écart entre deux dates ; DateInterval décrit une durée (P1Y2M3D, PT4H).", p`<?php
$birth = new DateTimeImmutable("1990-05-20");
$today = new DateTimeImmutable("2025-11-25");
$age = $birth->diff($today);
echo "Age: ", $age->y, " years, ", $age->m, " months\n";
echo "Total days: ", $age->days, "\n";
echo $today->add(new DateInterval("P1M10D"))->format("Y-m-d"), "\n";
echo $age->format("%y years %d days");`),
  e("date_diff / checkdate", "dates", "checkdate(int $month, int $day, int $year): bool", "checkdate validates a calendar date; date_diff is the function form of ->diff().", "checkdate valide une date du calendrier ; date_diff est la forme fonction de ->diff().", p`<?php
var_dump(checkdate(2, 29, 2024), checkdate(2, 29, 2025));
echo date_diff(date_create("2025-01-01"), date_create("2025-12-25"))->days, " days";`),
  e("DatePeriod", "dates", "new DatePeriod(DateTimeInterface $start, DateInterval $interval, int|DateTimeInterface $end)", "Iterates over dates at a regular interval.", "Parcourt des dates à intervalle régulier.", p`<?php
$period = new DatePeriod(new DateTimeImmutable("2025-01-06"), new DateInterval("P1W"), 3);
foreach ($period as $d) echo $d->format("D d M"), "\n";`),
];

export const JSON: RefEntry[] = [
  e("json_encode", "json", "json_encode(mixed $value, int $flags = 0, int $depth = 512): string|false", "Converts PHP values to a JSON string. JSON_PRETTY_PRINT and JSON_UNESCAPED_UNICODE are handy flags.", "Convertit des valeurs PHP en chaîne JSON. JSON_PRETTY_PRINT et JSON_UNESCAPED_UNICODE sont des options pratiques.", p`<?php
$user = ["name" => "Zoé", "age" => 30, "tags" => ["admin"], "active" => true];
echo json_encode($user), "\n";
echo json_encode($user, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);`),
  e("json_decode", "json", "json_decode(string $json, ?bool $associative = null, int $depth = 512, int $flags = 0): mixed", "Parses JSON. Pass true to get arrays instead of objects; JSON_THROW_ON_ERROR throws on bad input.", "Lit du JSON. Passe true pour obtenir des tableaux au lieu d'objets ; JSON_THROW_ON_ERROR lève une exception sur une entrée invalide.", p`<?php
$json = '{"title":"PHP","year":1995,"tags":["web","server"]}';
$data = json_decode($json, true);
echo $data["title"], " ", $data["year"], " ", $data["tags"][0], "\n";
$obj = json_decode($json);
echo $obj->title, "\n";
try {
    json_decode("{bad json}", true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    echo "JsonException: ", $e->getMessage();
}`, { seeAlso: ["json_validate", "json_last_error_msg"] }),
  e("json_validate", "json", "json_validate(string $json): bool", "Checks that a string is valid JSON without decoding it (saves memory).", "Vérifie qu'une chaîne est du JSON valide sans la décoder (économise de la mémoire).", p`<?php
var_dump(json_validate('{"ok": true}'));
var_dump(json_validate("{'single': 'quotes'}"));`, { since: "8.3", version: "8.3" }),
  e("json_last_error_msg", "json", "json_last_error_msg(): string", "The message for the last JSON error (when not using JSON_THROW_ON_ERROR).", "Le message de la dernière erreur JSON (sans JSON_THROW_ON_ERROR).", p`<?php
$result = json_decode("[1, 2,", true);
var_dump($result);
echo json_last_error_msg();`),
  e("JsonSerializable", "json", "class C implements JsonSerializable { public function jsonSerialize(): mixed }", "Controls how an object is turned into JSON.", "Contrôle comment un objet est transformé en JSON.", p`<?php
class Money implements JsonSerializable {
    public function __construct(private int $cents, private string $currency) {}
    public function jsonSerialize(): array {
        return ["amount" => $this->cents / 100, "currency" => $this->currency];
    }
}
echo json_encode(["price" => new Money(1999, "EUR")]);`, { version: "8.0" }),
];

export const REGEX: RefEntry[] = [
  e("preg_match", "regex", "preg_match(string $pattern, string $subject, array &$matches = null): int|false", "Tests a regular expression; fills $matches with the full match and captured groups.", "Teste une expression régulière ; remplit $matches avec la correspondance et les groupes capturés.", p`<?php
if (preg_match('/(\d{4})-(\d{2})-(\d{2})/', "Released 2025-11-20", $m)) {
    echo "Year $m[1], month $m[2], day $m[3]\n";
}
var_dump(preg_match('/^[a-z0-9_]{3,16}$/', "ada_l"));
preg_match('/(?<user>\w+)@(?<host>[\w.]+)/', "mail ada@php.net", $m);
echo $m["host"];`),
  e("preg_match_all", "regex", "preg_match_all(string $pattern, string $subject, array &$matches = null): int|false", "Finds every match; returns how many.", "Trouve toutes les correspondances ; renvoie leur nombre.", p`<?php
$text = "Call 555-1234 or 555-9876";
$n = preg_match_all('/\d{3}-\d{4}/', $text, $m);
echo "$n numbers: ", implode(", ", $m[0]);`),
  e("preg_replace", "regex", "preg_replace(string|array $pattern, string|array $replacement, string|array $subject): string|array|null", "Replaces matches; $1, $2… refer to captured groups.", "Remplace les correspondances ; $1, $2… renvoient aux groupes capturés.", p`<?php
echo preg_replace('/\s+/', " ", "too    many   spaces"), "\n";
echo preg_replace('/(\d{2})\/(\d{2})\/(\d{4})/', '$3-$2-$1', "Born 25/12/1990");`),
  e("preg_replace_callback", "regex", "preg_replace_callback(string $pattern, callable $callback, string $subject): string", "Replaces each match with the result of a function.", "Remplace chaque correspondance par le résultat d'une fonction.", p`<?php
echo preg_replace_callback('/\d+/', fn($m) => $m[0] * 2, "3 apples and 10 pears");`, { version: "7.4" }),
  e("preg_split", "regex", "preg_split(string $pattern, string $subject, int $limit = -1, int $flags = 0): array|false", "Splits a string on a regular expression.", "Découpe une chaîne selon une expression régulière.", p`<?php
print_r(preg_split('/[\s,;]+/', "red, green;blue  yellow"));`),
  e("preg_quote", "regex", "preg_quote(string $str, ?string $delimiter = null): string", "Escapes special regex characters in a string, to match it literally.", "Échappe les caractères spéciaux d'une chaîne pour la chercher telle quelle.", p`<?php
$search = "1.5 (beta)";
$pattern = "/" . preg_quote($search, "/") . "/";
echo $pattern, "\n";
var_dump(preg_match($pattern, "version 1.5 (beta) is out"));`),
];

export const FILES: RefEntry[] = [
  e("file_put_contents", "files", "file_put_contents(string $filename, mixed $data, int $flags = 0): int|false", "Writes data to a file (creates or replaces it). FILE_APPEND adds to the end.", "Écrit des données dans un fichier (le crée ou le remplace). FILE_APPEND ajoute à la fin.", p`<?php
$bytes = file_put_contents("/tmp/log.txt", "first line\n");
file_put_contents("/tmp/log.txt", "second line\n", FILE_APPEND);
echo "$bytes bytes, then:\n", file_get_contents("/tmp/log.txt");`),
  e("file_get_contents", "files", "file_get_contents(string $filename): string|false", "Reads a whole file into a string.", "Lit tout un fichier dans une chaîne.", p`<?php
file_put_contents("/tmp/hello.txt", "Hello from a file");
echo file_get_contents("/tmp/hello.txt");`),
  e("file", "files", "file(string $filename, int $flags = 0): array|false", "Reads a file into an array of lines.", "Lit un fichier dans un tableau de lignes.", p`<?php
file_put_contents("/tmp/todo.txt", "buy milk\ncall mum\nship it\n");
foreach (file("/tmp/todo.txt", FILE_IGNORE_NEW_LINES) as $i => $line) {
    echo $i + 1, ". $line\n";
}`),
  e("fopen / fgets / fclose", "files", "fopen(string $filename, string $mode): resource|false", "Opens a file to read or write it piece by piece (good for big files).", "Ouvre un fichier pour le lire ou l'écrire morceau par morceau (bien pour les gros fichiers).", p`<?php
file_put_contents("/tmp/data.csv", "name,score\nada,90\nlinus,85\n");
$f = fopen("/tmp/data.csv", "r");
$header = fgetcsv($f, escape: "");
while (($row = fgetcsv($f, escape: "")) !== false) {
    $rec = array_combine($header, $row);
    echo $rec["name"], ": ", $rec["score"], "\n";
}
fclose($f);`, { version: "8.0" }),
  e("is_file / file_exists / unlink", "files", "file_exists(string $filename): bool", "Check if a path exists (is_file: a regular file, is_dir: a folder); unlink deletes a file.", "Vérifient si un chemin existe (is_file : un fichier, is_dir : un dossier) ; unlink supprime un fichier.", p`<?php
file_put_contents("/tmp/x.txt", "x");
var_dump(is_file("/tmp/x.txt"), is_dir("/tmp"), file_exists("/tmp/missing"));
unlink("/tmp/x.txt");
var_dump(file_exists("/tmp/x.txt"));`),
  e("mkdir / glob / scandir", "files", "mkdir(string $directory, int $permissions = 0777, bool $recursive = false): bool", "Create folders and list files (glob matches a pattern like *.txt).", "Créent des dossiers et listent des fichiers (glob filtre avec un motif comme *.txt).", p`<?php
@mkdir("/tmp/demo/notes", 0777, true);
foreach (["a.txt", "b.txt", "c.md"] as $f) file_put_contents("/tmp/demo/notes/$f", $f);
print_r(array_map("basename", glob("/tmp/demo/notes/*.txt")));
print_r(array_values(array_diff(scandir("/tmp/demo/notes"), [".", ".."])));`),
  e("pathinfo / basename", "files", "pathinfo(string $path, int $flags = PATHINFO_ALL): array|string", "Splits a path into folder, file name and extension.", "Découpe un chemin en dossier, nom de fichier et extension.", p`<?php
print_r(pathinfo("/var/www/uploads/photo.final.jpg"));
echo basename("/var/www/index.php"), " ", dirname("/var/www/index.php");`),
];

export const ERRORS: RefEntry[] = [
  e("Exception methods", "errors", "$e->getMessage()  getCode()  getFile()  getLine()  getTrace()  getPrevious()", "What an exception tells you: message, code, where it was thrown, the call stack and the cause.", "Ce qu'une exception t'apprend : message, code, où elle a été levée, la pile d'appels et la cause.", p`<?php
function load(string $id) {
    throw new RuntimeException("Record $id not found", 404);
}
function show() { load("42"); }
try {
    show();
} catch (RuntimeException $e) {
    echo get_class($e), ": ", $e->getMessage(), " (code ", $e->getCode(), ")\n";
    echo "line ", $e->getLine(), "\n";
    foreach ($e->getTrace() as $i => $frame) echo "#$i ", $frame["function"], "()\n";
}`),
  e("custom exceptions", "errors", "class MyError extends Exception {}", "Extend Exception (or a more specific class) to describe your own failures, and wrap causes with $previous.", "Étends Exception (ou une classe plus précise) pour décrire tes propres échecs, et enveloppe les causes avec $previous.", p`<?php
class PaymentFailed extends RuntimeException {}
function pay(int $cents) {
    try {
        if ($cents <= 0) throw new InvalidArgumentException("amount must be positive");
    } catch (InvalidArgumentException $e) {
        throw new PaymentFailed("Payment refused", 0, $e);
    }
}
try {
    pay(0);
} catch (PaymentFailed $e) {
    echo $e->getMessage(), " because ", $e->getPrevious()->getMessage();
}`),
  e("trigger_error", "errors", "trigger_error(string $message, int $error_level = E_USER_NOTICE): true", "Raises a user-level notice, warning or deprecation.", "Déclenche une notice, un avertissement ou une dépréciation utilisateur.", p`<?php
function oldApi() {
    trigger_error("oldApi() is deprecated, use newApi()", E_USER_DEPRECATED);
    return "result";
}
echo oldApi();`),
  e("set_error_handler", "errors", "set_error_handler(?callable $callback, int $error_levels = E_ALL): ?callable", "Routes warnings and notices to your own function, e.g. to turn them into exceptions.", "Envoie les avertissements et notices vers ta propre fonction, par exemple pour les transformer en exceptions.", p`<?php
set_error_handler(function (int $no, string $msg, string $file, int $line) {
    throw new ErrorException($msg, 0, $no, $file, $line);
});
try {
    $list = [1, 2];
    echo $list[5];
} catch (ErrorException $e) {
    echo "Converted: ", $e->getMessage();
}
restore_error_handler();`),
  e("error_reporting / @", "errors", "error_reporting(?int $error_level = null): int", "Chooses which errors are reported. The @ operator silences one expression (avoid it).", "Choisit quelles erreurs sont signalées. L'opérateur @ fait taire une expression (à éviter).", p`<?php
echo error_reporting() === E_ALL ? "Reporting everything\n" : "Partial\n";
$value = @$undefined["key"];
var_dump($value);`),
  e("Throwable hierarchy", "errors", "Throwable → Error | Exception", "Error is for engine problems (TypeError, DivisionByZeroError…), Exception for your app's failures. catch (Throwable) catches both.", "Error sert aux problèmes du moteur (TypeError, DivisionByZeroError…), Exception aux échecs de ton appli. catch (Throwable) attrape les deux.", p`<?php
foreach ([fn() => intdiv(1, 0), fn() => strlen(), fn() => throw new LogicException("oops")] as $risky) {
    try {
        $risky();
    } catch (Throwable $t) {
        echo get_class($t), " is ", $t instanceof Error ? "an Error" : "an Exception", "\n";
    }
}`, { version: "8.0" }),
];
