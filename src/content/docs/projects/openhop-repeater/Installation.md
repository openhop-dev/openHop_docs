---
title: Installation
description: Current install paths for openHop Repeater.
sidebar:
  order: 4
---

The current `openhop_repeater` repo supports several install shapes:

- Standard Linux host with native SPI and GPIO
- CH341 USB-SPI hosts
- Proxmox LXC deployments using CH341 passthrough
- KISS modem deployments using a serial TNC
- `modem_usb` modem deployments over USB serial
- `modem_tcp` modem deployments over Wi-Fi or Ethernet
- no-radio `null` mode for dashboard, API, or companion-only services

The main configuration file is `/etc/openhop_repeater/config.yaml`.

## Standard install

The current Repeater `dev` branch uses the management script directly:

```bash
git clone --branch dev --single-branch https://github.com/openhop-dev/openhop_repeater.git
cd openhop_repeater
sudo bash ./manage.sh install
```

These development docs track the Repeater `dev` branch. Use `--branch main`
instead when you intentionally want the stable branch.

That flow installs the service, creates the config directory, and launches the
terminal radio helper. The terminal helper currently configures direct `sx1262`
presets or `kiss`; use the browser `/setup` flow or edit the config for CH341,
openHop USB/TCP, or `null` deployments.

## What the installer sets up

- service user and permissions
- `/opt/openhop_repeater` with a dedicated Python virtual environment
- `/etc/openhop_repeater`
- `/var/lib/openhop_repeater`
- `/var/log/openhop_repeater`
- interactive radio and hardware configuration
- `openhop-repeater.service`

## Re-running radio setup

To revisit hardware or modem selection later:

```bash
sudo bash setup-radio-config.sh /etc/openhop_repeater
sudo systemctl restart openhop-repeater
```

The terminal helper supports:

- direct `sx1262` hardware
- `kiss` modem mode
- hardware presets from `radio-settings.json`

Use `http://<repeater-ip>:8000/setup` only during first-run onboarding. After
onboarding, use **System → Configuration → Radio → Radio Hardware** or update the
relevant config block directly, then restart Repeater.

## KISS modem installs

For serial TNC deployments:

1. Install the repeater normally.
2. Set `radio_type: kiss`.
3. Configure the `kiss.port` and `kiss.baud_rate` values.
4. Make sure the service user can open the serial device.

Start with [KISS Setup](/projects/openhop-repeater/kiss-setup/).

## openHop USB modem installs

Use this when the radio side is a board running openHop Modem firmware and the modem is attached to the repeater host over USB serial.

1. Install the repeater normally.
2. During first-run onboarding use `/setup`; later use the authenticated Radio
   Hardware page or edit `/etc/openhop_repeater/config.yaml`.
3. Set `radio_type: modem_usb` and confirm the serial device, usually
   `/dev/ttyACM0`.
4. Restart the service and watch logs.

The commented canonical config example uses:

- `modem_usb.port: /dev/ttyACM0`
- `modem_usb.baudrate: 921600`
- `modem_usb.lbt_enabled: true`
- `modem_usb.lbt_max_attempts: 5`

Use [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/) for the full flow.

## openHop TCP modem installs

Use this when the radio side is a board running openHop Modem firmware and exposing a TCP server over LAN, Wi-Fi, or Ethernet.

1. Install the repeater normally.
2. During first-run onboarding use `/setup`; later use the authenticated Radio
   Hardware page or edit `/etc/openhop_repeater/config.yaml`.
3. Set `radio_type: modem_tcp` and replace the example host with the modem LAN
   address or its actual board-specific mDNS name.
4. Restart the service and confirm the repeater connects.

Use these values as a starting point:

- `modem_tcp.host: REPLACE_WITH_MODEM_HOST`
- `modem_tcp.port: 5055`
- `modem_tcp.token: ""`
- `modem_tcp.connect_timeout: 5.0`
- `modem_tcp.lbt_enabled: true`
- `modem_tcp.lbt_max_attempts: 5`

Use [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/) for the config details.

## Proxmox LXC installation

The current `dev` installer creates a privileged Debian 13 LXC for CH341 radios
or openHop Modems connected over TCP or USB. It supports architecture-matched
templates, selectable CTID/storage/network/VLAN settings, an optional CH341 host
udev rule, an optional openHop Console install, and an in-container `update`
command.

Run it on the Proxmox host, not inside an LXC:

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/openhop-dev/openhop_repeater/dev/scripts/proxmox-install.sh)"
```

Review the privileged-container, USB-passthrough, console auto-login, radio
backend, and update behavior in the complete
[Proxmox LXC Installation](/projects/openhop-repeater/proxmox-lxc/) guide before
running it.

## First checks after install

```bash
sudo systemctl status openhop-repeater
sudo journalctl -u openhop-repeater -f
```

Dashboard URL:

```text
http://<repeater-ip>:8000
```

For containers, persistent volumes, and device mapping, use
[Docker Deployment](/projects/openhop-repeater/docker/).

## Null mode

`radio_type: null` or `radio_type: none` starts the daemon without RF hardware. This is useful when you only need the dashboard, API, room servers, or companion TCP endpoints on a host.

## Useful config paths

- Main config: `/etc/openhop_repeater/config.yaml`
- Runtime state: `/var/lib/openhop_repeater`
- Installed application and virtual environment: `/opt/openhop_repeater`
- Logs via journald: `journalctl -u openhop-repeater`

## Upgrading an older pyMC installation

The current management script detects legacy `/opt/pymc_repeater`,
`/etc/pymc_repeater`, `/var/lib/pymc_repeater`, and `/var/log/pymc_repeater`
paths. During install or upgrade it migrates their contents to the openHop paths,
archives conflicting legacy directories, disables the old `pymc-repeater`
service, and uses the `openhop-repeater` service going forward.

Back up the config and identity material before upgrading. Use the management
script rather than moving directories by hand. When running the script from a
repository checkout, update that checkout first because `manage.sh` installs the
local source tree:

```bash
cd openhop_repeater
git fetch origin
git switch dev
git pull --ff-only origin dev
sudo bash ./manage.sh upgrade
```

The managed installer uses the host's `python3-pip` package to bootstrap a
dedicated virtual environment and installs build-version tooling inside that
environment. It does not require `pip --break-system-packages`.

## Docker Compose

The published container uses named volumes for config and data by default:

```bash
cp .env.example .env
docker compose up -d
```

Review `.env`, group IDs, device mappings, and host hardware access first. Do not
bind-mount a missing `./config.yaml` file: Docker may create a directory at that
path and prevent startup. Container upgrades are performed by pulling a newer
image and recreating the container, not through the dashboard updater.

## Related pages

- [Uninstallation](/projects/openhop-repeater/uninstallation/)
- [Hardware Setup](/projects/openhop-repeater/hardware-setup/)
- [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/)
- [KISS Setup](/projects/openhop-repeater/kiss-setup/)
- [Configuration Reference](/projects/openhop-repeater/config-file/)
- [Troubleshooting](/projects/openhop-repeater/troubleshooting/)
