---
title: Device Setup
description: Choose, connect, and provision an openHop Modem device.
---

# openHop Modem Device Setup

openHop Modem firmware supports multiple boards from the same `pymc_modem` source tree. Pick the firmware variant that matches the exact board, flash it, then choose whether the repeater will talk to it over USB or over TCP.

## Supported boards

| Device | Firmware environment | Network path |
| --- | --- | --- |
| Heltec WiFi LoRa 32 V3 | `heltec_v3` | Wi-Fi TCP + USB-CDC |
| Heltec WiFi LoRa 32 V4 | `heltec_v4` | Wi-Fi TCP + USB-CDC |
| Heltec Wireless Tracker V2 | `heltec_tracker_v2` | Wi-Fi TCP + USB-CDC |
| Ikoka Stick | `ikoka_stick` | Wi-Fi TCP + USB-CDC |
| Seeed XIAO Wio-SX1262 | `xiao_wio_sx1262` | Wi-Fi TCP + USB-CDC |
| MeshSmith Photon-1W ESP32-C6 | `photon_1w_xiao_esp32c6` | Wi-Fi TCP + USB-CDC |
| LilyGO T-LoRa T3-S3 v1.2/v1.3 | `lilygo_t3s3` | Wi-Fi TCP + USB-CDC |
| RAK3112 WisMesh | `rak3112_wismesh` | Wi-Fi TCP + USB-CDC |
| B&Q Consulting Station G2 | `station_g2` | Wi-Fi TCP + USB-CDC |
| WaveShare ESP32-P4-Nano | `esp32_p4_nano` | Ethernet or Wi-Fi TCP + USB flashing/debug paths |
| Heltec T114 | `heltec_t114` | USB-CDC only |
| Seeed XIAO nRF52840 + Wio-SX1262 | `xiao_nrf52_wio` | USB-CDC only |

Use the hosted flasher for normal installs and updates: [flasher.openhop.dev](https://flasher.openhop.dev/). For source builds, see the [pymc_modem repository](https://github.com/pyMC-dev/pymc_modem).

## USB mode checklist

Use USB mode when the modem is physically attached to the repeater host.

1. Flash the board with the matching openHop Modem firmware.
2. Connect the board to the repeater host over USB.
3. Find the serial device:

```bash
ls -la /dev/ttyACM* /dev/ttyUSB*
```

4. Configure Repeater with `radio_type: pymc_usb` and the detected port.

Typical ports:

- `/dev/ttyACM0` for native USB-CDC boards
- `/dev/ttyUSB0` for USB-UART bridge boards

If the Linux service user cannot open the device, fix group membership or add a udev rule before troubleshooting Repeater itself.

## TCP mode checklist

Use TCP mode when the modem is on the same LAN as the repeater host.

1. Flash the board with the matching openHop Modem firmware.
2. Provision Wi-Fi, or connect Ethernet on supported boards.
3. Confirm the modem's hostname or IP address.
4. Configure Repeater with `radio_type: pymc_tcp`, `host`, and `port: 5055`.

On first boot, Wi-Fi-capable modems expose a setup access point named like `LoRa-Modem-XXXX`. Connect to it, open `http://192.168.4.1`, choose the Wi-Fi network, save, and let the modem reboot.

The modem mDNS hostnames are board-specific and include the final MAC bytes. Examples include:

- `heltec-<mac3>.local`
- `heltec-v4-<mac3>.local`
- `tracker-v2-<mac3>.local`
- `ikoka-<mac3>.local`
- `xiao-wio-<mac3>.local`
- `photon-c6-<mac3>.local`
- `lilygo-t3s3-<mac3>.local`
- `rak3112-<mac3>.local`
- `station-g2-<mac3>.local`
- `p4nano-<mac3>.local`

## HTTP management and diagnostics

Network-capable modems expose a small HTTP UI and JSON API. Current firmware protects the HTTP surface with Basic Auth.

Default credentials on first boot:

- user: `admin`
- password: `password`

Change the password from the modem web UI after first setup. The same HTTP API is used by Repeater's optional `pymc_modem` sensor and `modem_http` GPS source.

Useful checks:

```bash
curl -u admin:password http://<modem-host>/api/stats
curl -u admin:password http://<modem-host>/
```

## Network exposure

The modem network services are intended for LAN use. Do not port-forward the modem TCP service or HTTP management page to the public Internet. Use a VPN if the repeater and modem are not on the same private network.
