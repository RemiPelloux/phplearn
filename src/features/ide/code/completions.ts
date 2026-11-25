import { snippetCompletion, type Completion, type CompletionContext, type CompletionResult } from "@codemirror/autocomplete";
import { syntaxTree } from "@codemirror/language";
import type { EditorView } from "@codemirror/view";
import { REFERENCE } from "@/features/reference/data";

/**
 * PHP autocompletion, a bit like Intelephense:
 *  - snippets with tab stops (foreach, function, class, match, try…)
 *  - built-in functions with their signature and a short explanation
 *  - variables, classes, methods, properties and constants found in the file
 *  - members after -> and ::, superglobals, PHP constants
 * Nothing is suggested inside comments.
 */

let locale: "en" | "fr" = "en";
export const setCompletionLocale = (l: "en" | "fr") => {
  locale = l;
};

const KEYWORDS = (
  "abstract and array as break callable case catch class clone const continue declare default do echo else elseif empty enum extends final finally fn for foreach function global goto if implements include include_once instanceof insteadof interface isset list match namespace new null or print private protected public readonly require require_once return static switch throw trait try unset use var while xor yield true false self parent mixed never void int float string bool iterable object"
).split(" ");

const CONSTANTS: Array<[string, string]> = [
  ["PHP_EOL", "\"\\n\": the end-of-line character"],
  ["PHP_VERSION", "e.g. \"8.5.12\""],
  ["PHP_INT_MAX", "9223372036854775807"],
  ["PHP_INT_MIN", "-9223372036854775808"],
  ["PHP_FLOAT_EPSILON", "smallest float difference"],
  ["M_PI", "3.14159…"],
  ["E_ALL", "every error level"],
  ["E_WARNING", "warning level"],
  ["E_USER_WARNING", "user warning level"],
  ["JSON_PRETTY_PRINT", "indent json_encode output"],
  ["JSON_THROW_ON_ERROR", "json_* throw JsonException"],
  ["JSON_UNESCAPED_UNICODE", "keep é, € as is"],
  ["JSON_UNESCAPED_SLASHES", "keep / as is"],
  ["ENT_QUOTES", "escape ' and \" in htmlspecialchars"],
  ["SORT_STRING", "sort as strings"],
  ["SORT_NUMERIC", "sort as numbers"],
  ["ARRAY_FILTER_USE_KEY", "array_filter callback gets the key"],
  ["ARRAY_FILTER_USE_BOTH", "array_filter callback gets value and key"],
  ["STR_PAD_LEFT", "str_pad on the left"],
  ["STR_PAD_BOTH", "str_pad on both sides"],
  ["FILTER_VALIDATE_EMAIL", "filter_var: email"],
  ["FILTER_VALIDATE_INT", "filter_var: integer"],
  ["DATE_ATOM", "Y-m-d\\TH:i:sP"],
  ["__DIR__", "folder of this file"],
  ["__FILE__", "path of this file"],
  ["__LINE__", "current line number"],
  ["__CLASS__", "current class name"],
  ["__FUNCTION__", "current function name"],
];

const SUPERGLOBALS = ["$_GET", "$_POST", "$_SERVER", "$_SESSION", "$_COOKIE", "$_FILES", "$_REQUEST", "$_ENV", "$GLOBALS"];

const BUILTIN_CLASSES = [
  "Exception", "RuntimeException", "LogicException", "InvalidArgumentException", "DomainException", "LengthException", "OutOfRangeException",
  "UnexpectedValueException", "TypeError", "ValueError", "ArgumentCountError", "DivisionByZeroError", "Error", "Throwable", "JsonException",
  "DateTimeImmutable", "DateTime", "DateInterval", "DatePeriod", "DateTimeZone", "PDO", "PDOStatement", "PDOException", "ArrayIterator",
  "ArrayObject", "SplStack", "SplQueue", "SplObjectStorage", "Generator", "Closure", "Stringable", "Countable", "IteratorAggregate",
  "Iterator", "ArrayAccess", "Traversable", "JsonSerializable", "ReflectionClass", "ReflectionFunction", "ReflectionMethod", "Attribute",
  "Override", "WeakMap", "stdClass", "UnitEnum", "BackedEnum",
];

