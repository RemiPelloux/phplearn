import { L, type Txt } from "@/lib/txt";
import type { Problem } from "./types";

/** A plain-language reading of a PHP error, with a way to fix it. */
export interface Explanation {
  what: Txt;
  fix: Txt;
}

type Rule = { kind?: RegExp; message: RegExp; explain: (m: RegExpMatchArray) => Explanation };

const RULES: Rule[] = [
  {
    message: /syntax error, unexpected (?:token )?("[^"]*"|'[^']*'|[^,]+)(?:, expecting (.+))?/,
    explain: (m) => ({
      what: L(
        `PHP couldn't understand the code: it found ${m[1]} where it didn't expect it${m[2] ? ` (it was waiting for ${m[2]})` : ""}. The script didn't run at all.`,
        `PHP n'a pas compris le code : il a trouvé ${m[1]} là où il ne l'attendait pas${m[2] ? ` (il attendait ${m[2]})` : ""}. Le script ne s'est pas exécuté du tout.`,
      ),
      fix: L(
        "Look at the line shown AND the end of the line before it: a missing `;`, `)` or `}` is the usual cause.",
        "Regarde la ligne indiquée ET la fin de la ligne d'avant : un `;`, une `)` ou une `}` manquante est la cause habituelle.",
      ),
    }),
  },
  {
    message: /Undefined variable \$(\w+)/,
    explain: (m) => ({
      what: L(`You used \`$${m[1]}\`, but no value was ever stored in it. PHP continues with null.`, `Tu utilises \`$${m[1]}\`, mais aucune valeur n'y a été rangée. PHP continue avec null.`),
      fix: L(
        "Check the spelling and capitals (`$total` ≠ `$Total`), and that it's assigned before this line. Inside a function, outside variables aren't visible: pass them as parameters.",
        "Vérifie l'orthographe et les majuscules (`$total` ≠ `$Total`), et qu'elle est affectée avant cette ligne. Dans une fonction, les variables extérieures ne sont pas visibles : passe-les en paramètres.",
      ),
    }),
  },
  {
    message: /Undefined (?:array key|offset|index):? "?([^"]*)"?/,
    explain: (m) => ({
      what: L(`You read the key \`${m[1]}\` from an array that doesn't have it. The result is null.`, `Tu lis la clé \`${m[1]}\` dans un tableau qui ne l'a pas. Le résultat vaut null.`),
      fix: L(
        "Check the key name, remember lists start at 0, or give a default: `$a['key'] ?? 'default'`.",
        "Vérifie le nom de la clé, rappelle-toi que les listes commencent à 0, ou donne une valeur par défaut : `$a['key'] ?? 'défaut'`.",
      ),
    }),
  },
  {
    message: /Call to undefined function ([\w\\]+)\(\)/,
    explain: (m) => ({
      what: L(`There's no function called \`${m[1]}\`, so PHP stopped.`, `Il n'existe pas de fonction \`${m[1]}\`, donc PHP s'est arrêté.`),
      fix: L(
        "Check the spelling, that your own function is defined (and its file required), or that the function exists in this PHP version (e.g. `str_contains` needs PHP 8.0).",
        "Vérifie l'orthographe, que ta fonction est bien définie (et son fichier inclus), ou qu'elle existe dans cette version de PHP (par ex. `str_contains` demande PHP 8.0).",
      ),
    }),
  },
  {
    message: /Call to undefined method ([\w\\]+)::(\w+)\(\)/,
    explain: (m) => ({
      what: L(`Objects of class \`${m[1]}\` have no method \`${m[2]}()\`.`, `Les objets de la classe \`${m[1]}\` n'ont pas de méthode \`${m[2]}()\`.`),
      fix: L("Check the method name and that it's declared in the class (or a parent).", "Vérifie le nom de la méthode et qu'elle est déclarée dans la classe (ou un parent)."),
    }),
  },
  {
    message: /Call to a member function (\w+)\(\) on (null|bool|int|string|array|float)/,
    explain: (m) => ({
      what: L(
        `You called \`->${m[1]}()\` on a ${m[2]} value, not on an object. Often a variable you expected to hold an object is null.`,
        `Tu appelles \`->${m[1]}()\` sur une valeur ${m[2]}, pas sur un objet. Souvent, une variable censée contenir un objet vaut null.`,
      ),
      fix: L("Check where the object comes from. If it can be null, use `?->` or test it first.", "Vérifie d'où vient l'objet. S'il peut être null, utilise `?->` ou teste-le avant."),
    }),
  },
  {
    message: /Class "([^"]+)" not found/,
    explain: (m) => ({
      what: L(`PHP doesn't know any class named \`${m[1]}\`.`, `PHP ne connaît aucune classe nommée \`${m[1]}\`.`),
      fix: L(
        "Check the spelling, the namespace (`use` statement) and that the file defining it was required or autoloaded.",
        "Vérifie l'orthographe, le namespace (instruction `use`) et que le fichier qui la définit est inclus ou chargé automatiquement.",
      ),
    }),
  },
  {
    kind: /TypeError/,
    message: /Argument #(\d+) \(\$(\w+)\) must be of type ([^,]+), (\w+) given/,
    explain: (m) => ({
      what: L(
        `Argument #${m[1]} (\`$${m[2]}\`) must be ${m[3]}, but it received a ${m[4]}. Type declarations protect the function from wrong values.`,
        `L'argument n°${m[1]} (\`$${m[2]}\`) doit être ${m[3]}, mais il a reçu un ${m[4]}. Les déclarations de type protègent la fonction des mauvaises valeurs.`,
      ),
      fix: L("Pass a value of the right type, or convert it first (e.g. `(int) $value`).", "Passe une valeur du bon type, ou convertis-la avant (par ex. `(int) $value`)."),
    }),
  },
  {
    kind: /TypeError/,
    message: /Return value must be of type ([^,]+), (\w+) returned/,
    explain: (m) => ({
      what: L(`The function promised to return ${m[1]}, but returned ${m[2]}.`, `La fonction promettait de renvoyer ${m[1]}, mais a renvoyé ${m[2]}.`),
      fix: L("Check every `return` (and the end of the function, which returns null).", "Vérifie chaque `return` (et la fin de la fonction, qui renvoie null)."),
    }),
  },
  {
    kind: /TypeError/,
    message: /Unsupported operand types: (\w+) ([+\-*/%]) (\w+)/,
    explain: (m) => ({
      what: L(`You can't use \`${m[2]}\` between a ${m[1]} and a ${m[3]}.`, `On ne peut pas utiliser \`${m[2]}\` entre un ${m[1]} et un ${m[3]}.`),
      fix: L("To join text use `.`; to add arrays use `array_merge()` or `+` between two arrays.", "Pour coller du texte, utilise `.` ; pour réunir des tableaux, `array_merge()` ou `+` entre deux tableaux."),
    }),
  },
  {
    message: /Too few arguments to function ([\w\\:]+)\(\), (\d+) passed .* (?:exactly|at least) (\d+) expected/,
    explain: (m) => ({
      what: L(`\`${m[1]}()\` needs ${m[3]} argument(s) but got ${m[2]}.`, `\`${m[1]}()\` a besoin de ${m[3]} argument(s) mais en a reçu ${m[2]}.`),
      fix: L("Pass every required argument, or give the parameter a default value.", "Passe tous les arguments obligatoires, ou donne une valeur par défaut au paramètre."),
    }),
  },
  {
    message: /Division by zero|Modulo by zero/,
    explain: () => ({
      what: L("You divided by zero, which has no answer. Since PHP 8 this throws a DivisionByZeroError.", "Tu as divisé par zéro, ce qui n'a pas de réponse. Depuis PHP 8, ça lève une DivisionByZeroError."),
      fix: L("Check the divisor before dividing, or catch the error.", "Vérifie le diviseur avant de diviser, ou attrape l'erreur."),
    }),
  },
  {
    message: /Unhandled match case (.+)/,
    explain: (m) => ({
      what: L(`No arm of the \`match\` handles the value ${m[1]}. Unlike switch, match refuses to silently do nothing.`, `Aucune branche du \`match\` ne gère la valeur ${m[1]}. Contrairement à switch, match refuse de ne rien faire en silence.`),
      fix: L("Add the missing case, or a `default =>` arm.", "Ajoute le cas manquant, ou une branche `default =>`."),
    }),
  },
  {
    message: /Cannot modify readonly property ([\w\\]+)::\$(\w+)/,
    explain: (m) => ({
      what: L(`\`${m[1]}::$${m[2]}\` is readonly: it can only be set once, inside the class.`, `\`${m[1]}::$${m[2]}\` est en lecture seule : on ne peut l'affecter qu'une fois, dans la classe.`),
      fix: L("Create a new object with the new value (a `with…()` method returning a clone).", "Crée un nouvel objet avec la nouvelle valeur (une méthode `with…()` qui renvoie un clone)."),
    }),
  },
  {
    message: /Cannot access (private|protected) property ([\w\\]+)::\$(\w+)/,
    explain: (m) => ({
      what: L(`\`$${m[3]}\` is ${m[1]}: code outside the class can't touch it.`, `\`$${m[3]}\` est ${m[1]} : le code hors de la classe ne peut pas y toucher.`),
      fix: L("Use a public method (a getter) or change the visibility if it should really be public.", "Utilise une méthode publique (un getter) ou change la visibilité si elle doit vraiment être publique."),
    }),
  },
  {
    message: /Creation of dynamic property ([\w\\]+)::\$(\w+) is deprecated/,
    explain: (m) => ({
      what: L(`You set \`$${m[2]}\` on a \`${m[1]}\` object, but the class never declared it. PHP 8.2 deprecated this (it hides typos).`, `Tu affectes \`$${m[2]}\` sur un objet \`${m[1]}\`, mais la classe ne la déclare pas. PHP 8.2 a déprécié ça (ça cache les fautes de frappe).`),
      fix: L("Declare the property in the class.", "Déclare la propriété dans la classe."),
    }),
  },
  {
    message: /Array to string conversion/,
    explain: () => ({
      what: L("You tried to print an array as text: PHP prints the word `Array` instead of its contents.", "Tu as essayé d'afficher un tableau comme du texte : PHP affiche le mot `Array` au lieu de son contenu."),
      fix: L("Use `print_r($array)`, `var_dump($array)` or `implode(', ', $array)`.", "Utilise `print_r($array)`, `var_dump($array)` ou `implode(', ', $array)`."),
    }),
  },
  {
    message: /A non-numeric value encountered|non-numeric value/,
    explain: () => ({
      what: L("You did maths with text that isn't a number.", "Tu as fait un calcul avec un texte qui n'est pas un nombre."),
      fix: L("Check the value, or convert it with `(int)` / `(float)` after validating it.", "Vérifie la valeur, ou convertis-la avec `(int)` / `(float)` après l'avoir validée."),
    }),
  },
  {
    message: /Unsupported operand types|must be of type (\w+), (\w+) given/,
    explain: () => ({
      what: L("A value of the wrong type reached an operator or a function.", "Une valeur du mauvais type est arrivée à un opérateur ou une fonction."),
      fix: L("Check the types with `var_dump()` just before this line.", "Vérifie les types avec `var_dump()` juste avant cette ligne."),
    }),
  },
  {
    message: /Cannot redeclare (?:function )?([\w\\]+)/,
    explain: (m) => ({
      what: L(`\`${m[1]}\` is defined twice.`, `\`${m[1]}\` est définie deux fois.`),
      fix: L("Remove the duplicate, or use `require_once` so a file is only loaded once.", "Supprime le doublon, ou utilise `require_once` pour ne charger un fichier qu'une fois."),
    }),
  },
  {
    message: /Failed opening required '([^']+)'|Failed to open stream: No such file/,
    explain: () => ({
      what: L("PHP couldn't find the file you asked it to load.", "PHP n'a pas trouvé le fichier que tu lui demandes de charger."),
      fix: L("Check the path. `__DIR__ . '/src/File.php'` builds a path from the current file's folder.", "Vérifie le chemin. `__DIR__ . '/src/File.php'` construit un chemin depuis le dossier du fichier courant."),
    }),
  },
  {
    message: /Allowed memory size|Maximum function nesting|Maximum call stack/,
    explain: () => ({
      what: L("The program used too much memory or called itself too deeply (endless recursion?).", "Le programme a utilisé trop de mémoire ou s'est appelé lui-même trop profondément (récursion sans fin ?)."),
      fix: L("Make sure every recursive function has a base case that stops it.", "Vérifie que chaque fonction récursive a un cas de base qui l'arrête."),
    }),
  },
];

