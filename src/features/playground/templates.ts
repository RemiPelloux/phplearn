import { L, type Txt } from "@/lib/txt";
import type { PhpVersion } from "@/php/types";

export interface Template {
  id: string;
  title: Txt;
  description: Txt;
  version?: PhpVersion;
  files: Record<string, string>;
  request?: { method?: "GET" | "POST"; query?: Record<string, string>; body?: Record<string, string> };
}

export const TEMPLATES: Template[] = [
  {
    id: "hello",
    title: L("Hello world", "Hello world"),
    description: L("The smallest PHP program, with a variable and a loop.", "Le plus petit programme PHP, avec une variable et une boucle."),
    files: {
      "index.php": `<?php
declare(strict_types=1);

$name = "world";
echo "Hello, $name!\\n";

foreach ([1, 2, 3] as $n) {
    echo "Line $n\\n";
}
`,
    },
  },
  {
    id: "oop",
    title: L("Classes and interfaces", "Classes et interfaces"),
    description: L("An interface, two classes, an enum and polymorphism.", "Une interface, deux classes, une enum et du polymorphisme."),
    files: {
      "index.php": `<?php
declare(strict_types=1);

enum Unit: string
{
    case Cm = 'cm';
    case M = 'm';
}

interface Shape
{
    public function area(): float;
}

final class Rectangle implements Shape
{
    public function __construct(
        private readonly float $w,
        private readonly float $h,
        public readonly Unit $unit = Unit::Cm,
    ) {}

    public function area(): float
    {
        return $this->w * $this->h;
    }
}

final class Circle implements Shape
{
    public function __construct(private readonly float $r) {}

    public function area(): float
    {
        return round(M_PI * $this->r ** 2, 2);
    }
}

$shapes = [new Rectangle(3, 4), new Circle(2)];
foreach ($shapes as $shape) {
    printf("%-10s %6.2f\\n", $shape::class, $shape->area());
}
`,
    },
  },
  {
    id: "project",
    title: L("Multi-file project", "Projet multi-fichiers"),
    description: L("Namespaces and a PSR-4 style autoloader, like Composer does.", "Des namespaces et un autoloader façon PSR-4, comme le fait Composer."),
    files: {
      "index.php": `<?php
declare(strict_types=1);

// A tiny PSR-4 autoloader: App\\Shop\\Cart → src/Shop/Cart.php
spl_autoload_register(function (string $class): void {
    $prefix = 'App\\\\';
    if (!str_starts_with($class, $prefix)) {
        return;
    }
    $path = __DIR__ . '/src/' . str_replace('\\\\', '/', substr($class, strlen($prefix))) . '.php';
    require $path;
});

use App\\Shop\\Cart;
use App\\Shop\\Product;

$cart = new Cart();
$cart->add(new Product('Keyboard', 4900), 1);
$cart->add(new Product('Mouse', 1990), 2);

echo $cart->summary();
`,
      "src/Shop/Product.php": `<?php
declare(strict_types=1);

namespace App\\Shop;

final readonly class Product
{
    public function __construct(
        public string $name,
        public int $priceCents,
    ) {}
}
`,
      "src/Shop/Cart.php": `<?php
declare(strict_types=1);

namespace App\\Shop;

final class Cart
{
    /** @var array<int, array{Product, int}> */
    private array $lines = [];

    public function add(Product $product, int $qty): void
    {
        $this->lines[] = [$product, $qty];
    }

    public function totalCents(): int
    {
        return array_sum(array_map(fn (array $l) => $l[0]->priceCents * $l[1], $this->lines));
    }

    public function summary(): string
    {
        $out = '';
        foreach ($this->lines as [$p, $qty]) {
            $out .= sprintf("%dx %-10s %8.2f €\\n", $qty, $p->name, $p->priceCents * $qty / 100);
        }
        return $out . sprintf("Total: %.2f €\\n", $this->totalCents() / 100);
    }
}
`,
    },
  },
  {
    id: "pdo",
    title: L("SQLite with PDO", "SQLite avec PDO"),
    description: L("An in-memory database, prepared statements and a transaction.", "Une base en mémoire, des requêtes préparées et une transaction."),
    files: {
      "index.php": `<?php
declare(strict_types=1);

$db = new PDO('sqlite::memory:', options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$db->exec('CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, year INTEGER)');

$insert = $db->prepare('INSERT INTO books (title, year) VALUES (:title, :year)');
$db->beginTransaction();
foreach ([['Clean Code', 2008], ['Refactoring', 1999], ['The Pragmatic Programmer', 1999]] as [$title, $year]) {
    $insert->execute(['title' => $title, 'year' => $year]);
}
$db->commit();

$query = $db->prepare('SELECT title, year FROM books WHERE year < :year ORDER BY title');
$query->execute(['year' => 2000]);
foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
    echo "{$row['year']}  {$row['title']}\\n";
}
`,
    },
  },
  {
    id: "api",
    title: L("A JSON API", "Une API JSON"),
    description: L("Route a simulated request and answer with JSON.", "Route une requête simulée et réponds en JSON."),
    request: { method: "GET", query: { action: "greet", name: "Ada" } },
    files: {
      "index.php": `<?php
declare(strict_types=1);

// Change the request with the Request button in the toolbar.
$action = $_GET['action'] ?? 'help';

$response = match ($action) {
    'greet' => ['message' => 'Hello, ' . htmlspecialchars($_GET['name'] ?? 'stranger') . '!'],
    'time' => ['now' => (new DateTimeImmutable('2025-11-20 10:00'))->format(DATE_ATOM)],
    default => ['error' => "Unknown action: $action", 'actions' => ['greet', 'time']],
};

echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
`,
    },
  },
  {
    id: "php85",
    title: L("What's new in PHP 8.5", "Les nouveautés de PHP 8.5"),
    description: L("The pipe operator, array_first/array_last and clone with. Compare it with 8.4!", "L'opérateur pipe, array_first/array_last et clone avec. Compare avec 8.4 !"),
    version: "8.5",
    files: {
      "index.php": `<?php
declare(strict_types=1);

// The pipe operator |> passes the value on the left to the callable on the right.
$slug = "  Hello PHP 8.5 World  "
    |> trim(...)
    |> strtolower(...)
    |> (fn (string $s) => preg_replace('/[^a-z0-9]+/', '-', $s));
echo $slug, "\\n";

// array_first() and array_last()
$versions = ['7.4', '8.0', '8.1', '8.2', '8.3', '8.4', '8.5'];
echo array_first($versions), ' → ', array_last($versions), "\\n";

// clone with: copy a readonly object while changing some properties
final readonly class Point
{
    public function __construct(public int $x, public int $y) {}

    public function withX(int $x): static
    {
        return clone($this, ['x' => $x]);
    }
}
$p = new Point(1, 2);
var_dump($p->withX(10));
`,
    },
  },
];
