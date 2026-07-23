---
title: Installation and First Start
description: Install openHop Repeater from Unraid Community Applications and preserve its configuration and state.
sidebar:
  order: 2
---

## Install from Community Applications

Open the official [openHop-Repeater Community Applications listing](https://ca.unraid.net/apps/openhop-repeater-1gfdqts1upcz84),
then install it from the Unraid Apps interface:

1. Open **Apps** in the Unraid WebGUI.
2. Search for **openHop Repeater**.
3. Select Main for normal use or Dev when intentionally testing development builds.
4. Confirm the persistent paths and port mappings.
5. Apply the template and allow Unraid to create the container.

If the listing is not yet available in your CA feed, use the template repository's
current installation guidance rather than copying an unverified third-party XML.

## Check the template fields

| Setting | Default |
| --- | --- |
| Network | Bridge |
| Privileged | Disabled |
| Config | `/mnt/user/appdata/openhop-repeater/config` |
| Runtime data | `/mnt/user/appdata/openhop-repeater/data` |
| Web UI/API | Host 8000 → container 8000 |
| Companions | Host 5001–5003 → matching container ports |

The official template overrides the runtime user to root because Unraid creates new
bind-mount directories as root. It retains the image's Repeater Python site-packages
through `PYTHONPATH`. Do not remove that template contract casually.

## First start

1. Confirm ports 8000 and 5001–5003 are free, or change only the host-side values.
2. Start the container once.
3. Open `http://<unraid-ip>:8000/setup`.
4. Replace the seeded example admin and guest passwords immediately.
5. Select the radio backend and verify regional frequency, power, modulation,
   antenna, and device/TCP settings before enabling transmission.
6. If companion identities are enabled, make their listeners use container ports
   5001, 5002, and 5003.

The entrypoint creates `config.yaml` on first start and conservatively merges new
defaults during later image updates while preserving configured values.

## TCP modem

A TCP modem needs no Docker device mapping. Configure `radio_type: pymc_tcp` and
the modem's reachable LAN address/port in the Repeater setup flow. Confirm Unraid's
container network can reach that address.

## USB or KISS modem

Add the serial interface as a Docker **Device**, not a normal Path. Prefer a stable
`/dev/serial/by-id/...` path. See [USB Device Setup](/projects/openhop-unraid/usb-device-setup/).

## Updates and channel changes

Use Unraid's normal container update flow. Persistent config/data mappings survive
container replacement. Back them up first when the update includes schema or
identity-related changes.

To change between Main and Dev, edit the container and select the other image tag.
The openHop web UI cannot switch Docker image channels.

## Troubleshooting

```bash
docker logs --tail 100 openHop-Repeater
docker inspect openHop-Repeater
```

Common first-start failures are host-port conflicts, unwritable appdata directories,
missing USB Device mappings, or a TCP modem address unreachable from the container.
