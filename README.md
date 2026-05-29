# GPX Activity Map Editor

A map editor for visualising and styling GPS activity tracks, with Strava integration.

## Stack

- React 19, TypeScript, Vite, SASS
- State: Zustand
- Data fetching: TanStack Query
- Router: React Router v6
- Map: Mapbox GL JS

## Features

- Import activity tracks from Strava — search by name or paste a Strava activity URL
- Display track on map with auto-fit bounds
- Start and end markers with toggle visibility
- OAuth 2.0 Strava authentication

## Planned

- Theme editor
- GPX file import
- Export map as image
- Custom marker icons
- Multi-track support

## Setup

1. Copy the following to `.env.local` and fill in your keys:

```
VITE_MAPBOXGL_ACCESS_TOKEN=
VITE_STRAVA_CLIENT_ID=
VITE_STRAVA_CLIENT_SECRET=
VITE_STRAVA_REDIRECT_URI=http://localhost:5173/strava/callback
```

2. Install dependencies:

```
npm install
```

3. Start the dev server:

```
npm run dev
```