const BY_KIND: Record<string, Explanation> = {
  EngineError: {
    what: L("This isn't your code's fault: the PHP engine running in your browser hit one of its limits (Fibers, for instance, aren't supported here).", "Ce n'est pas la faute de ton code : le moteur PHP qui tourne dans ton navigateur a atteint une de ses limites (les Fibers, par exemple, ne sont pas prises en charge ici)."),
    fix: L("Run it again: a fresh engine is loaded. To try Fibers, use PHP installed on your computer (see the Install page).", "Relance : un moteur neuf est chargé. Pour essayer les Fibers, utilise PHP installé sur ton ordinateur (voir la page Installer)."),
  },
  Timeout: {
    what: L("The script took too long, usually because a loop never ends.", "Le script a pris trop de temps, souvent parce qu'une boucle ne s'arrête jamais."),
    fix: L("Check that the loop's condition eventually becomes false (is the counter increasing?).", "Vérifie que la condition de la boucle finit par devenir fausse (le compteur augmente-t-il ?)."),
  },
  Deprecated: {
    what: L("This still works, but PHP announces it will be removed in a future version.", "Ça marche encore, mais PHP annonce que ce sera supprimé dans une future version."),
    fix: L("Update the code now, the message usually says what to use instead.", "Mets le code à jour maintenant : le message dit en général quoi utiliser à la place."),
  },
};

