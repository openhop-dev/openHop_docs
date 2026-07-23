---
title: Security and Authentication
description: Secure dashboard, API, WebSocket, identity, and integration access to openHop Repeater.
sidebar:
  order: 12.5
---

The embedded HTTP service is designed for a trusted network. It is not a hardened
public-internet boundary.

## First login

Use `http://<repeater-ip>:8000/setup` for initial onboarding. Replace all example or
default admin and guest passwords. When no JWT secret exists, Repeater generates
one; keep the resulting config private.

Most `/api` routes require authentication. Public setup and documentation routes
are intentionally limited. Do not assume an endpoint is harmless because it is a
GET request, and do not expose the interactive API viewer to untrusted users.

## Authentication methods

- Browser sessions use JWT authentication.
- Automation can use API tokens created through the authenticated dashboard/API.
- WebSocket connections also require the expected authenticated session/token.

Use a separate token per integration, give it only the needed access, and revoke it
when a client is retired. Never place credentials in URLs, screenshots, issue
reports, or shell history.

## Network exposure

The default listener is `0.0.0.0:8000`. Prefer one of:

- trusted LAN plus firewall rules;
- authenticated VPN;
- authenticated HTTPS reverse proxy.

CORS is disabled by default. Enabling it permits broad browser cross-origin access;
do so only for a known frontend and treat the bearer token as the remaining
security boundary.

## Protect secret material

Treat these as secrets:

- `repeater.identity_key` or the configured identity file;
- JWT secret and user password hashes;
- API tokens;
- modem, MQTT, LetsMesh, and Glass tokens or credentials;
- backups containing configuration or databases.

Do not paste the complete config into support requests. Redact values while leaving
field names and non-sensitive topology details visible.

The main Repeater identity, room-server identities, companion identities, and
transport keys serve different purposes. Back them up separately and do not reuse
one as another.

## Backup and recovery

Back up `/etc/openhop_repeater` and `/var/lib/openhop_repeater` together. Store the
backup encrypted and test recovery off-air or in `no_tx`/null-radio mode. Restoring
only the database without the matching identity/config can produce a different
node identity or unusable integration credentials.

## Related pages

- [Identity Management](/projects/openhop-repeater/identity-management/)
- [API Reference](/projects/openhop-repeater/api-reference/)
- [Troubleshooting](/projects/openhop-repeater/troubleshooting/)
