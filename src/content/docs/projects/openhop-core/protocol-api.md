---
title: Protocol API
description: Current packet, builder, filter, identity, cryptography, routing, scope, and utility contracts in openHop Core.
sidebar:
  order: 13
---

This page migrates the legacy `docs/docs/api/core.md` and
`docs/docs/api/protocol.md` topics. It tracks openHop Core `dev` commit
[`0d1dbf2`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol).
Use current source/tests for exact signatures and wire-format changes.

## Packet

`Packet` represents a MeshCore packet, including header/routing fields, path bytes,
payload, serialization, and packet hashes. The parser and serializer enforce protocol
bounds that must remain firmware-compatible.

Packet bytes are a wire contract. Do not insert fields, change path interpretation,
or alter hash inputs without independent firmware vectors.

Exact source:
[`packet.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet.py)

## PacketBuilder

`PacketBuilder` centralizes construction for current packet families, including:

- advertisements;
- direct and flood data;
- text/channel payloads through higher layers;
- acknowledgements;
- path and trace traffic;
- login, anonymous, control, protocol request, and response packets.

Use a builder rather than manually concatenating headers, paths, encrypted payloads,
or hashes. A builder creates protocol structure; it does not decide whether the
frequency, route, recipient, or application action is safe.

Exact source:
[`packet_builder.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet_builder.py)

## PacketFilter and PacketHashCache

`PacketFilter` applies admission and duplicate filtering. `PacketHashCache` provides a
bounded cache for recently observed hashes.

The dispatcher uses filter results before application handlers. Clearing filter state
can allow recently seen traffic to be processed again; expose that as an intentional
operator action rather than routine maintenance.

Exact source:
[`packet_filter.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/packet_filter.py)

## Packet utilities

The protocol package exports focused helpers for:

| Utility | Responsibility |
| --- | --- |
| `PacketValidationUtils` | Bounds and structure validation |
| `PacketDataUtils` | Payload/data access helpers |
| `PacketHeaderUtils` | Header fields and route interpretation |
| `PacketHashingUtils` | Protocol hash calculations |
| `RouteTypeUtils` | Route-type classification |
| `PathUtils` | Path encoding and traversal helpers |
| `PacketTimingUtils` | Airtime/timeout-related protocol timing |

Treat utility results as protocol-level data. Applications should not use low-level
helpers to bypass dispatcher validation, encryption, ACK, or scope behavior.

## Identity

| Class | Role |
| --- | --- |
| `Identity` | Public identity and shared protocol operations |
| `LocalIdentity` | Host-owned private identity capable of local cryptographic operations |
| `ModemIdentity` | Delegates supported private operations to a compatible MeshCore KISS modem |

A `LocalIdentity` contains private key material. Persist it with restrictive
permissions and never print it in diagnostics. A `ModemIdentity` changes the trust and
availability boundary: cryptographic operations depend on the modem link and firmware
capabilities.

Exact sources:

- [`identity.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/identity.py)
- [`modem_identity.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/modem_identity.py)

## CryptoUtils

`CryptoUtils` exposes protocol cryptographic helpers used by identities, packets, and
handlers. Cryptographic compatibility depends on exact key formats, nonce/metadata
construction, authenticated encryption behavior, signatures, and shared-secret
derivation.

Do not replace algorithms or change encoded inputs based on API shape alone. Add
independent firmware vectors and negative/tamper tests for protocol crypto changes.

Exact source:
[`crypto.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/crypto.py)

## Routing regions and transport scope

The package exports region/scope support including:

- `RegionMap` and `RegionEntry`;
- receive-region capture and reply-scope application;
- automatic transport-key derivation;
- transport-code calculation;
- packet scoping.

Transport keys and region names affect packet propagation and interoperability. Do not
log keys or present one region's value as a universal default. Preserve unscoped/null
behavior when an application intentionally needs it.

## Constants

`protocol/constants.py` defines packet sizes, route/payload types, hash/path limits,
and other wire values. Constants are not user preferences. Changing one can alter
serialization or firmware compatibility even when Python tests still pass.

Exact source:
[`constants.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/constants.py)

## Validation workflow for protocol changes

1. Identify the corresponding firmware structure/algorithm.
2. Add literal independent byte vectors rather than generating expected bytes through
   the same helper under test.
3. Cover parse and serialize directions.
4. Test malformed lengths, routes, paths, hashes, authentication, and bounds.
5. Run focused protocol tests, then the complete Core suite.
6. Exercise hardware/interoperability only with explicit authorization and safe RF
   settings.

## Exact public exports

The canonical protocol export list is
[`protocol/__init__.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/protocol/__init__.py).
Optional/internal helpers not exported there should not be presented as stable public
API merely because they can be imported by path.

## Related guides

- [API Reference](/projects/openhop-core/api-reference/)
- [Node and Dispatcher API](/projects/openhop-core/node-and-dispatcher-api/)
- [Architecture and Transports](/projects/openhop-core/architecture-and-transports/)
- [KISS Modem Protocol Compatibility](/projects/openhop-core/kiss-modem-protocol/)
