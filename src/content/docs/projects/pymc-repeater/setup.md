---
title: pyMC Repeater Setup
description: Install and run pyMC_Repeater on supported hosts.
---

## Before you begin

- Decide whether the host will use `sx1262`, `sx1262_ch341`, or `kiss`.
- Confirm hardware or serial device access.
- Ensure Python and Git are available.

## Install from source

```bash
git clone https://github.com/rightup/pyMC_Repeater.git
cd pyMC_Repeater
sudo ./manage.sh
```

## Reconfigure radio mode later

```bash
sudo bash setup-radio-config.sh /etc/pymc_repeater
sudo systemctl restart pymc-repeater
```

## Dashboard

After startup:

`http://<repeater-ip>:8000`

## Next pages

- [Installation](/projects/pymc-repeater/installation/)
- [Hardware Setup](/projects/pymc-repeater/hardware-setup/)
- [KISS Setup](/projects/pymc-repeater/kiss-setup/)
- [Configuration Reference](/projects/pymc-repeater/config-file/)
