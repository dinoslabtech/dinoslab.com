export const site = {
  name: "Dino's Lab",
  legalName: "Dino's Lab",
  url: "https://dinoslab.com",
  description:
    "Modules, designed in Ladispoli, built by Acme Systems. First module: DNL-N6, an STM32N657X0 module.",
  tagline: "Modules, designed in Ladispoli, built by Acme Systems.",
  email: "info@dinoslab.com",
  telegram: "https://t.me/dinoslab",
  telegramHandle: "@dinoslab",
  github: "https://github.com/dinoslabtech",
  githubHandle: "dinoslabtech",
  location: "Ladispoli (Rome), Italy",
  acme: {
    name: "Acme Systems",
    url: "https://www.acmesystems.it",
  },
} as const;

export const nav = [
  { href: "/products", label: "Products" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

/**
 * Order code: DNL-N6-P{k}x{m}-F{n}
 * - k: PSRAM die count
 * - m: megabytes per PSRAM die
 * - n: megabytes of the one NOR die
 * Stock: DNL-N6-P2x64-F128 (default), DNL-N6-P1x64-F128
 */

export const productStatusLabel = {
  coming_soon: "Coming soon",
  available: "Available",
  discontinued: "Discontinued",
} as const;
