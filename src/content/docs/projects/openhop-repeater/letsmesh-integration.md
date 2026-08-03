---
title: MQTT and LetsMesh Integration
description: Configure MC2MQTT brokers, neighbour publication, status, and manual scope discovery.
sidebar:
  order: 14
---

Current repeater builds model LetsMesh-style publishing through `mqtt_brokers:` rather than the older standalone `letsmesh:` block.

Start with [Configuration Reference](/projects/openhop-repeater/config-file/#mqtt-brokers).

What to configure:

- `mqtt_brokers.iata_code`
- `mqtt_brokers.status_interval`
- one or more entries in `mqtt_brokers.brokers`
- per-broker transport, auth, TLS, and packet filtering

The current config example also shows JWT-oriented broker fields such as `audience` and `use_jwt_auth`.

## Broker presets and formats

Bundled presets include current endpoint and authentication metadata. Preset
entries can be followed by a broker with the same name to override selected
fields. Supported format families include `meshcoretomqtt`, `letsmesh`, `waev`,
and the legacy local `mqtt` topic convention.

Only opt a broker into topics it accepts. In particular, an MC2MQTT endpoint may
close the connection when an unexpected topic is published.

## Neighbour and scope publication

The Repeater `dev` branch can periodically publish a `neighbors` snapshot. Enable
it on a compatible broker with the per-broker boolean:

```yaml
mqtt_brokers:
  neighbors:
    enabled: true
    interval_hours: 24
  brokers:
    - preset: meshat-se
      neighbors: true
```

The top-level `neighbors` value under `mqtt_brokers` must be a settings block;
the boolean belongs inside each broker entry. The Meshat.se preset already opts
in. Other brokers remain off by default.

A cycle:

1. broadcasts a zero-hop discovery request;
2. waits for discovery results;
3. queries each fresh zero-hop repeater's served region scopes one at a time;
4. publishes the assembled table to every enabled, connected, opted-in broker.

Serial scope queries reduce response collisions, but make the cycle take minutes.
The feature respects maximum age/count/sweep limits and can abort when the duty
cycle backlog is too large. Treat a manual run as real RF activity.

## Trigger and inspect a cycle

The mesh CLI command `discover.scopes` schedules one full cycle. The authenticated
API provides the equivalent `POST /api/publish_neighbors`; it returns after the
cycle is scheduled, so poll `GET /api/mqtt_status` for the result.

Two authenticated network-policy endpoints expose scope data independently of
MQTT:

- `GET /api/neighbor_scopes` returns the last stored answer and freshness/status
  timestamps for each queried neighbour, plus this node's served scopes.
- `POST /api/query_neighbor_scopes` queries one zero-hop neighbour by its full
  64-character public key. It stores the result but does not publish to MQTT.

An empty scope string from a responding neighbour is a real answer meaning it
serves unscoped traffic only. A later timeout does not erase the last good scope
answer; compare `responded_at` with `queried_at` and `status`.

Repeated single-neighbour queries may time out because anonymous scope replies
are rate-limited. Multi-hop targets also time out because the query is intentionally
zero-hop only.

Use the synchronized [API Reference](/projects/openhop-repeater/api-reference/)
for request and response schemas. Verify the selected server before using an
interactive POST operation.
