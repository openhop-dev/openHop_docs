---
title: Actions and Advanced Services
description: Advanced Home Assistant service actions exposed by the integration.
sidebar:
  order: 6
---

The integration exposes advanced service actions under the `pymc_repeater` domain.

## Utility actions

- `ping_neighbor`
- `room_post_message`
- `room_messages_clear`
- `db_purge`
- `update_radio_config`
- `update_mqtt_config`

## Companion actions

- `companion_send_text`
- `companion_send_channel_message`
- `companion_login`
- `companion_request_status`
- `companion_request_telemetry`
- `companion_send_command`
- `companion_reset_path`
- `companion_set_advert_name`
- `companion_set_advert_location`

## Drill-down actions with response data

- `get_logs`
- `get_recent_packets`
- `get_filtered_packets`
- `get_packet_by_hash`
- `get_acl_clients`
- `remove_acl_client`
- `get_room_messages`
- `get_room_clients`
- `delete_room_message`

## Multi-repeater setups

If you have more than one openHop Repeater config entry in Home Assistant, use `config_entry_id` when calling actions so the integration knows which repeater to target.

## Related

- [Setup in Home Assistant](/projects/pymc-ha-integration/setup-in-home-assistant/)
