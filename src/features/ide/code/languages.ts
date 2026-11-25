import type { CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import type { Extension } from "@codemirror/state";
import { json } from "@codemirror/lang-json";
import { markdown } from "@codemirror/lang-markdown";
import { php } from "@codemirror/lang-php";

export type LangId = "php" | "php-plain" | "json" | "markdown" | "text";

export function langOf(path: string): { id: LangId; label: string } {
  const ext = path.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "php" || ext === "phtml") return { id: "php", label: "PHP" };
  if (ext === "json") return { id: "json", label: "JSON" };
  if (ext === "md") return { id: "markdown", label: "Markdown" };
  return { id: "text", label: "Plain text" };
}

export function langExtension(id: LangId): Extension {
  if (id === "php") return php();
  // Fragments without the <?php tag (docs snippets).
  if (id === "php-plain") return php({ plain: true });
  if (id === "json") return json();
  if (id === "markdown") return markdown();
  return [];
}

const KEYWORDS = (
  "abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enum extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield true false self parent mixed never void int float string bool iterable object"
).split(" ");

/** The functions people reach for most, with a short signature. */
const FUNCTIONS: Array<[string, string]> = [
  ["strlen", "(string $s): int"], ["mb_strlen", "(string $s): int"], ["str_contains", "(string $haystack, string $needle): bool"],
  ["str_starts_with", "(string $h, string $n): bool"], ["str_ends_with", "(string $h, string $n): bool"], ["substr", "(string $s, int $offset, ?int $length = null): string"],
  ["strpos", "(string $h, string $n, int $offset = 0): int|false"], ["str_replace", "(search, replace, subject): string|array"], ["str_pad", "(string $s, int $length, string $pad = ' ', int $type = STR_PAD_RIGHT)"],
  ["str_repeat", "(string $s, int $times): string"], ["str_split", "(string $s, int $length = 1): array"], ["strtolower", "(string $s): string"], ["strtoupper", "(string $s): string"],
  ["ucfirst", "(string $s): string"], ["ucwords", "(string $s): string"], ["lcfirst", "(string $s): string"], ["trim", "(string $s, string $chars = \" \\n\\r\\t\\v\\0\"): string"],
  ["ltrim", "(string $s): string"], ["rtrim", "(string $s): string"], ["explode", "(string $separator, string $s, int $limit = PHP_INT_MAX): array"],
  ["implode", "(string $glue, array $pieces): string"], ["sprintf", "(string $format, mixed ...$values): string"], ["printf", "(string $format, mixed ...$values): int"],
  ["number_format", "(float $n, int $decimals = 0, ?string $dec = '.', ?string $thousands = ','): string"], ["nl2br", "(string $s): string"], ["htmlspecialchars", "(string $s, int $flags = ENT_QUOTES): string"],
  ["strrev", "(string $s): string"], ["wordwrap", "(string $s, int $width = 75, string $break = \"\\n\")"], ["str_word_count", "(string $s): int"], ["mb_strtoupper", "(string $s): string"],
  ["mb_substr", "(string $s, int $start, ?int $length = null): string"], ["mb_str_pad", "(string $s, int $length, ...) — PHP 8.3"], ["mb_trim", "(string $s): string — PHP 8.4"],
  ["count", "(array|Countable $a): int"], ["array_map", "(?callable $fn, array $a, array ...$more): array"], ["array_filter", "(array $a, ?callable $fn = null, int $mode = 0): array"],
  ["array_reduce", "(array $a, callable $fn, mixed $initial = null): mixed"], ["array_keys", "(array $a): array"], ["array_values", "(array $a): array"], ["array_merge", "(array ...$arrays): array"],
  ["array_combine", "(array $keys, array $values): array"], ["array_flip", "(array $a): array"], ["array_slice", "(array $a, int $offset, ?int $length = null): array"], ["array_splice", "(array &$a, int $offset, ...)"],
  ["array_search", "(mixed $needle, array $a, bool $strict = false): int|string|false"], ["in_array", "(mixed $needle, array $a, bool $strict = false): bool"], ["array_key_exists", "(string|int $key, array $a): bool"],
  ["array_unique", "(array $a): array"], ["array_column", "(array $rows, int|string|null $column, int|string|null $index = null): array"], ["array_chunk", "(array $a, int $size): array"],
  ["array_fill", "(int $start, int $count, mixed $value): array"], ["array_sum", "(array $a): int|float"], ["array_product", "(array $a): int|float"], ["array_reverse", "(array $a): array"],
  ["array_push", "(array &$a, mixed ...$values): int"], ["array_pop", "(array &$a): mixed"], ["array_shift", "(array &$a): mixed"], ["array_unshift", "(array &$a, mixed ...$values): int"],
  ["array_key_first", "(array $a): int|string|null"], ["array_key_last", "(array $a): int|string|null"], ["array_is_list", "(array $a): bool — PHP 8.1"], ["array_find", "(array $a, callable $fn): mixed — PHP 8.4"],
  ["array_any", "(array $a, callable $fn): bool — PHP 8.4"], ["array_all", "(array $a, callable $fn): bool — PHP 8.4"], ["array_first", "(array $a): mixed — PHP 8.5"], ["array_last", "(array $a): mixed — PHP 8.5"],
  ["range", "(start, end, step = 1): array"], ["sort", "(array &$a): true"], ["rsort", "(array &$a): true"], ["usort", "(array &$a, callable $cmp): true"], ["uasort", "(array &$a, callable $cmp): true"],
  ["ksort", "(array &$a): true"], ["krsort", "(array &$a): true"], ["asort", "(array &$a): true"], ["arsort", "(array &$a): true"], ["compact", "(string ...$names): array"],
  ["abs", "(int|float $n)"], ["round", "(int|float $n, int $precision = 0): float"], ["floor", "(int|float $n): float"], ["ceil", "(int|float $n): float"], ["intdiv", "(int $a, int $b): int"],
  ["fmod", "(float $a, float $b): float"], ["max", "(mixed ...$values)"], ["min", "(mixed ...$values)"], ["random_int", "(int $min, int $max): int"], ["sqrt", "(float $n): float"], ["pow", "(base, exp)"],
  ["is_numeric", "(mixed $v): bool"], ["is_int", "(mixed $v): bool"], ["is_float", "(mixed $v): bool"], ["is_string", "(mixed $v): bool"], ["is_bool", "(mixed $v): bool"], ["is_array", "(mixed $v): bool"],
  ["is_null", "(mixed $v): bool"], ["is_callable", "(mixed $v): bool"], ["gettype", "(mixed $v): string"], ["get_debug_type", "(mixed $v): string — PHP 8.0"], ["intval", "(mixed $v): int"],
  ["floatval", "(mixed $v): float"], ["boolval", "(mixed $v): bool"], ["strval", "(mixed $v): string"], ["settype", "(mixed &$v, string $type): bool"],
  ["var_dump", "(mixed ...$values): void"], ["print_r", "(mixed $v, bool $return = false)"], ["var_export", "(mixed $v, bool $return = false)"], ["debug_print_backtrace", "(): void"],
  ["json_encode", "(mixed $v, int $flags = 0): string|false"], ["json_decode", "(string $json, ?bool $assoc = null, int $depth = 512, int $flags = 0)"], ["json_validate", "(string $json): bool — PHP 8.3"],
  ["preg_match", "(string $pattern, string $subject, array &$matches = null): int|false"], ["preg_match_all", "(string $pattern, string $subject, array &$matches = null)"],
  ["preg_replace", "(pattern, replacement, subject): string|array|null"], ["preg_replace_callback", "(pattern, callable $fn, subject)"], ["preg_split", "(string $pattern, string $subject): array|false"],
  ["preg_quote", "(string $s, ?string $delimiter = null): string"], ["date", "(string $format, ?int $timestamp = null): string"], ["mktime", "(hour, minute, second, month, day, year): int|false"],
  ["strtotime", "(string $datetime, ?int $base = null): int|false"], ["time", "(): int"], ["checkdate", "(int $month, int $day, int $year): bool"],
  ["file_put_contents", "(string $file, mixed $data, int $flags = 0): int|false"], ["file_get_contents", "(string $file): string|false"], ["file_exists", "(string $file): bool"], ["unlink", "(string $file): bool"],
  ["fopen", "(string $file, string $mode)"], ["fgets", "($handle): string|false"], ["fwrite", "($handle, string $data): int|false"], ["fclose", "($handle): bool"], ["mkdir", "(string $dir, int $mode = 0777, bool $recursive = false)"],
  ["function_exists", "(string $name): bool"], ["class_exists", "(string $class): bool"], ["method_exists", "(object|string $obj, string $method): bool"], ["property_exists", "(object|string $obj, string $prop): bool"],
  ["get_class", "(object $o): string"], ["get_object_vars", "(object $o): array"], ["spl_autoload_register", "(callable $loader): bool"], ["iterator_to_array", "(Traversable $it, bool $keys = true): array"],
  ["call_user_func", "(callable $fn, mixed ...$args)"], ["func_get_args", "(): array"], ["filter_var", "(mixed $v, int $filter = FILTER_DEFAULT, array|int $options = 0)"], ["password_hash", "(string $pw, string|int|null $algo)"],
  ["password_verify", "(string $pw, string $hash): bool"], ["hash", "(string $algo, string $data): string"], ["md5", "(string $s): string"], ["uniqid", "(): string"], ["sleep", "(int $seconds): int"],
  ["define", "(string $name, mixed $value): bool"], ["defined", "(string $name): bool"], ["error_reporting", "(?int $level = null): int"], ["trigger_error", "(string $message, int $level = E_USER_NOTICE): true"],
  ["set_error_handler", "(?callable $handler): mixed"], ["set_exception_handler", "(?callable $handler)"], ["assert", "(mixed $assertion, ...)"], ["header", "(string $header): void"], ["http_build_query", "(array $data): string"],
  ["htmlentities", "(string $s): string"], ["strip_tags", "(string $s): string"], ["urlencode", "(string $s): string"], ["base64_encode", "(string $s): string"], ["serialize", "(mixed $v): string"], ["unserialize", "(string $s)"],
];

