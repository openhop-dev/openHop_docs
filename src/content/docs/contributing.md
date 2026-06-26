---
title: Contributing
description: How to add and format markdown pages in openHop Docs.
---

This site is markdown-first. Adding a page should be simple.

## Add a new page

1. Create a `.md` file under one of these directories:
   - `src/content/docs/projects/pymc-core/`
   - `src/content/docs/projects/pymc-repeater/`
   - `src/content/docs/projects/pymc-ha-integration/`
   - `src/content/docs/projects/pymc-ha-addon/`
2. Add frontmatter:

```md
---
title: Your Page Title
description: One-line summary shown in metadata and previews.
---
```

3. Write content using standard Markdown.
4. Run `npm run dev` and verify the page appears in the sidebar.
5. Open a pull request.

## Naming conventions

- Use lowercase file names with hyphens.
- Keep one topic per page.
- Prefer short sections and scannable headings.

## Authoring tips

- Use admonitions for warnings and notes.

```md
> [!NOTE]
> This behavior depends on hardware and region settings.
```

- Use fenced code blocks with language identifiers.
- Link to source repositories for deep implementation details.

## Content scope in this phase

Current first-release sections:

- openHop Core
- openHop Repeater
- openHop HA Integration
- openHop HA Add-on

Additional project sections can be added later using the same directory pattern.
