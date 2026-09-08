export const site = {
  name: "Dino's Lab",
  legalName: "Dino's Lab",
  url: "https://dinoslab.com",
  description:
    "Electronics studio in Ladispoli, near Rome. We design PCBs, write the firmware, and assemble the boards in Italy.",
  tagline: "PCB design, firmware, and assembly in Italy.",
  email: "info@dinoslab.com",
  phone: "+39 333 456 7890",
  telegram: "https://t.me/dinoslab",
  telegramHandle: "@dinoslab",
  github: "https://github.com/dinoslabtech",
  githubHandle: "dinoslabtech",
  location: "Ladispoli / Rome, Italy",
  acme: {
    name: "Acme Systems",
    url: "https://www.acmesystems.it",
  },
} as const;

export const nav = [
  { href: "/products", label: "Products" },
  { href: "/consulting", label: "Consulting" },
  { href: "/docs", label: "Docs" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
] as const;
