# pyMC Docs

Documentation hub for pyMC projects, currently focused on:

- pyMC_core
- pyMC_Repeater
- pyMC_HA

Built with Astro Starlight and styled to align with files.pymc.dev brand direction.

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Content Authoring

- Place Markdown files in `src/content/docs/`
- Add project pages under:
	- `src/content/docs/projects/pymc-core/`
	- `src/content/docs/projects/pymc-repeater/`
- Use frontmatter:

```md
---
title: Page Title
description: One-line page description
---
```
