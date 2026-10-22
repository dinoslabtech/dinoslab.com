# Handoff: build the locked dinoslab.com pages

The design is written. Build it. Do not reopen the typeface, the scale, the drawing sizes, or the stack layouts.

## Current state

- Repo: `/home/acmelab/michidino/dinoslab.com`
- Branch: `feat/frontend-design`, same commit as `dev` (`741be32`). Not pushed.
- Uncommitted, and required: `GLOSSARY.md`, `docs/adr/0003-the-site-offers-the-module-only.md`, `docs/adr/0004-the-dnl-n6-page-publishes-the-interface.md`, `docs/adr/0005-three-pages-and-the-locked-words.md`, `docs/design/type-and-stacks.md`.
- Untracked `.grok/` is local tooling. Leave it.
- Do not commit, pull, or push unless the user asks.
- The live pages still show the DevKit and the old DNL-N6 figures. Removing those is this session’s work.

## Read first

Do not re-decide these.

- `docs/design/type-and-stacks.md` — the design. Follow it.
- `docs/adr/0005-three-pages-and-the-locked-words.md` — the words.
- `docs/adr/0003-the-site-offers-the-module-only.md` — no DevKit.
- `docs/adr/0004-the-dnl-n6-page-publishes-the-interface.md` — the public facts.
- `GLOSSARY.md` — Tagline, Product, SoM, Carrier, Order code, Interest, Open, Voice, Mark, Wordmark, Logo.

Hardware numbers on the page are only those in ADR 0004 and ADR 0005. The accepted spec, if a figure is in doubt, is `/home/acmelab/michidino/DNL-N6/spec/` (`00-overview.md`, `11-decisions.md`). Do not bring part numbers, the full ST order code, the ball map, connector candidates, outline dimensions, ampere budgets, prices, or FMC onto the page.

## What to build

Build the locked pages in this Astro site, on a phone and on a wide screen.

- Install `@fontsource-variable/source-serif-4` and load `wght.css` only. Remove the Inter import. Keep JetBrains Mono for order codes.
- Apply the type roles, the measure, and the Mark / Wordmark sizes in the design file.
- Rebuild Home, Products, and `/products/dnl-n6` to the stacks in the design file. One column on a phone, the same facts on a wide screen, a header lockup that fits at 320px.
- Point the DNL-N6 page at the locked facts. Stop rendering the stale highlights, spec groups, frozen table, block diagram, pattern line, and old order codes.
- Remove the DevKit from the page, the catalog, Home, About’s link, the viewer, and the interest form. `src/content/products/dnl-n6-dk.md` must not emit `/products/dnl-n6-dk`.
- Set the Tagline, the document title, and the shared description from ADR 0005. The Tagline is not repeated in the header or the footer.
- Replace About’s first paragraph and the HexaSPI, Memory, and Ethernet openings with the sentences in ADR 0005. Leave the rest of each note, including the HexaSPI explainer.
- Header, footer, and Contact keep their current words. Contact stays the header button. The Contact form stays name, email, and message.
- The viewer shows the module alone. Empty state: “CAD in progress.”
- Update checks that still require a DevKit link or a DevKit form choice:
  - `scripts/check-sitewide-signature-green.mjs` requires `href="/products/dnl-n6-dk"` on Home.
  - `scripts/check-form-signature-green.mjs` requires `value="devkit"`.
- `pnpm check` and `pnpm build` must pass.

## Do not

- Do not replace the Palette or Brand green. Do not edit `resources/og.html` or `public/og.png`.
- Do not redraw the Mark, Wordmark, or Logo. Do not place the Logo in the header, the footer, or Home.
- Do not rewrite locked words or add a link label, a pattern line, or an FMC line.
- Do not rearrange Blog, Consulting, Docs, thank-you, or the 404. Do not restyle `ContactLinks` or the blog Example aside. The new text face still applies site-wide.
- Do not bring back the tiled hall, EB Garamond, the lab card, the works letter, the ordinary vendor site, the figure-grid hero, or boxed figure cells.
- The `prototype` skill’s branch for several visual variants does not apply. The look is already chosen. Build these pages.

## Verify

Preview with `pnpm dev` (`astro dev --host 0.0.0.0 --port 4321`).

On a phone width and on a wide screen, walk Home, Products, and `/products/dnl-n6`: the order-code radios change the stuffing sentence and the PSRAM figure, “Register interest” reaches the form, and the header lockup fits at 320px. Confirm the DevKit is gone from those pages, About, the viewer, and the interest form. Confirm Blog, Contact, and About still render, with only the sentences named above changed.
