#!/usr/bin/env node
/**
 * Reading-experience seam for Signature Green on docs and articles.
 * Expected colors are Palette literals from the identity spec, not values
 * recomputed from the prose CSS under test.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const SPEC = {
  dark: {
    canvas: "#121817",
    panel: "#1c2422",
    raised: "#29332f",
    text: "#edf2ef",
    muted: "#b2beb8",
    divider: "#3b4942",
    highlight: "#71847a",
    accent: "#8fd9c1",
    warning: "#edca7d",
    success: "#9fd3a5",
    info: "#a6caff",
  },
  light: {
    canvas: "#e5ebe7",
    panel: "#f4f7f4",
    raised: "#ffffff",
    text: "#18251e",
    muted: "#526258",
    divider: "#c7d2ca",
    highlight: "#71847a",
    accent: "#0f5f53",
    warning: "#76540b",
    success: "#2d6339",
    info: "#245a93",
  },
};

const failures = [];
const fail = (message) => failures.push(message);

function hex(value) {
  const match = String(value).trim().match(/^#([0-9a-f]{6})$/i);
  return match ? `#${match[1].toLowerCase()}` : null;
}

function extractRules(css, selector) {
  const blocks = [];
  let searchFrom = 0;
  while (searchFrom < css.length) {
    const idx = css.indexOf(selector, searchFrom);
    if (idx === -1) break;
    const before = idx === 0 ? "\n" : css[idx - 1];
    if (idx > 0 && !/[\s,{]/.test(before)) {
      searchFrom = idx + selector.length;
      continue;
    }
    let i = idx + selector.length;
    while (i < css.length && /[\s,]/.test(css[i])) i++;
    if (css[i] === ",") {
      searchFrom = i + 1;
      continue;
    }
    if (css[i] !== "{") {
      searchFrom = idx + selector.length;
      continue;
    }
    let depth = 0;
    const start = i;
    for (; i < css.length; i += 1) {
      if (css[i] === "{") depth += 1;
      else if (css[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          blocks.push(css.slice(start + 1, i));
          searchFrom = i + 1;
          break;
        }
      }
    }
  }
  return blocks;
}

function extractRule(css, selector) {
  return extractRules(css, selector).join("\n");
}

function parseDecls(block) {
  const decls = {};
  if (!block) return decls;
  const stripped = block.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const match of stripped.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    decls[`--${match[1]}`] = match[2].trim();
  }
  return decls;
}

function parseProps(block) {
  const props = {};
  if (!block) return props;
  const stripped = block.replace(/\/\*[\s\S]*?\*\//g, "").replace(/@apply [^;]+;/g, "");
  for (const match of stripped.matchAll(/(^|[;{\s])([a-z-]+)\s*:\s*([^;]+);/gi)) {
    props[match[2].toLowerCase()] = match[3].trim();
  }
  return props;
}

function resolveValue(value, scopes) {
  if (value == null || value === "") return "";
  let current = String(value).trim();
  for (let i = 0; i < 12; i += 1) {
    const match = current.match(/^var\((--[a-z0-9-]+)(?:,\s*([^)]+))?\)$/i);
    if (!match) return current;
    let found;
    for (const scope of scopes) {
      if (scope[match[1]]) {
        found = scope[match[1]];
        break;
      }
    }
    if (!found) return match[2] ? match[2].trim() : current;
    current = found;
  }
  return current;
}

const paletteCss = read("src/styles/palette.css");
const globalCss = read("src/styles/global.css");
const darkDecls = {
  ...parseDecls(extractRule(paletteCss, ":root")),
  ...parseDecls(extractRule(paletteCss, '[data-theme="dark"]')),
};
const lightDecls = {
  ...parseDecls(extractRule(paletteCss, ":root")),
  ...parseDecls(extractRule(paletteCss, '[data-theme="light"]')),
};
const themeAliases = parseDecls(extractRule(globalCss, "@theme"));
const proseDecls = parseDecls(extractRule(globalCss, ".prose-lab"));
const noteRule = extractRule(globalCss, ".prose-lab .note-example") ?? "";
const noteProps = parseProps(noteRule);
const tableRule = extractRule(globalCss, ".prose-lab table") ?? "";
const tableProps = parseProps(tableRule);
const preRule = extractRule(globalCss, ".prose-lab pre") ?? "";
const preProps = parseProps(preRule);
const linkRule = extractRule(globalCss, ".prose-lab a") ?? "";
const proseRule = extractRule(globalCss, ".prose-lab") ?? "";

function resolved(theme, value) {
  const themeDecls = theme === "light" ? lightDecls : darkDecls;
  return hex(resolveValue(value, [proseDecls, themeAliases, themeDecls]));
}

function expectResolved(theme, value, expected, label) {
  const actual = resolved(theme, value);
  if (actual !== expected) {
    fail(`${theme} ${label}: expected ${expected}, got ${actual ?? value}`);
  }
}

function firstColorRef(value) {
  const match = String(value ?? "").match(/var\(--[a-z0-9-]+\)|#[0-9a-f]{6}/i);
  return match ? match[0] : "";
}

function expectContains(haystack, needle, label) {
  if (!haystack.includes(needle)) fail(`${label} missing ${JSON.stringify(needle)}`);
}

function expectNotContains(haystack, needle, label) {
  if (haystack.includes(needle)) fail(`${label} still has ${JSON.stringify(needle)}`);
}

const astroConfig = read("astro.config.mjs");
const layout = read("src/layouts/Layout.astro");
const blogIndex = read("src/pages/blog/index.astro");
const docsIndex = read("src/pages/docs/index.astro");
const article = read("src/pages/blog/[id].astro");
const primer = read("src/content/blog/systemctl-tutorial.md");
const hexaspi = read("src/content/blog/hexaspi.md");

expectContains(layout, 'data-theme="dark"', "Layout default theme");
expectContains(extractRule(globalCss, "body") ?? "", "var(--bg-dark)", "page canvas");
expectContains(blogIndex, "text-muted", "blog index muted text");
expectContains(blogIndex, "divide-line", "blog index divider");
expectContains(docsIndex, "text-muted", "docs index muted text");
expectContains(docsIndex, "text-lab", "docs index accent-text links");
expectContains(docsIndex, "underline", "docs index persistent underline");
expectContains(article, "prose-lab", "article reading surface");
expectContains(primer, "| What |", "primer table");
expectContains(primer, "```bash", "primer code block");
expectContains(astroConfig, "syntax-theme.json", "syntax colors use Palette variables");
expectContains(read("src/styles/syntax-theme.json"), "var(--shiki-background)", "syntax theme nested background");
expectContains(hexaspi, "note-example", "example panel");
expectContains(hexaspi, 'href="/products/dnl-n6"', "inline article link");

for (const theme of ["dark", "light"]) {
  expectResolved(theme, "var(--bg-dark)", SPEC[theme].canvas, "canvas");
  expectResolved(theme, "var(--text)", SPEC[theme].text, "primary text");
  expectResolved(theme, "var(--text-muted)", SPEC[theme].muted, "muted text");
  expectResolved(theme, "var(--divider)", SPEC[theme].divider, "divider");
}

expectContains(article, "text-lab underline", "article chrome accent-text underline");
expectNotContains(article, "hover:underline", "article chrome hover-only underline");
expectContains(linkRule, "underline", "prose links persistent underline");
for (const theme of ["dark", "light"]) {
  expectResolved(theme, "var(--tw-prose-links)", SPEC[theme].accent, "prose accent-text links");
  expectResolved(theme, "var(--tw-prose-headings)", SPEC[theme].text, "prose headings");
  expectResolved(theme, "var(--tw-prose-bold)", SPEC[theme].text, "prose bold");
  expectResolved(theme, "var(--tw-prose-quotes)", SPEC[theme].text, "prose quotes");
  expectResolved(theme, "var(--tw-prose-code)", SPEC[theme].accent, "prose inline code");
  expectResolved(theme, "var(--tw-prose-pre-bg)", SPEC[theme].panel, "code block panel");
  expectResolved(theme, "var(--tw-prose-pre-code)", SPEC[theme].text, "code block text");
  expectResolved(theme, "var(--tw-prose-th-borders)", SPEC[theme].divider, "table header separator");
  expectResolved(theme, "var(--tw-prose-td-borders)", SPEC[theme].divider, "table cell separator");
  expectResolved(theme, "var(--tw-prose-hr)", SPEC[theme].divider, "prose separator");
  expectResolved(theme, noteProps.background, SPEC[theme].raised, "example panel raised");
  expectResolved(theme, firstColorRef(noteProps.border), SPEC[theme].divider, "example panel separator");
  expectResolved(theme, noteProps["border-top-color"], SPEC[theme].highlight, "example panel highlight");
  expectResolved(theme, tableProps["background-color"] ?? tableProps.background, SPEC[theme].panel, "table panel");
  expectResolved(theme, firstColorRef(tableProps.border), SPEC[theme].divider, "table outer separator");
  expectResolved(theme, firstColorRef(preProps.border), SPEC[theme].divider, "code block separator");
  expectResolved(theme, "var(--tw-prose-lead)", SPEC[theme].muted, "prose lead");
  expectResolved(theme, "var(--tw-prose-counters)", SPEC[theme].muted, "prose counters");
  expectResolved(theme, "var(--tw-prose-bullets)", SPEC[theme].muted, "prose bullets");
  expectResolved(theme, "var(--tw-prose-quote-borders)", SPEC[theme].divider, "prose quote separator");
  expectResolved(theme, "var(--tw-prose-captions)", SPEC[theme].muted, "prose captions");
  expectResolved(theme, "var(--tw-prose-kbd)", SPEC[theme].text, "prose kbd");
  expectResolved(theme, "var(--shiki-background)", SPEC[theme].panel, "syntax nested background");
  expectResolved(theme, "var(--shiki-foreground)", SPEC[theme].text, "syntax text");
  expectResolved(theme, "var(--shiki-token-keyword)", SPEC[theme].accent, "syntax keyword");
  expectResolved(theme, "var(--shiki-token-comment)", SPEC[theme].muted, "syntax comment");
  expectResolved(theme, "var(--shiki-token-string)", SPEC[theme].success, "syntax string");
  expectResolved(theme, "var(--shiki-token-function)", SPEC[theme].info, "syntax function");
  expectResolved(theme, "var(--shiki-token-constant)", SPEC[theme].warning, "syntax constant");
}

expectNotContains(proseRule, "prose-invert", "prose-invert light leak");

const distBlog = path.join(root, "dist/blog/index.html");
if (fs.existsSync(distBlog)) {
  const pages = {
    blog: read("dist/blog/index.html"),
    docs: read("dist/docs/index.html"),
    primer: read("dist/blog/systemctl-tutorial/index.html"),
    hexaspi: read("dist/blog/hexaspi/index.html"),
  };
  expectContains(pages.blog, 'data-theme="dark"', "built blog dark default");
  expectContains(pages.blog, 'content="#121817"', "built theme-color canvas");
  expectContains(pages.docs, "underline", "built docs underline");
  expectContains(pages.primer, "<table", "built primer table");
  expectContains(pages.primer, "<pre", "built primer code");
  expectNotContains(pages.primer, "#24292e", "built primer github-dark ground");
  expectContains(pages.primer, "var(--shiki-foreground)", "built primer syntax text");
  expectContains(pages.primer, "var(--shiki-token-keyword)", "built primer syntax keyword");
  expectContains(pages.hexaspi, "note-example", "built example panel");
  expectContains(pages.hexaspi, "prose-lab", "built article prose");
  expectContains(pages.hexaspi, "text-lab underline", "built article accent-text underline");
}

if (failures.length) {
  console.error(failures.map((item) => `FAIL ${item}`).join("\n"));
  process.exit(1);
}

console.log("docs reading: Signature Green grounds, links, and nested surfaces pass");
