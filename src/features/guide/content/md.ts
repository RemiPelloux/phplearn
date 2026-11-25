/**
 * Write docs Markdown in a raw template literal without escaping backticks:
 * `´` stands for a backtick (so ´code´ and ´´´php fences read naturally),
 * and backslashes stay as written (\n shows as \n in code samples).
 * Avoid "$" followed by "{" (template interpolation).
 */
export const md = (s: TemplateStringsArray, ...values: unknown[]) => String.raw(s, ...values).replace(/´/g, "`").replace(/^\n/, "");
