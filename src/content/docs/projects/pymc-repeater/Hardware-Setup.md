---
title: Hardware Setup
description: Supported pyMC Repeater hardware and radio backend notes.
---

# Hardware Setup Guide

pyMC Repeater supports more than just a Raspberry Pi with a GPIO-connected SX1262. The current repo supports three backend classes:

- Native `sx1262` over Linux SPI and host GPIO
- `sx1262_ch341` over a CH341 USB-SPI adapter
- `kiss` using a serial KISS TNC instead of GPIO radio control

## Supported hardware families

The repo currently includes radio presets for:

- HackerGadgets uConsole LoRa module variants
- Frequency Labs `meshadv-mini`
- Frequency Labs `meshadv`
- Heltec `HT-RA62`
- Zindello Industries `UltraPeater`
- Zindello Industries `UltraPeaterZero`
- Waveshare SX1262 SPI HAT
- Generic SX1262 / E22-class boards
- CH341 USB-SPI + SX1262 combinations

For non-GPIO serial radios, use [KISS Setup](/projects/pymc-repeater/kiss-setup/).

## Backend selection

Choose the backend with the top-level `radio_type` in `/etc/pymc_repeater/config.yaml`.

```yaml
radio_type: sx1262
```

Supported values:

- `sx1262`
- `sx1262_ch341`
- `kiss`

## Native SX1262 wiring

For a direct Linux SPI host, `sx1262` pins are host GPIO values.

```yaml
sx1262:
  bus_id: 0
  cs_id: 0
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16
  txen_pin: -1
  rxen_pin: -1
  en_pin: -1
  txled_pin: -1
  rxled_pin: -1
  use_dio3_tcxo: false
  dio3_tcxo_voltage: 1.8
  use_dio2_rf: false
  is_waveshare: false
```

Typical Raspberry Pi SPI pins:

| Function | Raspberry Pi pin |
| --- | --- |
| MOSI | GPIO 10 / pin 19 |
| MISO | GPIO 9 / pin 21 |
| SCK | GPIO 11 / pin 23 |
| CS | Usually GPIO 21 or board-specific |

## CH341 USB-SPI hosts

When `radio_type: sx1262_ch341` is selected:

- `sx1262` pin values are CH341 GPIO numbers `0-7`
- the adapter VID/PID is configured under `ch341:`
- host USB permissions matter more than SPI kernel overlays

```yaml
radio_type: sx1262_ch341

ch341:
  vid: 6790
  pid: 21778

sx1262:
  cs_pin: 0
  rxen_pin: 1
  reset_pin: 2
  busy_pin: 4
  irq_pin: 6
  use_dio3_tcxo: true
  use_dio2_rf: true
```

For a common E22 mapping, the repo README uses:

| Function | CH341 GPIO |
| --- | --- |
| CS | 0 |
| RXEN | 1 |
| Reset | 2 |
| Busy | 4 |
| IRQ | 6 |

## Board-specific notes

### uConsole

- Uses SPI1 in the current preset set
- Requires its own overlay and GPS/RTC host setup

### meshadv / HT-RA62 / E22-class boards

- Often require `use_dio3_tcxo: true`
- Some also require `use_dio2_rf: true`

### Waveshare SPI HAT

- Supported only in SPI form, not UART variants
- No longer the recommended default hardware in the upstream README

## Verifying hardware access

### Native SPI

```bash
ls /dev/spidev*
```

You should see a device such as `/dev/spidev0.0`.

### CH341

```bash
lsusb -d 1a86:5512
```

The host must expose the USB adapter with the correct permissions before the repeater can use it.

### Service logs

```bash
journalctl -u pymc-repeater -f
```

If the hardware setup is wrong, this is the first place to look.

## Radio configuration helper

The standard install flow launches the helper automatically, but you can rerun it later:

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
```

That helper now supports:

- selecting `sx1262` vs `kiss`
- applying current radio presets
- writing KISS serial settings
- writing hardware-specific pin maps

## Related pages

- [Installation](/projects/pymc-repeater/installation/)
- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [KISS Setup](/projects/pymc-repeater/kiss-setup/)
- [Troubleshooting](/projects/pymc-repeater/troubleshooting/)
