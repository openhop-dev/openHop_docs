---
title: Sensor Manager and Sensors
description: Configure built-in sensors, inspect live readings, and control openHop Modem metric discovery from the dashboard.
sidebar:
  order: 10.5
---

Use **System → Configuration → Maintenance → Sensor Manager** to configure
built-in sensor definitions, and **Monitoring → Sensors** to inspect readings.
These modules run inside Repeater; they are not external application plugins.
The Manager remains available even when monitoring navigation is hidden because
sensor support is disabled. This guide describes current development RepeaterUI;
an older installed frontend may not have these controls.

## Add or change a sensor

1. Open **Sensor Manager → Edit Sensors**. Set **Enable sensor manager** and the
   global **Poll interval (seconds)** deliberately.
2. Click **+ Add Sensor**, choose a **Sensor type**, and give it a unique,
   nonempty **Sensor name** (prefer lowercase letters, numbers, and hyphens).
   Types/settings are loaded from the backend registry, not guessed from the
   connected hardware. There is no automatic I2C bus scan in this editor.
3. Fill the type's settings and click **Add**. For host measurements choose
   `hardware_stats`; for I2C modules check the bus number, device permissions,
   wiring, and actual sensor address. Current types also include INA219, ENS210,
   SHTC3, BME280, Waveshare UPS D/E, and `openhop_modem`.
4. To change an existing definition use its **Edit**, then row **Save**; its
   type is fixed. Use the enabled checkbox to retain a definition without
   polling it, or **Delete** to remove it from the draft. Row Save/Add/Delete
   change only the local draft, not the running service.
5. Click page **Save Changes**. On success the page reloads the saved config and
   offers **Sensor configuration change requires a restart. → Restart now?**
   Restart to rebuild the poller; a successful save alone does not apply the
   definitions live. **Discard** abandons the draft. When leaving with edits,
   use the unsaved-changes dialog rather than assuming navigation saves them.
6. Reconnect and open **Monitoring → Sensors** (or **Manage Sensors** from that
   view to return). Check **Enabled**, **Running**, **Configured / Loaded**,
   **Poll Interval**, each reading's timestamp, and **OK**/**Error** badge.
   A configured entry is not necessarily loaded or producing valid readings.

