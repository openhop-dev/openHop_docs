---
title: Node and Dispatcher API
description: Current MeshNode, Dispatcher, event, callback, and handler contracts in openHop Core.
sidebar:
  order: 12
---

This reference migrates the legacy `docs/docs/api/node.md` and
`docs/docs/api/dispatcher.md` topics. It tracks openHop Core `dev` commit
[`0d1dbf2`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node).
Current source and tests remain authoritative for exact signatures.

## MeshNode

```python
MeshNode(
    radio,
    local_identity,
    config=None,
    *,
    contacts=None,
    channel_db=None,
    logger=None,
    event_service=None,
)
```

| Member | Contract |
| --- | --- |
| `start()` | Runs the dispatcher until stopped; call from a task when other work must continue |
| `stop()` | Idempotently disarms RX and stops the dispatcher; does not close the radio |
| `send_packet(packet, wait_for_ack=False, **kwargs)` | Single raw-packet transport entry point |
| `set_event_service(service)` | Replaces and propagates the event service to compatible registered handlers |
| `dispatcher` | The owned `Dispatcher` instance |

Read [Node Usage](/projects/openhop-core/node-usage/) for lifecycle examples and
ownership boundaries.

## Dispatcher lifecycle

`Dispatcher.run_forever()` owns the receive loop and remains active until `stop()`.
The dispatcher arms/disarms receive handling, serializes TX, and tracks lifecycle
state internally.

`stop()` wakes lifecycle waits and disarms RX. It does not own physical transport
cleanup. `cleanup()` clears internal runtime state but is not a substitute for the
concrete radio's close/disconnect/cleanup method.

## Sending and acknowledgements

`send_packet()` handles packet validation/filtering, flood scope/path behavior,
airtime budgeting, serialized transmission, and optional ACK waiting.

Related methods include:

- `expect_ack(crc)` and `wait_for_ack(crc, timeout)`;
- internal ACK registration and waiter cleanup;
- `set_ack_received_listener(callback)`;
- packet-sent and packet-received callbacks.

ACK correlation is keyed by protocol CRC/hash behavior, not by application object
identity. Timeouts and cancellation must remove waiters so later packets cannot wake a
stale request.

A radio returns a metadata mapping on successful send and `None` only on failure.

## Packet routing and filtering

The dispatcher performs:

- duplicate/admission filtering;
- direct, flood, and trace delivery/forwarding decisions;
- optional client-repeat forwarding;
- path-hash mode application;
- default flood-scope application;
- receive-quality delay and transmit airtime budgeting.

Useful public controls include:

| Method | Purpose |
| --- | --- |
| `set_contact_book(store)` | Supplies contacts used by handlers/decryption |
| `set_default_path_hash_mode(mode)` | Sets the default width for eligible new flood paths |
| `set_client_repeat_enabled(enabled)` | Enables/disables client-repeat forwarding behavior |
| `get_filter_stats()` | Returns current filter statistics |
| `clear_packet_filter()` | Clears packet-filter state |

Do not change forwarding, path, scope, or timing policy without protocol compatibility
tests and independent firmware vectors.

## Handler registration

`register_default_handlers()` wires Core packet types to their handler objects.
Applications can use:

- `register_handler(payload_type, handler)`;
- `get_handler_instance(payload_type)`;
- `register_fallback_handler(handler)`.

A handler is asynchronous and receives a parsed `Packet`. Several current handlers
return `HandlerResult` to distinguish consumed traffic from packets not intended for
the local node.

Current handler families include:

- `AckHandler` and `MultipartAckHandler`;
- `AdvertHandler`;
- `TextMessageHandler` and `GroupTextHandler`;
- `PathHandler` and `TraceHandler`;
- `LoginResponseHandler` and `LoginServerHandler`;
- `ProtocolRequestHandler` and `ProtocolResponseHandler`;
- anonymous request/response and control/discovery handlers;
- return-path teaching support.

Handlers share callbacks, stores, identity material, and dispatcher injection points.
Replacing one handler can break ACKs, decryption, response correlation, learned paths,
or forwarding.

## Packet callbacks and subscribers

The dispatcher exposes:

- packet-received callback;
- packet-sent callback;
- ACK listener;
- enhanced raw packet callback;
- multiple raw-packet and raw-RX subscribers.

Use subscribers for observation or bridge integration. Avoid slow synchronous work and
do not register two paths that feed the same packet into one application.

## Events API

`EventService` provides:

| Method | Purpose |
| --- | --- |
| `subscribe(event_type, subscriber)` | Subscribe an `EventSubscriber` to one event |
| `subscribe_all(subscriber)` | Subscribe to every event |
| `unsubscribe(...)` / `unsubscribe_all(...)` | Remove subscriptions |
| `publish(event_type, data)` | Await delivery to matching and global subscribers |
| `publish_sync(event_type, data)` | Schedule asynchronous publication on the running loop |

`EventSubscriber.handle_event(event_type, data)` is asynchronous. One subscriber's
exception is logged and does not stop delivery to the others.

Current `MeshEvents` values cover contacts, direct/channel messages, node discovery,
signal updates, node start/stop, and telemetry updates. These event dictionaries are
application-facing data, not serialized MeshCore packet formats.

## Error and concurrency behavior

- TX is serialized through the dispatcher lock.
- Receive callbacks hand packet work into the asyncio loop.
- Callback implementations can be synchronous or awaitable where documented by the
  specific registration method.
- Blocking hardware/database/network calls must not run on dispatcher paths.
- Cancellation, timeout, and shutdown are normal outcomes and need explicit cleanup.
- Handler exceptions are logged; applications should expose useful operational state
  without logging private keys or decrypted secrets.

## Exact source

- [`node/node.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/node.py)
- [`node/dispatcher.py`](https://github.com/openhop-dev/openhop_core/blob/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/dispatcher.py)
- [`node/events`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/events)
- [`node/handlers`](https://github.com/openhop-dev/openhop_core/tree/0d1dbf2c10c23be07d4a3c529eee05414994b499/src/openhop_core/node/handlers)

## Related guides

- [API Reference](/projects/openhop-core/api-reference/)
- [Protocol API](/projects/openhop-core/protocol-api/)
- [Node Usage](/projects/openhop-core/node-usage/)
- [Companion Applications](/projects/openhop-core/companion-applications/)
