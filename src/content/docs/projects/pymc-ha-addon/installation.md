---
title: Installation
description: Install the pyMC HA Add-on repository and choose the right add-on channel.
---

# Installation

The add-on repository lives at:

```text
https://github.com/pyMC-dev/pyMC-HA-Add-on
```

## Choose a channel

- `pyMC Repeater Dev` follows the upstream `:dev` image
- `pyMC Repeater Main` follows the upstream `:main` image when it is published

If you want the newest repeater features first, use `pyMC Repeater Dev`.

## Add the repository

Add the repository URL to Home Assistant's add-on repositories list, then refresh the store.

## Install the add-on

1. Install either `pyMC Repeater Dev` or `pyMC Repeater Main`.
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

- [Configuration](/projects/pymc-ha-addon/configuration/)
- [Host Access and Storage](/projects/pymc-ha-addon/host-access/)
- [pyMC Repeater Configuration Reference](/projects/pymc-repeater/config-file/)
