# Zero-Width Injector (隱形字元注入器)

A web tool that injects invisible Unicode characters (zero-width spaces and joiners) into your text. The result **looks the same** on screen but has a **different digital encoding**—useful for teaching, testing how systems handle hidden characters, or making simple copy-paste by bots less reliable.

## What It Does

You type or paste text, choose how and where to inject invisible characters, and get a new string that:

- Appears identical when viewed
- Has a different length and byte representation
- Can break naive search, comparison, or scraping (e.g. URLs with invisible chars)

## Features

- **Input** – Multi-line source text (with a 10,000 character limit).
- **Injection modes**
  - **Full Interval** – Insert an invisible character between every character.
  - **Random** – Insert with a configurable probability (0–100% density).
  - **Space Only** – Insert only after spaces/tabs (breaks word boundaries).
  - **URL Breaker** – Insert after `:`, `.`, and `/` in URLs.
- **Character type** – Zero Width Space (U+200B), Zero Width Non-Joiner (U+200C), Zero Width Joiner (U+200D), or **Mix** (rotates through all three).
- **Output** – Read-only result with one-click copy and reset.
- **Inspector (Debug)** – Toggle to reveal invisible characters as `<200B>`-style tags or red blocks.
- **Comparison** – Original vs result length and `encodeURIComponent` output so you can see the encoding difference.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **UI:** React 18, Tailwind CSS, Lucide React
- **Language:** TypeScript
- **Deploy:** Static export → GitHub Pages (GitHub Actions)

## Run Locally

**Prerequisites:** Node.js 18+ (20 recommended)

```bash
# Clone the repo, then:
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use **pnpm** if you prefer:

```bash
pnpm install
pnpm dev
```

## Build for Production

```bash
npm run build
```

Static files are written to the `out/` directory (Next.js `output: 'export'`).

## Deploy to GitHub Pages

1. Push the repo to GitHub and ensure the default branch is `main`.
2. In the repo: **Settings → Pages → Build and deployment**: choose **GitHub Actions**.
3. Push to `main`; the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) will build and deploy.

If the site is served at `https://<user>.github.io/<repo-name>/` (not the root), set the path in [`next.config.mjs`](next.config.mjs):

```js
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
```

Then rebuild and redeploy.

## Project Structure

```
├── .github/workflows/deploy.yml   # GitHub Pages deploy
├── app/
│   ├── layout.tsx
│   ├── page.tsx                   # Main page (input, tweaks, output)
│   └── globals.css
├── components/
│   ├── InputSection.tsx
│   ├── TweakPanel.tsx
│   ├── ResultSection.tsx
│   └── CopyButton.tsx
├── lib/
│   └── injector.ts                 # Core: injectZeroWidth + inspector helper
├── next.config.mjs
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

Core logic lives in `lib/injector.ts`: `injectZeroWidth(text, mode, charType, density)` and `renderInvisibleForInspector()` for debug display.

## License

MIT
