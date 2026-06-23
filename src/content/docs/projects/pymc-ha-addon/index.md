---
title: openHop HA Add-on Overview
description: Run openHop Repeater inside Home Assistant using the openHop HA Add-on repository.
---

openHop HA Add-on packages `pyMC_Repeater` as Home Assistant add-ons so you can run the repeater inside Home Assistant with the same upstream config model and web UI.

## What this section covers

- repository and channel overview
- installation flow inside Home Assistant
- where the add-on stores `config.yaml` and runtime state
- host-access expectations for GPIO, SPI, USB, serial, and network transports

## Useful links

- Project repository: [openHop HA Add-on](https://github.com/pyMC-dev/pyMC-HA-Add-on)
- Upstream repeater: [openHop Repeater](https://github.com/pyMC-dev/pyMC_Repeater)

## Channels

- `pyMC Repeater Dev` tracks `pymcdev/pymc-repeater:dev`
- `pyMC Repeater Main` tracks `pymcdev/pymc-repeater:main` when that channel is published upstream

## Next step

- Start with [Installation](/projects/pymc-ha-addon/installation/)
- Then read [Configuration](/projects/pymc-ha-addon/configuration/)
- Use [Host Access and Storage](/projects/pymc-ha-addon/host-access/) for GPIO, SPI, USB, and path details
