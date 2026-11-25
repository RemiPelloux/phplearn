import { L } from "@/lib/txt";
import { all, definesClass, outputHas, outputIs, outputLines, probeIs, probeShows, probeThrows, uses } from "../checks";
import type { Lesson } from "../types";

const CH = "oop";

export const classesObjects: Lesson = {
  id: "classes-objects",
  chapterId: CH,
  title: L("Classes and objects", "Classes et objets"),
  tagline: L("Blueprints, new, properties, methods and $this", "Des plans, new, des propriétés, des méthodes et $this"),
  xp: 60,
  syntax: ["class", "new", "->", "$this", "public", "clone"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("A class is a blueprint", "Une classe est un plan"),
      body: [
        L(
          "So far your data lived in loose variables. Real programs model *things*: a user, a cart, a dog. A **class** is the blueprint of a thing, and an **object** is one thing built from it, like many houses built from one architect's plan.",
          "Jusqu'ici tes données vivaient dans des variables isolées. Les vrais programmes modélisent des *choses* : un utilisateur, un panier, un chien. Une **classe** est le plan d'une chose, et un **objet** est une chose construite à partir de ce plan, comme plusieurs maisons construites à partir du plan d'un architecte.",
        ),
        L(
          "A class groups **properties** (the data each object carries, like `$name`) and **methods** (functions the object can do, like `bark()`). `new Dog()` builds an object; the arrow `->` reaches inside it.",
          "Une classe regroupe des **propriétés** (les données que porte chaque objet, comme `$name`) et des **méthodes** (les fonctions que l'objet sait faire, comme `bark()`). `new Dog()` construit un objet ; la flèche `->` permet d'aller dedans.",
        ),
      ],
      scene: "class",
      example: {
        code: `<?php\nclass Dog\n{\n    public string $name = "Rex";\n    public int $age = 3;\n\n    public function bark(): string\n    {\n        return "{$this->name} says woof!";\n    }\n}\n\n$dog = new Dog();\necho $dog->bark(), "\\n";\n$dog->name = "Fido";\necho $dog->bark();\n`,
        caption: L("One blueprint, one object, two different names over time.", "Un plan, un objet, deux noms différents au fil du temps."),
      },
    },
    {
      kind: "discover",
      title: L("$this: the object talking about itself", "$this : l'objet qui parle de lui-même"),
      body: [
        L(
          "Inside a method, `$this` means \"the object this method was called on\". When you write `$a->increment()`, `$this` is `$a`; with `$b->increment()`, it's `$b`. That's how one method serves every object.",
          "Dans une méthode, `$this` veut dire « l'objet sur lequel on a appelé cette méthode ». Quand tu écris `$a->increment()`, `$this` c'est `$a` ; avec `$b->increment()`, c'est `$b`. C'est comme ça qu'une seule méthode sert tous les objets.",
        ),
        L(
          "Each object has its own copy of the properties: two counters count separately, just like two people each have their own age.",
          "Chaque objet a sa propre copie des propriétés : deux compteurs comptent séparément, comme deux personnes ont chacune leur âge.",
        ),
      ],
      example: {
        code: `<?php\nclass Counter\n{\n    public int $count = 0;\n\n    public function increment(): void\n    {\n        $this->count++;\n    }\n}\n\n$a = new Counter();\n$b = new Counter();\n$a->increment();\n$a->increment();\n$b->increment();\necho "a: $a->count, b: $b->count";\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "Property names have no `$` after the arrow: write `$this->count`, not `$this->$count`.",
          "Les noms de propriétés n'ont pas de `$` après la flèche : écris `$this->count`, pas `$this->$count`.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("Two lamps, one blueprint", "Deux lampes, un seul plan"),
      body: L(
        "Step through and watch the Variables panel: `$desk` and `$hall` are two separate objects. Calling `toggle()` on one only flips that one's `$on`.",
        "Avance pas à pas en regardant le panneau Variables : `$desk` et `$hall` sont deux objets distincts. Appeler `toggle()` sur l'un ne bascule que son propre `$on`.",
      ),
      code: `<?php\nclass Lamp\n{\n    public bool $on = false;\n\n    public function toggle(): void\n    {\n        $this->on = !$this->on;\n    }\n}\n\n$desk = new Lamp();\n$desk->toggle();\n$hall = new Lamp();\n$desk->toggle();\n$hall->toggle();\nvar_dump($desk->on, $hall->on);\n`,
      notes: {
        12: L("`new Lamp()` builds an object with `$on` set to false.", "`new Lamp()` construit un objet avec `$on` à false."),
        8: L("Inside `toggle()`, `$this` is whichever lamp the method was called on.", "Dans `toggle()`, `$this` est la lampe sur laquelle on a appelé la méthode."),
        14: L("A second, independent lamp: its `$on` starts at false.", "Une deuxième lampe, indépendante : son `$on` commence à false."),
        17: L("The desk lamp was toggled twice (off again), the hall lamp once (on).", "La lampe du bureau a basculé deux fois (de nouveau éteinte), celle du couloir une fois (allumée)."),
      },
    },
    {
      kind: "quiz",
      title: L("Same object or a copy?", "Même objet ou une copie ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Box { public int $n = 1; }\n$a = new Box();\n$b = $a;\n$b->n = 5;\necho $a->n;\n`,
      options: ["1", "5", "15", "Error"],
      answer: 1,
      explain: L(
        "`$b = $a` doesn't copy the object: both variables hold a handle to the **same** box. Changing it through `$b` changes what `$a` sees.",
        "`$b = $a` ne copie pas l'objet : les deux variables tiennent une poignée vers la **même** boîte. La modifier via `$b` change ce que voit `$a`.",
      ),
    },
    {
      kind: "discover",
      title: L("Objects are shared, clone makes a copy", "Les objets sont partagés, clone fait une copie"),
      body: [
        L(
          "A variable holding an object is like a house key: giving someone a copy of the key doesn't build a second house. Assigning or passing an object to a function shares the same object.",
          "Une variable qui contient un objet ressemble à une clé de maison : donner un double de la clé ne construit pas une deuxième maison. Affecter ou passer un objet à une fonction partage le même objet.",
        ),
        L(
          "When you really want an independent copy, use `clone`. Arrays and strings behave differently: they are copied when assigned.",
          "Quand tu veux vraiment une copie indépendante, utilise `clone`. Les tableaux et les chaînes se comportent autrement : ils sont copiés à l'affectation.",
        ),
      ],
      example: {
        code: `<?php\nclass Note\n{\n    public string $text = "draft";\n}\n\nfunction publish(Note $note): void\n{\n    $note->text = "published";\n}\n\n$original = new Note();\n$copy = clone $original;\npublish($original);\necho "original: $original->text\\n";\necho "copy: $copy->text";\n`,
        caption: L("The function changed the object it received: no copy was made.", "La fonction a modifié l'objet reçu : aucune copie n'a été faite."),
      },
    },
    {
      kind: "try",
      title: L("Give a rectangle an area", "Donne une aire à un rectangle"),
      body: L(
        "The script calls `$r->area()`, but the method doesn't exist yet. Add a method `area(): int` that returns the width times the height, using `$this`.",
        "Le script appelle `$r->area()`, mais la méthode n'existe pas encore. Ajoute une méthode `area(): int` qui renvoie la largeur fois la hauteur, avec `$this`.",
      ),
      files: {
        "index.php": `<?php\nclass Rectangle\n{\n    public int $width = 0;\n    public int $height = 0;\n\n    // Add a method area() that returns width × height\n}\n\n$r = new Rectangle();\n$r->width = 4;\n$r->height = 5;\necho $r->area();\n`,
      },
      solution: {
        "index.php": `<?php\nclass Rectangle\n{\n    public int $width = 0;\n    public int $height = 0;\n\n    public function area(): int\n    {\n        return $this->width * $this->height;\n    }\n}\n\n$r = new Rectangle();\n$r->width = 4;\n$r->height = 5;\necho $r->area();\n`,
      },
      probes: ["(function () { $r = new Rectangle(); $r->width = 7; $r->height = 3; return $r->area(); })()"],
      objectives: [
        {
          id: "area",
          label: L("area() returns width × height (prints 20)", "area() renvoie largeur × hauteur (affiche 20)"),
          check: all(outputIs("20"), probeIs("(function () { $r = new Rectangle(); $r->width = 7; $r->height = 3; return $r->area(); })()", 21)),
          hints: [
            L("A method is a function written inside the class. It reads the object's own properties through `$this`.", "Une méthode est une fonction écrite dans la classe. Elle lit les propriétés de son objet via `$this`."),
            L("`public function area(): int { return $this->width * $this->height; }`", "`public function area(): int { return $this->width * $this->height; }`"),
            L(
              "Replace the comment on line 7 with the method from the previous hint, then press Run.",
              "Remplace le commentaire ligne 7 par la méthode de l'indice précédent, puis appuie sur Exécuter.",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("Keep score", "Compte les points"),
      body: L(
        "Complete the `Player` class: a `$score` property starting at 0, a method `addPoints(int $points): void` that adds to it, and a method `summary(): string` that returns the name and score, like `Ada: 30 points`.",
        "Complète la classe `Player` : une propriété `$score` qui commence à 0, une méthode `addPoints(int $points): void` qui l'augmente, et une méthode `summary(): string` qui renvoie le nom et le score, comme `Ada: 30 points`.",
      ),
      files: {
        "index.php": `<?php\nclass Player\n{\n    public string $name = "";\n    // 1. Add a public int $score that starts at 0\n    // 2. Add addPoints(int $points): void\n    // 3. Add summary(): string that returns "Name: N points"\n}\n\n$ada = new Player();\n$ada->name = "Ada";\n$ada->addPoints(20);\n$ada->addPoints(10);\necho $ada->summary();\n`,
      },
      solution: {
        "index.php": `<?php\nclass Player\n{\n    public string $name = "";\n    public int $score = 0;\n\n    public function addPoints(int $points): void\n    {\n        $this->score += $points;\n    }\n\n    public function summary(): string\n    {\n        return "{$this->name}: {$this->score} points";\n    }\n}\n\n$ada = new Player();\n$ada->name = "Ada";\n$ada->addPoints(20);\n$ada->addPoints(10);\necho $ada->summary();\n`,
      },
      probes: [
        "(function () { $p = new Player(); $p->name = 'Zoe'; $p->addPoints(10); $p->addPoints(5); return $p->score; })()",
        "(function () { $p = new Player(); $p->name = 'Zoe'; $p->addPoints(10); $p->addPoints(5); return $p->summary(); })()",
      ],
      objectives: [
        {
          id: "score",
          label: L("addPoints() adds to a score that starts at 0", "addPoints() augmente un score qui commence à 0"),
          check: probeIs("(function () { $p = new Player(); $p->name = 'Zoe'; $p->addPoints(10); $p->addPoints(5); return $p->score; })()", 15),
          hints: [
            L("The score belongs to each player: it's a property, and the method changes it through `$this`.", "Le score appartient à chaque joueur : c'est une propriété, et la méthode la modifie via `$this`."),
            L("`public int $score = 0;` and inside the method `$this->score += $points;`", "`public int $score = 0;` et dans la méthode `$this->score += $points;`"),
            L(
              "Add `public int $score = 0;` then `public function addPoints(int $points): void { $this->score += $points; }`.",
              "Ajoute `public int $score = 0;` puis `public function addPoints(int $points): void { $this->score += $points; }`.",
            ),
          ],
        },
        {
          id: "summary",
          label: L("summary() returns \"Name: N points\"", "summary() renvoie « Nom: N points »"),
          check: all(
            probeIs("(function () { $p = new Player(); $p->name = 'Zoe'; $p->addPoints(10); $p->addPoints(5); return $p->summary(); })()", "Zoe: 15 points"),
            outputIs("Ada: 30 points"),
          ),
          hints: [
            L("The method returns a string built from two properties of `$this`.", "La méthode renvoie une chaîne construite à partir de deux propriétés de `$this`."),
            L("Use braces to interpolate properties: `\"{$this->name}: …\"`.", "Utilise des accolades pour interpoler les propriétés : `\"{$this->name}: …\"`."),
            L(
              "`public function summary(): string { return \"{$this->name}: {$this->score} points\"; }`",
              "`public function summary(): string { return \"{$this->name}: {$this->score} points\"; }`",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("A class is a blueprint; `new` builds objects from it.", "Une classe est un plan ; `new` construit des objets à partir de lui."),
    L("Properties hold each object's data; methods are its functions. `->` reaches inside.", "Les propriétés portent les données de chaque objet ; les méthodes sont ses fonctions. `->` permet d'y accéder."),
    L("`$this` is the object the method was called on.", "`$this` est l'objet sur lequel la méthode a été appelée."),
    L("Assigning an object shares it; `clone` makes an independent copy.", "Affecter un objet le partage ; `clone` en fait une copie indépendante."),
  ],
};

export const constructors: Lesson = {
  id: "constructors",
  chapterId: CH,
  title: L("Constructors", "Les constructeurs"),
  tagline: L("Build objects ready to use, with property promotion", "Construis des objets prêts à l'emploi, avec la promotion de propriétés"),
  xp: 60,
  syntax: ["__construct", "new X(...)", "public int $x", "named arguments"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Objects that start complete", "Des objets complets dès le départ"),
      body: [
        L(
          "Creating an object and then setting each property by hand is easy to forget: a user without an email, a product without a price. A **constructor** is a special method, `__construct`, that PHP runs automatically inside `new`.",
          "Créer un objet puis remplir chaque propriété à la main, c'est facile à oublier : un utilisateur sans email, un produit sans prix. Un **constructeur** est une méthode spéciale, `__construct`, que PHP exécute automatiquement pendant `new`.",
        ),
        L(
          "Think of ordering at a counter: you can't get your coffee without saying which one. The arguments of `new User(\"Ada\", \"ada@example.com\")` go straight to the constructor, so the object is valid from its first line of life.",
          "Pense à une commande au comptoir : tu n'auras pas ton café sans dire lequel. Les arguments de `new User(\"Ada\", \"ada@example.com\")` vont directement au constructeur, donc l'objet est valide dès sa première ligne de vie.",
        ),
      ],
      example: {
        code: `<?php\nclass User\n{\n    public string $name;\n    public string $email;\n\n    public function __construct(string $name, string $email)\n    {\n        $this->name = $name;\n        $this->email = $email;\n    }\n}\n\n$u = new User("Ada", "ada@example.com");\necho $u->name, " <", $u->email, ">";\n`,
      },
    },
    {
      kind: "discover",
      title: L("Constructor property promotion", "La promotion de propriétés"),
      body: [
        L(
          "The classic constructor repeats each property three times: declared, as a parameter, then assigned. Since PHP 8.0, put a visibility (`public`, `private`…) in front of a parameter and PHP declares and fills the property for you. This is **constructor promotion**.",
          "Le constructeur classique répète chaque propriété trois fois : déclarée, en paramètre, puis affectée. Depuis PHP 8.0, mets une visibilité (`public`, `private`…) devant un paramètre et PHP déclare et remplit la propriété pour toi. C'est la **promotion de propriétés**.",
        ),
        L(
          "Parameters can have default values, and you can pass arguments by name (`new Product(price: 3)`), also since PHP 8.0.",
          "Les paramètres peuvent avoir des valeurs par défaut, et tu peux passer les arguments par leur nom (`new Product(price: 3)`), aussi depuis PHP 8.0.",
        ),
      ],
      example: {
        code: `<?php\nclass Product\n{\n    public function __construct(\n        public string $name,\n        public float $price = 0.0,\n        public int $stock = 0,\n    ) {}\n}\n\n$mug = new Product("Mug", 9.5, 12);\n$pen = new Product(name: "Pen", stock: 40);\necho "$mug->name: $mug->price € ($mug->stock left)\\n";\necho "$pen->name: $pen->price € ($pen->stock left)";\n`,
        caption: L("The empty body `{}` is normal: promotion did all the work.", "Le corps vide `{}` est normal : la promotion a tout fait."),
      },
      callout: {
        tone: "version",
        text: L(
          "Promotion and named arguments arrived in PHP 8.0. On PHP 7.4 you must write the long form from the previous step.",
          "La promotion et les arguments nommés sont arrivés avec PHP 8.0. En PHP 7.4, il faut écrire la forme longue de l'étape précédente.",
        ),
      },
    },
    {
      kind: "compare",
      title: L("Promotion on PHP 7.4 vs 8.0", "La promotion en PHP 7.4 et en 8.0"),
      body: L(
        "Run the same promoted constructor on two versions. PHP 7.4 doesn't understand a visibility inside the parameter list.",
        "Exécute le même constructeur promu sur deux versions. PHP 7.4 ne comprend pas une visibilité dans la liste des paramètres.",
      ),
      code: `<?php\nclass Point\n{\n    public function __construct(public int $x, public int $y) {}\n}\n\n$p = new Point(3, 4);\necho "($p->x, $p->y)";\n`,
      versions: ["7.4", "8.0"],
      takeaway: L(
        "7.4 stops with a Parse error before running a single line; 8.0 prints (3, 4). New syntax always needs the version that introduced it.",
        "La 7.4 s'arrête sur une Parse error avant d'exécuter la moindre ligne ; la 8.0 affiche (3, 4). Une nouvelle syntaxe exige toujours la version qui l'a introduite.",
      ),
    },
    {
      kind: "watch",
      title: L("Follow new into the constructor", "Suis new jusque dans le constructeur"),
      body: L(
        "Watch `new Point(2, 3)` fill the object, then a method change it. In the Variables panel, `$p` shows its properties.",
        "Regarde `new Point(2, 3)` remplir l'objet, puis une méthode le modifier. Dans le panneau Variables, `$p` montre ses propriétés.",
      ),
      code: `<?php\nclass Point\n{\n    public function __construct(\n        public int $x = 0,\n        public int $y = 0,\n    ) {\n    }\n\n    public function move(int $dx, int $dy): void\n    {\n        $this->x += $dx;\n        $this->y += $dy;\n    }\n}\n\n$p = new Point(2, 3);\n$p->move(1, -1);\necho "($p->x, $p->y)";\n`,
      notes: {
        17: L("`new` runs the constructor: promotion stores 2 and 3 in `$x` and `$y`.", "`new` exécute le constructeur : la promotion range 2 et 3 dans `$x` et `$y`."),
        12: L("Inside `move()`, `$dx` and `$dy` are arguments; `$this->x` is the object's property.", "Dans `move()`, `$dx` et `$dy` sont des arguments ; `$this->x` est la propriété de l'objet."),
        19: L("The object remembers its new position: (3, 2).", "L'objet se souvient de sa nouvelle position : (3, 2)."),
      },
    },
    {
      kind: "quiz",
      title: L("Defaults and names", "Valeurs par défaut et noms"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Greeting\n{\n    public function __construct(public string $word = "Hello", public string $who = "world") {}\n\n    public function say(): string\n    {\n        return "$this->word, $this->who!";\n    }\n}\n\necho (new Greeting(who: "PHP"))->say();\n`,
      options: ["Hello, world!", "Hello, PHP!", "PHP, world!", "Error"],
      answer: 1,
      explain: L(
        "The named argument `who:` skips `$word`, which keeps its default \"Hello\". Only `$who` changes.",
        "L'argument nommé `who:` saute `$word`, qui garde sa valeur par défaut « Hello ». Seul `$who` change.",
      ),
    },
    {
      kind: "try",
      title: L("Write a constructor", "Écris un constructeur"),
      body: L(
        "`new Book(\"1984\", \"Orwell\", 328)` passes three values, but nothing stores them: PHP complains that a typed property is read before being set. Add a constructor that fills `$title`, `$author` and `$pages` (long form or promotion, your choice).",
        "`new Book(\"1984\", \"Orwell\", 328)` passe trois valeurs, mais rien ne les range : PHP se plaint qu'une propriété typée est lue avant d'être remplie. Ajoute un constructeur qui remplit `$title`, `$author` et `$pages` (forme longue ou promotion, au choix).",
      ),
      files: {
        "index.php": `<?php\nclass Book\n{\n    public string $title;\n    public string $author;\n    public int $pages;\n\n    // Add a constructor that fills the three properties\n}\n\n$book = new Book("1984", "Orwell", 328);\necho "$book->title by $book->author, $book->pages pages";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Book\n{\n    public string $title;\n    public string $author;\n    public int $pages;\n\n    public function __construct(string $title, string $author, int $pages)\n    {\n        $this->title = $title;\n        $this->author = $author;\n        $this->pages = $pages;\n    }\n}\n\n$book = new Book("1984", "Orwell", 328);\necho "$book->title by $book->author, $book->pages pages";\n`,
      },
      probes: ["(new Book('Dune', 'Herbert', 412))->pages"],
      objectives: [
        {
          id: "ctor",
          label: L("Print: 1984 by Orwell, 328 pages", "Afficher : 1984 by Orwell, 328 pages"),
          check: all(outputIs("1984 by Orwell, 328 pages"), probeIs("(new Book('Dune', 'Herbert', 412))->pages", 412), uses(/__construct/)),
          hints: [
            L("The constructor receives the three arguments in the same order as `new Book(...)`.", "Le constructeur reçoit les trois arguments dans le même ordre que `new Book(...)`."),
            L("`public function __construct(string $title, string $author, int $pages)` then `$this->title = $title;` and so on.", "`public function __construct(string $title, string $author, int $pages)` puis `$this->title = $title;` et ainsi de suite."),
            L(
              "Replace the comment with the constructor and three assignments: `$this->title = $title; $this->author = $author; $this->pages = $pages;`",
              "Remplace le commentaire par le constructeur et trois affectations : `$this->title = $title; $this->author = $author; $this->pages = $pages;`",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("A temperature object", "Un objet température"),
      body: L(
        "Write the `Temperature` class with a **promoted** `public float $celsius` in its constructor, a method `toFahrenheit(): float` (celsius × 9 / 5 + 32), and a method `isFreezing(): bool` that is true at 0 °C or below.",
        "Écris la classe `Temperature` avec une propriété `public float $celsius` **promue** dans son constructeur, une méthode `toFahrenheit(): float` (celsius × 9 / 5 + 32), et une méthode `isFreezing(): bool` vraie à 0 °C ou moins.",
      ),
      files: {
        "index.php": `<?php\nclass Temperature\n{\n    // Promote a public float $celsius in the constructor\n\n    // toFahrenheit(): celsius × 9 / 5 + 32\n\n    // isFreezing(): true when celsius is 0 or below\n}\n\n$t = new Temperature(100);\necho "Water boils at " . $t->toFahrenheit() . " °F";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Temperature\n{\n    public function __construct(public float $celsius) {}\n\n    public function toFahrenheit(): float\n    {\n        return $this->celsius * 9 / 5 + 32;\n    }\n\n    public function isFreezing(): bool\n    {\n        return $this->celsius <= 0;\n    }\n}\n\n$t = new Temperature(100);\necho "Water boils at " . $t->toFahrenheit() . " °F";\n`,
      },
      probes: ["(new Temperature(100))->toFahrenheit()", "(new Temperature(-40))->toFahrenheit()", "[(new Temperature(-5))->isFreezing(), (new Temperature(0))->isFreezing(), (new Temperature(12))->isFreezing()]"],
      objectives: [
        {
          id: "promoted",
          label: L("The constructor promotes $celsius", "Le constructeur promeut $celsius"),
          check: uses(/__construct\s*\(\s*(public|private|protected|readonly)\b/),
          hints: [
            L("Promotion means writing the visibility inside the constructor's parentheses.", "La promotion, c'est écrire la visibilité dans les parenthèses du constructeur."),
            L("`public function __construct(public float $celsius) {}`", "`public function __construct(public float $celsius) {}`"),
            L("Replace the first comment with `public function __construct(public float $celsius) {}`.", "Remplace le premier commentaire par `public function __construct(public float $celsius) {}`."),
          ],
        },
        {
          id: "fahrenheit",
          label: L("toFahrenheit() converts (100 °C → 212.0)", "toFahrenheit() convertit (100 °C → 212.0)"),
          check: all(probeShows("(new Temperature(100))->toFahrenheit()", "212.0"), probeShows("(new Temperature(-40))->toFahrenheit()", "-40.0")),
          hints: [
            L("Read the temperature through `$this->celsius` and return the formula.", "Lis la température via `$this->celsius` et renvoie la formule."),
            L("`return $this->celsius * 9 / 5 + 32;`", "`return $this->celsius * 9 / 5 + 32;`"),
            L(
              "`public function toFahrenheit(): float { return $this->celsius * 9 / 5 + 32; }`",
              "`public function toFahrenheit(): float { return $this->celsius * 9 / 5 + 32; }`",
            ),
          ],
        },
        {
          id: "freezing",
          label: L("isFreezing() is true at 0 °C or below", "isFreezing() est vraie à 0 °C ou moins"),
          check: probeIs("[(new Temperature(-5))->isFreezing(), (new Temperature(0))->isFreezing(), (new Temperature(12))->isFreezing()]", [true, true, false]),
          hints: [
            L("A comparison already gives a bool: you can return it directly.", "Une comparaison donne déjà un booléen : tu peux la renvoyer directement."),
            L("\"0 or below\" is `<= 0`.", "« 0 ou moins » s'écrit `<= 0`."),
            L("`public function isFreezing(): bool { return $this->celsius <= 0; }`", "`public function isFreezing(): bool { return $this->celsius <= 0; }`"),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`__construct` runs automatically inside `new`: objects start complete.", "`__construct` s'exécute automatiquement pendant `new` : les objets démarrent complets."),
    L("Promotion (PHP 8.0) declares and fills properties from constructor parameters.", "La promotion (PHP 8.0) déclare et remplit les propriétés à partir des paramètres du constructeur."),
    L("Parameters can have defaults, and arguments can be passed by name.", "Les paramètres peuvent avoir des valeurs par défaut, et les arguments se passer par leur nom."),
  ],
};

export const encapsulation: Lesson = {
  id: "encapsulation",
  chapterId: CH,
  title: L("Encapsulation", "L'encapsulation"),
  tagline: L("public, private, protected: protect your object's rules", "public, private, protected : protège les règles de ton objet"),
  xp: 60,
  syntax: ["public", "private", "protected", "getter", "throw new InvalidArgumentException"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Not everything should be touchable", "Tout ne doit pas être modifiable"),
      body: [
        L(
          "A cash machine gives you buttons, not the key to its money drawer. Objects work the same way: **visibility** decides who can touch a property or call a method.",
          "Un distributeur de billets te donne des boutons, pas la clé de son tiroir à billets. Les objets marchent pareil : la **visibilité** décide qui peut toucher une propriété ou appeler une méthode.",
        ),
        L(
          "`public` is open to everyone, `private` only to the class's own methods, and `protected` to the class and its children (you'll meet those in the next lesson). Hiding data behind methods is called **encapsulation**.",
          "`public` est ouvert à tous, `private` seulement aux méthodes de la classe, et `protected` à la classe et à ses enfants (tu les verras à la leçon suivante). Cacher les données derrière des méthodes s'appelle l'**encapsulation**.",
        ),
      ],
      scene: "class",
      example: {
        code: `<?php\nclass BankCard\n{\n    public string $holder = "Ada";\n    private string $pin = "1234";\n\n    public function checkPin(string $guess): bool\n    {\n        return $guess === $this->pin;\n    }\n}\n\n$card = new BankCard();\necho $card->holder, "\\n";\nvar_dump($card->checkPin("0000"));\necho $card->pin;\n`,
        caption: L("The last line is refused: look at the Problems tab.", "La dernière ligne est refusée : regarde l'onglet Problèmes."),
      },
    },
    {
      kind: "discover",
      title: L("Guard your rules", "Protège tes règles"),
      body: [
        L(
          "Why bother? Because an object can then **refuse invalid states**. If an age must be between 0 and 150, check it once in the constructor and nobody can create a broken age later.",
          "Pourquoi s'embêter ? Parce qu'un objet peut alors **refuser les états invalides**. Si un âge doit être entre 0 et 150, vérifie-le une fois dans le constructeur et personne ne pourra créer un âge cassé ensuite.",
        ),
        L(
          "To refuse, `throw` an exception: it stops the code right there. Others read the value through a **getter**, a small public method that returns the private property.",
          "Pour refuser, lance (`throw`) une exception : elle arrête le code net. Les autres lisent la valeur via un **getter**, une petite méthode publique qui renvoie la propriété privée.",
        ),
      ],
      example: {
        code: `<?php\nclass Age\n{\n    private int $value;\n\n    public function __construct(int $value)\n    {\n        if ($value < 0 || $value > 150) {\n            throw new InvalidArgumentException("Age must be between 0 and 150, got $value");\n        }\n        $this->value = $value;\n    }\n\n    public function value(): int\n    {\n        return $this->value;\n    }\n}\n\n$a = new Age(30);\necho $a->value(), "\\n";\n$b = new Age(-4);\necho "never printed";\n`,
      },
      callout: {
        tone: "info",
        text: L(
          "Exceptions get a whole lesson in chapter 7 (catching them with try/catch). For now: `throw` means \"stop, this is not allowed\".",
          "Les exceptions ont leur propre leçon au chapitre 7 (les attraper avec try/catch). Pour l'instant : `throw` veut dire « stop, ce n'est pas permis ».",
        ),
      },
    },
    {
      kind: "watch",
      title: L("A thermostat that keeps its limits", "Un thermostat qui garde ses limites"),
      body: L(
        "`$target` is private, so the only way in is `setTarget()`, which clamps the value between 10 and 30. In the Variables panel, a `-` before a property name means private.",
        "`$target` est privée, donc le seul accès est `setTarget()`, qui limite la valeur entre 10 et 30. Dans le panneau Variables, un `-` devant un nom de propriété veut dire private.",
      ),
      code: `<?php\nclass Thermostat\n{\n    private int $target = 20;\n\n    public function setTarget(int $degrees): void\n    {\n        $degrees = max(10, min(30, $degrees));\n        $this->target = $degrees;\n    }\n\n    public function target(): int\n    {\n        return $this->target;\n    }\n}\n\n$t = new Thermostat();\n$t->setTarget(25);\n$t->setTarget(99);\necho $t->target();\n`,
      notes: {
        18: L("A new thermostat starts at 20.", "Un nouveau thermostat commence à 20."),
        8: L("The method enforces the rule: anything above 30 becomes 30.", "La méthode applique la règle : tout ce qui dépasse 30 devient 30."),
        20: L("Asking for 99 degrees: the object says no, politely.", "On demande 99 degrés : l'objet refuse, poliment."),
        21: L("Read through the getter: 30, never 99.", "Lecture via le getter : 30, jamais 99."),
      },
    },
    {
      kind: "quiz",
      title: L("What gets out?", "Qu'est-ce qui sort ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Secret\n{\n    private string $code = "1234";\n\n    public function hint(): string\n    {\n        return substr($this->code, 0, 2) . "**";\n    }\n}\n\n$s = new Secret();\necho $s->hint();\n`,
      options: ["1234", "12**", "**34", "Error"],
      answer: 1,
      explain: L(
        "A public method can read a private property of its own object, and decide what to reveal: here, only the first two digits.",
        "Une méthode publique peut lire une propriété privée de son propre objet, et décider de ce qu'elle révèle : ici, seulement les deux premiers chiffres.",
      ),
    },
    {
      kind: "try",
      title: L("Lock the wallet", "Verrouille le portefeuille"),
      body: L(
        "Anyone can write `$w->balance = -500` today. Make `$balance` **private**, add a getter `balance(): int`, and use it in the last line.",
        "Aujourd'hui, n'importe qui peut écrire `$w->balance = -500`. Rends `$balance` **privée**, ajoute un getter `balance(): int`, et utilise-le à la dernière ligne.",
      ),
      files: {
        "index.php": `<?php\nclass Wallet\n{\n    public int $balance = 0;\n\n    public function add(int $amount): void\n    {\n        $this->balance += $amount;\n    }\n\n    // Add a balance() method that returns the balance\n}\n\n$w = new Wallet();\n$w->add(50);\n$w->add(25);\necho $w->balance;\n`,
      },
      solution: {
        "index.php": `<?php\nclass Wallet\n{\n    private int $balance = 0;\n\n    public function add(int $amount): void\n    {\n        $this->balance += $amount;\n    }\n\n    public function balance(): int\n    {\n        return $this->balance;\n    }\n}\n\n$w = new Wallet();\n$w->add(50);\n$w->add(25);\necho $w->balance();\n`,
      },
      probes: ["(new ReflectionProperty('Wallet', 'balance'))->isPrivate()", "(function () { $w = new Wallet(); $w->add(30); return $w->balance(); })()"],
      objectives: [
        {
          id: "private",
          label: L("$balance is private", "$balance est privée"),
          check: probeIs("(new ReflectionProperty('Wallet', 'balance'))->isPrivate()", true),
          hints: [
            L("Change the word in front of the property.", "Change le mot devant la propriété."),
            L("`private int $balance = 0;`", "`private int $balance = 0;`"),
            L("On line 4, replace `public` with `private`.", "Ligne 4, remplace `public` par `private`."),
          ],
        },
        {
          id: "getter",
          label: L("A balance() getter, used to print 75", "Un getter balance(), utilisé pour afficher 75"),
          check: all(probeIs("(function () { $w = new Wallet(); $w->add(30); return $w->balance(); })()", 30), outputIs("75")),
          hints: [
            L("Once private, `$w->balance` is refused from outside: read it through a method.", "Une fois privée, `$w->balance` est refusée depuis l'extérieur : lis-la via une méthode."),
            L("`public function balance(): int { return $this->balance; }` and `echo $w->balance();`", "`public function balance(): int { return $this->balance; }` et `echo $w->balance();`"),
            L(
              "Replace the comment with the getter, and add `()` on the last line so it calls the method.",
              "Remplace le commentaire par le getter, et ajoute `()` à la dernière ligne pour appeler la méthode.",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("A stock that can't go negative", "Un stock qui ne peut pas être négatif"),
      body: L(
        "Protect the `Stock` class: make `$quantity` private with a getter `quantity(): int`; the constructor throws an `InvalidArgumentException` for a negative quantity; `remove()` throws a `RuntimeException` when you remove more than what's left.",
        "Protège la classe `Stock` : rends `$quantity` privée avec un getter `quantity(): int` ; le constructeur lance une `InvalidArgumentException` pour une quantité négative ; `remove()` lance une `RuntimeException` quand on retire plus que ce qui reste.",
      ),
      files: {
        "index.php": `<?php\nclass Stock\n{\n    public int $quantity;\n\n    public function __construct(int $quantity)\n    {\n        $this->quantity = $quantity;\n    }\n\n    public function remove(int $count): void\n    {\n        $this->quantity -= $count;\n    }\n}\n\n$apples = new Stock(10);\n$apples->remove(4);\necho $apples->quantity;\n`,
      },
      solution: {
        "index.php": `<?php\nclass Stock\n{\n    private int $quantity;\n\n    public function __construct(int $quantity)\n    {\n        if ($quantity < 0) {\n            throw new InvalidArgumentException("Quantity can't be negative, got $quantity");\n        }\n        $this->quantity = $quantity;\n    }\n\n    public function remove(int $count): void\n    {\n        if ($count > $this->quantity) {\n            throw new RuntimeException("Only {$this->quantity} left, can't remove $count");\n        }\n        $this->quantity -= $count;\n    }\n\n    public function quantity(): int\n    {\n        return $this->quantity;\n    }\n}\n\n$apples = new Stock(10);\n$apples->remove(4);\necho $apples->quantity();\n`,
      },
      probes: [
        "(new ReflectionProperty('Stock', 'quantity'))->isPrivate()",
        "(function () { $s = new Stock(10); $s->remove(4); return $s->quantity(); })()",
        "new Stock(-1)",
        "(new Stock(3))->remove(4)",
      ],
      objectives: [
        {
          id: "private",
          label: L("$quantity is private, read with quantity()", "$quantity est privée, lue avec quantity()"),
          check: all(probeIs("(new ReflectionProperty('Stock', 'quantity'))->isPrivate()", true), probeIs("(function () { $s = new Stock(10); $s->remove(4); return $s->quantity(); })()", 6)),
          hints: [
            L("Same recipe as the wallet: private property, public getter.", "Même recette que le portefeuille : propriété privée, getter public."),
            L("`private int $quantity;` and `public function quantity(): int { return $this->quantity; }`", "`private int $quantity;` et `public function quantity(): int { return $this->quantity; }`"),
            L("Change `public` to `private` on line 4, add the getter, and print `$apples->quantity()`.", "Change `public` en `private` ligne 4, ajoute le getter, et affiche `$apples->quantity()`."),
          ],
        },
        {
          id: "negative",
          label: L("new Stock(-1) throws an InvalidArgumentException", "new Stock(-1) lance une InvalidArgumentException"),
          check: probeThrows("new Stock(-1)", "InvalidArgumentException"),
          hints: [
            L("Check the value at the very start of the constructor, before storing it.", "Vérifie la valeur au tout début du constructeur, avant de la ranger."),
            L("`if ($quantity < 0) { throw new InvalidArgumentException(\"…\"); }`", "`if ($quantity < 0) { throw new InvalidArgumentException(\"…\"); }`"),
            L(
              "First line of the constructor: `if ($quantity < 0) { throw new InvalidArgumentException(\"Quantity can't be negative\"); }`",
              "Première ligne du constructeur : `if ($quantity < 0) { throw new InvalidArgumentException(\"Quantity can't be negative\"); }`",
            ),
          ],
        },
        {
          id: "too-many",
          label: L("Removing too much throws a RuntimeException", "Retirer trop lance une RuntimeException"),
          check: probeThrows("(new Stock(3))->remove(4)", "RuntimeException"),
          hints: [
            L("In `remove()`, compare the request with what's left before subtracting.", "Dans `remove()`, compare la demande avec ce qui reste avant de soustraire."),
            L("`if ($count > $this->quantity) { throw new RuntimeException(\"…\"); }`", "`if ($count > $this->quantity) { throw new RuntimeException(\"…\"); }`"),
            L(
              "Add `if ($count > $this->quantity) { throw new RuntimeException(\"Not enough left\"); }` as the first line of `remove()`.",
              "Ajoute `if ($count > $this->quantity) { throw new RuntimeException(\"Not enough left\"); }` en première ligne de `remove()`.",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`public` is open to all, `private` to the class only, `protected` to the class and its children.", "`public` est ouvert à tous, `private` à la classe seule, `protected` à la classe et à ses enfants."),
    L("Getters expose a value without letting anyone change it.", "Les getters exposent une valeur sans laisser personne la modifier."),
    L("Check your rules in the constructor and methods, and `throw` when they're broken.", "Vérifie tes règles dans le constructeur et les méthodes, et lance (`throw`) une exception quand elles sont violées."),
  ],
};

export const inheritance: Lesson = {
  id: "inheritance",
  chapterId: CH,
  title: L("Inheritance", "L'héritage"),
  tagline: L("extends, parent::, overriding and abstract classes", "extends, parent::, la redéfinition et les classes abstraites"),
  xp: 60,
  syntax: ["extends", "parent::", "protected", "abstract", "final", "instanceof"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("A Cat is an Animal", "Un chat est un animal"),
      body: [
        L(
          "Many things share a common base: every animal has a name, but each one speaks differently. With `class Cat extends Animal`, the cat **inherits** everything the animal has, and only writes what's different.",
          "Beaucoup de choses partagent une base commune : chaque animal a un nom, mais chacun parle à sa façon. Avec `class Cat extends Animal`, le chat **hérite** de tout ce qu'a l'animal, et n'écrit que ce qui change.",
        ),
        L(
          "Writing a method with the same name in the child **overrides** the parent's version. `protected` properties are visible to the children, unlike `private` ones.",
          "Écrire une méthode du même nom dans l'enfant **redéfinit** la version du parent. Les propriétés `protected` sont visibles par les enfants, contrairement aux `private`.",
        ),
      ],
      scene: "inheritance",
      example: {
        code: `<?php\nclass Animal\n{\n    public function __construct(protected string $name) {}\n\n    public function describe(): string\n    {\n        return "{$this->name} says {$this->speak()}";\n    }\n\n    public function speak(): string\n    {\n        return "...";\n    }\n}\n\nclass Cat extends Animal\n{\n    public function speak(): string\n    {\n        return "Meow";\n    }\n}\n\n$generic = new Animal("Something");\n$tom = new Cat("Tom");\necho $generic->describe(), "\\n";\necho $tom->describe();\n`,
        caption: L("`describe()` is written once, in Animal; Cat only changes `speak()`.", "`describe()` est écrite une seule fois, dans Animal ; Cat ne change que `speak()`."),
      },
    },
    {
      kind: "discover",
      title: L("parent::: reuse, then add", "parent:: : réutiliser, puis ajouter"),
      body: [
        L(
          "Overriding doesn't mean starting from scratch. `parent::method()` calls the parent's version, so the child can **extend** it: do what the parent does, plus a little more.",
          "Redéfinir ne veut pas dire tout réécrire. `parent::method()` appelle la version du parent, donc l'enfant peut l'**étendre** : faire ce que fait le parent, et un peu plus.",
        ),
        L(
          "That's especially common in constructors: the child calls `parent::__construct(...)` to let the parent set up its part.",
          "C'est surtout courant dans les constructeurs : l'enfant appelle `parent::__construct(...)` pour laisser le parent préparer sa partie.",
        ),
      ],
      example: {
        code: `<?php\nclass Person\n{\n    public function __construct(protected string $name) {}\n\n    public function badge(): string\n    {\n        return "Name: {$this->name}";\n    }\n}\n\nclass Employee extends Person\n{\n    public function __construct(string $name, private string $team)\n    {\n        parent::__construct($name);\n    }\n\n    public function badge(): string\n    {\n        return parent::badge() . " | Team: {$this->team}";\n    }\n}\n\n$e = new Employee("Grace", "Compilers");\necho $e->badge();\n`,
      },
    },
    {
      kind: "watch",
      title: L("A savings account with a bonus", "Un compte épargne avec un bonus"),
      body: L(
        "`SavingsAccount` overrides `deposit()` to add a 10% bonus, then hands over to the parent with `parent::deposit()`. Watch the call stack: you'll see the child's method call the parent's.",
        "`SavingsAccount` redéfinit `deposit()` pour ajouter un bonus de 10 %, puis passe la main au parent avec `parent::deposit()`. Regarde la pile d'appels : tu verras la méthode de l'enfant appeler celle du parent.",
      ),
      code: `<?php\nclass Account\n{\n    protected int $balance = 0;\n\n    public function deposit(int $amount): void\n    {\n        $this->balance += $amount;\n    }\n\n    public function balance(): int\n    {\n        return $this->balance;\n    }\n}\n\nclass SavingsAccount extends Account\n{\n    public function deposit(int $amount): void\n    {\n        $bonus = intdiv($amount, 10);\n        parent::deposit($amount + $bonus);\n    }\n}\n\n$plain = new Account();\n$plain->deposit(100);\n$savings = new SavingsAccount();\n$savings->deposit(100);\necho $plain->balance(), " vs ", $savings->balance();\n`,
      notes: {
        26: L("A plain account: its `deposit()` is the original one.", "Un compte simple : son `deposit()` est l'original."),
        21: L("The child's version runs first and computes a bonus of 10.", "La version de l'enfant s'exécute d'abord et calcule un bonus de 10."),
        8: L("The parent's code does the actual saving, for both kinds of account.", "Le code du parent fait l'enregistrement réel, pour les deux types de compte."),
        30: L("Same method name, different behaviour: 100 vs 110.", "Même nom de méthode, comportement différent : 100 contre 110."),
      },
    },
    {
      kind: "discover",
      title: L("Abstract classes and final", "Classes abstraites et final"),
      body: [
        L(
          "Some parents are just ideas: there's no \"shape\" in real life, only circles and squares. Mark such a class `abstract`: it can't be built with `new`, and its `abstract` methods **must** be written by every child.",
          "Certains parents ne sont que des idées : il n'existe pas de « forme » dans la vraie vie, seulement des cercles et des carrés. Marque une telle classe `abstract` : on ne peut pas la construire avec `new`, et ses méthodes `abstract` **doivent** être écrites par chaque enfant.",
        ),
        L(
          "The opposite tool is `final`: a final class can't be extended, a final method can't be overridden. Use it when changing the behaviour would break things.",
          "L'outil inverse, c'est `final` : une classe finale ne peut pas être étendue, une méthode finale ne peut pas être redéfinie. Utilise-le quand changer le comportement casserait tout.",
        ),
      ],
      example: {
        code: `<?php\nabstract class Shape\n{\n    abstract public function area(): float;\n\n    public function describe(): string\n    {\n        return static::class . " with area " . round($this->area(), 2);\n    }\n}\n\nfinal class Circle extends Shape\n{\n    public function __construct(private float $radius) {}\n\n    public function area(): float\n    {\n        return pi() * $this->radius ** 2;\n    }\n}\n\necho (new Circle(2))->describe(), "\\n";\n$s = new Shape();\n`,
        caption: L("The last line fails on purpose: an abstract class can't be instantiated.", "La dernière ligne échoue exprès : une classe abstraite ne peut pas être instanciée."),
      },
    },
    {
      kind: "quiz",
      title: L("Who answers?", "Qui répond ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass A\n{\n    public function name(): string { return "A"; }\n    public function hello(): string { return "Hello from " . $this->name(); }\n}\n\nclass B extends A\n{\n    public function name(): string { return "B"; }\n}\n\necho (new B())->hello();\n`,
      options: ["Hello from A", "Hello from B", "Hello from AB", "Error"],
      answer: 1,
      explain: L(
        "`hello()` is inherited from A, but `$this` is a B object, so `$this->name()` calls B's version. The object decides, not the place the code was written.",
        "`hello()` est héritée de A, mais `$this` est un objet B, donc `$this->name()` appelle la version de B. C'est l'objet qui décide, pas l'endroit où le code est écrit.",
      ),
    },
    {
      kind: "try",
      title: L("Teach a dog to bark", "Apprends à un chien à aboyer"),
      body: L(
        "Create a class `Dog` that extends `Animal` and overrides `speak()` to return `Woof`. The last line should print `Rex says Woof`.",
        "Crée une classe `Dog` qui étend `Animal` et redéfinit `speak()` pour renvoyer `Woof`. La dernière ligne doit afficher `Rex says Woof`.",
      ),
      files: {
        "index.php": `<?php\nclass Animal\n{\n    public function __construct(protected string $name) {}\n\n    public function speak(): string\n    {\n        return "...";\n    }\n\n    public function introduce(): string\n    {\n        return "{$this->name} says {$this->speak()}";\n    }\n}\n\n// Create class Dog here\n\necho (new Dog("Rex"))->introduce();\n`,
      },
      solution: {
        "index.php": `<?php\nclass Animal\n{\n    public function __construct(protected string $name) {}\n\n    public function speak(): string\n    {\n        return "...";\n    }\n\n    public function introduce(): string\n    {\n        return "{$this->name} says {$this->speak()}";\n    }\n}\n\nclass Dog extends Animal\n{\n    public function speak(): string\n    {\n        return "Woof";\n    }\n}\n\necho (new Dog("Rex"))->introduce();\n`,
      },
      probes: ["(new Dog('Max')) instanceof Animal"],
      objectives: [
        {
          id: "dog",
          label: L("Dog extends Animal and prints: Rex says Woof", "Dog étend Animal et affiche : Rex says Woof"),
          check: all(outputIs("Rex says Woof"), probeIs("(new Dog('Max')) instanceof Animal", true)),
          hints: [
            L("The dog inherits the constructor and `introduce()`: only `speak()` changes.", "Le chien hérite du constructeur et de `introduce()` : seule `speak()` change."),
            L("`class Dog extends Animal { public function speak(): string { … } }`", "`class Dog extends Animal { public function speak(): string { … } }`"),
            L(
              "Replace the comment with `class Dog extends Animal { public function speak(): string { return \"Woof\"; } }`.",
              "Remplace le commentaire par `class Dog extends Animal { public function speak(): string { return \"Woof\"; } }`.",
            ),
          ],
        },
      ],
      cheat: "inheritance",
    },
    {
      kind: "challenge",
      title: L("A family of shapes", "Une famille de formes"),
      body: L(
        "`Shape` is abstract with an abstract `area()`. Write `Circle` (constructor takes a `$radius`, area = π × r²) and `Rectangle` (`$width`, `$height`), both extending `Shape`. The loop then describes each one.",
        "`Shape` est abstraite avec une méthode abstraite `area()`. Écris `Circle` (le constructeur prend un `$radius`, aire = π × r²) et `Rectangle` (`$width`, `$height`), qui étendent toutes les deux `Shape`. La boucle décrit ensuite chacune.",
      ),
      files: {
        "index.php": `<?php\nabstract class Shape\n{\n    abstract public function area(): float;\n\n    public function describe(): string\n    {\n        return static::class . ": " . round($this->area(), 2);\n    }\n}\n\n// 1. Circle extends Shape: constructor(float $radius), area() = pi() * r²\n// 2. Rectangle extends Shape: constructor(float $width, float $height)\n\n$shapes = [new Circle(1), new Rectangle(2, 3)];\nforeach ($shapes as $shape) {\n    echo $shape->describe(), "\\n";\n}\n`,
      },
      solution: {
        "index.php": `<?php\nabstract class Shape\n{\n    abstract public function area(): float;\n\n    public function describe(): string\n    {\n        return static::class . ": " . round($this->area(), 2);\n    }\n}\n\nclass Circle extends Shape\n{\n    public function __construct(private float $radius) {}\n\n    public function area(): float\n    {\n        return pi() * $this->radius ** 2;\n    }\n}\n\nclass Rectangle extends Shape\n{\n    public function __construct(private float $width, private float $height) {}\n\n    public function area(): float\n    {\n        return $this->width * $this->height;\n    }\n}\n\n$shapes = [new Circle(1), new Rectangle(2, 3)];\nforeach ($shapes as $shape) {\n    echo $shape->describe(), "\\n";\n}\n`,
      },
      probes: ["round((new Circle(2))->area(), 2)", "(new Rectangle(4, 5))->area()", "(new Circle(1)) instanceof Shape && (new Rectangle(1, 1)) instanceof Shape"],
      objectives: [
        {
          id: "circle",
          label: L("Circle computes π × r² (r = 2 → 12.57)", "Circle calcule π × r² (r = 2 → 12.57)"),
          check: probeShows("round((new Circle(2))->area(), 2)", "12.57"),
          hints: [
            L("Circle needs its radius stored (promotion works well) and its own `area()`.", "Circle doit stocker son rayon (la promotion marche bien) et avoir sa propre `area()`."),
            L("`pi() * $this->radius ** 2`: `**` is the power operator.", "`pi() * $this->radius ** 2` : `**` est l'opérateur puissance."),
            L(
              "`class Circle extends Shape { public function __construct(private float $radius) {} public function area(): float { return pi() * $this->radius ** 2; } }`",
              "`class Circle extends Shape { public function __construct(private float $radius) {} public function area(): float { return pi() * $this->radius ** 2; } }`",
            ),
          ],
        },
        {
          id: "rectangle",
          label: L("Rectangle computes width × height (4 × 5 → 20.0)", "Rectangle calcule largeur × hauteur (4 × 5 → 20.0)"),
          check: probeShows("(new Rectangle(4, 5))->area()", "20.0"),
          hints: [
            L("Same pattern as Circle, with two properties.", "Même modèle que Circle, avec deux propriétés."),
            L("`public function __construct(private float $width, private float $height) {}`", "`public function __construct(private float $width, private float $height) {}`"),
            L(
              "Add `class Rectangle extends Shape` with that constructor and `public function area(): float { return $this->width * $this->height; }`.",
              "Ajoute `class Rectangle extends Shape` avec ce constructeur et `public function area(): float { return $this->width * $this->height; }`.",
            ),
          ],
        },
        {
          id: "family",
          label: L("Both are Shapes, and the loop prints Circle: 3.14 then Rectangle: 6", "Les deux sont des Shape, et la boucle affiche Circle: 3.14 puis Rectangle: 6"),
          check: all(probeIs("(new Circle(1)) instanceof Shape && (new Rectangle(1, 1)) instanceof Shape", true), outputLines(["Circle: 3.14", "Rectangle: 6"])),
          hints: [
            L("Each class must say `extends Shape` to get `describe()` for free.", "Chaque classe doit dire `extends Shape` pour obtenir `describe()` gratuitement."),
            L("If PHP says a class \"contains 1 abstract method\", that class is missing `area()`.", "Si PHP dit qu'une classe « contient 1 méthode abstraite », il manque `area()` à cette classe."),
            L("Check both declarations start with `class Circle extends Shape` and `class Rectangle extends Shape`.", "Vérifie que les deux déclarations commencent par `class Circle extends Shape` et `class Rectangle extends Shape`."),
          ],
        },
      ],
      cheat: "inheritance",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`extends` gives a child class everything its parent has; it only writes what differs.", "`extends` donne à une classe enfant tout ce qu'a son parent ; elle n'écrit que ce qui diffère."),
    L("Overriding replaces a method; `parent::` calls the parent's version to extend it.", "Redéfinir remplace une méthode ; `parent::` appelle la version du parent pour l'étendre."),
    L("`abstract` classes can't be built and force children to write abstract methods; `final` forbids extending.", "Les classes `abstract` ne peuvent pas être construites et obligent les enfants à écrire les méthodes abstraites ; `final` interdit l'extension."),
  ],
};

export const interfacesTraits: Lesson = {
  id: "interfaces-traits",
  chapterId: CH,
  title: L("Interfaces and traits", "Interfaces et traits"),
  tagline: L("Contracts, polymorphism, and code you can share", "Des contrats, le polymorphisme et du code à partager"),
  xp: 60,
  syntax: ["interface", "implements", "instanceof", "trait", "use"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("An interface is a contract", "Une interface est un contrat"),
      body: [
        L(
          "A USB port doesn't care whether you plug in a mouse, a key or a phone: anything with the right plug works. An **interface** is that plug: a list of methods a class promises to have, with no code inside.",
          "Un port USB se moque que tu branches une souris, une clé ou un téléphone : tout ce qui a la bonne prise marche. Une **interface** est cette prise : une liste de méthodes qu'une classe promet d'avoir, sans code dedans.",
        ),
        L(
          "`class Square implements HasArea` signs the contract. A function that asks for a `HasArea` then accepts squares, circles, or any future shape. Treating different objects through the same interface is called **polymorphism**.",
          "`class Square implements HasArea` signe le contrat. Une fonction qui demande un `HasArea` accepte alors les carrés, les cercles, ou n'importe quelle forme future. Traiter des objets différents à travers la même interface s'appelle le **polymorphisme**.",
        ),
      ],
      example: {
        code: `<?php\ninterface HasArea\n{\n    public function area(): float;\n}\n\nclass Square implements HasArea\n{\n    public function __construct(private float $side) {}\n    public function area(): float { return $this->side ** 2; }\n}\n\nclass Circle implements HasArea\n{\n    public function __construct(private float $radius) {}\n    public function area(): float { return pi() * $this->radius ** 2; }\n}\n\nfunction totalArea(HasArea ...$shapes): float\n{\n    $sum = 0;\n    foreach ($shapes as $shape) {\n        $sum += $shape->area();\n    }\n    return $sum;\n}\n\necho round(totalArea(new Square(2), new Circle(1)), 2);\n`,
        caption: L("`totalArea()` never needs to know which shapes exist.", "`totalArea()` n'a jamais besoin de savoir quelles formes existent."),
      },
    },
    {
      kind: "watch",
      title: L("One loop, many implementations", "Une boucle, plusieurs implémentations"),
      body: L(
        "Both classes implement `Notifier`. The loop calls `send()` without knowing which kind it holds: watch the call stack switch between `EmailNotifier->send` and `SmsNotifier->send`.",
        "Les deux classes implémentent `Notifier`. La boucle appelle `send()` sans savoir quel type elle tient : regarde la pile d'appels passer de `EmailNotifier->send` à `SmsNotifier->send`.",
      ),
      code: `<?php\ninterface Notifier\n{\n    public function send(string $msg): string;\n}\n\nclass EmailNotifier implements Notifier\n{\n    public function send(string $msg): string\n    {\n        $line = "Email: $msg";\n        return $line;\n    }\n}\n\nclass SmsNotifier implements Notifier\n{\n    public function send(string $msg): string\n    {\n        $line = "SMS: " . substr($msg, 0, 10);\n        return $line;\n    }\n}\n\n$channels = [new EmailNotifier(), new SmsNotifier()];\nforeach ($channels as $channel) {\n    echo $channel->send("Your order shipped"), "\\n";\n}\necho "Sent through " . count($channels) . " channels";\n`,
      notes: {
        25: L("An array holding two different classes that share one interface.", "Un tableau qui contient deux classes différentes partageant une interface."),
        11: L("First turn of the loop: the email version runs.", "Premier tour de boucle : la version email s'exécute."),
        20: L("Second turn: same call, the SMS version runs and shortens the text.", "Deuxième tour : même appel, la version SMS s'exécute et raccourcit le texte."),
        29: L("The loop didn't need a single `if` to pick the right behaviour.", "La boucle n'a pas eu besoin d'un seul `if` pour choisir le bon comportement."),
      },
    },
    {
      kind: "discover",
      title: L("Traits: copy-paste done right", "Les traits : le copier-coller bien fait"),
      body: [
        L(
          "An interface says **what** a class can do, never **how**. When unrelated classes need the same code (an article and a product both need a URL slug), inheritance doesn't fit: they aren't the same kind of thing.",
          "Une interface dit **ce que** sait faire une classe, jamais **comment**. Quand des classes sans rapport ont besoin du même code (un article et un produit ont tous deux besoin d'un slug d'URL), l'héritage ne colle pas : ce ne sont pas le même genre de chose.",
        ),
        L(
          "A **trait** is a bundle of methods that PHP pastes into any class that says `use TraitName;`. A class extends one parent only, but can implement many interfaces and use many traits.",
          "Un **trait** est un paquet de méthodes que PHP colle dans toute classe qui écrit `use NomDuTrait;`. Une classe n'étend qu'un seul parent, mais peut implémenter plusieurs interfaces et utiliser plusieurs traits.",
        ),
      ],
      example: {
        code: `<?php\ntrait HasSlug\n{\n    public function slug(): string\n    {\n        return strtolower(str_replace(" ", "-", $this->title));\n    }\n}\n\nclass Article\n{\n    use HasSlug;\n    public function __construct(public string $title) {}\n}\n\nclass Product\n{\n    use HasSlug;\n    public function __construct(public string $title) {}\n}\n\necho (new Article("Hello World"))->slug(), "\\n";\necho (new Product("Blue Mug XL"))->slug();\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "Rule of thumb: interface = a promise (\"I can do X\"), trait = shared code (\"here's how to do X\"), extends = \"is a kind of\".",
          "Règle simple : interface = une promesse (« je sais faire X »), trait = du code partagé (« voici comment faire X »), extends = « est une sorte de ».",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("Does it fit the plug?", "Est-ce que ça rentre dans la prise ?"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\ninterface Speaker\n{\n    public function speak(): string;\n}\n\nclass Robot implements Speaker\n{\n    public function speak(): string { return "beep"; }\n}\n\n$r = new Robot();\nvar_dump($r instanceof Speaker);\n`,
      options: ["bool(true)", "bool(false)", "Robot", "Error"],
      answer: 0,
      explain: L(
        "`instanceof` checks classes, parents **and** interfaces. A Robot is a Speaker because it signed the contract.",
        "`instanceof` vérifie les classes, les parents **et** les interfaces. Un Robot est un Speaker parce qu'il a signé le contrat.",
      ),
    },
    {
      kind: "try",
      title: L("Keep the promise", "Tiens la promesse"),
      body: L(
        "Press Run: PHP refuses to start because `Triangle` signed the `Shape` contract but forgot a method. Add the missing method so it prints `Triangle: 12`.",
        "Appuie sur Exécuter : PHP refuse de démarrer car `Triangle` a signé le contrat `Shape` mais a oublié une méthode. Ajoute la méthode manquante pour afficher `Triangle: 12`.",
      ),
      files: {
        "index.php": `<?php\ninterface Shape\n{\n    public function area(): float;\n    public function name(): string;\n}\n\nclass Triangle implements Shape\n{\n    public function __construct(private float $base, private float $height) {}\n\n    public function area(): float\n    {\n        return $this->base * $this->height / 2;\n    }\n    // PHP refuses to run: something from the interface is missing\n}\n\n$t = new Triangle(6, 4);\necho $t->name() . ": " . $t->area();\n`,
      },
      solution: {
        "index.php": `<?php\ninterface Shape\n{\n    public function area(): float;\n    public function name(): string;\n}\n\nclass Triangle implements Shape\n{\n    public function __construct(private float $base, private float $height) {}\n\n    public function area(): float\n    {\n        return $this->base * $this->height / 2;\n    }\n\n    public function name(): string\n    {\n        return "Triangle";\n    }\n}\n\n$t = new Triangle(6, 4);\necho $t->name() . ": " . $t->area();\n`,
      },
      probes: ["(new Triangle(1, 1)) instanceof Shape"],
      objectives: [
        {
          id: "contract",
          label: L("Triangle implements all of Shape and prints: Triangle: 12", "Triangle implémente tout Shape et affiche : Triangle: 12"),
          check: all(outputIs("Triangle: 12"), probeIs("(new Triangle(1, 1)) instanceof Shape", true)),
          hints: [
            L("Compare the interface's list with the class: which one is missing?", "Compare la liste de l'interface avec la classe : laquelle manque ?"),
            L("`name(): string` is promised but never written.", "`name(): string` est promise mais jamais écrite."),
            L("Add `public function name(): string { return \"Triangle\"; }` inside the class.", "Ajoute `public function name(): string { return \"Triangle\"; }` dans la classe."),
          ],
        },
      ],
      cheat: "interfaces-traits",
    },
    {
      kind: "challenge",
      title: L("Share a greeting with a trait", "Partage une salutation avec un trait"),
      body: L(
        "A teacher and a robot have nothing in common, except that both say hello. Write a trait `HasGreeting` with a method `greet(): string` that returns `Hi, I'm ` followed by the object's `$name`, and use it in both classes.",
        "Un professeur et un robot n'ont rien en commun, sauf qu'ils disent tous deux bonjour. Écris un trait `HasGreeting` avec une méthode `greet(): string` qui renvoie `Hi, I'm ` suivi du `$name` de l'objet, et utilise-le dans les deux classes.",
      ),
      files: {
        "index.php": `<?php\n// 1. Write a trait HasGreeting with a method greet(): string\n//    that returns "Hi, I'm " followed by $this->name\n// 2. Use it in both classes\n\nclass Teacher\n{\n    public function __construct(public string $name) {}\n}\n\nclass Robot\n{\n    public function __construct(public string $name) {}\n\n    public function beep(): string\n    {\n        return "Beep!";\n    }\n}\n\necho (new Teacher("Ana"))->greet(), "\\n";\necho (new Robot("R2"))->greet();\n`,
      },
      solution: {
        "index.php": `<?php\ntrait HasGreeting\n{\n    public function greet(): string\n    {\n        return "Hi, I'm " . $this->name;\n    }\n}\n\nclass Teacher\n{\n    use HasGreeting;\n\n    public function __construct(public string $name) {}\n}\n\nclass Robot\n{\n    use HasGreeting;\n\n    public function __construct(public string $name) {}\n\n    public function beep(): string\n    {\n        return "Beep!";\n    }\n}\n\necho (new Teacher("Ana"))->greet(), "\\n";\necho (new Robot("R2"))->greet();\n`,
      },
      probes: ["in_array('HasGreeting', class_uses('Teacher'))", "in_array('HasGreeting', class_uses('Robot'))"],
      objectives: [
        {
          id: "trait",
          label: L("A trait HasGreeting exists", "Un trait HasGreeting existe"),
          check: all(definesClass("HasGreeting"), uses(/\btrait\s+HasGreeting\b/)),
          hints: [
            L("A trait looks like a class, with the word `trait` instead of `class`.", "Un trait ressemble à une classe, avec le mot `trait` au lieu de `class`."),
            L("`trait HasGreeting { public function greet(): string { … } }`", "`trait HasGreeting { public function greet(): string { … } }`"),
            L(
              "At the top: `trait HasGreeting { public function greet(): string { return \"Hi, I'm \" . $this->name; } }`",
              "En haut : `trait HasGreeting { public function greet(): string { return \"Hi, I'm \" . $this->name; } }`",
            ),
          ],
        },
        {
          id: "used",
          label: L("Both classes use it", "Les deux classes l'utilisent"),
          check: all(probeIs("in_array('HasGreeting', class_uses('Teacher'))", true), probeIs("in_array('HasGreeting', class_uses('Robot'))", true)),
          hints: [
            L("The trait does nothing until a class pulls it in.", "Le trait ne fait rien tant qu'une classe ne l'importe pas."),
            L("Inside each class body, add `use HasGreeting;`.", "Dans le corps de chaque classe, ajoute `use HasGreeting;`."),
            L("Put `use HasGreeting;` on the first line inside `class Teacher {` and inside `class Robot {`.", "Mets `use HasGreeting;` à la première ligne dans `class Teacher {` et dans `class Robot {`."),
          ],
        },
        {
          id: "output",
          label: L("Print: Hi, I'm Ana then Hi, I'm R2", "Afficher : Hi, I'm Ana puis Hi, I'm R2"),
          check: outputLines(["Hi, I'm Ana", "Hi, I'm R2"]),
          hints: [
            L("Inside a trait, `$this` is the object of the class that uses it.", "Dans un trait, `$this` est l'objet de la classe qui l'utilise."),
            L("Glue the text and the name: `\"Hi, I'm \" . $this->name`.", "Colle le texte et le nom : `\"Hi, I'm \" . $this->name`."),
            L("Check the exact text: capital H, an apostrophe, and one space before the name.", "Vérifie le texte exact : H majuscule, une apostrophe, et un espace avant le nom."),
          ],
        },
      ],
      cheat: "interfaces-traits",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("An interface lists methods a class promises to have; `implements` signs the promise.", "Une interface liste les méthodes qu'une classe promet d'avoir ; `implements` signe la promesse."),
    L("Polymorphism: code that asks for an interface works with every class that implements it.", "Polymorphisme : du code qui demande une interface marche avec toutes les classes qui l'implémentent."),
    L("A trait shares real code between unrelated classes with `use`.", "Un trait partage du vrai code entre des classes sans rapport avec `use`."),
    L("One parent (`extends`), many interfaces, many traits.", "Un seul parent (`extends`), plusieurs interfaces, plusieurs traits."),
  ],
};

export const staticConstants: Lesson = {
  id: "static-constants",
  chapterId: CH,
  title: L("Static members and constants", "Membres statiques et constantes"),
  tagline: L("Values and methods that belong to the class itself", "Des valeurs et des méthodes qui appartiennent à la classe elle-même"),
  xp: 60,
  syntax: ["const", "static", "self::", "static::", "::"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Class constants: name your magic numbers", "Les constantes de classe : nomme tes nombres magiques"),
      body: [
        L(
          "`0.2` in the middle of a formula is a mystery; `Tax::VAT_RATE` explains itself. A **class constant** is a fixed value attached to a class, written `const NAME = value;` and read with `ClassName::NAME`.",
          "`0.2` au milieu d'une formule est un mystère ; `Tax::VAT_RATE` s'explique tout seul. Une **constante de classe** est une valeur fixe attachée à une classe, écrite `const NAME = value;` et lue avec `ClassName::NAME`.",
        ),
        L(
          "Inside the class, `self::NAME` refers to it. Constants never change, so they're perfect for rates, limits and settings. The double colon `::` means \"belongs to the class\", where `->` means \"belongs to this object\".",
          "Dans la classe, `self::NAME` y fait référence. Les constantes ne changent jamais : parfaites pour des taux, des limites et des réglages. Le double deux-points `::` veut dire « appartient à la classe », là où `->` veut dire « appartient à cet objet ».",
        ),
      ],
      example: {
        code: `<?php\nclass Tax\n{\n    const VAT_RATE = 0.2;\n    const CURRENCY = "EUR";\n\n    public function withVat(float $price): string\n    {\n        return round($price * (1 + self::VAT_RATE), 2) . " " . self::CURRENCY;\n    }\n}\n\necho Tax::VAT_RATE, "\\n";\necho (new Tax())->withVat(50);\n`,
      },
      callout: {
        tone: "version",
        text: L(
          "PHP 8.3 lets you type constants: `const float VAT_RATE = 0.2;`. Older versions don't accept a type there.",
          "PHP 8.3 permet de typer les constantes : `const float VAT_RATE = 0.2;`. Les versions plus anciennes n'acceptent pas de type à cet endroit.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Static: shared by every object", "Static : partagé par tous les objets"),
      body: [
        L(
          "A normal property belongs to each object. A `static` property belongs to the **class**, so every object sees the same one, like the counter at a factory gate that counts every car leaving, whichever car it is.",
          "Une propriété normale appartient à chaque objet. Une propriété `static` appartient à la **classe**, donc tous les objets voient la même, comme le compteur à la sortie d'une usine qui compte chaque voiture, quelle qu'elle soit.",
        ),
        L(
          "Static methods are called on the class, without any object: `User::guest()`. They're often used as **named constructors**, readable ways to build an object.",
          "Les méthodes statiques s'appellent sur la classe, sans objet : `User::guest()`. On s'en sert souvent comme **constructeurs nommés**, des façons lisibles de construire un objet.",
        ),
      ],
      example: {
        code: `<?php\nclass User\n{\n    public static int $created = 0;\n\n    public function __construct(public string $name)\n    {\n        self::$created++;\n    }\n\n    public static function guest(): User\n    {\n        return new User("Guest");\n    }\n}\n\n$ada = new User("Ada");\n$visitor = User::guest();\necho $visitor->name, "\\n";\necho User::$created, " users created";\n`,
      },
      callout: {
        tone: "warn",
        text: L(
          "Static methods have no `$this`: there's no object. Keep static state rare, it's shared by the whole program.",
          "Les méthodes statiques n'ont pas de `$this` : il n'y a pas d'objet. Garde l'état statique rare, il est partagé par tout le programme.",
        ),
      },
    },
    {
      kind: "watch",
      title: L("A ticket machine", "Un distributeur de tickets"),
      body: L(
        "Every new ticket reads the shared `self::$next` counter, then moves it forward. Watch `$a`, `$b` and `$c` get 1, 2 and 3 even though each object is built the same way.",
        "Chaque nouveau ticket lit le compteur partagé `self::$next`, puis l'avance. Regarde `$a`, `$b` et `$c` recevoir 1, 2 et 3 alors que chaque objet est construit de la même façon.",
      ),
      code: `<?php\nclass Ticket\n{\n    private static int $next = 1;\n    public int $number;\n\n    public function __construct()\n    {\n        $this->number = self::$next;\n        self::$next++;\n    }\n}\n\n$a = new Ticket();\n$b = new Ticket();\n$c = new Ticket();\necho "$a->number, $b->number, $c->number";\n`,
      notes: {
        9: L("The object copies the class-wide counter into its own `$number`.", "L'objet copie le compteur commun dans son propre `$number`."),
        10: L("The counter moves on: the next ticket will see the new value.", "Le compteur avance : le prochain ticket verra la nouvelle valeur."),
        15: L("A new object, but the same shared counter, now at 2.", "Un nouvel objet, mais le même compteur partagé, maintenant à 2."),
        17: L("Three objects, three different numbers from one static property.", "Trois objets, trois numéros différents grâce à une seule propriété statique."),
      },
    },
    {
      kind: "discover",
      title: L("self:: or static::?", "self:: ou static:: ?"),
      body: [
        L(
          "`self::` always means the class where the code is **written**. `static::` means the class that was actually **called**, which matters with inheritance. This is called **late static binding**.",
          "`self::` désigne toujours la classe où le code est **écrit**. `static::` désigne la classe réellement **appelée**, ce qui compte avec l'héritage. On appelle ça la **liaison statique tardive**.",
        ),
        L(
          "Here a parent's factory method uses `new static()`, so `User::create()` builds a User, not a Model.",
          "Ici, la méthode de fabrique du parent utilise `new static()`, donc `User::create()` construit un User, pas un Model.",
        ),
      ],
      example: {
        code: `<?php\nclass Model\n{\n    public static function create(): static\n    {\n        return new static();\n    }\n\n    public static function createSelf(): self\n    {\n        return new self();\n    }\n}\n\nclass User extends Model {}\n\necho get_class(User::create()), "\\n";\necho get_class(User::createSelf());\n`,
      },
    },
    {
      kind: "quiz",
      title: L("Count the objects", "Compte les objets"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Counter\n{\n    public static int $count = 0;\n\n    public function __construct()\n    {\n        self::$count++;\n    }\n}\n\nnew Counter();\nnew Counter();\n$c = new Counter();\necho Counter::$count;\n`,
      options: ["1", "3", "0", "Error"],
      answer: 1,
      explain: L(
        "The counter is static: all three objects increase the same number, even the two that weren't stored in a variable.",
        "Le compteur est statique : les trois objets augmentent le même nombre, même les deux qui n'ont pas été rangés dans une variable.",
      ),
    },
    {
      kind: "try",
      title: L("A unit converter", "Un convertisseur d'unités"),
      body: L(
        "Add a constant `MILES_PER_KM = 0.621371` and a **static** method `kmToMiles(float $km): float` that uses it. No object needed: the last line calls it on the class.",
        "Ajoute une constante `MILES_PER_KM = 0.621371` et une méthode **statique** `kmToMiles(float $km): float` qui l'utilise. Pas besoin d'objet : la dernière ligne l'appelle sur la classe.",
      ),
      files: { "index.php": `<?php\nclass Converter\n{\n    // 1. Add a constant MILES_PER_KM = 0.621371\n    // 2. Add a static method kmToMiles(float $km): float that uses it\n}\n\necho round(Converter::kmToMiles(42.195), 1) . " miles";\n` },
      solution: {
        "index.php": `<?php\nclass Converter\n{\n    const MILES_PER_KM = 0.621371;\n\n    public static function kmToMiles(float $km): float\n    {\n        return $km * self::MILES_PER_KM;\n    }\n}\n\necho round(Converter::kmToMiles(42.195), 1) . " miles";\n`,
      },
      probes: ["Converter::MILES_PER_KM", "round(Converter::kmToMiles(10), 2)"],
      objectives: [
        {
          id: "const",
          label: L("Converter::MILES_PER_KM is 0.621371", "Converter::MILES_PER_KM vaut 0.621371"),
          check: probeShows("Converter::MILES_PER_KM", "0.621371"),
          hints: [
            L("A constant is declared inside the class with `const`.", "Une constante se déclare dans la classe avec `const`."),
            L("`const MILES_PER_KM = 0.621371;`", "`const MILES_PER_KM = 0.621371;`"),
            L("Replace the first comment with `const MILES_PER_KM = 0.621371;`.", "Remplace le premier commentaire par `const MILES_PER_KM = 0.621371;`."),
          ],
        },
        {
          id: "static",
          label: L("Converter::kmToMiles() uses the constant (prints 26.2 miles)", "Converter::kmToMiles() utilise la constante (affiche 26.2 miles)"),
          check: all(probeShows("round(Converter::kmToMiles(10), 2)", "6.21"), outputIs("26.2 miles"), uses(/self::MILES_PER_KM|static::MILES_PER_KM|Converter::MILES_PER_KM/)),
          hints: [
            L("The method needs the word `static`, and reads the constant with `self::`.", "La méthode a besoin du mot `static`, et lit la constante avec `self::`."),
            L("`public static function kmToMiles(float $km): float { return $km * self::MILES_PER_KM; }`", "`public static function kmToMiles(float $km): float { return $km * self::MILES_PER_KM; }`"),
            L("Replace the second comment with the method from the previous hint, then Run.", "Remplace le second commentaire par la méthode de l'indice précédent, puis exécute."),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("Order numbers", "Des numéros de commande"),
      body: L(
        "Complete `Order`: a constant `PREFIX = \"ORD-\"`, a private static counter, a static factory `create(): Order` that builds orders numbered `ORD-1`, `ORD-2`…, and a static method `count(): int` that says how many were created.",
        "Complète `Order` : une constante `PREFIX = \"ORD-\"`, un compteur statique privé, une fabrique statique `create(): Order` qui construit des commandes numérotées `ORD-1`, `ORD-2`…, et une méthode statique `count(): int` qui dit combien ont été créées.",
      ),
      files: {
        "index.php": `<?php\nclass Order\n{\n    // const PREFIX = "ORD-";\n    // a private static int counter\n\n    public function __construct(public string $id) {}\n\n    // public static function create(): Order  → new Order with the next id (ORD-1, ORD-2…)\n    // public static function count(): int      → how many orders were created\n}\n\n$first = Order::create();\n$second = Order::create();\necho $first->id, " ", $second->id, "\\n";\necho Order::count(), " orders";\n`,
      },
      solution: {
        "index.php": `<?php\nclass Order\n{\n    const PREFIX = "ORD-";\n    private static int $counter = 0;\n\n    public function __construct(public string $id) {}\n\n    public static function create(): Order\n    {\n        self::$counter++;\n        return new Order(self::PREFIX . self::$counter);\n    }\n\n    public static function count(): int\n    {\n        return self::$counter;\n    }\n}\n\n$first = Order::create();\n$second = Order::create();\necho $first->id, " ", $second->id, "\\n";\necho Order::count(), " orders";\n`,
      },
      probes: ["Order::PREFIX", "Order::create()->id", "Order::count()"],
      objectives: [
        {
          id: "prefix",
          label: L("A constant PREFIX = \"ORD-\"", "Une constante PREFIX = \"ORD-\""),
          check: probeIs("Order::PREFIX", "ORD-"),
          hints: [
            L("Uncomment and keep the constant line.", "Décommente et garde la ligne de la constante."),
            L("`const PREFIX = \"ORD-\";`", "`const PREFIX = \"ORD-\";`"),
            L("Remove the `//` in front of `const PREFIX = \"ORD-\";`.", "Retire le `//` devant `const PREFIX = \"ORD-\";`."),
          ],
        },
        {
          id: "create",
          label: L("Order::create() numbers orders ORD-1, ORD-2, ORD-3…", "Order::create() numérote ORD-1, ORD-2, ORD-3…"),
          check: all(outputHas(/^ORD-1 ORD-2$/m), probeIs("Order::create()->id", "ORD-3")),
          hints: [
            L("The counter is static so every call to `create()` shares it. Increase it, then build the id.", "Le compteur est statique pour que chaque appel à `create()` le partage. Augmente-le, puis construis l'identifiant."),
            L("`private static int $counter = 0;` and in create(): `self::$counter++; return new Order(self::PREFIX . self::$counter);`", "`private static int $counter = 0;` et dans create() : `self::$counter++; return new Order(self::PREFIX . self::$counter);`"),
            L(
              "`public static function create(): Order { self::$counter++; return new Order(self::PREFIX . self::$counter); }`",
              "`public static function create(): Order { self::$counter++; return new Order(self::PREFIX . self::$counter); }`",
            ),
          ],
        },
        {
          id: "count",
          label: L("Order::count() returns how many were created", "Order::count() renvoie combien ont été créées"),
          check: all(outputHas(/^2 orders$/m), probeIs("Order::count()", 3)),
          hints: [
            L("The counter already knows the answer.", "Le compteur connaît déjà la réponse."),
            L("`return self::$counter;`", "`return self::$counter;`"),
            L("`public static function count(): int { return self::$counter; }`", "`public static function count(): int { return self::$counter; }`"),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`const` names a fixed value on a class; read it with `ClassName::NAME` or `self::NAME`.", "`const` nomme une valeur fixe sur une classe ; lis-la avec `ClassName::NAME` ou `self::NAME`."),
    L("`static` properties are shared by every object; static methods need no object and have no `$this`.", "Les propriétés `static` sont partagées par tous les objets ; les méthodes statiques n'ont pas besoin d'objet et n'ont pas de `$this`."),
    L("`self::` is the class the code is written in; `static::` is the class actually called.", "`self::` est la classe où le code est écrit ; `static::` est la classe réellement appelée."),
  ],
};

export const enums: Lesson = {
  id: "enums",
  chapterId: CH,
  title: L("Enums", "Les enums"),
  tagline: L("A fixed list of possible values, checked by PHP", "Une liste fixe de valeurs possibles, vérifiée par PHP"),
  xp: 60,
  syntax: ["enum", "case", "->name", "->value", "cases()", "from", "tryFrom"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Why not just strings?", "Pourquoi pas de simples chaînes ?"),
      body: [
        L(
          "An order status stored as a string can be `\"pending\"`, `\"Pending\"`, or a typo like `\"pnding\"`, and nothing stops it. A traffic light only has three colours; an **enum** lets you say the same thing in code: a type with a fixed list of **cases**.",
          "Un statut de commande stocké en chaîne peut valoir `\"pending\"`, `\"Pending\"`, ou une faute comme `\"pnding\"`, et rien ne l'en empêche. Un feu tricolore n'a que trois couleurs ; un **enum** permet de dire la même chose en code : un type avec une liste fixe de **cas**.",
        ),
        L(
          "Each case is a unique object: `Suit::Hearts === Suit::Hearts` is true, and a function that asks for a `Suit` can't receive anything else. `->name` gives the case's name, `Suit::cases()` lists them all.",
          "Chaque cas est un objet unique : `Suit::Hearts === Suit::Hearts` est vrai, et une fonction qui demande un `Suit` ne peut rien recevoir d'autre. `->name` donne le nom du cas, `Suit::cases()` les liste tous.",
        ),
      ],
      example: {
        code: `<?php\nenum Suit\n{\n    case Hearts;\n    case Diamonds;\n    case Clubs;\n    case Spades;\n}\n\n$card = Suit::Hearts;\nvar_dump($card === Suit::Hearts);\necho $card->name, "\\n";\necho count(Suit::cases()), " suits";\n`,
      },
      callout: {
        tone: "version",
        text: L("Enums arrived in PHP 8.1. Before that, people used class constants and hoped for the best.", "Les enums sont arrivés avec PHP 8.1. Avant, on utilisait des constantes de classe en croisant les doigts."),
      },
    },
    {
      kind: "compare",
      title: L("Enums on PHP 8.0 vs 8.1", "Les enums en PHP 8.0 et en 8.1"),
      body: L("Same code, two versions. On 8.0, `enum` isn't a keyword yet.", "Même code, deux versions. En 8.0, `enum` n'est pas encore un mot-clé."),
      code: `<?php\nenum Light: string\n{\n    case Red = 'stop';\n    case Green = 'go';\n}\n\necho Light::Green->value;\n`,
      versions: ["8.0", "8.1"],
      takeaway: L(
        "8.0 can't even parse the file; 8.1 prints `go`. If your server runs an old PHP, enums are off the table.",
        "La 8.0 n'arrive même pas à lire le fichier ; la 8.1 affiche `go`. Si ton serveur tourne sur un vieux PHP, pas d'enums.",
      ),
    },
    {
      kind: "discover",
      title: L("Backed enums: cases with a value", "Les enums typés : des cas avec une valeur"),
      body: [
        L(
          "Databases and forms speak strings and ints, not objects. A **backed enum** gives every case a value: `enum Status: string { case Draft = 'draft'; }`. `->value` reads it.",
          "Les bases de données et les formulaires parlent en chaînes et en entiers, pas en objets. Un **enum typé** (backed enum) donne une valeur à chaque cas : `enum Status: string { case Draft = 'draft'; }`. `->value` la lit.",
        ),
        L(
          "Going the other way: `Status::from('draft')` turns a value back into a case (and throws a `ValueError` if it's unknown), while `Status::tryFrom('oops')` returns `null` instead. Enums can also have methods, and `match` pairs beautifully with them.",
          "Dans l'autre sens : `Status::from('draft')` retransforme une valeur en cas (et lance une `ValueError` si elle est inconnue), tandis que `Status::tryFrom('oops')` renvoie `null` à la place. Les enums peuvent aussi avoir des méthodes, et `match` va parfaitement avec eux.",
        ),
      ],
      example: {
        code: `<?php\nenum Status: string\n{\n    case Draft = 'draft';\n    case Published = 'published';\n    case Archived = 'archived';\n\n    public function label(): string\n    {\n        return match ($this) {\n            Status::Draft => 'Work in progress',\n            Status::Published => 'Live',\n            Status::Archived => 'Hidden',\n        };\n    }\n}\n\nforeach (Status::cases() as $s) {\n    echo $s->value, ": ", $s->label(), "\\n";\n}\nvar_dump(Status::from('published') === Status::Published);\nvar_dump(Status::tryFrom('deleted'));\n`,
      },
      callout: {
        tone: "tip",
        text: L(
          "Use `from()` when a bad value is a bug, `tryFrom()` when it comes from a user and you want to handle it.",
          "Utilise `from()` quand une mauvaise valeur est un bug, `tryFrom()` quand elle vient d'un utilisateur et que tu veux la gérer.",
        ),
      },
    },
    {
      kind: "quiz",
      title: L("From a value to a case", "D'une valeur à un cas"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nenum Size: int\n{\n    case Small = 1;\n    case Medium = 2;\n    case Large = 3;\n}\n\n$s = Size::from(2);\necho $s->name . " " . $s->value;\n`,
      options: ["Small 1", "Medium 2", "Medium", "2 Medium"],
      answer: 1,
      explain: L(
        "`from(2)` finds the case whose value is 2: `Size::Medium`. Its `->name` is \"Medium\", its `->value` is 2.",
        "`from(2)` trouve le cas dont la valeur est 2 : `Size::Medium`. Son `->name` est « Medium », sa `->value` est 2.",
      ),
    },
    {
      kind: "try",
      title: L("Opposite directions", "Les directions opposées"),
      body: L(
        "Add a method `opposite(): Direction` to the enum, using `match ($this)`: Up ↔ Down, Left ↔ Right. The script prints the opposite of Left.",
        "Ajoute une méthode `opposite(): Direction` à l'enum, avec `match ($this)` : Up ↔ Down, Left ↔ Right. Le script affiche l'opposé de Left.",
      ),
      files: { "index.php": `<?php\nenum Direction\n{\n    case Up;\n    case Down;\n    case Left;\n    case Right;\n\n    // Add opposite(): Direction using match ($this)\n}\n\necho Direction::Left->opposite()->name;\n` },
      solution: {
        "index.php": `<?php\nenum Direction\n{\n    case Up;\n    case Down;\n    case Left;\n    case Right;\n\n    public function opposite(): Direction\n    {\n        return match ($this) {\n            Direction::Up => Direction::Down,\n            Direction::Down => Direction::Up,\n            Direction::Left => Direction::Right,\n            Direction::Right => Direction::Left,\n        };\n    }\n}\n\necho Direction::Left->opposite()->name;\n`,
      },
      probes: ["array_map(fn ($d) => $d->opposite()->name, Direction::cases())"],
      objectives: [
        {
          id: "opposite",
          label: L("Every direction knows its opposite (prints Right)", "Chaque direction connaît son opposée (affiche Right)"),
          check: all(outputIs("Right"), probeIs("array_map(fn ($d) => $d->opposite()->name, Direction::cases())", ["Down", "Up", "Right", "Left"]), uses(/match\s*\(/)),
          hints: [
            L("Inside an enum method, `$this` is the current case. `match` picks a result for each case.", "Dans une méthode d'enum, `$this` est le cas courant. `match` choisit un résultat pour chaque cas."),
            L("`return match ($this) { Direction::Up => Direction::Down, … };`", "`return match ($this) { Direction::Up => Direction::Down, … };`"),
            L(
              "Write `public function opposite(): Direction { return match ($this) { … }; }` with four arms: Up => Down, Down => Up, Left => Right, Right => Left.",
              "Écris `public function opposite(): Direction { return match ($this) { … }; }` avec quatre branches : Up => Down, Down => Up, Left => Right, Right => Left.",
            ),
          ],
        },
      ],
      cheat: "enums",
    },
    {
      kind: "challenge",
      title: L("Order statuses", "Les statuts de commande"),
      body: L(
        "Create a backed enum `OrderStatus` (string) with `Pending = 'pending'`, `Paid = 'paid'` and `Shipped = 'shipped'`, and a method `canCancel(): bool` that is true for Pending and Paid only. The script reads raw strings with `tryFrom()`.",
        "Crée un enum typé `OrderStatus` (string) avec `Pending = 'pending'`, `Paid = 'paid'` et `Shipped = 'shipped'`, et une méthode `canCancel(): bool` vraie seulement pour Pending et Paid. Le script lit des chaînes brutes avec `tryFrom()`.",
      ),
      files: {
        "index.php": `<?php\n// Create a backed enum OrderStatus (string) with:\n//   Pending = 'pending', Paid = 'paid', Shipped = 'shipped'\n// and a method canCancel(): bool (true for Pending and Paid)\n\n$inputs = ["paid", "shipped", "lost"];\nforeach ($inputs as $input) {\n    $status = OrderStatus::tryFrom($input);\n    if ($status === null) {\n        echo "$input: unknown\\n";\n    } else {\n        echo "$input: " . ($status->canCancel() ? "can cancel" : "too late") . "\\n";\n    }\n}\n`,
      },
      solution: {
        "index.php": `<?php\nenum OrderStatus: string\n{\n    case Pending = 'pending';\n    case Paid = 'paid';\n    case Shipped = 'shipped';\n\n    public function canCancel(): bool\n    {\n        return match ($this) {\n            OrderStatus::Pending, OrderStatus::Paid => true,\n            OrderStatus::Shipped => false,\n        };\n    }\n}\n\n$inputs = ["paid", "shipped", "lost"];\nforeach ($inputs as $input) {\n    $status = OrderStatus::tryFrom($input);\n    if ($status === null) {\n        echo "$input: unknown\\n";\n    } else {\n        echo "$input: " . ($status->canCancel() ? "can cancel" : "too late") . "\\n";\n    }\n}\n`,
      },
      probes: ["OrderStatus::from('paid') === OrderStatus::Paid && OrderStatus::Shipped->value === 'shipped'", "array_map(fn ($s) => $s->canCancel(), OrderStatus::cases())"],
      objectives: [
        {
          id: "enum",
          label: L("A backed enum OrderStatus with the three cases", "Un enum typé OrderStatus avec les trois cas"),
          check: all(definesClass("OrderStatus"), probeIs("OrderStatus::from('paid') === OrderStatus::Paid && OrderStatus::Shipped->value === 'shipped'", true)),
          hints: [
            L("A backed enum declares its value type after its name, then gives each case a value.", "Un enum typé déclare le type de ses valeurs après son nom, puis donne une valeur à chaque cas."),
            L("`enum OrderStatus: string { case Pending = 'pending'; … }`", "`enum OrderStatus: string { case Pending = 'pending'; … }`"),
            L(
              "`enum OrderStatus: string { case Pending = 'pending'; case Paid = 'paid'; case Shipped = 'shipped'; }`",
              "`enum OrderStatus: string { case Pending = 'pending'; case Paid = 'paid'; case Shipped = 'shipped'; }`",
            ),
          ],
        },
        {
          id: "cancel",
          label: L("canCancel() is true for Pending and Paid", "canCancel() est vraie pour Pending et Paid"),
          check: probeIs("array_map(fn ($s) => $s->canCancel(), OrderStatus::cases())", [true, true, false]),
          hints: [
            L("`match` can list several cases in one arm, separated by commas.", "`match` peut lister plusieurs cas dans une branche, séparés par des virgules."),
            L("`OrderStatus::Pending, OrderStatus::Paid => true,`", "`OrderStatus::Pending, OrderStatus::Paid => true,`"),
            L(
              "`public function canCancel(): bool { return match ($this) { OrderStatus::Pending, OrderStatus::Paid => true, OrderStatus::Shipped => false }; }`",
              "`public function canCancel(): bool { return match ($this) { OrderStatus::Pending, OrderStatus::Paid => true, OrderStatus::Shipped => false }; }`",
            ),
          ],
        },
        {
          id: "output",
          label: L("The script prints the three answers", "Le script affiche les trois réponses"),
          check: outputLines(["paid: can cancel", "shipped: too late", "lost: unknown"]),
          hints: [
            L("Once the enum exists, the loop works: `tryFrom('lost')` gives null.", "Une fois l'enum créé, la boucle marche : `tryFrom('lost')` donne null."),
            L("Check the values are lowercase, exactly like the inputs.", "Vérifie que les valeurs sont en minuscules, exactement comme les entrées."),
            L("Run and compare each line with the objective.", "Exécute et compare chaque ligne avec l'objectif."),
          ],
        },
      ],
      cheat: "enums",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("An enum is a type with a fixed list of cases (PHP 8.1).", "Un enum est un type avec une liste fixe de cas (PHP 8.1)."),
    L("Backed enums give each case a string or int `->value`; `from()` and `tryFrom()` convert back.", "Les enums typés donnent à chaque cas une `->value` chaîne ou entier ; `from()` et `tryFrom()` font la conversion inverse."),
    L("Enums can have methods, and `match ($this)` handles each case.", "Les enums peuvent avoir des méthodes, et `match ($this)` gère chaque cas."),
  ],
};

export const immutability: Lesson = {
  id: "immutability",
  chapterId: CH,
  title: L("Immutable objects", "Les objets immuables"),
  tagline: L("readonly properties and classes, and \"with\" methods", "Propriétés et classes readonly, et méthodes « with »"),
  xp: 60,
  syntax: ["readonly", "readonly class", "clone", "withX()", "DateTimeImmutable"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Values that never change", "Des valeurs qui ne changent jamais"),
      body: [
        L(
          "Remember that objects are shared? If two parts of your program hold the same `Money` object and one changes it, the other gets a surprise. A printed receipt avoids that: once printed, nobody edits it, so anyone can read it safely.",
          "Tu te souviens que les objets sont partagés ? Si deux parties du programme tiennent le même objet `Money` et que l'une le modifie, l'autre a une surprise. Un ticket de caisse évite ça : une fois imprimé, personne ne le modifie, donc tout le monde peut le lire sans risque.",
        ),
        L(
          "A `readonly` property can be set once (in the constructor) and never again. Trying to change it throws an `Error`.",
          "Une propriété `readonly` peut être remplie une fois (dans le constructeur) et plus jamais. Essayer de la changer lance une `Error`.",
        ),
      ],
      example: {
        code: `<?php\nfinal class Money\n{\n    public function __construct(\n        public readonly int $cents,\n        public readonly string $currency,\n    ) {}\n}\n\n$price = new Money(1999, "EUR");\necho $price->cents, " ", $price->currency, "\\n";\n$price->cents = 5;\n`,
        caption: L("Reading is fine; writing is refused (see Problems).", "Lire, c'est permis ; écrire est refusé (voir Problèmes)."),
      },
      callout: {
        tone: "version",
        text: L(
          "`readonly` properties: PHP 8.1. `readonly class` (every property readonly): PHP 8.2. PHP 8.5 adds `clone($obj, ['prop' => value])` to copy with changes.",
          "Propriétés `readonly` : PHP 8.1. `readonly class` (toutes les propriétés en readonly) : PHP 8.2. PHP 8.5 ajoute `clone($obj, ['prop' => value])` pour copier avec des changements.",
        ),
      },
    },
    {
      kind: "discover",
      title: L("Changing means building a new one", "Changer, c'est en construire un nouveau"),
      body: [
        L(
          "How do you add money to an immutable `Money`? You don't change it: you return a **new** object with the new value. Methods that do this are often named `withSomething()` or verbs like `add()`.",
          "Comment ajouter de l'argent à un `Money` immuable ? Tu ne le modifies pas : tu renvoies un **nouvel** objet avec la nouvelle valeur. Les méthodes qui font ça s'appellent souvent `withSomething()` ou portent un verbe comme `add()`.",
        ),
        L(
          "PHP itself works this way with dates: `DateTimeImmutable::modify()` returns a new date and leaves the original alone.",
          "PHP lui-même fonctionne ainsi avec les dates : `DateTimeImmutable::modify()` renvoie une nouvelle date et laisse l'originale tranquille.",
        ),
      ],
      example: {
        code: `<?php\nfinal readonly class Money\n{\n    public function __construct(public int $cents, public string $currency) {}\n\n    public function add(Money $other): self\n    {\n        return new self($this->cents + $other->cents, $this->currency);\n    }\n\n    public function format(): string\n    {\n        return sprintf("%.2f %s", $this->cents / 100, $this->currency);\n    }\n}\n\n$a = new Money(1000, "EUR");\n$b = $a->add(new Money(250, "EUR"));\necho $a->format(), "\\n", $b->format();\n`,
      },
    },
    {
      kind: "compare",
      title: L("readonly class on 8.1 vs 8.2", "readonly class en 8.1 et en 8.2"),
      body: L(
        "`readonly class` makes every property readonly in one word. Run it on both versions.",
        "`readonly class` rend toutes les propriétés readonly en un seul mot. Exécute-le sur les deux versions.",
      ),
      code: `<?php\nreadonly class Point\n{\n    public function __construct(public int $x, public int $y) {}\n}\n\n$p = new Point(1, 2);\necho $p->x + $p->y;\n`,
      versions: ["8.1", "8.2"],
      takeaway: L(
        "8.1 knows readonly properties but not readonly classes, so it stops with a Parse error; 8.2 prints 3.",
        "La 8.1 connaît les propriétés readonly mais pas les classes readonly, elle s'arrête donc sur une Parse error ; la 8.2 affiche 3.",
      ),
    },
    {
      kind: "watch",
      title: L("A temperature through the day", "Une température au fil de la journée"),
      body: L(
        "`warmer()` never touches `$this`: it builds a new Temperature. Watch three separate objects appear in the Variables panel, each keeping its own value.",
        "`warmer()` ne touche jamais `$this` : elle construit une nouvelle Temperature. Regarde trois objets distincts apparaître dans le panneau Variables, chacun gardant sa propre valeur.",
      ),
      code: `<?php\nfinal class Temperature\n{\n    public function __construct(public readonly float $celsius)\n    {\n    }\n\n    public function warmer(float $by): self\n    {\n        $next = new self($this->celsius + $by);\n        return $next;\n    }\n}\n\n$morning = new Temperature(12.5);\n$noon = $morning->warmer(6);\n$evening = $noon->warmer(-4);\necho "$morning->celsius → $noon->celsius → $evening->celsius";\n`,
      notes: {
        15: L("The morning temperature is fixed for good at 12.5.", "La température du matin est fixée pour de bon à 12.5."),
        10: L("A brand-new object is built; the current one stays as it was.", "Un tout nouvel objet est construit ; l'actuel reste tel quel."),
        16: L("`$morning` still says 12.5, `$noon` says 18.5.", "`$morning` vaut toujours 12.5, `$noon` vaut 18.5."),
        18: L("Three objects, three moments, none of them changed.", "Trois objets, trois moments, aucun n'a été modifié."),
      },
    },
    {
      kind: "quiz",
      title: L("Immutable dates", "Des dates immuables"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$a = new DateTimeImmutable('2025-01-01');\n$b = $a->modify('+1 day');\necho $a->format('d') . ' ' . $b->format('d');\n`,
      options: ["02 02", "01 02", "01 01", "Error"],
      answer: 1,
      explain: L(
        "`modify()` on a DateTimeImmutable returns a new date: `$a` stays on the 1st, `$b` is the 2nd. With the older `DateTime` class, `$a` would have changed too.",
        "`modify()` sur une DateTimeImmutable renvoie une nouvelle date : `$a` reste au 1er, `$b` est le 2. Avec l'ancienne classe `DateTime`, `$a` aurait changé aussi.",
      ),
    },
    {
      kind: "try",
      title: L("Freeze the coordinates", "Fige les coordonnées"),
      body: L(
        "GPS coordinates of a place should never change. Make `$lat` and `$lng` readonly (add the word to each property, or make the whole class readonly).",
        "Les coordonnées GPS d'un lieu ne devraient jamais changer. Rends `$lat` et `$lng` readonly (ajoute le mot à chaque propriété, ou rends toute la classe readonly).",
      ),
      files: { "index.php": `<?php\nfinal class Coordinates\n{\n    public function __construct(\n        public float $lat,\n        public float $lng,\n    ) {}\n}\n\n$paris = new Coordinates(48.8566, 2.3522);\necho "$paris->lat, $paris->lng";\n` },
      solution: { "index.php": `<?php\nfinal readonly class Coordinates\n{\n    public function __construct(\n        public float $lat,\n        public float $lng,\n    ) {}\n}\n\n$paris = new Coordinates(48.8566, 2.3522);\necho "$paris->lat, $paris->lng";\n` },
      probes: ["(new ReflectionProperty('Coordinates', 'lat'))->isReadOnly() && (new ReflectionProperty('Coordinates', 'lng'))->isReadOnly()"],
      objectives: [
        {
          id: "readonly",
          label: L("Both properties are readonly, and it still prints 48.8566, 2.3522", "Les deux propriétés sont readonly, et ça affiche toujours 48.8566, 2.3522"),
          check: all(probeIs("(new ReflectionProperty('Coordinates', 'lat'))->isReadOnly() && (new ReflectionProperty('Coordinates', 'lng'))->isReadOnly()", true), outputIs("48.8566, 2.3522")),
          hints: [
            L("`readonly` goes right after the visibility, or before `class`.", "`readonly` se place juste après la visibilité, ou avant `class`."),
            L("`public readonly float $lat,` or `final readonly class Coordinates`.", "`public readonly float $lat,` ou `final readonly class Coordinates`."),
            L("Change line 2 to `final readonly class Coordinates`.", "Change la ligne 2 en `final readonly class Coordinates`."),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("Immutable settings", "Des réglages immuables"),
      body: L(
        "Write a `final readonly class Settings` with promoted `string $theme` and `int $fontSize`. The constructor throws an `InvalidArgumentException` if the size isn't between 8 and 32. Add `withTheme(string $theme): self` and `withFontSize(int $size): self`, which return **new** objects.",
        "Écris une `final readonly class Settings` avec `string $theme` et `int $fontSize` promues. Le constructeur lance une `InvalidArgumentException` si la taille n'est pas entre 8 et 32. Ajoute `withTheme(string $theme): self` et `withFontSize(int $size): self`, qui renvoient de **nouveaux** objets.",
      ),
      files: {
        "index.php": `<?php\n// Write a final readonly class Settings with:\n//  - promoted properties: string $theme, int $fontSize\n//  - the constructor throws InvalidArgumentException when fontSize is not between 8 and 32\n//  - withTheme(string $theme): self and withFontSize(int $size): self return NEW objects\n\n$default = new Settings("light", 14);\n$dark = $default->withTheme("dark");\n$big = $dark->withFontSize(20);\n\necho "$default->theme $default->fontSize\\n";\necho "$big->theme $big->fontSize\\n";\n`,
      },
      solution: {
        "index.php": `<?php\nfinal readonly class Settings\n{\n    public function __construct(public string $theme, public int $fontSize)\n    {\n        if ($fontSize < 8 || $fontSize > 32) {\n            throw new InvalidArgumentException("Font size must be between 8 and 32, got $fontSize");\n        }\n    }\n\n    public function withTheme(string $theme): self\n    {\n        return new self($theme, $this->fontSize);\n    }\n\n    public function withFontSize(int $size): self\n    {\n        return new self($this->theme, $size);\n    }\n}\n\n$default = new Settings("light", 14);\n$dark = $default->withTheme("dark");\n$big = $dark->withFontSize(20);\n\necho "$default->theme $default->fontSize\\n";\necho "$big->theme $big->fontSize\\n";\n`,
      },
      probes: [
        "(new ReflectionProperty('Settings', 'theme'))->isReadOnly() && (new ReflectionProperty('Settings', 'fontSize'))->isReadOnly()",
        "new Settings('light', 99)",
        "(new Settings('light', 12))->withFontSize(2)",
      ],
      objectives: [
        {
          id: "readonly",
          label: L("Settings is readonly", "Settings est readonly"),
          check: probeIs("(new ReflectionProperty('Settings', 'theme'))->isReadOnly() && (new ReflectionProperty('Settings', 'fontSize'))->isReadOnly()", true),
          hints: [
            L("Start with the class line and a promoted constructor.", "Commence par la ligne de la classe et un constructeur promu."),
            L("`final readonly class Settings { public function __construct(public string $theme, public int $fontSize) { … } }`", "`final readonly class Settings { public function __construct(public string $theme, public int $fontSize) { … } }`"),
            L("Write the class from the previous hint above the script.", "Écris la classe de l'indice précédent au-dessus du script."),
          ],
        },
        {
          id: "with",
          label: L("with-methods return new objects (prints light 14, then dark 20)", "les méthodes with renvoient de nouveaux objets (affiche light 14, puis dark 20)"),
          check: outputLines(["light 14", "dark 20"]),
          hints: [
            L("Each with-method calls `new self(...)` with one value replaced.", "Chaque méthode with appelle `new self(...)` en remplaçant une seule valeur."),
            L("`return new self($theme, $this->fontSize);`", "`return new self($theme, $this->fontSize);`"),
            L(
              "`public function withTheme(string $theme): self { return new self($theme, $this->fontSize); }` and the same idea for `withFontSize`.",
              "`public function withTheme(string $theme): self { return new self($theme, $this->fontSize); }` et la même idée pour `withFontSize`.",
            ),
          ],
        },
        {
          id: "validate",
          label: L("Sizes outside 8–32 throw an InvalidArgumentException", "Les tailles hors de 8–32 lancent une InvalidArgumentException"),
          check: all(probeThrows("new Settings('light', 99)", "InvalidArgumentException"), probeThrows("(new Settings('light', 12))->withFontSize(2)", "InvalidArgumentException")),
          hints: [
            L("Validate in the constructor: since with-methods call `new self`, they're protected too.", "Valide dans le constructeur : comme les méthodes with appellent `new self`, elles sont protégées aussi."),
            L("`if ($fontSize < 8 || $fontSize > 32) { throw new InvalidArgumentException(\"…\"); }`", "`if ($fontSize < 8 || $fontSize > 32) { throw new InvalidArgumentException(\"…\"); }`"),
            L("Put that `if` inside the constructor's body.", "Mets ce `if` dans le corps du constructeur."),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("`readonly` properties (8.1) are set once; `readonly class` (8.2) does it for all of them.", "Les propriétés `readonly` (8.1) se remplissent une fois ; `readonly class` (8.2) le fait pour toutes."),
    L("Immutable objects are safe to share: to change one, return a new one (`withX()`).", "Les objets immuables se partagent sans risque : pour en changer un, renvoie-en un nouveau (`withX()`)."),
    L("Prefer `DateTimeImmutable` over `DateTime` for the same reason.", "Préfère `DateTimeImmutable` à `DateTime` pour la même raison."),
  ],
};

export const magicMethods: Lesson = {
  id: "magic-methods",
  chapterId: CH,
  title: L("Magic methods", "Les méthodes magiques"),
  tagline: L("__toString, __get, __set, __call, __invoke: PHP calls them for you", "__toString, __get, __set, __call, __invoke : PHP les appelle pour toi"),
  xp: 60,
  syntax: ["__toString", "__get", "__set", "__isset", "__call", "__invoke", "Stringable"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Methods you never call yourself", "Des méthodes que tu n'appelles jamais"),
      body: [
        L(
          "You already know one: `__construct`, which PHP runs during `new`. **Magic methods** start with two underscores and are triggered by PHP at specific moments, like a doorbell: you don't call the bell, pressing the button does.",
          "Tu en connais déjà une : `__construct`, que PHP exécute pendant `new`. Les **méthodes magiques** commencent par deux tirets bas et sont déclenchées par PHP à des moments précis, comme une sonnette : tu n'appelles pas la sonnette, c'est le bouton qui le fait.",
        ),
        L(
          "`__toString()` runs whenever the object is used as text: `echo $money`, `\"Total: $money\"`. Any class that has it automatically counts as `Stringable` (PHP 8.0).",
          "`__toString()` s'exécute dès que l'objet est utilisé comme du texte : `echo $money`, `\"Total: $money\"`. Toute classe qui l'a compte automatiquement comme `Stringable` (PHP 8.0).",
        ),
      ],
      example: {
        code: `<?php\nclass Money\n{\n    public function __construct(private int $cents, private string $currency = "EUR") {}\n\n    public function __toString(): string\n    {\n        return number_format($this->cents / 100, 2) . " " . $this->currency;\n    }\n}\n\n$price = new Money(1250);\necho $price, "\\n";\necho "Total: $price\\n";\nvar_dump($price instanceof Stringable);\n`,
      },
    },
    {
      kind: "discover",
      title: L("__get, __set, __call and __invoke", "__get, __set, __call et __invoke"),
      body: [
        L(
          "`__get($name)` and `__set($name, $value)` run when someone reads or writes a property that doesn't exist (or isn't visible). Handy for a settings bag, but use them sparingly: they hide what a class really contains.",
          "`__get($name)` et `__set($name, $value)` s'exécutent quand on lit ou écrit une propriété qui n'existe pas (ou n'est pas visible). Pratique pour un sac de réglages, mais à utiliser avec parcimonie : elles cachent ce que contient vraiment une classe.",
        ),
        L(
          "`__call($name, $args)` catches calls to methods that don't exist, and `__invoke()` lets you call an object like a function: `$triple(5)`. Invokable objects can be passed anywhere a callable is expected, like `array_map()`.",
          "`__call($name, $args)` attrape les appels à des méthodes qui n'existent pas, et `__invoke()` permet d'appeler un objet comme une fonction : `$triple(5)`. Les objets invocables se passent partout où un callable est attendu, comme `array_map()`.",
        ),
      ],
      examples: [
        {
          code: `<?php\nclass Config\n{\n    private array $data = [];\n\n    public function __get(string $key): mixed\n    {\n        return $this->data[$key] ?? null;\n    }\n\n    public function __set(string $key, mixed $value): void\n    {\n        $this->data[$key] = $value;\n    }\n\n    public function __isset(string $key): bool\n    {\n        return isset($this->data[$key]);\n    }\n}\n\n$c = new Config();\n$c->debug = true;\n$c->name = "shop";\nvar_dump($c->debug, isset($c->missing), $c->name);\n`,
          caption: L("`$debug` and `$name` aren't real properties: they live in the private array.", "`$debug` et `$name` ne sont pas de vraies propriétés : elles vivent dans le tableau privé."),
        },
        {
          code: `<?php\nclass Multiplier\n{\n    public function __construct(private int $factor) {}\n\n    public function __invoke(int $n): int\n    {\n        return $n * $this->factor;\n    }\n}\n\nclass Greeter\n{\n    public function __call(string $name, array $args): string\n    {\n        return ucfirst($name) . ", " . ($args[0] ?? "friend") . "!";\n    }\n}\n\n$triple = new Multiplier(3);\necho $triple(5), "\\n";\necho implode(", ", array_map($triple, [1, 2, 3])), "\\n";\n\n$g = new Greeter();\necho $g->hello("Ada"), "\\n";\necho $g->bonjour();\n`,
          caption: L("`hello()` and `bonjour()` don't exist: `__call` answers for them.", "`hello()` et `bonjour()` n'existent pas : `__call` répond à leur place."),
        },
      ],
    },
    {
      kind: "compare",
      title: L("Dynamic properties on 8.1 vs 8.2", "Les propriétés dynamiques en 8.1 et en 8.2"),
      body: L(
        "Writing a property that was never declared used to silently create it. That hid typos for years. Compare both versions.",
        "Écrire une propriété jamais déclarée la créait silencieusement. Ça a caché des fautes de frappe pendant des années. Compare les deux versions.",
      ),
      code: `<?php\nclass User\n{\n    public string $name = "Ada";\n}\n\n$u = new User();\n$u->nmae = "Grace";\necho $u->name;\n`,
      versions: ["8.1", "8.2"],
      takeaway: L(
        "Both print Ada (the typo `nmae` created a new property instead of changing `name`), but PHP 8.2 now flags it with a Deprecated notice. Declare your properties, or use `__get`/`__set` on purpose.",
        "Les deux affichent Ada (la faute `nmae` a créé une nouvelle propriété au lieu de changer `name`), mais PHP 8.2 le signale maintenant avec un avis Deprecated. Déclare tes propriétés, ou utilise `__get`/`__set` exprès.",
      ),
    },
    {
      kind: "watch",
      title: L("An HTML tag builder", "Un constructeur de balises HTML"),
      body: L(
        "`$link->href = …` doesn't find a property, so PHP calls `__set`. `echo $link` needs text, so PHP calls `__toString`. Watch the call stack show these magic calls.",
        "`$link->href = …` ne trouve pas de propriété, donc PHP appelle `__set`. `echo $link` a besoin de texte, donc PHP appelle `__toString`. Regarde la pile d'appels montrer ces appels magiques.",
      ),
      code: `<?php\nclass Tag\n{\n    private array $attrs = [];\n\n    public function __construct(private string $name)\n    {\n    }\n\n    public function __set(string $key, string $value): void\n    {\n        $this->attrs[$key] = $value;\n    }\n\n    public function __toString(): string\n    {\n        $html = "<{$this->name}";\n        foreach ($this->attrs as $k => $v) {\n            $html .= " $k=\\"$v\\"";\n        }\n        return $html . ">";\n    }\n}\n\n$link = new Tag("a");\n$link->href = "/home";\n$link->title = "Home";\necho $link;\n`,
      notes: {
        25: L("A Tag object with a private name and an empty attribute list.", "Un objet Tag avec un nom privé et une liste d'attributs vide."),
        12: L("`href` isn't a property, so PHP hands the assignment to `__set`.", "`href` n'est pas une propriété, donc PHP confie l'affectation à `__set`."),
        17: L("`echo` needs a string: PHP calls `__toString` for you.", "`echo` a besoin d'une chaîne : PHP appelle `__toString` pour toi."),
        28: L("The final text: `<a href=\"/home\" title=\"Home\">`.", "Le texte final : `<a href=\"/home\" title=\"Home\">`."),
      },
    },
    {
      kind: "quiz",
      title: L("An object inside a string", "Un objet dans une chaîne"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\nclass Celsius\n{\n    public function __construct(private float $deg) {}\n\n    public function __toString(): string\n    {\n        return $this->deg . "°C";\n    }\n}\n\n$t = new Celsius(21.5);\necho "It is $t today";\n`,
      options: ["It is 21.5°C today", "It is Celsius today", "It is  today", "Error"],
      answer: 0,
      explain: L(
        "Interpolating `$t` in a string needs text, so PHP calls `__toString()`, which returns \"21.5°C\".",
        "Interpoler `$t` dans une chaîne demande du texte, donc PHP appelle `__toString()`, qui renvoie « 21.5°C ».",
      ),
    },
    {
      kind: "try",
      title: L("Print a product", "Affiche un produit"),
      body: L(
        "`echo $coffee` fails: PHP doesn't know how to turn a Product into text. Add `__toString(): string` that returns the name and the price with two decimals, like `Coffee (3.50 €)`.",
        "`echo $coffee` échoue : PHP ne sait pas transformer un Product en texte. Ajoute `__toString(): string` qui renvoie le nom et le prix avec deux décimales, comme `Coffee (3.50 €)`.",
      ),
      files: {
        "index.php": `<?php\nclass Product\n{\n    public function __construct(\n        private string $name,\n        private float $price,\n    ) {}\n\n    // Add __toString(): string → "Coffee (3.50 €)"\n}\n\n$coffee = new Product("Coffee", 3.5);\necho $coffee;\n`,
      },
      solution: {
        "index.php": `<?php\nclass Product\n{\n    public function __construct(\n        private string $name,\n        private float $price,\n    ) {}\n\n    public function __toString(): string\n    {\n        return sprintf("%s (%.2f €)", $this->name, $this->price);\n    }\n}\n\n$coffee = new Product("Coffee", 3.5);\necho $coffee;\n`,
      },
      probes: ["(string) new Product('Tea', 2)", "new Product('Tea', 2) instanceof Stringable"],
      objectives: [
        {
          id: "tostring",
          label: L("echo prints: Coffee (3.50 €)", "echo affiche : Coffee (3.50 €)"),
          check: all(outputIs("Coffee (3.50 €)"), probeShows("(string) new Product('Tea', 2)", '"Tea (2.00 €)"'), probeIs("new Product('Tea', 2) instanceof Stringable", true)),
          hints: [
            L("`__toString` must return a string built from the name and the formatted price.", "`__toString` doit renvoyer une chaîne construite avec le nom et le prix formaté."),
            L("`number_format($this->price, 2)` or `sprintf(\"%.2f\", $this->price)` gives two decimals.", "`number_format($this->price, 2)` ou `sprintf(\"%.2f\", $this->price)` donne deux décimales."),
            L(
              "`public function __toString(): string { return sprintf(\"%s (%.2f €)\", $this->name, $this->price); }`",
              "`public function __toString(): string { return sprintf(\"%s (%.2f €)\", $this->name, $this->price); }`",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "challenge",
      title: L("A magic HTML helper", "Un assistant HTML magique"),
      body: L(
        "Build `Html` with two magic methods: `__call` so that `$html->strong(\"Hi\")` returns `<strong>Hi</strong>` for **any** tag name, and `__invoke` so that `$html(\"Hello\")` returns `<p>Hello</p>`.",
        "Construis `Html` avec deux méthodes magiques : `__call` pour que `$html->strong(\"Hi\")` renvoie `<strong>Hi</strong>` pour **n'importe quel** nom de balise, et `__invoke` pour que `$html(\"Hello\")` renvoie `<p>Hello</p>`.",
      ),
      files: {
        "index.php": `<?php\nclass Html\n{\n    // __call(string $tag, array $args): string\n    //   $html->strong("Hi") returns "<strong>Hi</strong>" (works for any tag)\n    // __invoke(string $text): string\n    //   $html("Hello") returns "<p>Hello</p>"\n}\n\n$html = new Html();\necho $html->strong("PHP"), " is ", $html->em("fun"), "\\n";\necho $html("Magic methods are called for you.");\n`,
      },
      solution: {
        "index.php": `<?php\nclass Html\n{\n    public function __call(string $tag, array $args): string\n    {\n        return "<$tag>" . ($args[0] ?? "") . "</$tag>";\n    }\n\n    public function __invoke(string $text): string\n    {\n        return "<p>$text</p>";\n    }\n}\n\n$html = new Html();\necho $html->strong("PHP"), " is ", $html->em("fun"), "\\n";\necho $html("Magic methods are called for you.");\n`,
      },
      probes: ["(new Html())->strong('Hi')", "(new Html())->h1('Title')", "(new Html())('Hello')"],
      objectives: [
        {
          id: "call",
          label: L("Any tag works: ->strong('Hi') gives <strong>Hi</strong>", "Toute balise marche : ->strong('Hi') donne <strong>Hi</strong>"),
          check: all(probeShows("(new Html())->strong('Hi')", '"<strong>Hi</strong>"'), probeShows("(new Html())->h1('Title')", '"<h1>Title</h1>"')),
          hints: [
            L("`__call` receives the method name (the tag) and an array of the arguments.", "`__call` reçoit le nom de la méthode (la balise) et un tableau des arguments."),
            L("The text is `$args[0]`; build `\"<$tag>\" . $args[0] . \"</$tag>\"`.", "Le texte est `$args[0]` ; construis `\"<$tag>\" . $args[0] . \"</$tag>\"`."),
            L(
              "`public function __call(string $tag, array $args): string { return \"<$tag>\" . ($args[0] ?? \"\") . \"</$tag>\"; }`",
              "`public function __call(string $tag, array $args): string { return \"<$tag>\" . ($args[0] ?? \"\") . \"</$tag>\"; }`",
            ),
          ],
        },
        {
          id: "invoke",
          label: L("$html('Hello') gives <p>Hello</p>", "$html('Hello') donne <p>Hello</p>"),
          check: probeShows("(new Html())('Hello')", '"<p>Hello</p>"'),
          hints: [
            L("`__invoke` runs when the object is called like a function.", "`__invoke` s'exécute quand on appelle l'objet comme une fonction."),
            L("`public function __invoke(string $text): string { … }`", "`public function __invoke(string $text): string { … }`"),
            L("`public function __invoke(string $text): string { return \"<p>$text</p>\"; }`", "`public function __invoke(string $text): string { return \"<p>$text</p>\"; }`"),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Magic methods start with `__` and PHP calls them at specific moments.", "Les méthodes magiques commencent par `__` et PHP les appelle à des moments précis."),
    L("`__toString` turns an object into text; such classes are `Stringable`.", "`__toString` transforme un objet en texte ; ces classes sont `Stringable`."),
    L("`__get`/`__set` handle unknown properties, `__call` unknown methods, `__invoke` calling the object.", "`__get`/`__set` gèrent les propriétés inconnues, `__call` les méthodes inconnues, `__invoke` l'appel de l'objet."),
    L("Since PHP 8.2, creating undeclared properties is deprecated.", "Depuis PHP 8.2, créer des propriétés non déclarées est déprécié."),
  ],
};

export const bossBank: Lesson = {
  id: "boss-bank",
  chapterId: CH,
  title: L("Boss: the bank", "Boss : la banque"),
  tagline: L("Classes, enums, encapsulation and exceptions, all together", "Classes, enums, encapsulation et exceptions, tout ensemble"),
  xp: 100,
  boss: true,
  syntax: ["final class", "enum", "private", "readonly", "throw", "try/catch", "extends RuntimeException"],
  doc: "guide-oop",
  steps: [
    {
      kind: "discover",
      title: L("Your mission: a tiny bank", "Ta mission : une petite banque"),
      body: [
        L(
          "Banks are the classic OOP example for a reason: money must never appear or vanish by accident. You'll combine everything from this chapter: a class that guards its balance, an enum for transaction types, a readonly owner, and exceptions that refuse bad operations.",
          "Les banques sont l'exemple classique de la POO pour une bonne raison : l'argent ne doit jamais apparaître ou disparaître par accident. Tu vas combiner tout ce chapitre : une classe qui protège son solde, un enum pour les types de transaction, un titulaire en readonly, et des exceptions qui refusent les mauvaises opérations.",
        ),
        L(
          "One new piece: your own exception class. `class InsufficientFundsException extends RuntimeException {}` is enough: its name tells the caller exactly what went wrong, and `catch` can target it.",
          "Une seule nouveauté : ta propre classe d'exception. `class InsufficientFundsException extends RuntimeException {}` suffit : son nom dit exactement à l'appelant ce qui ne va pas, et `catch` peut la viser.",
        ),
      ],
      scene: "exception",
      example: {
        code: `<?php\nclass InsufficientFunds extends RuntimeException {}\n\nfunction withdraw(int $balance, int $amount): int\n{\n    if ($amount > $balance) {\n        throw new InsufficientFunds("Cannot withdraw $amount, balance is $balance");\n    }\n    return $balance - $amount;\n}\n\ntry {\n    echo withdraw(100, 30), "\\n";\n    echo withdraw(100, 500), "\\n";\n} catch (InsufficientFunds $e) {\n    echo "Refused: ", $e->getMessage();\n}\n`,
        caption: L("`try` runs code that may fail; `catch` handles the failure instead of crashing.", "`try` exécute du code qui peut échouer ; `catch` gère l'échec au lieu de planter."),
      },
    },
    {
      kind: "watch",
      title: L("A refused withdrawal", "Un retrait refusé"),
      body: L(
        "Watch what happens when `withdraw(500)` throws: the rest of the `try` block is skipped, the `catch` runs, and the balance is untouched.",
        "Regarde ce qui se passe quand `withdraw(500)` lance une exception : le reste du bloc `try` est sauté, le `catch` s'exécute, et le solde n'a pas bougé.",
      ),
      code: `<?php\nclass Account\n{\n    private int $balance = 0;\n\n    public function deposit(int $amount): void\n    {\n        $this->balance += $amount;\n    }\n\n    public function withdraw(int $amount): void\n    {\n        if ($amount > $this->balance) {\n            throw new RuntimeException("Insufficient funds");\n        }\n        $this->balance -= $amount;\n    }\n\n    public function balance(): int\n    {\n        return $this->balance;\n    }\n}\n\n$acc = new Account();\n$acc->deposit(100);\ntry {\n    $acc->withdraw(30);\n    $acc->withdraw(500);\n    echo "never printed";\n} catch (RuntimeException $e) {\n    echo "Error: " . $e->getMessage() . "\\n";\n}\necho "Balance: " . $acc->balance();\n`,
      notes: {
        26: L("100 is deposited through the only door: `deposit()`.", "100 est déposé par la seule porte : `deposit()`."),
        16: L("30 is fine: the balance drops to 70.", "30, c'est bon : le solde descend à 70."),
        32: L("500 was refused: execution jumped straight here, skipping `never printed`.", "500 a été refusé : l'exécution a sauté directement ici, en passant `never printed`."),
        34: L("The balance is still 70: the exception stopped the bad change before it happened.", "Le solde est toujours 70 : l'exception a stoppé la mauvaise modification avant qu'elle n'arrive."),
      },
    },
    {
      kind: "quiz",
      title: L("try, catch, finally", "try, catch, finally"),
      question: L("What does this print?", "Qu'affiche ce code ?"),
      code: `<?php\n$log = [];\ntry {\n    $log[] = "start";\n    throw new LogicException("boom");\n    $log[] = "after";\n} catch (LogicException $e) {\n    $log[] = "caught";\n} finally {\n    $log[] = "finally";\n}\necho implode(",", $log);\n`,
      options: ["start,after,finally", "start,caught,finally", "start,caught", "caught,finally"],
      answer: 1,
      explain: L(
        "The throw skips \"after\" and jumps to the catch. `finally` always runs, whether there was an exception or not.",
        "Le throw saute « after » et passe au catch. `finally` s'exécute toujours, qu'il y ait eu une exception ou non.",
      ),
    },
    {
      kind: "try",
      title: L("Your own exception", "Ta propre exception"),
      body: L(
        "`pay()` happily returns a negative balance. Create `InsufficientFundsException` (extending `RuntimeException`) and throw it from `pay()` when the price is higher than the balance.",
        "`pay()` renvoie tranquillement un solde négatif. Crée `InsufficientFundsException` (qui étend `RuntimeException`) et lance-la depuis `pay()` quand le prix dépasse le solde.",
      ),
      files: {
        "index.php": `<?php\n// Create a class InsufficientFundsException that extends RuntimeException\n\nfunction pay(int $balance, int $price): int\n{\n    if ($price > $balance) {\n        // throw an InsufficientFundsException here, with a helpful message\n    }\n    return $balance - $price;\n}\n\necho pay(50, 20), "\\n";\ntry {\n    echo pay(10, 99);\n} catch (InsufficientFundsException $e) {\n    echo "Refused: " . $e->getMessage();\n}\n`,
      },
      solution: {
        "index.php": `<?php\nclass InsufficientFundsException extends RuntimeException {}\n\nfunction pay(int $balance, int $price): int\n{\n    if ($price > $balance) {\n        throw new InsufficientFundsException("Price $price is more than the balance $balance");\n    }\n    return $balance - $price;\n}\n\necho pay(50, 20), "\\n";\ntry {\n    echo pay(10, 99);\n} catch (InsufficientFundsException $e) {\n    echo "Refused: " . $e->getMessage();\n}\n`,
      },
      probes: ["is_subclass_of('InsufficientFundsException', 'RuntimeException')", "pay(10, 99)"],
      objectives: [
        {
          id: "class",
          label: L("InsufficientFundsException extends RuntimeException", "InsufficientFundsException étend RuntimeException"),
          check: probeIs("is_subclass_of('InsufficientFundsException', 'RuntimeException')", true),
          hints: [
            L("An exception class can be completely empty: the name is what matters.", "Une classe d'exception peut être complètement vide : c'est le nom qui compte."),
            L("`class InsufficientFundsException extends RuntimeException {}`", "`class InsufficientFundsException extends RuntimeException {}`"),
            L("Replace the first comment with `class InsufficientFundsException extends RuntimeException {}`.", "Remplace le premier commentaire par `class InsufficientFundsException extends RuntimeException {}`."),
          ],
        },
        {
          id: "throw",
          label: L("pay(10, 99) throws it, and the script prints Refused: …", "pay(10, 99) la lance, et le script affiche Refused: …"),
          check: all(probeThrows("pay(10, 99)", "InsufficientFundsException"), outputHas(/^Refused: .+/m)),
          hints: [
            L("Inside the `if`, stop the function with `throw new …`.", "Dans le `if`, arrête la fonction avec `throw new …`."),
            L("`throw new InsufficientFundsException(\"…\");`", "`throw new InsufficientFundsException(\"…\");`"),
            L(
              "Replace the inner comment with `throw new InsufficientFundsException(\"Price $price is more than the balance $balance\");`.",
              "Remplace le commentaire intérieur par `throw new InsufficientFundsException(\"Price $price is more than the balance $balance\");`.",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    {
      kind: "discover",
      title: L("Plan before you code", "Planifie avant de coder"),
      body: [
        L(
          "Before the boss, sketch the design. **What** can change? The balance, through deposits and withdrawals only. **What** never changes? The owner (readonly). **What** is a fixed list? The transaction types (an enum). **What** is forbidden? Zero or negative amounts, and spending more than you have (exceptions).",
          "Avant le boss, esquisse la conception. **Qu'est-ce qui** peut changer ? Le solde, uniquement par dépôts et retraits. **Qu'est-ce qui** ne change jamais ? Le titulaire (readonly). **Qu'est-ce qui** est une liste fixe ? Les types de transaction (un enum). **Qu'est-ce qui** est interdit ? Les montants nuls ou négatifs, et dépenser plus que ce qu'on a (exceptions).",
        ),
        L(
          "Small private helpers keep it tidy: a `guard()` method that checks an amount, and a `record()` method that adds a line to the history. Check each rule with the objectives as you go: press Run often.",
          "De petites méthodes privées gardent le code propre : une méthode `guard()` qui vérifie un montant, et une méthode `record()` qui ajoute une ligne à l'historique. Vérifie chaque règle avec les objectifs au fur et à mesure : exécute souvent.",
        ),
      ],
      callout: {
        tone: "tip",
        text: L(
          "Write the enum and the exception first, then the class, one method at a time.",
          "Écris d'abord l'enum et l'exception, puis la classe, une méthode à la fois.",
        ),
      },
    },
    {
      kind: "challenge",
      title: L("Build the bank", "Construis la banque"),
      body: L(
        "Follow the plan in the comments. Objectives are checked by real calls to your class after the script runs: deposits, withdrawals, refused operations and the history.",
        "Suis le plan dans les commentaires. Les objectifs sont vérifiés par de vrais appels à ta classe après l'exécution du script : dépôts, retraits, opérations refusées et historique.",
      ),
      files: {
        "index.php": `<?php\n// Build a tiny bank. See the objectives on the left.\n// 1. enum TransactionType: string, with Deposit = 'deposit' and Withdrawal = 'withdrawal'\n// 2. class InsufficientFundsException extends RuntimeException {}\n// 3. final class BankAccount\n//    - __construct(public readonly string $owner)\n//    - private int $balance = 0; private array $history = [];\n//    - deposit(int $amount): void   → InvalidArgumentException if $amount <= 0\n//    - withdraw(int $amount): void  → InvalidArgumentException if $amount <= 0,\n//                                     InsufficientFundsException if more than the balance\n//    - balance(): int\n//    - history(): array             → ["deposit 100", "withdrawal 30", …]\n\n$account = new BankAccount("Ada");\n$account->deposit(100);\n$account->withdraw(30);\n\ntry {\n    $account->withdraw(500);\n} catch (InsufficientFundsException $e) {\n    echo "Refused: " . $e->getMessage() . "\\n";\n}\n\necho "Balance: " . $account->balance() . "\\n";\necho implode("\\n", $account->history());\n`,
      },
      solution: {
        "index.php": `<?php\nenum TransactionType: string\n{\n    case Deposit = 'deposit';\n    case Withdrawal = 'withdrawal';\n}\n\nclass InsufficientFundsException extends RuntimeException {}\n\nfinal class BankAccount\n{\n    private int $balance = 0;\n    private array $history = [];\n\n    public function __construct(public readonly string $owner) {}\n\n    public function deposit(int $amount): void\n    {\n        $this->guard($amount);\n        $this->balance += $amount;\n        $this->record(TransactionType::Deposit, $amount);\n    }\n\n    public function withdraw(int $amount): void\n    {\n        $this->guard($amount);\n        if ($amount > $this->balance) {\n            throw new InsufficientFundsException("Cannot withdraw $amount, balance is {$this->balance}");\n        }\n        $this->balance -= $amount;\n        $this->record(TransactionType::Withdrawal, $amount);\n    }\n\n    public function balance(): int\n    {\n        return $this->balance;\n    }\n\n    public function history(): array\n    {\n        return $this->history;\n    }\n\n    private function guard(int $amount): void\n    {\n        if ($amount <= 0) {\n            throw new InvalidArgumentException("Amount must be positive, got $amount");\n        }\n    }\n\n    private function record(TransactionType $type, int $amount): void\n    {\n        $this->history[] = $type->value . " " . $amount;\n    }\n}\n\n$account = new BankAccount("Ada");\n$account->deposit(100);\n$account->withdraw(30);\n\ntry {\n    $account->withdraw(500);\n} catch (InsufficientFundsException $e) {\n    echo "Refused: " . $e->getMessage() . "\\n";\n}\n\necho "Balance: " . $account->balance() . "\\n";\necho implode("\\n", $account->history());\n`,
      },
      probes: [
        "TransactionType::from('withdrawal')->name",
        "(new ReflectionProperty('BankAccount', 'balance'))->isPrivate() && (new ReflectionProperty('BankAccount', 'owner'))->isReadOnly()",
        "(function () { $a = new BankAccount('Ada'); $a->deposit(100); $a->withdraw(40); $a->deposit(15); return $a->balance(); })()",
        "(new BankAccount('Ada'))->deposit(-5)",
        "(new BankAccount('Ada'))->withdraw(0)",
        "(function () { $a = new BankAccount('Ada'); $a->deposit(50); $a->withdraw(80); })()",
        "(function () { $a = new BankAccount('Ada'); $a->deposit(50); try { $a->withdraw(80); } catch (Throwable $e) {} return $a->balance(); })()",
        "(function () { $a = new BankAccount('Ada'); $a->deposit(100); $a->withdraw(30); return $a->history(); })()",
      ],
      objectives: [
        {
          id: "types",
          label: L("A backed enum TransactionType and a BankAccount with a private balance and readonly owner", "Un enum typé TransactionType et un BankAccount avec un solde privé et un titulaire readonly"),
          check: all(
            probeIs("TransactionType::from('withdrawal')->name", "Withdrawal"),
            probeIs("(new ReflectionProperty('BankAccount', 'balance'))->isPrivate() && (new ReflectionProperty('BankAccount', 'owner'))->isReadOnly()", true),
          ),
          hints: [
            L("Start with the declarations: the enum, then the class skeleton with its properties.", "Commence par les déclarations : l'enum, puis le squelette de la classe avec ses propriétés."),
            L(
              "`enum TransactionType: string { case Deposit = 'deposit'; case Withdrawal = 'withdrawal'; }` and `private int $balance = 0;`",
              "`enum TransactionType: string { case Deposit = 'deposit'; case Withdrawal = 'withdrawal'; }` et `private int $balance = 0;`",
            ),
            L(
              "Then `final class BankAccount { private int $balance = 0; private array $history = []; public function __construct(public readonly string $owner) {} }`",
              "Puis `final class BankAccount { private int $balance = 0; private array $history = []; public function __construct(public readonly string $owner) {} }`",
            ),
          ],
        },
        {
          id: "balance",
          label: L("Deposits and withdrawals update the balance", "Les dépôts et retraits mettent à jour le solde"),
          check: all(probeIs("(function () { $a = new BankAccount('Ada'); $a->deposit(100); $a->withdraw(40); $a->deposit(15); return $a->balance(); })()", 75), outputHas(/^Balance: 70$/m)),
          hints: [
            L("`deposit()` adds to `$this->balance`, `withdraw()` subtracts, `balance()` returns it.", "`deposit()` ajoute à `$this->balance`, `withdraw()` retire, `balance()` le renvoie."),
            L("`$this->balance += $amount;` and `$this->balance -= $amount;`", "`$this->balance += $amount;` et `$this->balance -= $amount;`"),
            L(
              "Write the three public methods; the script should then print `Balance: 70`.",
              "Écris les trois méthodes publiques ; le script doit alors afficher `Balance: 70`.",
            ),
          ],
        },
        {
          id: "invalid",
          label: L("Zero or negative amounts throw an InvalidArgumentException", "Les montants nuls ou négatifs lancent une InvalidArgumentException"),
          check: all(probeThrows("(new BankAccount('Ada'))->deposit(-5)", "InvalidArgumentException"), probeThrows("(new BankAccount('Ada'))->withdraw(0)", "InvalidArgumentException")),
          hints: [
            L("Both methods share the same rule: write it once in a private helper.", "Les deux méthodes partagent la même règle : écris-la une fois dans une méthode privée."),
            L("`private function guard(int $amount): void { if ($amount <= 0) { throw new InvalidArgumentException(\"…\"); } }`", "`private function guard(int $amount): void { if ($amount <= 0) { throw new InvalidArgumentException(\"…\"); } }`"),
            L("Call `$this->guard($amount);` on the first line of `deposit()` and of `withdraw()`.", "Appelle `$this->guard($amount);` en première ligne de `deposit()` et de `withdraw()`."),
          ],
        },
        {
          id: "overdraft",
          label: L("Overdrafts throw InsufficientFundsException and leave the balance unchanged", "Les découverts lancent InsufficientFundsException et laissent le solde intact"),
          check: all(
            probeThrows("(function () { $a = new BankAccount('Ada'); $a->deposit(50); $a->withdraw(80); })()", "InsufficientFundsException"),
            probeIs("(function () { $a = new BankAccount('Ada'); $a->deposit(50); try { $a->withdraw(80); } catch (Throwable $e) {} return $a->balance(); })()", 50),
            outputHas(/^Refused: .+/m),
          ),
          hints: [
            L("Check the balance **before** subtracting, so a refused withdrawal changes nothing.", "Vérifie le solde **avant** de soustraire, pour qu'un retrait refusé ne change rien."),
            L("`if ($amount > $this->balance) { throw new InsufficientFundsException(\"…\"); }`", "`if ($amount > $this->balance) { throw new InsufficientFundsException(\"…\"); }`"),
            L(
              "In `withdraw()`, after `guard()`, add that `if`, and only then `$this->balance -= $amount;`. Don't forget to declare the exception class.",
              "Dans `withdraw()`, après `guard()`, ajoute ce `if`, et seulement ensuite `$this->balance -= $amount;`. N'oublie pas de déclarer la classe d'exception.",
            ),
          ],
        },
        {
          id: "history",
          label: L("history() lists the operations, like \"deposit 100\", \"withdrawal 30\"", "history() liste les opérations, comme « deposit 100 », « withdrawal 30 »"),
          check: probeIs("(function () { $a = new BankAccount('Ada'); $a->deposit(100); $a->withdraw(30); return $a->history(); })()", ["deposit 100", "withdrawal 30"]),
          hints: [
            L("Each successful operation adds one line: the enum's value, a space, the amount.", "Chaque opération réussie ajoute une ligne : la valeur de l'enum, un espace, le montant."),
            L("`$this->history[] = $type->value . \" \" . $amount;`", "`$this->history[] = $type->value . \" \" . $amount;`"),
            L(
              "Add `private function record(TransactionType $type, int $amount): void` with that line, call it at the end of deposit and withdraw, and return `$this->history` from `history()`.",
              "Ajoute `private function record(TransactionType $type, int $amount): void` avec cette ligne, appelle-la à la fin de deposit et withdraw, et renvoie `$this->history` depuis `history()`.",
            ),
          ],
        },
      ],
      cheat: "oop",
    },
    { kind: "celebrate" },
  ],
  recap: [
    L("Encapsulation keeps money safe: the balance changes only through methods that check the rules.", "L'encapsulation protège l'argent : le solde ne change que par des méthodes qui vérifient les règles."),
    L("Enums model fixed lists; readonly models what never changes.", "Les enums modélisent les listes fixes ; readonly modélise ce qui ne change jamais."),
    L("Your own exception classes name each failure, and `catch` handles them.", "Tes propres classes d'exception nomment chaque échec, et `catch` les gère."),
    L("Validate before changing state, so a refused operation changes nothing.", "Valide avant de modifier l'état, pour qu'une opération refusée ne change rien."),
  ],
};

export const OOP: Lesson[] = [classesObjects, constructors, encapsulation, inheritance, interfacesTraits, staticConstants, enums, immutability, magicMethods, bossBank];
