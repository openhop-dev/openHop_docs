---
title: openHop Repeater Setup
description: Install and run openHop Repeater on supported hosts.
sidebar:
  order: 3
---

## Before you begin

- Decide whether the host will use `sx1262`, `sx1262_ch341`, `kiss`, `modem_usb`, `modem_tcp`, or `null`.
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

`/setup` is a first-run-only onboarding route. After setup is complete it
redirects to `/login`. To change the backend later, sign in and open
**System → Configuration → Radio → Radio Hardware**, save the change, and restart
Repeater.

The terminal helper is limited to direct SX1262 presets and KISS:

```bash
sudo bash setup-radio-config.sh /etc/openhop_repeater
sudo systemctl restart openhop-repeater
```

Configure `sx1262_ch341`, `modem_usb`, `modem_tcp`, and `null` through the
authenticated Radio Hardware page or the config file instead.

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
