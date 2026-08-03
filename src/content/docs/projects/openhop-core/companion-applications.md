---
title: Companion Applications
description: Choose CompanionRadio, CompanionBridge, or CompanionFrameServer for higher-level MeshCore applications.
sidebar:
  order: 4
---

The companion layer is the high-level API for applications that need contacts,
channels, messages, advertisements, path discovery, telemetry, queues, callbacks,
or the MeshCore companion frame protocol.

## Choose a companion class

| Class | Owns a radio | Use it for |
| --- | --- | --- |
| `CompanionRadio` | Yes | Standalone chat clients, gateways, sensors, and automation nodes |
| `CompanionBridge` | No | Sharing an existing repeater or application dispatcher |
| `CompanionFrameServer` | No | Exposing a companion instance to standard clients over the MeshCore TCP frame protocol |

`CompanionRadio` and `CompanionBridge` inherit common behavior from
`CompanionBase`. The frame server wraps a companion implementation rather than
creating another radio owner.

## Capabilities

The shared companion API includes:

- contact and channel stores;
- direct and channel messages;
- flood and direct advertisements;
- offline message queues;
- path discovery and trace requests;
- repeater login, status, commands, and telemetry requests;
- device preferences, flood regions, transport scope, and packet statistics;
- callbacks for messages, adverts, channels, acknowledgements, and responses.

## Minimal lifecycle

Create and initialize a supported radio first, then pass it to `CompanionRadio`.
Register callbacks before starting the companion.

```python
from openhop_core import LocalIdentity
from openhop_core.companion import ADV_TYPE_CHAT, CompanionRadio

identity = LocalIdentity()
companion = CompanionRadio(
    radio=radio,
    identity=identity,
    node_name="my-node",
    adv_type=ADV_TYPE_CHAT,
)

companion.on_message_event(handle_message)
await companion.start()

try:
    await companion.advertise(flood=True)
    # Application work goes here.
finally:
    await companion.stop()
```

The `radio` and `handle_message` names are application-provided. The snippet does
not select hardware or transmit settings for you.

## Persistence is application-owned

The in-memory contact, channel, queue, and preference stores are useful defaults.
Persistence hooks are no-ops until an application or subclass implements storage.
Load identities and saved state deliberately, protect private key material, and do
not log it.

`CompanionFrameServer` also exposes persistence hooks for messages, contacts,
channels, device statistics, and preference data. openHop Repeater provides a
concrete integration of these building blocks.

## Frame-server behavior

A frame server exposes the same binary companion protocol used by MeshCore
companion clients. Bind only to interfaces you intend to expose, choose a unique
port, and add network controls appropriate to the deployment. A bridge does not
provide authentication or durable storage automatically.

## Full API

The companion API evolves quickly. Use the
[companion source guide](https://github.com/openhop-dev/openhop_core/blob/dev/docs/docs/companion.md)
and current source as the detailed reference.