Dependency installation is separate from enabling a sensor. The YAML controls
`sensors.auto_install_packages` and each definition's
`auto_install_packages`; the editor carries these flags but does not expose a
separate package-install switch. For offline/controlled hosts, provision packages
in advance and explicitly disable automatic installation globally and per
sensor. See the [sensor configuration reference](/projects/openhop-repeater/config-file/#sensors).

## openHop Modem HTTP sensor

Choose `openhop_modem` for diagnostics from the modem's HTTP **`/api/stats`**.
Set **Host**, HTTP **Port** (usually `80`, not radio TCP port `5055`), **Scheme**,
**Endpoint**, Basic-auth **Username**/**Password**, **Poll Interval (s)**, and
**Timeout (s)**. Radio transport and HTTP polling are independent: a USB radio
can still use a network HTTP sensor. Each modem needs its own uniquely named
definition and credentials. Keep credentials private and use a trusted LAN/VPN;
HTTP Basic authentication is not encryption.

The API masks existing sensor passwords. Leave the mask unchanged to preserve
the saved credential; supply a real replacement when changing it. The current
UI tracks a definition's original name through a rename. Do not copy a masked
password into a new sensor and expect it to authenticate.

For Repeater's native GPS endpoint/location behavior, separately configure
`gps.source: modem_http`; a modem sensor alone does not enable it. See
[openHop Modem Repeater Integration](/projects/openhop-modem/repeater-integration/).

### Metric discovery controls

Modem discovery selects bounded numeric/boolean leaves, not the entire JSON
response. It keeps the established flat compatibility fields and adds metric
descriptors (source path, unit, kind, category, availability) for admitted leaves.
Default discovery examines `environment`, `counters`, `measurements`, and
`telemetry`, plus known environmental and radio AGC fields. MCU die temperature
is not environmental temperature; station pressure is not sea-level pressure.

- **Additional metric paths** (`discovery_include_paths`): reviewed **exact JSON
  Pointers**, comma-separated, for example `/radio/agc_reset_count`. This is not
  a wildcard or an instruction to include an arbitrary subtree.
- **Excluded metric paths** (`discovery_exclude_paths`): comma-separated pointers;
  exclude a leaf or its subtree. Exclusions take precedence over inclusion.
- Blank strings mean no additional includes/excludes. Pointer segments escape
  `~` as `~0` and `/` as `~1`. Each list accepts at most 32 pointers; malformed
  paths are rejected on API save. The current add form requires nonempty values
  in its generated fields, including these optional controls; if this blocks a
  blank policy, use the YAML/API reference rather than entering dummy paths.
- Secret-, GPS/location-, network-, and configuration-like paths are denied by
  conservative name checks even when explicitly included. Strings, arrays, and
  arbitrary raw JSON are not discovered. These restrictions apply to discovery,
  not to the established compatibility diagnostic/GPS fields.

Discovery is limited to 512 visited nodes, 64 admitted paths, and five path
segments. `modem_discovery_truncated` indicates a budget limit, not total modem
failure. Admission is stable for that configured sensor instance: a previously
seen metric that disappears, becomes invalid/null, or whose source is unavailable
stays unavailable rather than becoming zero or silently changing identity. The
registry is rebuilt when the sensor instance is recreated (for example restart).

## Readings and groups

**Monitoring → Sensors** groups readings by sensor type and then name. When
metric descriptors exist, values appear in **Measurements**, **Diagnostics**,
**Configuration**, and **Status**; empty groups are omitted. These are reading
categories, not four editing tabs. Configuration values shown here describe the
modem snapshot; change settings in Sensor Manager or the modem's own interface,
not by clicking the reading. Older backends and modules without descriptors
retain a flat grid; mixed payloads can also show **Legacy values**.

Unavailable descriptor values display as unavailable rather than a fabricated
zero. Compare timestamp, source availability, and errors before treating a value
as current. **Refresh** fetches Repeater's cached stats; it does not force a new
hardware poll or restart the manager. The page fetches stats every ten seconds,
independently of each sensor's actual polling interval.

## Troubleshooting and advanced API

- **No data / no readings:** wait for startup and a poll, then verify manager and
  definition enablement, save success, and the required restart.
- **Configured exceeds Loaded:** inspect service logs for an unknown sensor type,
  missing dependency, invalid settings, or device permissions. Do not run the
  service as root to hide an access problem.
- **Modem HTTP errors:** verify HTTP host/port/path and credentials separately
  from the RF connection. `401` indicates HTTP authentication, not the TCP token.
- **Missing discovered field:** inspect its source path/type, include/exclude
  policy, conservative deny rules, availability, and truncation status before
  widening discovery. Never publish the modem's complete response unredacted.

Authenticated API routes are `GET /api/sensors_types`, `GET /api/sensors_config`,
`POST /api/sensors_config_update`, and `POST /api/sensors_read`. The update route
replaces the whole sensor section/definitions list, not a partial field merge;
it returns `saved: true` and `restart_required: true` after successful persistence.
Do not use `POST /api/sensors_config` or infer slash-separated routes from stale
handler comments. `sensors_read` constructs a one-shot manager and reads configured
sensors; it is an active operation, not a passive cached-stat fetch. Use
[API Reference](/projects/openhop-repeater/api-reference/) for automation and
[Security and Authentication](/projects/openhop-repeater/security-and-authentication/)
for administrator-equivalent credentials.

## Implementation references

- [Sensor Manager UI](https://github.com/openhop-dev/openHop_RepeaterUI/blob/334e302cc9eff1f6c08ab4093bd5599f58861715/src/components/configuration/SensorManagerSettings.vue)
- [Sensors view](https://github.com/openhop-dev/openHop_RepeaterUI/blob/334e302cc9eff1f6c08ab4093bd5599f58861715/src/views/Sensors.vue)
- [Sensor API and persistence](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/web/api_endpoints.py)
- [Modem discovery policy](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/sensors/modem_stats_discovery.py)
- [Persistence and route regressions](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/tests/test_sensor_config_persistence.py)
