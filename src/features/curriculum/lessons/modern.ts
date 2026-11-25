import { L } from "@/lib/txt";
import { all, avoids, clean, definesClass, outputIs, outputLines, probeIs, probeShows, ran, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "modern";

export const namespaces: Lesson = {
  id: "namespaces",
  chapterId: CH,
  title: L("Namespaces", "Les namespaces"),
  tagline: L("Organise code in folders without name clashes", "Range ton code en dossiers sans conflits de noms"),
  xp: 60,
  syntax: ["namespace", "use", "as", "\\", "require"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("Two classes called User", "Deux classes appelées User"),
      body: [
        L(
          "Real projects mix your code with dozens of libraries. Sooner or later two of them define a class with the same name, like `User` or `Logger`. **Namespaces** are surnames for your code: `Shop\\User` and `Blog\\User` can live side by side.",
          "Les vrais projets mélangent ton code avec des dizaines de bibliothèques. Tôt ou tard deux d'entre elles définissent une classe du même nom, comme `User` ou `Logger`. Les **namespaces** sont des noms de famille pour ton code : `Shop\\User` et `Blog\\User` peuvent cohabiter.",
        ),
        L(
          "The backslash `\\` separates the parts, like folders. A name starting with `\\` is absolute (`\\DateTime` is the global one).",
          "L'antislash `\\` sépare les parties, comme des dossiers. Un nom qui commence par `\\` est absolu (`\\DateTime` est celui de l'espace global).",
        ),
      ],
      scene: "scope",
      example: {
        code: `<?php\nnamespace Shop {\n    class User\n    {\n        public function role(): string { return "customer"; }\n    }\n}\n\nnamespace Blog {\n    class User\n    {\n        public function role(): string { return "author"; }\n    }\n}\n\nnamespace {\n    $a = new Shop\\User();\n    $b = new Blog\\User();\n    echo get_class($a) . " is a " . $a->role() . "\\n";\n    echo get_class($b) . " is an " . $b->role() . "\\n";\n}\n`,
        caption: L("Braces let one file hold several namespaces; real projects use one file per class.", "Les accolades permettent plusieurs namespaces dans un fichier ; les vrais projets utilisent un fichier par classe."),
      },
    },
    {
      kind: "discover",
      title: L("One class per file, and use", "Une classe par fichier, et use"),
      body: [
        L(
          "Convention: one class per file, the folder mirrors the namespace. `App\\Shop\\Product` lives in `src/Shop/Product.php`, which starts with `namespace App\\Shop;`.",
          "Convention : une classe par fichier, le dossier reflète le namespace. `App\\Shop\\Product` vit dans `src/Shop/Product.php`, qui commence par `namespace App\\Shop;`.",
        ),
        L(
          "In another file, `use App\\Shop\\Product;` lets you write just `Product`. `use … as Alias;` renames it when two short names collide. `use` doesn't load any file: you still need `require` (or an autoloader, next lesson).",
          "Dans un autre fichier, `use App\\Shop\\Product;` permet d'écrire juste `Product`. `use … as Alias;` le renomme quand deux noms courts se croisent. `use` ne charge aucun fichier : il faut toujours `require` (ou un autoloader, leçon suivante).",
        ),
      ],
      example: {
        code: `<?php\nnamespace App\\Billing {\n    class Invoice\n    {\n        public function label(): string { return "billing"; }\n    }\n}\n\nnamespace {\n    use App\\Billing\\Invoice;\n    use App\\Billing\\Invoice as Bill;\n\n    echo (new Invoice())->label(), "\\n";\n    echo (new Bill())->label(), "\\n";\n    echo Invoice::class, "\\n";\n}\n`,
        caption: L("`Invoice::class` gives the full name as a string.", "`Invoice::class` donne le nom complet sous forme de chaîne."),
      },
    },
    {
      kind: "watch",
      title: L("A namespaced class at work", "Une classe dans un namespace au travail"),
      body: L(
        "Step through and look at the call stack: inside the method, PHP shows the full name `Shop\\Cart->add`.",
        "Avance pas à pas et regarde la pile d'appels : dans la méthode, PHP affiche le nom complet `Shop\\Cart->add`.",
      ),
      code: `<?php\nnamespace Shop;\n\nclass Cart\n{\n    private array $items = [];\n\n    public function add(string $item): void\n    {\n        $this->items[] = $item;\n    }\n\n    public function count(): int\n    {\n        return count($this->items);\n    }\n}\n\n$cart = new Cart();\n$cart->add("Book");\n$cart->add("Pen");\necho get_class($cart) . " has " . $cart->count() . " items";\n`,
      notes: {
        19: L("`new Cart()` means `Shop\\Cart`: names are resolved in the current namespace.", "`new Cart()` veut dire `Shop\\Cart` : les noms sont résolus dans le namespace courant."),
        10: L("Inside the method: the stack shows `Shop\\Cart->add`.", "Dans la méthode : la pile affiche `Shop\\Cart->add`."),
        22: L("`count()` inside the class still finds PHP's global count function.", "`count()` dans la classe trouve toujours la fonction globale count de PHP."),
      },
    },
    {
      kind: "quiz",
      title: L("Which strlen?", "Quel strlen ?"),
      question: L("A namespace can have its own functions. What does this print?", "Un namespace peut avoir ses propres fonctions. Qu'affiche ce code ?"),
      code: `<?php\nnamespace App\\Tools;\n\nfunction strlen($s)\n{\n    return "mine";\n}\n\necho strlen("abc"), " ", \\strlen("abc");\n`,
      options: ["mine 3", "3 3", "mine mine", "3 mine"],
      answer: 0,
      explain: L(
        "An unqualified call looks in the current namespace first (`App\\Tools\\strlen`), then falls back to the global one. `\\strlen` always means PHP's own.",
        "Un appel sans préfixe cherche d'abord dans le namespace courant (`App\\Tools\\strlen`), puis se rabat sur le global. `\\strlen` veut toujours dire celui de PHP.",
      ),
    },
    {
      kind: "try",
      title: L("Import the Product class", "Importe la classe Product"),
      body: L(
        "This project has two files. `src/Shop/Product.php` declares `App\\Shop\\Product`. In `index.php`, load the file and import the class with `use`, so it prints `Lamp costs 25`.",
        "Ce projet a deux fichiers. `src/Shop/Product.php` déclare `App\\Shop\\Product`. Dans `index.php`, charge le fichier et importe la classe avec `use`, pour afficher `Lamp costs 25`.",
      ),
      files: {
        "index.php": `<?php\nrequire __DIR__ . '/src/Shop/Product.php';\n\n$lamp = new Product("Lamp", 25);\necho $lamp->describe();\n`,
        "src/Shop/Product.php": `<?php\nnamespace App\\Shop;\n\nclass Product\n{\n    public function __construct(private string $name, private int $price) {}\n\n    public function describe(): string\n    {\n        return "{$this->name} costs {$this->price}";\n    }\n}\n`,
      },
      solution: {
        "index.php": `<?php\nrequire __DIR__ . '/src/Shop/Product.php';\n\nuse App\\Shop\\Product;\n\n$lamp = new Product("Lamp", 25);\necho $lamp->describe();\n`,
        "src/Shop/Product.php": `<?php\nnamespace App\\Shop;\n\nclass Product\n{\n    public function __construct(private string $name, private int $price) {}\n\n    public function describe(): string\n    {\n        return "{$this->name} costs {$this->price}";\n    }\n}\n`,
      },
      objectives: [
        {
          id: "use",
          label: L("Import App\\Shop\\Product with use", "Importer App\\Shop\\Product avec use"),
          check: uses(/use\s+\\?App\\Shop\\Product\s*;/),
          hints: [
            L("PHP looks for `Product` in the global namespace and can't find it.", "PHP cherche `Product` dans le namespace global et ne le trouve pas."),
            L("`use` + the full name of the class, after the require.", "`use` + le nom complet de la classe, après le require."),
            L("Add `use App\\Shop\\Product;` on line 4.", "Ajoute `use App\\Shop\\Product;` à la ligne 4."),
          ],
        },
        {
          id: "output",
          label: L("Print: Lamp costs 25", "Afficher : Lamp costs 25"),
          check: all(ran, outputIs("Lamp costs 25")),
          hints: [
            L("Read the error: *Class \"Product\" not found*.", "Lis l'erreur : *Class \"Product\" not found*."),
            L("Once imported, `new Product(...)` means `new App\\Shop\\Product(...)`.", "Une fois importée, `new Product(...)` veut dire `new App\\Shop\\Product(...)`."),
            L("With the `use` line in place, run again.", "Avec la ligne `use` en place, relance."),
          ],
        },
      ],
      cheat: "namespaces",
    },
    {
      kind: "challenge",
      title: L("Two Invoices", "Deux Invoice"),
      body: L(
        "Two classes share the short name `Invoice`: `App\\Billing\\Invoice` and `App\\Export\\Invoice`. Importing both with the same name is a fatal error. Give the export one an alias so the script prints both labels.",
        "Deux classes partagent le nom court `Invoice` : `App\\Billing\\Invoice` et `App\\Export\\Invoice`. Les importer toutes les deux sous le même nom est une erreur fatale. Donne un alias à celle d'export pour que le script affiche les deux libellés.",
      ),
      files: {
        "index.php": `<?php\nrequire __DIR__ . '/src/Billing/Invoice.php';\nrequire __DIR__ . '/src/Export/Invoice.php';\n\nuse App\\Billing\\Invoice;\nuse App\\Export\\Invoice;\n\necho (new Invoice())->label() . "\\n";\necho (new Invoice())->label() . "\\n";\n`,
        "src/Billing/Invoice.php": `<?php\nnamespace App\\Billing;\n\nclass Invoice\n{\n    public function label(): string\n    {\n        return "billing invoice";\n    }\n}\n`,
        "src/Export/Invoice.php": `<?php\nnamespace App\\Export;\n\nclass Invoice\n{\n    public function label(): string\n    {\n        return "export invoice";\n    }\n}\n`,
      },
      solution: {
        "index.php": `<?php\nrequire __DIR__ . '/src/Billing/Invoice.php';\nrequire __DIR__ . '/src/Export/Invoice.php';\n\nuse App\\Billing\\Invoice;\nuse App\\Export\\Invoice as ExportInvoice;\n\necho (new Invoice())->label() . "\\n";\necho (new ExportInvoice())->label() . "\\n";\n`,
        "src/Billing/Invoice.php": `<?php\nnamespace App\\Billing;\n\nclass Invoice\n{\n    public function label(): string\n    {\n        return "billing invoice";\n    }\n}\n`,
        "src/Export/Invoice.php": `<?php\nnamespace App\\Export;\n\nclass Invoice\n{\n    public function label(): string\n    {\n        return "export invoice";\n    }\n}\n`,
      },
      objectives: [
        {
          id: "alias",
          label: L("Import App\\Export\\Invoice with an alias", "Importer App\\Export\\Invoice avec un alias"),
          check: uses(/use\s+\\?App\\Export\\Invoice\s+as\s+\w+\s*;/),
          hints: [
            L("`use … as …` gives an imported class another short name.", "`use … as …` donne un autre nom court à une classe importée."),
            L("`use App\\Export\\Invoice as SomeName;`", "`use App\\Export\\Invoice as SomeName;`"),
            L("`use App\\Export\\Invoice as ExportInvoice;`", "`use App\\Export\\Invoice as ExportInvoice;`"),
          ],
        },
        {
          id: "output",
          label: L("Print billing invoice, then export invoice", "Afficher billing invoice, puis export invoice"),
          check: all(ran, outputLines(["billing invoice", "export invoice"])),
          hints: [
            L("The second `new` must use the alias.", "Le second `new` doit utiliser l'alias."),
            L("`new ExportInvoice()` creates an `App\\Export\\Invoice`.", "`new ExportInvoice()` crée un `App\\Export\\Invoice`."),
            L("Last line: `echo (new ExportInvoice())->label() . \"\\n\";`", "Dernière ligne : `echo (new ExportInvoice())->label() . \"\\n\";`"),
          ],
        },
      ],
      cheat: "namespaces",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Namespaces are surnames for classes and functions: `App\\Shop\\Product`.", "Les namespaces sont des noms de famille pour les classes et fonctions : `App\\Shop\\Product`."),
    L("One class per file; folders mirror namespaces.", "Une classe par fichier ; les dossiers reflètent les namespaces."),
    L("`use` imports a name, `as` renames it. Neither loads a file.", "`use` importe un nom, `as` le renomme. Aucun des deux ne charge de fichier."),
    L("A leading `\\` means global: `\\strlen`, `\\DateTime`.", "Un `\\` au début veut dire global : `\\strlen`, `\\DateTime`."),
  ],
};

export const autoloading: Lesson = {
  id: "autoloading",
  chapterId: CH,
  title: L("Autoloading", "L'autoloading"),
  tagline: L("Load classes on demand, the way Composer does", "Charge les classes à la demande, comme Composer"),
  xp: 60,
  syntax: ["spl_autoload_register", "PSR-4", "composer.json", "vendor/autoload.php"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("No more require lists", "Fini les listes de require"),
      body: [
        L(
          "With one class per file, a big project would need hundreds of `require` lines. Instead, PHP lets you register an **autoloader**: a function PHP calls the first time it meets a class it doesn't know yet.",
          "Avec une classe par fichier, un gros projet aurait besoin de centaines de lignes `require`. À la place, PHP te laisse enregistrer un **autoloader** : une fonction que PHP appelle la première fois qu'il rencontre une classe qu'il ne connaît pas encore.",
        ),
        L(
          "The autoloader receives the full class name and is expected to load the right file. If the class still doesn't exist afterwards, you get the usual *Class not found* error.",
          "L'autoloader reçoit le nom complet de la classe et doit charger le bon fichier. Si la classe n'existe toujours pas après, tu obtiens l'erreur habituelle *Class not found*.",
        ),
      ],
      scene: "compile",
      example: {
        code: `<?php\nspl_autoload_register(function (string $class) {\n    echo "PHP needs the class $class\\n";\n    eval("class $class { public function hi() { return 'Hello from $class'; } }");\n});\n\n$a = new Greeter();\necho $a->hi(), "\\n";\n$b = new Greeter();\necho "Second time: no call, the class is known.";\n`,
        caption: L("Here the autoloader invents the class on the fly; a real one loads a file.", "Ici l'autoloader invente la classe à la volée ; un vrai charge un fichier."),
      },
    },
    {
      kind: "discover",
      title: L("PSR-4: names map to paths", "PSR-4 : des noms vers des chemins"),
      body: [
        L(
          "The PHP community agreed on a rule called **PSR-4**: pick a namespace prefix (`App\\`) and a base folder (`src/`). The rest of the class name becomes the path: `App\\Models\\User` → `src/Models/User.php`.",
          "La communauté PHP s'est mise d'accord sur une règle appelée **PSR-4** : choisis un préfixe de namespace (`App\\`) et un dossier de base (`src/`). Le reste du nom de classe devient le chemin : `App\\Models\\User` → `src/Models/User.php`.",
        ),
        L(
          "**Composer**, PHP's package manager, writes this autoloader for you. In `composer.json` you declare `\"autoload\": {\"psr-4\": {\"App\\\\\": \"src/\"}}`, run `composer dump-autoload`, and add one line to your app: `require __DIR__ . '/vendor/autoload.php';`.",
          "**Composer**, le gestionnaire de paquets de PHP, écrit cet autoloader pour toi. Dans `composer.json` tu déclares `\"autoload\": {\"psr-4\": {\"App\\\\\": \"src/\"}}`, tu lances `composer dump-autoload`, et tu ajoutes une ligne à ton appli : `require __DIR__ . '/vendor/autoload.php';`.",
        ),
      ],
      example: {
        code: `<?php\nfunction classToFile(string $class): string\n{\n    $prefix = "App\\\\";\n    $relative = substr($class, strlen($prefix));\n    return "src/" . str_replace("\\\\", "/", $relative) . ".php";\n}\n\necho classToFile("App\\\\Models\\\\User"), "\\n";\necho classToFile("App\\\\Http\\\\Controllers\\\\HomeController");\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Where is the file?", "Où est le fichier ?"),
      question: L(
        "With the PSR-4 rule `App\\` → `src/`, which file holds `App\\Shop\\Cart`?",
        "Avec la règle PSR-4 `App\\` → `src/`, quel fichier contient `App\\Shop\\Cart` ?",
      ),
      options: ["src/Shop/Cart.php", "src/App/Shop/Cart.php", "Shop/Cart.php", "src/shop/cart.php"],
      answer: 0,
      explain: L(
        "The prefix `App\\` is replaced by `src/`, the remaining backslashes become slashes, and `.php` is added. Case matters on most servers.",
        "Le préfixe `App\\` est remplacé par `src/`, les antislashs restants deviennent des slashs, et on ajoute `.php`. La casse compte sur la plupart des serveurs.",
      ),
    },
    {
      kind: "try",
      title: L("Write a PSR-4 autoloader", "Écris un autoloader PSR-4"),
      body: L(
        "`index.php` uses two classes from `src/` but never requires them. Register an autoloader that maps `App\\` to the `src/` folder so it prints `Hello, Ada!`.",
        "`index.php` utilise deux classes de `src/` mais ne les charge jamais. Enregistre un autoloader qui fait correspondre `App\\` au dossier `src/` pour afficher `Hello, Ada!`.",
      ),
      files: {
        "index.php": `<?php\nuse App\\Models\\User;\nuse App\\Services\\Greeter;\n\n// Register an autoloader that maps App\\ to the src/ folder.\n\n$greeter = new Greeter();\necho $greeter->greet(new User("Ada"));\n`,
        "src/Models/User.php": `<?php\nnamespace App\\Models;\n\nclass User\n{\n    public function __construct(public string $name) {}\n}\n`,
        "src/Services/Greeter.php": `<?php\nnamespace App\\Services;\n\nuse App\\Models\\User;\n\nclass Greeter\n{\n    public function greet(User $user): string\n    {\n        return "Hello, {$user->name}!";\n    }\n}\n`,
      },
      solution: {
        "index.php": `<?php\nuse App\\Models\\User;\nuse App\\Services\\Greeter;\n\nspl_autoload_register(function (string $class): void {\n    $prefix = 'App\\\\';\n    if (!str_starts_with($class, $prefix)) {\n        return;\n    }\n    $file = __DIR__ . '/src/' . str_replace('\\\\', '/', substr($class, strlen($prefix))) . '.php';\n    if (is_file($file)) {\n        require $file;\n    }\n});\n\n$greeter = new Greeter();\necho $greeter->greet(new User("Ada"));\n`,
        "src/Models/User.php": `<?php\nnamespace App\\Models;\n\nclass User\n{\n    public function __construct(public string $name) {}\n}\n`,
        "src/Services/Greeter.php": `<?php\nnamespace App\\Services;\n\nuse App\\Models\\User;\n\nclass Greeter\n{\n    public function greet(User $user): string\n    {\n        return "Hello, {$user->name}!";\n    }\n}\n`,
      },
      objectives: [
        {
          id: "register",
          label: L("Register an autoloader (no require of the classes)", "Enregistrer un autoloader (sans require des classes)"),
          check: all(uses(/spl_autoload_register\s*\(/), avoids(/require[^;]*src\//)),
          hints: [
            L("`spl_autoload_register()` takes a function that receives the class name.", "`spl_autoload_register()` prend une fonction qui reçoit le nom de la classe."),
            L("Inside: remove the `App\\` prefix, turn `\\` into `/`, add `.php`, then `require` the file under `__DIR__ . '/src/'`.", "Dedans : retire le préfixe `App\\`, change `\\` en `/`, ajoute `.php`, puis `require` le fichier sous `__DIR__ . '/src/'`."),
            L(
              "`spl_autoload_register(function (string $class) { $file = __DIR__ . '/src/' . str_replace('\\\\', '/', substr($class, 4)) . '.php'; require $file; });`",
              "`spl_autoload_register(function (string $class) { $file = __DIR__ . '/src/' . str_replace('\\\\', '/', substr($class, 4)) . '.php'; require $file; });`",
            ),
          ],
        },
        {
          id: "output",
          label: L("Print: Hello, Ada!", "Afficher : Hello, Ada!"),
          check: all(ran, outputIs("Hello, Ada!")),
          hints: [
            L("Register the autoloader before the first `new`.", "Enregistre l'autoloader avant le premier `new`."),
            L("A wrong path shows a *Failed opening required* error: check the slashes.", "Un mauvais chemin donne une erreur *Failed opening required* : vérifie les slashs."),
            L("`App\\Services\\Greeter` must become `/app/src/Services/Greeter.php`.", "`App\\Services\\Greeter` doit devenir `/app/src/Services/Greeter.php`."),
          ],
        },
      ],
      cheat: "namespaces",
    },
    {
      kind: "challenge",
      title: L("Fix the autoloader, write the Cart", "Répare l'autoloader, écris le Cart"),
      body: L(
        "The autoloader has two bugs, and `src/Shop/Cart.php` is empty. Fix the autoloader, then write the `App\\Shop\\Cart` class: `add(Product $p)` stores a product and `total(): float` sums the prices. It must print `Total: 35`.",
        "L'autoloader a deux bugs, et `src/Shop/Cart.php` est vide. Répare l'autoloader, puis écris la classe `App\\Shop\\Cart` : `add(Product $p)` range un produit et `total(): float` additionne les prix. Ça doit afficher `Total: 35`.",
      ),
      files: {
        "index.php": `<?php\nspl_autoload_register(function (string $class): void {\n    $relative = substr($class, strlen('App\\\\'));\n    $file = __DIR__ . '/src/' . $relative;\n    if (is_file($file)) {\n        require $file;\n    }\n});\n\nuse App\\Shop\\Cart;\nuse App\\Shop\\Product;\n\n$cart = new Cart();\n$cart->add(new Product("Mug", 12.5));\n$cart->add(new Product("Tea", 22.5));\necho "Total: " . $cart->total();\n`,
        "src/Shop/Product.php": `<?php\nnamespace App\\Shop;\n\nclass Product\n{\n    public function __construct(public string $name, public float $price) {}\n}\n`,
        "src/Shop/Cart.php": `<?php\nnamespace App\\Shop;\n\n// Write the Cart class here\n`,
      },
      solution: {
        "index.php": `<?php\nspl_autoload_register(function (string $class): void {\n    $relative = substr($class, strlen('App\\\\'));\n    $file = __DIR__ . '/src/' . str_replace('\\\\', '/', $relative) . '.php';\n    if (is_file($file)) {\n        require $file;\n    }\n});\n\nuse App\\Shop\\Cart;\nuse App\\Shop\\Product;\n\n$cart = new Cart();\n$cart->add(new Product("Mug", 12.5));\n$cart->add(new Product("Tea", 22.5));\necho "Total: " . $cart->total();\n`,
        "src/Shop/Product.php": `<?php\nnamespace App\\Shop;\n\nclass Product\n{\n    public function __construct(public string $name, public float $price) {}\n}\n`,
        "src/Shop/Cart.php": `<?php\nnamespace App\\Shop;\n\nclass Cart\n{\n    /** @var Product[] */\n    private array $products = [];\n\n    public function add(Product $product): void\n    {\n        $this->products[] = $product;\n    }\n\n    public function total(): float\n    {\n        $total = 0.0;\n        foreach ($this->products as $product) {\n            $total += $product->price;\n        }\n        return $total;\n    }\n}\n`,
      },
      objectives: [
        {
          id: "autoload",
          label: L("The autoloader finds src/Shop/Product.php", "L'autoloader trouve src/Shop/Product.php"),
          check: (c) => c.r.classes.includes("App\\Shop\\Product"),
          hints: [
            L("Add `var_dump($file);` inside the autoloader to see the path it builds.", "Ajoute `var_dump($file);` dans l'autoloader pour voir le chemin qu'il construit."),
            L("The path still has a backslash and no `.php` extension.", "Le chemin a encore un antislash et pas d'extension `.php`."),
            L("`$file = __DIR__ . '/src/' . str_replace('\\\\', '/', $relative) . '.php';`", "`$file = __DIR__ . '/src/' . str_replace('\\\\', '/', $relative) . '.php';`"),
          ],
        },
        {
          id: "cart",
          label: L("Define App\\Shop\\Cart in src/Shop/Cart.php", "Définir App\\Shop\\Cart dans src/Shop/Cart.php"),
          check: definesClass("App\\Shop\\Cart"),
          hints: [
            L("The file already has the right namespace: add a class below it.", "Le fichier a déjà le bon namespace : ajoute une classe en dessous."),
            L("A private array property holds the products.", "Une propriété tableau privée garde les produits."),
            L("`class Cart { private array $products = []; public function add(Product $p): void { $this->products[] = $p; } … }`", "`class Cart { private array $products = []; public function add(Product $p): void { $this->products[] = $p; } … }`"),
          ],
        },
        {
          id: "total",
          label: L("Print: Total: 35", "Afficher : Total: 35"),
          check: all(clean, outputIs("Total: 35")),
          hints: [
            L("total() adds up the price of every product.", "total() additionne le prix de chaque produit."),
            L("Loop over the products, or use `array_sum(array_map(...))`.", "Boucle sur les produits, ou utilise `array_sum(array_map(...))`."),
            L("`public function total(): float { $t = 0.0; foreach ($this->products as $p) { $t += $p->price; } return $t; }`", "`public function total(): float { $t = 0.0; foreach ($this->products as $p) { $t += $p->price; } return $t; }`"),
          ],
        },
      ],
      cheat: "namespaces",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("An autoloader is a function PHP calls when it meets an unknown class.", "Un autoloader est une fonction que PHP appelle quand il rencontre une classe inconnue."),
    L("PSR-4: `App\\Models\\User` → `src/Models/User.php`.", "PSR-4 : `App\\Models\\User` → `src/Models/User.php`."),
    L("Composer generates it from composer.json: `require 'vendor/autoload.php';`.", "Composer le génère depuis composer.json : `require 'vendor/autoload.php';`."),
  ],
};

export const generators: Lesson = {
  id: "generators",
  chapterId: CH,
  title: L("Generators", "Les générateurs"),
  tagline: L("yield values one at a time, lazily", "Produis des valeurs une par une, à la demande"),
  xp: 60,
  syntax: ["yield", "yield $k => $v", "yield from", "Generator", "iterator_to_array"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("A function that pauses", "Une fonction qui fait des pauses"),
      body: [
        L(
          "A function containing `yield` is a **generator**. Calling it doesn't run it: it returns a `Generator` object. Each time a `foreach` asks for the next value, the function runs until the next `yield`, hands over the value, and **pauses** there.",
          "Une fonction qui contient `yield` est un **générateur**. L'appeler ne l'exécute pas : elle renvoie un objet `Generator`. Chaque fois qu'un `foreach` demande la valeur suivante, la fonction tourne jusqu'au prochain `yield`, donne la valeur, et **se met en pause** là.",
        ),
        L(
          "Values are produced on demand, one at a time. Nothing is built in advance, so a generator can describe huge (or even endless) sequences.",
          "Les valeurs sont produites à la demande, une par une. Rien n'est construit à l'avance, donc un générateur peut décrire des suites énormes (voire infinies).",
        ),
      ],
      example: {
        code: `<?php\nfunction countTo(int $n): Generator\n{\n    for ($i = 1; $i <= $n; $i++) {\n        echo "(making $i) ";\n        yield $i;\n    }\n}\n\nforeach (countTo(3) as $number) {\n    echo "got $number\\n";\n}\n`,
      },
    },
    {
      kind: "watch",
      title: L("Watch the ping-pong", "Regarde le ping-pong"),
      body: L(
        "Step through and watch the call stack: execution jumps into `countTo` to make a value, back to the loop to use it, and back again.",
        "Avance pas à pas et regarde la pile d'appels : l'exécution saute dans `countTo` pour fabriquer une valeur, revient dans la boucle pour l'utiliser, et repart.",
      ),
      code: `<?php\nfunction countTo(int $n): Generator\n{\n    for ($i = 1; $i <= $n; $i++) {\n        echo "(making $i) ";\n        yield $i;\n    }\n}\n\n$numbers = countTo(3);\nforeach ($numbers as $number) {\n    echo "got $number\\n";\n}\n`,
      notes: {
        10: L("Nothing printed yet: calling the generator only creates it.", "Rien d'affiché encore : appeler le générateur ne fait que le créer."),
        5: L("The loop asked for a value: we're inside countTo now (look at the stack).", "La boucle a demandé une valeur : on est maintenant dans countTo (regarde la pile)."),
        12: L("Back in the loop with the value, while countTo is paused on its yield.", "Retour dans la boucle avec la valeur, pendant que countTo est en pause sur son yield."),
      },
    },
    {
      kind: "discover",
      title: L("Keys, yield from, and memory", "Les clés, yield from, et la mémoire"),
      body: [
        L(
          "`yield $key => $value` produces keys too. `yield from` hands over every value of an array or another generator. `iterator_to_array()` collects everything into an array when you need one.",
          "`yield $key => $value` produit aussi des clés. `yield from` transmet chaque valeur d'un tableau ou d'un autre générateur. `iterator_to_array()` rassemble tout dans un tableau quand tu en as besoin.",
        ),
        L(
          "The big win is memory: summing 50,000 numbers from a generator uses almost nothing, while `range()` builds the whole array first.",
          "Le gros avantage, c'est la mémoire : additionner 50 000 nombres depuis un générateur n'utilise presque rien, alors que `range()` construit d'abord tout le tableau.",
        ),
      ],
      examples: [
        {
          code: `<?php\nfunction menu(): Generator\n{\n    yield "starter" => "soup";\n    yield "main" => "pasta";\n    yield from ["dessert" => "cake", "drink" => "tea"];\n}\n\nforeach (menu() as $course => $dish) {\n    echo "$course: $dish\\n";\n}\nprint_r(iterator_to_array(menu()));\n`,
        },
        {
          code: `<?php\nfunction numbers(int $max): Generator\n{\n    for ($i = 1; $i <= $max; $i++) {\n        yield $i;\n    }\n}\n\n$before = memory_get_usage();\n$sum = 0;\nforeach (numbers(50000) as $n) {\n    $sum += $n;\n}\necho "Generator: $sum, extra memory: " . round((memory_get_usage() - $before) / 1024) . " KB\\n";\n\n$before = memory_get_usage();\n$all = range(1, 50000);\necho "Array: " . array_sum($all) . ", extra memory: " . round((memory_get_usage() - $before) / 1024) . " KB\\n";\n`,
          caption: L("Same sum, very different memory use.", "Même somme, consommation mémoire très différente."),
        },
      ],
    },
    {
      kind: "quiz",
      title: L("When does it start?", "Quand est-ce que ça démarre ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nfunction gen()\n{\n    echo "A";\n    yield 1;\n    echo "B";\n}\n\n$g = gen();\necho "C";\nforeach ($g as $v) {\n    echo $v;\n}\n`,
      options: ["AC1B", "CA1B", "C1AB", "A1BC"],
      answer: 1,
      explain: L(
        "`gen()` creates the generator without running it, so `C` comes first. The foreach starts it: `A`, then the yielded `1`; the next request resumes it and prints `B`.",
        "`gen()` crée le générateur sans l'exécuter, donc `C` vient en premier. Le foreach le démarre : `A`, puis le `1` produit ; la demande suivante le reprend et affiche `B`.",
      ),
    },
    {
      kind: "try",
      title: L("Even numbers on demand", "Des nombres pairs à la demande"),
      body: L(
        "Turn `evens()` into a generator that yields the even numbers from 2 up to `$max`.",
        "Transforme `evens()` en générateur qui produit les nombres pairs de 2 jusqu'à `$max`.",
      ),
      files: {
        "index.php": `<?php\nfunction evens(int $max)\n{\n    // yield 2, 4, 6… up to $max\n    return [];\n}\n\nforeach (evens(10) as $n) {\n    echo $n, " ";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nfunction evens(int $max): Generator\n{\n    for ($n = 2; $n <= $max; $n += 2) {\n        yield $n;\n    }\n}\n\nforeach (evens(10) as $n) {\n    echo $n, " ";\n}\n`,
      },
      probes: ["implode(',', iterator_to_array(evens(10), false))", "evens(4) instanceof Generator"],
      objectives: [
        {
          id: "gen",
          label: L("evens() is a generator", "evens() est un générateur"),
          check: probeIs("evens(4) instanceof Generator", true),
          hints: [
            L("Any function containing `yield` becomes a generator.", "Toute fonction qui contient `yield` devient un générateur."),
            L("Replace `return [];` with a loop that yields.", "Remplace `return [];` par une boucle qui fait des yield."),
            L("`for ($n = 2; $n <= $max; $n += 2) { yield $n; }`", "`for ($n = 2; $n <= $max; $n += 2) { yield $n; }`"),
          ],
        },
        {
          id: "values",
          label: L("evens(10) gives 2, 4, 6, 8, 10", "evens(10) donne 2, 4, 6, 8, 10"),
          check: probeIs("implode(',', iterator_to_array(evens(10), false))", "2,4,6,8,10"),
          hints: [
            L("Start at 2, step by 2, stop after `$max`.", "Commence à 2, avance de 2, arrête après `$max`."),
            L("`$n <= $max` includes 10.", "`$n <= $max` inclut 10."),
            L("`for ($n = 2; $n <= $max; $n += 2) { yield $n; }`", "`for ($n = 2; $n <= $max; $n += 2) { yield $n; }`"),
          ],
        },
      ],
      cheat: "generators",
    },
    {
      kind: "challenge",
      title: L("A lazy log reader", "Un lecteur de journal paresseux"),
      body: L(
        "Write two generators: `lines()` yields each non-empty line of a text, keyed by its line number (starting at 1), and `errorsOnly()` yields only the lines starting with `ERROR`, keeping their keys. The loop must print `3: ERROR disk full` and `5: ERROR timeout`.",
        "Écris deux générateurs : `lines()` produit chaque ligne non vide d'un texte, avec son numéro de ligne comme clé (à partir de 1), et `errorsOnly()` ne produit que les lignes qui commencent par `ERROR`, en gardant leurs clés. La boucle doit afficher `3: ERROR disk full` et `5: ERROR timeout`.",
      ),
      files: {
        "index.php": `<?php\n$log = <<<LOG\nINFO server started\n\nERROR disk full\nINFO user login\nERROR timeout\nLOG;\n\n// 1. Yield each non-empty line, keyed by its line number (starting at 1)\nfunction lines(string $text): Generator\n{\n    yield from [];\n}\n\n// 2. Yield only the lines that start with "ERROR", keeping their keys\nfunction errorsOnly(iterable $lines): Generator\n{\n    yield from [];\n}\n\nforeach (errorsOnly(lines($log)) as $number => $line) {\n    echo "$number: $line\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\n$log = <<<LOG\nINFO server started\n\nERROR disk full\nINFO user login\nERROR timeout\nLOG;\n\nfunction lines(string $text): Generator\n{\n    foreach (explode("\\n", $text) as $i => $line) {\n        if (trim($line) !== "") {\n            yield $i + 1 => trim($line);\n        }\n    }\n}\n\nfunction errorsOnly(iterable $lines): Generator\n{\n    foreach ($lines as $number => $line) {\n        if (str_starts_with($line, "ERROR")) {\n            yield $number => $line;\n        }\n    }\n}\n\nforeach (errorsOnly(lines($log)) as $number => $line) {\n    echo "$number: $line\\n";\n}\n`,
      },
      probes: ["iterator_to_array(lines('a' . PHP_EOL . PHP_EOL . 'b'))", "iterator_to_array(errorsOnly([1 => 'ok', 2 => 'ERROR x']))"],
      objectives: [
        {
          id: "lines",
          label: L("lines() skips empty lines and keys them by line number", "lines() saute les lignes vides et les numérote"),
          check: probeIs("iterator_to_array(lines('a' . PHP_EOL . PHP_EOL . 'b'))", { 1: "a", 3: "b" }),
          hints: [
            L("`explode(\"\\n\", $text)` gives the lines with keys 0, 1, 2…", "`explode(\"\\n\", $text)` donne les lignes avec les clés 0, 1, 2…"),
            L("Line numbers start at 1, so yield `$i + 1 => $line`, and skip lines where `trim($line) === \"\"`.", "Les numéros commencent à 1, donc yield `$i + 1 => $line`, et saute les lignes où `trim($line) === \"\"`."),
            L("`foreach (explode(\"\\n\", $text) as $i => $line) { if (trim($line) !== \"\") { yield $i + 1 => trim($line); } }`", "`foreach (explode(\"\\n\", $text) as $i => $line) { if (trim($line) !== \"\") { yield $i + 1 => trim($line); } }`"),
          ],
        },
        {
          id: "errors",
          label: L("errorsOnly() keeps only ERROR lines, with their keys", "errorsOnly() ne garde que les lignes ERROR, avec leurs clés"),
          check: probeIs("iterator_to_array(errorsOnly([1 => 'ok', 2 => 'ERROR x']))", { 2: "ERROR x" }),
          hints: [
            L("Loop over `$lines` with both key and value.", "Boucle sur `$lines` avec la clé et la valeur."),
            L("`str_starts_with($line, \"ERROR\")` tests the beginning of a string.", "`str_starts_with($line, \"ERROR\")` teste le début d'une chaîne."),
            L("`foreach ($lines as $n => $line) { if (str_starts_with($line, \"ERROR\")) { yield $n => $line; } }`", "`foreach ($lines as $n => $line) { if (str_starts_with($line, \"ERROR\")) { yield $n => $line; } }`"),
          ],
        },
        {
          id: "output",
          label: L("Print 3: ERROR disk full and 5: ERROR timeout", "Afficher 3: ERROR disk full et 5: ERROR timeout"),
          check: all(clean, outputLines(["3: ERROR disk full", "5: ERROR timeout"])),
          hints: [
            L("The loop at the bottom is already written.", "La boucle du bas est déjà écrite."),
            L("If the numbers are off by one, check where line numbers start.", "Si les numéros sont décalés d'un, vérifie où commencent les numéros de ligne."),
            L("Once both generators work, the output follows.", "Une fois les deux générateurs écrits, la sortie suit."),
          ],
        },
      ],
      cheat: "generators",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A function with `yield` returns a Generator; it runs only when asked for values.", "Une fonction avec `yield` renvoie un Generator ; elle ne tourne que quand on lui demande des valeurs."),
    L("It pauses at each yield and resumes where it stopped.", "Elle fait une pause à chaque yield et reprend là où elle s'était arrêtée."),
    L("`yield $k => $v` gives keys; `yield from` delegates to an array or generator.", "`yield $k => $v` donne des clés ; `yield from` délègue à un tableau ou un générateur."),
    L("Generators keep memory flat: values exist one at a time.", "Les générateurs gardent la mémoire stable : les valeurs existent une à la fois."),
  ],
};

export const iterators: Lesson = {
  id: "iterators",
  chapterId: CH,
  title: L("Iterators and collections", "Itérateurs et collections"),
  tagline: L("Make your objects work with foreach, count() and []", "Fais marcher tes objets avec foreach, count() et []"),
  xp: 60,
  syntax: ["IteratorAggregate", "Iterator", "Countable", "ArrayAccess", "ArrayIterator"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("foreach on your own objects", "foreach sur tes propres objets"),
      body: [
        L(
          "`foreach` works on arrays, and on any object that implements `Traversable`. The easiest way is **`IteratorAggregate`**: one method, `getIterator()`, that returns an iterator (an `ArrayIterator` or a generator).",
          "`foreach` marche sur les tableaux, et sur tout objet qui implémente `Traversable`. Le plus simple est **`IteratorAggregate`** : une seule méthode, `getIterator()`, qui renvoie un itérateur (un `ArrayIterator` ou un générateur).",
        ),
        L(
          "Your class keeps its data private, and decides how it's walked through.",
          "Ta classe garde ses données privées, et décide comment on les parcourt.",
        ),
      ],
      example: {
        code: `<?php\nclass Playlist implements IteratorAggregate\n{\n    private array $songs = [];\n\n    public function add(string $song): static\n    {\n        $this->songs[] = $song;\n        return $this;\n    }\n\n    public function getIterator(): Generator\n    {\n        foreach ($this->songs as $i => $song) {\n            yield $i + 1 => $song;\n        }\n    }\n}\n\n$list = (new Playlist())->add("Intro")->add("Echoes")->add("Outro");\nforeach ($list as $track => $song) {\n    echo "$track. $song\\n";\n}\n`,
      },
    },
    {
      kind: "watch",
      title: L("What foreach really calls", "Ce que foreach appelle vraiment"),
      body: L(
        "The full `Iterator` interface has five methods. Step through and watch the stack: foreach calls `rewind()` once, then `next()` after each item.",
        "L'interface `Iterator` complète a cinq méthodes. Avance pas à pas et regarde la pile : foreach appelle `rewind()` une fois, puis `next()` après chaque élément.",
      ),
      code: `<?php\nclass Countdown implements Iterator\n{\n    private int $n;\n    public function __construct(private int $from) { $this->n = $from; }\n    public function rewind(): void { $this->n = $this->from; }\n    public function valid(): bool { return $this->n > 0; }\n    public function current(): mixed { return $this->n; }\n    public function key(): mixed { return $this->from - $this->n; }\n    public function next(): void { $this->n--; }\n}\n\nforeach (new Countdown(3) as $i => $value) {\n    echo "$i => $value\\n";\n}\n`,
      notes: {
        5: L("The constructor sets the starting point.", "Le constructeur fixe le point de départ."),
        6: L("foreach starts by calling rewind().", "foreach commence par appeler rewind()."),
        14: L("valid() said yes, current() and key() gave the value and key.", "valid() a dit oui, current() et key() ont donné la valeur et la clé."),
        10: L("After each item, next() moves forward.", "Après chaque élément, next() avance."),
      },
    },
    {
      kind: "discover",
      title: L("count() and [] on objects", "count() et [] sur des objets"),
      body: [
        L(
          "Implement **`Countable`** (a `count(): int` method) and `count($obj)` works. Implement **`ArrayAccess`** (four methods: `offsetExists`, `offsetGet`, `offsetSet`, `offsetUnset`) and `$obj[\"key\"]`, `isset($obj[\"key\"])` and `unset($obj[\"key\"])` work too.",
          "Implémente **`Countable`** (une méthode `count(): int`) et `count($obj)` marche. Implémente **`ArrayAccess`** (quatre méthodes : `offsetExists`, `offsetGet`, `offsetSet`, `offsetUnset`) et `$obj[\"key\"]`, `isset($obj[\"key\"])` et `unset($obj[\"key\"])` marchent aussi.",
        ),
        L(
          "Write the exact types (`mixed $offset`, `: bool`, `: void`…): since PHP 8.1 missing return types on these methods trigger a deprecation.",
          "Écris les types exacts (`mixed $offset`, `: bool`, `: void`…) : depuis PHP 8.1, des types de retour manquants sur ces méthodes déclenchent une dépréciation.",
        ),
      ],
      example: {
        code: `<?php\nclass Settings implements ArrayAccess, Countable\n{\n    private array $data = [];\n\n    public function offsetExists(mixed $offset): bool { return isset($this->data[$offset]); }\n    public function offsetGet(mixed $offset): mixed { return $this->data[$offset] ?? null; }\n    public function offsetSet(mixed $offset, mixed $value): void { $this->data[$offset] = $value; }\n    public function offsetUnset(mixed $offset): void { unset($this->data[$offset]); }\n    public function count(): int { return count($this->data); }\n}\n\n$s = new Settings();\n$s["theme"] = "dark";\n$s["lang"] = "fr";\nunset($s["lang"]);\necho $s["theme"], " / ", count($s), " setting(s)\\n";\nvar_dump(isset($s["lang"]));\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Who decides the count?", "Qui décide du compte ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Team implements Countable\n{\n    private array $members = ["Ada", "Linus", "Grace"];\n\n    public function count(): int\n    {\n        return count($this->members) * 10;\n    }\n}\n\necho count(new Team());\n`,
      options: ["3", "30", "1", L("A TypeError", "Une TypeError")],
      answer: 1,
      explain: L(
        "`count($obj)` simply calls the object's `count()` method, whatever it returns: here 3 × 10.",
        "`count($obj)` appelle simplement la méthode `count()` de l'objet, quoi qu'elle renvoie : ici 3 × 10.",
      ),
    },
    {
      kind: "try",
      title: L("Make the TodoList loopable", "Rends la TodoList parcourable"),
      body: L(
        "The foreach prints nothing: from outside, a plain object only exposes its public properties. Make `TodoList` implement `IteratorAggregate` so the loop prints both items.",
        "Le foreach n'affiche rien : de l'extérieur, un objet ordinaire n'expose que ses propriétés publiques. Fais implémenter `IteratorAggregate` à `TodoList` pour que la boucle affiche les deux éléments.",
      ),
      files: {
        "index.php": `<?php\nclass TodoList\n{\n    private array $items = [];\n\n    public function add(string $item): static\n    {\n        $this->items[] = $item;\n        return $this;\n    }\n}\n\n$todo = (new TodoList())->add("Write tests")->add("Ship it");\nforeach ($todo as $i => $item) {\n    echo ($i + 1) . ". $item\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass TodoList implements IteratorAggregate\n{\n    private array $items = [];\n\n    public function add(string $item): static\n    {\n        $this->items[] = $item;\n        return $this;\n    }\n\n    public function getIterator(): Iterator\n    {\n        return new ArrayIterator($this->items);\n    }\n}\n\n$todo = (new TodoList())->add("Write tests")->add("Ship it");\nforeach ($todo as $i => $item) {\n    echo ($i + 1) . ". $item\\n";\n}\n`,
      },
      objectives: [
        {
          id: "aggregate",
          label: L("TodoList implements IteratorAggregate", "TodoList implémente IteratorAggregate"),
          check: all(uses(/implements\s+\\?IteratorAggregate/), clean),
          hints: [
            L("Add `implements IteratorAggregate` to the class line, then the method it requires.", "Ajoute `implements IteratorAggregate` à la ligne de la classe, puis la méthode qu'il exige."),
            L("`public function getIterator(): Iterator` must return an iterator over `$this->items`.", "`public function getIterator(): Iterator` doit renvoyer un itérateur sur `$this->items`."),
            L("`return new ArrayIterator($this->items);`", "`return new ArrayIterator($this->items);`"),
          ],
        },
        {
          id: "output",
          label: L("Print 1. Write tests and 2. Ship it", "Afficher 1. Write tests et 2. Ship it"),
          check: outputLines(["1. Write tests", "2. Ship it"]),
          hints: [
            L("ArrayIterator keeps the array's keys (0 and 1).", "ArrayIterator garde les clés du tableau (0 et 1)."),
            L("The loop already adds 1 to each key.", "La boucle ajoute déjà 1 à chaque clé."),
            L("Once getIterator() returns `new ArrayIterator($this->items)`, the output is right.", "Une fois que getIterator() renvoie `new ArrayIterator($this->items)`, la sortie est juste."),
          ],
        },
      ],
      cheat: "generators",
    },
    {
      kind: "challenge",
      title: L("A real Collection", "Une vraie Collection"),
      body: L(
        "Write a `Collection` class that behaves like an array: `$c[\"key\"]` read/write/isset/unset (ArrayAccess), `count($c)` (Countable) and `foreach` (IteratorAggregate). The code at the bottom must print `2`, `has b` and `b=2 c=3`, with no deprecation.",
        "Écris une classe `Collection` qui se comporte comme un tableau : `$c[\"key\"]` en lecture/écriture/isset/unset (ArrayAccess), `count($c)` (Countable) et `foreach` (IteratorAggregate). Le code du bas doit afficher `2`, `has b` et `b=2 c=3`, sans aucune dépréciation.",
      ),
      files: {
        "index.php": `<?php\nclass Collection\n{\n    public function __construct(private array $items = []) {}\n}\n\n$c = new Collection(["a" => 1, "b" => 2]);\n$c["c"] = 3;\nunset($c["a"]);\necho count($c), "\\n";\necho isset($c["b"]) ? "has b" : "no b", "\\n";\nforeach ($c as $key => $value) {\n    echo "$key=$value ";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass Collection implements ArrayAccess, Countable, IteratorAggregate\n{\n    public function __construct(private array $items = []) {}\n\n    public function offsetExists(mixed $offset): bool\n    {\n        return isset($this->items[$offset]);\n    }\n\n    public function offsetGet(mixed $offset): mixed\n    {\n        return $this->items[$offset] ?? null;\n    }\n\n    public function offsetSet(mixed $offset, mixed $value): void\n    {\n        if ($offset === null) {\n            $this->items[] = $value;\n        } else {\n            $this->items[$offset] = $value;\n        }\n    }\n\n    public function offsetUnset(mixed $offset): void\n    {\n        unset($this->items[$offset]);\n    }\n\n    public function count(): int\n    {\n        return count($this->items);\n    }\n\n    public function getIterator(): Iterator\n    {\n        return new ArrayIterator($this->items);\n    }\n}\n\n$c = new Collection(["a" => 1, "b" => 2]);\n$c["c"] = 3;\nunset($c["a"]);\necho count($c), "\\n";\necho isset($c["b"]) ? "has b" : "no b", "\\n";\nforeach ($c as $key => $value) {\n    echo "$key=$value ";\n}\n`,
      },
      probes: ["count(new Collection([1, 2, 3]))", "(new Collection(['x' => 5]))['x']"],
      objectives: [
        {
          id: "array-access",
          label: L("$c[\"key\"] works (ArrayAccess)", "$c[\"key\"] marche (ArrayAccess)"),
          check: all(ran, probeIs("(new Collection(['x' => 5]))['x']", 5)),
          hints: [
            L("The error *Cannot use object of type Collection as array* means ArrayAccess is missing.", "L'erreur *Cannot use object of type Collection as array* veut dire qu'ArrayAccess manque."),
            L("Four methods: offsetExists, offsetGet, offsetSet, offsetUnset, all working on `$this->items`.", "Quatre méthodes : offsetExists, offsetGet, offsetSet, offsetUnset, toutes sur `$this->items`."),
            L("`public function offsetGet(mixed $offset): mixed { return $this->items[$offset] ?? null; }` (and the three others, same idea).", "`public function offsetGet(mixed $offset): mixed { return $this->items[$offset] ?? null; }` (et les trois autres, même idée)."),
          ],
        },
        {
          id: "count",
          label: L("count($c) works (Countable)", "count($c) marche (Countable)"),
          check: probeIs("count(new Collection([1, 2, 3]))", 3),
          hints: [
            L("Countable needs one method.", "Countable demande une seule méthode."),
            L("`public function count(): int`", "`public function count(): int`"),
            L("`public function count(): int { return count($this->items); }`", "`public function count(): int { return count($this->items); }`"),
          ],
        },
        {
          id: "output",
          label: L("Print 2, has b, b=2 c=3 with no deprecation", "Afficher 2, has b, b=2 c=3 sans dépréciation"),
          check: all(clean, outputLines(["2", "has b", "b=2 c=3"])),
          hints: [
            L("The foreach needs IteratorAggregate. Deprecations mean a missing type on a method.", "Le foreach a besoin d'IteratorAggregate. Les dépréciations signalent un type manquant sur une méthode."),
            L("`getIterator(): Iterator` returning `new ArrayIterator($this->items)`.", "`getIterator(): Iterator` qui renvoie `new ArrayIterator($this->items)`."),
            L("Class line: `class Collection implements ArrayAccess, Countable, IteratorAggregate`.", "Ligne de classe : `class Collection implements ArrayAccess, Countable, IteratorAggregate`."),
          ],
        },
      ],
      cheat: "generators",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`IteratorAggregate` + `getIterator()` is the easy way to make an object loopable.", "`IteratorAggregate` + `getIterator()` est le moyen simple de rendre un objet parcourable."),
    L("`Iterator` gives full control: rewind, valid, current, key, next.", "`Iterator` donne le contrôle total : rewind, valid, current, key, next."),
    L("`Countable` powers `count()`; `ArrayAccess` powers `$obj[...]`.", "`Countable` fait marcher `count()` ; `ArrayAccess` fait marcher `$obj[...]`."),
    L("Write the exact method types to avoid deprecations (PHP 8.1+).", "Écris les types exacts des méthodes pour éviter les dépréciations (PHP 8.1+)."),
  ],
};

export const attributes: Lesson = {
  id: "attributes",
  chapterId: CH,
  title: L("Attributes", "Les attributs"),
  tagline: L("Metadata with #[...] and Reflection", "Des métadonnées avec #[...] et Reflection"),
  xp: 60,
  syntax: ["#[Attribute]", "#[\\Override]", "#[\\Deprecated]", "ReflectionClass", "getAttributes()"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("Labels on your code", "Des étiquettes sur ton code"),
      body: [
        L(
          "An **attribute** is a label you stick on a class, method, property or parameter, written `#[Name(arguments)]`. It doesn't change what the code does by itself: it's **metadata** that PHP or a framework can read.",
          "Un **attribut** est une étiquette que tu colles sur une classe, une méthode, une propriété ou un paramètre, écrite `#[Name(arguments)]`. Il ne change pas ce que fait le code tout seul : ce sont des **métadonnées** que PHP ou un framework peuvent lire.",
        ),
        L(
          "PHP has built-in ones: `#[\\SensitiveParameter]` (8.2) hides a password from stack traces, `#[\\Override]` (8.3) checks that a method really overrides a parent's, `#[\\Deprecated]` (8.4) marks your own functions as deprecated.",
          "PHP en a d'origine : `#[\\SensitiveParameter]` (8.2) cache un mot de passe dans les traces, `#[\\Override]` (8.3) vérifie qu'une méthode redéfinit vraiment celle du parent, `#[\\Deprecated]` (8.4) marque tes propres fonctions comme dépréciées.",
        ),
      ],
      example: {
        code: `<?php\n#[\\Deprecated(message: "use greet() instead", since: "2.0")]\nfunction sayHello(): string\n{\n    return "hello";\n}\n\necho sayHello();\n`,
        caption: L("Look at the Problems tab: PHP 8.4+ reports the deprecation for you.", "Regarde l'onglet Problèmes : PHP 8.4+ signale la dépréciation pour toi."),
      },
      callout: {
        tone: "version",
        text: L(
          "Attributes arrived in PHP 8.0. Before, frameworks parsed special comments (`/** @Route(\"/posts\") */`), which PHP itself ignored.",
          "Les attributs sont arrivés avec PHP 8.0. Avant, les frameworks analysaient des commentaires spéciaux (`/** @Route(\"/posts\") */`), que PHP lui-même ignorait.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Reading attributes with Reflection", "Lire les attributs avec Reflection"),
      body: L(
        "Your own attribute is a class marked `#[Attribute]`. **Reflection** lets code inspect other code: here we list a controller's methods and read their `#[Route]`. This is how Symfony and Laravel map URLs to methods.",
        "Ton propre attribut est une classe marquée `#[Attribute]`. **Reflection** permet au code d'inspecter du code : ici on liste les méthodes d'un contrôleur et on lit leur `#[Route]`. C'est ainsi que Symfony et Laravel relient des URL à des méthodes.",
      ),
      code: `<?php\n#[Attribute]\nclass Route\n{\n    public function __construct(public string $path) {}\n}\n\nclass BlogController\n{\n    #[Route("/posts")]\n    public function index(): string { return "all posts"; }\n\n    #[Route("/posts/new")]\n    public function create(): string { return "new post form"; }\n}\n\n$methods = (new ReflectionClass(BlogController::class))->getMethods();\nforeach ($methods as $method) {\n    $attributes = $method->getAttributes(Route::class);\n    $route = $attributes[0]->newInstance();\n    echo $route->path . " -> " . $method->getName() . "\\n";\n}\n`,
      notes: {
        17: L("ReflectionClass describes the class: here, its list of methods.", "ReflectionClass décrit la classe : ici, sa liste de méthodes."),
        19: L("getAttributes() returns the #[Route] labels found on this method.", "getAttributes() renvoie les étiquettes #[Route] trouvées sur cette méthode."),
        20: L("newInstance() builds a real Route object from the label's arguments.", "newInstance() construit un vrai objet Route à partir des arguments de l'étiquette."),
        21: L("Now we know which path goes to which method.", "On sait maintenant quel chemin mène à quelle méthode."),
      },
    },
    {
      kind: "quiz",
      title: L("When is the attribute created?", "Quand l'attribut est-il créé ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n#[Attribute]\nclass Note\n{\n    public function __construct(public string $text) { echo "[made] "; }\n}\n\n#[Note("hello")]\nfunction f() { echo "f "; }\n\nf();\necho "| ";\n$attr = (new ReflectionFunction("f"))->getAttributes()[0];\necho $attr->getArguments()[0], " ";\necho $attr->newInstance()->text;\n`,
      options: ["[made] f | hello hello", "f | hello [made] hello", "f | [made] hello hello", "f | hello hello"],
      answer: 1,
      explain: L(
        "Attributes are lazy: calling `f()` never builds them, and `getArguments()` just reads the raw arguments. The constructor runs only when you call `newInstance()`.",
        "Les attributs sont paresseux : appeler `f()` ne les construit jamais, et `getArguments()` lit juste les arguments bruts. Le constructeur ne tourne que quand tu appelles `newInstance()`.",
      ),
    },
    {
      kind: "try",
      title: L("A validation rule", "Une règle de validation"),
      body: L(
        "`validate()` already reads `#[MaxLength]` attributes on properties. Put `#[MaxLength(10)]` on the `$username` property so the long username is reported.",
        "`validate()` lit déjà les attributs `#[MaxLength]` sur les propriétés. Mets `#[MaxLength(10)]` sur la propriété `$username` pour que le nom trop long soit signalé.",
      ),
      files: {
        "index.php": `<?php\n#[Attribute(Attribute::TARGET_PROPERTY)]\nclass MaxLength\n{\n    public function __construct(public int $max) {}\n}\n\nclass SignupForm\n{\n    public string $username = "";\n    public string $city = "";\n}\n\nfunction validate(object $form): array\n{\n    $errors = [];\n    foreach ((new ReflectionObject($form))->getProperties() as $property) {\n        foreach ($property->getAttributes(MaxLength::class) as $attribute) {\n            $rule = $attribute->newInstance();\n            if (strlen($property->getValue($form)) > $rule->max) {\n                $errors[] = $property->getName() . " is too long (max {$rule->max})";\n            }\n        }\n    }\n    return $errors;\n}\n\n$form = new SignupForm();\n$form->username = "a_very_long_username";\n$form->city = "Paris";\necho implode("\\n", validate($form)) ?: "Valid!";\n`,
      },
      solution: {
        "index.php": `<?php\n#[Attribute(Attribute::TARGET_PROPERTY)]\nclass MaxLength\n{\n    public function __construct(public int $max) {}\n}\n\nclass SignupForm\n{\n    #[MaxLength(10)]\n    public string $username = "";\n    public string $city = "";\n}\n\nfunction validate(object $form): array\n{\n    $errors = [];\n    foreach ((new ReflectionObject($form))->getProperties() as $property) {\n        foreach ($property->getAttributes(MaxLength::class) as $attribute) {\n            $rule = $attribute->newInstance();\n            if (strlen($property->getValue($form)) > $rule->max) {\n                $errors[] = $property->getName() . " is too long (max {$rule->max})";\n            }\n        }\n    }\n    return $errors;\n}\n\n$form = new SignupForm();\n$form->username = "a_very_long_username";\n$form->city = "Paris";\necho implode("\\n", validate($form)) ?: "Valid!";\n`,
      },
      objectives: [
        {
          id: "attr",
          label: L("Add #[MaxLength(10)] to $username", "Ajouter #[MaxLength(10)] à $username"),
          check: all(uses(/#\[\s*MaxLength\s*\(\s*10\s*\)\s*\]\s*public\s+string\s+\$username/), outputIs("username is too long (max 10)")),
          hints: [
            L("An attribute goes on the line right above what it describes.", "Un attribut se place sur la ligne juste au-dessus de ce qu'il décrit."),
            L("`#[MaxLength(10)]` above `public string $username = \"\";`", "`#[MaxLength(10)]` au-dessus de `public string $username = \"\";`"),
            L("Line 10 becomes `#[MaxLength(10)]`, followed by the $username property.", "La ligne 10 devient `#[MaxLength(10)]`, suivie de la propriété $username."),
          ],
        },
      ],
      cheat: "attributes",
    },
    {
      kind: "challenge",
      title: L("A tiny router", "Un mini routeur"),
      body: L(
        "Write `dispatch(string $path)`: look at every method of `SiteController`, find the one whose `#[Route]` path matches, call it and return its result. Unknown paths return `404 Not Found`.",
        "Écris `dispatch(string $path)` : parcours chaque méthode de `SiteController`, trouve celle dont le chemin `#[Route]` correspond, appelle-la et renvoie son résultat. Les chemins inconnus renvoient `404 Not Found`.",
      ),
      files: {
        "index.php": `<?php\n#[Attribute(Attribute::TARGET_METHOD)]\nclass Route\n{\n    public function __construct(public string $path) {}\n}\n\nclass SiteController\n{\n    #[Route("/")]\n    public function home(): string { return "Home page"; }\n\n    #[Route("/about")]\n    public function about(): string { return "About us"; }\n}\n\nfunction dispatch(string $path): string\n{\n    // Find the SiteController method whose #[Route] matches $path,\n    // call it, and return its result.\n    return "404 Not Found";\n}\n\necho dispatch("/") . "\\n";\necho dispatch("/about") . "\\n";\necho dispatch("/contact");\n`,
      },
      solution: {
        "index.php": `<?php\n#[Attribute(Attribute::TARGET_METHOD)]\nclass Route\n{\n    public function __construct(public string $path) {}\n}\n\nclass SiteController\n{\n    #[Route("/")]\n    public function home(): string { return "Home page"; }\n\n    #[Route("/about")]\n    public function about(): string { return "About us"; }\n}\n\nfunction dispatch(string $path): string\n{\n    $controller = new SiteController();\n    foreach ((new ReflectionClass($controller))->getMethods() as $method) {\n        foreach ($method->getAttributes(Route::class) as $attribute) {\n            if ($attribute->newInstance()->path === $path) {\n                return $method->invoke($controller);\n            }\n        }\n    }\n    return "404 Not Found";\n}\n\necho dispatch("/") . "\\n";\necho dispatch("/about") . "\\n";\necho dispatch("/contact");\n`,
      },
      probes: ["dispatch('/')", "dispatch('/about')", "dispatch('/nope')"],
      objectives: [
        {
          id: "home",
          label: L("dispatch('/') returns Home page", "dispatch('/') renvoie Home page"),
          check: all(uses(/getAttributes/), probeIs("dispatch('/')", "Home page")),
          hints: [
            L("Reflection gives you the methods; each method gives you its attributes.", "Reflection te donne les méthodes ; chaque méthode te donne ses attributs."),
            L("`(new ReflectionClass($controller))->getMethods()`, then `$method->getAttributes(Route::class)` and `->newInstance()->path`.", "`(new ReflectionClass($controller))->getMethods()`, puis `$method->getAttributes(Route::class)` et `->newInstance()->path`."),
            L("When the path matches: `return $method->invoke($controller);`", "Quand le chemin correspond : `return $method->invoke($controller);`"),
          ],
        },
        {
          id: "about",
          label: L("dispatch('/about') returns About us", "dispatch('/about') renvoie About us"),
          check: probeIs("dispatch('/about')", "About us"),
          hints: [
            L("Don't stop at the first method: check them all.", "Ne t'arrête pas à la première méthode : vérifie-les toutes."),
            L("Compare with `===`: \"/\" and \"/about\" are different strings.", "Compare avec `===` : \"/\" et \"/about\" sont des chaînes différentes."),
            L("`if ($attribute->newInstance()->path === $path) { return $method->invoke($controller); }`", "`if ($attribute->newInstance()->path === $path) { return $method->invoke($controller); }`"),
          ],
        },
        {
          id: "404",
          label: L("Unknown paths still return 404 Not Found", "Les chemins inconnus renvoient toujours 404 Not Found"),
          check: all(probeIs("dispatch('/nope')", "404 Not Found"), outputLines(["Home page", "About us", "404 Not Found"])),
          hints: [
            L("Keep the final `return \"404 Not Found\";` after the loops.", "Garde le `return \"404 Not Found\";` final après les boucles."),
            L("It's only reached when no route matched.", "On ne l'atteint que si aucune route n'a correspondu."),
            L("The three echo lines at the bottom show the result.", "Les trois lignes echo du bas montrent le résultat."),
          ],
        },
      ],
      cheat: "attributes",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`#[Name(args)]` attaches metadata to classes, methods, properties and parameters (PHP 8.0).", "`#[Name(args)]` attache des métadonnées aux classes, méthodes, propriétés et paramètres (PHP 8.0)."),
    L("Your own attribute is a class marked `#[Attribute]`.", "Ton propre attribut est une classe marquée `#[Attribute]`."),
    L("Reflection reads them: `getAttributes()`, then `newInstance()` (lazy).", "Reflection les lit : `getAttributes()`, puis `newInstance()` (paresseux)."),
    L("Built-ins: `#[\\SensitiveParameter]`, `#[\\Override]`, `#[\\Deprecated]`.", "D'origine : `#[\\SensitiveParameter]`, `#[\\Override]`, `#[\\Deprecated]`."),
  ],
};

export const functional: Lesson = {
  id: "functional",
  chapterId: CH,
  title: L("Functional PHP", "PHP fonctionnel"),
  tagline: L("First-class callables, pure functions and pipelines", "Callables de première classe, fonctions pures et pipelines"),
  xp: 60,
  syntax: ["strlen(...)", "Class::method(...)", "array_map", "array_filter", "fn() =>", "|>"],
  doc: "guide-modern",
  steps: [
    {
      kind: "discover",
      title: L("Functions as values", "Des fonctions comme valeurs"),
      body: [
        L(
          "In PHP you can pass a function to another function: `array_map` calls it on each item. For years, you named it with a string (`'strtoupper'`) or an array (`[$obj, 'method']`), which editors couldn't check.",
          "En PHP tu peux passer une fonction à une autre fonction : `array_map` l'appelle sur chaque élément. Pendant des années on la nommait avec une chaîne (`'strtoupper'`) ou un tableau (`[$obj, 'method']`), que les éditeurs ne pouvaient pas vérifier.",
        ),
        L(
          "Since PHP 8.1, the **first-class callable syntax** `strtoupper(...)` turns any function or method into a `Closure`: `$obj->method(...)`, `Text::shout(...)`. A typo is now an error right away, not a mystery later.",
          "Depuis PHP 8.1, la **syntaxe de callable de première classe** `strtoupper(...)` transforme n'importe quelle fonction ou méthode en `Closure` : `$obj->method(...)`, `Text::shout(...)`. Une faute de frappe est maintenant une erreur immédiate, pas un mystère plus tard.",
        ),
      ],
      example: {
        code: `<?php\nclass Text\n{\n    public static function shout(string $s): string\n    {\n        return strtoupper($s) . "!";\n    }\n}\n\n$words = ["hi", "php"];\n$upper = strtoupper(...);\n\nprint_r(array_map($upper, $words));\nprint_r(array_map(Text::shout(...), $words));\nvar_dump($upper instanceof Closure);\n`,
      },
    },
    {
      kind: "discover",
      title: L("Pure functions and pipelines", "Fonctions pures et pipelines"),
      body: [
        L(
          "A **pure function** only depends on its arguments and changes nothing outside: same input, same output, every time. They're easy to test and to combine.",
          "Une **fonction pure** ne dépend que de ses arguments et ne modifie rien à l'extérieur : même entrée, même sortie, à chaque fois. Elles sont faciles à tester et à combiner.",
        ),
        L(
          "Instead of a loop that mutates variables, chain small steps: `array_filter` keeps items, `array_map` transforms them, `array_sum` or `array_reduce` combines them. Each step returns a new array; the original is never modified.",
          "Au lieu d'une boucle qui modifie des variables, enchaîne de petites étapes : `array_filter` garde des éléments, `array_map` les transforme, `array_sum` ou `array_reduce` les combine. Chaque étape renvoie un nouveau tableau ; l'original n'est jamais modifié.",
        ),
      ],
      example: {
        code: `<?php\n$products = [\n    ["name" => "Pen", "price" => 2, "stock" => 10],\n    ["name" => "Lamp", "price" => 30, "stock" => 0],\n    ["name" => "Mug", "price" => 8, "stock" => 4],\n];\n\n$inStock = array_filter($products, fn(array $p): bool => $p["stock"] > 0);\n$names = array_map(fn(array $p): string => strtoupper($p["name"]), $inStock);\n$value = array_sum(array_map(fn(array $p) => $p["price"] * $p["stock"], $inStock));\n\necho implode(", ", $names), "\\n";\necho "Stock value: $value\\n";\necho count($products), " products, untouched";\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Order matters", "L'ordre compte"),
      question: L("`compose($f, $g)` returns a function that applies `$f` then `$g`. What does this print?", "`compose($f, $g)` renvoie une fonction qui applique `$f` puis `$g`. Qu'affiche ce code ?"),
      code: `<?php\n$double = fn(int $x): int => $x * 2;\n$inc = fn(int $x): int => $x + 1;\n$compose = fn(callable $f, callable $g) => fn($x) => $g($f($x));\n\necho $compose($double, $inc)(5), " ", $compose($inc, $double)(5);\n`,
      options: ["11 12", "12 11", "11 11", "10 12"],
      answer: 0,
      explain: L(
        "Double then +1: 5 → 10 → 11. +1 then double: 5 → 6 → 12. Composing functions builds new behaviour from small pieces, but the order changes the result.",
        "Doubler puis +1 : 5 → 10 → 11. +1 puis doubler : 5 → 6 → 12. Composer des fonctions crée un nouveau comportement à partir de petites pièces, mais l'ordre change le résultat.",
      ),
    },
    {
      kind: "discover",
      title: L("The pipe operator |>", "L'opérateur pipe |>"),
      body: [
        L(
          "Nested calls read inside out: `str_replace(\" \", \"-\", strtolower(trim($title)))`. PHP 8.5 adds the **pipe operator** `|>`: the value on the left is passed to the callable on the right, so the steps read top to bottom, in the order they happen.",
          "Les appels imbriqués se lisent de l'intérieur vers l'extérieur : `str_replace(\" \", \"-\", strtolower(trim($title)))`. PHP 8.5 ajoute l'**opérateur pipe** `|>` : la valeur à gauche est passée au callable à droite, donc les étapes se lisent de haut en bas, dans l'ordre où elles se produisent.",
        ),
        L(
          "Each step takes one argument. Use `func(...)` for existing functions, and wrap arrow functions in parentheses.",
          "Chaque étape prend un argument. Utilise `func(...)` pour les fonctions existantes, et entoure les fonctions fléchées de parenthèses.",
        ),
      ],
      example: {
        code: `<?php\n$title = "  Hello Modern PHP  ";\n\n$slug = $title\n    |> trim(...)\n    |> strtolower(...)\n    |> (fn(string $s): string => str_replace(" ", "-", $s));\n\necho $slug;\n`,
        version: "8.5",
      },
      callout: {
        tone: "version",
        text: L(
          "`|>` is new in PHP 8.5 (November 2025). On 8.4 and earlier this code is a parse error: use nested calls or temporary variables there.",
          "`|>` est nouveau dans PHP 8.5 (novembre 2025). En 8.4 et avant, ce code est une erreur de syntaxe : utilise des appels imbriqués ou des variables temporaires.",
        ),
      },
    },
    {
      kind: "compare",
      title: L("8.4 vs 8.5", "8.4 contre 8.5"),
      body: L("Run the same pipeline on PHP 8.4 and PHP 8.5.", "Exécute le même pipeline sur PHP 8.4 et PHP 8.5."),
      code: `<?php\necho "hello" |> strtoupper(...) |> strrev(...);\n`,
      versions: ["8.4", "8.5"],
      takeaway: L(
        "PHP 8.4 doesn't know `|>` and refuses the whole file with a ParseError. PHP 8.5 uppercases then reverses: `OLLEH`. New syntax needs the new version on every server where your code runs.",
        "PHP 8.4 ne connaît pas `|>` et refuse tout le fichier avec une ParseError. PHP 8.5 met en majuscules puis inverse : `OLLEH`. Une nouvelle syntaxe exige la nouvelle version sur chaque serveur où ton code tourne.",
      ),
    },
    {
      kind: "try",
      title: L("Use first-class callables", "Utilise les callables de première classe"),
      body: L(
        "Replace the two string callables (`'Text::shout'` and `'strrev'`) with the first-class callable syntax. The output must stay the same.",
        "Remplace les deux callables en chaîne (`'Text::shout'` et `'strrev'`) par la syntaxe de callable de première classe. La sortie doit rester la même.",
      ),
      files: {
        "index.php": `<?php\nclass Text\n{\n    public static function shout(string $s): string\n    {\n        return strtoupper($s) . "!";\n    }\n}\n\n$words = ["hello", "php"];\n$a = array_map('Text::shout', $words);\n$b = array_map('strrev', $words);\necho implode(" ", $a), "\\n", implode(" ", $b);\n`,
      },
      solution: {
        "index.php": `<?php\nclass Text\n{\n    public static function shout(string $s): string\n    {\n        return strtoupper($s) . "!";\n    }\n}\n\n$words = ["hello", "php"];\n$a = array_map(Text::shout(...), $words);\n$b = array_map(strrev(...), $words);\necho implode(" ", $a), "\\n", implode(" ", $b);\n`,
      },
      objectives: [
        {
          id: "callables",
          label: L("No string callables left", "Plus aucun callable en chaîne"),
          check: all(avoids(/array_map\(\s*['"]/), uses(/Text::shout\(\.\.\.\)/), uses(/strrev\(\.\.\.\)/)),
          hints: [
            L("Write the function as if you were calling it, with `...` as the only argument.", "Écris la fonction comme si tu l'appelais, avec `...` comme seul argument."),
            L("`'strrev'` becomes `strrev(...)`; a static method becomes `Class::method(...)`.", "`'strrev'` devient `strrev(...)` ; une méthode statique devient `Class::method(...)`."),
            L("`array_map(Text::shout(...), $words)` and `array_map(strrev(...), $words)`.", "`array_map(Text::shout(...), $words)` et `array_map(strrev(...), $words)`."),
          ],
        },
        {
          id: "output",
          label: L("Output unchanged", "Sortie inchangée"),
          check: all(clean, outputLines(["HELLO! PHP!", "olleh php"])),
          hints: [
            L("The behaviour is the same; only the way you name the function changed.", "Le comportement est le même ; seule la façon de nommer la fonction a changé."),
            L("Check for typos: a wrong name is now an immediate error.", "Vérifie les fautes de frappe : un mauvais nom est maintenant une erreur immédiate."),
            L("Run and compare with the expected two lines.", "Exécute et compare avec les deux lignes attendues."),
          ],
        },
      ],
      cheat: "closures",
    },
    {
      kind: "challenge",
      title: L("Make revenue() pure", "Rends revenue() pure"),
      body: L(
        "`revenue()` uses a global variable, so calling it twice gives a different answer. Rewrite it as a pure pipeline (array_filter + array_map + array_sum, no loop, no global) so both lines print `165.5`.",
        "`revenue()` utilise une variable globale, donc l'appeler deux fois donne une réponse différente. Réécris-la en pipeline pur (array_filter + array_map + array_sum, sans boucle ni global) pour que les deux lignes affichent `165.5`.",
      ),
      files: {
        "index.php": `<?php\n$orders = [\n    ["id" => 1, "paid" => true, "amount" => 120],\n    ["id" => 2, "paid" => false, "amount" => 30],\n    ["id" => 3, "paid" => true, "amount" => 45.5],\n];\n\n$total = 0;\n\nfunction revenue(array $orders): float\n{\n    global $total;\n    foreach ($orders as $order) {\n        if ($order["paid"]) {\n            $total += $order["amount"];\n        }\n    }\n    return $total;\n}\n\necho "Revenue: " . revenue($orders) . "\\n";\necho "Again: " . revenue($orders);\n`,
      },
      solution: {
        "index.php": `<?php\n$orders = [\n    ["id" => 1, "paid" => true, "amount" => 120],\n    ["id" => 2, "paid" => false, "amount" => 30],\n    ["id" => 3, "paid" => true, "amount" => 45.5],\n];\n\nfunction revenue(array $orders): float\n{\n    $paid = array_filter($orders, fn(array $o): bool => $o["paid"]);\n    return array_sum(array_map(fn(array $o) => $o["amount"], $paid));\n}\n\necho "Revenue: " . revenue($orders) . "\\n";\necho "Again: " . revenue($orders);\n`,
      },
      probes: ["revenue([['paid' => true, 'amount' => 10], ['paid' => false, 'amount' => 5]])"],
      objectives: [
        {
          id: "pure",
          label: L("No loop and no global", "Pas de boucle ni de global"),
          check: all(avoids(/\bforeach\b|\bfor\s*\(|\bwhile\b|\bglobal\b/), uses(/array_filter/)),
          hints: [
            L("Split the work: keep the paid orders, take their amounts, add them up.", "Découpe le travail : garde les commandes payées, prends leurs montants, additionne-les."),
            L("`array_filter($orders, fn(array $o): bool => $o[\"paid\"])` keeps the paid ones.", "`array_filter($orders, fn(array $o): bool => $o[\"paid\"])` garde les payées."),
            L("`return array_sum(array_map(fn(array $o) => $o[\"amount\"], $paid));`", "`return array_sum(array_map(fn(array $o) => $o[\"amount\"], $paid));`"),
          ],
        },
        {
          id: "same",
          label: L("Both lines print 165.5", "Les deux lignes affichent 165.5"),
          check: outputLines(["Revenue: 165.5", "Again: 165.5"]),
          hints: [
            L("A pure function gives the same answer every time it gets the same input.", "Une fonction pure donne la même réponse chaque fois qu'elle reçoit la même entrée."),
            L("Nothing should survive between two calls: no global, no static.", "Rien ne doit survivre entre deux appels : pas de global, pas de static."),
            L("With the pipeline version, both calls compute 120 + 45.5 from scratch.", "Avec la version pipeline, les deux appels calculent 120 + 45.5 depuis zéro."),
          ],
        },
        {
          id: "probe",
          label: L("revenue() works on any list of orders", "revenue() marche sur n'importe quelle liste de commandes"),
          check: probeShows("revenue([['paid' => true, 'amount' => 10], ['paid' => false, 'amount' => 5]])", "10.0"),
          hints: [
            L("Only use the `$orders` argument, never outside variables.", "N'utilise que l'argument `$orders`, jamais de variables extérieures."),
            L("Unpaid orders must be ignored.", "Les commandes non payées doivent être ignorées."),
            L("Keep the `: float` return type: 10 comes back as 10.0.", "Garde le type de retour `: float` : 10 revient sous la forme 10.0."),
          ],
        },
      ],
      cheat: "closures",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`func(...)`, `$obj->method(...)` and `Class::method(...)` make closures (PHP 8.1).", "`func(...)`, `$obj->method(...)` et `Class::method(...)` créent des closures (PHP 8.1)."),
    L("Pure functions: same input, same output, no side effects.", "Fonctions pures : même entrée, même sortie, sans effet de bord."),
    L("Pipelines of array_filter / array_map / array_sum replace mutating loops.", "Les pipelines array_filter / array_map / array_sum remplacent les boucles qui modifient."),
    L("PHP 8.5's `|>` reads transformations top to bottom.", "Le `|>` de PHP 8.5 lit les transformations de haut en bas."),
  ],
};

export const MODERN: Lesson[] = [namespaces, autoloading, generators, iterators, attributes, functional];
