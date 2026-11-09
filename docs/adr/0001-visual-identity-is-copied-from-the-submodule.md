# The site copies Visual Identity from the identity submodule

Visual Identity masters live in the private repository `dinoslabtech/identity`, pinned at `identity/` on tag `v1.2.1` (`f645614`). The site does not follow a branch. This site copies the Palette and the SVG files into `src/styles` and `public/` when it uses them. Production uses those copies. The production build does not read the submodule, so Netlify can build `main` without that private repository.

The pin tracked identity `dev` while that repository was still integrating Signature Green, and later tracked identity `main`. The checkout is tag `v1.2.1` (`f645614`), and `.gitmodules` has no `branch` key.

## Considered Options

- Keep the masters only in this repository. The identity repository is the Brand home, and a second master here would drift.
- Import `identity/brand` during the build. That makes every production build depend on cloning the private repository.

## Consequences

A change to the Mark, Wordmark, Logo, or Palette is copied in on purpose and committed here. Publishing `main` does not require a deploy key for the identity repository.

`.gitmodules` sets `update = none` on identity so `git submodule update --init` skips it. Netlify runs that command while preparing the repo, before the build. To check the masters out locally: `git submodule update --init --checkout identity`.
