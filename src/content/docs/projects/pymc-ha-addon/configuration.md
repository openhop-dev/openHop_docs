---
title: Configuration
description: Where the add-on stores config.yaml and how it maps to the upstream openHop Repeater schema.
---

# Configuration

The add-on uses a real repeater config file at:

```text
/config/config.yaml
```

Inside the container, `/config` is the add-on's private config mount. On the host, that data lives under the add-on's `addon_config` directory rather than Home Assistant's main `/config` folder.

Current location notes shipped by the add-ons:

- dev channel: `addon_config/*_pymc_repeater_dev/config.yaml`
- main channel: `addon_config/*_pymc_repeater_main/config.yaml`

## First-start behavior

On first start, the add-on creates:

- `/config/config.yaml`
- `/config/identity.key` when openHop Repeater generates a node identity
- `/var/lib/pymc_repeater` for runtime state

After that, `config.yaml` is the single source of truth. If the repeater updates the file itself, those changes persist across restarts.

## Minimum fields to review

At minimum, review:

- `repeater.node_name`
- `repeater.security.admin_password`
- `repeater.security.guest_password`
- `radio_type`
- `radio.frequency`

If you are using direct SX1262 hardware, also review the `sx1262` block. If you are using modem-style transports, review `kiss`, `pymc_usb`, or `pymc_tcp` instead.

## Supported upstream backends

The add-on follows the upstream repeater schema, including:

- `sx1262`
- `sx1262_ch341`
- `kiss`
- `pymc_usb`
- `pymc_tcp`
- `null`

For the full schema, use the main [openHop Repeater Configuration Reference](/projects/pymc-repeater/config-file/).

## Example: openHop TCP inside the add-on

```yaml
radio_type: pymc_tcp

pymc_tcp:
  host: "pymc-3e2834.local"
  port: 5055
  token: ""
  connect_timeout: 5.0
  lbt_enabled: true
  lbt_max_attempts: 5
```

The add-on does not invent a second config model. It passes the normal repeater schema through.

## Related pages

- [Host Access and Storage](/projects/pymc-ha-addon/host-access/)
- [openHop Repeater Configuration Reference](/projects/pymc-repeater/config-file/)
- [openHop USB/TCP Setup](/projects/pymc-repeater/pymc-usb-and-tcp-setup/)
