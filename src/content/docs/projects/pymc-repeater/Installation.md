---
title: Installation
description: Current install paths for pyMC Repeater.
---

# Installation Guide

The current `pyMC_Repeater` repo supports several install shapes:

- Standard Linux host with native SPI and GPIO
- CH341 USB-SPI hosts
- Proxmox LXC deployments using CH341 passthrough
- KISS modem deployments using a serial TNC
- `pymc_usb` modem deployments over USB-CDC
- `pymc_tcp` modem deployments over Wi-Fi or Ethernet
- no-radio `null` mode for dashboard, API, or companion-only services

The main configuration file is `/etc/pymc_repeater/config.yaml`.

## Standard install

The current upstream README uses the management script directly:

```bash
git clone https://github.com/pyMC-dev/pyMC_Repeater.git
cd pyMC_Repeater
sudo ./manage.sh
```

That flow installs the service, creates the config directory, and launches the radio configuration helper.

## What the installer sets up

- service user and permissions
- `/opt/pymc_repeater`
- `/etc/pymc_repeater`
- `/var/log/pymc_repeater`
- interactive radio and hardware configuration
- `pymc-repeater.service`

## Re-running radio setup

To revisit hardware or modem selection later:

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
sudo systemctl restart pymc-repeater
```

The helper now supports:

- direct `sx1262` hardware
- `sx1262_ch341` USB-SPI hosts
- `kiss` modem mode
- `pymc_usb` USB-CDC modem mode
- `pymc_tcp` network modem mode
- `null` mode for no RF hardware
- hardware presets from `radio-settings.json`

## KISS modem installs

For serial TNC deployments:

1. Install the repeater normally.
2. Set `radio_type: kiss`.
3. Configure the `kiss.port` and `kiss.baud_rate` values.
4. Make sure the service user can open the serial device.

Start with [KISS Setup](/projects/pymc-repeater/kiss-setup/).

## pyMC USB modem installs

Use this when the radio side is a board running `pymc_usb` firmware and the modem is attached to the repeater host over USB-CDC.

1. Install the repeater normally.
2. Run `sudo bash setup-radio-config.sh /etc/pymc_repeater`.
3. Select the `pymc_usb modem (USB-CDC)` hardware option.
4. Confirm the serial device, usually `/dev/ttyACM0`.
5. Restart the service and watch logs.

The current helper defaults are:

- `pymc_usb.port: /dev/ttyACM0`
- `pymc_usb.baudrate: 921600`
- `pymc_usb.lbt_enabled: true`
- `pymc_usb.lbt_max_attempts: 5`

Use [openHop USB/TCP Setup](/projects/pymc-repeater/pymc-usb-and-tcp-setup/) for the full flow.

## pyMC TCP modem installs

Use this when the radio side is a board running `pymc_usb` firmware and exposing a TCP server over LAN, Wi-Fi, or Ethernet.

1. Install the repeater normally.
2. Run `sudo bash setup-radio-config.sh /etc/pymc_repeater`.
3. Select the `pymc_tcp modem (Wi-Fi / Ethernet)` hardware option.
4. Replace the placeholder host with the modem LAN address or mDNS name.
5. Restart the service and confirm the repeater connects.

The current helper writes:

- `pymc_tcp.host: REPLACE_WITH_MODEM_HOST`
- `pymc_tcp.port: 5055`
- `pymc_tcp.token: ""`
- `pymc_tcp.connect_timeout: 5.0`
- `pymc_tcp.lbt_enabled: true`
- `pymc_tcp.lbt_max_attempts: 5`

Use [openHop USB/TCP Setup](/projects/pymc-repeater/pymc-usb-and-tcp-setup/) for the config details.

## Proxmox LXC with CH341

The repo README now documents a Proxmox host-side installer for CH341-backed repeaters.

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/pyMC-dev/pyMC_Repeater/main/scripts/proxmox-install.sh)"
```

That flow is intended to run on the Proxmox host, not inside the container.

Use it when:

- your radio path is CH341 USB-SPI
- you want an always-on containerized deployment
- you do not want a dedicated Pi-class host

## First checks after install

```bash
sudo systemctl status pymc-repeater
sudo journalctl -u pymc-repeater -f
```

Dashboard URL:

```text
http://<repeater-ip>:8000
```

## Null mode

`radio_type: null` or `radio_type: none` starts the daemon without RF hardware. This is useful when you only need the dashboard, API, room servers, or companion TCP endpoints on a host.

## Useful config paths

- Main config: `/etc/pymc_repeater/config.yaml`
- Runtime state: `/var/lib/pymc_repeater`
- Logs via journald: `journalctl -u pymc-repeater`

## Related pages

- [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
- [openHop USB/TCP Setup](/projects/pymc-repeater/pymc-usb-and-tcp-setup/)
- [KISS Setup](/projects/pymc-repeater/kiss-setup/)
- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [Troubleshooting](/projects/pymc-repeater/troubleshooting/)
