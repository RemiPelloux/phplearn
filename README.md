# PHP Learn

**Learn PHP by writing real PHP, right in your browser.** A beginner-friendly, gamified web app in **English and French**, built like [IA Dev Learn](https://github.com/RemiPelloux/iadevlearn): the same paper & ink design, lesson flow, XP, stars, badges and quests. Every exercise runs on a **real PHP interpreter** (7.4, 8.0, 8.1, 8.2, 8.3, 8.4 or 8.5, compiled to WebAssembly), every program can be **traced line by line**, every error is **explained**, and the course ends with **what changed from PHP 7 to 8.5**, run side by side.

```bash
npm ci
npm run dev        # http://localhost:3000
npm test           # PHP runner + every lesson completable on real PHP, docs, reference examples (Vitest)
npm run e2e        # Playwright: desktop + phone (run `npx next build` first)
```

## Curriculum

62 lessons in 10 chapters, from your first `echo` to PHP 8.5. A test plays every lesson on real PHP: each solution passes every objective, each starter doesn't, and every quiz answer matches what the code really prints.

| # | Chapter | Lessons |
|---|---------|---------|
| 1 | First steps | Hello, PHP · Variables and types · Working with text · Numbers and maths |
| 2 | Decisions and loops | Making decisions · Comparing values · switch and match · Loops · **Boss:** FizzBuzz |
| 3 | Arrays | Lists of values · Keys and values · Transform arrays · Unpacking arrays · **Boss:** the grade book |
| 4 | Functions | Your first functions · Types and named arguments · Closures and arrow functions · Scope, static and recursion · **Boss:** your utility toolkit |
| 5 | Text, dates and data | String functions · Formatting output · Regular expressions · Dates and times · JSON |
| 6 | Objects and classes | Classes and objects · Constructors · Encapsulation · Inheritance · Interfaces and traits · Static members and constants · Enums · Immutable objects · Magic methods · **Boss:** the bank |
| 7 | Errors and debugging | When PHP complains · Exceptions · Your own exceptions · Living with null · Strict types · Debugging like a pro · **Boss:** the broken gradebook |
| 8 | Modern PHP | Namespaces · Autoloading · Generators · Iterators and collections · Attributes · Functional PHP |
| 9 | PHP for the web | From a URL to your script · Forms and validation · Escaping output (XSS) · Databases with PDO · SQL injection · Testing your code · **Boss:** a JSON API |
| 10 | PHP 7 → 8.5: what changed | PHP 7: the great leap · PHP 8.0 · PHP 8.1 · PHP 8.2 · PHP 8.3 · PHP 8.4 · PHP 8.5: the pipe operator · **Boss:** migrate to PHP 8.5 |

Lessons mix **Discover** (explanations, editable runnable examples, animated diagrams), **Watch** (step through a program and see variables change), **Predict** (guess the output), **Compare** (same code on several PHP versions), **Try**, **Challenge** (three-level hints: idea → syntax → walkthrough) and **Celebrate**.

## The editor

A small VS Code: file tabs and explorer, PHP syntax colors, autocomplete, Ctrl+Enter to run, a version picker, and a bottom panel:

- **Output**: stdout with PHP's warnings where they happened, exit code, exact version, time. HTML can be shown rendered.
- **Problems**: every error, warning and deprecation with *what it means* and *how to fix it*, the stack trace, click to jump to the line. The faulty line is also marked in the editor.
- **Trace**: every statement PHP executed, the call stack, and the variables at each step (Alt+↑/↓, play). Works by injecting `declare(ticks=1);` on the same line, so line numbers never move.
- **Variables**: final globals, or the values at the selected trace step.
- **Compare versions**: run the current files on all seven interpreters and flag what differs.

A side **cheat sheet** follows the lesson topic (35 sheets).

## Other pages

- `/playground`: free multi-file IDE with templates (OOP, PSR-4 autoloading, PDO + SQLite, JSON API, PHP 8.5) and a simulated GET/POST request.
- `/versions`: PHP 7.0 → 8.5, every feature with before/after code and an old-vs-new run.
- `/reference`: 165 functions and constructs, each with an editable example.
- `/docs`: how to use the app, 17 in-depth guides, 5 printable cheat sheets. ```` ```php ```` blocks starting with `<?php` run in place.
- `/setup`: install PHP, Composer and VS Code on macOS, Linux, Windows or Docker.
- `/profile`: settings, badges, several profiles, JSON backup and restore.

## Architecture

```
src/
  php/               The PHP runner (shared by the browser and the tests)
    prelude.ts       PHP loaded before your code (7.4-compatible): tick recorder, error/exception handlers, probes
    core.ts          runOn(php, request): writes files, instruments them, runs, parses the result
    worker.ts        Web Worker: one PHP version per worker (@php-wasm/web), restarted after an engine crash
    client.ts        runPhp(): worker pool (2 versions loaded at most), 8 s timeout that kills runaway scripts
    node.ts          Same runner on Node (@php-wasm/node) for Vitest
    explain.ts       Plain-language explanations of PHP error messages (EN + FR)
  features/
    curriculum/      Chapters and lessons, every text { en, fr }. Checks read the real run (output, probes, globals)
    ide/             Editor (CodeMirror), panels, compare runner, runnable Example block
    lesson/          Lesson player, step views, scenes, celebration
    playground/      Playground and templates
    cheats/ reference/ versions/ guide/ setup/ landing/ progress/
  i18n/              useT() dictionaries + useL() inline bilingual text
```

**Probes** let checks test what learners write: a step declares expressions such as `add(2, 3)`, the prelude evaluates them after the script and returns type, value and JSON.

The intl extension and Fibers aren't available in the WebAssembly builds (Fibers crash the engine; the runner detects it and restarts). PHP 7.0 to 7.3 don't exist as WebAssembly builds, so they're described but not run.

## Deploying

`.github/workflows/ci.yml` runs typecheck, lint, unit tests, build and Playwright on every push. Every push to `main` runs `.github/workflows/pages.yml`: unit tests, then a static export (`STATIC_EXPORT=1 BASE_PATH=/<repo>`) deployed to GitHub Pages. The export is about 250 MB, mostly the PHP `.wasm` files, each downloaded by the browser only when that version is used.

Everything is saved in `localStorage` (`phplearn-progress`, `phplearn-playground`, `phplearn-profiles`); there is no backend.
