---
title: config file
---

# pyMC Repeater Configuration Guide

Reference for configuring your pyMC Repeater using `config.yaml`.

---

## Table of Contents

- [Repeater Configuration](#repeater-configuration)
- [Identity Management](Identity-Management.md) ⭐
- [Mesh Network Settings](#mesh-network-settings)
- [Radio Configuration](#radio-configuration)
- [Hardware Configuration (SX1262)](#hardware-configuration-sx1262)
- [Timing and Delays](#timing-and-delays)
- [Duty Cycle Management](#duty-cycle-management)
- [Storage and Data Management](#storage-and-data-management)
- [Local MQTT Publishing](#local-mqtt-publishing)
- [LetsMesh Integration](#letsmesh-cloud-integration)
- [Logging Configuration](#logging-configuration)
- [Web Interface Settings](#web-interface-settings)

---

## Repeater Configuration

Basic repeater identity and behavior settings.

### `repeater.node_name`
**Type:** `string`  
**Default:** `"mesh-repeater-01"`  
**Description:** Friendly name for your repeater node. Used in adverts, web interface, and LetsMesh.

```yaml
repeater:
  node_name: "my-home-repeater"
```

### `repeater.latitude` / `repeater.longitude`
**Type:** `float`  
**Default:** `0.0`  
**Range:** Latitude: -90 to 90, Longitude: -180 to 180  
**Description:** Geographic coordinates for your repeater. Optional but recommended for sending adverts with location and rendering maps within the Web UI.

```yaml
repeater:
  latitude: 51.5074
  longitude: -0.1278
```

### `repeater.identity_file`
**Type:** `string` or `null`  
**Default:** `null`  
**Description:** Path to a file containing the private key (64 hex characters). If `null`, a new identity is generated on first run.

```yaml
repeater:
  identity_file: "/etc/pymc_repeater/identity.key"
```

**For information about identity management, key generation, and importing firmware keys, see the [Identity Management Guide](Identity-Management.md).**

### `repeater.cache_ttl`
**Type:** `integer` (seconds)  
**Default:** `3600`  
**Description:** How long duplicate packets are remembered to prevent re-forwarding the same packet.

```yaml
repeater:
  cache_ttl: 3600
```

### `repeater.use_score_for_tx`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable quality-based packet filtering and adaptive transmission delays based on packet SNR and size.

```yaml
repeater:
  use_score_for_tx: false
```

### `repeater.score_threshold`
**Type:** `float`  
**Default:** `0.3`  
**Description:** Reserved for future features. Currently has no effect on packet processing.

### `repeater.send_advert_interval_hours`
**Type:** `integer` (hours)  
**Default:** `10`  
**Range:** `0` (disabled) to `24+`  
**Description:** Automatic advertisement broadcast interval. Set to `0` to disable (manual only via web interface).

```yaml
repeater:
  send_advert_interval_hours: 10  # Advertise every 10 hours
```

### `repeater.allow_discovery`
**Type:** `boolean`  
**Default:** `true`  
**Description:** When enabled, the repeater will automatically respond to discovery packets from other nodes with its node information (node type 2 - repeater).

```yaml
repeater:
  allow_discovery: true
```

---

## Security Configuration

Sec

### `mesh.loop_detect`
**Type:** `string`  
**Default:** `minimal`  
**Options:** `off`, `minimal`, `moderate`, `strict`  
**Description:** Flood loop detection mode to prevent packet loops.
- `off`: Disabled
- `minimal`: Allow up to 3 self-hashes (most lenient)
- `moderate`: Allow up to 1 self-hash
- `strict`: Allow 0 self-hashes (no loops allowed)

```yaml
mesh:
  loop_detect: minimal
```

---

## Multiple Identity Configuration

Configure room servers and companions that operate as separate logical nodes on the mesh.

### Room Servers

Room servers act as separate messaging spaces with their own identities.

```yaml
identities:
  room_servers:
    - name: "TestBBS"
      identity_key: "your_room_identity_key_hex_here"
      type: "room_server"
      settings:
        node_name: "Test BBS Room"
        latitude: 0.0
        longitude: 0.0
        admin_password: "room_admin_password"
        guest_password: "room_guest_password"
    - name: "SocialHub"
      identity_key: "another_identity_key_hex_here"
      type: "room_server"
      settings:
        node_name: "Social Hub"
        latitude: 0.0
        longitude: 0.0
        admin_password: "social_admin_123"
        guest_password: "social_guest_123"
```

### Companions

Companions expose the MeshCore frame protocol over TCP for standard clients. One TCP client per companion at a time.

```yaml
identities:
  companions:
    - name: "RepeaterCompanion"
      identity_key: "your_companion_identity_key_hex_here"
      settings:
        node_name: "RepeaterCompanion"
        tcp_port: 5000
        bind_address: "0.0.0.0"
    - name: "BobCompanion"
      identity_key: "another_companion_identity_key_hex"
      settings:
        node_name: "meshcore-bob"
        tcp_port: 5001
```

For detailed information about creating and managing identities, see the [Identity Management Guide](Identity-Management.md).urity settings for login/authentication and client sessions.

### `repeater.security.max_clients`
**Type:** `integer`  
**Default:** `1`  
**Description:** Maximum number of authenticated clients allowed simultaneously (across all identities).

```yaml
repeater:
  security:
    max_clients: 1
```

### `repeater.security.admin_password`
**Type:** `string`  
**Default:** `"admin123"`  
**Description:** Admin password for full access to the repeater interface.

```yaml
repeater:
  security:
    admin_password: "admin123"
```

### `repeater.security.guest_password`
**Type:** `string`  
**Default:** `"guest123"`  
**Description:** Guest password for limited read-only access (if `allow_read_only` is enabled).

```yaml
repeater:
  security:
    guest_password: "guest123"
```

### `repeater.security.allow_read_only`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Allow read-only access for clients without password or not in ACL list.

```yaml
repeater:
  security:
    allow_read_only: false
```

### `repeater.security.jwt_secret`
**Type:** `string`  
**Default:** `""` (auto-generated if empty)  
**Description:** JWT secret key for signing authentication tokens. Auto-generated on first run if not provided. Generate manually with: `python -c "import secrets; print(secrets.token_hex(32))"`

```yaml
repeater:
  security:
    jwt_secret: ""
```

### `repeater.security.jwt_expiry_minutes`
**Type:** `integer` (minutes)  
**Default:** `60`  
**Description:** JWT token expiry time in minutes. Controls how long users stay logged in before needing to re-authenticate.

```yaml
repeater:
  security:
    jwt_expiry_minutes: 60
```

---

## Advertisement Rate Limiting

Control advertisement traffic using token bucket rate limiting (per public key).

### `repeater.advert_rate_limit`
**Type:** `object`  
**Description:** Token bucket rate limiter for incoming adverts, smoothing burst traffic.

```yaml
repeater:
  advert_rate_limit:
    enabled: false
    bucket_capacity: 2           # Max burst size per pubkey
    refill_tokens: 1             # Tokens added per refill interval
    refill_interval_seconds: 36000  # Refill interval (10 hours)
    min_interval_seconds: 0      # Hard minimum spacing (0 to disable)
```

---

## Advertisement Penalty Box

Escalating cooldown system for repeated advert rate limit violations.

### `repeater.advert_penalty_box`
**Type:** `object`  
**Description:** Applies escalating penalties to nodes that repeatedly violate rate limits.

```yaml
repeater:
  advert_penalty_box:
    enabled: false
    violation_threshold: 2       # Violations before cooldown
    violation_decay_seconds: 43200  # Reset count after 12 hours
    base_penalty_seconds: 21600  # First penalty (6 hours)
    penalty_multiplier: 2.0      # Double penalty each time
    max_penalty_seconds: 86400   # Cap at 24 hours
```

---

## Adaptive Advertisement Rate Limiting

Dynamically scale rate limits based on mesh network activity level.

### `repeater.advert_adaptive`
**Type:** `object`  
**Description:** Adapts rate limits based on mesh busyness: quiet mesh = lenient, busy mesh = strict.

```yaml
repeater:
  advert_adaptive:
    enabled: false
    ewma_alpha: 0.1              # Smoothing factor (0.0-1.0, higher = faster)
    hysteresis_seconds: 300      # Delay before tier change takes effect
    thresholds:
      quiet_max: 0.05            # Adverts per minute (no limiting)
      normal_max: 0.20           # Normal tier (1x limits)
      busy_max: 0.50             # Busy tier (0.5x capacity)
      # Above busy_max = CONGESTED tier (0.25x capacity)
```

---

## Mesh Network Settings

### `mesh.global_flood_allow`
**Type:** `boolean`  
**Default:** `true`  
**Description:** Global flood policy. Controls whether the repeater forwards flood packets by default.
- `true`: Allow all flood packets
- `false`: Deny all flood packets (unless allowed by specific transport key)

```yaml
mesh:
  global_flood_allow: true
```

---



### `radio.frequency`
**Type:** `integer` (Hz)  
**Default:** `869618000` (869.618 MHz - EU)  
**Description:** Radio frequency in Hz. Common frequencies:
- EU: `869618000` (869.618 MHz)
- US: `915000000` (915 MHz)
- AU: `923000000` (923 MHz)

```yaml
radio:
  frequency: 869618000
```

### `radio.tx_power`
**Type:** `integer` (dBm)  
**Default:** `14`  
**Description:** Transmit power. Higher = longer range but more power consumption.

```yaml
radio:
  tx_power: 14
```     # Enable DIO3 TCXO power supply
  dio3_tcxo_voltage: 1.8         # TCXO voltage (1.6V, 1.7V, 1.8V, 2.7V, 3.0V, 3.3V)
  use_dio2_rf: false             # Use DIO2 for RF switching
  is_waveshare: false     
### `radio.bandwidth`
**Type:** `integer` (Hz)  
**Default:** `62500` (62.5 kHz)  
**Options:** `7800`, `10400`, `15600`, `20800`, `31250`, `41700`, `62500`, `125000`, `250000`, `500000`  
**Description:** LoRa bandwidth. Lower = longer range, higher = faster data rate.

```yaml
radio:
  bandwidth: 62500
```

### `radio.spreading_factor`
**Type:** `integer`  
**Default:** `8`  
**Range:** `7` to `12`  
**Description:** LoRa spreading factor. Higher = longer range but slower data rate.

```yaml
radio:
  spreading_factor: 8
```

### `radio.coding_rate`
**Type:** `integer`  
**Default:** `8`  
**Range:** `5` to `8`  
**Description:** Forward error correction coding rate (4/5, 4/6, 4/7, or 4/8).

```yaml
radio:
  coding_rate: 8
```
---

## Hardware Configuration (SX1262)

GPIO pin configuration for SX1262 LoRa module.

### SPI Configuration

```yaml
sx1262:
  bus_id: 0     # SPI bus (usually 0)
  cs_id: 0      # Chip select (usually 0)
```

### GPIO Pins (BCM Numbering)

**Important:** Use BCM pin numbering, not physical pin numbers.

```yaml
sx1262:
  cs_pin: 21      # Chip select
  reset_pin: 18   # Reset
  busy_pin: 20    # Busy status
  irq_pin: 16     # Interrupt request
```

### Optional Pins

```yaml
sx1262:
  txen_pin: -1    # TX enable (-1 to disable)
  rxen_pin: -1    # RX enable (-1 to disable)
  txled_pin: -1   # TX LED indicator (-1 to disable)
  rxled_pin: -1   # RX LED indicator (-1 to disable)
```

### Hardware Flags

```yaml
sx1262:
  use_dio3_tcxo: false           # Enable DIO3 TCXO power supply
  dio3_tcxo_voltage: 1.8         # TCXO voltage (1.6V, 1.7V, 1.8V, 2.7V, 3.0V, 3.3V)
  use_dio2_rf: false             # Use DIO2 for RF switching
  is_waveshare: false            # Waveshare hardware compatibility mode
```

---

## Timing and Delays

Transmission delay configuration for different routing modes.

### `delays.tx_delay_factor`
**Type:** `float`  
**Default:** `1.0`  
**Description:** Multiplier for flood mode transmission delays. Higher values = more delay before forwarding.

```yaml
delays:
  tx_delay_factor: 1.0
```

### `delays.direct_tx_delay_factor`
**Type:** `float`  
**Default:** `0.5`  
**Description:** Multiplier for direct mode transmission delays. Lower = faster forwarding for direct packets.

```yaml
delays:
  direct_tx_delay_factor: 0.5
```

---

## Duty Cycle Management

Control radio airtime to comply with regulations (e.g., EU 1% duty cycle).

### `duty_cycle.enforcement_enabled`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable/disable duty cycle enforcement.

```yaml
duty_cycle:
  enforcement_enabled: false
```

### `duty_cycle.max_airtime_per_minute`
**Type:** `integer` (milliseconds)  
**Default:** `3600`  
**Description:** Maximum transmission time per minute. Default of 3600ms = 6% duty cycle.

For EU 1% duty cycle:
```yaml
duty_cycle:
  enforcement_enabled: true
  max_airtime_per_minute: 600  # 1% of 60000ms
```

---

## Storage and Data Management

### `storage.storage_dir`
**Type:** `string` (path)  
**Default:** `"/var/lib/pymc_repeater"`  
**Description:** Directory for SQLite database and RRD files.

```yaml
storage:
  storage_dir: "/var/lib/pymc_repeater"
```

### Data Retention

```yaml
storage:
  retention:
    sqlite_cleanup_days: 31
```

**RRD Archives** (automatic):
- 1 minute resolution for 1 week
- 5 minute resolution for 1 month
- 1 hour resolution for 1 year

---

## Local MQTT Publishing

Publish packet data to a local MQTT broker (e.g., Mosquitto, Home Assistant).

### `mqtt.enabled`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable/disable local MQTT publishing.

```yaml
mqtt:
  enabled: true
```

### MQTT Broker Settings

```yaml
mqtt:
  broker: "localhost"
  port: 1883
  use_websockets: false    # Use WebSocket transport (ports: 80, 443, 9001)
  username: null           # Optional authentication
  password: null
```

### TLS/SSL Configuration

```yaml
mqtt:
  tls:
    enabled: false
    ca_cert: null                  # Custom CA certificate (null for system default)
    client_cert: null              # Client certificate for mutual TLS
    client_key: null               # Client key for mutual TLS
    insecure: false                # Skip certificate verification (not recommended)
```

### Topic Structure

```yaml
mqtt:
  base_topic: "meshcore/repeater"
```

Messages published to:
- `{base_topic}/{node_name}/packet` - Packet data
- `{base_topic}/{node_name}/advert` - Advertisement messages

**Example:** `meshcore/repeater/my-home-repeater/packet`

---

## LetsMesh Integration

Publish data to LetsMesh service for network-wide monitoring.

### `letsmesh.enabled`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable/disable LetsMesh publishing.

```yaml
letsmesh:
  enabled: true
```

### `letsmesh.iata_code`
**Type:** `string`  
**Default:** `"Test"`  
**Description:** Airport/location code for grouping nodes geographically (e.g., "SFO", "LHR", "NYC").

```yaml
letsmesh:
  iata_code: "NYC"
```

### `letsmesh.broker_index`
**Type:** `integer`  
**Default:** `0`  
**Options:**
- `0` - Europe (mqtt-eu-v1.letsmesh.net) - single built-in broker
- `1` - US West (mqtt-us-v1.letsmesh.net) - single built-in broker
- `-1` or `null` - All built-in brokers (maximum redundancy)
- `-2` - Only custom brokers (ignores built-in brokers)

```yaml
letsmesh:
  broker_index: 0  # Use EU broker
```

### `letsmesh.status_interval`
**Type:** `integer` (seconds)  
**Default:** `300`  
**Description:** Heartbeat interval for status updates (uptime, packet counts).

```yaml
letsmesh:
  status_interval: 300
```

### `letsmesh.owner` and `letsmesh.email`
**Type:** `string`  
**Default:** `""`  
**Description:** Owner name and email for identification on LetsMesh network.

```yaml
letsmesh:
  owner: "Your Name"
  email: "your.email@example.com"
```

### `letsmesh.additional_brokers`
**Type:** `list of objects`  
**Description:** Additional custom MQTT brokers for private or backup connectivity.

```yaml
letsmesh:
  broker_index: 0  # EU primary
  additional_brokers:
    - name: "Backup Server"
      host: "mqtt-backup.mydomain.com"
      port: 8883
      audience: "mqtt-backup.mydomain.com"
    - name: "Custom Primary"
      host: "mqtt-1.mydomain.com"
      port: 443
      audience: "mqtt-1.mydomain.com"
```

### Packet Type Filtering

Block specific packet types from being published to LetsMesh.

```yaml
letsmesh:
  disallowed_packet_types:
    - TRACE      # Don't publish trace packets
    - ACK        # Don't publish acknowledgments
```

**Available packet types:**
- `REQ` - Requests
- `RESPONSE` - Responses
- `TXT_MSG` - Text messages
- `ACK` - Acknowledgments
- `ADVERT` - Advertisements
- `GRP_TXT` - Group text messages
- `GRP_DATA` - Group data
- `ANON_REQ` - Anonymous requests
- `PATH` - Path packets
- `TRACE` - Trace packets
- `RAW_CUSTOM` - Custom raw packets

---

## Logging Configuration

### `logging.level`
**Type:** `string`  
**Default:** `"INFO"`  
**Options:** `DEBUG`, `INFO`, `WARNING`, `ERROR`  
**Description:** Logging verbosity level.

```yaml
logging:
  level: INFO
```

### `logging.format`
**Type:** `string`  
**Default:** `"%(asctime)s - %(name)s - %(levelname)s - %(message)s"`  
**Description:** Log message format (Python logging format).

---

## Web Interface Settings

### `web.cors_enabled`
**Type:** `boolean`  
**Default:** `false`  
**Description:** Enable CORS headers for web API. Required if accessing web interface from different domain.

```yaml
web:
  cors_enabled: false
```

### `web.web_path`
**Type:** `string` (path)  
**Default:** Built-in path (null)  
**Description:** Custom path to web frontend files. Allows overriding the default built-in web interface.

```yaml
web:
  web_path: null  # Use default built-in interface
  # web_path: "/opt/custom-web-ui"  # Or use custom path
```
letsmesh:
  enabled: true
```

### `letsmesh.iata_code`
**Type:** `string`  
**Default:** `"Test"`  
**Description:** Airport/location code for grouping nodes geographically (e.g., "SFO", "LHR", "NYC").

```yaml
letsmesh:
  iata_code: "NYC"
```

### `letsmesh.broker_index`
**Type:** `integer`  
**Default:** `0`  
---

## Example Configurations

### Minimal Configuration (Default Settings)

```yaml
repeater:
  node_name: "my-repeater"
  latitude: 51.5074
  longitude: -0.1278

mesh:
  global_flood_allow: true

radio:
  frequency: 869618000
  tx_power: 14
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8

sx1262:
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16
```

### Production Configuration with LetsMesh

```yaml
repeater:
  node_name: "rooftop-repeater-01"
  latitude: 40.7128
  longitude: -74.0060
  send_advert_interval_hours: 10

mesh:
  global_flood_allow: true

radio:
  frequency: 915000000  # US frequency
  tx_power: 20
  bandwidth: 62500
  spreading_factor: 8
  coding_rate: 8

sx1262:
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16

duty_cycle:
  enforcement_enabled: false

letsmesh:
  enabled: true
  iata_code: "NYC"
  broker_index: 1  # US broker
  status_interval: 60
  disallowed_packet_types:
    - TRACE
    - ACK

logging:
  level: INFO
```

### Home Assistant Integration

```yaml
repeater:
  node_name: "home-mesh-repeater"

radio:
  frequency: 869618000
  tx_power: 14

sx1262:
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16

storage:
  mqtt:
    enabled: true
    broker: "192.168.1.100"  # Home Assistant IP
    port: 1883
    username: "mqtt_user"
    password: "mqtt_password"
    base_topic: "meshcore/repeater"

logging:
  level: INFO
```

---

## Configuration Tips

### 🔧 Hardware Setup
1. Verify GPIO pin numbers match your hardware (use BCM numbering)
2. Ensure SPI is enabled: `sudo raspi-config` → Interface Options → SPI
3. Test radio connection before deploying

### 📡 Radio Tuning
1. All nodes must use **identical** radio settings
2. Lower spreading factor = faster but shorter range
3. Higher TX power = longer range but more power draw
4. Balance bandwidth vs. range for your deployment

### 🌐 Network Integration
1. Start with local MQTT disabled, enable after testing
2. Use LetsMesh for cloud monitoring and analytics
3. Filter unnecessary packet types to reduce bandwidth

### 🔒 Security
1. Keep your identity file secure (contains private key)
2. Use strong passwords for MQTT authentication
3. Consider firewall rules for web interface

### 📊 Monitoring
1. Use `INFO` level for normal operation
2. Switch to `DEBUG` when troubleshooting
3. Monitor SQLite database size and clean up old data
4. Check duty cycle compliance in regulated regions

---

## Troubleshooting

### Repeater won't start
- Check GPIO pin configuration
- Verify SPI is enabled
- Check logs: `journalctl -u pymc-repeater -f`

### No packets received
- Verify radio settings match network
- Check frequency is correct for region
- Ensure antenna is properly connected

### LetsMesh not connecting
- Verify internet connectivity
- Check `broker_index` (0=EU, 1=US)
- Ensure `iata_code` is set
- Look for JWT token errors in logs
- Check if you can access https://analyzer.letsmesh.sh from the same network as the Pi

### High CPU usage
- Reduce `logging.level` from DEBUG to INFO
- Check for excessive packet traffic
- Monitor duty cycle enforcement

---

## Additional Resources

- [GitHub Repository](https://github.com/rightup/pyMC_Repeater)
- [MeshCore Protocol Documentation](https://github.com/rightup/pyMC_core)
- [LetsMesh Dashboard](https://analyzer.letsmesh.sh/)

---

**Configuration Version:** Compatible with pyMC Repeater v1.0.5+ (or current dev branch)
