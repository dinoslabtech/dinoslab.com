export const site = {
  name: "Dino's Lab",
  legalName: "Dino's Lab",
  url: "https://dinoslab.com",
  description:
    "Solder-down modules from Dino’s Lab. First board: DNL-N6, an STM32N6 SoM. Designed in Ladispoli (Rome), Italy. Built by Acme Systems.",
  tagline: "Solder-down modules, designed in Ladispoli.",
  homeLine:
    "Solder-down modules, designed in Ladispoli, built by Acme Systems. First board: DNL-N6.",
  email: "info@dinoslab.com",
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
 * SoM order code: DNL-N6-{PSRAM_MB}/{NOR_MB}[-R[{FMC_MB}]]
 * - PSRAM_MB: HexaSPI PSRAM stuffing
 * - NOR_MB: Octo-SPI NOR stuffing
 * - omitted -R: FMC footprint empty
 * - -R: FMC RAM fitted, density not yet frozen
 * - -R{n}: FMC RAM fitted, n megabytes
 */

export const productStatusLabel = {
  coming_soon: "Coming soon",
  available: "Available",
  discontinued: "Discontinued",
} as const;
