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

The main configuration file is `/etc/pymc_repeater/config.yaml`.

## Standard install

The current upstream README uses the management script directly:

```bash
git clone https://github.com/rightup/pyMC_Repeater.git
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
- `kiss` modem mode
- hardware presets from `radio-settings.json`

## KISS modem installs

For serial TNC deployments:

1. Install the repeater normally.
2. Set `radio_type: kiss`.
3. Configure the `kiss.port` and `kiss.baud_rate` values.
4. Make sure the service user can open the serial device.

Start with [KISS Setup](/projects/pymc-repeater/kiss-setup/).

## Proxmox LXC with CH341

The repo README now documents a Proxmox host-side installer for CH341-backed repeaters.

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/rightup/pyMC_Repeater/feat/newRadios/scripts/proxmox-install.sh)"
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

## Useful config paths

- Main config: `/etc/pymc_repeater/config.yaml`
- Runtime state: `/var/lib/pymc_repeater`
- Logs via journald: `journalctl -u pymc-repeater`

## Related pages

- [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
- [KISS Setup](/projects/pymc-repeater/kiss-setup/)
- [Configuration Reference](/projects/pymc-repeater/config-file/)
- [Troubleshooting](/projects/pymc-repeater/troubleshooting/)
