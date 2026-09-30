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
    order: z.number().optional(),
  }),
});

const specRow = z.tuple([z.string(), z.string()]);

const sku = z.object({
  code: z.string(),
  title: z.string(),
  psramMb: z.number().optional(),
  norMb: z.number().optional(),
  fmc: z.enum(["empty", "fitted"]).optional(),
  fmcMb: z.number().optional(),
});

const products = defineCollection({
  loader: glob({ base: "./src/content/products", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    shortName: z.string(),
    status: z.enum(["coming_soon", "available", "discontinued"]),
    kind: z.enum(["som", "kit"]).default("som"),
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
    variants: z.array(sku).optional(),
    relatedProduct: z.string().optional(),
    viewer: z
      .object({
        som: z.string(),
        kit: z.string(),
        combined: z.string(),
      })
      .optional(),
    onModule: z.array(z.string()).optional(),
    onCarrier: z.array(z.string()).optional(),
    frozen: z.array(specRow).optional(),
    open: z.array(specRow).optional(),
  }),
});

export const collections = { blog, products };