const SNIPPETS: Array<{ label: string; detail: string; body: string; info?: { en: string; fr: string } }> = [
  { label: "<?php", detail: "opening tag", body: "<?php\n\n${}" },
  { label: "strict", detail: "declare(strict_types=1)", body: "declare(strict_types=1);\n\n${}" },
  { label: "echo", detail: 'echo "…\\n";', body: 'echo "${text}\\n";', info: { en: "Print a line, with a new line at the end.", fr: "Affiche une ligne, avec un retour à la ligne à la fin." } },
  { label: "echoln", detail: "echo … PHP_EOL", body: "echo ${value}, PHP_EOL;" },
  { label: "printf", detail: 'printf("%s\\n", …)', body: 'printf("${%s}\\n", ${value});' },
  { label: "vd", detail: "var_dump(…)", body: "var_dump(${value});", info: { en: "Show a value and its type: the #1 debugging tool.", fr: "Affiche une valeur et son type : l'outil de débogage n°1." } },
  { label: "pr", detail: "print_r(…)", body: "print_r(${value});" },
  { label: "if", detail: "if (…) { … }", body: "if (${condition}) {\n\t${}\n}" },
  { label: "ifelse", detail: "if … else", body: "if (${condition}) {\n\t${}\n} else {\n\t\n}" },
  { label: "elseif", detail: "elseif (…) { … }", body: "elseif (${condition}) {\n\t${}\n}" },
  { label: "foreach", detail: "foreach ($items as $item)", body: "foreach (${$items} as ${$item}) {\n\t${}\n}" },
  { label: "foreachk", detail: "foreach ($items as $key => $value)", body: "foreach (${$items} as ${$key} => ${$value}) {\n\t${}\n}" },
  { label: "for", detail: "for ($i = 0; $i < n; $i++)", body: "for (\\$i = 0; \\$i < ${count}; \\$i++) {\n\t${}\n}" },
  { label: "while", detail: "while (…) { … }", body: "while (${condition}) {\n\t${}\n}" },
  { label: "match", detail: "match ($x) { … }", body: "match (${$value}) {\n\t${'a'} => ${'first'},\n\tdefault => ${'other'},\n}" },
  { label: "switch", detail: "switch ($x) { case … }", body: "switch (${$value}) {\n\tcase ${'a'}:\n\t\t${}\n\t\tbreak;\n\tdefault:\n\t\tbreak;\n}" },
  { label: "function", detail: "function name(…): type", body: "function ${name}(${}): ${void}\n{\n\t\n}" },
  { label: "fn", detail: "fn ($x) => …", body: "fn (${$x}) => ${$x}" },
  { label: "closure", detail: "function (…) use (…) { … }", body: "function (${}) use (${}) {\n\t\n}" },
  { label: "class", detail: "class Name { … }", body: "class ${Name}\n{\n\tpublic function __construct(\n\t\t${private string $value},\n\t) {}\n}" },
  { label: "interface", detail: "interface Name { … }", body: "interface ${Name}\n{\n\tpublic function ${method}(): ${void};\n}" },
  { label: "enum", detail: "enum Name: string { case … }", body: "enum ${Status}: string\n{\n\tcase ${Active} = '${active}';\n}" },
  { label: "trait", detail: "trait Name { … }", body: "trait ${Name}\n{\n\t${}\n}" },
  { label: "construct", detail: "public function __construct(…)", body: "public function __construct(\n\t${private string $value},\n) {}" },
  { label: "pubf", detail: "public function name(): type", body: "public function ${name}(${}): ${void}\n{\n\t\n}" },
  { label: "prif", detail: "private function name(): type", body: "private function ${name}(${}): ${void}\n{\n\t\n}" },
  { label: "try", detail: "try { … } catch (…)", body: "try {\n\t${}\n} catch (${Exception} \\$e) {\n\techo \\$e->getMessage();\n}" },
  { label: "tryf", detail: "try … catch … finally", body: "try {\n\t${}\n} catch (${Exception} \\$e) {\n\t\n} finally {\n\t\n}" },
  { label: "throw", detail: "throw new …Exception(…)", body: "throw new ${InvalidArgumentException}('${message}');" },
  { label: "namespace", detail: "namespace App\\…;", body: "namespace ${App};\n\n${}" },
  { label: "require", detail: "require __DIR__ . '/…';", body: "require __DIR__ . '/${src/File.php}';" },
  { label: "heredoc", detail: "<<<TXT … TXT;", body: "<<<TXT\n${}\nTXT;" },
];

