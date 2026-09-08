# Dino's Lab

Website for [dinoslab.com](https://dinoslab.com). Electronic design studio in Ladispoli (Rome), Italy.

## Stack

- [Astro](https://astro.build) 7 — static HTML
- [Tailwind CSS](https://tailwindcss.com) 4
- [MDX](https://mdxjs.com) for the blog
- Hosted on [Netlify](https://www.netlify.com)

Forms post to [FormSubmit](https://formsubmit.co) and land in `info@dinoslab.com`. The first submission sends a confirmation link to that inbox — open it once, or later mail is dropped.

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

## Netlify

`netlify.toml` sets the build. After the first deploy of this tree, confirm in the UI:

1. **Base directory** is the repo root (not `apps/web`).
2. **Build command** `pnpm build`, **publish** `dist`.

## Content

- Products: `src/content/products/`
- Blog: `src/content/blog/`
- Brand assets: `resources/` (source) and `public/` (what the site serves)
