---
title: Web Dashboard
description: Use the openHop Repeater dashboard for onboarding, monitoring, configuration, policy, and updates.
sidebar:
  order: 10
---

The CherryPy server provides the browser dashboard and authenticated REST API on
port 8000 by default:

```text
http://<repeater-ip>:8000
```

Keep it on a trusted LAN, VPN, or authenticated reverse proxy. The built-in API
authentication does not make direct public exposure a recommended deployment.

## What you can manage

Current builds expose setup and operational views for:

- system, radio, packet, neighbor, GPS, and sensor status;
- packet history and live WebSocket updates;
- configuration and hardware presets;
- radio settings, CAD calibration, and noise-floor monitoring;
- policy and transport-key management;
- primary, room-server, and companion identities;
- logs, updates, and frontend selection.

The exact cards shown depend on configured hardware and optional services. RRD
charts use `metrics.rrd` when RRD is enabled and available; otherwise chart APIs
can use SQLite-backed data.

## Authentication

The API is authenticated by default except for explicit setup and documentation
routes. The dashboard logs in with the configured admin or guest password and
uses a time-limited JWT. API tokens can be created for integrations and are shown
in plaintext only when created.

- Change default/example passwords during setup.
- Store API tokens like passwords and revoke unused tokens.
- Leave CORS disabled unless a known browser client requires it.
- Do not share screenshots containing tokens, identity keys, location, or private
  network details.

## API documentation

The repeater serves its own Swagger documentation under `/doc`. This central site
also publishes the synchronized [API Reference](/projects/openhop-repeater/api-reference/)
and raw spec at `/openapi/repeater.yaml`.

Interactive requests act on the selected server. Confirm the server URL and use
read-only endpoints first; configuration, identity, advert, calibration, update,
and control endpoints can mutate state or transmit.

## Configuration and restart behavior

Use the dashboard for supported live updates. Changing `radio_type`, KISS
transport, or USB/TCP modem transport requires a service restart. If the UI is
unavailable, edit `/etc/openhop_repeater/config.yaml` carefully and use:

```bash
sudo systemctl restart openhop-repeater
sudo journalctl -u openhop-repeater -f
```

## Updates

Native installs can use the dashboard updater or `manage.sh upgrade`. Docker
installs must pull and recreate the container. Before any upgrade, back up the
configuration, identity, policy, and state data.