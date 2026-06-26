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

- system uptime display unit
- data size display unit

## Naming

The integration tries to use the repeater node name from openHop Repeater instead of showing only the host and port.

## Related

- [Entities and Controls](/projects/pymc-ha-integration/entities-and-controls/)
- [Actions and Advanced Services](/projects/pymc-ha-integration/actions-and-advanced-services/)
