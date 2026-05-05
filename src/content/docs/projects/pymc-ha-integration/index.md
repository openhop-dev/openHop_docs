---
title: pyMC Repeater Home Assistant Integration
description: Home Assistant integration docs for connecting to a local pyMC_Repeater instance.
sidebar:
  order: 1
---

Welcome to the docs for the `pyMC Repeater` Home Assistant integration.

This integration connects Home Assistant directly to a local `pyMC_Repeater` instance, creates a dedicated API token during setup, and exposes repeater telemetry, MQTT broker state, control entities, and advanced service actions inside Home Assistant.

## Quick links

- [Installation](/projects/pymc-ha-integration/installation/)
- [Setup in Home Assistant](/projects/pymc-ha-integration/setup-in-home-assistant/)
- [Entities and Controls](/projects/pymc-ha-integration/entities-and-controls/)
- [Dashboard Template](/projects/pymc-ha-integration/dashboard-template/)
- [Actions and Advanced Services](/projects/pymc-ha-integration/actions-and-advanced-services/)

## Highlights

- config flow setup from the Home Assistant UI
- token-based auth after initial admin-password bootstrap
- repeater, hardware, database, MQTT, ACL, room, companion, update, and GPS telemetry
- Home Assistant sensors, binary sensors, buttons, numbers, selects, and switches
- built-in Lovelace dashboard template

## Repository

- Integration repo: [pyMC-HA-Integration](https://github.com/pyMC-dev/pyMC-HA-Integration)
- pyMC_Repeater upstream: [rightup/pyMC_Repeater](https://github.com/rightup/pyMC_Repeater)
