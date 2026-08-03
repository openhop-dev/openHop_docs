---
title: Setup in Home Assistant
description: Configure the integration from the Home Assistant UI and understand its setup flow.
sidebar:
  order: 3
---

After installation:

1. Open `Settings` -> `Devices & Services`.
2. Click `Add Integration`.
3. Search for `openHop Repeater`.
4. Enter:
   - repeater host or IP
   - repeater API port
   - repeater admin password
5. Submit the form.

## What happens during setup

The integration will:

1. connect to the repeater API
2. sign in as `admin`
3. create a dedicated API token for Home Assistant
4. store the token in the config entry
5. stop using the admin password for normal polling

## Options

The integration options let you change:

- polling interval from 5 to 300 seconds; the default is 15 seconds
- system uptime display unit
- data size display unit

Changing an option reloads the integration automatically. One integration-wide
poll drives the normal entities; GPS updates use a separate server-sent-event
stream when the Repeater exposes it.

With multiple Repeaters, each host and port is a separate config entry. Advanced
actions should include `config_entry_id` so Home Assistant targets the intended
Repeater.

## Naming

The integration tries to use the repeater node name from openHop Repeater instead of showing only the host and port.

## Related

- [Entities and Controls](/projects/openhop-ha-integration/entities-and-controls/)
- [Actions and Advanced Services](/projects/openhop-ha-integration/actions-and-advanced-services/)
