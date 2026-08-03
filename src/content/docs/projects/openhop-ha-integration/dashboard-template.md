---
title: Dashboard Template
description: Use the included Lovelace YAML dashboard template for the integration.
sidebar:
  order: 5
---

The repository includes a native Lovelace YAML dashboard template:

```text
dashboards/openhop_repeater_dashboard.yaml
```

## How to use it

1. Open the YAML file from the repository.
2. Replace `REPEATER_SLUG` with your repeater entity prefix.
3. Create a dashboard or open one in raw YAML mode.
4. Paste the template.
5. Update any example dynamic entities so they match your own installation.
6. If the external sensor is not named `modem`, replace `_sensor_modem_` with
   that sensor's actual slug.

## Notes

- the template uses built-in Home Assistant cards only
- it is one Lovelace **view**, not a complete top-level `views:` dashboard
- broker and companion rows may need minor edits because those entities are generated from live repeater data
- the template now uses neutral placeholder names instead of install-specific examples
- current sections cover radio health, packet flow, LBT diagnostics, routing,
  neighbor links, GPS, external modem readings, controls, advert tuning, MQTT,
  companions, updates, and database metrics

## Related

- [Entities and Controls](/projects/openhop-ha-integration/entities-and-controls/)
