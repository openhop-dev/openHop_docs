---
title: Hardware Setup
description: Supported openHop Repeater hardware and radio backend notes.
sidebar:
  order: 6
---

openHop Repeater supports more than just a Raspberry Pi with a GPIO-connected SX1262. The current repo supports five active backend classes plus a no-radio mode:

- Native `sx1262` over Linux SPI and host GPIO
- `sx1262_ch341` over a CH341 USB-SPI adapter
- `kiss` using a serial KISS TNC instead of GPIO radio control
- `modem_usb` using a USB serial modem running openHop Modem firmware
- `modem_tcp` using a network modem running openHop Modem firmware
- `null` or `none` when you want the daemon without RF hardware

## Supported hardware families

The repo currently includes named radio presets for families such as:

- HackerGadgets uConsole LoRa module variants
- PiMesh 1W variants
- Frequency Labs `meshadv-mini` and `meshadv`
- Zebra and Zebra Duo HAT variants
- NebraHat and NebraDuo variants
- Femtofox 1W/2W
- PineDio
- RAK6421/RAK13300 slot variants
- Zindello Industries UltraPeater and UltraPeaterZero variants
- Waveshare SX1262 SPI HAT
- CH341 USB-SPI + SX1262 combinations

Heltec `HT-RA62` and generic SX1262/E22-class hardware may work through custom
configuration, but they are not named presets in the current preset file.

For non-GPIO modem-style transports, use [KISS Setup](/projects/openhop-repeater/kiss-setup/) or [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/).

## Backend selection

Choose the backend with the top-level `radio_type` in `/etc/openhop_repeater/config.yaml`.

```yaml
radio_type: sx1262
```

Supported values:

- `sx1262`
- `sx1262_ch341`
- `kiss`
- `modem_usb`
- `modem_tcp`
- `null` or `none`

For `sx1262_ch341`, `modem_usb`, `modem_tcp`, or `null`, complete the initial
choice in `/setup`. After onboarding, use **System → Configuration → Radio →
Radio Hardware** or edit the config directly, then restart Repeater.

## Native SX1262 wiring

For a direct Linux SPI host, `sx1262` pins are host GPIO values.

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

Typical Raspberry Pi SPI pins:

| Function | Raspberry Pi pin |
| --- | --- |
| MOSI | GPIO 10 / pin 19 |
| MISO | GPIO 9 / pin 21 |
| SCK | GPIO 11 / pin 23 |
| CS | Usually GPIO 21 or board-specific |

## CH341 USB-SPI hosts

When `radio_type: sx1262_ch341` is selected:

- `sx1262` pin values are CH341 GPIO numbers `0-7`
- the adapter VID/PID is configured under `ch341:`
- host USB permissions matter more than SPI kernel overlays
- with multiple adapters, set `ch341.bus` and `ch341.address`, and/or
  `ch341.serial_number` when the adapter exposes one; VID/PID alone cannot
  distinguish identical devices. Recheck USB addresses after reconnects.

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

