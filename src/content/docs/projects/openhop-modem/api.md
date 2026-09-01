---
title: HTTP API Reference
description: Read and configure network-capable openHop Modems through their authenticated LAN HTTP API.
---

Network-capable openHop Modems expose a small HTTP management API on port 80.
It is separate from the binary RF transport on TCP port 5055.

## Security boundary

The API uses HTTP Basic Authentication and does not provide TLS. Change the
factory/example password before trusting the device, and keep access on a trusted
LAN, VPN, or equivalent protected path. Do not expose the API directly to the
public Internet.

Use a board-specific hostname or LAN address:

```bash
curl -u admin:REPLACE_WITH_PASSWORD \
  http://REPLACE_WITH_MODEM_HOST/api/stats
```

The RAK4631 WisMesh Ethernet build uses DHCP but does not advertise mDNS.

## Read endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/temp` | Radio/device temperature data. |
| `GET` | `/api/system` | Firmware, board, uptime, and system state. |
| `GET` | `/api/radio` | Current radio parameters and RF status. |
| `GET` | `/api/network` | Wi-Fi/Ethernet and TCP-service state. |
| `GET` | `/api/stats` | Combined modem, radio, battery, GPS, and board diagnostics. |
| `GET` | `/api/gps` | GPS state and parsed payload when supported by the board and firmware build. |
| `GET` | `/api/config` | Current configurable management values. |

Responses vary by board capability. Station G3 includes PA/LNA controls and
INA219 telemetry. RAK4631 responses redact the TCP token and expose only whether
one is set; GPS fields are unavailable unless serial GPS support was compiled and
configured.

## Write endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/config` | Validate and persist supported configuration changes. |
| `POST` | `/api/reboot` | Schedule a device restart. |
| `POST` | `/dfu/ble` | RAK4631 Ethernet only: enter the installed Bluetooth DFU bootloader. |

A successful configuration save schedules a reboot where required. The RAK
`/dfu/ble` action only enters the installed bootloader: it does not upload a
firmware image and does not create an ESP-style `/update` endpoint. Use the
matching `firmware.zip` with the supported nRF52 DFU workflow.

## API and packet transport are independent

- HTTP management normally uses port 80 and Basic Auth.
- RF packet transport normally uses TCP port 5055 and its own optional token.
- The HTTP password and TCP token are different credentials.
- Repeater can use TCP for packets while independently polling `/api/stats` for
  sensor telemetry and GPS.

See [Repeater Integration](/projects/openhop-modem/repeater-integration/) for the
matching Repeater configuration.
