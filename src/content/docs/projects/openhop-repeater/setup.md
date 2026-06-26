---
title: openHop Repeater Setup
description: Install and run openHop Repeater on supported hosts.
---

## Before you begin

- Decide whether the host will use `sx1262`, `sx1262_ch341`, `kiss`, `pymc_usb`, `pymc_tcp`, or `null`.
- Confirm hardware or serial device access.
- Confirm network reachability if the modem lives on Wi-Fi or Ethernet.
- For openHop Modem deployments, flash and provision the modem first. See [openHop Modem](/projects/openhop-modem/).
- Ensure Python and Git are available.

## Install from source

```bash
git clone https://github.com/openhop-dev/openhop_repeater.git
cd openhop_repeater
sudo ./manage.sh
```

## Reconfigure radio mode later

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
sudo systemctl restart pymc-repeater
```

The helper can now write config for:

- direct `sx1262` hardware
- `sx1262_ch341` USB-SPI setups
- `kiss` serial TNCs
- `pymc_usb` USB-CDC modems
- `pymc_tcp` network modems
- `null` mode

## Dashboard

After startup:

`http://<repeater-ip>:8000`

## Next pages

- [Installation](/projects/openhop-repeater/installation/)
- [Hardware Setup](/projects/openhop-repeater/hardware-setup/)
- [openHop Modem](/projects/openhop-modem/)
- [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/)
- [KISS Setup](/projects/openhop-repeater/kiss-setup/)
- [Configuration Reference](/projects/openhop-repeater/config-file/)
