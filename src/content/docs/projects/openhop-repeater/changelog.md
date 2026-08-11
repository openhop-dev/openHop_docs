---
title: Development History
description: Track openHop Repeater changes by branch and commit because the project does not publish releases.
sidebar:
  order: 18.5
---

openHop Repeater does not publish GitHub Releases or maintain a separate generated
changelog. Track changes through the repository's branch and commit history:

- [`dev` branch commits](https://github.com/openhop-dev/openhop_repeater/commits/dev/)
- [`main` branch commits](https://github.com/openhop-dev/openhop_repeater/commits/main/)
- [openHop Repeater source](https://github.com/openhop-dev/openhop_repeater)

## Record the exact version you run

A branch name is not a fixed version. Record the commit before testing, upgrading,
or reporting a problem:

```bash
git branch --show-current
git rev-parse HEAD
```

For containers, also record the image tag and immutable image digest. Moving `dev`
or `main` tags can point to different builds later.

## Review changes before upgrading

Fetch the target branch, then inspect the commits and file-level change summary from
your currently deployed commit. Replace `CURRENT_COMMIT` with the commit you recorded
from the running installation or deployment artifact.

```bash
git fetch origin --prune
git log --oneline CURRENT_COMMIT..origin/dev
git diff --stat CURRENT_COMMIT..origin/dev
```

Use `origin/main` instead when the deployment intentionally tracks `main`. Read the
actual changed configuration, migration, packaging, and hardware files before
upgrading; commit subjects alone are not an operational migration guide.

## Before changing commits

1. Back up configuration, identities, and persistent application data.
2. Confirm whether the deployment is native, Docker, Home Assistant, or Unraid.
3. Follow the matching upgrade path in [Installation](/projects/openhop-repeater/installation/)
   or [Docker Deployment](/projects/openhop-repeater/docker/).
4. Keep the previous commit or container digest and backup until the service,
   dashboard, storage, and radio backend have been verified.

For removal rather than an upgrade, see
[Uninstallation](/projects/openhop-repeater/uninstallation/).
