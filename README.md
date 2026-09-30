# Dino's Lab

Website for [dinoslab.com](https://dinoslab.com). Solder-down modules, designed in Ladispoli, built by [Acme Systems](https://www.acmesystems.it). First board: DNL-N6.

## Stack

- [Astro](https://astro.build) 7 — static HTML
- [Tailwind CSS](https://tailwindcss.com) 4
- [MDX](https://mdxjs.com) for the blog
- Hosted on [Netlify](https://www.netlify.com)

No React, no i18n, no monorepo. Forms post to [FormSubmit](https://formsubmit.co) and land in `info@dinoslab.com`. The first submission sends a confirmation link to that inbox — open it once, or later mail is dropped.

## Local

Needs Node 22.12+ and pnpm 10.

```sh
pnpm install
pnpm dev
```

Open [http://localhost:4321](http://localhost:4321). The dev and preview servers bind `0.0.0.0`, so phones and tablets on the same LAN can use `http://<this-machine>:4321`.

If the firewall is up (UFW default drop):

```sh
sudo ufw allow 4321/tcp comment 'dinoslab preview'
```

```sh
pnpm build
pnpm preview
```

## Git

| Branch | Role |
|--------|------|
| `main` | Production. Netlify publishes this to dinoslab.com. |
| `dev` | Integration. Work and test here. Run it locally with `pnpm dev`. |
| `feat/…` | Short-lived branches off `dev`. |

Do not push experiments to `main`.

Version lives in `package.json`. Site releases are tagged `vX.Y.Z` on `main`.

## Contacts

Mock values until the real ones land — edit `src/data/site.ts`.

## Netlify

`netlify.toml` sets the build. After the first deploy of this tree, confirm in the UI:

1. **Base directory** is the repo root (not `apps/web`).
2. **Build command** `pnpm build`, **publish** `dist`.
3. **Form detection** enabled (Forms → Enable form detection).
4. Optional: enable **branch deploys** for `dev`. Password-protecting those URLs is a plan setting under Visitor access — not available as a free “fake login” in this repo.

## Content

- Products: `src/content/products/`
- Blog: `src/content/blog/`
- Brand assets: `resources/` (source) and `public/` (what the site serves)

SoM order codes: `DNL-N6-{PSRAM_MB}/{NOR_MB}[-R[{FMC_MB}]]`. First SKUs are `DNL-N6-32/64` and `DNL-N6-32/64-R`.

CAD GLBs for the product viewer go in `public/models/`:

| File | View |
|------|------|
| `dnl-n6.glb` | SoM |
| `dnl-n6-dk.glb` | DevKit |
| `dnl-n6-on-dk.glb` | SoM seated on the DevKit |

Until those files exist, the viewer is an empty stage. Docs live at `/docs` and stay out of the nav until a PDF is published.
