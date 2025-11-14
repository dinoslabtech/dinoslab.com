// @ts-check
import { defineConfig } from "astro/config";
import { i18n, filterSitemapByDefaultLocale } from "astro-i18n-aut/integration";
import sitemap from "@astrojs/sitemap";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";
import path from "path";

import mdx from "@astrojs/mdx";
import { locales, defaultLocale } from "./src/i18n/ui";

export default defineConfig({
  trailingSlash: "always",
  build: {
    format: "directory",
  },
  integrations: [
    react(),
    mdx(),
    i18n({
      locales,
      defaultLocale,
      redirectDefaultLocale: true,
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
      },
      filter: filterSitemapByDefaultLocale({ defaultLocale }),
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": path.resolve("./src"),
      },
    },
    plugins: [tailwindcss()],
  },
});