export function explain(p: Problem): Explanation | null {
  for (const r of RULES) {
    if (r.kind && !r.kind.test(p.kind)) continue;
    const m = p.message.match(r.message);
    if (m) return r.explain(m);
  }
  if (BY_KIND[p.kind]) return BY_KIND[p.kind];
  if (p.severity === "error" && /Exception|Error$/.test(p.kind))
    return {
      what: L(
        `An exception (${p.kind}) was thrown and nobody caught it, so the script stopped here.`,
        `Une exception (${p.kind}) a été lancée et personne ne l'a attrapée, donc le script s'est arrêté ici.`,
      ),
      fix: L("Read the stack trace from the top: it shows where it was thrown and who called that code. Fix the cause, or wrap the call in try/catch.", "Lis la trace d'appels depuis le haut : elle montre où l'exception est partie et qui a appelé ce code. Corrige la cause, ou entoure l'appel d'un try/catch."),
    };
  return null;
}

/** How PHP itself prints a problem, e.g. "PHP Warning:  Undefined variable $x in index.php on line 3". */
export function phpLine(p: Problem): string {
  const where = p.file ? ` in ${p.file}${p.line ? ` on line ${p.line}` : ""}` : "";
  if (p.severity === "error" && !["Parse error", "Fatal error", "Timeout"].includes(p.kind)) return `PHP Fatal error:  Uncaught ${p.kind}: ${p.message}${where}`;
  if (p.kind === "Timeout") return p.message;
  return `PHP ${p.kind}:  ${p.message}${where}`;
}
