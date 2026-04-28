---
title: pyMC_Repeater Setup
description: Install and run pyMC_Repeater on a Raspberry Pi-class host.
---

## Before you begin

- Enable SPI on your host.
- Confirm radio wiring and model support.
- Ensure Python and Git are available.

## Install from source

```bash
git clone https://github.com/rightup/pyMC_Repeater.git
cd pyMC_Repeater
sudo ./manage.sh
```

The installer configures service user, paths, and interactive radio setup.

## Service operations

```bash
sudo systemctl status pymc-repeater
sudo journalctl -u pymc-repeater -f
```

## Dashboard

After startup, access:

`http://<repeater-ip>:8000`

## Notes

- KISS modem mode is available through configuration.
- See the other pages in this docs site for deeper platform-specific procedures.
