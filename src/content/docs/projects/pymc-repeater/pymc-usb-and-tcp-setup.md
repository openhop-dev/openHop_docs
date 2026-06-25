---
title: openHop USB/TCP Setup
description: Configure openHop Repeater to use a pymc_usb modem over USB-CDC or over TCP.
---

# openHop USB/TCP Setup

Use these modes when the radio hardware is already managed by a modem running `pymc_usb` firmware rather than by local SX1262 GPIO and SPI control.

For device selection, firmware flashing, HTTP diagnostics, modem sensors, and modem-backed GPS, see the [openHop Modem section](/projects/pymc-modem/).

## When to use each mode

- Use `radio_type: pymc_usb` when the modem is plugged directly into the host over USB-CDC.
- Use `radio_type: pymc_tcp` when the modem lives on another board and exposes a TCP service over LAN, Wi-Fi, or Ethernet.

Both modes keep the repeater in charge of node behavior, the dashboard, API, MQTT, GPS, identities, and storage.

The main config file is `/etc/pymc_repeater/config.yaml`.

## openHop USB over USB-CDC

Minimal config:

```yaml
radio_type: pymc_usb

pymc_usb:
  port: "/dev/ttyACM0"
  baudrate: 921600
  lbt_enabled: true
  lbt_max_attempts: 5
```

What the current setup helper writes by default:

- `port: /dev/ttyACM0`
- `baudrate: 921600`
- `lbt_enabled: true`
- `lbt_max_attempts: 5`

Checks:

```bash
ls -l /dev/ttyACM0
id repeater
```

Make sure the service user can open the USB-CDC device.

## openHop USB over TCP

Minimal config:

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

What the current setup helper writes by default:

- `host: REPLACE_WITH_MODEM_HOST`
- `port: 5055`
- `token: ""`
- `connect_timeout: 5.0`
- `lbt_enabled: true`
- `lbt_max_attempts: 5`

Replace the placeholder host before expecting the service to start cleanly.

Use the modem LAN IP, hostname, or mDNS name, for example `pymc-3e2834.local`.

## Using the setup helper

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
```

During the prompts:

1. Select either `pymc_usb modem (USB-CDC)` or `pymc_tcp modem (Wi-Fi / Ethernet)`.
2. Choose the radio preset that matches the network.
3. For `pymc_usb`, confirm the serial device and baud rate.
4. For `pymc_tcp`, replace the placeholder host with the modem address.

## Radio settings that still matter

Even though the modem firmware owns the radio hardware, these repeater settings still need to match the network:

- `radio.frequency`
- `radio.tx_power`
- `radio.bandwidth`
- `radio.spreading_factor`
- `radio.coding_rate`
- `radio.preamble_length`

The current setup defaults for the pyMC modem paths use:

- `tx_power: 22`
- `preamble_length: 16`

## Restart and verify

```bash
sudo systemctl restart pymc-repeater
sudo journalctl -u pymc-repeater -f
```

Look for:

- successful modem connection
- no placeholder-host errors for `pymc_tcp`
- no permission errors on `/dev/ttyACM0` for `pymc_usb`

## Related pages

- [Installation](/projects/pymc-repeater/installation/)
- [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [openHop Modem Repeater Integration](/projects/pymc-modem/repeater-integration/)
- [KISS Setup](/projects/pymc-repeater/kiss-setup/)
