---
title: Configuration Reference
description: Current config.yaml reference for openHop Repeater.
---

# openHop Repeater Configuration Guide

Reference for configuring your openHop Repeater using `config.yaml`, located at `/etc/pymc_repeater/config.yaml`.

## Table of Contents

- [Repeater](#repeater)
- [Security](#security)
- [GPS](#gps)
- [Sensors](#sensors)
- [Mesh](#mesh)
- [Identities](#identities)
- [Radio Backend Selection](#radio-backend-selection)
- [CH341 USB-SPI](#ch341-usb-spi)
- [Radio Parameters](#radio-parameters)
- [SX1262 Hardware](#sx1262-hardware)
- [Delays](#delays)
- [Duty Cycle](#duty-cycle)
- [Storage](#storage)
- [MQTT Brokers](#mqtt-brokers)
- [openHop Glass](#openhop-glass)
- [Logging](#logging)
- [Web](#web)
- [Examples](#examples)

## Repeater

Core node identity and daemon behavior.

### `repeater.node_name`

Friendly name shown in logs, adverts, and the web UI.

### `repeater.mode`

Optional TX mode:

- `forward` repeats traffic normally
- `monitor` keeps RX and higher-level services active but disables repeat forwarding
- `no_tx` disables all transmit activity

### `repeater.latitude` / `repeater.longitude`

Manual coordinates used when you are not advertising a live GPS fix.

### `repeater.identity_file`

Path to the local node identity file. If omitted, a new identity is generated on first run.

### `repeater.identity_key`

Optional inline private key. If both `identity_key` and `identity_file` are set, `identity_key` wins.

### `repeater.owner_info`

Optional owner string returned to clients requesting owner information.

### `repeater.cache_ttl`

How long duplicate packets stay in cache, in seconds.

### `repeater.max_flood_hops`

Maximum number of hops a flood packet may already have taken before this repeater forwards it.

### `repeater.use_score_for_tx`

Enables score-based filtering and adaptive transmission timing.

### `repeater.score_threshold`

Reserved for future use. Present in config, but does not currently change packet handling.

### `repeater.send_advert_interval_hours`

Automatic advert interval in hours. Set `0` to disable automatic adverts.

### `repeater.allow_discovery`

Respond automatically to discovery packets.

### `repeater.advert_rate_limit`

Per-pubkey token-bucket limiting for repeated adverts.

Key fields:

- `enabled`
- `bucket_capacity`
- `refill_tokens`
- `refill_interval_seconds`
- `min_interval_seconds`

### `repeater.advert_penalty_box`

Escalating cooldowns for repeated advert limit violations.

Key fields:

- `enabled`
- `violation_threshold`
- `violation_decay_seconds`
- `base_penalty_seconds`
- `penalty_multiplier`
- `max_penalty_seconds`

### `repeater.advert_adaptive`

Scales advert rate limits based on mesh activity.

Key fields:

- `enabled`
- `ewma_alpha`
- `hysteresis_seconds`
- `thresholds.quiet_max`
- `thresholds.normal_max`
- `thresholds.busy_max`

## Security

Authentication settings are nested under `repeater.security`.

### `repeater.security.max_clients`

Maximum number of authenticated clients across identities.

### `repeater.security.admin_password`

Full-access password for the web UI and API.

### `repeater.security.guest_password`

Guest password for restricted access.

### `repeater.security.allow_read_only`

Allow unauthenticated or ACL-missing clients to view read-only data.

### `repeater.security.jwt_secret`

JWT signing secret. Leave empty to auto-generate.

### `repeater.security.jwt_expiry_minutes`

Session lifetime before re-authentication is required.

## GPS

Local GPS receiver support is configured under `gps:`.

### `gps.enabled`

Turns GPS parsing on and exposes parsed data at `/api/gps`.

### `gps.source`

Source type:

- `serial` for a directly attached receiver
- `file` for a file or sidecar bridge writing NMEA
- `modem_http` for a networked openHop Modem HTTP `/api/stats` GPS payload

### Serial source settings

```yaml
gps:
  source: serial
  device: "/dev/serial0"
  baud_rate: 9600
  read_timeout_seconds: 1.0
  reconnect_interval_seconds: 5.0
```

### File source settings

```yaml
gps:
  source: file
  source_path: "/var/lib/pymc_repeater/gps_nmea.txt"
  poll_interval_seconds: 2.0
```

### Modem HTTP source settings

Use this when a networked openHop Modem exposes parsed GPS data from its HTTP API.

```yaml
gps:
  enabled: true
  source: modem_http
  host: "pymc-modem.local"
  port: 80
  endpoint: "/api/stats"
  scheme: "http"
  username: "admin"
  password: "password"
  poll_interval_seconds: 2.0
```

Supported source aliases are `modem_http`, `pymc_modem`, and `http`. Prefer `modem_http` in new configs.

See [openHop Modem Repeater Integration](/projects/openhop-modem/repeater-integration/) for the full RF, sensor, and GPS setup flow.

### Location behavior

These three settings control different things:

- `api_fallback_to_config_location`: what `/api/gps` shows before a fix
- `advertise_gps_location`: whether outgoing repeater adverts use the GPS fix
- `persist_gps_fix_to_config`: whether valid fixes are written back into `repeater.latitude` and `repeater.longitude`

Related keys:

- `persist_gps_fix_interval_seconds`
- `location_precision_digits`
- `stale_after_seconds`
- `retain_sentences`
- `validate_checksum`
- `require_checksum`

### Time sync

When enabled, the daemon can set system time from a valid GPS UTC fix.

Relevant keys:

- `time_sync_enabled`
- `time_sync_interval_seconds`
- `time_sync_min_offset_seconds`
- `time_sync_min_valid_year`

## Sensors

The sensor subsystem polls host or I2C data sources and exposes them under `/api/stats`.

### Top-level controls

```yaml
sensors:
  enabled: true
  poll_interval_seconds: 10.0
  auto_install_packages: true
  definitions: []
```

Key fields:

- `enabled`
- `poll_interval_seconds`
- `auto_install_packages`
- `definitions`

### `sensors.definitions`

Each entry defines one sensor instance.

Common keys:

- `type`
- `name`
- `enabled`
- `auto_install_packages`
- `settings`

The current example config includes these sensor types:

- `hardware_stats`
- `ina219`
- `ens210`
- `shtc3`
- `waveshare_ups_d`
- `pymc_modem`

Example:

```yaml
sensors:
  enabled: true
  definitions:
    - type: hardware_stats
      name: system-health
      enabled: true
    - type: shtc3
      name: ambient
      enabled: true
      auto_install_packages: false
      settings:
        i2c_address: 0x70
        bus_number: 1
    - type: pymc_modem
      name: modem
      enabled: true
      settings:
        host: "pymc-modem.local"
        port: 80
        endpoint: "/api/stats"
        scheme: "http"
        username: "admin"
        password: "password"
        poll_interval_seconds: 60.0
        timeout_seconds: 2.0
```

The `pymc_modem` sensor reads modem diagnostics from an openHop Modem HTTP API and exposes them under `/api/stats -> sensors`. It is useful for battery, solar, and modem-visible GPS diagnostics. If you want Repeater's native `/api/gps` endpoint to use the modem's location fix, configure `gps.source: modem_http` as well.

## Mesh

Mesh-wide forwarding and path encoding behavior.

### `mesh.unscoped_flood_allow`

Controls whether unscoped flood traffic is allowed by default.

### `mesh.path_hash_mode`

Path hash width for originated flood packets:

- `0` = 1-byte hashes
- `1` = 2-byte hashes
- `2` = 3-byte hashes

### `mesh.loop_detect`

Loop detection mode:

- `off`
- `minimal`
- `moderate`
- `strict`

## Identities

The repeater can host additional logical identities.

### `identities.room_servers`

Room servers act as independent nodes with their own keys and settings.

### `identities.companions`

Companions expose the MeshCore frame protocol over TCP. One client connects per companion TCP port.

Key companion settings:

- `node_name`
- `tcp_port`
- `bind_address`
- `tcp_timeout`

For key generation and imports, see [Identity Management](/projects/openhop-repeater/identity-management/).

## Radio Backend Selection

Choose the backend with the top-level `radio_type` key.

Supported values in the current repo:

- `sx1262`
- `sx1262_ch341`
- `kiss`
- `pymc_tcp`
- `pymc_usb`
- `null`
- `none`

### `radio_type: sx1262`

Use a native Linux SPI device with system GPIO, typically on a Raspberry Pi or similar host.

### `radio_type: sx1262_ch341`

Use a CH341 USB-SPI adapter. In this mode the `sx1262` pin values are CH341 GPIO numbers `0-7`, not BCM GPIO numbers.

### `radio_type: kiss`

Use a serial KISS TNC instead of direct GPIO/SPI radio control.

```yaml
radio_type: kiss

kiss:
  port: "/dev/ttyUSB0"
  baud_rate: 9600
```

See [KISS Setup](/projects/openhop-repeater/kiss-setup/) for the operational flow.

### `radio_type: pymc_tcp`

Use a `pymc_usb` firmware modem exposed over Wi-Fi or Ethernet.

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

Key fields:

- `host`
- `port`
- `token`
- `connect_timeout`
- `lbt_enabled`
- `lbt_max_attempts`

See [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/) for the operational flow.

### `radio_type: pymc_usb`

Use a `pymc_usb` firmware modem attached over USB-CDC.

```yaml
radio_type: pymc_usb

pymc_usb:
  port: "/dev/ttyACM0"
  baudrate: 921600
  lbt_enabled: true
  lbt_max_attempts: 5
```

Key fields:

- `port`
- `baudrate`
- `lbt_enabled`
- `lbt_max_attempts`

See [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/) for the operational flow.

### `radio_type: null` or `none`

Start the daemon without RF hardware. Use this when you only need dashboard, API, room-server, or companion functionality on the host.

## CH341 USB-SPI

When `radio_type: sx1262_ch341` is selected, configure the adapter under `ch341:`.

```yaml
ch341:
  vid: 6790
  pid: 21778
```

Notes:

- `6790` is `0x1A86`
- `21778` is `0x5512`
- The CH341 requires host USB permissions and is the basis for the current Proxmox LXC flow

## Radio Parameters

These values apply to direct SX1262 hardware and to modem-backed transports unless the modem firmware overrides them.

```yaml
radio:
  frequency: 869618000
  tx_power: 14
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8
  preamble_length: 17
  implicit_header: false
```

Important keys:

- `frequency`: in Hz
- `tx_power`: dBm
- `bandwidth`: in Hz
- `spreading_factor`: LoRa SF
- `coding_rate`: LoRa coding rate
- `preamble_length`
- `implicit_header`

## SX1262 Hardware

Direct hardware setup is configured under `sx1262:`.

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

Notes:

- With `radio_type: sx1262`, pin numbers are normal Linux GPIO numbering for the host
- With `radio_type: sx1262_ch341`, the same pin fields map to CH341 GPIO numbers
- `use_gpiod_backend` switches GPIO access to libgpiod-backed numbering on platforms such as Luckfox Pico Ultra
- `gpio_chip` selects the gpiod chip index when `use_gpiod_backend` is enabled
- `en_pin` can be used to power-enable some radio boards during initialization
- `use_dio3_tcxo` and `use_dio2_rf` are needed on some E22 and meshadv-class boards

## Delays

Transmission timing multipliers live under `delays:`.

```yaml
delays:
  tx_delay_factor: 1.0
  direct_tx_delay_factor: 0.5
```

## Duty Cycle

Duty cycle enforcement is configured under `duty_cycle:`.

```yaml
duty_cycle:
  enforcement_enabled: false
  max_airtime_per_minute: 3600
```

## Storage

Persistent local state and retention settings.

```yaml
storage:
  storage_dir: "/var/lib/pymc_repeater"
  retention:
    sqlite_cleanup_days: 31
```

The daemon stores runtime data under `storage.storage_dir`. The default install keeps the main config at `/etc/pymc_repeater/config.yaml` and state data under `/var/lib/pymc_repeater`.

## MQTT Brokers

Current repeater builds use `mqtt_brokers:` rather than the older single `mqtt:` block.

```yaml
mqtt_brokers:
  iata_code: "Test"
  status_interval: 300
  owner: ""
  email: ""
  brokers: []
```

Each broker entry supports fields such as:

- `preset`
- `enabled`
- `name`
- `host`
- `port`
- `transport`
- `audience`
- `use_jwt_auth`
- `username`
- `password`
- `format`
- `retain_status`
- `tls.enabled`
- `tls.insecure`
- `disallowed_packet_types`

This is also where current LetsMesh-style publishing is modeled.

## openHop Glass

Central control-plane integration is configured under `glass:`.

```yaml
glass:
  enabled: false
  base_url: "http://localhost:8080"
  inform_interval_seconds: 30
  request_timeout_seconds: 10
  verify_tls: true
  api_token: ""
  cert_store_dir: "/etc/pymc_repeater/glass"
```

Use this when the repeater should post `/inform` payloads to openHop Glass and accept managed updates from it.

## Logging

```yaml
logging:
  level: INFO
  format: "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
```

## Web

Web server settings are configured under `web:`.

```yaml
web:
  cors_enabled: false
  # web_path: null
```

Key fields:

- `cors_enabled`
- `web_path`

## Examples

### Basic SX1262 host

```yaml
radio_type: sx1262

repeater:
  node_name: "mesh-repeater-01"
  latitude: 40.7128
  longitude: -74.0060

mesh:
  unscoped_flood_allow: true
  path_hash_mode: 0
  loop_detect: minimal

radio:
  frequency: 915000000
  tx_power: 20
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8

sx1262:
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16
```

### KISS modem host

```yaml
radio_type: kiss

repeater:
  node_name: "kiss-repeater"

kiss:
  port: "/dev/ttyUSB0"
  baud_rate: 9600

radio:
  frequency: 915000000
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8
```

### openHop USB modem host

```yaml
radio_type: pymc_usb

repeater:
  node_name: "usb-modem-repeater"

pymc_usb:
  port: "/dev/ttyACM0"
  baudrate: 921600
  lbt_enabled: true
  lbt_max_attempts: 5

radio:
  frequency: 915000000
  tx_power: 22
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8
  preamble_length: 16
```

### openHop TCP modem host

```yaml
radio_type: pymc_tcp

repeater:
  node_name: "tcp-modem-repeater"

pymc_tcp:
  host: "pymc-3e2834.local"
  port: 5055
  token: ""
  connect_timeout: 5.0
  lbt_enabled: true
  lbt_max_attempts: 5

radio:
  frequency: 915000000
  tx_power: 22
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8
  preamble_length: 16
```

### CH341 / Proxmox-style host

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

## Notes

- The current repo schema is defined by the upstream `config.yaml.example` in `openhop_repeater`.
- Older repeater docs and examples may still mention `mesh.global_flood_allow` or a top-level `mqtt:` block. Those are stale against the current repo.
- After config edits, restart the service with `sudo systemctl restart pymc-repeater` and watch logs with `journalctl -u pymc-repeater -f`.
