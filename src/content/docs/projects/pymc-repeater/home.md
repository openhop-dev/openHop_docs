---
title: Documentation Home
description: Entry point for current pyMC Repeater docs.
---

# pyMC Repeater Documentation

This section tracks the current local `pyMC_Repeater` repo rather than the older Raspberry Pi only docs set.

## Start here

1. [Installation](/projects/pymc-repeater/installation/)
2. [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
3. [Configuration Reference](/projects/pymc-repeater/config-file/)
4. [KISS Setup](/projects/pymc-repeater/kiss-setup/)

## Supported deployment styles

- Native SPI + GPIO hosts using `radio_type: sx1262`
- CH341 USB-SPI hosts using `radio_type: sx1262_ch341`
- Serial TNC hosts using `radio_type: kiss`
- Proxmox LXC deployments for CH341-backed radios

## Current feature areas

- GPS receiver support and GPS time sync
- `mqtt_brokers` based publishing
- pyMC_Glass control-plane integration
- new hardware presets including uConsole, meshadv, UltraPeater, and UltraPeaterZero

## Useful pages

- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [LetsMesh Integration](/projects/pymc-repeater/letsmesh-integration/)
- [Identity Management](/projects/pymc-repeater/identity-management/)
- [Troubleshooting](/projects/pymc-repeater/troubleshooting/)

## External resources

- [pyMC_Repeater repository](https://github.com/rightup/pyMC_Repeater)
- [pyMC Core](https://github.com/rightup/pyMC_core)
- [MeshCore](https://github.com/rightup/MeshCore)