/** Interpolation in snippets uses ${…}; escape a literal "$" as \$ above, then fix it here. */
const snippet = (body: string) => body.replace(/\\\$/g, "$$$$").replace(/\$\$/g, "$");

/** Everyday functions rank above rare ones with the same prefix (strtolower before strtotime). */
const COMMON = new Set(
  "strlen strtolower strtoupper str_contains str_replace str_repeat str_pad str_starts_with str_ends_with substr strpos trim explode implode sprintf printf number_format ucfirst ucwords count array_map array_filter array_reduce array_keys array_values array_sum array_merge array_slice array_search in_array array_key_exists sort usort ksort range round floor ceil intdiv max min abs random_int var_dump print_r json_encode json_decode is_int is_string is_array isset htmlspecialchars preg_match preg_replace date".split(" "),
);

let functionOptions: Completion[] | null = null;
function functions(): Completion[] {
  if (functionOptions && (functionOptions as unknown as { locale?: string }).locale === locale) return functionOptions;
  const seen = new Set<string>();
  const out: Completion[] = [];
  for (const r of REFERENCE) {
    if (r.category === "language") continue;
    // Some entries group several functions: "strtolower / strtoupper", "is_int / is_string / is_array…".
    const names = r.name.split("/").map((n) => n.replace(/[…\s]|\(.*\)/g, "")).filter((n) => /^[a-z_][a-z0-9_]*$/.test(n));
    for (const name of names) {
      if (KEYWORDS.includes(name) || seen.has(name)) continue;
      const own = new RegExp(`\\b${name}\\([^)]*\\)(?::\\s*[\\w|&?]+)?`).exec(r.signature)?.[0];
      if (!own && names.length === 1 && !new RegExp(`\\b${name}\\s*\\(`).test(r.signature)) continue;
      seen.add(name);
      out.push({
        label: name,
        type: "function",
        detail: r.since ? `PHP ${r.since}+` : undefined,
        info: () => infoNode(own ?? `${name}(…)`, r.summary[locale]),
        apply: applyCall(name),
        boost: COMMON.has(name) ? 2 : 0,
      });
    }
  }
  for (const [name, sig] of EXTRA_FUNCTIONS) {
    if (seen.has(name)) continue;
    seen.add(name);
    out.push({ label: name, type: "function", info: () => infoNode(`${name}${sig}`, ""), apply: applyCall(name) });
  }
  functionOptions = Object.assign(out, { locale });
  return out;
}

/** Insert `name()` with the cursor between the parentheses. */
const applyCall = (name: string) => (view: EditorView, _c: Completion, from: number, to: number) => {
  const after = view.state.sliceDoc(to, to + 1);
  const insert = after === "(" ? name : `${name}()`;
  view.dispatch({ changes: { from, to, insert }, selection: { anchor: from + name.length + 1 } });
};

