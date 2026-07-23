---
title: Transport Keys
description: Configure scoped flood regions and transport-key policy without exposing key material.
sidebar:
  order: 13
---

Transport keys scope flood traffic to a region or group. A scoped flood carries a
derived transport code; a repeater compares that code with its stored keys and
applies the matching key's flood policy. Direct-routed packets are unaffected.

## Where keys are stored

Transport keys are runtime records in Repeater storage, not a static
`transport_keys:` block in `config.yaml.example`. Manage them through the
authenticated dashboard or API. The API supports listing, creating, reading,
updating, and deleting keys under the Transport Keys endpoints.

The Repeater caches the stored key list briefly for packet processing. Create,
update, and delete operations invalidate that cache through the supported API
path; do not edit the SQLite database directly.

## Flood policy interaction

- `mesh.unscoped_flood_allow` controls flood traffic that has no transport code.
- A scoped flood must match a stored transport key.
- Each matching key has an allow/deny flood policy.
- `mesh.default_region` scopes locally originated repeater adverts when set.
- `mesh.path_hash_mode` and `mesh.loop_detect` control different routing
  behaviors and do not replace transport-key policy.

## Configure a default region

Use the dashboard or mesh CLI to select a stored region for repeater-originated
flood adverts. Keep `mesh.default_region: null` when locally originated floods
should remain unscoped. Clearing a region must clear both the name and effective
key; use the supported UI/API/CLI rather than editing partial values.

## Security and operations

- Treat the raw 16-byte key as a secret. Do not paste it into issues, logs,
  screenshots, or public config examples.
- Distribute a region key through a trusted channel.
- Name regions consistently so operators can identify intended scope.
- Test with a non-critical key and monitor denied/matched traffic before broadly
  enforcing a policy.
- During rotation, account for nodes still using the old key before removing it.
- Back up Repeater state securely; transport-key records live with runtime data.

See [Configuration Reference](/projects/openhop-repeater/config-file/#mesh) and
the authenticated [API Reference](/projects/openhop-repeater/api-reference/) for
the current controls.
