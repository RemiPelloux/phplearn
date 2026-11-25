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

