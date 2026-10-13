import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import cssVariables from "./src/styles/syntax-theme.json";

export default defineConfig({
  site: "https://dinoslab.com",
  trailingSlash: "never",
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: {
      theme: cssVariables,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: [".ts.net"],
    },
    preview: {
      allowedHosts: [".ts.net"],
    },
  },
});
