---
title: Architecture and Transports
description: Understand the protocol, node, companion, and hardware layers in openHop Core.
sidebar:
  order: 3
---

openHop Core separates MeshCore wire compatibility from application behavior and
physical transport. Choose the highest-level layer that fits your application.

## Layered architecture

| Layer | Main package | Responsibility |
| --- | --- | --- |
| Protocol | `openhop_core.protocol` | Packets, builders, routing fields, identities, cryptography, transport keys, and filtering |
| Node | `openhop_core.node` | Radio dispatch, serialized transmission, receive handlers, acknowledgements, and lifecycle |
| Companion | `openhop_core.companion` | Contacts, channels, queues, messaging, adverts, paths, telemetry, and companion frame protocol |
| Hardware | `openhop_core.hardware` | Direct SPI, serial, USB, TCP, and WebSocket radio implementations |

`MeshNode` is intentionally a thin transport layer. Application-level contact
lookup, message construction, response correlation, and persistence belong in the
companion layer or in your application.

## Radio contract

Radio implementations follow the `LoRaRadio` interface. They initialize the
transport, send bytes asynchronously, arm receive callbacks or waits, expose signal
metadata, and enter a low-power state when supported.

A successful `send()` returns a metadata mapping, which may be empty. `None`
indicates failure. Custom backends must preserve that distinction so the dispatcher
does not report successful transmissions as failed.

## Supported backend families

| Backend | Typical class | Install extra | Connection |
| --- | --- | --- | --- |
| Direct SX1262 | `SX1262Radio` | `hardware` | Linux SPI and GPIO |
| KISS TNC | `KissSerialWrapper` | `hardware` | Serial |
| MeshCore KISS modem | `KissModemWrapper` | `hardware` | Serial |
| openHop Modem USB | `USBLoRaRadio` | `hardware` | USB-CDC |
| openHop Modem TCP | `TCPLoRaRadio` | base dependencies plus transport requirements | TCP/IP |
| WebSocket radio | `WsRadio` | `websocket` | WebSocket (experimental) |

Compatibility identifiers such as `pymc_usb`, `pymc_tcp`, and some environment
variables remain part of the transport API even though the user-facing product is
openHop Modem.

The current `WsRadio` implementation does not yet satisfy every dispatcher
success-return expectation, so do not present it as a drop-in production backend
without application-level verification.

## Lifecycle ownership

`MeshNode.start()` blocks in the dispatcher until `stop()` is called. Run it in an
async task when the application needs to do other work. Calling `node.stop()` stops
the dispatcher and disarms receive handling, but the caller still owns the radio's
shutdown and cleanup.

The companion layer offers a higher-level lifecycle. `CompanionRadio` owns a
`MeshNode` and starts its dispatcher internally; `CompanionBridge` shares an
existing dispatcher through a packet-injection callback.

## Hardware safety

Examples and constructors can open serial ports, GPIO chips, SPI devices, network
connections, and transmit RF. Before running one:

1. Match the backend to the actual device and board revision.
2. Verify GPIO numbering, SPI bus/chip select, TCXO, and RF-switch requirements.
3. Match frequency, bandwidth, spreading factor, coding rate, preamble, and sync
   settings with the mesh.
4. Attach an antenna suitable for the configured band.
5. Follow regional frequency, duty-cycle, and transmit-power limits.

Do not treat example frequencies or pin maps as universal presets.

## Related resources

- [Quick Start](/projects/openhop-core/quick-start/)
- [Companion Applications](/projects/openhop-core/companion-applications/)
- [openHop Repeater Hardware Setup](/projects/openhop-repeater/hardware-setup/)
- [Source hardware package](https://github.com/openhop-dev/openhop_core/tree/dev/src/openhop_core/hardware)
