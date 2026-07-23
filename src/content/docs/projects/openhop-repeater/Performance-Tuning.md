---
title: Performance Tuning
description: Tune Repeater metrics, storage, packet behavior, and radio settings using measured results.
sidebar:
  order: 16
---

Tune from measurements, not from a copied config. Save a baseline, change one
setting at a time, and observe the dashboard and logs over comparable traffic.

## Start with the safe controls

- Keep logging at `INFO` for normal service; use `DEBUG` briefly.
- Increase `send_advert_interval_hours` if the node advertises more often than the
  deployment needs.
- Use `storage.retention.sqlite_cleanup_days` to bound history.
- Set `metrics.rrd_enabled: false` when RRD is unavailable or unwanted; chart
  APIs can fall back to SQLite data.
- Disable unused sensors, GPS sources, MQTT brokers, Glass, room servers, and
  companion identities.
- Disable `sensors.auto_install_packages` on controlled systems.

## Packet and mesh controls

- `repeater.cache_ttl` controls duplicate retention; setting it too low can allow
  repeats, while excessive values retain more entries.
- `repeater.max_flood_hops` limits how far already-traversed floods may continue.
- `repeater.use_score_for_tx` enables score-based filtering and adaptive timing.
- `repeater.multi_acks` adds redundant ACK airtime and should be enabled only
  when measured reliability justifies it.
- advert rate limits and penalty controls can reduce abusive advert bursts.
- neighbor link metrics are observation-only today; tuning their EWMA and
  retention does not change routes or forwarding.

## Radio tuning

Bandwidth, spreading factor, coding rate, preamble, power, CAD, and LBT trade
range, robustness, latency, and airtime. The values must remain compatible with
the mesh. Do not increase power as the first response to packet loss; inspect
antenna, placement, noise floor, supply quality, and modulation agreement first.

## Storage and charts

Repeater serializes blocking storage work through a dedicated writer. Avoid
editing or vacuuming the live database by hand. Back up state and stop the service
before offline database maintenance. If charts are missing, check the API's
reported `rrd_enabled`, `rrd_available`, and `metrics_data_source` values before
assuming data was lost.

## Measure after each change

Compare:

- received, sent, repeated, duplicate, CRC-error, and dropped packet counts;
- RSSI/SNR and noise-floor trends;
- neighbor observations and staleness;
- airtime and duty-cycle behavior;
- CPU, memory, disk growth, reconnects, and service restarts.

Return to the saved baseline if a change does not improve the target metric. See
[Configuration Reference](/projects/openhop-repeater/config-file/) and
[Troubleshooting](/projects/openhop-repeater/troubleshooting/).
