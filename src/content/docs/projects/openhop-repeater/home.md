---
title: Documentation Home
description: Entry point for current openHop Repeater docs.
---

# openHop Repeater Documentation

This section tracks the current local `openhop_repeater` repo rather than the older Raspberry Pi only docs set.

## Start here

1. [What is openHop Repeater?](/projects/openhop-repeater/what-is-openhop-repeater/)
2. [Installation](/projects/openhop-repeater/installation/)
3. [Hardware Setup](/projects/openhop-repeater/hardware-setup/)
4. [Configuration Reference](/projects/openhop-repeater/config-file/)
5. [openHop Modem](/projects/openhop-modem/)
6. [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/)
7. [KISS Setup](/projects/openhop-repeater/kiss-setup/)

## Supported deployment styles

- Native SPI + GPIO hosts using `radio_type: sx1262`
- CH341 USB-SPI hosts using `radio_type: sx1262_ch341`
- Serial TNC hosts using `radio_type: kiss`
- USB-CDC modem hosts using `radio_type: pymc_usb`
- Wi-Fi or Ethernet modem hosts using `radio_type: pymc_tcp`
- Dashboard-only or companion-only hosts using `radio_type: null`
- Proxmox LXC deployments for CH341-backed radios

## Current feature areas

- GPS receiver support and GPS time sync
- background sensor plug-ins exposed through `/api/stats`
- openHop Modem HTTP GPS and `pymc_modem` sensor telemetry
- `mqtt_brokers` based publishing
- openHop Glass control-plane integration
- new hardware presets including uConsole, meshadv, UltraPeater, and UltraPeaterZero

## Useful pages

- [Configuration Reference](/projects/openhop-repeater/config-file/)
- [What is openHop Repeater?](/projects/openhop-repeater/what-is-openhop-repeater/)
- [openHop Modem](/projects/openhop-modem/)
- [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/)
- [LetsMesh Integration](/projects/openhop-repeater/letsmesh-integration/)
- [Identity Management](/projects/openhop-repeater/identity-management/)
- [Troubleshooting](/projects/openhop-repeater/troubleshooting/)

## External resources

- [openHop Repeater repository](https://github.com/openhop-dev/openhop_repeater)
- [openHop Modem firmware](https://github.com/openhop-dev/openhop_modem)
- [openHop Modem Flasher](https://github.com/openhop-dev/openHop-Modem-Flasher)
- [openHop Core](https://github.com/openhop-dev/openhop_core)
- [MeshCore](https://github.com/meshcore-dev/MeshCore)