function infoNode(signature: string, text: string) {
  const el = document.createElement("div");
  const sig = document.createElement("code");
  sig.textContent = signature;
  sig.style.cssText = "display:block;font-family:var(--font-mono);font-size:11.5px;white-space:pre-wrap;color:var(--text)";
  el.appendChild(sig);
  if (text) {
    const p = document.createElement("p");
    p.textContent = text.replace(/`/g, "");
    p.style.cssText = "margin-top:4px;color:var(--text-2)";
    el.appendChild(p);
  }
  return el;
}

const EXTRA_FUNCTIONS: Array<[string, string]> = [
  ["array_push", "(array &$array, mixed ...$values): int"], ["array_pop", "(array &$array): mixed"], ["array_shift", "(array &$array): mixed"],
  ["array_unshift", "(array &$array, mixed ...$values): int"], ["array_key_first", "(array $array): int|string|null"], ["array_key_last", "(array $array): int|string|null"],
  ["array_reverse", "(array $array, bool $preserve_keys = false): array"], ["array_pad", "(array $array, int $length, mixed $value): array"],
  ["iterator_to_array", "(Traversable $iterator, bool $preserve_keys = true): array"], ["spl_autoload_register", "(?callable $callback = null): bool"],
  ["function_exists", "(string $function): bool"], ["is_callable", "(mixed $value): bool"], ["password_hash", "(string $password, string|int|null $algo): string"],
  ["password_verify", "(string $password, string $hash): bool"], ["filter_var", "(mixed $value, int $filter = FILTER_DEFAULT, array|int $options = 0): mixed"],
  ["header", "(string $header, bool $replace = true, int $response_code = 0): void"], ["http_response_code", "(int $response_code = 0): int|bool"],
  ["strrev", "(string $string): string"], ["lcfirst", "(string $string): string"], ["nl2br", "(string $string): string"], ["str_word_count", "(string $string): array|int"],
  ["array_walk", "(array &$array, callable $callback): true"], ["array_fill_keys", "(array $keys, mixed $value): array"], ["array_intersect", "(array $array, array ...$arrays): array"],
  ["array_diff", "(array $array, array ...$arrays): array"], ["array_key_exists", "(string|int $key, array $array): bool"], ["array_flip", "(array $array): array"],
];

/** Names declared in the open file (and the other open files' text, if given). */
function declared(text: string) {
  const classes = new Set<string>();
  const methods = new Set<string>();
  const props = new Set<string>();
  const statics = new Set<string>();
  const funcs = new Set<string>();
  for (const m of text.matchAll(/\b(?:class|interface|trait|enum)\s+([A-Za-z_]\w*)/g)) classes.add(m[1]);
  for (const m of text.matchAll(/\bfunction\s+&?([A-Za-z_]\w*)\s*\(/g)) {
    // A function inside a class body is a method; we can't know cheaply, so offer it in both places.
    methods.add(m[1]);
    funcs.add(m[1]);
  }
  for (const m of text.matchAll(/\b(?:public|protected|private)(?:\s+(?:readonly|static|private\(set\)|protected\(set\)))*(?:\s+[?\\\w|&]+)?\s+\$(\w+)/g)) props.add(m[1]);
  for (const m of text.matchAll(/\$this->(\w+)\s*=/g)) props.add(m[1]);
  for (const m of text.matchAll(/\b(?:case|const)\s+(?:[A-Za-z_\\?]+\s+)?([A-Za-z_]\w*)\s*[=;]/g)) statics.add(m[1]);
  for (const m of text.matchAll(/\bstatic\s+function\s+(\w+)/g)) statics.add(m[1]);
  return { classes, methods, props, statics, funcs };
}

export function phpCompletions(ctx: CompletionContext): CompletionResult | null {
  const tree = syntaxTree(ctx.state);
  const node = tree.resolveInner(ctx.pos, -1);
  if (/Comment/.test(node.name)) return null;
  const inString = /String|Heredoc|Template/.test(node.name) && node.name !== "Template";
  const doc = ctx.state.doc.toString();

  // $variables (also inside double-quoted strings, for interpolation)
  const v = ctx.matchBefore(/\$\w*/);
  if (v) {
    const names = new Set<string>(["$this"]);
    for (const m of doc.matchAll(/\$(\w+)/g)) if (`$${m[1]}` !== v.text) names.add(`$${m[1]}`);
    return {
      from: v.from,
      options: [
        ...[...names].map((label) => ({ label, type: "variable", boost: 2 })),
        ...SUPERGLOBALS.map((label) => ({ label, type: "variable", detail: "superglobal", boost: -1 })),
      ],
      validFor: /^\$\w*$/,
    };
  }
  if (inString) return null;

  const d = declared(doc);
  // $obj->member
  const arrow = ctx.matchBefore(/(->|\?->)\w*/);
  if (arrow) {
    const from = arrow.from + (arrow.text.startsWith("?->") ? 3 : 2);
    return {
      from,
      options: [
        ...[...d.methods].filter((m) => !m.startsWith("__")).map((label) => ({ label, type: "method", apply: applyCall(label), boost: 1 })),
        ...[...d.props].map((label) => ({ label, type: "property" })),
        ...["getMessage", "getCode", "getPrevious", "getTrace", "getLine", "format", "modify", "diff", "prepare", "execute", "fetch", "fetchAll", "query", "exec", "lastInsertId"].map((label) => ({ label, type: "method", apply: applyCall(label), boost: -2 })),
      ],
      validFor: /^\w*$/,
    };
  }
  // Class::MEMBER
  const scope = ctx.matchBefore(/::\w*/);
  if (scope) {
    return {
      from: scope.from + 2,
      options: [
        ...[...d.statics].map((label) => ({ label, type: "constant", boost: 1 })),
        { label: "class", type: "keyword", detail: "the class name as a string" },
        { label: "cases", type: "method", detail: "enum: all cases", apply: "cases()" },
        { label: "from", type: "method", detail: "backed enum: case from value", apply: applyCall("from") },
        { label: "tryFrom", type: "method", detail: "backed enum: case or null", apply: applyCall("tryFrom") },
      ],
      validFor: /^\w*$/,
    };
  }
  // new ClassName / type positions
  const afterNew = ctx.matchBefore(/\b(new|extends|implements|instanceof|catch\s*\()\s+\w*/);
  const word = ctx.matchBefore(/[\w<?]+/);
  if (afterNew) {
    const w = ctx.matchBefore(/\w*/)!;
    return {
      from: w.from,
      options: [...[...d.classes].map((label) => ({ label, type: "class", boost: 2 })), ...BUILTIN_CLASSES.map((label) => ({ label, type: "class" }))],
      validFor: /^\w*$/,
    };
  }
  if (!word || (word.from === word.to && !ctx.explicit)) return null;
  // At least two letters before suggesting while typing (one is too noisy for beginners).
  if (!ctx.explicit && word.text.length < 2) return null;
  return {
    from: word.from,
    options: [
      ...SNIPPETS.map((s) =>
        snippetCompletion(snippet(s.body), {
          label: s.label,
          detail: s.detail,
          type: "text",
          boost: s.label === "<?php" ? 3 : 2,
          info: s.info ? () => infoNode(s.detail, s.info![locale]) : undefined,
        }),
      ),
      ...[...d.funcs].filter((f) => !f.startsWith("__")).map((label) => ({ label, type: "function", detail: "your function", apply: applyCall(label), boost: 3 })),
      ...[...d.classes].map((label) => ({ label, type: "class", detail: "your class", boost: 3 })),
      // Keywords that also have a snippet appear once, as the snippet.
      ...KEYWORDS.filter((k) => !SNIPPETS.some((sn) => sn.label === k)).map((k): Completion => {
        const ref = REFERENCE.find((r) => r.name === k);
        const call = ref && new RegExp(`^${k}\\s*\\(`).test(ref.signature);
        return { label: k, type: "keyword", info: ref ? () => infoNode(ref.signature, ref.summary[locale]) : undefined, apply: call ? applyCall(k) : undefined };
      }),
      ...CONSTANTS.map(([label, detail]) => ({ label, type: "constant", detail })),
      ...BUILTIN_CLASSES.map((label) => ({ label, type: "class", boost: -1 })),
      ...functions(),
    ],
    validFor: /^[\w<?]*$/,
  };
}

/** Signature and explanation of a built-in function, for hover tooltips. */
export function functionDoc(name: string): { signature: string; text: string } | null {
  const r = REFERENCE.find((x) => x.category !== "language" && x.name.split("/").some((n) => n.replace(/[…\s]/g, "") === name));
  if (r) {
    const own = new RegExp(`\\b${name}\\([^)]*\\)(?::\\s*[\\w|&?]+)?`).exec(r.signature)?.[0];
    // A grouped entry only spells out the first signature: never show another function's parameters.
    return { signature: own ?? `${name}(…)`, text: r.summary[locale].replace(/`/g, "") };
  }
  const e = EXTRA_FUNCTIONS.find(([n]) => n === name);
  return e ? { signature: `${e[0]}${e[1]}`, text: "" } : null;
}
