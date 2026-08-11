---
title: openHop Core API Reference
description: Stable index of the public protocol, node, hardware, and companion APIs currently exported by openHop Core dev.
sidebar:
  order: 7
---

This page is a stable **index**, not generated API documentation. It tracks the
public exports at openHop Core `dev` commit
[`0d1dbf2`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499).
The library is under active development, so inspect the linked source and
installed version before depending on a signature that is not described here.

There is no single, current, generated public API site. The repository still
contains legacy MkDocs API inputs, but current package exports, implementations,
and tests are authoritative.

## Top-level imports

[`openhop_core.__init__`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/__init__.py)
exports:

- `MeshNode`
- `LocalIdentity`
- `Packet`
- `CryptoUtils`
- `CompanionRadio` and `CompanionBridge` when the companion imports are available
- `__version__`

```python
from openhop_core import CryptoUtils, LocalIdentity, MeshNode, Packet
```

Prefer the package-specific imports below when you need builders, filters,
handlers, transport classes, or companion models.

## MeshNode

`MeshNode` is the lower-level node facade around a radio, local identity,
dispatcher, and event service. Its `start()` call runs until another task calls
`stop()`; the application remains responsible for closing the radio.

- Import: `from openhop_core.node import MeshNode`
- Source: [`node/node.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/node.py)
- Runtime package: [`node/__init__.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/__init__.py)
- Tests: [`tests/test_mesh_node.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/tests/test_mesh_node.py)

The node package also exports `EventService`, `EventSubscriber`, `MeshEvents`,
and the core packet-handler classes. See [Node Usage](/projects/openhop-core/node-usage/)
for lifecycle and handler wiring, and [Quick Start](/projects/openhop-core/quick-start/)
for a minimal task-based startup shape.

Detailed method, event, callback, and handler coverage is in
[Node and Dispatcher API](/projects/openhop-core/node-and-dispatcher-api/).

## Dispatcher

`Dispatcher` owns serialized transmission, receive dispatch, acknowledgement
waiters, packet filtering/deduplication, airtime budgeting, and node lifecycle.
Use it directly only when `MeshNode` or the companion layer is too high-level.

- Import: `from openhop_core.node import Dispatcher`
- Source: [`node/dispatcher.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/dispatcher.py)
- Tests: [`tests/test_dispatcher.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/tests/test_dispatcher.py)

Important contract: a radio's successful asynchronous `send()` returns a
metadata mapping (which may be empty). `None` means failure. Custom transports
must preserve that distinction.

## Packets, builders, and filters

The public protocol exports are declared in
[`protocol/__init__.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/__init__.py).

| API | Purpose | Exact source |
| --- | --- | --- |
| `Packet` | MeshCore packet representation, path/header access, serialization, and hashes | [`packet.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet.py) |
| `PacketBuilder` | Constructors for adverts, direct/flood payloads, requests, responses, paths, traces, and acknowledgements | [`packet_builder.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet_builder.py) |
| `PacketFilter` | Admission and duplicate filtering | [`packet_filter.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet_filter.py) |
| `PacketHashCache` | Bounded hash cache used by filtering | [`packet_filter.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet_filter.py#L104) |

Utility classes exported from `openhop_core.protocol` include
`PacketValidationUtils`, `PacketDataUtils`, `PacketHeaderUtils`,
`PacketHashingUtils`, `RouteTypeUtils`, `PathUtils`, and `PacketTimingUtils`.
Routing-region support includes `RegionMap`, `RegionEntry`,
`capture_recv_region()`, and `apply_reply_scope()`. Transport-key helpers include
`get_auto_key_for()`, `calc_transport_code()`, and `scope_packet()`.

Protocol constants are exported deliberately from
[`protocol/constants.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/constants.py).
Treat packet-size, route, payload, hash, and identity constants as wire-contract
values rather than application configuration.

See [Protocol API](/projects/openhop-core/protocol-api/) for the migrated packet,
builder, filter, identity, crypto, routing, scope, and validation reference.

## Identity and crypto

| API | Import | Exact source |
| --- | --- | --- |
| `Identity` | `from openhop_core.protocol import Identity` | [`identity.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/identity.py) |
| `LocalIdentity` | `from openhop_core import LocalIdentity` | [`identity.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/identity.py#L79) |
| `ModemIdentity` | `from openhop_core.protocol import ModemIdentity` | [`modem_identity.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/modem_identity.py) |
| `CryptoUtils` | `from openhop_core import CryptoUtils` | [`crypto.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/crypto.py) |

`LocalIdentity` holds private identity material in the host process.
`ModemIdentity` delegates supported operations to a MeshCore KISS modem. Persist
and protect private keys deliberately; do not log or embed them in examples.

## Transports

The hardware package always exports the abstract `LoRaRadio`. Concrete classes
are conditionally exported when their optional imports succeed; an unavailable
optional dependency can therefore make a class absent from `hardware.__all__`
and set its package attribute to `None`.

| Backend | Public class | Exact source |
| --- | --- | --- |
| Direct SX1262 over SPI/GPIO | `SX1262Radio` | [`sx1262_wrapper.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/sx1262_wrapper.py) |
| Generic serial KISS TNC | `KissSerialWrapper` | [`kiss_serial_wrapper.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/kiss_serial_wrapper.py) |
| MeshCore KISS modem | `KissModemWrapper` | [`kiss_modem_wrapper.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/kiss_modem_wrapper.py) |
| openHop Modem USB-CDC | `USBLoRaRadio` | [`usb_radio.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/usb_radio.py) |
| openHop Modem TCP | `TCPLoRaRadio` | [`tcp_radio.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/tcp_radio.py) |
| WebSocket radio | `WsRadio` | [`wsradio.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/wsradio.py) |

SPI transport abstractions expose `SPITransport`, `SPITransportError`,
`SPIDevTransport`, and `CH341SPITransport` from
[`hardware/transports`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/hardware/transports).
Read [Architecture and Transports](/projects/openhop-core/architecture-and-transports/),
[KISS Modem Protocol](/projects/openhop-core/kiss-modem-protocol/), and
[Direct SX1262 Hardware](/projects/openhop-core/direct-sx1262-hardware/) before
selecting a backend.

## Companion APIs

The companion package's public surface is declared in
[`companion/__init__.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/companion/__init__.py).

### Entry points

- `CompanionRadio`: owns a radio-backed `MeshNode`.
- `CompanionBridge`: shares an existing host dispatcher through packet injection.
- `CompanionFrameServer`: serves the MeshCore companion binary frame protocol over TCP.

### Stores and models

Public stores are `ContactStore`, `ChannelStore`, `MessageQueue`, `PathCache`, and
`StatsCollector`. Public data models include `Contact`, `Channel`, `NodePrefs`,
`SentResult`, `PacketStats`, `AdvertPath`, `QueuedMessage`, `MessageEvent`,
`ChannelMessageEvent`, and `ChannelDataEvent`.

The package also exports advert/text/telemetry/location/auto-add constants,
message-send result constants, `BinaryReqType`, statistics selectors, and default
store sizes. See [Companion Applications](/projects/openhop-core/companion-applications/)
and the exact
[`companion` source tree](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/companion).

For the migrated frame transport and application patterns, read
[Companion Frame Server](/projects/openhop-core/companion-frame-server/) and
[Companion Recipes](/projects/openhop-core/companion-recipes/).

## Examples and version checks

Use [Examples](/projects/openhop-core/examples/) for reviewed entry points and RF
side-effect labels. For exact signatures in an installed environment, inspect
the installed version and its source rather than assuming this dev index matches
another branch or published package build.
