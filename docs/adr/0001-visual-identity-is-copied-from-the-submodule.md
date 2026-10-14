# The site copies Visual Identity from the identity submodule

Visual Identity masters live in the private repository `dinoslabtech/dinoslab`, pinned at `identity/` on its `main` branch (currently `v1.0.0`). This site copies the Palette and the SVG files into `src/styles` and `public/` when it uses them. The production build does not read the submodule, so Netlify can build `main` without that private repository.

The pin tracked identity `dev` while that repository was still integrating Signature Green. It now tracks identity `main` because that line is published.

## Considered Options

- Keep the masters only in this repository. The identity repository is the Brand home, and a second master here would drift.
- Import `identity/brand` during the build. That makes every production build depend on cloning the private repository.

## Consequences

A change to the Mark, Wordmark, Logo, or Palette is copied in on purpose and committed here. Publishing `main` does not require a deploy key for the identity repository.
