# Local Development

This site runs with Astro and Starlight.

## Requirements

- Node.js `22.x`
- `npm`

If you use `nvm`:

```bash
nvm install 22
nvm use 22
```

## Install Dependencies

```bash
npm install
```

## Run The Dev Server

```bash
npm run dev
```

Default local URL:

- `http://localhost:4321/`

## Build The Site

```bash
npm run build
```

## OpenAPI Sync Behavior

Before `dev` and `build`, the repo runs:

```bash
npm run sync:openapi
```

If a local sibling repo exists at:

```text
../openhop_repeater/repeater/web/openapi.yaml
```

the checked-in repeater OpenAPI file will be refreshed from that source.

If that local repo is not present, the docs site falls back to the checked-in spec in:

```text
public/openapi/repeater.yaml
```

## Content Locations

- Main docs content: `src/content/docs/`
- openHop Core docs: `src/content/docs/projects/pymc-core/`
- openHop Repeater docs: `src/content/docs/projects/pymc-repeater/`
- openHop HA Integration docs: `src/content/docs/projects/pymc-ha-integration/`

## Common Commands

```bash
npm run dev
npm run build
npm run preview
```
