# react-weather-app

A lightweight weather app that shows the **current conditions for your location**, detected automatically from your browser. Built with Vite + React 19 + Chakra UI v3, powered by the free [Open-Meteo](https://open-meteo.com) API — no API keys required.

🔗 **Live demo:** https://react-weather-app-phillip7.vercel.app/

## Features

- 📍 **Automatic location** — uses the browser Geolocation API; no manual search needed.
- 🏙️ **Place name** — reverse-geocodes your coordinates into a "City, Country" label.
- 🌡️ **Current conditions** — temperature, "feels like", humidity, and wind.
- 🌤️ **At-a-glance icons** — WMO weather codes mapped to emoji + descriptions.
- ⚡ **Resilient states** — clear loading, permission-denied, and error messaging.

## Tech stack

- **Vite 8** + **React 19** + **TypeScript** (strict)
- **Chakra UI v3** for components and theming
- **Open-Meteo** for weather data, **BigDataCloud** for reverse geocoding
- Deployed on **Vercel**

## Getting started

**Prerequisites:** [Node.js](https://nodejs.org) 18+ and [pnpm](https://pnpm.io) (the project's package manager).

```bash
# 1. Install dependencies
pnpm install

# 2. Start the dev server (runs on http://localhost:5173)
pnpm dev
```

Open the printed `localhost` URL and **allow location access** when the browser prompts. Geolocation only works over `https` or `localhost`, so the local dev server is fine.

## Scripts

| Command        | Description                                              |
| -------------- | -------------------------------------------------------- |
| `pnpm dev`     | Start the Vite dev server with hot reload.               |
| `pnpm build`   | Type-check (`tsc -b`) and produce a production build.    |
| `pnpm preview` | Serve the built `dist/` locally.                         |
| `pnpm lint`    | Run oxlint.                                              |

## How it works

From a single set of coordinates (from `navigator.geolocation`), the app fetches in parallel:

- **Weather** from Open-Meteo (the critical path), and
- **A place name** from BigDataCloud's keyless reverse-geocoding endpoint (best-effort — if it fails, the weather still shows).

All weather logic lives under `src/weather/` as a thin, one-directional pipeline of hooks (`useGeolocation`, `useWeather`, `useLocationName`) feeding a single `CurrentWeather` component.

## License

This project is for learning/demo purposes.
