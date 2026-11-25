import { L } from "@/lib/txt";
import { all, avoids, clean, outputIs, outputLines, uses } from "../checks";
import type { Check, Lesson } from "../types";

const CH = "web";

/** Same JSON shape, whatever PHP did with slashes or float formatting. */
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

/** A probe returns this value (compared as decoded JSON). */
const returns =
  (expr: string, expected: unknown): Check =>
  (c) => {
    const p = c.probe(expr);
    if (!p.ok || p.json === null) return false;
    try {
      return same(JSON.parse(p.json), expected);
    } catch {
      return false;
    }
  };

/** A probe returns a string that contains this text. */
const returnsText =
  (expr: string, test: (s: string) => boolean): Check =>
  (c) => {
    const p = c.probe(expr);
    if (!p.ok || p.json === null) return false;
    try {
      const v: unknown = JSON.parse(p.json);
      return typeof v === "string" && test(v);
    } catch {
      return false;
    }
  };

/** The whole output is JSON equal to this value. */
const outputJson =
  (expected: unknown): Check =>
  (c) => {
    try {
      return same(JSON.parse(c.out), expected);
    } catch {
      return false;
    }
  };

const checkLines = (c: { out: string }) => c.out.split("\n").map((l) => l.trim());

// ───────────────────────────────────────────── 1. Requests

