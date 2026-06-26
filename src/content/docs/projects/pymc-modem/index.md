---
title: openHop Modem Overview
description: Device, firmware, flasher, and repeater integration docs for openHop Modem hardware.
---

openHop Modem turns supported ESP32-family and nRF52 LoRa boards into modem devices that can be driven by openHop Repeater over USB-CDC or over a LAN TCP connection.

The modem firmware owns the radio hardware and exposes a small control/data surface. The repeater still owns MeshCore routing, identities, storage, the dashboard, MQTT, sensors, and GPS integration.

## What this section covers

- Choosing a supported modem device
- Flashing firmware with the browser-based openHop Modem Flasher
- Provisioning Wi-Fi or Ethernet devices for TCP mode
- Selecting `pymc_usb` or `pymc_tcp` inside openHop Repeater
- Enabling modem diagnostics as a Repeater sensor
- Enabling modem HTTP GPS as Repeater's native GPS source

## Repositories and tools

- Modem firmware and Python driver: [openhop_modem](https://github.com/openhop-dev/openhop_modem)
- Browser flasher: [flasher.openhop.dev](https://flasher.openhop.dev/)

## Supported connection modes

| Mode | Repeater `radio_type` | Use when |
| --- | --- | --- |
| USB-CDC | `pymc_usb` | The modem is plugged into the repeater host with USB. |
| Wi-Fi / Ethernet TCP | `pymc_tcp` | The modem is on the LAN and exposes the MeshCore modem TCP service, normally on port `5055`. |

Networked modems with an HTTP API can also feed Repeater diagnostics and GPS through `/api/stats`. Those are separate from the RF transport: you can use `pymc_tcp` for packets, `pymc_modem` for sensor telemetry, and `modem_http` for native GPS.

## Next steps

1. Pick a supported board in [Device Setup](/projects/pymc-modem/device-setup/).
2. Flash or update it using [Firmware Flasher](/projects/pymc-modem/flasher/).
3. Connect it to openHop Repeater using [Repeater Integration](/projects/pymc-modem/repeater-integration/).
