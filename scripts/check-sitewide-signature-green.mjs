#!/usr/bin/env node
/**
 * Sitewide Signature Green seam: remaining public routes plus removal of
 * compatibility aliases after every consumer has migrated.
 *
 * Expected hexes are Palette literals from the identity spec, not values
 * copied from the CSS under test.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { PALETTE as SPEC } from "./signature-green-palette.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const GONE_ALIASES = [
  "--color-lab",
  "--color-lab-bright",
  "--color-lab-deep",
  "--color-lab-hover",
  "--color-lab-ink",
  "--color-void",
  "--color-paper",
  "--color-mist",
  "--color-line",
  "--color-white",
];

const CANONICAL_THEME = {
  "--color-canvas": "--surface-canvas",
  "--color-panel": "--surface-panel",
  "--color-raised": "--surface-raised",
  "--color-ink": "--text",
  "--color-muted": "--text-muted",
  "--color-divider": "--divider",
  "--color-highlight": "--highlight",
  "--color-accent-text": "--accent-text",
};

const LEFTOVER_CLASS = /\b(?:text-lab|bg-lab|bg-void|bg-paper|bg-mist|border-line|divide-line|decoration-line)\b/;

let failed = 0;
let passed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`ok  ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok  ${name}`);
    console.error(`  ${error.message}`);
  }
}

function hex(value) {
  const match = String(value).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!match) return null;
  let h = match[1].toUpperCase();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return `#${h}`;
}

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function braceBlock(css, prelude) {
  const idx = css.indexOf(prelude);
  if (idx === -1) throw new Error(`missing block ${JSON.stringify(prelude)}`);
  const start = css.indexOf("{", idx);
  if (start === -1) throw new Error(`missing { after ${JSON.stringify(prelude)}`);
  let depth = 0;
  for (let i = start; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start + 1, i);
    }
  }
  throw new Error(`unclosed block ${JSON.stringify(prelude)}`);
}

function customProps(block) {
  const props = {};
  for (const match of block.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    props[match[1]] = match[2].trim();
  }
  return props;
}

function ruleBody(css, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`(?:^|\\n)${escaped}\\s*\\{`, "gm");
  let match;
  let last = null;
  while ((match = re.exec(css))) {
    const before = css.slice(Math.max(0, match.index - 80), match.index);
    if (/,\s*$/.test(before)) continue;
    const start = css.indexOf("{", match.index);
    let depth = 0;
    for (let i = start; i < css.length; i += 1) {
      if (css[i] === "{") depth += 1;
      else if (css[i] === "}") {
        depth -= 1;
        if (depth === 0) {
          last = css.slice(start + 1, i);
          break;
        }
      }
    }
  }
  return last;
}

function resolve(value, maps) {
  let current = String(value).trim();
  for (let step = 0; step < 16; step += 1) {
    const match = current.match(/^var\(\s*(--[a-z0-9-]+)\s*(?:,\s*(.+))?\)$/i);
    if (!match) return current;
    let next;
    for (const map of maps) {
      if (map[match[1]] !== undefined) {
        next = map[match[1]];
        break;
      }
    }
    if (next === undefined) {
      if (match[2]) {
        current = match[2].trim();
        continue;
      }
      throw new Error(`unresolved ${current}`);
    }
    current = String(next).trim();
  }
  throw new Error(`cycle resolving ${value}`);
}

function mustInclude(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} missing ${JSON.stringify(needle)}`);
  }
}

function mustNotInclude(haystack, needle, label) {
  if (haystack.includes(needle)) {
    throw new Error(`${label} still has ${JSON.stringify(needle)}`);
  }
}

function walk(dir, acc = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === "dist" || ent.name === "identity") continue;
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, acc);
    else if (/\.(astro|css|html)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

const paletteCss = read("src/styles/palette.css");
const globalCss = read("src/styles/global.css");
const darkRoles = customProps(braceBlock(paletteCss, ':root,\n[data-theme="dark"]'));
const lightRoles = customProps(braceBlock(paletteCss, '[data-theme="light"]'));
const semantic = customProps(braceBlock(paletteCss, "/* Explicit role names"));
const themeAliases = customProps(braceBlock(globalCss, "@theme"));

function mapsFor(theme) {
  return [theme === "light" ? lightRoles : darkRoles, semantic, themeAliases];
}

function resolvedHex(value, theme) {
  return hex(resolve(value, mapsFor(theme)));
}

test("remaining About route uses accent-text links and divider hairlines", () => {
  const about = read("src/pages/about.astro");
  mustInclude(about, "text-accent-text", "About accent-text");
  mustInclude(about, "underline", "About persistent underline");
  mustInclude(about, "divide-divider", "About divider list");
  mustInclude(about, "border-divider", "About divider border");
  mustInclude(about, "Dino’s Lab designs solder-down modules in Ladispoli", "About copy");
  if (LEFTOVER_CLASS.test(about)) {
    throw new Error("About still uses a compatibility color class");
  }
});

test("remaining Consulting chrome uses canvas and accent-text, not void/lab", () => {
  const consulting = read("src/pages/consulting.astro");
  mustInclude(consulting, "bg-canvas", "Consulting canvas band");
  mustInclude(consulting, "text-accent-text", "Consulting step accent");
  mustInclude(consulting, "divide-divider", "Consulting step dividers");
  mustInclude(consulting, "border-divider", "Consulting section hairlines");
  mustInclude(consulting, "From schematic to assembled board", "Consulting copy");
  mustInclude(consulting, '<ContactForm name="quote" />', "quote form stays");
  mustInclude(consulting, "panel-raised", "quote surface stays");
  if (LEFTOVER_CLASS.test(consulting)) {
    throw new Error("Consulting still uses a compatibility color class");
  }
});

test("Docs empty index, thank-you and 404 use the shared shell and canonical roles", () => {
  const docs = read("src/pages/docs/index.astro");
  const thanks = read("src/pages/thank-you.astro");
  const missing = read("src/pages/404.astro");
  mustInclude(docs, "text-accent-text underline", "Docs accent-text underline");
  mustInclude(docs, "text-muted", "Docs muted copy");
  mustInclude(docs, "Nothing here yet", "Docs empty copy");
  mustInclude(thanks, "Received.", "thank-you heading");
  mustInclude(thanks, "btn-secondary", "thank-you Home");
  mustInclude(thanks, 'href="/"', "thank-you Home target");
  mustInclude(missing, "Page not found", "404 heading");
  mustInclude(missing, "btn-secondary", "404 Home");
  for (const [label, src] of [
    ["docs", docs],
    ["thank-you", thanks],
    ["404", missing],
  ]) {
    mustInclude(src, 'from "@/layouts/Layout.astro"', `${label} shared shell`);
    if (LEFTOVER_CLASS.test(src)) {
      throw new Error(`${label} still uses a compatibility color class`);
    }
  }
});

test("homepage leftovers use divider hairlines and blog-style pointer rows", () => {
  const home = read("src/pages/index.astro");
  mustInclude(home, "border-divider", "homepage divider");
  mustInclude(home, "group-hover:text-accent-text", "homepage pointer accent");
  mustInclude(home, 'href="/products/dnl-n6"', "homepage DNL-N6 pointer");
  mustNotInclude(home, 'href="/products/dnl-n6-dk"', "homepage DevKit pointer");
  mustNotInclude(home, "Inspect in 3D", "homepage Inspect chrome");
  mustNotInclude(home, "ProductCard", "homepage ProductCard");
  mustNotInclude(home, "hover:underline", "homepage hover-only underline");
  if (LEFTOVER_CLASS.test(home)) {
    throw new Error("homepage still uses a compatibility color class");
  }
});

test("compatibility aliases are gone from the Tailwind theme", () => {
  for (const alias of GONE_ALIASES) {
    if (themeAliases[alias]) {
      throw new Error(`still defines ${alias}`);
    }
  }
  mustNotInclude(globalCss, "compatibility aliases for later slices", "@theme comment");
});

test("canonical Tailwind tokens map 1:1 onto remaining Palette roles", () => {
  for (const [token, role] of Object.entries(CANONICAL_THEME)) {
    if (themeAliases[token] !== `var(${role})`) {
      throw new Error(`${token} expected var(${role}), got ${themeAliases[token]}`);
    }
  }
  for (const theme of ["dark", "light"]) {
    const s = SPEC[theme];
    const pairs = [
      ["--color-canvas", s.canvas],
      ["--color-panel", s.panel],
      ["--color-raised", s.raised],
      ["--color-ink", s.text],
      ["--color-muted", s.muted],
      ["--color-divider", s.divider],
      ["--color-highlight", s.highlight],
      ["--color-accent-text", s.accent],
    ];
    for (const [token, expected] of pairs) {
      const actual = resolvedHex(`var(${token})`, theme);
      if (actual !== expected) {
        throw new Error(`${theme} ${token}: expected ${expected}, got ${actual}`);
      }
    }
  }
});

test("src markup and CSS no longer consume obsolete alias classes or vars", () => {
  const hits = [];
  for (const file of walk(join(root, "src"))) {
    const rel = relative(root, file);
    const src = readFileSync(file, "utf8");
    if (LEFTOVER_CLASS.test(src)) hits.push(`${rel} leftover class`);
    for (const alias of GONE_ALIASES) {
      if (src.includes(alias)) hits.push(`${rel} ${alias}`);
    }
  }
  if (hits.length) {
    throw new Error(hits.join("; "));
  }
});

test("shell surfaces, selection, focus and shadows use Palette roles on canvas", () => {
  const body = ruleBody(globalCss, "body") ?? "";
  const selection = ruleBody(globalCss, "::selection") ?? "";
  const focus = globalCss.slice(globalCss.indexOf("a:focus-visible"));
  mustInclude(body, "var(--bg-dark)", "body canvas");
  mustInclude(body, "var(--bg-light)", "body gradient on canvas");
  mustInclude(selection, "var(--primary)", "selection fill");
  mustInclude(selection, "var(--on-primary)", "selection ink");
  mustInclude(focus, "var(--focus-ring)", "focus ring");
  mustInclude(globalCss, "var(--bg-dark)", "shadows/mix use canvas");
  const panel = ruleBody(globalCss, ".panel") ?? "";
  const raised = ruleBody(globalCss, ".panel-raised") ?? "";
  mustInclude(panel, "var(--surface-panel)", "panel fill");
  mustInclude(panel, "var(--divider)", "panel hairline");
  mustInclude(raised, "var(--surface-raised)", "raised fill");
  mustInclude(raised, "var(--divider)", "raised hairline");
  mustInclude(raised, "var(--highlight)", "raised highlight");
  const eyebrow = ruleBody(globalCss, ".eyebrow") ?? "";
  const ghost = ruleBody(globalCss, ".btn-ghost") ?? "";
  const badge = ruleBody(globalCss, ".badge") ?? "";
  if (LEFTOVER_CLASS.test(eyebrow + ghost + badge + panel + raised)) {
    throw new Error("shell classes still apply compatibility utilities");
  }
  mustInclude(eyebrow, "accent-text", "eyebrow accent-text");
  mustInclude(ghost, "accent-text", "ghost accent-text");
  mustInclude(ghost, "raised", "ghost raised hover");
  mustInclude(badge, "divider", "badge divider");
  for (const theme of ["dark", "light"]) {
    const s = SPEC[theme];
    if (resolvedHex("var(--bg-dark)", theme) !== s.canvas) {
      throw new Error(`${theme} canvas expected ${s.canvas}`);
    }
    if (resolvedHex("var(--primary)", theme) !== s.primary) {
      throw new Error(`${theme} primary expected ${s.primary}`);
    }
    if (resolvedHex("var(--on-primary)", theme) !== s.onPrimary) {
      throw new Error(`${theme} on-primary expected ${s.onPrimary}`);
    }
    if (resolvedHex("var(--focus-ring)", theme) !== s.focus) {
      throw new Error(`${theme} focus expected ${s.focus}`);
    }
    if (resolvedHex("var(--accent-text)", theme) !== s.accent) {
      throw new Error(`${theme} accent-text expected ${s.accent}`);
    }
  }
});

test("dark is the default and there is no public theme switcher", () => {
  const layout = read("src/layouts/Layout.astro");
  const header = read("src/components/Header.astro");
  const footer = read("src/components/Footer.astro");
  mustInclude(layout, 'data-theme="dark"', "Layout dark default");
  mustInclude(layout, 'content="#121817"', "theme-color canvas");
  mustNotInclude(layout, "localStorage", "no persisted theme");
  mustNotInclude(header, "data-theme", "header does not toggle theme");
  mustNotInclude(footer, "data-theme", "footer does not toggle theme");
  if (/\btheme(?:\s+switcher)?\b/i.test(header) || /dark mode/i.test(header)) {
    throw new Error("header looks like a public theme switcher");
  }
});

test("intentional Brand green, OG canvas and syntax roles are kept", () => {
  for (const file of ["public/mark.svg", "public/wordmark.svg", "public/logo.svg", "public/favicon.svg"]) {
    mustInclude(read(file), "#2D9282", `${file} Brand green`);
  }
  const og = read("resources/og.html");
  mustInclude(og, "#121817", "OG canvas");
  mustInclude(og, "#2d9282", "OG Brand green bar");
  mustInclude(og, "#edf2ef", "OG text");
  mustInclude(og, "#b2beb8", "OG muted");
  const syntax = read("src/styles/syntax-theme.json");
  mustInclude(syntax, "var(--shiki-background)", "syntax nested background");
  mustInclude(syntax, "var(--shiki-token-keyword)", "syntax keyword role");
  const markCss = ruleBody(globalCss, ".brand-mark") ?? "";
  const wordCss = ruleBody(globalCss, ".brand-wordmark") ?? "";
  const heroCss = ruleBody(globalCss, ".hero-mark") ?? "";
  for (const [label, css] of [
    ["mark", markCss],
    ["wordmark", wordCss],
    ["hero mark", heroCss],
  ]) {
    if (/filter:|invert\(|brightness\(/i.test(css)) {
      throw new Error(`${label} still recolors artwork with a filter`);
    }
  }
});

test("canonical 92-pair Palette matrix runs against committed palette.css", () => {
  const script = join(root, "scripts/palette-contrast.py");
  const result = spawnSync(
    "python3",
    [script, "--palette", "src/styles/palette.css", "--fixed-brand"],
    { cwd: root, encoding: "utf8" },
  );
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() || result.stdout?.trim() || `palette-contrast.py exited ${result.status}`,
    );
  }
  const passes = result.stdout.match(/\| Pass \|/g)?.length ?? 0;
  if (passes !== 92) {
    throw new Error(`expected 92 passing authored pairs, got ${passes}`);
  }
});

test("domain docs agree with Signature Green and record remaining theme UX", () => {
  const glossary = read("GLOSSARY.md");
  const adr = read("docs/adr/0002-signature-green-on-the-site.md");
  mustInclude(glossary, "Signature Green", "GLOSSARY Palette name");
  mustInclude(glossary, "#2D9282", "GLOSSARY Brand green");
  mustInclude(adr, "Signature Green", "ADR Palette");
  mustInclude(adr, "#2D9282", "ADR Brand green");
  mustInclude(adr, "no public theme switcher", "ADR no switcher");
  mustNotInclude(adr, "Compatibility aliases keep unmigrated", "ADR leftover alias consequence");
  mustInclude(adr, "review", "ADR light is review-only");
  mustInclude(adr, "Field hover maps to `--highlight`", "ADR hover residual");
  mustInclude(adr, "same hex as `--border`", "ADR hover is not a hue change");
  mustInclude(adr, "#71847A", "ADR locked highlight/border hex");
  mustInclude(adr, ":user-invalid", "ADR native invalid residual");
  mustInclude(adr, "no custom error banner", "ADR no custom error banner");
  mustInclude(adr, "No GLB in `public/models/`", "ADR no GLB residual");
  mustInclude(adr, "WebGL", "ADR WebGL not measured");
  mustInclude(adr, "`theme-color` stays the dark canvas `#121817`", "ADR theme-color residual");
  mustInclude(adr, "not full WCAG conformance", "ADR WCAG non-claim");
  mustInclude(adr, "No screenshot files", "ADR no in-repo screenshots");
  mustInclude(adr, "no Chromium", "ADR no Chromium");
});

const distAbout = join(root, "dist/about/index.html");
if (existsSync(distAbout)) {
  test("built remaining routes keep the dark default and drop alias classes", () => {
    const pages = {
      home: read("dist/index.html"),
      about: read("dist/about/index.html"),
      consulting: read("dist/consulting/index.html"),
      docs: read("dist/docs/index.html"),
      thanks: read("dist/thank-you/index.html"),
      missing: existsSync(join(root, "dist/404.html")) ? read("dist/404.html") : "",
    };
    for (const [label, html] of Object.entries(pages)) {
      if (!html) continue;
      mustInclude(html, 'data-theme="dark"', `built ${label} dark default`);
      mustInclude(html, 'content="#121817"', `built ${label} theme-color`);
      if (LEFTOVER_CLASS.test(html)) {
        throw new Error(`built ${label} still has a compatibility color class`);
      }
    }
    mustInclude(pages.about, "underline", "built About underline");
    mustInclude(pages.consulting, "From schematic to assembled board", "built Consulting copy");
    mustInclude(pages.docs, "Nothing here yet", "built Docs copy");
    mustInclude(pages.thanks, "Received.", "built thank-you");
    if (pages.missing) mustInclude(pages.missing, "Page not found", "built 404");
  });
}

if (failed) {
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}
console.log(`\n${passed} passed`);
