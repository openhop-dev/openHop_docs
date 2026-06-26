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
- `openHop Repeater Main` follows the upstream `:main` image when it is published

If you want the newest repeater features first, use `openHop Repeater Dev`.

## Add the repository

Add the repository URL to Home Assistant's add-on repositories list, then refresh the store.

## Install the add-on

1. Install either `openHop Repeater Dev` or `openHop Repeater Main`.
2. If you are using local Pi GPIO or SPI hardware, disable `Protection mode` before starting the add-on.
3. Start the add-on once so it seeds its config directory.
4. Edit the generated `config.yaml`.
5. Start the add-on again and open the web UI.

## Web UI

The add-on exposes the upstream repeater UI on:

```text
http://<home-assistant-host>:8000
```

The add-on uses host networking, so the repeater companion services and the dashboard bind directly on the Home Assistant host.

## Architectures

The current add-on manifests declare:

- `aarch64`
- `amd64`

## Related pages

- [Configuration](/projects/openhop-ha-addon/configuration/)
- [Host Access and Storage](/projects/openhop-ha-addon/host-access/)
- [openHop Repeater Configuration Reference](/projects/openhop-repeater/config-file/)
