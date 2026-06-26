---
title: Installation
description: Install the openHop Repeater Home Assistant integration with HACS or manually.
sidebar:
  order: 2
---

## HACS

1. Open `HACS` in Home Assistant.
2. Go to `Integrations`.
3. Open the top-right menu and choose `Custom repositories`.
4. Add:

   ```text
   https://github.com/openhop-dev/openHop-HA-Integration
   ```

5. Choose `Integration`.
6. Install `openHop Repeater`.
7. Restart Home Assistant.

## Manual installation

1. Copy `custom_components/pymc_repeater` into your Home Assistant config directory:

   ```text
   /config/custom_components/pymc_repeater
   ```

2. Restart Home Assistant.

## Requirements

- a running `openhop_repeater` instance
- network reachability from Home Assistant to the repeater host and port
- the repeater admin password for the initial setup flow

## Related

- [Setup in Home Assistant](/projects/openhop-ha-integration/setup-in-home-assistant/)