This CH341 snippet is a **wiring fragment**, not a runnable full configuration.
Also supply `sx1262.bus_id`, `cs_id`, `txen_pin`, and `rxen_pin` (use `-1` only
for unused enable pins), plus the complete required `radio` air settings from the
[Configuration Reference](/projects/openhop-repeater/config-file/#radio-parameters).
A native SX1262 host likewise needs both complete hardware and air sections.

For a common E22 mapping, the repo README uses:

| Function | CH341 GPIO |
| --- | --- |
| CS | 0 |
| RXEN | 1 |
| Reset | 2 |
| Busy | 4 |
| IRQ | 6 |

## openHop USB modem hosts

When `radio_type: modem_usb` is selected:

- the modem presents itself as a USB serial device such as `/dev/ttyACM0`
- the modem firmware handles the LoRa radio
- the repeater still owns node behavior, API, dashboard, MQTT, GPS, and identities

Minimal transport block:

```yaml
radio_type: modem_usb

modem_usb:
  port: "/dev/ttyACM0"
  baudrate: 921600
  lbt_enabled: true
  lbt_max_attempts: 5
```

## openHop TCP modem hosts

When `radio_type: modem_tcp` is selected:

- the modem runs on another board and exposes a TCP service over LAN, Wi-Fi, or Ethernet
- replace the example host before starting the service
- set the modem LAN IP or actual board-specific mDNS name under `modem_tcp.host`

Minimal transport block:

```yaml
radio_type: modem_tcp

modem_tcp:
  host: "REPLACE_WITH_MODEM_HOST"
  port: 5055
  token: ""
  connect_timeout: 5.0
  lbt_enabled: true
  lbt_max_attempts: 5
```

If you do not have RF hardware on this host at all, use `radio_type: null` and skip modem sections entirely.

## Multiple radios

A nonempty top-level `radios:` list builds an RF Fabric stack instead of the
legacy single-radio configuration. Each entry needs a unique `id`, its backend,
air settings, and hardware/transport settings. This requires Core with RF Fabric
support. See the commented multi-radio examples in the
[canonical config](https://github.com/openhop-dev/openhop_repeater/blob/dev/config.yaml.example).

- Give native radios distinct chip-select/control pins and CH341 radios distinct
  USB selectors; do not let two entries open the same hardware.
- Omitted sections inherit the top-level section. Per-entry mapping sections
  **shallow-overlay keys**, so a frequency-only override retains other air
  settings. Explicit `false`/`null` override inherited values, and a non-mapping
  section replaces the whole section (possibly making it invalid). See the
  [overlay reference](/projects/openhop-repeater/config-file/#multi-radio-and-rf-fabric).
- With ingress-aware Core, `default` uses the default radio, `sticky` uses the
  packet's own ingress radio, and `bridge` selects another radio. Locally
  originated traffic uses the default radio unless originated fan-out is enabled.
  Older Core versions fall back to most recent RX at send time; with three or
  more radios, ordinary bridge selects the first other radio, not all of them.
- `fabric.use_fabric: true` can wrap a single radio too. Put this key under
  `fabric`, not inside the `radios` sequence.
- The dashboard has a multi-radio editor; the legacy terminal helper does not.
  To isolate software without RF, remove the active `radios` list from the
  diagnostic config as well as selecting top-level `radio_type: null`.

### Dashboard RF Fabric workflow

1. Back up first and keep an unverified installation in `no_tx`. Open **System →
   Configuration → Radio → Radio Hardware**, then **Enable multi-radio**.
   This creates a local draft, not a saved config.
2. Use the **Currently editing** selector or radio cards to configure each
   radio's **Over-the-air settings** and **Hardware**. Set unique hardware
   endpoints/pins and complete air parameters, including MeshCore `sync_word:
   0x12` for modems. **HW ready** is form readiness, not a successful device probe.
   Use **Add radio id → Add radio** only when another radio is needed; do not
   clone an endpoint that is already in use.
3. Set **Default TX radio** and **Fabric TX mode**. Despite the sticky option's
   “last RX” label, ingress-aware Core uses each packet's own ingress. Start
   with normal bridge behavior for a two-radio local/link deployment.
4. Optionally enable **RF relay fan-out → Repeat on ingress** for **exactly two
   radios** in **bridge** mode: RX local → TX link then local; RX link → TX local
   then link. For node-originated adverts, room-server/companion traffic, and
   protocol replies, choose **Originated traffic TX → all — send on every radio**
   only if both channels need it. This also requires exactly two radios but does
   not require bridge. Defaults are repeat off and originated `default`.
5. Click **Save multi-radio config** for a membership draft, or **Save Changes**
   for existing settings. Resolve any duplicate hardware/validation error before
   retrying. Nothing is written until save succeeds. Accept the restart prompt
   only after success; saving fan-out does not change the running stack. If the
   page says **Saved fan-out settings are not live yet — restart to apply them**,
   restart and reconnect before judging behavior.
6. Confirm both radios initialize without reconnect loops in **Analytics → Logs**
   or service logs. Use **Analytics → Statistics**, **RF Health Correlation**, and
   **Neighbour Links** with the appropriate radio selected. Inspect packet RX/TX
   attribution in the archive. Verify normal reception before enabling TX or
   sending an advert; every deliberate test transmission consumes airtime.

Fan-out runs packet validation/deduplication/path changes once, then serializes
physical sends. Each radio's duty-cycle gate can refuse its send independently;
one successful send does not prove the other succeeded. Node totals count a
relay once, whereas per-radio totals count physical sends. Keep fan-out disabled
unless the measured coverage benefit justifies added airtime. To undo an
unsaved edit use **Cancel**; **Disable multi-radio** is staged until saving and
requires a restart too.

## Board-specific notes

### uConsole

- Uses SPI1 in the current preset set
- Requires its own overlay and GPS/RTC host setup

### meshadv / HT-RA62 / E22-class boards

- Often require `use_dio3_tcxo: true`
- Some also require `use_dio2_rf: true`
- Some newer presets also require `use_gpiod_backend: true` and `gpio_chip: 1`
- The current `meshadv-mini` preset explicitly enables both DIO3 TCXO control and
  DIO2 RF-switch control. Reapply the current preset or set both flags after an
  upgrade if an older config was copied forward.

### Waveshare SPI HAT

- Supported only in SPI form, not UART variants
- No longer the recommended default hardware in the upstream README

## Verifying hardware access

### Native SPI

```bash
ls /dev/spidev*
```

You should see a device such as `/dev/spidev0.0`.

### CH341

```bash
lsusb -d 1a86:5512
```

The host must expose the USB adapter with the correct permissions before the repeater can use it.

### Service logs

```bash
journalctl -u openhop-repeater -f
```

If the hardware setup is wrong, this is the first place to look.

## Radio configuration helper

The standard install directs you to browser onboarding. The optional legacy
terminal helper offers SX1262 presets (including CH341) and KISS:

```bash
sudo bash setup-radio-config.sh /etc/openhop_repeater
```

Use it to apply an SX1262/CH341 preset or write KISS serial settings. Its text
substitutions can also affect unrelated same-named keys; back up first and check
GPS/HTTP ports and board-specific fields afterward. Prefer the browser for normal
reconfiguration. After onboarding, configure `modem_usb`, `modem_tcp`, and `null`
through **System → Configuration → Radio → Radio Hardware** or by editing the
config directly, then restart Repeater.

## Related pages

- [Installation](/projects/openhop-repeater/installation/)
- [Configuration Reference](/projects/openhop-repeater/config-file/)
- [openHop USB/TCP Setup](/projects/openhop-repeater/openhop-usb-and-tcp-setup/)
- [KISS Setup](/projects/openhop-repeater/kiss-setup/)
- [Troubleshooting](/projects/openhop-repeater/troubleshooting/)

## Implementation references

- [Radio factory, shallow overlays, and RF Fabric validation](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/config.py)
- [Ingress routing, overlay, and fan-out regressions](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/tests/test_multi_radio_stack.py)
- [Dashboard hardware editor and saved/live fan-out state](https://github.com/openhop-dev/openHop_RepeaterUI/blob/334e302cc9eff1f6c08ab4093bd5599f58861715/src/components/configuration/RadioHardwareSettings.vue)