const SNIPPETS: Array<[string, string, string]> = [
  ["<?php", "<?php\n", "opening tag"],
  ["foreach", "foreach ($items as $item) {\n    \n}", "loop over an array"],
  ["function", "function name($param) {\n    return $param;\n}", "define a function"],
  ["class", "class Name\n{\n    public function __construct(\n        private string $value,\n    ) {}\n}", "define a class"],
  ["match", "match ($value) {\n    1 => 'one',\n    default => 'other',\n}", "match expression"],
  ["try", "try {\n    \n} catch (Exception $e) {\n    echo $e->getMessage();\n}", "try / catch"],
];

/** Keywords, common functions, snippets and the variables already in the file. */
export function phpCompletions(ctx: CompletionContext): CompletionResult | null {
  const v = ctx.matchBefore(/\$\w*/);
  if (v) {
    const names = new Set<string>();
    for (const m of ctx.state.doc.toString().matchAll(/\$(\w+)/g)) names.add(m[1]);
    names.add("this");
    return { from: v.from, options: [...names].map((n) => ({ label: "$" + n, type: "variable" })), validFor: /^\$\w*$/ };
  }
  const w = ctx.matchBefore(/[\w<?]+/);
  if (!w || (w.from === w.to && !ctx.explicit)) return null;
  // Not after -> or :: (methods are not known statically here).
  const before = ctx.state.sliceDoc(Math.max(0, w.from - 2), w.from);
  if (before === "->" || before === "::") return null;
  return {
    from: w.from,
    options: [
      ...SNIPPETS.map(([label, apply, detail]) => ({ label, apply, detail, type: "text", boost: label === "<?php" ? 2 : -1 })),
      ...KEYWORDS.map((k) => ({ label: k, type: "keyword" })),
      ...FUNCTIONS.map(([name, sig]) => ({ label: name, detail: sig, type: "function", apply: name + "(" })),
    ],
    validFor: /^[\w]*$/,
  };
}
