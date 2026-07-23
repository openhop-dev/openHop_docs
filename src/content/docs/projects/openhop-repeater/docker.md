---
title: Docker Deployment
description: Run openHop Repeater with persistent storage and USB, TCP, SPI, or no-radio backends.
sidebar:
  order: 4.5
---

## Choose an image

The published container tags follow the Repeater branches:

- `openhop/openhop-repeater:main` for the stable line
- `openhop/openhop-repeater:dev` for development testing

Pin a release or digest when reproducibility matters. Upgrading a container means
pulling the new image and recreating the container while retaining its volumes.

## Persistent paths

Persist both runtime paths:

| Container path | Purpose |
| --- | --- |
| `/etc/openhop_repeater` | Configuration and identity material |
| `/var/lib/openhop_repeater` | SQLite, RRD, backups, and other state |

Use named volumes or host directories. Do not bind-mount only a single
`config.yaml` into an otherwise ephemeral `/etc/openhop_repeater`; startup may need
to create an identity and other files beside it.

The container process uses the configured UID/GID. Ensure host bind mounts are
writable by that identity before startup.

## Compose example

```yaml
services:
  repeater:
    image: openhop/openhop-repeater:main
    restart: unless-stopped
    ports:
      - "8000:8000"
    volumes:
      - repeater_config:/etc/openhop_repeater
      - repeater_data:/var/lib/openhop_repeater

volumes:
  repeater_config:
  repeater_data:
```

Open `http://<docker-host>:8000/setup` after first startup.

## Radio access

- **TCP modem:** requires no device mapping; configure `radio_type: pymc_tcp` and
  make sure the container can reach the modem host and port.
- **No radio:** use `radio_type: null` for UI/API evaluation without RF I/O.
- **USB modem or KISS:** map the host serial device, for example
  `/dev/ttyACM0:/dev/ttyACM0`. Host udev rules and permissions control the device;
  udev does not run inside the container.
- **SPI/GPIO:** map only the required SPI/GPIO devices. Board-specific GPIO access
  may require additional host groups or devices; avoid broad `privileged: true`
  unless the hardware path genuinely requires it and you understand the exposure.

Never start an RF backend without the correct antenna and validated regional radio
settings.

## Operations

```bash
docker compose logs -f repeater
docker compose pull
docker compose up -d
```

Back up both persistent volumes before upgrades or identity changes. Keep port 8000
on a trusted LAN/VPN or place it behind an authenticated reverse proxy.

## Related pages

- [First Boot](/projects/openhop-repeater/first-boot/)
- [Hardware Setup](/projects/openhop-repeater/hardware-setup/)
- [Security and Authentication](/projects/openhop-repeater/security-and-authentication/)
