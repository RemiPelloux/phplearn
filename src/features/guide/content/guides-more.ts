import type { DocPage } from "../types";
import { md } from "./md";

/** Guides for debugging, modern PHP, the web, and versions: chapters 7 to 10. */
export const MORE_GUIDES: DocPage[] = [
  {
    slug: "guide-debugging",
    section: "guides",
    icon: "Bug",
    lesson: "debugging",
    more: ["warnings-notices", "boss-debug"],
    title: { en: "Debugging and stack traces", fr: "Déboguer et lire les stack traces" },
    lead: {
      en: "Stop guessing: look at the real values, follow the execution step by step, and read a stack trace from the inside out.",
      fr: "Arrête de deviner : regarde les vraies valeurs, suis l'exécution pas à pas, et lis une stack trace de l'intérieur vers l'extérieur.",
    },
    body: {
      en: md`
## A method that always works

1. **Reproduce** the bug with the smallest input you can.
2. **Read** the first error message completely: kind, message, file and line.
3. **Look** at real values (´var_dump´, the Variables panel) instead of assuming them.
4. **Narrow down**: find the first line where a value is not what you expected.
5. **Fix**, then run again to confirm, and keep the reproduction as a test if you can.

## Looking at values

| Tool | Shows |
|---|---|
| ´var_dump($x)´ | Type and value, nested. The reference tool. |
| ´print_r($array)´ | Readable arrays and objects, without types. |
| ´var_export($x)´ | The value as PHP code you could paste. |
| ´json_encode($x, JSON_PRETTY_PRINT)´ | Nested data, compact. |
| ´get_debug_type($x)´ | Just the type name (PHP 8). |

> Tip: ´var_dump("total", $total);´ labels the dump, so you know which line printed what.

## The Trace tab

After each run, the **Trace** tab lists every statement PHP executed: the line, the function it was in, the output so far and the variables at that moment. Click a step to highlight its line in the editor, or use the arrows to replay the run. It's a debugger without breakpoints: the whole run is recorded.

What to look for:

- A loop that runs one time too many or too few.
- A variable that changes where you didn't expect it.
- A function that's never called (no step inside it).

## Reading a stack trace

´´´text
DivisionByZeroError: Division by zero in index.php:3
#0 index.php(3): intdiv(10, 0)
#1 index.php(8): average(Array)
#2 index.php(12): report()
#3 {main}
´´´

Read it from the top: **#0** is where it blew up (´intdiv´, called on line 3). Each next line is the caller: ´average()´ was called from line 8, ´report()´ from line 12, and ´{main}´ is the top level of the script. The bug is usually not in ´intdiv´ but in the code that passed it a zero, so walk down the list until you reach your own decision.

## Useful functions

- ´debug_print_backtrace()´ prints how you got to the current line.
- ´__LINE__´, ´__FUNCTION__´, ´__METHOD__´ tell you where you are.
- ´assert($x > 0)´ stops early when an assumption is wrong.
- ´error_log("...")´ writes to the server log instead of the page.

## Outside this app

On a real project you'll use **Xdebug** with your editor (breakpoints, step over, step into, watch variables) and an error tracker in production. Never leave ´var_dump´ in committed code, and never show errors to visitors: set ´display_errors=Off´ in production and log them instead.
`,
      fr: md`
## Une méthode qui marche toujours

1. **Reproduis** le bug avec la plus petite entrée possible.
2. **Lis** le premier message d'erreur en entier : genre, message, fichier et ligne.
3. **Regarde** les vraies valeurs (´var_dump´, le panneau Variables) au lieu de les supposer.
4. **Resserre** : trouve la première ligne où une valeur n'est pas celle que tu attendais.
5. **Corrige**, relance pour confirmer, et garde la reproduction comme test si tu peux.

## Regarder les valeurs

| Outil | Montre |
|---|---|
| ´var_dump($x)´ | Type et valeur, imbriqués. L'outil de référence. |
| ´print_r($array)´ | Tableaux et objets lisibles, sans les types. |
| ´var_export($x)´ | La valeur en code PHP qu'on peut recoller. |
| ´json_encode($x, JSON_PRETTY_PRINT)´ | Des données imbriquées, en compact. |
| ´get_debug_type($x)´ | Juste le nom du type (PHP 8). |

> Astuce : ´var_dump("total", $total);´ étiquette l'affichage, pour savoir quelle ligne a affiché quoi.

## L'onglet Trace

Après chaque exécution, l'onglet **Trace** liste chaque instruction exécutée par PHP : la ligne, la fonction où elle était, la sortie jusque-là et les variables à cet instant. Clique sur une étape pour surligner sa ligne dans l'éditeur, ou utilise les flèches pour rejouer l'exécution. C'est un débogueur sans points d'arrêt : toute l'exécution est enregistrée.

Ce qu'il faut chercher :

- Une boucle qui tourne une fois de trop ou de moins.
- Une variable qui change là où tu ne t'y attendais pas.
- Une fonction jamais appelée (aucune étape à l'intérieur).

## Lire une stack trace

´´´text
DivisionByZeroError: Division by zero in index.php:3
#0 index.php(3): intdiv(10, 0)
#1 index.php(8): average(Array)
#2 index.php(12): report()
#3 {main}
´´´

Lis-la depuis le haut : **#0** est l'endroit où ça a explosé (´intdiv´, appelé ligne 3). Chaque ligne suivante est l'appelant : ´average()´ a été appelée ligne 8, ´report()´ ligne 12, et ´{main}´ est le niveau principal du script. Le bug n'est en général pas dans ´intdiv´ mais dans le code qui lui a passé un zéro : descends la liste jusqu'à ta propre décision.

## Des fonctions utiles

- ´debug_print_backtrace()´ affiche comment tu es arrivé à la ligne courante.
- ´__LINE__´, ´__FUNCTION__´, ´__METHOD__´ disent où tu es.
- ´assert($x > 0)´ s'arrête tôt quand une hypothèse est fausse.
- ´error_log("...")´ écrit dans le journal du serveur au lieu de la page.

## En dehors de cette appli

Sur un vrai projet, tu utiliseras **Xdebug** avec ton éditeur (points d'arrêt, pas à pas, inspection des variables) et un outil de suivi d'erreurs en production. Ne laisse jamais de ´var_dump´ dans le code commité, et n'affiche jamais les erreurs aux visiteurs : mets ´display_errors=Off´ en production et journalise-les à la place.
`,
    },
  },
  {
    slug: "guide-modern",
    section: "guides",
    icon: "Sparkles",
    lesson: "namespaces",
    more: ["autoloading", "generators", "iterators", "attributes", "functional"],
    title: { en: "Modern PHP", fr: "PHP moderne" },
    lead: {
      en: "How real projects are organised: namespaces, autoloading, generators, iterators, attributes and a functional style.",
      fr: "Comment les vrais projets sont organisés : namespaces, autoloading, générateurs, itérateurs, attributs et style fonctionnel.",
    },
    body: {
      en: md`
## Namespaces

Two libraries can both have a ´User´ class. Namespaces keep them apart, like folders for names:

´´´php
<?php
namespace App\Billing;

use App\Models\User;
use InvalidArgumentException;

final class Invoice
{
    public function __construct(private User $customer) {}
}
´´´

- ´namespace´ is the first statement of the file (after ´declare´).
- ´use´ imports a name so you can write ´User´ instead of ´App\Models\User´.
- A leading backslash means the global namespace: ´new \DateTimeImmutable()´.
- ´Invoice::class´ gives the full name as a string: ´"App\Billing\Invoice"´.

## Autoloading

Instead of a ´require´ per file, register an autoloader once. PHP calls it the first time a class is used:

´´´php
spl_autoload_register(function (string $class): void {
    $file = __DIR__ . '/src/' . str_replace('\\', '/', $class) . '.php';
    if (is_file($file)) {
        require $file;
    }
});
´´´

The convention behind this is **PSR-4**: namespace ´App\´ maps to folder ´src/´, so ´App\Billing\Invoice´ lives in ´src/Billing/Invoice.php´. Composer generates this autoloader for you (see the Composer guide).

## Generators

A function with ´yield´ produces values one by one, without building a whole array in memory:

´´´php
function lines(string $text): Generator
{
    foreach (explode("\n", $text) as $i => $line) {
        yield $i + 1 => trim($line);
    }
}
foreach (lines("a\nb") as $n => $line) {
    echo "$n: $line\n";
}
´´´

Generators are lazy: nothing runs until you loop. ´yield from´ delegates to another generator or array.

## Iterators

Implement ´IteratorAggregate´ (return a generator from ´getIterator()´) to make your own objects work with ´foreach´; add ´Countable´ for ´count()´ and ´ArrayAccess´ for ´$obj['key']´.

## Attributes (PHP 8)

´#[Route('/users')]´ attaches structured metadata to classes, methods, properties or parameters. Frameworks read them with Reflection to configure routes, validation or serialization. PHP ships a few that the engine itself understands: ´#[\Override]´ (8.3), ´#[\SensitiveParameter]´ (8.2), ´#[\Deprecated]´ (8.4), ´#[\NoDiscard]´ (8.5).

## A functional style

| Tool | Since |
|---|---|
| Closures and ´use´ | 5.3 |
| Arrow functions ´fn($x) => …´ | 7.4 |
| First-class callables ´strlen(...)´ | 8.1 |
| ´array_find´, ´array_any´, ´array_all´ | 8.4 |
| Pipe operator, written as a pipe then ´>´ | 8.5 |

PHP 8.5's pipe passes the value on its left into the callable on its right, so a chain of transformations reads from top to bottom:

´´´php
$slug = "  Hello World  "
    |> trim(...)
    |> strtolower(...)
    |> (fn($s) => str_replace(' ', '-', $s));
´´´
`,
      fr: md`
## Les namespaces

Deux bibliothèques peuvent avoir chacune une classe ´User´. Les namespaces les séparent, comme des dossiers pour les noms :

´´´php
<?php
namespace App\Billing;

use App\Models\User;
use InvalidArgumentException;

final class Invoice
{
    public function __construct(private User $customer) {}
}
´´´

- ´namespace´ est la première instruction du fichier (après ´declare´).
- ´use´ importe un nom pour écrire ´User´ au lieu de ´App\Models\User´.
- Un antislash au début désigne le namespace global : ´new \DateTimeImmutable()´.
- ´Invoice::class´ donne le nom complet en chaîne : ´"App\Billing\Invoice"´.

## L'autoloading

Au lieu d'un ´require´ par fichier, enregistre un autoloader une fois. PHP l'appelle la première fois qu'une classe est utilisée :

´´´php
spl_autoload_register(function (string $class): void {
    $file = __DIR__ . '/src/' . str_replace('\\', '/', $class) . '.php';
    if (is_file($file)) {
        require $file;
    }
});
´´´

La convention derrière s'appelle **PSR-4** : le namespace ´App\´ correspond au dossier ´src/´, donc ´App\Billing\Invoice´ vit dans ´src/Billing/Invoice.php´. Composer génère cet autoloader pour toi (voir le guide Composer).

## Les générateurs

Une fonction avec ´yield´ produit des valeurs une par une, sans construire tout un tableau en mémoire :

´´´php
function lines(string $text): Generator
{
    foreach (explode("\n", $text) as $i => $line) {
        yield $i + 1 => trim($line);
    }
}
foreach (lines("a\nb") as $n => $line) {
    echo "$n: $line\n";
}
´´´

Les générateurs sont paresseux : rien ne s'exécute tant que tu ne boucles pas. ´yield from´ délègue à un autre générateur ou tableau.

## Les itérateurs

Implémente ´IteratorAggregate´ (renvoie un générateur depuis ´getIterator()´) pour que tes objets marchent avec ´foreach´ ; ajoute ´Countable´ pour ´count()´ et ´ArrayAccess´ pour ´$obj['key']´.

## Les attributs (PHP 8)

´#[Route('/users')]´ attache des métadonnées structurées aux classes, méthodes, propriétés ou paramètres. Les frameworks les lisent avec la Reflection pour configurer les routes, la validation ou la sérialisation. PHP en fournit quelques-uns que le moteur comprend lui-même : ´#[\Override]´ (8.3), ´#[\SensitiveParameter]´ (8.2), ´#[\Deprecated]´ (8.4), ´#[\NoDiscard]´ (8.5).

## Un style fonctionnel

| Outil | Depuis |
|---|---|
| Closures et ´use´ | 5.3 |
| Fonctions fléchées ´fn($x) => …´ | 7.4 |
| Callables de première classe ´strlen(...)´ | 8.1 |
| ´array_find´, ´array_any´, ´array_all´ | 8.4 |
| Opérateur pipe, un pipe suivi de ´>´ | 8.5 |

Le pipe de PHP 8.5 passe la valeur à sa gauche au callable à sa droite, donc une chaîne de transformations se lit de haut en bas :

´´´php
$slug = "  Hello World  "
    |> trim(...)
    |> strtolower(...)
    |> (fn($s) => str_replace(' ', '-', $s));
´´´
`,
    },
  },
  {
    slug: "guide-web",
    section: "guides",
    icon: "Globe",
    lesson: "requests",
    more: ["forms-validation", "boss-api"],
    title: { en: "PHP for the web", fr: "PHP pour le web" },
    lead: {
      en: "Read what the browser sent, validate it, and send back HTML or JSON with the right status code.",
      fr: "Lis ce que le navigateur a envoyé, valide-le, et renvoie du HTML ou du JSON avec le bon code de statut.",
    },
    body: {
      en: md`
## What arrives with a request

PHP fills **superglobals**, arrays available everywhere:

| Superglobal | Contains | Example |
|---|---|---|
| ´$_GET´ | Query string parameters | ´/search?q=php´ gives ´$_GET['q']´ |
| ´$_POST´ | Form fields sent with POST | ´$_POST['email']´ |
| ´$_SERVER´ | Request details | ´$_SERVER['REQUEST_METHOD']´ |
| ´$_COOKIE´ | Cookies | ´$_COOKIE['theme']´ |
| ´$_SESSION´ | Data kept between requests (after ´session_start()´) | ´$_SESSION['user_id']´ |
| ´$_FILES´ | Uploaded files | ´$_FILES['avatar']´ |

Every value is a **string** (or an array of strings) typed by someone you don't know. Treat it as untrusted.

## Read, validate, use

´´´php
$page  = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

$errors = [];
if ($page === false)  $errors[] = "Invalid page";
if ($email === false) $errors[] = "Invalid email";
´´´

1. Read with ´??´ so a missing field is not a warning.
2. Normalise (´trim´, lowercase…).
3. Validate (´filter_var´, regex, rules of your domain).
4. Only then use the clean values.

## Responding

´´´php
header('Content-Type: application/json');
http_response_code(422);
echo json_encode(['errors' => $errors]);
´´´

| Code | Means |
|---|---|
| 200 | OK |
| 201 | Created |
| 302 | Redirect (´header('Location: /done')´) |
| 400 / 422 | Bad input / validation failed |
| 401 / 403 | Not logged in / not allowed |
| 404 | Not found |
| 500 | Server error |

> Warning: ´header()´ must be called before any output. A single space before ´<?php´ already counts as output.

## The POST/redirect/GET pattern

After a successful form submission, redirect to another page. Refreshing that page then won't submit the form twice.

## In this app

Code steps can simulate a request: the editor sends ´$_GET´ or ´$_POST´ values to your script, so you can build and test form handling and small JSON APIs without a server. Real deployments use PHP-FPM behind a web server, or a framework such as Laravel or Symfony that wraps all of this in Request and Response objects.
`,
      fr: md`
## Ce qui arrive avec une requête

PHP remplit des **superglobales**, des tableaux disponibles partout :

| Superglobale | Contient | Exemple |
|---|---|---|
| ´$_GET´ | Les paramètres de l'URL | ´/search?q=php´ donne ´$_GET['q']´ |
| ´$_POST´ | Les champs d'un formulaire envoyé en POST | ´$_POST['email']´ |
| ´$_SERVER´ | Les détails de la requête | ´$_SERVER['REQUEST_METHOD']´ |
| ´$_COOKIE´ | Les cookies | ´$_COOKIE['theme']´ |
| ´$_SESSION´ | Des données gardées entre requêtes (après ´session_start()´) | ´$_SESSION['user_id']´ |
| ´$_FILES´ | Les fichiers envoyés | ´$_FILES['avatar']´ |

Chaque valeur est une **chaîne** (ou un tableau de chaînes) tapée par quelqu'un que tu ne connais pas. Traite-la comme non fiable.

## Lire, valider, utiliser

´´´php
$page  = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
$email = filter_var(trim($_POST['email'] ?? ''), FILTER_VALIDATE_EMAIL);

$errors = [];
if ($page === false)  $errors[] = "Invalid page";
if ($email === false) $errors[] = "Invalid email";
´´´

1. Lis avec ´??´ pour qu'un champ absent ne soit pas un avertissement.
2. Normalise (´trim´, minuscules…).
3. Valide (´filter_var´, regex, règles de ton métier).
4. Seulement ensuite, utilise les valeurs propres.

## Répondre

´´´php
header('Content-Type: application/json');
http_response_code(422);
echo json_encode(['errors' => $errors]);
´´´

| Code | Signifie |
|---|---|
| 200 | OK |
| 201 | Créé |
| 302 | Redirection (´header('Location: /done')´) |
| 400 / 422 | Entrée invalide / validation échouée |
| 401 / 403 | Pas connecté / pas autorisé |
| 404 | Introuvable |
| 500 | Erreur serveur |

> Attention : ´header()´ doit être appelé avant toute sortie. Un seul espace avant ´<?php´ compte déjà comme une sortie.

## Le motif POST/redirection/GET

Après un formulaire envoyé avec succès, redirige vers une autre page. Rafraîchir cette page n'enverra alors pas le formulaire deux fois.

## Dans cette appli

Les étapes de code peuvent simuler une requête : l'éditeur envoie des valeurs ´$_GET´ ou ´$_POST´ à ton script, pour construire et tester la gestion de formulaires et de petites API JSON sans serveur. Les vrais déploiements utilisent PHP-FPM derrière un serveur web, ou un framework comme Laravel ou Symfony qui enveloppe tout ça dans des objets Request et Response.
`,
    },
  },
  {
    slug: "guide-security",
    section: "guides",
    icon: "ShieldCheck",
    lesson: "xss-escaping",
    more: ["sql-injection", "forms-validation"],
    title: { en: "Security essentials", fr: "L'essentiel de la sécurité" },
    lead: {
      en: "Four habits stop most attacks on PHP apps: escape output, use prepared statements, hash passwords, and never trust input.",
      fr: "Quatre habitudes arrêtent la plupart des attaques contre les applis PHP : échapper la sortie, utiliser des requêtes préparées, hacher les mots de passe, et ne jamais faire confiance aux entrées.",
    },
    body: {
      en: md`
## 1. Escape output (XSS)

If a user types ´<script>alert(1)</script>´ as their name and you print it as is, their script runs in every visitor's browser. That's **cross-site scripting**.

´´´php
function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
echo "<p>Hello, " . e($name) . "</p>";
´´´

´htmlspecialchars´ turns ´<´ ´>´ ´&´ ´"´ ´'´ into harmless entities. Escape **when printing**, for the context you print into: HTML text and attributes need ´htmlspecialchars´, URLs need ´urlencode´, JavaScript data needs ´json_encode´. Template engines (Twig, Blade) escape by default.

## 2. Prepared statements (SQL injection)

´´´php
// Never: the input becomes part of the SQL
$pdo->query("SELECT * FROM users WHERE email = '$email'");

// Always: the input is sent separately, as data
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
´´´

With string building, an email like ´' OR '1'='1´ changes the query itself. Placeholders (´?´ or ´:name´) make that impossible. Table and column names can't be placeholders: check them against a list you control.

## 3. Passwords

´´´php
$hash = password_hash($password, PASSWORD_DEFAULT); // store this
if (password_verify($attempt, $hash)) { /* logged in */ }
´´´

Never store passwords in plain text, and never use ´md5´ or ´sha1´ for them: they're designed to be fast, which helps attackers. ´password_hash´ is slow on purpose, salts automatically, and ´password_needs_rehash´ tells you when to upgrade.

## 4. Never trust input

| Input | Risk | Defence |
|---|---|---|
| Form fields, query string | Wrong types, huge values, scripts | Validate with ´filter_var´ and your rules |
| Uploaded files | Executable files, wrong types | Check size and MIME type, rename, store outside the web root |
| File paths from users | ´../../etc/passwd´ | Use ´basename()´ or a list of allowed names |
| Redirect targets | Phishing via your domain | Only redirect to known paths |
| ´unserialize()´ on user data | Object injection | Use ´json_decode´ instead |

## More good habits

- Use ´random_int()´ and ´random_bytes()´ for tokens, never ´rand()´.
- Compare secrets with ´hash_equals()´.
- Protect forms with a CSRF token stored in the session.
- Keep PHP up to date: each version gets security fixes for a limited time.
- Hide errors from visitors in production (´display_errors=Off´) and log them.

> Tip: The OWASP Top 10 is the standard list of web risks. Each lesson in chapter 9 matches one of them.
`,
      fr: md`
## 1. Échapper la sortie (XSS)

Si quelqu'un tape ´<script>alert(1)</script>´ comme nom et que tu l'affiches tel quel, son script s'exécute dans le navigateur de chaque visiteur. C'est le **cross-site scripting**.

´´´php
function e(string $s): string
{
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
}
echo "<p>Hello, " . e($name) . "</p>";
´´´

´htmlspecialchars´ transforme ´<´ ´>´ ´&´ ´"´ ´'´ en entités inoffensives. Échappe **au moment d'afficher**, selon le contexte : le texte et les attributs HTML demandent ´htmlspecialchars´, les URL ´urlencode´, les données JavaScript ´json_encode´. Les moteurs de gabarits (Twig, Blade) échappent par défaut.

## 2. Requêtes préparées (injection SQL)

´´´php
// Jamais : l'entrée devient une partie du SQL
$pdo->query("SELECT * FROM users WHERE email = '$email'");

// Toujours : l'entrée est envoyée à part, comme une donnée
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
´´´

En construisant la chaîne, un email comme ´' OR '1'='1´ modifie la requête elle-même. Les marqueurs (´?´ ou ´:name´) rendent ça impossible. Les noms de tables et de colonnes ne peuvent pas être des marqueurs : vérifie-les contre une liste que tu contrôles.

## 3. Les mots de passe

´´´php
$hash = password_hash($password, PASSWORD_DEFAULT); // stocke ceci
if (password_verify($attempt, $hash)) { /* connecté */ }
´´´

Ne stocke jamais de mot de passe en clair, et n'utilise jamais ´md5´ ou ´sha1´ pour ça : ils sont conçus pour être rapides, ce qui aide les attaquants. ´password_hash´ est lent exprès, ajoute un sel automatiquement, et ´password_needs_rehash´ te dit quand le mettre à jour.

## 4. Ne jamais faire confiance aux entrées

| Entrée | Risque | Défense |
|---|---|---|
| Champs de formulaire, URL | Mauvais types, valeurs énormes, scripts | Valider avec ´filter_var´ et tes règles |
| Fichiers envoyés | Fichiers exécutables, mauvais types | Vérifier taille et type MIME, renommer, stocker hors de la racine web |
| Chemins venant de l'utilisateur | ´../../etc/passwd´ | Utiliser ´basename()´ ou une liste de noms autorisés |
| Cibles de redirection | Hameçonnage via ton domaine | Ne rediriger que vers des chemins connus |
| ´unserialize()´ sur des données utilisateur | Injection d'objets | Utiliser ´json_decode´ à la place |

## D'autres bonnes habitudes

- Utilise ´random_int()´ et ´random_bytes()´ pour les jetons, jamais ´rand()´.
- Compare les secrets avec ´hash_equals()´.
- Protège les formulaires avec un jeton CSRF gardé en session.
- Tiens PHP à jour : chaque version reçoit des correctifs de sécurité pendant une durée limitée.
- Cache les erreurs aux visiteurs en production (´display_errors=Off´) et journalise-les.

> Astuce : l'OWASP Top 10 est la liste de référence des risques web. Chaque leçon du chapitre 9 correspond à l'un d'eux.
`,
    },
  },
  {
    slug: "guide-database",
    section: "guides",
    icon: "Database",
    lesson: "pdo",
    more: ["sql-injection", "boss-api"],
    title: { en: "Databases with PDO", fr: "Bases de données avec PDO" },
    lead: {
      en: "PDO talks to SQLite, MySQL, PostgreSQL and more with the same methods. Here it runs on a real in-memory SQLite database.",
      fr: "PDO parle à SQLite, MySQL, PostgreSQL et d'autres avec les mêmes méthodes. Ici, il tourne sur une vraie base SQLite en mémoire.",
    },
    body: {
      en: md`
## Connecting

´´´php
$pdo = new PDO('sqlite::memory:');                          // this app
$pdo = new PDO('mysql:host=db;dbname=shop;charset=utf8mb4', $user, $pass); // a server
´´´

The first argument is a **DSN**: the driver, then its options. Since PHP 8, PDO throws a ´PDOException´ on SQL errors by default (before, errors were silent unless you set ´PDO::ERRMODE_EXCEPTION´).

## Creating and filling a table

´´´php
$pdo->exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)');

$insert = $pdo->prepare('INSERT INTO products (name, price) VALUES (:name, :price)');
foreach ([['Pen', 150], ['Book', 2990]] as [$name, $price]) {
    $insert->execute(['name' => $name, 'price' => $price]);
}
echo $pdo->lastInsertId(); // 2
´´´

Prepare once, execute many times: it's both safer and faster.

## Reading

´´´php
$stmt = $pdo->prepare('SELECT name, price FROM products WHERE price < ? ORDER BY price');
$stmt->execute([1000]);
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo "{$row['name']}: {$row['price']}\n";
}
´´´

| Method | Returns |
|---|---|
| ´fetch(PDO::FETCH_ASSOC)´ | The next row as an array, or ´false´ |
| ´fetchAll(PDO::FETCH_ASSOC)´ | Every row |
| ´fetchColumn()´ | The first column of the next row (great for ´COUNT(*)´) |
| ´fetchAll(PDO::FETCH_CLASS, Product::class)´ | Objects |
| ´rowCount()´ | Rows changed by INSERT, UPDATE or DELETE |

## Transactions

´´´php
$pdo->beginTransaction();
try {
    $pdo->prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?')->execute([50, 1]);
    $pdo->prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')->execute([50, 2]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
´´´

Either both updates happen, or neither does.

> Warning: Never build SQL by gluing user input into the string. Use placeholders for every value. See the security guide.

## Going further

Real apps keep SQL in a **repository** class (´ProductRepository::findCheaperThan(int $cents)´) so the rest of the code never sees PDO. Frameworks add query builders and ORMs (Doctrine, Eloquent), but they all sit on top of the same ideas: connections, prepared statements and transactions.
`,
      fr: md`
## Se connecter

´´´php
$pdo = new PDO('sqlite::memory:');                          // cette appli
$pdo = new PDO('mysql:host=db;dbname=shop;charset=utf8mb4', $user, $pass); // un serveur
´´´

Le premier argument est un **DSN** : le pilote, puis ses options. Depuis PHP 8, PDO lève une ´PDOException´ sur les erreurs SQL par défaut (avant, les erreurs étaient silencieuses sauf si on réglait ´PDO::ERRMODE_EXCEPTION´).

## Créer et remplir une table

´´´php
$pdo->exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price INTEGER)');

$insert = $pdo->prepare('INSERT INTO products (name, price) VALUES (:name, :price)');
foreach ([['Pen', 150], ['Book', 2990]] as [$name, $price]) {
    $insert->execute(['name' => $name, 'price' => $price]);
}
echo $pdo->lastInsertId(); // 2
´´´

Prépare une fois, exécute plusieurs fois : c'est à la fois plus sûr et plus rapide.

## Lire

´´´php
$stmt = $pdo->prepare('SELECT name, price FROM products WHERE price < ? ORDER BY price');
$stmt->execute([1000]);
foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo "{$row['name']}: {$row['price']}\n";
}
´´´

| Méthode | Renvoie |
|---|---|
| ´fetch(PDO::FETCH_ASSOC)´ | La ligne suivante en tableau, ou ´false´ |
| ´fetchAll(PDO::FETCH_ASSOC)´ | Toutes les lignes |
| ´fetchColumn()´ | La première colonne de la ligne suivante (idéal pour ´COUNT(*)´) |
| ´fetchAll(PDO::FETCH_CLASS, Product::class)´ | Des objets |
| ´rowCount()´ | Les lignes modifiées par INSERT, UPDATE ou DELETE |

## Les transactions

´´´php
$pdo->beginTransaction();
try {
    $pdo->prepare('UPDATE accounts SET balance = balance - ? WHERE id = ?')->execute([50, 1]);
    $pdo->prepare('UPDATE accounts SET balance = balance + ? WHERE id = ?')->execute([50, 2]);
    $pdo->commit();
} catch (Throwable $e) {
    $pdo->rollBack();
    throw $e;
}
´´´

Soit les deux mises à jour ont lieu, soit aucune.

> Attention : ne construis jamais du SQL en collant une saisie utilisateur dans la chaîne. Utilise un marqueur pour chaque valeur. Voir le guide sécurité.

## Aller plus loin

Les vraies applis gardent le SQL dans une classe **repository** (´ProductRepository::findCheaperThan(int $cents)´) pour que le reste du code ne voie jamais PDO. Les frameworks ajoutent des query builders et des ORM (Doctrine, Eloquent), mais ils reposent tous sur les mêmes idées : connexions, requêtes préparées et transactions.
`,
    },
  },
  {
    slug: "guide-testing",
    section: "guides",
    icon: "FlaskConical",
    lesson: "testing",
    more: ["boss-api"],
    title: { en: "Testing your code", fr: "Tester ton code" },
    lead: {
      en: "A test is code that runs your code and checks the result. Start with plain assertions, then meet PHPUnit.",
      fr: "Un test est du code qui exécute ton code et vérifie le résultat. Commence par des assertions simples, puis découvre PHPUnit.",
    },
    body: {
      en: md`
## Why test?

Every lesson here checks your work by running it. Tests do the same for your projects: they prove a function does what you think, and they warn you the day a change breaks it. With tests, refactoring stops being scary.

## Arrange, act, assert

´´´php
function discount(int $cents, int $percent): int
{
    return intdiv($cents * (100 - $percent), 100);
}

// Arrange: the inputs. Act: one call. Assert: the expected result.
assert(discount(1000, 20) === 800);
assert(discount(999, 0) === 999);
echo "All good\n";
´´´

´assert()´ throws an ´AssertionError´ when the condition is false (in development, where ´zend.assertions´ is on). A tiny helper makes results visible:

´´´php
function check(string $name, bool $ok): void
{
    echo ($ok ? "PASS " : "FAIL ") . $name . "\n";
}
check("20% off 10.00", discount(1000, 20) === 800);
´´´

## What to test

| Case | Example for ´discount()´ |
|---|---|
| The normal case | 20% of 1000 |
| Edges | 0%, 100%, a price of 0 |
| Rounding | 999 with 33% |
| Bad input | a negative percent should throw |

Test behaviour, not implementation: check what comes out, not how the function does it.

## PHPUnit

In real projects you'll use **PHPUnit** (or Pest, built on top of it), installed with Composer:

´´´php
use PHPUnit\Framework\TestCase;

final class DiscountTest extends TestCase
{
    public function testTwentyPercentOff(): void
    {
        $this->assertSame(800, discount(1000, 20));
    }

    public function testRejectsNegativePercent(): void
    {
        $this->expectException(InvalidArgumentException::class);
        discount(1000, -5);
    }
}
´´´

Run them with ´vendor/bin/phpunit´. ´assertSame´ compares with ´===´, which is what you want almost every time.

> Tip: When you fix a bug, first write a test that fails because of it. Then fix the code and watch the test pass. The bug can never come back silently.
`,
      fr: md`
## Pourquoi tester ?

Chaque leçon ici vérifie ton travail en l'exécutant. Les tests font pareil pour tes projets : ils prouvent qu'une fonction fait ce que tu crois, et ils te préviennent le jour où un changement la casse. Avec des tests, refactoriser ne fait plus peur.

## Préparer, agir, vérifier

´´´php
function discount(int $cents, int $percent): int
{
    return intdiv($cents * (100 - $percent), 100);
}

// Préparer : les entrées. Agir : un appel. Vérifier : le résultat attendu.
assert(discount(1000, 20) === 800);
assert(discount(999, 0) === 999);
echo "All good\n";
´´´

´assert()´ lève une ´AssertionError´ quand la condition est fausse (en développement, où ´zend.assertions´ est actif). Une petite aide rend les résultats visibles :

´´´php
function check(string $name, bool $ok): void
{
    echo ($ok ? "PASS " : "FAIL ") . $name . "\n";
}
check("20% off 10.00", discount(1000, 20) === 800);
´´´

## Quoi tester

| Cas | Exemple pour ´discount()´ |
|---|---|
| Le cas normal | 20 % de 1000 |
| Les limites | 0 %, 100 %, un prix de 0 |
| Les arrondis | 999 avec 33 % |
| Une mauvaise entrée | un pourcentage négatif doit lever une exception |

Teste le comportement, pas l'implémentation : vérifie ce qui sort, pas comment la fonction s'y prend.

## PHPUnit

Dans les vrais projets, tu utiliseras **PHPUnit** (ou Pest, construit dessus), installé avec Composer :

´´´php
use PHPUnit\Framework\TestCase;

final class DiscountTest extends TestCase
{
    public function testTwentyPercentOff(): void
    {
        $this->assertSame(800, discount(1000, 20));
    }

    public function testRejectsNegativePercent(): void
    {
        $this->expectException(InvalidArgumentException::class);
        discount(1000, -5);
    }
}
´´´

Lance-les avec ´vendor/bin/phpunit´. ´assertSame´ compare avec ´===´, ce qu'on veut presque toujours.

> Astuce : quand tu corriges un bug, écris d'abord un test qui échoue à cause de lui. Corrige ensuite le code et regarde le test passer. Le bug ne pourra plus revenir en silence.
`,
    },
  },
  {
    slug: "guide-versions",
    section: "guides",
    icon: "History",
    lesson: "php80",
    more: ["php7-recap", "php81", "php82", "php83", "php84", "php85", "boss-migrate"],
    title: { en: "PHP 7.0 to 8.5 at a glance", fr: "PHP 7.0 à 8.5 en un coup d'œil" },
    lead: {
      en: "Ten years of releases in one table, what breaks when you upgrade, and how to try any version right here.",
      fr: "Dix ans de versions dans un tableau, ce qui casse quand on met à jour, et comment essayer chaque version ici même.",
    },
    body: {
      en: md`
## One release a year

PHP ships a new minor version every November. Each one gets two years of bug fixes and then security fixes only, so upgrading regularly is part of the job. In this app you can run code on **7.4, 8.0, 8.1, 8.2, 8.3, 8.4 and 8.5**: pick the version in the editor toolbar, or open [the versions page](/versions) to compare them side by side.

## The timeline

| Version | Released | Headline features |
|---|---|---|
| 7.0 | Dec 2015 | Twice as fast as 5.6, scalar and return types, ´??´, spaceship ´<=>´, anonymous classes |
| 7.1 | Dec 2016 | Nullable types ´?int´, ´void´, ´[$a, $b] = ...´, multi-catch, class constant visibility |
| 7.2 | Nov 2017 | ´object´ type, Argon2 password hashing, libsodium |
| 7.3 | Dec 2018 | Flexible heredoc, trailing commas in calls, ´array_key_first()´, ´is_countable()´ |
| 7.4 | Nov 2019 | Typed properties, arrow functions ´fn´, ´??=´, spread in arrays, ´1_000´ separators |
| 8.0 | Nov 2020 | ´match´, named arguments, nullsafe ´?->´, constructor promotion, union types, attributes, ´str_contains()´, JIT |
| 8.1 | Nov 2021 | Enums, readonly properties, first-class callables ´f(...)´, ´never´, ´new´ in initializers, fibers |
| 8.2 | Dec 2022 | Readonly classes, DNF types, ´true´/´false´/´null´ types, Random extension, dynamic properties deprecated |
| 8.3 | Nov 2023 | Typed class constants, ´#[\Override]´, ´json_validate()´, dynamic class constant fetch |
| 8.4 | Nov 2024 | Property hooks, asymmetric visibility, ´new Foo()->bar()´, ´array_find()´, ´#[\Deprecated]´ |
| 8.5 | Nov 2025 | Pipe operator, ´clone()´ with properties, ´array_first()´/´array_last()´, ´#[\NoDiscard]´, URI extension |

## What breaks when you upgrade

| From → to | Watch out for |
|---|---|
| 7.x → 8.0 | ´0 == "a"´ is now false; arithmetic on non-numeric strings throws TypeError; many notices became warnings; internal functions throw on wrong types |
| 8.0 → 8.1 | Passing ´null´ to non-nullable internal parameters is deprecated (´strlen(null)´) |
| 8.1 → 8.2 | Creating undeclared (dynamic) properties is deprecated; ´"$´ + braces interpolation deprecated |
| 8.3 → 8.4 | Implicitly nullable parameters (´string $s = null´) are deprecated: write ´?string´ |
| 8.4 → 8.5 | Backtick operator and non-canonical casts like ´(boolean)´ deprecated |

Deprecations are warnings today and errors in the next major version. Fix them as you see them.

## How to upgrade a project

1. Run your tests on the current version, with all deprecations visible (´error_reporting(E_ALL)´).
2. Fix every deprecation notice.
3. Switch to the next version, run the tests again, fix what broke.
4. Repeat one version at a time. Tools such as Rector can automate many changes.

> Tip: The versions chapter of the course lets you run the same script on each version: the fastest way to feel what changed.
`,
      fr: md`
## Une version par an

PHP sort une nouvelle version mineure chaque novembre. Chacune reçoit deux ans de corrections de bugs puis seulement des correctifs de sécurité : mettre à jour régulièrement fait partie du métier. Dans cette appli, tu peux exécuter du code en **7.4, 8.0, 8.1, 8.2, 8.3, 8.4 et 8.5** : choisis la version dans la barre d'outils de l'éditeur, ou ouvre [la page des versions](/versions) pour les comparer côte à côte.

## La chronologie

| Version | Sortie | Fonctionnalités phares |
|---|---|---|
| 7.0 | déc. 2015 | Deux fois plus rapide que 5.6, types scalaires et de retour, ´??´, vaisseau spatial ´<=>´, classes anonymes |
| 7.1 | déc. 2016 | Types nullables ´?int´, ´void´, ´[$a, $b] = ...´, multi-catch, visibilité des constantes de classe |
| 7.2 | nov. 2017 | Type ´object´, hachage Argon2, libsodium |
| 7.3 | déc. 2018 | Heredoc flexible, virgules finales dans les appels, ´array_key_first()´, ´is_countable()´ |
| 7.4 | nov. 2019 | Propriétés typées, fonctions fléchées ´fn´, ´??=´, spread dans les tableaux, séparateurs ´1_000´ |
| 8.0 | nov. 2020 | ´match´, arguments nommés, nullsafe ´?->´, promotion de constructeur, types union, attributs, ´str_contains()´, JIT |
| 8.1 | nov. 2021 | Enums, propriétés readonly, callables de première classe ´f(...)´, ´never´, ´new´ dans les initialiseurs, fibers |
| 8.2 | déc. 2022 | Classes readonly, types DNF, types ´true´/´false´/´null´, extension Random, propriétés dynamiques dépréciées |
| 8.3 | nov. 2023 | Constantes de classe typées, ´#[\Override]´, ´json_validate()´, accès dynamique aux constantes |
| 8.4 | nov. 2024 | Hooks de propriétés, visibilité asymétrique, ´new Foo()->bar()´, ´array_find()´, ´#[\Deprecated]´ |
| 8.5 | nov. 2025 | Opérateur pipe, ´clone()´ avec propriétés, ´array_first()´/´array_last()´, ´#[\NoDiscard]´, extension URI |

## Ce qui casse quand on met à jour

| De → vers | Attention à |
|---|---|
| 7.x → 8.0 | ´0 == "a"´ est maintenant faux ; l'arithmétique sur des chaînes non numériques lève une TypeError ; beaucoup de notices sont devenues des warnings ; les fonctions internes lèvent une erreur sur un mauvais type |
| 8.0 → 8.1 | Passer ´null´ à un paramètre interne non nullable est déprécié (´strlen(null)´) |
| 8.1 → 8.2 | Créer des propriétés non déclarées (dynamiques) est déprécié ; l'interpolation ´"$´ + accolades est dépréciée |
| 8.3 → 8.4 | Les paramètres implicitement nullables (´string $s = null´) sont dépréciés : écris ´?string´ |
| 8.4 → 8.5 | L'opérateur backtick et les casts non canoniques comme ´(boolean)´ sont dépréciés |

Les dépréciations sont des avertissements aujourd'hui et des erreurs à la prochaine version majeure. Corrige-les dès que tu les vois.

## Mettre à jour un projet

1. Lance tes tests sur la version actuelle, avec toutes les dépréciations visibles (´error_reporting(E_ALL)´).
2. Corrige chaque avertissement de dépréciation.
3. Passe à la version suivante, relance les tests, corrige ce qui a cassé.
4. Recommence une version à la fois. Des outils comme Rector automatisent beaucoup de changements.

> Astuce : le chapitre sur les versions te fait exécuter le même script sur chaque version : le moyen le plus rapide de sentir ce qui a changé.
`,
    },
  },
  {
    slug: "guide-composer",
    section: "guides",
    icon: "Package",
    lesson: "autoloading",
    more: ["namespaces", "testing"],
    title: { en: "Composer and packages", fr: "Composer et les paquets" },
    lead: {
      en: "Composer installs libraries, locks their versions and writes your autoloader. Every modern PHP project starts with it.",
      fr: "Composer installe les bibliothèques, verrouille leurs versions et écrit ton autoloader. Tout projet PHP moderne commence par lui.",
    },
    body: {
      en: md`
## What Composer does

Composer is PHP's dependency manager. It reads a ´composer.json´ file, downloads the packages it lists from **Packagist** (the public package registry) into a ´vendor/´ folder, and generates ´vendor/autoload.php´. It's a command-line tool: install it from getcomposer.org, then run it in your project folder. (It doesn't run inside this app, but everything here maps to what it does.)

## composer.json

´´´json
{
    "name": "acme/shop",
    "require": {
        "php": ">=8.3",
        "monolog/monolog": "^3.5"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0"
    },
    "autoload": {
        "psr-4": { "App\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Tests\\": "tests/" }
    }
}
´´´

| Key | Meaning |
|---|---|
| ´require´ | Packages your app needs to run, and the PHP version |
| ´require-dev´ | Tools for development only: tests, static analysis |
| ´autoload.psr-4´ | Namespace prefix → folder, for your own classes |
| ´scripts´ | Shortcuts such as ´composer test´ |

## Version constraints

| Constraint | Allows |
|---|---|
| ´^3.5´ | 3.5 and above, but below 4.0 (the usual choice) |
| ´~3.5´ | 3.5 and above, below 4.0 (´~3.5.2´ would stay below 3.6) |
| ´3.5.*´ | Any 3.5 patch |
| ´>=8.3´ | 8.3 or newer |

Packages follow **semantic versioning**: a major version change (3 → 4) may break your code; minor and patch updates shouldn't.

## The everyday commands

| Command | What it does |
|---|---|
| ´composer init´ | Create a composer.json interactively |
| ´composer require monolog/monolog´ | Add a package and install it |
| ´composer require --dev phpunit/phpunit´ | Add a development tool |
| ´composer install´ | Install exactly what composer.lock says |
| ´composer update´ | Upgrade within the constraints and rewrite composer.lock |
| ´composer dump-autoload´ | Regenerate the autoloader after adding namespaces |

## composer.lock

´composer update´ writes the exact version of every package (including dependencies of dependencies) to ´composer.lock´. **Commit it.** Your teammates and your server then run ´composer install´ and get the very same versions. Do **not** commit ´vendor/´: it's rebuilt from the lock file.

## Using it

´´´php
<?php
require __DIR__ . '/vendor/autoload.php';

use App\Billing\Invoice;      // from src/Billing/Invoice.php
use Monolog\Logger;           // from vendor/
´´´

One ´require´ at the top of your entry file, and every class from your code and your packages loads on demand.

> Tip: ´composer audit´ checks your installed packages against known security advisories. Run it regularly.
`,
      fr: md`
## Ce que fait Composer

Composer est le gestionnaire de dépendances de PHP. Il lit un fichier ´composer.json´, télécharge les paquets qu'il liste depuis **Packagist** (le registre public de paquets) dans un dossier ´vendor/´, et génère ´vendor/autoload.php´. C'est un outil en ligne de commande : installe-le depuis getcomposer.org, puis lance-le dans le dossier de ton projet. (Il ne tourne pas dans cette appli, mais tout ce qu'on voit ici correspond à ce qu'il fait.)

## composer.json

´´´json
{
    "name": "acme/shop",
    "require": {
        "php": ">=8.3",
        "monolog/monolog": "^3.5"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0"
    },
    "autoload": {
        "psr-4": { "App\\": "src/" }
    },
    "autoload-dev": {
        "psr-4": { "Tests\\": "tests/" }
    }
}
´´´

| Clé | Signification |
|---|---|
| ´require´ | Les paquets nécessaires à l'appli, et la version de PHP |
| ´require-dev´ | Les outils pour le développement seulement : tests, analyse statique |
| ´autoload.psr-4´ | Préfixe de namespace → dossier, pour tes propres classes |
| ´scripts´ | Des raccourcis comme ´composer test´ |

## Les contraintes de version

| Contrainte | Autorise |
|---|---|
| ´^3.5´ | 3.5 et plus, mais moins que 4.0 (le choix habituel) |
| ´~3.5´ | 3.5 et plus, moins que 4.0 (´~3.5.2´ resterait sous 3.6) |
| ´3.5.*´ | N'importe quel correctif de 3.5 |
| ´>=8.3´ | 8.3 ou plus récent |

Les paquets suivent le **versionnage sémantique** : un changement de version majeure (3 → 4) peut casser ton code ; les mises à jour mineures et correctives ne devraient pas.

## Les commandes de tous les jours

| Commande | Ce qu'elle fait |
|---|---|
| ´composer init´ | Crée un composer.json de façon interactive |
| ´composer require monolog/monolog´ | Ajoute un paquet et l'installe |
| ´composer require --dev phpunit/phpunit´ | Ajoute un outil de développement |
| ´composer install´ | Installe exactement ce que dit composer.lock |
| ´composer update´ | Met à jour dans les contraintes et réécrit composer.lock |
| ´composer dump-autoload´ | Régénère l'autoloader après avoir ajouté des namespaces |

## composer.lock

´composer update´ écrit la version exacte de chaque paquet (y compris les dépendances des dépendances) dans ´composer.lock´. **Commite-le.** Tes collègues et ton serveur lancent alors ´composer install´ et obtiennent exactement les mêmes versions. Ne commite **pas** ´vendor/´ : il est reconstruit à partir du fichier lock.

## L'utiliser

´´´php
<?php
require __DIR__ . '/vendor/autoload.php';

use App\Billing\Invoice;      // depuis src/Billing/Invoice.php
use Monolog\Logger;           // depuis vendor/
´´´

Un seul ´require´ en haut de ton fichier d'entrée, et chaque classe de ton code et de tes paquets se charge à la demande.

> Astuce : ´composer audit´ vérifie tes paquets installés contre les alertes de sécurité connues. Lance-le régulièrement.
`,
    },
  },
];
