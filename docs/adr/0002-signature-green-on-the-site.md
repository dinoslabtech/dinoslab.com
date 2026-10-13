---
status: accepted
---

# Signature Green is the site Palette and the header is a neutral surface

The identity repository locked Signature Green and Brand green `#2D9282`. This site copies that Palette and those drawings. The public header uses the header role with green artwork, rather than a solid Brand-green bar with inverted drawings. Dark is the default theme. Light role values exist for review; there is no public theme switcher.

This supersedes the earlier public-site color rules: Brand green `#0F5F53`, page ground `#000503`, and a light-ink navbar recolor. Header dimensions, navigation, and drawing composition stay as already chosen.

## Considered Options

- Keep the Brand-green navbar from the previous site spec: that conflicts with the locked identity decision.
- Recolor artwork white on dark: Signature Green forbids routine white recolors.

## Consequences

Committed copies in `src/styles/palette.css` and `public/` are the colors the production build uses. Tailwind theme tokens map 1:1 onto remaining Palette roles. Compatibility aliases from the migration are gone.

Light role values remain review-only: set `data-theme="light"` on `html`. There is no public theme switcher. Whether to expose one, persist a preference, or sync `theme-color` with the review theme is still open.

Token and pair checks confirm authored Palette values; they are not full WCAG conformance of composed pages.

Residual limitations from the sitewide review:

- Field hover maps to `--highlight`, which is the same hex as `--border` (`#71847A`) in the locked Palette, so hover is not a hue change.
- Native `:user-invalid` uses the danger role plus the browser’s built-in validation text; there is no custom error banner.
- No GLB in `public/models/`, so WebGL scene/skybox color was not measured; CSS canvas/poster roles are set.
- `theme-color` stays the dark canvas `#121817` during light review.
- No screenshot files are in the repository (no Chromium on this machine); review was live on the ticket ports.
