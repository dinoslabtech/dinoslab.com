export const site = {
  name: "Dino's Lab",
  legalName: "Dino's Lab",
  url: "https://dinoslab.com",
  description:
    "PCB boards, modules, and electronics from Dino's Lab. Ladispoli (Rome), Italy.",
  tagline: "PCB boards, modules, and electronics.",
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
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;

export const productStatusLabel = {
  coming_soon: "Coming soon",
  available: "Available",
  discontinued: "Discontinued",
} as const;
