#!/usr/bin/env node
/**
 * Form journeys + computed Signature Green roles.
 * Expected hexes are Palette spec literals, not values copied from the CSS under test.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Canonical Signature Green (identity spec / ADR 0007). Independent of site CSS.
const PALETTE = {
  dark: {
    canvas: "#121817",
    panel: "#1C2422",
    raised: "#29332F",
    text: "#EDF2EF",
    textMuted: "#B2BEB8",
    divider: "#3B4942",
    controlBorder: "#71847A",
    highlight: "#71847A",
    primary: "#2D9282",
    primaryHover: "#3FA891",
    primaryActive: "#278C7B",
    onPrimary: "#07120E",
    focusRing: "#8FD9C1",
    danger: "#FFA8A3",
    success: "#9FD3A5",
  },
  light: {
    canvas: "#E5EBE7",
    panel: "#F4F7F4",
    raised: "#FFFFFF",
    text: "#18251E",
    textMuted: "#526258",
    divider: "#C7D2CA",
    controlBorder: "#71847A",
    highlight: "#71847A",
    primary: "#2D9282",
    primaryHover: "#2A9080",
    primaryActive: "#278C7B",
    onPrimary: "#07120E",
    focusRing: "#0F5F53",
    danger: "#A12C32",
    success: "#2D6339",
  },
};

const APPLY_COLOR = {
  "border-line": ["border-color", "var(--color-line)"],
  "bg-paper": ["background-color", "var(--color-paper)"],
  "bg-panel": ["background-color", "var(--color-panel)"],
  "bg-raised": ["background-color", "var(--color-raised)"],
  "text-ink": ["color", "var(--color-ink)"],
  "text-muted": ["color", "var(--color-muted)"],
};

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
  const m = String(value).trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (!m) return String(value).trim().toLowerCase();
  let h = m[1].toUpperCase();
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
  const re = new RegExp(`(?:^|\\n)${escaped}\\s*\\{`, "m");
  const found = css.match(re);
  if (!found || found.index === undefined) return null;
  const start = css.indexOf("{", found.index);
  let depth = 0;
  for (let i = start; i < css.length; i += 1) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") {
      depth -= 1;
      if (depth === 0) return css.slice(start + 1, i);
    }
  }
  return null;
}

function declarations(body) {
  const decls = {};
  if (!body) return decls;
  const apply = body.match(/@apply\s+([^;]+);/);
  if (apply) {
    for (const utility of apply[1].trim().split(/\s+/)) {
      const mapped = APPLY_COLOR[utility];
      if (mapped) decls[mapped[0]] = mapped[1];
    }
  }
  for (const match of body.matchAll(/(^|\n)\s*(border-color|border|color|background-color|background|opacity|cursor|outline(?:-color)?)\s*:\s*([^;]+);/g)) {
    const prop = match[2];
    const value = match[3].trim();
    if (prop === "border") {
      const color = value.replace(/^(?:\S+\s+){0,2}(?:solid|dashed|dotted)\s+/i, "").trim();
      if (color && !/^\d/.test(color)) decls["border-color"] = color;
    } else if (prop === "background") {
      decls["background-color"] = value;
    } else {
      decls[prop] = value;
    }
  }
  return decls;
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

const paletteCss = read("src/styles/palette.css");
const globalCss = read("src/styles/global.css");
const darkRoles = customProps(braceBlock(paletteCss, ':root,\n[data-theme="dark"]'));
const lightRoles = customProps(braceBlock(paletteCss, '[data-theme="light"]'));
const aliases = customProps(braceBlock(paletteCss, "/* Explicit role names"));
const themeAliases = customProps(braceBlock(globalCss, "@theme"));

function mapsFor(theme) {
  return [theme === "light" ? lightRoles : darkRoles, aliases, themeAliases];
}

function computed(selector, prop, theme) {
  const body = ruleBody(globalCss, selector);
  if (body === null) throw new Error(`missing selector ${selector}`);
  const decls = declarations(body);
  if (!decls[prop]) throw new Error(`${selector} has no ${prop}`);
  return hex(resolve(decls[prop], mapsFor(theme)));
}

function hasSelector(selector) {
  return ruleBody(globalCss, selector) !== null;
}

test("field default border uses the control-boundary role in dark", () => {
  const actual = computed(".field", "border-color", "dark");
  if (actual === hex(PALETTE.dark.divider)) {
    throw new Error(`field border is the decorative divider ${actual}, not control-boundary ${PALETTE.dark.controlBorder}`);
  }
  if (actual !== hex(PALETTE.dark.controlBorder)) {
    throw new Error(`expected ${PALETTE.dark.controlBorder}, got ${actual}`);
  }
});

test("field default border uses the control-boundary role in light", () => {
  const actual = computed(".field", "border-color", "light");
  if (actual === hex(PALETTE.light.divider)) {
    throw new Error(`field border is the decorative divider ${actual}, not control-boundary ${PALETTE.light.controlBorder}`);
  }
  if (actual !== hex(PALETTE.light.controlBorder)) {
    throw new Error(`expected ${PALETTE.light.controlBorder}, got ${actual}`);
  }
});

test("field input text uses the text role in dark", () => {
  const actual = computed(".field", "color", "dark");
  if (actual !== hex(PALETTE.dark.text)) {
    throw new Error(`expected ${PALETTE.dark.text}, got ${actual}`);
  }
});

test("field input text uses the text role in light", () => {
  const actual = computed(".field", "color", "light");
  if (actual !== hex(PALETTE.light.text)) {
    throw new Error(`expected ${PALETTE.light.text}, got ${actual}`);
  }
});

test("field fill uses the panel role on the raised form surface in dark", () => {
  const actual = computed(".field", "background-color", "dark");
  if (actual !== hex(PALETTE.dark.panel)) {
    throw new Error(`expected panel ${PALETTE.dark.panel}, got ${actual}`);
  }
});

test("field fill uses the panel role on the raised form surface in light", () => {
  const actual = computed(".field", "background-color", "light");
  if (actual !== hex(PALETTE.light.panel)) {
    throw new Error(`expected panel ${PALETTE.light.panel}, got ${actual}`);
  }
});

test("field focus border uses the focus-ring role in dark", () => {
  const actual = computed(".field:focus", "border-color", "dark");
  if (actual !== hex(PALETTE.dark.focusRing)) {
    throw new Error(`expected ${PALETTE.dark.focusRing}, got ${actual}`);
  }
});

test("field focus border uses the focus-ring role in light", () => {
  const actual = computed(".field:focus", "border-color", "light");
  if (actual !== hex(PALETTE.light.focusRing)) {
    throw new Error(`expected ${PALETTE.light.focusRing}, got ${actual}`);
  }
});

test("field hover is mapped to the highlight role", () => {
  if (!hasSelector(".field:hover")) {
    throw new Error("missing .field:hover");
  }
  const dark = computed(".field:hover", "border-color", "dark");
  const light = computed(".field:hover", "border-color", "light");
  if (dark !== hex(PALETTE.dark.highlight)) {
    throw new Error(`dark hover expected ${PALETTE.dark.highlight}, got ${dark}`);
  }
  if (light !== hex(PALETTE.light.highlight)) {
    throw new Error(`light hover expected ${PALETTE.light.highlight}, got ${light}`);
  }
});

test("field disabled uses muted text and a non-color cue", () => {
  if (!hasSelector(".field:disabled")) {
    throw new Error("missing .field:disabled");
  }
  const color = computed(".field:disabled", "color", "dark");
  if (color !== hex(PALETTE.dark.textMuted)) {
    throw new Error(`disabled text expected ${PALETTE.dark.textMuted}, got ${color}`);
  }
  const light = computed(".field:disabled", "color", "light");
  if (light !== hex(PALETTE.light.textMuted)) {
    throw new Error(`light disabled text expected ${PALETTE.light.textMuted}, got ${light}`);
  }
  const opacity = declarations(ruleBody(globalCss, ".field:disabled")).opacity;
  if (!opacity || Number.parseFloat(opacity) >= 1) {
    throw new Error("disabled state needs a non-color cue (opacity below 1)");
  }
});

test("field native invalid uses the danger role in both themes", () => {
  if (!hasSelector(".field:user-invalid")) {
    throw new Error("missing .field:user-invalid");
  }
  const dark = computed(".field:user-invalid", "border-color", "dark");
  const light = computed(".field:user-invalid", "border-color", "light");
  if (dark !== hex(PALETTE.dark.danger)) {
    throw new Error(`dark invalid expected ${PALETTE.dark.danger}, got ${dark}`);
  }
  if (light !== hex(PALETTE.light.danger)) {
    throw new Error(`light invalid expected ${PALETTE.light.danger}, got ${light}`);
  }
});

test("invalid focus keeps the danger role rather than dropping to focus-ring only", () => {
  if (!hasSelector(".field:user-invalid:focus")) {
    throw new Error("missing .field:user-invalid:focus");
  }
  const actual = computed(".field:user-invalid:focus", "border-color", "dark");
  if (actual !== hex(PALETTE.dark.danger)) {
    throw new Error(`expected ${PALETTE.dark.danger}, got ${actual}`);
  }
});

test("primary Send pairs Brand-green fill with on-primary ink", () => {
  const fill = computed(".btn-primary", "background-color", "dark");
  const ink = computed(".btn-primary", "color", "dark");
  if (fill !== hex(PALETTE.dark.primary)) {
    throw new Error(`fill expected ${PALETTE.dark.primary}, got ${fill}`);
  }
  if (ink !== hex(PALETTE.dark.onPrimary)) {
    throw new Error(`on-primary expected ${PALETTE.dark.onPrimary}, got ${ink}`);
  }
  const lightInk = computed(".btn-primary", "color", "light");
  if (lightInk !== hex(PALETTE.light.onPrimary)) {
    throw new Error(`light on-primary expected ${PALETTE.light.onPrimary}, got ${lightInk}`);
  }
});

test("primary Send hover and pressed use authored Palette roles", () => {
  const darkHover = computed(".btn-primary:hover", "background-color", "dark");
  const lightHover = computed(".btn-primary:hover", "background-color", "light");
  const pressed = computed(".btn-primary:active", "background-color", "dark");
  if (darkHover !== hex(PALETTE.dark.primaryHover)) {
    throw new Error(`dark hover expected ${PALETTE.dark.primaryHover}, got ${darkHover}`);
  }
  if (lightHover !== hex(PALETTE.light.primaryHover)) {
    throw new Error(`light hover expected ${PALETTE.light.primaryHover}, got ${lightHover}`);
  }
  if (pressed !== hex(PALETTE.dark.primaryActive)) {
    throw new Error(`pressed expected ${PALETTE.dark.primaryActive}, got ${pressed}`);
  }
});

test("primary Send disabled keeps the pair and adds a non-color cue", () => {
  if (!hasSelector(".btn-primary:disabled")) {
    throw new Error("missing .btn-primary:disabled");
  }
  const decls = declarations(ruleBody(globalCss, ".btn-primary:disabled"));
  if (!decls.opacity || Number.parseFloat(decls.opacity) >= 1) {
    throw new Error("disabled Send needs a non-color cue (opacity below 1)");
  }
  if (decls["background-color"]) {
    const fill = hex(resolve(decls["background-color"], mapsFor("dark")));
    if (fill !== hex(PALETTE.dark.primary)) {
      throw new Error(`disabled fill expected ${PALETTE.dark.primary}, got ${fill}`);
    }
  }
  if (decls.color) {
    const ink = hex(resolve(decls.color, mapsFor("dark")));
    if (ink !== hex(PALETTE.dark.onPrimary)) {
      throw new Error(`disabled on-primary expected ${PALETTE.dark.onPrimary}, got ${ink}`);
    }
  }
});

const formSrc = read("src/components/ContactForm.astro");
const contactPage = read("src/pages/contact.astro");
const quotePage = read("src/pages/consulting.astro");
const productPage = read("src/pages/products/[id].astro");
const thankYouPage = read("src/pages/thank-you.astro");

function mustInclude(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`${label} missing ${JSON.stringify(needle)}`);
  }
}

test("forms post to FormSubmit and confirm on thank-you", () => {
  mustInclude(formSrc, "https://formsubmit.co/${site.email}", "FormSubmit destination");
  mustInclude(formSrc, 'name="_next"', "_next field");
  mustInclude(formSrc, "/thank-you", "thank-you confirmation");
  mustInclude(formSrc, 'name="_captcha"', "captcha field");
  mustInclude(formSrc, 'value="false"', "captcha off");
  mustInclude(formSrc, 'name="_honey"', "honeypot");
  mustInclude(formSrc, 'name="form"', "form identity field");
});

test("contact fields keep name, email and required message", () => {
  mustInclude(formSrc, 'name="name"', "name");
  mustInclude(formSrc, 'name="email"', "email");
  mustInclude(formSrc, 'name="message"', "message");
  if (!/name="name"[^>]*required/.test(formSrc)) {
    throw new Error("name is no longer required");
  }
  if (!/name="email"[^>]*required/.test(formSrc)) {
    throw new Error("email is no longer required");
  }
  if (!/name="message"[^>]*required=\{!isInterest\}/.test(formSrc)) {
    throw new Error("message requiredness is no longer contact-only");
  }
});

test("interest adds intent and hidden SoM fields without requiring message", () => {
  mustInclude(formSrc, 'name="intent"', "intent");
  mustInclude(formSrc, 'value="devkit"', "devkit intent");
  mustInclude(formSrc, 'value="som"', "SoM intent");
  mustInclude(formSrc, 'name="sku"', "order code");
  mustInclude(formSrc, 'name="quantity"', "quantity");
  mustInclude(formSrc, "js-som-only", "SoM extra fields");
  mustInclude(formSrc, "hidden", "SoM fields start hidden");
  mustInclude(formSrc, "We email you about this module", "interest supporting copy");
  mustInclude(formSrc, "text-muted", "supporting copy uses muted text");
});

test("contact, quote and interest mounts are preserved", () => {
  mustInclude(contactPage, "<ContactForm />", "contact form");
  mustInclude(contactPage, "panel-raised", "contact form surface");
  mustInclude(quotePage, '<ContactForm name="quote" />', "quote form");
  mustInclude(quotePage, "panel-raised", "quote form surface");
  mustInclude(productPage, 'name="interest"', "interest name");
  mustInclude(productPage, 'variant="interest"', "interest variant");
  mustInclude(productPage, "panel-raised", "interest form surface");
});

test("thank-you keeps text confirmation and a secondary Home action", () => {
  mustInclude(thankYouPage, "Received.", "success heading");
  mustInclude(thankYouPage, "site.email", "reply-from copy");
  mustInclude(thankYouPage, "btn-secondary", "Home action");
  mustInclude(thankYouPage, 'href="/"', "Home destination");
});

test("every visible control uses the field class", () => {
  const controls = [...formSrc.matchAll(/<(input|select|textarea)\b[^>]*>/g)].map((m) => m[0]);
  const visible = controls.filter((tag) => !tag.includes('name="_') && !tag.includes('type="hidden"'));
  if (visible.length < 3) {
    throw new Error(`expected visible controls, found ${visible.length}`);
  }
  for (const tag of visible) {
    if (!/\bclass="[^"]*\bfield\b/.test(tag)) {
      throw new Error(`control missing field class: ${tag}`);
    }
  }
});

test("Send remains the primary submission action", () => {
  mustInclude(formSrc, 'type="submit"', "submit");
  mustInclude(formSrc, "btn-primary", "primary action");
  mustInclude(formSrc, "Send", "Send label");
});

test("compatibility aliases later slices still need remain", () => {
  for (const alias of ["--color-lab", "--color-void", "--color-paper", "--color-line", "--color-ink"]) {
    if (!themeAliases[alias]) {
      throw new Error(`missing compatibility alias ${alias}`);
    }
  }
});

function pageForm(html, name) {
  const re = new RegExp(`<form\\b[^>]*name="${name}"[\\s\\S]*?</form>`, "i");
  const match = html.match(re);
  if (!match) throw new Error(`built page missing form name=${name}`);
  return match[0];
}

function checkBuiltForm(html, { name, required, optional = [], forbidden = [] }) {
  const form = pageForm(html, name);
  if (!form.includes("formsubmit.co/info@dinoslab.com")) {
    throw new Error(`${name}: FormSubmit destination changed`);
  }
  if (!form.includes("/thank-you")) {
    throw new Error(`${name}: thank-you destination changed`);
  }
  for (const field of required) {
    const tag = form.match(new RegExp(`<(?:input|select|textarea)\\b[^>]*name="${field}"[^>]*>`, "i"));
    if (!tag) throw new Error(`${name}: missing ${field}`);
    if (!/\brequired\b/.test(tag[0])) throw new Error(`${name}: ${field} is no longer required`);
    if (!/\bfield\b/.test(tag[0])) throw new Error(`${name}: ${field} is not a field`);
  }
  for (const field of optional) {
    const tag = form.match(new RegExp(`<(?:input|select|textarea)\\b[^>]*name="${field}"[^>]*>`, "i"));
    if (!tag) throw new Error(`${name}: missing ${field}`);
    if (/\brequired\b/.test(tag[0])) throw new Error(`${name}: ${field} should not be required in markup`);
  }
  for (const field of forbidden) {
    if (new RegExp(`name="${field}"`).test(form)) {
      throw new Error(`${name}: unexpected ${field}`);
    }
  }
}

const distContact = join(root, "dist/contact/index.html");
if (existsSync(distContact)) {
  const contactHtml = read("dist/contact/index.html");
  const quoteHtml = read("dist/consulting/index.html");
  const interestHtml = read("dist/products/dnl-n6/index.html");
  const thanksHtml = read("dist/thank-you/index.html");

  test("built contact journey keeps fields and FormSubmit", () => {
    checkBuiltForm(contactHtml, {
      name: "contact",
      required: ["name", "email", "message"],
      forbidden: ["intent", "sku", "quantity"],
    });
  });

  test("built quote journey keeps fields and FormSubmit", () => {
    checkBuiltForm(quoteHtml, {
      name: "quote",
      required: ["name", "email", "message"],
      forbidden: ["intent", "sku", "quantity"],
    });
  });

  test("built interest journey keeps SoM extras and optional message", () => {
    checkBuiltForm(interestHtml, {
      name: "interest",
      required: ["name", "email", "intent"],
      optional: ["message", "sku", "quantity"],
    });
    const form = pageForm(interestHtml, "interest");
    if (!form.includes("js-som-only")) {
      throw new Error("interest missing SoM extra field hook");
    }
    if (!form.includes("We email you about this module")) {
      throw new Error("interest supporting copy missing");
    }
  });

  test("built thank-you is a text confirmation", () => {
    if (!thanksHtml.includes("Received.")) {
      throw new Error("thank-you heading missing");
    }
    if (!thanksHtml.includes("info@dinoslab.com")) {
      throw new Error("thank-you reply-from missing");
    }
    if (!thanksHtml.includes("btn-secondary")) {
      throw new Error("thank-you Home action missing");
    }
  });
}

if (failed) {
  console.error(`\n${failed} failed, ${passed} passed`);
  process.exit(1);
}
console.log(`\n${passed} passed`);
