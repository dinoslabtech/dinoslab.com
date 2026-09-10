import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

const docs = defineCollection({
  loader: glob({ base: "./src/content/docs", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
});

const specRow = z.tuple([z.string(), z.string()]);

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    status: z.enum(["coming_soon", "available", "discontinued"]),
    summary: z.string(),
    chip: z.string(),
    category: z.string(),
    highlights: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .optional(),
    features: z
      .array(z.object({ title: z.string(), body: z.string() }))
      .optional(),
    specGroups: z
      .array(z.object({ title: z.string(), rows: z.array(specRow) }))
      .optional(),
  }),
});

export const collections = { blog, products, docs };
