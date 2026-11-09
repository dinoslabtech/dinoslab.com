export const site = {
  name: "Dino's Lab",
  legalName: "Dino's Lab",
  url: "https://dinoslab.com",
  description:
    "Electronic products from Dino's Lab. The first module is the DNL-N6, an STM32N657 SoM.",
  /** Visible on Home only. The document title omits the period. */
  tagline: "Electronic products.",
  homeTitle: "Dino's Lab · Electronic products",
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
