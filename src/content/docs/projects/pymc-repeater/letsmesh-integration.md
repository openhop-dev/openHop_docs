---
title: LetsMesh Integration
description: Current LetsMesh publishing notes for openHop Repeater.
---

# LetsMesh Integration

Current repeater builds model LetsMesh-style publishing through `mqtt_brokers:` rather than the older standalone `letsmesh:` block.

Start with [Configuration Reference](/projects/pymc-repeater/config-file/#mqtt-brokers).

What to configure:

- `mqtt_brokers.iata_code`
- `mqtt_brokers.status_interval`
- one or more entries in `mqtt_brokers.brokers`
- per-broker transport, auth, TLS, and packet filtering

The current config example also shows JWT-oriented broker fields such as `audience` and `use_jwt_auth`.
