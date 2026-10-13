#!/usr/bin/env node
/**
 * Product journey Palette check.
 *
 * Seam: delivered product listing/detail/viewer CSS roles.
 * Expected hex values are Signature Green literals from the identity spec,
 * not values copied out of the product CSS under test.
 *
 * Resolution uses src/styles/palette.css only. Compatibility aliases in
 * global.css (--color-void, --color-paper, --color-line, …) do not count.
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const paletteCss = readFileSync(join(root, "src/styles/palette.css"), "utf8");
const globalCss = readFileSync(join(root, "src/styles/global.css"), "utf8");

const SPEC = {
  dark: {
    canvas: "#121817",
    panel: "#1C2422",
    raised: "#29332F",
    text: "#EDF2EF",
    muted: "#B2BEB8",
    divider: "#3B4942",
    control: "#71847A",
    accent: "#8FD9C1",
    highlight: "#71847A",
    brand: "#2D9282",
  },
  light: {
    canvas: "#E5EBE7",
    panel: "#F4F7F4",
    raised: "#FFFFFF",
    text: "#18251E",
    muted: "#526258",
    divider: "#C7D2CA",
    control: "#71847A",
    accent: "#0F5F53",
    highlight: "#71847A",
    brand: "#2D9282",
  },
};

function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

function parseDecls(block) {
  const decls = {};
  for (const part of block.split(";")) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const colon = trimmed.indexOf(":");
    if (colon < 1) continue;
    const prop = trimmed.slice(0, colon).trim();
    const value = trimmed.slice(colon + 1).trim();
    decls[prop] = value;
  }
  return decls;
}

function parseRules(css) {
  const src = stripComments(css);
  const rules = [];
  const stack = [];
  let i = 0;
  let prelude = "";

  while (i < src.length) {
    const ch = src[i];
    if (ch === "{") {
      stack.push(prelude.trim());
      prelude = "";
      i += 1;
      continue;
    }
    if (ch === "}") {
      const selector = stack.pop() ?? "";
      const body = prelude.trim();
      prelude = "";
      if (selector && !selector.startsWith("@") && body && !body.includes("{")) {
        rules.push({ selector, decls: parseDecls(body) });
      }
      i += 1;
      continue;
    }
    prelude += ch;
    i += 1;
  }
  return rules;
}

function selectorParts(selector) {
  return selector.split(",").map((s) => s.trim());
}

function parsePalette(css) {
  const dark = {};
  const light = {};
  for (const rule of parseRules(css)) {
    const parts = selectorParts(rule.selector);
    const onRoot = parts.includes(":root");
    const onDark = parts.includes('[data-theme="dark"]') || onRoot;
    const onLight = parts.includes('[data-theme="light"]') || (onRoot && !parts.includes('[data-theme="dark"]'));
    if (onDark) Object.assign(dark, rule.decls);
    if (onLight) Object.assign(light, rule.decls);
  }
  if (!dark["--surface-canvas"] || !light["--accent-text"]) {
    throw new Error("palette.css did not yield Signature Green role maps");
  }
  return { dark, light };
}

function hex(value) {
  const match = String(value).trim().match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!match) return null;
  let h = match[1].toLowerCase();
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return `#${h.toUpperCase()}`;
}

function resolveVar(name, theme, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = theme[name];
  if (!raw) return null;
  const asHex = hex(raw);
  if (asHex) return asHex;
  const ref = raw.match(/^var\((--[\w-]+)\)\s*$/);
  if (ref) return resolveVar(ref[1], theme, seen);
  return null;
}

function colorIn(value, theme) {
  if (!value) return null;
  const asHex = hex(value);
  if (asHex) return asHex;
  const refs = [...value.matchAll(/var\((--[\w-]+)\)/g)].map((m) => m[1]);
  if (refs.length === 0) return null;
  return resolveVar(refs[0], theme);
}

function selectorMatches(ruleSelector, target) {
  return ruleSelector
    .split(",")
    .map((s) => s.trim())
    .some((s) => s === target);
}

function declsFor(rules, selector) {
  const out = {};
  for (const rule of rules) {
    if (selectorMatches(rule.selector, selector)) Object.assign(out, rule.decls);
  }
  return out;
}

function firstColor(selector, prop, theme) {
  for (const rule of rules) {
    if (!selectorMatches(rule.selector, selector)) continue;
    const actual = colorIn(rule.decls[prop], theme);
    if (actual) return actual;
  }
  return colorIn(declsFor(rules, selector)[prop], theme);
}

const palette = parsePalette(paletteCss);
const rules = parseRules(globalCss);
let failed = 0;

function check(label, actual, expected) {
  if (actual === expected) {
    console.log(`  ok  ${label} → ${actual}`);
    return;
  }
  failed += 1;
  console.log(`  FAIL ${label}\n       got ${actual}\n       expected ${expected}`);
}

function checkColor(selector, prop, themeName, expected) {
  const actual = firstColor(selector, prop, palette[themeName]);
  check(`${selector} ${prop} [${themeName}]`, actual, expected);
}

console.log("facts grid / cells");
for (const theme of ["dark", "light"]) {
  const s = SPEC[theme];
  checkColor(".facts-grid", "background", theme, s.divider);
  checkColor(".facts-grid", "border-top", theme, s.divider);
  checkColor(".facts-grid", "border-bottom", theme, s.divider);
  checkColor(".facts-cell", "background", theme, s.panel);
  checkColor(".facts-value", "color", theme, s.text);
  checkColor(".facts-label", "color", theme, s.muted);
}

console.log("spec table");
for (const theme of ["dark", "light"]) {
  const s = SPEC[theme];
  checkColor(".spec-table", "border-top", theme, s.divider);
  checkColor(".spec-table th", "border-bottom", theme, s.divider);
  checkColor(".spec-table td", "border-bottom", theme, s.divider);
  checkColor(".spec-table tr", "border-bottom", theme, s.divider);
  checkColor(".spec-table th", "color", theme, s.muted);
  checkColor(".spec-table td", "color", theme, s.text);
}

function selectedCue(selector) {
  const decls = declsFor(rules, selector);
  const weight = Number.parseInt(decls["font-weight"] ?? "", 10);
  const decoration = decls["text-decoration"] ?? "";
  const underlined = /\bunderline\b/.test(decoration);
  return (Number.isFinite(weight) && weight >= 500) || underlined;
}

console.log("SKU / viewer tabs");
for (const tab of [".sku-tab", ".viewer-tab"]) {
  for (const theme of ["dark", "light"]) {
    const s = SPEC[theme];
    checkColor(tab, "color", theme, s.muted);
    checkColor(`${tab}:hover`, "color", theme, s.text);
    checkColor(`${tab}[aria-selected="true"]`, "color", theme, s.text);
    checkColor(`${tab}[aria-selected="true"]`, "background", theme, s.raised);
    checkColor(`${tab}[aria-selected="true"]`, "border-color", theme, s.control);
  }
  check(
    `${tab}[aria-selected="true"] non-color cue`,
    selectedCue(`${tab}[aria-selected="true"]`) ? "present" : "missing",
    "present",
  );
  const disabledOpacity = declsFor(rules, `${tab}:disabled`).opacity;
  const faded = disabledOpacity !== undefined && Number.parseFloat(disabledOpacity) < 1;
  check(`${tab}:disabled opacity cue`, faded ? "present" : "missing", "present");
}

console.log("viewer canvas / empty");
for (const theme of ["dark", "light"]) {
  const s = SPEC[theme];
  checkColor(".viewer-stage", "background", theme, s.canvas);
  checkColor(".viewer-canvas", "background", theme, s.canvas);
  checkColor(".viewer-canvas", "--poster-color", theme, s.canvas);
  checkColor(".viewer-empty", "color", theme, s.muted);
}

console.log("block diagram");
for (const theme of ["dark", "light"]) {
  const s = SPEC[theme];
  checkColor(".diagram", "background", theme, s.raised);
  checkColor(".diagram", "border", theme, s.divider);
  checkColor(".diagram-row", "border-bottom", theme, s.divider);
  checkColor(".diagram-kicker", "color", theme, s.muted);
  checkColor(".diagram-box", "background", theme, s.panel);
  checkColor(".diagram-box", "border", theme, s.divider);
  checkColor(".diagram-box-core", "color", theme, s.accent);
  checkColor(".diagram-arrow", "color", theme, s.muted);
  checkColor(".diagram-line", "color", theme, s.muted);
  checkColor(".diagram-bus", "color", theme, s.accent);
  checkColor(".diagram", "border-top-color", theme, s.highlight);
}

const ALIASES = [
  "--color-void",
  "--color-paper",
  "--color-panel",
  "--color-raised",
  "--color-line",
  "--color-lab",
  "--color-ink",
  "--color-muted",
  "--color-highlight",
];
const PRODUCT_SELECTORS = [".facts-", ".spec-table", ".sku-tab", ".viewer-", ".diagram"];

console.log("no compatibility aliases on product selectors");
{
  const hits = [];
  for (const rule of rules) {
    if (!PRODUCT_SELECTORS.some((prefix) => rule.selector.includes(prefix))) continue;
    const blob = Object.values(rule.decls).join(" ");
    for (const alias of ALIASES) {
      if (blob.includes(alias)) hits.push(`${rule.selector} ${alias}`);
    }
  }
  check("product CSS alias leftovers", hits.length === 0 ? "none" : hits.join("; "), "none");
}

const listing = readFileSync(join(root, "src/pages/products/index.astro"), "utf8");
const detail = readFileSync(join(root, "src/pages/products/[id].astro"), "utf8");
const card = readFileSync(join(root, "src/components/ProductCard.astro"), "utf8");
const viewer = readFileSync(join(root, "src/components/ProductViewer.astro"), "utf8");
const mark = readFileSync(join(root, "public/mark.svg"), "utf8");
const wordmark = readFileSync(join(root, "public/wordmark.svg"), "utf8");

console.log("product journey markup");
check("listing renders ProductCard", listing.includes("<ProductCard") ? "yes" : "no", "yes");
check("product card is a panel", /\bpanel\b/.test(card) ? "yes" : "no", "yes");
check("SKU tabs expose aria-selected", /sku-tab[\s\S]*aria-selected/.test(detail) ? "yes" : "no", "yes");
check("SKU tabs are tabs", detail.includes('role="tab"') && detail.includes("sku-tab") ? "yes" : "no", "yes");
check("viewer tabs expose aria-selected", /viewer-tab[\s\S]*aria-selected/.test(viewer) ? "yes" : "no", "yes");
check("viewer empty copy", viewer.includes("CAD not exported yet") ? "yes" : "no", "yes");
check("viewer camera-controls", viewer.includes("camera-controls") ? "yes" : "no", "yes");
check("viewer canvas class", viewer.includes('class="viewer-canvas"') ? "yes" : "no", "yes");
check("viewer raised chrome", viewer.includes("panel-raised") ? "yes" : "no", "yes");
check("Mark is Brand green", mark.includes('fill="#2D9282"') ? "#2D9282" : "missing", "#2D9282");
check("Wordmark is Brand green", wordmark.includes("#2D9282") ? "#2D9282" : "missing", "#2D9282");

if (failed > 0) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log("\nall checks passed");
