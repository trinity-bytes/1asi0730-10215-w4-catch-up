# Catch Up

Catch Up is a newsreader application that helps users browse news sources, read top headlines.

## Features

- Browse available news sources and select one as the active feed.
- View top headlines for the selected source.
- Read article summaries and open original sources.
- Share articles (or copy links when native sharing is unavailable).
- Switch UI language between English (`en`) and Spanish (`es`).

## Technology Stack

- Vue 3
- Vite
- PrimeVue + PrimeFlex + PrimeIcons
- Axios
- vue-i18n

## Prerequisites

- Node.js (LTS recommended)
- npm

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Available Scripts

- `npm run dev`: starts the development server.
- `npm run build`: creates a production build in `dist/`.
- `npm run preview`: serves the production build locally.

### Switching to Newsdata.io

This project has been updated to use [Newsdata.io](https://newsdata.io/) as the default news provider. Newsdata.io allows requests from production domains (like GitHub Pages) in its free tier, so a CORS proxy is no longer strictly necessary.

If you still wish to use NewsAPI.org or encounter CORS issues:
1. **Use a CORS Proxy**: Set the `VITE_CORS_PROXY_URL` environment variable to a proxy service (e.g., `https://cors-anywhere.herokuapp.com`).
2. **Revert Endpoints**: Ensure `VITE_SOURCES_ENDPOINT_PATH` and `VITE_TOP_HEADLINES_ENDPOINT_PATH` match the provider's requirements.

## Environment Variables

This project reads API settings from Vite environment variables (`import.meta.env`).

### Newsdata.io Configuration (Default)
```bash
VITE_NEWS_API_URL=https://newsdata.io/api/1
VITE_NEWS_API_KEY=your_newsdata_io_key
VITE_SOURCES_ENDPOINT_PATH=/sources
VITE_TOP_HEADLINES_ENDPOINT_PATH=/latest
VITE_LOGO_API_URL=https://img.logo.dev
VITE_LOGO_PUBLISHABLE_API_KEY=your_logo_dev_publishable_key
VITE_CORS_PROXY_URL= # (Optional) Prefix URL for CORS proxy
```

### NewsAPI.org Configuration (Alternative)
```bash
VITE_NEWS_API_URL=https://newsapi.org/v2
VITE_NEWS_API_KEY=your_news_api_key
VITE_SOURCES_ENDPOINT_PATH=/top-headlines/sources
VITE_TOP_HEADLINES_ENDPOINT_PATH=/top-headlines
...
```

Notes:

- Do not commit real API keys.
- Use provider dashboards to rotate keys if they are exposed.

## Project Structure

```text
src/
  news/
	application/      # reactive store and use-case orchestration
	domain/model/     # entities (Article, Source)
	infrastructure/   # API clients and assemblers
	presentation/     # news-related UI components
  shared/
	infrastructure/   # shared API helpers
	presentation/     # shared layout/footer/language components
  locales/            # i18n dictionaries (en, es)
```

## Architecture Notes

The codebase follows a domain-drive-design approach with inner layered organization:

- `domain`: core entities.
- `application`: state and app-level behavior (`news.store.js`).
- `infrastructure`: external service adapters and response mappers.
- `presentation`: Vue components and UI interactions.

## Internationalization

- i18n setup: `src/i18n.js`
- dictionaries: `src/locales/en.json`, `src/locales/es.json`

## Project Documentation
This project includes documentation for user stories and a class diagram:

- User stories: `docs/user-stories.md`
- Class diagram: `docs/class-diagram.puml`

## GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Requirements

- The repository must have GitHub Pages enabled.
- The Pages source must be set to **GitHub Actions**.
- The Vite `base` option must match the repository name.

### Vite base configuration

If the repository name is `catch-up`, `vite.config.js` should include:

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/catch-up/',
  plugins: [vue()],
})
```

## Attribution

This app uses data and branding services from:

- [Newsdata.io](https://newsdata.io)
- [Logo.dev Logo API](https://logo.dev)

## License

- MIT