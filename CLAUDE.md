# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A weather app built with Vite + React 19 + Chakra UI v3. It shows current conditions (and, per the README, planned 7-day forecasts) for the user's location, powered by the free [Open-Meteo](https://open-meteo.com) API. Deployed on Vercel.

## Commands

Package manager is **pnpm** (pinned via `packageManager` in `package.json`); use it, not npm/yarn.

- `pnpm dev` — start the Vite dev server (on `localhost`, which is required for the browser Geolocation API to work).
- `pnpm build` — type-check the whole project (`tsc -b`) then produce a production build.
- `pnpm lint` — run oxlint.
- `pnpm preview` — serve the built `dist/` locally.

There is no test runner configured yet. To verify changes, run `pnpm exec tsc -b` (typecheck) and `pnpm lint` together.

## Architecture

All weather logic lives under `src/weather/`, structured as a thin layered pipeline. From a single set of `coords`, two independent APIs run in parallel — Open-Meteo for weather (the critical path) and BigDataCloud for the place name (best-effort decoration):

```
                                  ┌→ useWeather       → fetchCurrentWeather (Open-Meteo)  → { data, error, loading }
useGeolocation → coords (shared) ─┤
                                  └→ useLocationName  → fetchLocationName  (BigDataCloud) → string | null
                                                          ↓
                                                   CurrentWeather (UI)
```

- **`useGeolocation.ts`** — wraps `navigator.geolocation.getCurrentPosition` into `{ coords, error, loading }`. Owns permission/unsupported-browser error messaging. Runs once on mount.
- **`useWeather.ts`** — takes the `Coordinates | null` from the geolocation hook and fetches when they arrive. Uses an `AbortController` to cancel stale in-flight requests on coord change/unmount; aborted requests are swallowed, not surfaced as errors.
- **`useLocationName.ts`** — parallel hook for reverse-geocoding the same coords. Deliberately **best-effort**: returns a bare `string | null` (not the `{ data, error, loading }` shape) because a failed/slow name lookup must never block or break the weather display. All errors are swallowed to `null`.
- **`api.ts`** — `fetchCurrentWeather(coords, signal)` is the only place that talks to Open-Meteo. It maps the snake_case `OpenMeteoResponse.current` payload into the app's camelCase `CurrentWeather` type. Add/remove requested fields by editing both the `current` query params and the response mapping here.
- **`geocoding.ts`** — `fetchLocationName(coords, signal)` reverse-geocodes via BigDataCloud's free, keyless client-side endpoint, returning `"City, Country"`. Falls back through `city → locality → principalSubdivision` for sparse areas.
- **`weatherCodes.ts`** — maps numeric WMO weather codes to `{ label, emoji }`. `describeWeather(code)` falls back to "Unknown" for unmapped codes.
- **`types.ts`** — shared `Coordinates` and `CurrentWeather` shapes (the app's internal model, distinct from the raw API shape in `api.ts`).
- **`CurrentWeather.tsx`** — the only component that consumes the hooks. Renders mutually exclusive states in order: geo loading → geo error → weather loading → weather error → data. `App.tsx` just mounts it.

When extending (e.g. forecast, city search, °C/°F toggle): confine each network call to its own module (`api.ts` / `geocoding.ts`), keep the app-facing types in `types.ts` decoupled from the raw API shape, and add new states to the hooks rather than fetching inside components.

## Conventions

- **Units:** Open-Meteo defaults to °C / km/h; there is no unit conversion layer.
- **Chakra UI v3** (note: v3 API differs significantly from v2). The theme is provided in `src/components/ui/provider.tsx` via `defaultSystem`; semantic tokens like `bg.subtle`, `fg.muted`, `fg.error` are used instead of raw colors. A Chakra UI MCP server is available for component examples, props, and v2→v3 review.
- **TypeScript** is strict with `verbatimModuleSyntax` (use `import type` for type-only imports) and `noUnusedLocals`/`noUnusedParameters` — unused code fails the build.
- **oxlint** enforces React rules of hooks and `react/only-export-components`.
