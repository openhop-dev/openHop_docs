---
title: Companion Frame Server
description: Expose a CompanionBridge through the MeshCore TCP frame protocol with explicit lifecycle, persistence, and network boundaries.
sidebar:
  order: 10
---

`CompanionFrameServer` exposes a companion implementation to standard MeshCore
companion clients over TCP. It wraps an existing `CompanionBridge`; it does not create
or own a second radio.

This guide tracks openHop Core `dev` commit
[`54f6adb3e0cd3d47a8c61827b2e0be05814a22d4`](https://github.com/openhop-dev/openhop_core/tree/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/frame_server).

## When to use it

Use a frame server when a host application already owns the dispatcher/radio and a
companion client needs the MeshCore binary frame interface. openHop Repeater uses this
pattern to provide virtual companion identities.

Do not use it as an unauthenticated public Internet API. The base frame transport does
not add TLS, user authentication, authorization, rate limiting, or durable storage.
Place it behind the network controls appropriate to the deployment.

## Ownership model

| Component | Owns |
| --- | --- |
| Host application | Radio, dispatcher, service lifecycle, durable configuration |
| `CompanionBridge` | Companion state and packet injection into the host dispatcher |
| `CompanionFrameServer` | TCP listener, one active client, frame parsing/writing, command dispatch, push notifications |
| Subclass/application | Persistence hooks, battery/storage reporting, local telemetry, access controls |

## Construction and lifecycle

```python
from openhop_core.companion import CompanionFrameServer

server = CompanionFrameServer(
    bridge=bridge,
    companion_hash="f5",
    device_model="openHop-Companion",
    bind_address="127.0.0.1",
    port=5000,
)

await server.start()
try:
    # Host application work.
    ...
finally:
    await server.stop()
```

The default bind address in the current constructor is `0.0.0.0`. Bind to loopback or
a specific private interface unless broader exposure is intentional and protected.
The default port is 5000, but each server on one host needs a unique listening port.

The server accepts one active client. A new connection evicts the previous client.
The default idle read timeout is eight hours; set it explicitly to fit the host's
connection policy or to `None` only when indefinite idle connections are intended.

## Frame transport

Inbound and outbound frames use separate one-byte prefixes, a little-endian two-byte
payload length, and the payload:

```text
prefix | payload_length_u16_le | payload
```

The server rejects frames larger than the current maximum. Invalid prefixes are
logged and skipped. The writer uses one bounded queue and one writer task so command
responses, pushes, and heartbeat frames cannot write concurrently to the socket.

When the outbound queue is full or a payload is too large, the frame is dropped and a
warning is logged. This is deliberate backpressure shedding, not durable delivery.
Applications that require guaranteed delivery must implement persistence and client
reconciliation above the transport.

A current-time heartbeat is emitted when no queued frame is available within the
configured heartbeat interval. Socket keepalive and `TCP_NODELAY` are enabled where
the host platform supports them.

## Command families

The current command registry covers:

- application start and device query;
- contacts: list, lookup, add/update, remove, reset path, import/export/share;
- channels: get and set;
- direct text, channel text/data, raw data, and raw packet sends;
- offline message synchronization;
- repeater login, logout, status, telemetry, and connection status;
- binary, anonymous, path-discovery, control, and trace requests;
- self advert, name, location, time, radio parameters, TX power, and tuning;
- flood/default scope and path-hash mode;
- private-key export, a disabled private-key import response, and incremental signing;
- statistics, battery/storage, custom variables, auto-add, and allowed repeat
  frequencies.

Exact command constants and payload encodings are defined in the pinned
[`companion constants`](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/constants.py)
and command modules. Treat those bytes as a protocol contract; do not derive wire
formats from this prose alone.

Unsupported commands return the protocol's unsupported-command error. Malformed
arguments and handler exceptions return an illegal-argument error rather than
terminating the server.

## Local CLI and reboot

The server advertises MeshCore companion protocol version 14.
`CMD_RUN_CLI_COMMAND` (66) invokes the companion's local CLI and returns
`RESP_CODE_CLI_REPLY` (29) with reply text, including `Unknown command` for an
unrecognized command. This is a companion command interpreter, not a shell or an
OS command-execution API. Local frame commands do not use the remote contact-flag
gate, so protect access to the listener.

`run_cli_command(command, sender_timestamp=0)` is also available directly on the
companion. The built-in `reboot` command and `CMD_REBOOT` call `request_reboot()`:
they reload settings, clear transient scope/unscoped state, and notify reboot
subscribers. The frame server drops its client so it reconnects and resynchronizes;
there is no success reply. This does not reboot the host operating system, replace
the identity, or clear messages, contacts, or channels. An owned-radio companion
also re-applies its preferences; a bridge does not retune the shared host radio.

Source: [device commands](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/frame_server/commands_device.py),
[CLI](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/cli.py), and
[settings/reboot hooks](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/base_config.py).

## Identity export and disabled import

Private-key export returns `RESP_CODE_PRIVATE_KEY` followed by 64 bytes in MeshCore
signing-key format. A 32-byte PyNaCl seed is expanded with SHA-512 and clamping, not
simply returned as a seed. Treat this command and its response as secret-bearing.
Private-key import does not change the identity: a complete 64-byte key payload
returns `RESP_CODE_DISABLED`; a shorter payload returns unsupported-command.

## Per-message channel scope extension

openHop's optional scoped-channel extension uses `CMD_SEND_CHANNEL_TXT_MSG` with
extension text subtypes; it does not allocate a new MeshCore command or increase
the advertised protocol version. Probe first and require the exact `OHREG2` marker
and the expected companion public key. Unsupported devices or a different marker
must not receive extension sends. The override carries a raw 16-byte transport
key for one channel message without changing device scope state.

Use the pinned [complete OHREG2 probe, request, response, limits, and error layouts](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/docs/openhop-frame-extensions.md)
when implementing a client. See [Python per-message scope](/projects/openhop-core/companion-recipes/#per-message-channel-scope)
for the corresponding companion API.

## Push notifications

The server subscribes to bridge callbacks and pushes relevant events to the connected
client, including:

- direct and channel messages/data;
- send confirmations;
- adverts, discovered nodes, contact/path changes, and contact-capacity events;
- binary and path-discovery responses;
- trace, raw RX, and control data.

Host code can also push trace or raw receive data through the synchronous scheduling
helpers or their asynchronous counterparts. Avoid pushing the same packet through
both host and bridge paths; doubled input becomes doubled client output.

Frame-server reconnect and shutdown remove only the frame server's own bridge
subscriptions. Other application or plugin subscribers remain registered. If
your host also uses companion push callbacks, remove its callbacks individually
rather than calling the companion-wide `clear_push_callbacks()` during a client
disconnect.

## Persistence hooks

The base implementation uses in-memory companion stores. These methods are hooks, not
durable storage by default:

- persist/pop companion messages;
- persist one contact or save the full contact list;
- save channels;
- save/load preferences in the companion layer;
- report battery/storage and local telemetry.

A subclass should perform small, bounded operations and avoid blocking the event loop.
Transient anonymous contacts are deliberately excluded from contact persistence.
Protect private keys, channel secrets, login material, and message contents according
to the host application's threat model.

## Radio mutation boundary

`CompanionBridge` virtual companions cannot change their host's shared radio
parameters, TX power, or client-repeat policy. After normal argument validation,
frame radio-parameter and TX-power writes return OK as compatibility no-ops so a
client's larger settings transaction can still save name/location changes. They
neither apply nor persist those radio changes. Repeat requests must still pass the
allowed-frequency check; unsupported repeat changes are not saved. Direct bridge
radio/power setters return `False`, and CLI radio/power changes report unsupported:
frame OK is not evidence of a shared-radio retune.

For an owned-radio companion, the frame handler awaits `set_radio_params_async()`
when available and returns bad-state if application fails. On SX1262, prefer the
async API so success confirms completion rather than a queued synchronous retune.
See [Runtime retuning](/projects/openhop-core/direct-sx1262-hardware/#runtime-retuning).

Source: [device command validation and capability handling](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/frame_server/commands_device.py)
and [bridge capabilities](https://github.com/openhop-dev/openhop_core/blob/54f6adb3e0cd3d47a8c61827b2e0be05814a22d4/src/openhop_core/companion/companion_bridge.py).

Validate allowed frequencies, maximum power, board/front-end limits, and regional
rules in the host application. A binary command protocol is not a regulatory policy
engine.

## Network and operational safety

Before exposing a listener:

1. Choose the bind address and firewall scope deliberately.
2. Confirm whether the surrounding service provides authentication or encrypted
   transport.
3. Use a unique companion identity/hash and port.
4. Set an idle timeout and connection-monitoring policy.
5. Bound queues and persistence growth.
6. Avoid logging frame payloads that contain identities, secrets, or messages.
7. Verify that a reconnect evicts only the intended previous client.

## Related guides

- [Companion Applications](/projects/openhop-core/companion-applications/)
- [Companion Recipes](/projects/openhop-core/companion-recipes/)
- [API Reference](/projects/openhop-core/api-reference/#companion-apis)
- [Node and Dispatcher API](/projects/openhop-core/node-and-dispatcher-api/)
