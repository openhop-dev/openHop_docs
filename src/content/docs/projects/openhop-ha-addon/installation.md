---
title: Installation
description: Install the openHop HA Add-on repository and choose the right add-on channel.
---

# Installation

The add-on repository lives at:

```text
https://github.com/openhop-dev/openHop-HA-Add-on
```

## Choose a channel

- `openHop Repeater Dev` follows the upstream `:dev` image
- `openHop Repeater Main` follows the upstream `:main` image

If you want the newest Repeater features first, use Dev. Use Main for the
mainline channel. They are separate installed add-ons with separate slugs and
storage; switching means a manual migration of config, identity, and state rather
than changing a channel setting.

## Add the repository

Add the repository URL to Home Assistant's add-on repositories list, then refresh the store.

## Install the add-on

1. Install either `openHop Repeater Dev` or `openHop Repeater Main`.
2. Review the add-on's broad hardware privileges. If Home Assistant exposes a
   Protection mode control, local GPIO/SPI/USB access may require it to be off.
3. Start the add-on. Its bootstrap helper creates or merges `/config/config.yaml`
   from the packaged template without replacing an existing config.
4. Open `http://<home-assistant-host>:8000/setup` and complete the Repeater setup
   flow, or edit the private add-on config file directly.
5. Restart the add-on after changes that require a Repeater restart.

## Web UI

The add-on exposes the upstream repeater UI on:

```text
http://<home-assistant-host>:8000
```

The add-on uses host networking, so the dashboard and any companion/room-server
listeners bind directly on the Home Assistant host. Avoid running both channels
at the same time unless every listener port is deliberately separated.

## Backups and channel changes

Both manifests request cold Home Assistant backups. Before uninstalling, changing
channels, or repairing a failed startup, create a backup and confirm it includes
the add-on's private config and data. Never copy only `config.yaml`: identity,
policy, messages, contacts, and other runtime state may live in the add-on data.

## Architectures

The current add-on manifests declare:

- `aarch64`
- `amd64`

## Related pages

- [Configuration](/projects/openhop-ha-addon/configuration/)
- [Host Access and Storage](/projects/openhop-ha-addon/host-access/)
- [openHop Repeater Configuration Reference](/projects/openhop-repeater/config-file/)