export const requests: Lesson = {
  id: "requests",
  chapterId: CH,
  title: L("From a URL to your script", "D'une URL à ton script"),
  tagline: L("Requests, $_GET, $_SERVER and what the browser gets back", "Les requêtes, $_GET, $_SERVER et ce que le navigateur reçoit"),
  xp: 70,
  syntax: ["$_GET", "$_SERVER", "??", "parse_str", "header", "json_encode"],
  doc: "guide-web",
  steps: [
    {
      kind: "discover",
      title: L("The request/response cycle", "Le cycle requête/réponse"),
      body: [
        L(
          "When you open `https://shop.example/product.php?id=42`, your browser sends a **request**: a method (`GET`), a path, a query string (`id=42`), some headers, and sometimes a body.",
          "Quand tu ouvres `https://shop.example/product.php?id=42`, ton navigateur envoie une **requête** : une méthode (`GET`), un chemin, une query string (`id=42`), des en-têtes, et parfois un corps.",
        ),
        L(
          "The web server (Nginx or Apache with PHP-FPM) hands it to PHP. PHP fills the **superglobals** — `$_GET`, `$_POST`, `$_SERVER`, `$_COOKIE` — runs your script, and **everything you print becomes the response body**.",
          "Le serveur web (Nginx ou Apache avec PHP-FPM) la passe à PHP. PHP remplit les **superglobales** — `$_GET`, `$_POST`, `$_SERVER`, `$_COOKIE` — exécute ton script, et **tout ce que tu affiches devient le corps de la réponse**.",
        ),
        L(
          "Then the script ends and PHP forgets everything. The next request starts from zero: that's why PHP is called **stateless**, and why sessions and databases exist.",
          "Puis le script se termine et PHP oublie tout. La requête suivante repart de zéro : c'est pour ça qu'on dit que PHP est **sans état**, et que les sessions et les bases de données existent.",
        ),
      ],
      scene: "request",
      example: {
        code: `<?php\necho "Method: " . $_SERVER['REQUEST_METHOD'] . "\\n";\necho "URI: " . $_SERVER['REQUEST_URI'] . "\\n";\necho "Name: " . ($_GET['name'] ?? 'nobody') . "\\n";\n`,
        caption: L(
          "This run has no query string, so `$_GET['name']` is missing and `??` gives the fallback.",
          "Cette exécution n'a pas de query string : `$_GET['name']` est absent et `??` donne la valeur de secours.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Query strings become $_GET", "La query string devient $_GET"),
      body: [
        L(
          "Everything after `?` in a URL is the query string: `name=Ada&lang=fr`. PHP decodes it into the array `$_GET`, exactly like the `parse_str()` function below does.",
          "Tout ce qui suit le `?` dans une URL est la query string : `name=Ada&lang=fr`. PHP la décode dans le tableau `$_GET`, exactement comme la fonction `parse_str()` ci-dessous.",
        ),
        L(
          "Two things to remember: values are **always strings** (or arrays, with `tags[]=…`), and any key can be **missing**. Read them with `??` and convert them yourself.",
          "Deux choses à retenir : les valeurs sont **toujours des chaînes** (ou des tableaux, avec `tags[]=…`), et n'importe quelle clé peut être **absente**. Lis-les avec `??` et convertis-les toi-même.",
        ),
      ],
      example: {
        code: `<?php\nparse_str("name=Ada&age=36&tags[]=php&tags[]=web", $query);\nvar_dump($query);\n\n// And the other way round:\necho http_build_query(['q' => 'php 8', 'page' => 2]);\n`,
      },
      callout: {
        tone: "warn",
        text: L(
          "Anyone can type any URL. `$_GET['id']` might be `\"42\"`, `\"abc\"`, an array or nothing at all. Never trust it without checking.",
          "N'importe qui peut taper n'importe quelle URL. `$_GET['id']` peut valoir `\"42\"`, `\"abc\"`, un tableau ou rien du tout. Ne lui fais jamais confiance sans vérifier.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Build a response from the request", "Construis une réponse à partir de la requête"),
      body: L(
        "This page greets the visitor in their language. There's no query string in this run, so watch the fallbacks kick in, then the HTML being assembled.",
        "Cette page salue le visiteur dans sa langue. Il n'y a pas de query string ici : regarde les valeurs de secours s'appliquer, puis le HTML se construire.",
      ),
      code: `<?php\n$name = $_GET['name'] ?? 'guest';\n$lang = $_GET['lang'] ?? 'en';\n$greeting = $lang === 'fr' ? 'Bonjour' : 'Hello';\n$html = "<h1>$greeting, $name!</h1>";\necho $html;\n`,
      notes: {
        2: L("No `name` in the URL: `??` picks 'guest' instead of a warning.", "Pas de `name` dans l'URL : `??` choisit 'guest' au lieu d'un avertissement."),
        3: L("Same for the language: 'en' by default.", "Pareil pour la langue : 'en' par défaut."),
        4: L("A ternary picks the greeting. With `?lang=fr` it would say Bonjour.", "Un ternaire choisit la salutation. Avec `?lang=fr`, ce serait Bonjour."),
        5: L("The HTML is just a string until it's printed.", "Le HTML n'est qu'une chaîne tant qu'il n'est pas affiché."),
        6: L("Printed: this is the response body the browser will render.", "Affiché : c'est le corps de réponse que le navigateur va afficher."),
      },
    },
    {
      kind: "try",
      title: L("Read the query string", "Lis la query string"),
      body: L(
        "This run simulates the URL `/index.php?name=Grace`. Greet the visitor using `$_GET['name']`, with `'guest'` as the fallback when it's missing. The output must be `Hello, Grace!`.",
        "Cette exécution simule l'URL `/index.php?name=Grace`. Salue le visiteur avec `$_GET['name']`, et `'guest'` comme valeur de secours s'il manque. La sortie doit être `Hello, Grace!`.",
      ),
      request: { query: { name: "Grace" } },
      files: { "index.php": `<?php\n// The URL is /index.php?name=Grace\n$name = 'guest';\n\necho "Hello, $name!";\n` },
      solution: { "index.php": `<?php\n// The URL is /index.php?name=Grace\n$name = $_GET['name'] ?? 'guest';\n\necho "Hello, $name!";\n` },
      objectives: [
        {
          id: "greet",
          label: L("Print Hello, Grace! using $_GET with a ?? fallback", "Afficher Hello, Grace! avec $_GET et un repli ??"),
          check: all(outputIs("Hello, Grace!"), uses(/\$_GET\s*\[\s*['"]name['"]\s*\]/), uses(/\?\?/)),
          hints: [
            L("The value comes from the URL, so it lives in `$_GET`.", "La valeur vient de l'URL, donc elle est dans `$_GET`."),
            L("`$_GET['name'] ?? 'guest'` reads the key, or gives 'guest' if it's missing.", "`$_GET['name'] ?? 'guest'` lit la clé, ou donne 'guest' si elle manque."),
            L("Line 3: `$name = $_GET['name'] ?? 'guest';`", "Ligne 3 : `$name = $_GET['name'] ?? 'guest';`"),
          ],
        },
      ],
      cheat: "web",
    },
    {
      kind: "discover",
      title: L("HTML or JSON: choosing the response", "HTML ou JSON : choisir la réponse"),
      body: [
        L(
          "A response also has a **status code** and **headers**. `http_response_code(404)` sets the status; `header('Content-Type: application/json')` tells the client what's in the body.",
          "Une réponse a aussi un **code de statut** et des **en-têtes**. `http_response_code(404)` fixe le statut ; `header('Content-Type: application/json')` dit au client ce que contient le corps.",
        ),
        L(
          "Web pages answer HTML; APIs used by mobile apps or JavaScript answer **JSON**, built with `json_encode()`. Same PHP, different output.",
          "Les pages web répondent du HTML ; les API utilisées par les applis mobiles ou le JavaScript répondent du **JSON**, construit avec `json_encode()`. Même PHP, sortie différente.",
        ),
      ],
      example: {
        code: `<?php\nheader('Content-Type: application/json');\n$user = ['id' => 7, 'name' => 'Ada', 'admin' => false];\necho json_encode($user);\n`,
        caption: L(
          "Headers aren't shown here, but a real browser or app reads them before the body.",
          "Les en-têtes ne sont pas affichés ici, mais un vrai navigateur ou une appli les lit avant le corps.",
        ),
      },
      callout: {
        tone: "tip",
        text: L(
          "Call `header()` before printing anything: once output starts, headers are sent and PHP warns \"headers already sent\".",
          "Appelle `header()` avant d'afficher quoi que ce soit : dès que la sortie commence, les en-têtes partent et PHP prévient « headers already sent ».",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Strings everywhere", "Des chaînes partout"),
      question: L("The URL ends with `?page=2&tags[]=php&tags[]=web`. What does this print?", "L'URL finit par `?page=2&tags[]=php&tags[]=web`. Qu'affiche ce code ?"),
      code: `<?php\nparse_str("page=2&tags[]=php&tags[]=web", $q);\necho gettype($q['page']), " ", count($q['tags']);\n`,
      options: ["integer 2", "string 2", "string 1", "integer 1"],
      answer: 1,
      explain: L(
        "Query values are always strings, even `2`. And `tags[]` repeated twice builds an array of 2 items.",
        "Les valeurs de la query string sont toujours des chaînes, même `2`. Et `tags[]` répété deux fois construit un tableau de 2 éléments.",
      ),
    },
    {
      kind: "challenge",
      title: L("A tiny JSON endpoint", "Un mini point d'API JSON"),
      body: L(
        "This run simulates `/index.php?id=42&format=json`. Read `id` as an **int** (default 0), build the product `['id' => $id, 'name' => \"Product $id\"]`, and when `format` is `json`, send the JSON content type and print it with `json_encode`. Otherwise print plain text.",
        "Cette exécution simule `/index.php?id=42&format=json`. Lis `id` comme un **entier** (0 par défaut), construis le produit `['id' => $id, 'name' => \"Product $id\"]`, et quand `format` vaut `json`, envoie le type de contenu JSON et affiche-le avec `json_encode`. Sinon, affiche du texte.",
      ),
      request: { query: { id: "42", format: "json" } },
      files: {
        "index.php": `<?php\n// The URL is /index.php?id=42&format=json\n// 1. Read id as an int (default 0)\n// 2. Build the product array\n// 3. If format is "json": send the JSON header and print json_encode($product)\n//    otherwise: print "Product #42: Product 42"\n`,
      },
      solution: {
        "index.php": `<?php\n$id = (int) ($_GET['id'] ?? 0);\n$format = $_GET['format'] ?? 'text';\n$product = ['id' => $id, 'name' => "Product $id"];\n\nif ($format === 'json') {\n    header('Content-Type: application/json');\n    echo json_encode($product);\n} else {\n    echo "Product #$id: {$product['name']}";\n}\n`,
      },
      objectives: [
        {
          id: "int-id",
          label: L("The JSON has the id as a number: \"id\":42", "Le JSON contient l'id en nombre : \"id\":42"),
          check: (c) => {
            try {
              return (JSON.parse(c.out) as { id?: unknown }).id === 42;
            } catch {
              return false;
            }
          },
          hints: [
            L("`$_GET['id']` is the string \"42\"; JSON would show it as \"42\" with quotes.", "`$_GET['id']` est la chaîne \"42\" ; le JSON l'afficherait \"42\" entre guillemets."),
            L("Cast it: `(int) ($_GET['id'] ?? 0)`.", "Convertis-la : `(int) ($_GET['id'] ?? 0)`."),
            L("`$id = (int) ($_GET['id'] ?? 0);` then `echo json_encode(['id' => $id, 'name' => \"Product $id\"]);`", "`$id = (int) ($_GET['id'] ?? 0);` puis `echo json_encode(['id' => $id, 'name' => \"Product $id\"]);`"),
          ],
        },
        {
          id: "shape",
          label: L("The output is exactly {\"id\":42,\"name\":\"Product 42\"}", "La sortie est exactement {\"id\":42,\"name\":\"Product 42\"}"),
          check: outputJson({ id: 42, name: "Product 42" }),
          hints: [
            L("Print only the JSON: no extra text before or after.", "Affiche uniquement le JSON : pas de texte avant ou après."),
            L("Build `$product = ['id' => $id, 'name' => \"Product $id\"];` then `echo json_encode($product);`", "Construis `$product = ['id' => $id, 'name' => \"Product $id\"];` puis `echo json_encode($product);`"),
            L("See the walkthrough of the first objective, and make sure the name uses double quotes so `$id` is replaced.", "Vois le pas-à-pas du premier objectif, et vérifie que le nom utilise des guillemets doubles pour que `$id` soit remplacé."),
          ],
        },
        {
          id: "format",
          label: L("Answer JSON only when format is json, with the right header", "Répondre en JSON seulement si format vaut json, avec le bon en-tête"),
          check: all(uses(/\$_GET\s*\[\s*['"]format['"]\s*\]/), uses(/header\s*\(\s*['"]Content-Type:\s*application\/json/i), uses(/\bif\b|\?|\bmatch\b/)),
          hints: [
            L("Read `$_GET['format']` (with a fallback) and test it with `if`.", "Lis `$_GET['format']` (avec un repli) et teste-le avec `if`."),
            L("Inside the `if`, call `header('Content-Type: application/json');` before the echo.", "Dans le `if`, appelle `header('Content-Type: application/json');` avant le echo."),
            L(
              "`if ($format === 'json') { header('Content-Type: application/json'); echo json_encode($product); } else { echo \"Product #$id: {$product['name']}\"; }`",
              "`if ($format === 'json') { header('Content-Type: application/json'); echo json_encode($product); } else { echo \"Product #$id: {$product['name']}\"; }`",
            ),
          ],
        },
      ],
      cheat: "web",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A request (method, URL, headers, body) becomes `$_GET`, `$_POST`, `$_SERVER`; what you print becomes the response.", "Une requête (méthode, URL, en-têtes, corps) devient `$_GET`, `$_POST`, `$_SERVER` ; ce que tu affiches devient la réponse."),
    L("Each request starts from zero: PHP is stateless.", "Chaque requête repart de zéro : PHP est sans état."),
    L("Query values are strings and may be missing: use `??` and cast them.", "Les valeurs de la query string sont des chaînes et peuvent manquer : utilise `??` et convertis-les."),
    L("`header()` and `http_response_code()` shape the response; `json_encode()` builds JSON for APIs.", "`header()` et `http_response_code()` façonnent la réponse ; `json_encode()` construit le JSON des API."),
  ],
};

// ───────────────────────────────────────────── 2. Forms and validation

export const formsValidation: Lesson = {
  id: "forms-validation",
  chapterId: CH,
  title: L("Forms and validation", "Formulaires et validation"),
  tagline: L("Read $_POST safely: trim, filter_var and clear error messages", "Lire $_POST en sécurité : trim, filter_var et des messages d'erreur clairs"),
  xp: 70,
  syntax: ["$_POST", "REQUEST_METHOD", "trim", "filter_var", "FILTER_VALIDATE_EMAIL", "FILTER_VALIDATE_INT"],
  doc: "guide-web",
  steps: [
    {
      kind: "discover",
      title: L("Forms send POST requests", "Les formulaires envoient des requêtes POST"),
      body: [
        L(
          "A `<form method=\"post\">` sends its fields in the request **body**, and PHP puts them in `$_POST`. `$_SERVER['REQUEST_METHOD']` tells you whether the visitor is just looking at the page (`GET`) or submitting it (`POST`).",
          "Un `<form method=\"post\">` envoie ses champs dans le **corps** de la requête, et PHP les range dans `$_POST`. `$_SERVER['REQUEST_METHOD']` te dit si le visiteur regarde juste la page (`GET`) ou la soumet (`POST`).",
        ),
        L(
          "Rule of thumb: **GET** to read (search, filters, links you can bookmark), **POST** to change something (sign up, order, pay). A GET link that deletes data can be triggered by any crawler.",
          "Règle simple : **GET** pour lire (recherche, filtres, liens qu'on peut garder en favori), **POST** pour modifier (inscription, commande, paiement). Un lien GET qui supprime des données peut être déclenché par n'importe quel robot.",
        ),
      ],
      example: {
        code: `<?php\nif ($_SERVER['REQUEST_METHOD'] === 'POST') {\n    echo "Thanks, " . ($_POST['name'] ?? '') . "!";\n} else {\n    echo '<form method="post"><input name="name"><button>Send</button></form>';\n}\n`,
        caption: L("This run is a GET, so the form is shown.", "Cette exécution est un GET : le formulaire s'affiche."),
      },
    },
    {
      kind: "discover",
      title: L("Never trust input", "Ne fais jamais confiance aux entrées"),
      body: [
        L(
          "Browsers don't enforce your form. A field can be missing, empty, full of spaces, the wrong type, or crafted by an attacker with a script. **Validate on the server, every time.**",
          "Les navigateurs ne protègent pas ton formulaire. Un champ peut manquer, être vide, plein d'espaces, du mauvais type, ou fabriqué par un attaquant avec un script. **Valide côté serveur, à chaque fois.**",
        ),
        L(
          "Your toolkit: `?? ''` for missing keys, `trim()` for stray spaces, and `filter_var()` which returns the clean value or `false`. Compare with `=== false`: `0` is a valid number but a falsy value.",
          "Ta boîte à outils : `?? ''` pour les clés absentes, `trim()` pour les espaces parasites, et `filter_var()` qui renvoie la valeur propre ou `false`. Compare avec `=== false` : `0` est un nombre valide mais une valeur « fausse ».",
        ),
      ],
      example: {
        code: `<?php\nvar_dump(filter_var("ada@example.com", FILTER_VALIDATE_EMAIL));\nvar_dump(filter_var("not-an-email", FILTER_VALIDATE_EMAIL));\nvar_dump(filter_var("42", FILTER_VALIDATE_INT));\nvar_dump(filter_var("42abc", FILTER_VALIDATE_INT));\nvar_dump(filter_var("150", FILTER_VALIDATE_INT, ["options" => ["min_range" => 1, "max_range" => 120]]));\n`,
      },
    },
    {
      kind: "watch",
      title: L("Collect the errors", "Rassemble les erreurs"),
      body: L(
        "A good form shows **every** problem at once, not one per submission. Watch `$errors` grow as each rule fails.",
        "Un bon formulaire montre **tous** les problèmes d'un coup, pas un par envoi. Regarde `$errors` grandir à chaque règle qui échoue.",
      ),
      code: `<?php\n$input = ['email' => ' ada.example.com ', 'age' => '17'];\n$errors = [];\n$email = trim($input['email'] ?? '');\n$age = filter_var($input['age'] ?? '', FILTER_VALIDATE_INT);\nif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {\n    $errors[] = 'Invalid email';\n}\nif ($age === false || $age < 18) {\n    $errors[] = 'You must be 18 or older';\n}\necho count($errors) . " error(s): " . implode(', ', $errors);\n`,
      notes: {
        3: L("Start with an empty list of errors.", "On part d'une liste d'erreurs vide."),
        4: L("`trim` removes the spaces around the email.", "`trim` retire les espaces autour de l'email."),
        5: L("\"17\" becomes the int 17. \"abc\" would give false.", "\"17\" devient l'entier 17. \"abc\" donnerait false."),
        7: L("No @ in the email: the first error is added.", "Pas de @ dans l'email : la première erreur est ajoutée."),
        10: L("17 is too young: a second error.", "17 ans, c'est trop jeune : deuxième erreur."),
        12: L("Show them all together.", "On les affiche toutes ensemble."),
      },
    },
    {
      kind: "quiz",
      title: L("The zero trap", "Le piège du zéro"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$age = filter_var("0", FILTER_VALIDATE_INT);\nvar_dump($age);\necho $age ? "valid" : "invalid";\n`,
      options: ["int(0)\ninvalid", "bool(false)\ninvalid", "int(0)\nvalid", "bool(false)\nvalid"],
      answer: 0,
      explain: L(
        "\"0\" is a valid int, so filter_var returns `int(0)`. But 0 is falsy, so the ternary says \"invalid\". Always test `$age === false`.",
        "\"0\" est un entier valide : filter_var renvoie `int(0)`. Mais 0 est « faux », donc le ternaire dit « invalid ». Teste toujours `$age === false`.",
      ),
    },
    {
      kind: "try",
      title: L("Validate an email", "Valide un email"),
      body: L(
        "This run simulates a POST with `email = \"  Grace@Example.com \"`. Trim it, check it with `FILTER_VALIDATE_EMAIL`, and print `Saved: Grace@Example.com` (or `Invalid email` when it fails).",
        "Cette exécution simule un POST avec `email = \"  Grace@Example.com \"`. Nettoie-le avec trim, vérifie-le avec `FILTER_VALIDATE_EMAIL`, et affiche `Saved: Grace@Example.com` (ou `Invalid email` s'il est invalide).",
      ),
      request: { method: "POST", body: { email: "  Grace@Example.com " } },
      files: { "index.php": `<?php\n// POST body: email = "  Grace@Example.com "\n$email = $_POST['email'];\necho "Saved: $email";\n` },
      solution: {
        "index.php": `<?php\n// POST body: email = "  Grace@Example.com "\n$email = trim($_POST['email'] ?? '');\nif (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {\n    echo "Invalid email";\n} else {\n    echo "Saved: $email";\n}\n`,
      },
      objectives: [
        {
          id: "saved",
          label: L("Print Saved: Grace@Example.com, after trim and filter_var", "Afficher Saved: Grace@Example.com, après trim et filter_var"),
          check: all(outputIs("Saved: Grace@Example.com"), uses(/trim\s*\(/), uses(/FILTER_VALIDATE_EMAIL/)),
          hints: [
            L("The spaces must go, and the email must be checked before saving.", "Les espaces doivent partir, et l'email doit être vérifié avant d'être enregistré."),
            L("`trim($_POST['email'] ?? '')`, then `if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) { … }`", "`trim($_POST['email'] ?? '')`, puis `if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) { … }`"),
            L(
              "`$email = trim($_POST['email'] ?? ''); if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) { echo \"Invalid email\"; } else { echo \"Saved: $email\"; }`",
              "`$email = trim($_POST['email'] ?? ''); if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) { echo \"Invalid email\"; } else { echo \"Saved: $email\"; }`",
            ),
          ],
        },
      ],
      cheat: "web",
    },
    {
      kind: "challenge",
      title: L("A sign-up validator", "Un validateur d'inscription"),
      body: L(
        "Write `validate(array $data): array`, which returns the list of error messages (empty when everything is fine), in this order: `Name is required` (name empty after trim), `Email is invalid`, `Age must be between 18 and 120`. Missing fields must not cause warnings. This run simulates a bad POST, so the page should list all three errors.",
        "Écris `validate(array $data): array`, qui renvoie la liste des messages d'erreur (vide si tout va bien), dans cet ordre : `Name is required` (nom vide après trim), `Email is invalid`, `Age must be between 18 and 120`. Les champs absents ne doivent pas provoquer d'avertissement. Cette exécution simule un mauvais POST : la page doit lister les trois erreurs.",
      ),
      request: { method: "POST", body: { name: "   ", email: "bob-at-example.com", age: "abc" } },
      probes: [
        "validate(['name' => 'Ada', 'email' => 'ada@example.com', 'age' => '36'])",
        "validate(['name' => '  ', 'email' => 'ada@example.com', 'age' => '36'])",
        "validate(['name' => 'Ada', 'email' => 'nope', 'age' => '36'])",
        "validate(['name' => 'Ada', 'email' => 'ada@example.com', 'age' => '12'])",
        "validate([])",
      ],
      files: {
        "index.php": `<?php\nfunction validate(array $data): array\n{\n    $errors = [];\n    // Rule 1: name is required (ignore spaces)       -> "Name is required"\n    // Rule 2: email must be valid                    -> "Email is invalid"\n    // Rule 3: age must be an int between 18 and 120  -> "Age must be between 18 and 120"\n    return $errors;\n}\n\n$errors = validate($_POST);\nif ($errors === []) {\n    echo "Welcome!";\n} else {\n    echo implode("\\n", $errors);\n}\n`,
      },
      solution: {
        "index.php": `<?php\nfunction validate(array $data): array\n{\n    $errors = [];\n    $name = trim($data['name'] ?? '');\n    $email = trim($data['email'] ?? '');\n    $age = filter_var($data['age'] ?? '', FILTER_VALIDATE_INT, ['options' => ['min_range' => 18, 'max_range' => 120]]);\n\n    if ($name === '') {\n        $errors[] = 'Name is required';\n    }\n    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) {\n        $errors[] = 'Email is invalid';\n    }\n    if ($age === false) {\n        $errors[] = 'Age must be between 18 and 120';\n    }\n    return $errors;\n}\n\n$errors = validate($_POST);\nif ($errors === []) {\n    echo "Welcome!";\n} else {\n    echo implode("\\n", $errors);\n}\n`,
      },
      objectives: [
        {
          id: "valid",
          label: L("Valid data gives no errors", "Des données valides ne donnent aucune erreur"),
          check: returns("validate(['name' => 'Ada', 'email' => 'ada@example.com', 'age' => '36'])", []),
          hints: [
            L("Only add a message when a rule fails.", "N'ajoute un message que quand une règle échoue."),
            L("Each rule is an `if` that pushes with `$errors[] = '…';`", "Chaque règle est un `if` qui ajoute avec `$errors[] = '…';`"),
            L("Start each check from a cleaned value: `$name = trim($data['name'] ?? '');`", "Pars d'une valeur nettoyée pour chaque règle : `$name = trim($data['name'] ?? '');`"),
          ],
        },
        {
          id: "rules",
          label: L("Each rule gives its own message", "Chaque règle donne son propre message"),
          check: all(
            returns("validate(['name' => '  ', 'email' => 'ada@example.com', 'age' => '36'])", ["Name is required"]),
            returns("validate(['name' => 'Ada', 'email' => 'nope', 'age' => '36'])", ["Email is invalid"]),
            returns("validate(['name' => 'Ada', 'email' => 'ada@example.com', 'age' => '12'])", ["Age must be between 18 and 120"]),
          ),
          hints: [
            L("Name: empty after `trim`. Email: `FILTER_VALIDATE_EMAIL`. Age: `FILTER_VALIDATE_INT` with a range.", "Nom : vide après `trim`. Email : `FILTER_VALIDATE_EMAIL`. Âge : `FILTER_VALIDATE_INT` avec un intervalle."),
            L(
              "The range goes in options: `filter_var($v, FILTER_VALIDATE_INT, ['options' => ['min_range' => 18, 'max_range' => 120]])` returns false outside it.",
              "L'intervalle se met dans les options : `filter_var($v, FILTER_VALIDATE_INT, ['options' => ['min_range' => 18, 'max_range' => 120]])` renvoie false en dehors.",
            ),
            L(
              "`if ($name === '') { $errors[] = 'Name is required'; }` then the same for the email (`=== false`) and the age (`=== false`), in that order.",
              "`if ($name === '') { $errors[] = 'Name is required'; }` puis pareil pour l'email (`=== false`) et l'âge (`=== false`), dans cet ordre.",
            ),
          ],
        },
        {
          id: "missing",
          label: L("An empty submission gives all three errors, without warnings", "Un envoi vide donne les trois erreurs, sans avertissement"),
          check: all(returns("validate([])", ["Name is required", "Email is invalid", "Age must be between 18 and 120"]), clean),
          hints: [
            L("`$data['name']` on a missing key gives a warning.", "`$data['name']` sur une clé absente donne un avertissement."),
            L("Use `$data['name'] ?? ''` for every field.", "Utilise `$data['name'] ?? ''` pour chaque champ."),
            L("Read every field with `?? ''` before testing it: name, email and age.", "Lis chaque champ avec `?? ''` avant de le tester : nom, email et âge."),
          ],
        },
        {
          id: "page",
          label: L("The page lists the three errors for this bad POST", "La page liste les trois erreurs pour ce mauvais POST"),
          check: outputLines(["Name is required", "Email is invalid", "Age must be between 18 and 120"]),
          hints: [
            L("The bottom of the file already prints the errors; it only needs `validate()` to work.", "Le bas du fichier affiche déjà les erreurs ; il faut juste que `validate()` marche."),
            L("Run again after finishing the rules, and read the Output tab.", "Relance après avoir fini les règles, et lis l'onglet Sortie."),
            L("If a line is missing, check that rule's message text and order.", "S'il manque une ligne, vérifie le texte et l'ordre du message de cette règle."),
          ],
        },
      ],
      cheat: "web",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Forms send POST data into `$_POST`; GET reads, POST changes things.", "Les formulaires envoient leurs données dans `$_POST` ; GET lit, POST modifie."),
    L("Validate on the server: `?? ''`, `trim()`, then `filter_var()`.", "Valide côté serveur : `?? ''`, `trim()`, puis `filter_var()`."),
    L("`filter_var()` returns the value or `false`: compare with `=== false`, because 0 is valid.", "`filter_var()` renvoie la valeur ou `false` : compare avec `=== false`, car 0 est valide."),
    L("Collect every error and show them together.", "Rassemble toutes les erreurs et affiche-les ensemble."),
  ],
};

// ───────────────────────────────────────────── 3. XSS and escaping

export const xssEscaping: Lesson = {
  id: "xss-escaping",
  chapterId: CH,
  title: L("Escaping output (XSS)", "Échapper la sortie (XSS)"),
  tagline: L("Why echoing user input is dangerous, and htmlspecialchars", "Pourquoi afficher les entrées est dangereux, et htmlspecialchars"),
  xp: 70,
  syntax: ["htmlspecialchars", "ENT_QUOTES", "e()", "urlencode"],
  doc: "guide-security",
  steps: [
    {
      kind: "discover",
      title: L("Cross-site scripting", "Le cross-site scripting"),
      body: [
        L(
          "If you print what a user typed straight into HTML, they can type HTML too, including `<script>`. Their code then runs in the browser of **every other visitor** of that page: stealing session cookies, changing the page, sending fake login forms.",
          "Si tu affiches tel quel ce qu'un utilisateur a tapé dans du HTML, il peut taper du HTML aussi, y compris `<script>`. Son code s'exécute alors dans le navigateur de **chaque autre visiteur** de la page : vol des cookies de session, modification de la page, faux formulaires de connexion.",
        ),
        L(
          "This is **XSS** (cross-site scripting), one of the most common web vulnerabilities. A single comment field is enough.",
          "C'est le **XSS** (cross-site scripting), une des failles web les plus courantes. Un seul champ de commentaire suffit.",
        ),
      ],
      example: {
        code: `<?php\n$comment = '<script>alert("hacked")</script>';\necho "<p>$comment</p>\\n";\necho "<p>" . htmlspecialchars($comment) . "</p>";\n`,
        caption: L(
          "Line 1 of the output would run in a browser. Line 2 is shown as harmless text.",
          "La ligne 1 de la sortie s'exécuterait dans un navigateur. La ligne 2 s'affiche comme du texte inoffensif.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("htmlspecialchars, the right way", "htmlspecialchars, comme il faut"),
      body: [
        L(
          "`htmlspecialchars()` turns the five dangerous characters `& < > \" '` into HTML entities like `&lt;`. The browser displays them but never treats them as code.",
          "`htmlspecialchars()` transforme les cinq caractères dangereux `& < > \" '` en entités HTML comme `&lt;`. Le navigateur les affiche mais ne les traite jamais comme du code.",
        ),
        L(
          "Escape **on output**, at the last moment, for the place you print into: HTML text and attributes need `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`, URLs parts need `urlencode()`, JavaScript needs `json_encode()`.",
          "Échappe **à l'affichage**, au dernier moment, selon l'endroit où tu écris : le texte et les attributs HTML demandent `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`, les morceaux d'URL `urlencode()`, le JavaScript `json_encode()`.",
        ),
      ],
      example: {
        code: `<?php\n$name = '" onmouseover="alert(1)';\necho '<input value="' . $name . '">' . "\\n";\necho '<input value="' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '">' . "\\n";\necho '<a href="/search?q=' . urlencode('php & sql') . '">search</a>';\n`,
        caption: L(
          "Without escaping, the quote closes the attribute and adds an event handler.",
          "Sans échappement, le guillemet ferme l'attribut et ajoute un gestionnaire d'événement.",
        ),
      },
    },
    {
      kind: "compare",
      title: L("Same call, different versions", "Même appel, versions différentes"),
      body: L(
        "PHP 8.1 changed the default flags of `htmlspecialchars()`. Run this on several versions and look at the apostrophe.",
        "PHP 8.1 a changé les options par défaut de `htmlspecialchars()`. Exécute ceci sur plusieurs versions et regarde l'apostrophe.",
      ),
      code: `<?php\necho htmlspecialchars("<b>It's</b>");\n`,
      versions: ["7.4", "8.0", "8.1", "8.5"],
      takeaway: L(
        "Before 8.1, single quotes were left as is by default, which can break out of `'…'` attributes. Pass `ENT_QUOTES` explicitly and your code is safe on every version.",
        "Avant 8.1, les apostrophes restaient telles quelles par défaut, ce qui permet de sortir d'un attribut `'…'`. Passe `ENT_QUOTES` explicitement et ton code est sûr sur toutes les versions.",
      ),
    },
    {
      kind: "quiz",
      title: L("Read the entities", "Lis les entités"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho htmlspecialchars('<a href="/">Tom & Jerry</a>', ENT_QUOTES, 'UTF-8');\n`,
      options: [
        "&lt;a href=&quot;/&quot;&gt;Tom &amp; Jerry&lt;/a&gt;",
        '<a href="/">Tom & Jerry</a>',
        '&lt;a href="/"&gt;Tom & Jerry&lt;/a&gt;',
        "&lt;a href=&quot;/&quot;&gt;Tom & Jerry&lt;/a&gt;",
      ],
      answer: 0,
      explain: L(
        "All five special characters are converted: `<` `>` become `&lt;` `&gt;`, quotes become `&quot;`, and `&` itself becomes `&amp;`.",
        "Les cinq caractères spéciaux sont convertis : `<` `>` deviennent `&lt;` `&gt;`, les guillemets `&quot;`, et `&` lui-même devient `&amp;`.",
      ),
    },
    {
      kind: "try",
      title: L("Escape a comment", "Échappe un commentaire"),
      body: L(
        "This run simulates `?comment=<img src=x onerror=alert(1)>`, a classic XSS payload. Escape it so the page prints `<p>&lt;img src=x onerror=alert(1)&gt;</p>`.",
        "Cette exécution simule `?comment=<img src=x onerror=alert(1)>`, une attaque XSS classique. Échappe-le pour que la page affiche `<p>&lt;img src=x onerror=alert(1)&gt;</p>`.",
      ),
      request: { query: { comment: "<img src=x onerror=alert(1)>" } },
      files: { "index.php": `<?php\n$comment = $_GET['comment'] ?? '';\necho "<p>$comment</p>";\n` },
      solution: { "index.php": `<?php\n$comment = $_GET['comment'] ?? '';\necho '<p>' . htmlspecialchars($comment, ENT_QUOTES, 'UTF-8') . '</p>';\n` },
      objectives: [
        {
          id: "escaped",
          label: L("The comment is printed as harmless text", "Le commentaire s'affiche comme du texte inoffensif"),
          check: all(outputIs("<p>&lt;img src=x onerror=alert(1)&gt;</p>"), uses(/htmlspecialchars\s*\(/)),
          hints: [
            L("The `<` and `>` of the comment must become entities.", "Les `<` et `>` du commentaire doivent devenir des entités."),
            L("Wrap the value: `htmlspecialchars($comment, ENT_QUOTES, 'UTF-8')`.", "Entoure la valeur : `htmlspecialchars($comment, ENT_QUOTES, 'UTF-8')`."),
            L("`echo '<p>' . htmlspecialchars($comment, ENT_QUOTES, 'UTF-8') . '</p>';`", "`echo '<p>' . htmlspecialchars($comment, ENT_QUOTES, 'UTF-8') . '</p>';`"),
          ],
        },
      ],
      cheat: "security",
    },
    {
      kind: "watch",
      title: L("A tiny e() helper", "Un petit helper e()"),
      body: L(
        "Typing `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')` everywhere is tedious, so projects wrap it in a short function, often called `e()`. Templates in Laravel (`{{ }}`) and Twig do this for you automatically.",
        "Taper `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')` partout est pénible : les projets l'emballent dans une petite fonction, souvent appelée `e()`. Les templates de Laravel (`{{ }}`) et Twig le font automatiquement pour toi.",
      ),
      code: `<?php\nfunction e(string $value): string\n{\n    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');\n}\n$user = ['name' => "O'Brien <admin>", 'bio' => 'Loves <b>PHP</b> & tea'];\n$name = e($user['name']);\n$bio = e($user['bio']);\necho "<h2>$name</h2>\\n";\necho "<p>$bio</p>";\n`,
      notes: {
        6: L("Data straight from a database: never assume it's safe.", "Des données tout droit sorties d'une base : ne suppose jamais qu'elles sont sûres."),
        7: L("The apostrophe and the angle brackets are escaped.", "L'apostrophe et les chevrons sont échappés."),
        8: L("`<b>` becomes visible text, and `&` becomes `&amp;`.", "`<b>` devient du texte visible, et `&` devient `&amp;`."),
        10: L("Escaped values are safe to put anywhere in HTML text.", "Les valeurs échappées se mettent sans risque n'importe où dans le texte HTML."),
      },
    },
    {
      kind: "challenge",
      title: L("A safe profile card", "Une carte de profil sûre"),
      body: L(
        "Finish `e()` and `card()`. `card()` must escape the name and the URL, and refuse anything that isn't an `http://` or `https://` link (use `#` instead): escaping alone does not stop `javascript:alert(1)` in an `href`.",
        "Termine `e()` et `card()`. `card()` doit échapper le nom et l'URL, et refuser tout ce qui n'est pas un lien `http://` ou `https://` (mets `#` à la place) : l'échappement seul n'arrête pas `javascript:alert(1)` dans un `href`.",
      ),
      probes: [
        `e("<b>\\"x\\" & 'y'</b>")`,
        "card(['name' => 'Ada <3', 'url' => 'https://ada.dev/?a=1&b=2'])",
        "card(['name' => 'Eve', 'url' => 'javascript:alert(1)'])",
        "card(['name' => 'Eve', 'url' => '\" onclick=\"alert(1)'])",
      ],
      files: {
        "index.php": `<?php\nfunction e(string $value): string\n{\n    return $value; // TODO: escape it\n}\n\nfunction card(array $user): string\n{\n    $name = $user['name'];\n    $url = $user['url'];\n    return "<div class=\\"card\\"><h2>$name</h2><a href=\\"$url\\">Website</a></div>";\n}\n\necho card(['name' => 'Ada <3', 'url' => 'https://ada.dev/?a=1&b=2']);\n`,
      },
      solution: {
        "index.php": `<?php\nfunction e(string $value): string\n{\n    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');\n}\n\nfunction card(array $user): string\n{\n    $url = $user['url'];\n    if (!preg_match('~^https?://~i', $url)) {\n        $url = '#';\n    }\n    return '<div class="card"><h2>' . e($user['name']) . '</h2><a href="' . e($url) . '">Website</a></div>';\n}\n\necho card(['name' => 'Ada <3', 'url' => 'https://ada.dev/?a=1&b=2']);\n`,
      },
      objectives: [
        {
          id: "e",
          label: L("e() escapes & < > \" and '", "e() échappe & < > \" et '"),
          check: returns(`e("<b>\\"x\\" & 'y'</b>")`, "&lt;b&gt;&quot;x&quot; &amp; &#039;y&#039;&lt;/b&gt;"),
          hints: [
            L("`e()` should just call `htmlspecialchars` with the safe options.", "`e()` doit juste appeler `htmlspecialchars` avec les options sûres."),
            L("Don't forget `ENT_QUOTES`, or the single quotes stay as they are on old versions.", "N'oublie pas `ENT_QUOTES`, sinon les apostrophes restent telles quelles sur les anciennes versions."),
            L("`return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');`", "`return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');`"),
          ],
        },
        {
          id: "card",
          label: L("card() escapes the name and the URL", "card() échappe le nom et l'URL"),
          check: returns(
            "card(['name' => 'Ada <3', 'url' => 'https://ada.dev/?a=1&b=2'])",
            '<div class="card"><h2>Ada &lt;3</h2><a href="https://ada.dev/?a=1&amp;b=2">Website</a></div>',
          ),
          hints: [
            L("Use `e()` on both values when you build the HTML.", "Utilise `e()` sur les deux valeurs quand tu construis le HTML."),
            L("Concatenate: `'<h2>' . e($user['name']) . '</h2>'`.", "Concatène : `'<h2>' . e($user['name']) . '</h2>'`."),
            L(
              "`return '<div class=\"card\"><h2>' . e($user['name']) . '</h2><a href=\"' . e($url) . '\">Website</a></div>';`",
              "`return '<div class=\"card\"><h2>' . e($user['name']) . '</h2><a href=\"' . e($url) . '\">Website</a></div>';`",
            ),
          ],
        },
        {
          id: "scheme",
          label: L("Links that aren't http(s) become #", "Les liens qui ne sont pas en http(s) deviennent #"),
          check: all(
            returnsText("card(['name' => 'Eve', 'url' => 'javascript:alert(1)'])", (s) => s.includes('href="#"')),
            returnsText(`card(['name' => 'Eve', 'url' => '" onclick="alert(1)'])`, (s) => s.includes('href="#"') && !s.includes('" onclick')),
          ),
          hints: [
            L("Check how the URL starts before using it.", "Vérifie comment l'URL commence avant de l'utiliser."),
            L("`preg_match('~^https?://~i', $url)` is true for http and https links.", "`preg_match('~^https?://~i', $url)` est vrai pour les liens http et https."),
            L("`if (!preg_match('~^https?://~i', $url)) { $url = '#'; }` before building the HTML.", "`if (!preg_match('~^https?://~i', $url)) { $url = '#'; }` avant de construire le HTML."),
          ],
        },
      ],
      cheat: "security",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Printing raw user input into HTML lets attackers run scripts in other visitors' browsers (XSS).", "Afficher une entrée brute dans du HTML permet d'exécuter des scripts chez les autres visiteurs (XSS)."),
    L("Escape on output with `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`, wrapped in a helper like `e()`.", "Échappe à l'affichage avec `htmlspecialchars($v, ENT_QUOTES, 'UTF-8')`, emballé dans un helper comme `e()`."),
    L("Each context has its tool: HTML → htmlspecialchars, URL → urlencode, JS → json_encode.", "Chaque contexte a son outil : HTML → htmlspecialchars, URL → urlencode, JS → json_encode."),
    L("Escaping doesn't validate: also allow-list URL schemes like http and https.", "Échapper ne valide pas : autorise aussi explicitement les schémas d'URL comme http et https."),
  ],
};

// ───────────────────────────────────────────── 4. PDO

export const pdo: Lesson = {
  id: "pdo",
  chapterId: CH,
  title: L("Databases with PDO", "Les bases de données avec PDO"),
  tagline: L("Connect, prepare, execute, fetch and transactions", "Connexion, prepare, execute, fetch et transactions"),
  xp: 70,
  syntax: ["new PDO", "prepare", "execute", "fetchAll", "fetchColumn", "lastInsertId", "beginTransaction"],
  doc: "guide-database",
  steps: [
    {
      kind: "discover",
      title: L("One API for every database", "Une API pour toutes les bases"),
      body: [
        L(
          "Real applications keep their data in a database: users, orders, posts. **PDO** (PHP Data Objects) talks to MySQL, PostgreSQL, SQLite and more with the same methods. You connect with a **DSN** string like `mysql:host=localhost;dbname=shop`.",
          "Les vraies applications gardent leurs données dans une base : utilisateurs, commandes, articles. **PDO** (PHP Data Objects) parle à MySQL, PostgreSQL, SQLite et d'autres avec les mêmes méthodes. Tu te connectes avec une chaîne **DSN** comme `mysql:host=localhost;dbname=shop`.",
        ),
        L(
          "Here we use `sqlite::memory:`: a real SQL database that lives in memory and disappears when the script ends. Perfect to practise.",
          "Ici on utilise `sqlite::memory:` : une vraie base SQL qui vit en mémoire et disparaît à la fin du script. Parfait pour s'entraîner.",
        ),
      ],
      example: {
        code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n$db->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)');\n$db->exec("INSERT INTO users (name, age) VALUES ('Ada', 36), ('Linus', 54)");\nforeach ($db->query('SELECT name, age FROM users') as $row) {\n    echo $row['name'] . ' is ' . $row['age'] . "\\n";\n}\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "Since PHP 8.0, PDO throws exceptions on SQL errors by default (`ERRMODE_EXCEPTION`). Older code silently got `false`: set the mode explicitly anyway.",
          "Depuis PHP 8.0, PDO lève des exceptions sur les erreurs SQL par défaut (`ERRMODE_EXCEPTION`). L'ancien code recevait `false` sans bruit : fixe le mode explicitement quand même.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Prepared statements", "Les requêtes préparées"),
      body: [
        L(
          "As soon as a value comes from outside, use a **prepared statement**: `prepare()` the SQL with placeholders (`?` or `:name`), then `execute()` it with the values. The database receives the SQL and the data **separately**, so data can never change the query.",
          "Dès qu'une valeur vient de l'extérieur, utilise une **requête préparée** : `prepare()` le SQL avec des marqueurs (`?` ou `:name`), puis `execute()` avec les valeurs. La base reçoit le SQL et les données **séparément** : les données ne peuvent jamais modifier la requête.",
        ),
        L(
          "Read the results with `fetch()` (one row), `fetchAll(PDO::FETCH_ASSOC)` (all rows as arrays) or `fetchColumn()` (a single value). `lastInsertId()` gives the id of the row you just inserted.",
          "Lis les résultats avec `fetch()` (une ligne), `fetchAll(PDO::FETCH_ASSOC)` (toutes les lignes en tableaux) ou `fetchColumn()` (une seule valeur). `lastInsertId()` donne l'id de la ligne que tu viens d'insérer.",
        ),
      ],
      example: {
        code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, year INTEGER)');\n$insert = $db->prepare('INSERT INTO books (title, year) VALUES (:title, :year)');\n$insert->execute(['title' => 'Clean Code', 'year' => 2008]);\n$insert->execute(['title' => 'Refactoring', 'year' => 1999]);\necho "Last id: " . $db->lastInsertId() . "\\n";\n\n$stmt = $db->prepare('SELECT title FROM books WHERE year > ?');\n$stmt->execute([2000]);\nprint_r($stmt->fetchAll(PDO::FETCH_ASSOC));\n`,
        caption: L("One prepared statement can be executed many times.", "Une requête préparée peut être exécutée plusieurs fois."),
      },
    },
    {
      kind: "watch",
      title: L("A to-do list in SQL", "Une liste de tâches en SQL"),
      body: L(
        "Step through: create a table, insert two tasks, update one, then count. Watch the PDO objects and the final count appear in the Variables panel.",
        "Avance pas à pas : créer une table, insérer deux tâches, en modifier une, puis compter. Regarde les objets PDO et le compte final apparaître dans le panneau Variables.",
      ),
      code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT, done INTEGER DEFAULT 0)');\n$add = $db->prepare('INSERT INTO tasks (title) VALUES (?)');\n$add->execute(['Learn PDO']);\n$add->execute(['Write tests']);\n$db->exec('UPDATE tasks SET done = 1 WHERE id = 1');\n$open = $db->query('SELECT COUNT(*) FROM tasks WHERE done = 0')->fetchColumn();\necho "Open tasks: $open";\n`,
      notes: {
        2: L("A connection to a brand-new, empty database.", "Une connexion à une base toute neuve et vide."),
        4: L("The SQL is sent once, with a `?` where the value will go.", "Le SQL est envoyé une fois, avec un `?` à la place de la valeur."),
        5: L("Executed with the value: a first row with id 1.", "Exécutée avec la valeur : une première ligne avec l'id 1."),
        7: L("No outside data here, so `exec()` is fine.", "Pas de donnée extérieure ici : `exec()` convient."),
        8: L("`fetchColumn()` reads the first column of the first row: the count.", "`fetchColumn()` lit la première colonne de la première ligne : le compte."),
      },
    },
    {
      kind: "quiz",
      title: L("Count it", "Compte"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE t (n INTEGER)');\n$stmt = $db->prepare('INSERT INTO t (n) VALUES (?)');\nforeach ([5, 10, 15] as $n) {\n    $stmt->execute([$n]);\n}\necho $db->query('SELECT SUM(n) FROM t WHERE n > 5')->fetchColumn();\n`,
      options: ["30", "25", "15", "10"],
      answer: 1,
      explain: L(
        "The prepared insert runs three times. Only 10 and 15 are greater than 5, so the sum is 25.",
        "L'insertion préparée s'exécute trois fois. Seuls 10 et 15 sont supérieurs à 5 : la somme vaut 25.",
      ),
    },
    {
      kind: "try",
      title: L("Query with a placeholder", "Une requête avec un marqueur"),
      body: L(
        "Select the names of the products cheaper than `$max`, cheapest first, with a **prepared statement**, and print one name per line. Expected output: `Pen` then `Notebook`.",
        "Sélectionne les noms des produits moins chers que `$max`, du moins cher au plus cher, avec une **requête préparée**, et affiche un nom par ligne. Sortie attendue : `Pen` puis `Notebook`.",
      ),
      files: {
        "index.php": `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)');\n$db->exec("INSERT INTO products (name, price) VALUES ('Pen', 1.5), ('Lamp', 24.9), ('Notebook', 4.2), ('Chair', 79)");\n\n$max = 10;\n// Select the names of products cheaper than $max, cheapest first,\n// with a prepared statement, and print one name per line.\n`,
      },
      solution: {
        "index.php": `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL)');\n$db->exec("INSERT INTO products (name, price) VALUES ('Pen', 1.5), ('Lamp', 24.9), ('Notebook', 4.2), ('Chair', 79)");\n\n$max = 10;\n$stmt = $db->prepare('SELECT name FROM products WHERE price < ? ORDER BY price');\n$stmt->execute([$max]);\nforeach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {\n    echo $row['name'] . "\\n";\n}\n`,
      },
      objectives: [
        {
          id: "cheap",
          label: L("Print Pen and Notebook using prepare() and execute()", "Afficher Pen et Notebook avec prepare() et execute()"),
          check: all(outputIs("Pen\nNotebook"), uses(/->\s*prepare\s*\(/), uses(/->\s*execute\s*\(/)),
          hints: [
            L("SQL: `SELECT name FROM products WHERE price < ? ORDER BY price`.", "SQL : `SELECT name FROM products WHERE price < ? ORDER BY price`."),
            L("`$stmt = $db->prepare('…');` then `$stmt->execute([$max]);` then loop over `$stmt->fetchAll(PDO::FETCH_ASSOC)`.", "`$stmt = $db->prepare('…');` puis `$stmt->execute([$max]);` puis boucle sur `$stmt->fetchAll(PDO::FETCH_ASSOC)`."),
            L(
              "`$stmt = $db->prepare('SELECT name FROM products WHERE price < ? ORDER BY price'); $stmt->execute([$max]); foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) { echo $row['name'] . \"\\n\"; }`",
              "`$stmt = $db->prepare('SELECT name FROM products WHERE price < ? ORDER BY price'); $stmt->execute([$max]); foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) { echo $row['name'] . \"\\n\"; }`",
            ),
          ],
        },
      ],
      cheat: "pdo",
    },
    {
      kind: "discover",
      title: L("Transactions: all or nothing", "Les transactions : tout ou rien"),
      body: [
        L(
          "A bank transfer is two updates: take money from Alice, give it to Bob. If the script crashes in between, money vanishes. A **transaction** groups queries: `beginTransaction()`, then `commit()` to keep everything, or `rollBack()` to undo everything.",
          "Un virement, c'est deux mises à jour : retirer l'argent d'Alice, le donner à Bob. Si le script plante entre les deux, l'argent disparaît. Une **transaction** regroupe les requêtes : `beginTransaction()`, puis `commit()` pour tout garder, ou `rollBack()` pour tout annuler.",
        ),
      ],
      example: {
        code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE accounts (name TEXT PRIMARY KEY, balance INTEGER)');\n$db->exec("INSERT INTO accounts VALUES ('alice', 100), ('bob', 20)");\n\ntry {\n    $db->beginTransaction();\n    $db->exec("UPDATE accounts SET balance = balance - 50 WHERE name = 'alice'");\n    throw new RuntimeException('Network error before crediting Bob!');\n    $db->commit();\n} catch (RuntimeException $e) {\n    $db->rollBack();\n    echo "Rolled back: " . $e->getMessage() . "\\n";\n}\n\nforeach ($db->query('SELECT * FROM accounts') as $row) {\n    echo "{$row['name']}: {$row['balance']}\\n";\n}\n`,
        caption: L("Alice still has 100: the half-done transfer was undone.", "Alice a toujours 100 : le virement à moitié fait a été annulé."),
      },
    },
    {
      kind: "challenge",
      title: L("A tiny user repository", "Un petit dépôt d'utilisateurs"),
      body: L(
        "Finish three functions with prepared statements: `addUser()` inserts and returns the new id as an int, `findUserByEmail()` returns `['id' => …, 'name' => …, 'email' => …]` or `null`, and `countUsers()` returns the number of users.",
        "Termine trois fonctions avec des requêtes préparées : `addUser()` insère et renvoie le nouvel id en entier, `findUserByEmail()` renvoie `['id' => …, 'name' => …, 'email' => …]` ou `null`, et `countUsers()` renvoie le nombre d'utilisateurs.",
      ),
      probes: [
        "(function () { $db = makeDb(); return addUser($db, 'Ada', 'ada@example.com'); })()",
        "(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); addUser($db, 'Linus', 'linus@example.com'); return findUserByEmail($db, 'linus@example.com'); })()",
        "(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); return findUserByEmail($db, 'nobody@example.com'); })()",
        "(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); return findUserByEmail($db, \"x' OR '1'='1\"); })()",
        "(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); addUser($db, 'Linus', 'linus@example.com'); return countUsers($db); })()",
      ],
      files: {
        "index.php": `<?php\nfunction makeDb(): PDO\n{\n    $db = new PDO('sqlite::memory:');\n    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    $db->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)');\n    return $db;\n}\n\nfunction addUser(PDO $db, string $name, string $email): int\n{\n    // TODO: insert with a prepared statement, return the new id\n    return 0;\n}\n\nfunction findUserByEmail(PDO $db, string $email): ?array\n{\n    // TODO: return ['id' => …, 'name' => …, 'email' => …] or null\n    return null;\n}\n\nfunction countUsers(PDO $db): int\n{\n    // TODO\n    return 0;\n}\n\n$db = makeDb();\naddUser($db, 'Ada', 'ada@example.com');\naddUser($db, 'Linus', 'linus@example.com');\necho countUsers($db) . " users\\n";\n$user = findUserByEmail($db, 'ada@example.com');\necho $user ? "Found {$user['name']}" : "Not found";\n`,
      },
      solution: {
        "index.php": `<?php\nfunction makeDb(): PDO\n{\n    $db = new PDO('sqlite::memory:');\n    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    $db->exec('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)');\n    return $db;\n}\n\nfunction addUser(PDO $db, string $name, string $email): int\n{\n    $stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)');\n    $stmt->execute([$name, $email]);\n    return (int) $db->lastInsertId();\n}\n\nfunction findUserByEmail(PDO $db, string $email): ?array\n{\n    $stmt = $db->prepare('SELECT id, name, email FROM users WHERE email = ?');\n    $stmt->execute([$email]);\n    $row = $stmt->fetch(PDO::FETCH_ASSOC);\n    return $row === false ? null : $row;\n}\n\nfunction countUsers(PDO $db): int\n{\n    return (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();\n}\n\n$db = makeDb();\naddUser($db, 'Ada', 'ada@example.com');\naddUser($db, 'Linus', 'linus@example.com');\necho countUsers($db) . " users\\n";\n$user = findUserByEmail($db, 'ada@example.com');\necho $user ? "Found {$user['name']}" : "Not found";\n`,
      },
      objectives: [
        {
          id: "add",
          label: L("addUser() inserts and returns the new id (1 for the first user)", "addUser() insère et renvoie le nouvel id (1 pour le premier)"),
          check: returns("(function () { $db = makeDb(); return addUser($db, 'Ada', 'ada@example.com'); })()", 1),
          hints: [
            L("Insert with `?` placeholders, then ask PDO for the last id.", "Insère avec des marqueurs `?`, puis demande à PDO le dernier id."),
            L("`lastInsertId()` returns a string: cast it with `(int)`.", "`lastInsertId()` renvoie une chaîne : convertis-la avec `(int)`."),
            L(
              "`$stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)'); $stmt->execute([$name, $email]); return (int) $db->lastInsertId();`",
              "`$stmt = $db->prepare('INSERT INTO users (name, email) VALUES (?, ?)'); $stmt->execute([$name, $email]); return (int) $db->lastInsertId();`",
            ),
          ],
        },
        {
          id: "find",
          label: L("findUserByEmail() returns the user, or null", "findUserByEmail() renvoie l'utilisateur, ou null"),
          check: all(
            returns(
              "(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); addUser($db, 'Linus', 'linus@example.com'); return findUserByEmail($db, 'linus@example.com'); })()",
              { id: 2, name: "Linus", email: "linus@example.com" },
            ),
            returns("(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); return findUserByEmail($db, 'nobody@example.com'); })()", null),
          ),
          hints: [
            L("`fetch()` returns one row, or `false` when there is none.", "`fetch()` renvoie une ligne, ou `false` s'il n'y en a pas."),
            L("Fetch with `PDO::FETCH_ASSOC` so you get only the named keys, and turn `false` into `null`.", "Récupère avec `PDO::FETCH_ASSOC` pour n'avoir que les clés nommées, et transforme `false` en `null`."),
            L(
              "`$stmt = $db->prepare('SELECT id, name, email FROM users WHERE email = ?'); $stmt->execute([$email]); $row = $stmt->fetch(PDO::FETCH_ASSOC); return $row === false ? null : $row;`",
              "`$stmt = $db->prepare('SELECT id, name, email FROM users WHERE email = ?'); $stmt->execute([$email]); $row = $stmt->fetch(PDO::FETCH_ASSOC); return $row === false ? null : $row;`",
            ),
          ],
        },
        {
          id: "safe",
          label: L("Lookups are safe from SQL injection", "Les recherches résistent à l'injection SQL"),
          check: all(
            returns("(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); return findUserByEmail($db, \"x' OR '1'='1\"); })()", null),
            uses(/WHERE\s+email\s*=\s*[?:]/i),
          ),
          hints: [
            L("The email must never be pasted into the SQL string.", "L'email ne doit jamais être collé dans la chaîne SQL."),
            L("Use `WHERE email = ?` and pass the email to `execute()`.", "Utilise `WHERE email = ?` et passe l'email à `execute()`."),
            L("See the walkthrough of the previous objective: a prepared statement makes this pass.", "Vois le pas-à-pas de l'objectif précédent : une requête préparée fait passer celui-ci."),
          ],
        },
        {
          id: "count",
          label: L("countUsers() returns 2, and the page prints 2 users / Found Ada", "countUsers() renvoie 2, et la page affiche 2 users / Found Ada"),
          check: all(
            returns("(function () { $db = makeDb(); addUser($db, 'Ada', 'ada@example.com'); addUser($db, 'Linus', 'linus@example.com'); return countUsers($db); })()", 2),
            outputLines(["2 users", "Found Ada"]),
          ),
          hints: [
            L("`SELECT COUNT(*) FROM users` returns a single value.", "`SELECT COUNT(*) FROM users` renvoie une seule valeur."),
            L("`fetchColumn()` reads it; cast it to int to match the return type.", "`fetchColumn()` la lit ; convertis-la en int pour respecter le type de retour."),
            L("`return (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();`", "`return (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();`"),
          ],
        },
      ],
      cheat: "pdo",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("PDO talks to MySQL, PostgreSQL and SQLite with the same methods; connect with a DSN.", "PDO parle à MySQL, PostgreSQL et SQLite avec les mêmes méthodes ; on se connecte avec un DSN."),
    L("Outside values go through `prepare()` + `execute()` with placeholders, never into the SQL string.", "Les valeurs extérieures passent par `prepare()` + `execute()` avec des marqueurs, jamais dans la chaîne SQL."),
    L("`fetch`, `fetchAll(PDO::FETCH_ASSOC)`, `fetchColumn` read results; `lastInsertId` gives the new id.", "`fetch`, `fetchAll(PDO::FETCH_ASSOC)`, `fetchColumn` lisent les résultats ; `lastInsertId` donne le nouvel id."),
    L("Transactions (`beginTransaction`, `commit`, `rollBack`) make several changes all-or-nothing.", "Les transactions (`beginTransaction`, `commit`, `rollBack`) rendent plusieurs changements tout-ou-rien."),
  ],
};

// ───────────────────────────────────────────── 5. SQL injection

export const sqlInjection: Lesson = {
  id: "sql-injection",
  chapterId: CH,
  title: L("SQL injection", "L'injection SQL"),
  tagline: L("Break a login with one quote, then make it impossible", "Casse une connexion avec une apostrophe, puis rends-le impossible"),
  xp: 70,
  syntax: ["prepare", "execute", "password_hash", "password_verify", "in_array"],
  doc: "guide-security",
  steps: [
    {
      kind: "discover",
      title: L("When data becomes code", "Quand les données deviennent du code"),
      body: [
        L(
          "Building SQL by gluing strings lets a user's input change the **meaning** of your query. A single quote ends your string, and the rest of their input is read as SQL.",
          "Construire du SQL en collant des chaînes permet à une saisie de changer le **sens** de ta requête. Une apostrophe termine ta chaîne, et le reste de la saisie est lu comme du SQL.",
        ),
        L(
          "That's **SQL injection**. It has leaked hundreds of millions of accounts, bypassed logins and wiped tables. It's still in the OWASP Top 10 because one careless line is enough.",
          "C'est l'**injection SQL**. Elle a fait fuiter des centaines de millions de comptes, contourné des connexions et effacé des tables. Elle est toujours dans le Top 10 de l'OWASP, car une seule ligne négligée suffit.",
        ),
      ],
      example: {
        code: `<?php\n$search = "x'; DROP TABLE users; --";\necho "SELECT * FROM users WHERE name = '$search'";\n`,
        caption: L("Look at the SQL this produces: the input closed the quote and added a command.", "Regarde le SQL produit : la saisie a fermé l'apostrophe et ajouté une commande."),
      },
    },
    {
      kind: "watch",
      title: L("Log in without a password", "Se connecter sans mot de passe"),
      body: L(
        "A vulnerable login, in a real in-memory database. The attacker types `' OR '1'='1` as the password. Watch the SQL string and the result.",
        "Une connexion vulnérable, dans une vraie base en mémoire. L'attaquant tape `' OR '1'='1` comme mot de passe. Regarde la chaîne SQL et le résultat.",
      ),
      code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec("CREATE TABLE users (name TEXT, password TEXT)");\n$db->exec("INSERT INTO users VALUES ('admin', 's3cret!')");\n\n$name = "admin";\n$password = "' OR '1'='1";\n$sql = "SELECT COUNT(*) FROM users WHERE name = '$name' AND password = '$password'";\n$found = $db->query($sql)->fetchColumn();\necho $sql . "\\n";\necho $found ? "Logged in!" : "Denied";\n`,
      notes: {
        7: L("What the attacker typed in the password field.", "Ce que l'attaquant a tapé dans le champ mot de passe."),
        8: L("The quote closes `password = ''`, and `OR '1'='1'` is always true.", "L'apostrophe ferme `password = ''`, et `OR '1'='1'` est toujours vrai."),
        9: L("The database counts 1 matching row…", "La base compte 1 ligne correspondante…"),
        11: L("…so the attacker is in, without knowing the password.", "…donc l'attaquant est connecté, sans connaître le mot de passe."),
      },
    },
    {
      kind: "discover",
      title: L("The fix: never mix data and SQL", "La solution : ne jamais mélanger données et SQL"),
      body: [
        L(
          "With a prepared statement, the SQL is fixed **before** the data arrives. The input is only ever compared as a value: `' OR '1'='1` is just a weird password that doesn't match.",
          "Avec une requête préparée, le SQL est figé **avant** que les données arrivent. La saisie n'est jamais qu'une valeur comparée : `' OR '1'='1` est juste un mot de passe bizarre qui ne correspond pas.",
        ),
        L(
          "Two more rules: placeholders can't be used for table or column names, so check those against an **allow-list**. And never store plain passwords: `password_hash()` and `password_verify()` do it right.",
          "Deux règles de plus : les marqueurs ne marchent pas pour les noms de table ou de colonne, donc vérifie-les avec une **liste autorisée**. Et ne stocke jamais de mot de passe en clair : `password_hash()` et `password_verify()` le font correctement.",
        ),
      ],
      example: {
        code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec("CREATE TABLE users (name TEXT, password TEXT)");\n$db->exec("INSERT INTO users VALUES ('admin', 's3cret!')");\n\n$stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE name = ? AND password = ?');\n$stmt->execute(['admin', "' OR '1'='1"]);\necho $stmt->fetchColumn() ? "Logged in!" : "Denied";\n`,
      },
      callout: {
        tone: "warn",
        text: L(
          "`addslashes()` or hand-made escaping is not a fix: encodings and edge cases have broken it many times. Use prepared statements, always.",
          "`addslashes()` ou un échappement fait main ne sont pas une solution : les encodages et les cas limites les ont cassés bien des fois. Utilise les requêtes préparées, toujours.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Does the attack work now?", "L'attaque marche-t-elle encore ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec("CREATE TABLE users (name TEXT)");\n$db->exec("INSERT INTO users VALUES ('ada'), ('linus')");\n$stmt = $db->prepare('SELECT COUNT(*) FROM users WHERE name = ?');\n$stmt->execute(["' OR '1'='1"]);\necho $stmt->fetchColumn();\n`,
      options: ["2", "0", "1", "An error"],
      answer: 1,
      explain: L(
        "The whole input is one value: no user is literally named `' OR '1'='1`, so the count is 0.",
        "Toute la saisie est une seule valeur : aucun utilisateur ne s'appelle littéralement `' OR '1'='1`, donc le compte vaut 0.",
      ),
    },
    {
      kind: "try",
      title: L("Fix the search", "Répare la recherche"),
      body: L(
        "This run simulates `?q=x' OR '1'='1`, and the search leaks every product. Rewrite the query with a prepared statement so the attack finds nothing: the page must print `0 result(s)`.",
        "Cette exécution simule `?q=x' OR '1'='1`, et la recherche révèle tous les produits. Réécris la requête avec une requête préparée pour que l'attaque ne trouve rien : la page doit afficher `0 result(s)`.",
      ),
      request: { query: { q: "x' OR '1'='1" } },
      files: {
        "index.php": `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE products (name TEXT, secret_cost REAL)');\n$db->exec("INSERT INTO products VALUES ('Lamp', 9.5), ('Chair', 31), ('Desk', 120)");\n\n$q = $_GET['q'] ?? '';\n$rows = $db->query("SELECT name FROM products WHERE name = '$q'")->fetchAll(PDO::FETCH_ASSOC);\necho count($rows) . " result(s)";\n`,
      },
      solution: {
        "index.php": `<?php\n$db = new PDO('sqlite::memory:');\n$db->exec('CREATE TABLE products (name TEXT, secret_cost REAL)');\n$db->exec("INSERT INTO products VALUES ('Lamp', 9.5), ('Chair', 31), ('Desk', 120)");\n\n$q = $_GET['q'] ?? '';\n$stmt = $db->prepare('SELECT name FROM products WHERE name = ?');\n$stmt->execute([$q]);\n$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);\necho count($rows) . " result(s)";\n`,
      },
      objectives: [
        {
          id: "safe",
          label: L("The attack finds 0 results, using a prepared statement", "L'attaque trouve 0 résultat, avec une requête préparée"),
          check: all(outputIs("0 result(s)"), uses(/->\s*prepare\s*\(/), avoids(/'\$q'/)),
          hints: [
            L("`$q` must not appear inside the SQL string any more.", "`$q` ne doit plus apparaître dans la chaîne SQL."),
            L("Replace `'$q'` with `?`, then pass `[$q]` to `execute()`.", "Remplace `'$q'` par `?`, puis passe `[$q]` à `execute()`."),
            L(
              "`$stmt = $db->prepare('SELECT name FROM products WHERE name = ?'); $stmt->execute([$q]); $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);`",
              "`$stmt = $db->prepare('SELECT name FROM products WHERE name = ?'); $stmt->execute([$q]); $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);`",
            ),
          ],
        },
      ],
      cheat: "security",
    },
    {
      kind: "challenge",
      title: L("Secure the login", "Sécurise la connexion"),
      body: L(
        "The legacy `login()` builds SQL from input and compares the password as plain text against a column that now holds **hashes**. Rewrite it with a prepared statement and `password_verify()`. Then fix `sortedUsers()`: the column name comes from the URL, so only allow `name` or `created`, and fall back to `name`.",
        "L'ancien `login()` construit le SQL à partir de la saisie et compare le mot de passe en clair avec une colonne qui contient maintenant des **hashs**. Réécris-le avec une requête préparée et `password_verify()`. Puis corrige `sortedUsers()` : le nom de colonne vient de l'URL, donc n'autorise que `name` ou `created`, avec `name` par défaut.",
      ),
      probes: [
        "login(makeDb(), 'admin', 'correct horse')",
        "login(makeDb(), 'admin', 'wrong')",
        "login(makeDb(), \"admin' --\", 'anything')",
        "login(makeDb(), 'admin', \"' OR '1'='1\")",
        "sortedUsers(makeDb(), 'name')",
        "sortedUsers(makeDb(), 'created')",
        "sortedUsers(makeDb(), 'name DESC --')",
      ],
      files: {
        "index.php": `<?php\nfunction makeDb(): PDO\n{\n    $db = new PDO('sqlite::memory:');\n    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    $db->exec('CREATE TABLE users (name TEXT, password_hash TEXT, created TEXT)');\n    $add = $db->prepare('INSERT INTO users VALUES (?, ?, ?)');\n    // Cost 4 keeps the demo fast; real apps use password_hash($password, PASSWORD_DEFAULT).\n    $add->execute(['admin', password_hash('correct horse', PASSWORD_BCRYPT, ['cost' => 4]), '2024-05-01']);\n    $add->execute(['bea', password_hash('battery staple', PASSWORD_BCRYPT, ['cost' => 4]), '2023-01-10']);\n    return $db;\n}\n\nfunction login(PDO $db, string $name, string $password): bool\n{\n    // Vulnerable AND wrong: SQL built from input, plain-text comparison.\n    $sql = "SELECT COUNT(*) FROM users WHERE name = '$name' AND password_hash = '$password'";\n    return (int) $db->query($sql)->fetchColumn() > 0;\n}\n\nfunction sortedUsers(PDO $db, string $column): array\n{\n    // $column comes from ?sort=… in the URL\n    return $db->query("SELECT name FROM users ORDER BY $column")->fetchAll(PDO::FETCH_COLUMN);\n}\n\n$db = makeDb();\nvar_dump(login($db, 'admin', 'correct horse'));\nprint_r(sortedUsers($db, 'created'));\n`,
      },
      solution: {
        "index.php": `<?php\nfunction makeDb(): PDO\n{\n    $db = new PDO('sqlite::memory:');\n    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);\n    $db->exec('CREATE TABLE users (name TEXT, password_hash TEXT, created TEXT)');\n    $add = $db->prepare('INSERT INTO users VALUES (?, ?, ?)');\n    // Cost 4 keeps the demo fast; real apps use password_hash($password, PASSWORD_DEFAULT).\n    $add->execute(['admin', password_hash('correct horse', PASSWORD_BCRYPT, ['cost' => 4]), '2024-05-01']);\n    $add->execute(['bea', password_hash('battery staple', PASSWORD_BCRYPT, ['cost' => 4]), '2023-01-10']);\n    return $db;\n}\n\nfunction login(PDO $db, string $name, string $password): bool\n{\n    $stmt = $db->prepare('SELECT password_hash FROM users WHERE name = ?');\n    $stmt->execute([$name]);\n    $hash = $stmt->fetchColumn();\n    return $hash !== false && password_verify($password, $hash);\n}\n\nfunction sortedUsers(PDO $db, string $column): array\n{\n    $allowed = ['name', 'created'];\n    if (!in_array($column, $allowed, true)) {\n        $column = 'name';\n    }\n    return $db->query("SELECT name FROM users ORDER BY $column")->fetchAll(PDO::FETCH_COLUMN);\n}\n\n$db = makeDb();\nvar_dump(login($db, 'admin', 'correct horse'));\nprint_r(sortedUsers($db, 'created'));\n`,
      },
      objectives: [
        {
          id: "verify",
          label: L("The right password logs in, a wrong one doesn't", "Le bon mot de passe connecte, un mauvais non"),
          check: all(returns("login(makeDb(), 'admin', 'correct horse')", true), returns("login(makeDb(), 'admin', 'wrong')", false)),
          hints: [
            L("Fetch the stored hash for that name, then let PHP compare.", "Récupère le hash stocké pour ce nom, puis laisse PHP comparer."),
            L("`password_verify($password, $hash)` returns true when the password matches the hash.", "`password_verify($password, $hash)` renvoie true quand le mot de passe correspond au hash."),
            L(
              "`$stmt = $db->prepare('SELECT password_hash FROM users WHERE name = ?'); $stmt->execute([$name]); $hash = $stmt->fetchColumn(); return $hash !== false && password_verify($password, $hash);`",
              "`$stmt = $db->prepare('SELECT password_hash FROM users WHERE name = ?'); $stmt->execute([$name]); $hash = $stmt->fetchColumn(); return $hash !== false && password_verify($password, $hash);`",
            ),
          ],
        },
        {
          id: "injection",
          label: L("Injection attempts are refused", "Les tentatives d'injection sont refusées"),
          check: all(
            returns("login(makeDb(), \"admin' --\", 'anything')", false),
            returns("login(makeDb(), 'admin', \"' OR '1'='1\")", false),
            (c) => !/'\$name'|'\$password'/.test(c.code),
          ),
          hints: [
            L("`admin' --` comments out the password check in the old SQL.", "`admin' --` met en commentaire la vérification du mot de passe dans l'ancien SQL."),
            L("No `$name` or `$password` inside the SQL string: use `?`.", "Pas de `$name` ni de `$password` dans la chaîne SQL : utilise `?`."),
            L("The walkthrough of the first objective fixes this one too.", "Le pas-à-pas du premier objectif corrige aussi celui-ci."),
          ],
        },
        {
          id: "allow-list",
          label: L("sortedUsers() only accepts name or created", "sortedUsers() n'accepte que name ou created"),
          check: all(
            returns("sortedUsers(makeDb(), 'name')", ["admin", "bea"]),
            returns("sortedUsers(makeDb(), 'created')", ["bea", "admin"]),
            returns("sortedUsers(makeDb(), 'name DESC --')", ["admin", "bea"]),
          ),
          hints: [
            L("A column name can't be a placeholder: compare it with the names you allow.", "Un nom de colonne ne peut pas être un marqueur : compare-le aux noms autorisés."),
            L("`in_array($column, ['name', 'created'], true)`; otherwise use 'name'.", "`in_array($column, ['name', 'created'], true)` ; sinon utilise 'name'."),
            L("`if (!in_array($column, ['name', 'created'], true)) { $column = 'name'; }` before the query.", "`if (!in_array($column, ['name', 'created'], true)) { $column = 'name'; }` avant la requête."),
          ],
        },
      ],
      cheat: "security",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Gluing input into SQL lets attackers rewrite your query: that's SQL injection.", "Coller une saisie dans du SQL permet de réécrire ta requête : c'est l'injection SQL."),
    L("Prepared statements send SQL and data separately; the attack becomes a harmless value.", "Les requêtes préparées envoient SQL et données séparément ; l'attaque devient une valeur inoffensive."),
    L("Table and column names can't be placeholders: check them against an allow-list.", "Les noms de table et de colonne ne peuvent pas être des marqueurs : vérifie-les avec une liste autorisée."),
    L("Store passwords with `password_hash()`, check them with `password_verify()`.", "Stocke les mots de passe avec `password_hash()`, vérifie-les avec `password_verify()`."),
  ],
};

// ───────────────────────────────────────────── 6. Testing

const PRICE_TESTS = `function check(string $label, mixed $expected, mixed $actual): void
{
    echo ($expected === $actual ? "✓ " : "✗ ") . $label . "\\n";
}

check('SAVE10 on 50', 45.0, price(50, 'SAVE10'));
check('SAVE10 rounds', 17.99, price(19.99, 'SAVE10'));
check('FLAT5 on 20', 15.0, price(20, 'FLAT5'));
check('FLAT5 never negative', 0.0, price(3, 'FLAT5'));
check('lowercase coupon', 45.0, price(50, 'save10'));
check('spaces around coupon', 45.0, price(50, ' SAVE10 '));
check('unknown coupon', 50.0, price(50, 'NOPE'));
`;

const PRICE_RULES = `/**
 * Rules:
 *  - "SAVE10" takes 10% off
 *  - "FLAT5" takes 5 off, but the price never goes below 0
 *  - coupons are case-insensitive and ignore surrounding spaces
 *  - unknown coupons change nothing
 *  - the result is rounded to 2 decimals
 */`;

export const testing: Lesson = {
  id: "testing",
  chapterId: CH,
  title: L("Testing your code", "Tester ton code"),
  tagline: L("Assertions, a tiny test runner, edge cases, and PHPUnit/Pest", "Assertions, un mini lanceur de tests, cas limites, et PHPUnit/Pest"),
  xp: 70,
  syntax: ["===", "var_export", "fn() =>", "assertSame"],
  doc: "guide-testing",
  steps: [
    {
      kind: "discover",
      title: L("Code that checks code", "Du code qui vérifie du code"),
      body: [
        L(
          "A **test** calls your function with a known input and compares the result with the expected one. Run hundreds of them in a second, after every change, and you'll know immediately when you break something (a **regression**).",
          "Un **test** appelle ta fonction avec une entrée connue et compare le résultat à celui attendu. Lances-en des centaines en une seconde, après chaque changement, et tu sauras tout de suite quand tu casses quelque chose (une **régression**).",
        ),
        L(
          "Real projects use **PHPUnit** or **Pest**, installed with Composer and run in CI on every push: `$this->assertSame(5, add(2, 3));`. Underneath, it's exactly what you'll write here: call, compare with `===`, report.",
          "Les vrais projets utilisent **PHPUnit** ou **Pest**, installés avec Composer et lancés en CI à chaque push : `$this->assertSame(5, add(2, 3));`. Au fond, c'est exactement ce que tu vas écrire ici : appeler, comparer avec `===`, rapporter.",
        ),
      ],
      example: {
        code: `<?php\nfunction slugify(string $title): string\n{\n    return strtolower(str_replace(' ', '-', trim($title)));\n}\n\n$result = slugify('  Hello World ');\necho $result === 'hello-world' ? "PASS\\n" : "FAIL: got '$result'\\n";\n`,
      },
    },
    {
      kind: "discover",
      title: L("A tiny assertion helper", "Un petit helper d'assertion"),
      body: [
        L(
          "A helper keeps tests short and the failures readable. Compare with `===`: `4` and `'4'` are different, and a test should notice. `var_export()` prints values the way you'd write them in PHP, so you can see the type in the message.",
          "Un helper garde les tests courts et les échecs lisibles. Compare avec `===` : `4` et `'4'` sont différents, et un test doit le voir. `var_export()` affiche les valeurs comme tu les écrirais en PHP : tu vois le type dans le message.",
        ),
      ],
      example: {
        code: `<?php\nfunction check(string $label, mixed $expected, mixed $actual): void\n{\n    if ($expected === $actual) {\n        echo "✓ $label\\n";\n    } else {\n        echo "✗ $label: expected " . var_export($expected, true) . ", got " . var_export($actual, true) . "\\n";\n    }\n}\n\ncheck('2 + 2', 4, 2 + 2);\ncheck('string vs int', 4, '4');\n`,
        caption: L("The second test fails on purpose: read the message.", "Le deuxième test échoue exprès : lis le message."),
      },
    },
    {
      kind: "watch",
      title: L("A test suite in a loop", "Une suite de tests dans une boucle"),
      body: L(
        "Tests can be stored as named closures and run in a loop, like a test runner does. Watch `$passed` count the successes.",
        "Les tests peuvent être rangés comme des closures nommées et lancés dans une boucle, comme le fait un lanceur de tests. Regarde `$passed` compter les réussites.",
      ),
      code: `<?php\nfunction add(int $a, int $b): int\n{\n    return $a + $b;\n}\n$tests = [\n    'adds positives' => fn() => add(2, 3) === 5,\n    'adds negatives' => fn() => add(-2, -3) === -5,\n    'adds zero' => fn() => add(0, 7) === 7,\n];\n$passed = 0;\nforeach ($tests as $name => $test) {\n    $ok = $test();\n    $passed += $ok ? 1 : 0;\n}\necho "$passed/" . count($tests) . " passed";\n`,
      notes: {
        11: L("The counter starts at zero.", "Le compteur part de zéro."),
        13: L("Call the closure: it runs `add()` and compares with `===`.", "On appelle la closure : elle exécute `add()` et compare avec `===`."),
        14: L("One more success.", "Une réussite de plus."),
        16: L("The summary, like PHPUnit's `OK (3 tests)`.", "Le résumé, comme le `OK (3 tests)` de PHPUnit."),
      },
    },
    {
      kind: "quiz",
      title: L("A classic failing test", "Un test qui échoue classiquement"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho var_export(0.1 + 0.2 === 0.3, true);\n`,
      options: ["true", "false", "1", "0.3"],
      answer: 1,
      explain: L(
        "Floats are approximate: 0.1 + 0.2 is 0.30000000000000004. Test floats with a tolerance, like `abs($a - $b) < 0.0001`, or round first.",
        "Les floats sont approximatifs : 0.1 + 0.2 vaut 0.30000000000000004. Teste les floats avec une tolérance, comme `abs($a - $b) < 0.0001`, ou arrondis d'abord.",
      ),
    },
    {
      kind: "try",
      title: L("Test the edge cases", "Teste les cas limites"),
      body: L(
        "`isLeapYear()` is correct, but only one test exists. Add tests for 2023 (not leap), 1900 (not leap: divisible by 100) and 2000 (leap: divisible by 400). Edge cases are where bugs hide.",
        "`isLeapYear()` est correcte, mais un seul test existe. Ajoute des tests pour 2023 (non bissextile), 1900 (non : divisible par 100) et 2000 (bissextile : divisible par 400). C'est dans les cas limites que les bugs se cachent.",
      ),
      files: {
        "index.php": `<?php\nfunction isLeapYear(int $year): bool\n{\n    return ($year % 4 === 0 && $year % 100 !== 0) || $year % 400 === 0;\n}\n\nfunction check(string $label, mixed $expected, mixed $actual): void\n{\n    echo ($expected === $actual ? "✓ " : "✗ ") . $label . "\\n";\n}\n\ncheck('2024 is leap', true, isLeapYear(2024));\n// Add tests for 2023, 1900 and 2000\n`,
      },
      solution: {
        "index.php": `<?php\nfunction isLeapYear(int $year): bool\n{\n    return ($year % 4 === 0 && $year % 100 !== 0) || $year % 400 === 0;\n}\n\nfunction check(string $label, mixed $expected, mixed $actual): void\n{\n    echo ($expected === $actual ? "✓ " : "✗ ") . $label . "\\n";\n}\n\ncheck('2024 is leap', true, isLeapYear(2024));\ncheck('2023 is not leap', false, isLeapYear(2023));\ncheck('1900 is not leap', false, isLeapYear(1900));\ncheck('2000 is leap', true, isLeapYear(2000));\n`,
      },
      objectives: [
        {
          id: "four",
          label: L("Four passing tests, including 1900 and 2000", "Quatre tests qui passent, dont 1900 et 2000"),
          check: (c) =>
            checkLines(c).filter((l) => l.startsWith("✓")).length >= 4 && !c.out.includes("✗") && /isLeapYear\s*\(\s*1900\s*\)/.test(c.code) && /isLeapYear\s*\(\s*2000\s*\)/.test(c.code),
          hints: [
            L("Copy the existing `check(...)` line and change the label, the expected value and the year.", "Copie la ligne `check(...)` existante et change le libellé, la valeur attendue et l'année."),
            L("For 2023 and 1900 the expected value is `false`.", "Pour 2023 et 1900, la valeur attendue est `false`."),
            L(
              "`check('2023 is not leap', false, isLeapYear(2023));`, `check('1900 is not leap', false, isLeapYear(1900));`, `check('2000 is leap', true, isLeapYear(2000));`",
              "`check('2023 is not leap', false, isLeapYear(2023));`, `check('1900 is not leap', false, isLeapYear(1900));`, `check('2000 is leap', true, isLeapYear(2000));`",
            ),
          ],
        },
      ],
      cheat: "testing",
    },
    {
      kind: "challenge",
      title: L("Make the tests green", "Fais passer les tests au vert"),
      body: L(
        "`price()` applies a coupon, and its test suite is red. Read the rules and the failing tests, then fix the function (not the tests!) until every line starts with ✓. Hidden tests will also check a few more cases.",
        "`price()` applique un code promo, et sa suite de tests est rouge. Lis les règles et les tests qui échouent, puis corrige la fonction (pas les tests !) jusqu'à ce que chaque ligne commence par ✓. Des tests cachés vérifieront aussi quelques cas de plus.",
      ),
      probes: ["price(10, 'flat5 ')", "price(0.1, 'SAVE10')", "price(100, 'Save10')", "price(4.5, 'FLAT5')"],
      files: {
        "index.php": `<?php\n${PRICE_RULES}\nfunction price(float $amount, string $coupon): float\n{\n    if ($coupon === 'SAVE10') {\n        return $amount * 0.9;\n    }\n    if ($coupon === 'FLAT5') {\n        return $amount - 5;\n    }\n    return $amount;\n}\n\n${PRICE_TESTS}`,
      },
      solution: {
        "index.php": `<?php\n${PRICE_RULES}\nfunction price(float $amount, string $coupon): float\n{\n    $coupon = strtoupper(trim($coupon));\n    if ($coupon === 'SAVE10') {\n        $amount *= 0.9;\n    } elseif ($coupon === 'FLAT5') {\n        $amount = max(0.0, $amount - 5);\n    }\n    return round($amount, 2);\n}\n\n${PRICE_TESTS}`,
      },
      objectives: [
        {
          id: "green",
          label: L("All 7 tests pass", "Les 7 tests passent"),
          check: (c) => checkLines(c).filter((l) => l.startsWith("✓")).length === 7 && !c.out.includes("✗"),
          hints: [
            L("Three tests fail: rounding, negative prices, and coupons written differently.", "Trois sortes de tests échouent : l'arrondi, les prix négatifs, et les codes écrits autrement."),
            L("Normalise the coupon with `strtoupper(trim($coupon))`, clamp with `max(0.0, …)`, and `round(…, 2)` at the end.", "Normalise le code avec `strtoupper(trim($coupon))`, borne avec `max(0.0, …)`, et `round(…, 2)` à la fin."),
            L(
              "`$coupon = strtoupper(trim($coupon)); if ($coupon === 'SAVE10') { $amount *= 0.9; } elseif ($coupon === 'FLAT5') { $amount = max(0.0, $amount - 5); } return round($amount, 2);`",
              "`$coupon = strtoupper(trim($coupon)); if ($coupon === 'SAVE10') { $amount *= 0.9; } elseif ($coupon === 'FLAT5') { $amount = max(0.0, $amount - 5); } return round($amount, 2);`",
            ),
          ],
        },
        {
          id: "hidden",
          label: L("Hidden tests pass too", "Les tests cachés passent aussi"),
          check: all(returns("price(10, 'flat5 ')", 5), returns("price(0.1, 'SAVE10')", 0.09), returns("price(100, 'Save10')", 90), returns("price(4.5, 'FLAT5')", 0)),
          hints: [
            L("If the visible tests pass by special-casing their inputs, the hidden ones won't.", "Si les tests visibles passent grâce à des cas particuliers, les cachés échoueront."),
            L("Apply the rules in general: normalise, apply the discount, never below 0, round.", "Applique les règles en général : normaliser, appliquer la remise, jamais sous 0, arrondir."),
            L("The walkthrough of the first objective passes these as well.", "Le pas-à-pas du premier objectif fait aussi passer ceux-ci."),
          ],
        },
        {
          id: "honest",
          label: L("The 7 tests are still there", "Les 7 tests sont toujours là"),
          check: (c) => (c.code.match(/\bcheck\s*\(/g) ?? []).length >= 8,
          hints: [
            L("Fix the code under test, not the tests.", "Corrige le code testé, pas les tests."),
            L("All seven `check(...)` calls must stay in the file.", "Les sept appels `check(...)` doivent rester dans le fichier."),
            L("If you removed one, use Restart to get the starting code back.", "Si tu en as supprimé un, utilise Recommencer pour retrouver le code de départ."),
          ],
        },
      ],
      cheat: "testing",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A test calls code with a known input and compares the result with `===`.", "Un test appelle du code avec une entrée connue et compare le résultat avec `===`."),
    L("Readable failures show the expected and actual values (`var_export`).", "Des échecs lisibles montrent la valeur attendue et la valeur obtenue (`var_export`)."),
    L("Edge cases (0, empty, limits, 1900 vs 2000) are where bugs hide; compare floats with a tolerance.", "Les cas limites (0, vide, bornes, 1900 vs 2000) cachent les bugs ; compare les floats avec une tolérance."),
    L("Fix the code, not the test. In real projects, use PHPUnit or Pest and run them in CI.", "Corrige le code, pas le test. Dans les vrais projets, utilise PHPUnit ou Pest et lance-les en CI."),
  ],
};

// ───────────────────────────────────────────── 7. Boss: a JSON API

const API_DB = `function makeDb(): PDO
{
    $db = new PDO('sqlite::memory:');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec('CREATE TABLE todos (id INTEGER PRIMARY KEY, title TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0)');
    $db->exec("INSERT INTO todos (title, done) VALUES ('Learn PHP', 1), ('Build an API', 0), ('Write tests', 0)");
    return $db;
}

/** Turn a database row into the API shape: id (int), title, done (bool). */
function present(array $row): array
{
    return ['id' => (int) $row['id'], 'title' => $row['title'], 'done' => (bool) $row['done']];
}
`;

const API_ROUTES = `/**
 * Routes:
 *   action=list [&done=0|1]   200, list of todos (optionally filtered)
 *   action=add&title=…        201, the new todo · 422 {"error":"Title is required"} if empty
 *   action=done&id=…          200, {"id":…,"done":true} · 404 {"error":"Not found"}
 *   anything else             404 {"error":"Unknown action"}
 */`;

/** A probe that calls the API and returns [status, decoded body]. */
const call = (query: string) => `(function () { $body = handle(makeDb(), ${query}); return [http_response_code(), json_decode($body, true)]; })()`;

const API_PROBES = {
  list: call("['action' => 'list']"),
  add: call("['action' => 'add', 'title' => '  Ship it ']"),
  addEmpty: call("['action' => 'add', 'title' => '   ']"),
  done: call("['action' => 'done', 'id' => '2']"),
  doneMissing: call("['action' => 'done', 'id' => '99']"),
  unknown: call("['action' => 'nope']"),
  empty: call("[]"),
};

export const bossApi: Lesson = {
  id: "boss-api",
  chapterId: CH,
  title: L("Boss: a JSON API", "Boss : une API JSON"),
  tagline: L("Route, validate, query SQLite and answer JSON with the right status", "Router, valider, interroger SQLite et répondre en JSON avec le bon statut"),
  xp: 120,
  boss: true,
  syntax: ["$_GET", "http_response_code", "json_encode", "prepare", "filter_var", "array_map"],
  doc: "guide-web",
  steps: [
    {
      kind: "discover",
      title: L("The front controller", "Le contrôleur frontal"),
      body: [
        L(
          "Frameworks like Laravel and Symfony send **every** request to one file, `index.php`, which looks at the URL and calls the right **handler**. That's the front controller pattern, and its heart is a **router**: a map from routes to functions.",
          "Les frameworks comme Laravel et Symfony envoient **toutes** les requêtes vers un seul fichier, `index.php`, qui regarde l'URL et appelle le bon **gestionnaire**. C'est le motif du contrôleur frontal, et son cœur est un **routeur** : une correspondance entre routes et fonctions.",
        ),
        L(
          "In this boss you'll build a small to-do API: a router on `$_GET['action']`, input validation, prepared SQL and JSON answers with proper status codes.",
          "Dans ce boss, tu vas construire une petite API de tâches : un routeur sur `$_GET['action']`, de la validation, du SQL préparé et des réponses JSON avec les bons codes de statut.",
        ),
      ],
      example: {
        code: `<?php\n$action = $_GET['action'] ?? 'home';\n$routes = [\n    'home' => fn() => ['message' => 'Welcome'],\n    'time' => fn() => ['hour' => 12],\n];\n$handler = $routes[$action] ?? fn() => ['error' => 'Not found'];\necho json_encode($handler());\n`,
      },
    },
    {
      kind: "discover",
      title: L("Status codes and JSON", "Codes de statut et JSON"),
      body: [
        L(
          "Clients read the **status code** first: `200` OK, `201` Created, `404` Not Found, `422` Unprocessable (invalid input), `500` server error. Set it with `http_response_code()`.",
          "Les clients lisent d'abord le **code de statut** : `200` OK, `201` Created, `404` Not Found, `422` Unprocessable (saisie invalide), `500` erreur serveur. Fixe-le avec `http_response_code()`.",
        ),
        L(
          "`json_encode()` turns arrays into JSON (lists become `[…]`, keyed arrays `{…}`); `json_decode($json, true)` goes back to arrays. Convert database values to the right types first: SQLite stores `done` as `0`/`1`, your API should say `false`/`true`.",
          "`json_encode()` transforme les tableaux en JSON (les listes deviennent `[…]`, les tableaux à clés `{…}`) ; `json_decode($json, true)` revient aux tableaux. Convertis d'abord les valeurs de la base dans les bons types : SQLite stocke `done` en `0`/`1`, ton API doit dire `false`/`true`.",
        ),
      ],
      example: {
        code: `<?php\nhttp_response_code(201);\necho http_response_code() . "\\n";\necho json_encode([['id' => 1, 'done' => (bool) 0], ['id' => 2, 'done' => (bool) 1]]) . "\\n";\nvar_dump(json_decode('{"title":"Ship it"}', true));\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Empty arrays in JSON", "Les tableaux vides en JSON"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\necho json_encode(['ok' => true, 'items' => []]);\n`,
      options: ['{"ok":true,"items":[]}', '{"ok":1,"items":{}}', '{"ok":"true","items":[]}', '["ok",true,"items",[]]'],
      answer: 0,
      explain: L(
        "Booleans stay booleans, and an empty PHP array becomes an empty JSON list `[]`. Keys turn the outer array into an object.",
        "Les booléens restent des booléens, et un tableau PHP vide devient une liste JSON vide `[]`. Les clés font du tableau extérieur un objet.",
      ),
    },
    {
      kind: "watch",
      title: L("Dispatching a request", "Aiguiller une requête"),
      body: L(
        "A router with closures that receive the query. Step through how the action picks a handler, and what happens to the response.",
        "Un routeur avec des closures qui reçoivent la requête. Avance pas à pas : comment l'action choisit un gestionnaire, et ce que devient la réponse.",
      ),
      code: `<?php\n$query = ['action' => 'greet', 'name' => 'Ada'];\n$routes = [\n    'greet' => fn(array $q) => ['message' => 'Hello ' . ($q['name'] ?? 'stranger')],\n    'ping' => fn(array $q) => ['pong' => true],\n];\n$action = $query['action'] ?? '';\n$handler = $routes[$action] ?? null;\n$body = $handler ? $handler($query) : ['error' => 'Unknown action'];\necho json_encode($body);\n`,
      notes: {
        2: L("In a real app this would be `$_GET`.", "Dans une vraie appli, ce serait `$_GET`."),
        7: L("Read the action, safely.", "On lit l'action, prudemment."),
        8: L("Look the handler up; unknown actions give null.", "On cherche le gestionnaire ; une action inconnue donne null."),
        9: L("Call it with the query, or build an error.", "On l'appelle avec la requête, ou on construit une erreur."),
        10: L("The JSON response body.", "Le corps de la réponse en JSON."),
      },
    },
    {
      kind: "try",
      title: L("Write respond()", "Écris respond()"),
      body: L(
        "Every handler will end with `respond($status, $data)`. Make it set the HTTP status code and return the data as JSON. The page should print `{\"id\":7,\"title\":\"Ship it\"}`.",
        "Chaque gestionnaire finira par `respond($status, $data)`. Fais-lui fixer le code de statut HTTP et renvoyer les données en JSON. La page doit afficher `{\"id\":7,\"title\":\"Ship it\"}`.",
      ),
      probes: ["(function () { respond(418, []); return http_response_code(); })()"],
      files: {
        "index.php": `<?php\nfunction respond(int $status, array $data): string\n{\n    // Set the status code, then return the data as JSON\n    return '';\n}\n\necho respond(201, ['id' => 7, 'title' => 'Ship it']);\n`,
      },
      solution: {
        "index.php": `<?php\nfunction respond(int $status, array $data): string\n{\n    http_response_code($status);\n    return json_encode($data);\n}\n\necho respond(201, ['id' => 7, 'title' => 'Ship it']);\n`,
      },
      objectives: [
        {
          id: "respond",
          label: L("respond() sets the status and returns JSON", "respond() fixe le statut et renvoie du JSON"),
          check: all(outputIs('{"id":7,"title":"Ship it"}'), returns("(function () { respond(418, []); return http_response_code(); })()", 418)),
          hints: [
            L("Two lines: one for the status, one for the body.", "Deux lignes : une pour le statut, une pour le corps."),
            L("`http_response_code($status);` then `return json_encode($data);`", "`http_response_code($status);` puis `return json_encode($data);`"),
            L("Replace the `return '';` with those two lines.", "Remplace le `return '';` par ces deux lignes."),
          ],
        },
      ],
      cheat: "web",
    },
    {
      kind: "challenge",
      title: L("Boss: the to-do API", "Boss : l'API de tâches"),
      body: L(
        "Implement `respond()` and `handle()` following the routes in the comment. Use prepared statements for anything that comes from the query, `present()` for the output shape, and the right status codes. This run simulates `?action=list&done=0`; hidden requests will test the other routes.",
        "Implémente `respond()` et `handle()` en suivant les routes du commentaire. Utilise des requêtes préparées pour tout ce qui vient de la requête, `present()` pour la forme de sortie, et les bons codes de statut. Cette exécution simule `?action=list&done=0` ; des requêtes cachées testeront les autres routes.",
      ),
      request: { query: { action: "list", done: "0" } },
      probes: Object.values(API_PROBES),
      files: {
        "index.php": `<?php\n${API_DB}\n/** Set the HTTP status and return the JSON body. */\nfunction respond(int $status, array $data): string\n{\n    // TODO\n    return '';\n}\n\n${API_ROUTES}\nfunction handle(PDO $db, array $query): string\n{\n    $action = $query['action'] ?? '';\n    // TODO: list, add, done\n    return respond(404, ['error' => 'Unknown action']);\n}\n\nheader('Content-Type: application/json');\necho handle(makeDb(), $_GET);\n`,
      },
      solution: {
        "index.php": `<?php\n${API_DB}\n/** Set the HTTP status and return the JSON body. */\nfunction respond(int $status, array $data): string\n{\n    http_response_code($status);\n    return json_encode($data);\n}\n\n${API_ROUTES}\nfunction handle(PDO $db, array $query): string\n{\n    $action = $query['action'] ?? '';\n\n    if ($action === 'list') {\n        $done = $query['done'] ?? null;\n        if ($done === '0' || $done === '1') {\n            $stmt = $db->prepare('SELECT * FROM todos WHERE done = ? ORDER BY id');\n            $stmt->execute([(int) $done]);\n        } else {\n            $stmt = $db->query('SELECT * FROM todos ORDER BY id');\n        }\n        return respond(200, array_map('present', $stmt->fetchAll(PDO::FETCH_ASSOC)));\n    }\n\n    if ($action === 'add') {\n        $title = trim((string) ($query['title'] ?? ''));\n        if ($title === '' || strlen($title) > 100) {\n            return respond(422, ['error' => 'Title is required']);\n        }\n        $stmt = $db->prepare('INSERT INTO todos (title) VALUES (?)');\n        $stmt->execute([$title]);\n        return respond(201, ['id' => (int) $db->lastInsertId(), 'title' => $title, 'done' => false]);\n    }\n\n    if ($action === 'done') {\n        $id = filter_var($query['id'] ?? '', FILTER_VALIDATE_INT);\n        $stmt = $db->prepare('UPDATE todos SET done = 1 WHERE id = ?');\n        $stmt->execute([$id === false ? 0 : $id]);\n        if ($stmt->rowCount() === 0) {\n            return respond(404, ['error' => 'Not found']);\n        }\n        return respond(200, ['id' => $id, 'done' => true]);\n    }\n\n    return respond(404, ['error' => 'Unknown action']);\n}\n\nheader('Content-Type: application/json');\necho handle(makeDb(), $_GET);\n`,
      },
      objectives: [
        {
          id: "list",
          label: L("action=list returns the todos (and done=0 filters them)", "action=list renvoie les tâches (et done=0 les filtre)"),
          check: all(
            outputJson([
              { id: 2, title: "Build an API", done: false },
              { id: 3, title: "Write tests", done: false },
            ]),
            returns(API_PROBES.list, [
              200,
              [
                { id: 1, title: "Learn PHP", done: true },
                { id: 2, title: "Build an API", done: false },
                { id: 3, title: "Write tests", done: false },
              ],
            ]),
          ),
          hints: [
            L("First make `respond()` work (you did it in the previous step). Then handle `list`.", "Fais d'abord marcher `respond()` (tu l'as fait à l'étape précédente). Puis gère `list`."),
            L(
              "Fetch rows with `fetchAll(PDO::FETCH_ASSOC)`, shape each one with `array_map('present', $rows)`, and filter with a prepared `WHERE done = ?` when `done` is '0' or '1'.",
              "Récupère les lignes avec `fetchAll(PDO::FETCH_ASSOC)`, mets chacune en forme avec `array_map('present', $rows)`, et filtre avec un `WHERE done = ?` préparé quand `done` vaut '0' ou '1'.",
            ),
            L(
              "`if ($action === 'list') { $done = $query['done'] ?? null; if ($done === '0' || $done === '1') { $stmt = $db->prepare('SELECT * FROM todos WHERE done = ? ORDER BY id'); $stmt->execute([(int) $done]); } else { $stmt = $db->query('SELECT * FROM todos ORDER BY id'); } return respond(200, array_map('present', $stmt->fetchAll(PDO::FETCH_ASSOC))); }`",
              "`if ($action === 'list') { $done = $query['done'] ?? null; if ($done === '0' || $done === '1') { $stmt = $db->prepare('SELECT * FROM todos WHERE done = ? ORDER BY id'); $stmt->execute([(int) $done]); } else { $stmt = $db->query('SELECT * FROM todos ORDER BY id'); } return respond(200, array_map('present', $stmt->fetchAll(PDO::FETCH_ASSOC))); }`",
            ),
          ],
        },
        {
          id: "add",
          label: L("action=add creates a todo (201), or answers 422 for an empty title", "action=add crée une tâche (201), ou répond 422 si le titre est vide"),
          check: all(
            returns(API_PROBES.add, [201, { id: 4, title: "Ship it", done: false }]),
            returns(API_PROBES.addEmpty, [422, { error: "Title is required" }]),
          ),
          hints: [
            L("Trim the title, refuse it when empty, then insert with a prepared statement.", "Nettoie le titre avec trim, refuse-le s'il est vide, puis insère avec une requête préparée."),
            L("The new id comes from `$db->lastInsertId()` (cast it to int).", "Le nouvel id vient de `$db->lastInsertId()` (convertis-le en int)."),
            L(
              "`if ($action === 'add') { $title = trim((string) ($query['title'] ?? '')); if ($title === '') { return respond(422, ['error' => 'Title is required']); } $stmt = $db->prepare('INSERT INTO todos (title) VALUES (?)'); $stmt->execute([$title]); return respond(201, ['id' => (int) $db->lastInsertId(), 'title' => $title, 'done' => false]); }`",
              "`if ($action === 'add') { $title = trim((string) ($query['title'] ?? '')); if ($title === '') { return respond(422, ['error' => 'Title is required']); } $stmt = $db->prepare('INSERT INTO todos (title) VALUES (?)'); $stmt->execute([$title]); return respond(201, ['id' => (int) $db->lastInsertId(), 'title' => $title, 'done' => false]); }`",
            ),
          ],
        },
        {
          id: "done",
          label: L("action=done marks a todo (200), or answers 404", "action=done coche une tâche (200), ou répond 404"),
          check: all(returns(API_PROBES.done, [200, { id: 2, done: true }]), returns(API_PROBES.doneMissing, [404, { error: "Not found" }])),
          hints: [
            L("Validate the id with `FILTER_VALIDATE_INT`, then run a prepared UPDATE.", "Valide l'id avec `FILTER_VALIDATE_INT`, puis lance un UPDATE préparé."),
            L("`$stmt->rowCount()` tells you how many rows were updated: 0 means the id doesn't exist.", "`$stmt->rowCount()` indique combien de lignes ont été modifiées : 0 veut dire que l'id n'existe pas."),
            L(
              "`$id = filter_var($query['id'] ?? '', FILTER_VALIDATE_INT); $stmt = $db->prepare('UPDATE todos SET done = 1 WHERE id = ?'); $stmt->execute([$id === false ? 0 : $id]); if ($stmt->rowCount() === 0) { return respond(404, ['error' => 'Not found']); } return respond(200, ['id' => $id, 'done' => true]);`",
              "`$id = filter_var($query['id'] ?? '', FILTER_VALIDATE_INT); $stmt = $db->prepare('UPDATE todos SET done = 1 WHERE id = ?'); $stmt->execute([$id === false ? 0 : $id]); if ($stmt->rowCount() === 0) { return respond(404, ['error' => 'Not found']); } return respond(200, ['id' => $id, 'done' => true]);`",
            ),
          ],
        },
        {
          id: "robust",
          label: L("Unknown or missing actions answer 404, with no warnings, and the SQL is prepared", "Les actions inconnues ou absentes répondent 404, sans avertissement, et le SQL est préparé"),
          check: all(
            returns(API_PROBES.unknown, [404, { error: "Unknown action" }]),
            returns(API_PROBES.empty, [404, { error: "Unknown action" }]),
            clean,
            uses(/->\s*prepare\s*\(/),
            avoids(/["'][^"']*(WHERE|VALUES)[^"']*\$(query|title|id|done)/i),
          ),
          hints: [
            L("Every key of `$query` may be missing: read them with `??`.", "Chaque clé de `$query` peut manquer : lis-les avec `??`."),
            L("Values from the query never go inside the SQL string: use `?` and `execute()`.", "Les valeurs de la requête ne vont jamais dans la chaîne SQL : utilise `?` et `execute()`."),
            L("Keep the final `return respond(404, ['error' => 'Unknown action']);` for everything else.", "Garde le `return respond(404, ['error' => 'Unknown action']);` final pour tout le reste."),
          ],
        },
      ],
      cheat: "web",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A front controller routes every request through one file and a map of handlers.", "Un contrôleur frontal fait passer chaque requête par un seul fichier et une table de gestionnaires."),
    L("APIs answer JSON with meaningful status codes: 200, 201, 404, 422.", "Les API répondent du JSON avec des codes de statut parlants : 200, 201, 404, 422."),
    L("Validate input, use prepared statements, and convert database values to proper types.", "Valide les entrées, utilise des requêtes préparées, et convertis les valeurs de la base dans les bons types."),
    L("You just wrote the core of what Laravel and Symfony do for you.", "Tu viens d'écrire le cœur de ce que Laravel et Symfony font pour toi."),
  ],
};

export const WEB: Lesson[] = [requests, formsValidation, xssEscaping, pdo, sqlInjection, testing, bossApi];
