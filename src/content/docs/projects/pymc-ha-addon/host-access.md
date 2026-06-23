---
title: Host Access and Storage
description: Hardware access, networking, and storage behavior for the pyMC HA Add-on.
---

# Host Access and Storage

The add-on is intentionally permissive because the repeater may need SPI, GPIO, USB, serial, and host-network access depending on the chosen backend.

## Runtime flags

The current add-on manifests use:

- `host_network: true`
- `full_access: true`
- `apparmor: false`

This is deliberate so the repeater can reach local radios, CH341 adapters, serial modems, and companion TCP ports.

## GPIO and SPI on Raspberry Pi hosts

If you are using local Pi-attached radio hardware, enable the required host interfaces in Home Assistant OS before starting the add-on.

On the `hassos-boot` partition:

- add `dtparam=spi=on` to `config.txt`
- add `dtparam=i2c_arm=on` and `dtparam=i2c_vc=on` only if you also need I2C sensors
- create `CONFIG/modules/rpi-i2c.conf` containing `i2c-dev` only if you need I2C

When using local GPIO or SPI:

- disable add-on `Protection mode`
- keep the add-on on hardware-capable hosts such as Raspberry Pi
- use BCM numbering in `config.yaml`

## Storage paths

The add-on maps:

- `addon_config` -> `/config`
- `data` -> `/var/lib/pymc_repeater`

That means:

- main config file: `/config/config.yaml`
- node identity file: `/config/identity.key`
- runtime state: `/var/lib/pymc_repeater`

## Network behavior

The repeater web UI binds to port `8000` on the Home Assistant host.

Host networking also matters for:

- companion TCP listeners
- any room-server ports
- `pymc_tcp` modem reachability
- broker and control-plane connectivity

## Related pages

- [Installation](/projects/pymc-ha-addon/installation/)
- [Configuration](/projects/pymc-ha-addon/configuration/)
- [pyMC Repeater Hardware Setup](/projects/pymc-repeater/hardware-setup/)
