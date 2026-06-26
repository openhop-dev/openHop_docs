---
title: Entities and Controls
description: Overview of the monitoring and control entities exposed by the integration.
sidebar:
  order: 4
---

The integration exposes both monitoring entities and control entities.

## Monitoring

Examples of included telemetry:

- repeater version and update status
- uptime, memory use, database size, metrics history size
- packet totals, RX and forwarded rates, airtime, RSSI, SNR, CRC errors
- MQTT handler status and one binary sensor per broker
- ACL totals and companion state
- room statistics
- GPS diagnostics when available from the repeater API

## Control entities

Examples of included controls:

- buttons:
  - send advert
  - restart repeater service
  - vacuum metrics database
  - check for updates
  - install latest update
- select:
  - repeater mode
  - update channel
- switches:
  - duty cycle enforcement
  - advert rate limit
  - advert penalty box
  - advert adaptive control
  - allow unscoped flood
- numbers:
  - max airtime percent
  - advert tuning and rate-limit values

## Dynamic entities

Some entities are created from live repeater data at setup time, including:

- MQTT brokers
- companions
- room servers
- route types
- database table counters

If those change later in openHop Repeater, reload the integration in Home Assistant.

## Related

- [Dashboard Template](/projects/openhop-ha-integration/dashboard-template/)
- [Actions and Advanced Services](/projects/openhop-ha-integration/actions-and-advanced-services/)
