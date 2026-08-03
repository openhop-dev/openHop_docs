---
title: openHop Core Overview
description: Python protocol, node, companion, and radio building blocks for MeshCore applications.
sidebar:
  order: 1
---

openHop Core is a Python implementation of the MeshCore protocol. It provides the
wire-format, cryptography, identity, routing, asynchronous node, companion, and
radio layers used by openHop Repeater and other Python mesh applications.

The library preserves compatibility with MeshCore firmware while supporting more
than direct SPI radios: applications can use SX1262 hardware, KISS serial modems,
and openHop Modems over USB or TCP. A WebSocket implementation also exists but
should be treated as experimental against the current dispatcher contract.

## What this section covers

- Installation and safe lifecycle patterns
- Protocol, node, companion, and radio architecture
- Supported transport backends and optional dependencies
- Development, tests, and upstream API references

## Useful links

- Project repository: [openHop Core](https://github.com/openhop-dev/openhop_core)
- PyPI package: [openhop-core](https://pypi.org/project/openhop-core/)
- Source API and examples: [openHop Core repository](https://github.com/openhop-dev/openhop_core/tree/dev/docs)

## Next step

Start with [Quick Start](/projects/openhop-core/quick-start/), then read
[Architecture and Transports](/projects/openhop-core/architecture-and-transports/)
or [Companion Applications](/projects/openhop-core/companion-applications/).
