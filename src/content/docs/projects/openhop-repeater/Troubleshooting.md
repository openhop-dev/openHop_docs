---
title: Troubleshooting
description: Diagnose service, configuration, radio, modem, dashboard, and storage problems safely.
sidebar:
  order: 17
---

Start with logs and preserve the first error. Avoid changing radio, permissions,
packages, and config simultaneously; that hides the root cause.

## Quick diagnostics

```bash
sudo systemctl status openhop-repeater
sudo journalctl -u openhop-repeater -n 100 --no-pager
sudo journalctl -u openhop-repeater -f
```

The current native install uses:

- application: `/opt/openhop_repeater`;
- config: `/etc/openhop_repeater/config.yaml`;
- state: `/var/lib/openhop_repeater`;
- service: `openhop-repeater`.

Do not paste the full config into a support request. It can contain passwords,
tokens, location, MQTT credentials, and private identity material. Redact secrets
and include only the relevant section plus the error.

## Service does not start

Read the earliest traceback or error after a restart:

```bash
sudo systemctl restart openhop-repeater
sudo journalctl -u openhop-repeater -n 150 --no-pager
```

Common causes:

- invalid YAML or a key at the wrong indentation;
- wrong `radio_type` for the configured backend block;
- missing serial, SPI, GPIO, or USB device;
- service-user permission to the selected device;
- another process already using the device or TCP port;
- a stale legacy path or system Python installation shadowing the managed virtual
  environment.

Use `sudo bash ./manage.sh upgrade` from the checkout to repair/migrate a managed
installation. Do not install dependencies into system Python with
`--break-system-packages`; the current service runs from
`/opt/openhop_repeater/venv`.

## Isolate software from radio hardware

Temporarily use `radio_type: null` in a copied or backed-up config. If the daemon
and dashboard then start, focus on the radio backend, device access, or wiring.
For a receive-only investigation with initialized hardware, use
`repeater.mode: no_tx`.

## Direct SX1262 problems

Verify all of the following against the exact board revision:

- Linux SPI bus and chip-select device exist;
- GPIO numbering matches the selected backend;
- reset, busy, IRQ, TXEN/RXEN, and enable pins are correct;
- DIO3 TCXO voltage and DIO2 RF-switch settings match the module;
- no other daemon is holding GPIO/SPI;
- the antenna is attached before transmit.

With `sx1262_ch341`, pin values are CH341 GPIO numbers `0-7`, not Raspberry Pi
BCM numbers. Confirm the adapter appears as VID/PID `1a86:5512` and is passed
through to a container when applicable.

## KISS, USB, or TCP modem problems

For serial backends, confirm the configured device exists, the service user can
open it, the baud rate is correct, and no terminal/modem-manager process owns it.

For `pymc_tcp`, verify host, port, token, DNS/mDNS resolution, and routing from the
Repeater host. A network ping alone does not prove the modem protocol port is
reachable. For `pymc_usb`, verify the USB-CDC device path after reconnects.

Then compare frequency, bandwidth, spreading factor, coding rate, preamble, sync,
LBT, and power with the modem and the mesh.

## Dashboard is unavailable

1. Confirm the service is active.
2. Test `http://localhost:8000` from the Repeater host.
3. Confirm the host is listening on the expected address and port.
4. Check host/container firewall and port mapping.
5. Review logs for HTTP bind, frontend-path, or authentication errors.

Keep port 8000 private to a trusted LAN, VPN, or protected reverse proxy. CORS is
disabled by default and should remain disabled unless a known browser client
requires it.

## Login or API failures

- Confirm the admin/guest password in the protected config, without posting it.
- Expired JWTs require a new login.
- API tokens are shown in plaintext only when created; create a replacement if a
  token was lost and revoke the old record.
- Interactive Swagger requests use the currently selected server. Verify it
  before calling a mutating endpoint.

## No packets received

- Confirm other nodes are active and use the same RF settings.
- Check antenna, feed line, connector, and placement.
- Review noise-floor, RSSI/SNR, CRC-error, and reconnect indicators.
- Verify transport-key scope and `mesh.unscoped_flood_allow` policy.
- Confirm the node is not accidentally pointed at a different serial/TCP modem.

Do not raise transmit power to diagnose receive-only problems.

## Charts or history are missing

The metrics API reports whether RRD is enabled and available and whether charts
are using RRD or SQLite. If RRD is disabled or unavailable, SQLite may still
provide chart data. Check state-directory ownership and free disk space before
attempting database repair.

Never modify or vacuum the live database. Back up `/var/lib/openhop_repeater`,
stop the service, and work on a copy if offline recovery is required.

## Upgrade problems

The management script migrates legacy `pymc_repeater` directories and disables
the old service. If an upgrade fails:

1. Save the full journal locally.
2. Check whether both old and new services exist.
3. Verify the service unit points to `/opt/openhop_repeater/venv/bin/python` and
   `/etc/openhop_repeater/config.yaml`.
4. Re-run `sudo bash ./manage.sh upgrade` from a clean checkout.
5. Restore a backup only after identifying which config/state paths are active.

Docker installations are upgraded by pulling and recreating the container, not
through the dashboard updater.

## Collect a safe support bundle

Include:

- OS and Python version;
- install type: native, Docker, HA add-on, Buildroot, or Proxmox LXC;
- Repeater commit/tag or image tag;
- selected `radio_type` and hardware model/revision;
- redacted relevant config section;
- first error and surrounding journal lines;
- what changed immediately before the failure.

Exclude private keys, JWT secrets, passwords, API tokens, MQTT/Glass/modem
credentials, exact private location, and complete databases.

For configuration details, see
[Configuration Reference](/projects/openhop-repeater/config-file/) and
[Hardware Setup](/projects/openhop-repeater/hardware-setup/).