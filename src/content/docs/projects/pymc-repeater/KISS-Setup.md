---
title: KISS Setup
description: Configure openHop Repeater to use a serial KISS modem instead of GPIO radio hardware.
---

# KISS Setup

Use this mode when the repeater should talk to a serial KISS TNC rather than directly controlling SX1262 GPIO and SPI hardware.

## When to use it

Choose KISS mode if:

- the radio is already handled by external modem firmware
- the host only needs a serial connection to the modem
- you do not want GPIO pin mapping on the repeater host

If you are flashing a compatible MeshCore device for this role, the official [MeshCore.io Flasher](https://flasher.meshcore.io/) now has a KISS firmware option you can select before setting up the repeater host.

Set the backend with:

```yaml
radio_type: kiss
```

## Minimal config

```yaml
radio_type: kiss

kiss:
  port: "/dev/ttyUSB0"
  baud_rate: 9600

radio:
  frequency: 915000000
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8
```

The main config file is `/etc/pymc_repeater/config.yaml`.

## Using the setup helper

The repo helper supports KISS mode directly:

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
```

During the prompts:

1. Select `KISS modem`
2. Choose the radio preset that matches the network
3. Enter the modem serial device, usually `/dev/ttyUSB0`
4. Enter the modem baud rate, usually `9600` unless your modem expects something else

## Serial device access

The repeater service user must be able to open the modem device.

Common checks:

```bash
ls -l /dev/ttyUSB0
id repeater
```

If needed, make sure the service user is in the correct serial-access group such as `dialout`.

## What KISS changes

When using KISS:

- `sx1262` GPIO pin mappings are not the active radio path
- the modem handles the radio hardware layer
- you still configure repeater behavior, mesh behavior, storage, MQTT, GPS, and web settings in the same config file

## Restart and verify

```bash
sudo systemctl restart pymc-repeater
sudo journalctl -u pymc-repeater -f
```

If startup fails, check for:

- wrong serial device path
- wrong baud rate
- permissions on `/dev/ttyUSB0`
- a modem firmware that does not expose KISS correctly

## Related pages

- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [Installation](/projects/pymc-repeater/installation/)
- [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
- [Troubleshooting](/projects/pymc-repeater/troubleshooting/)
