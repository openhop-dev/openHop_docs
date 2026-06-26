---
title: Firmware Flasher
description: Flash openHop Modem firmware with the browser-based Web Serial flasher.
---

# openHop Modem Firmware Flasher

The openHop Modem Flasher is a static browser app that flashes supported modem firmware over Web Serial. It does not require a local flashing server; the browser talks directly to the device.

Open the flasher here:

[https://flasher.openhop.dev/](https://flasher.openhop.dev/)

Source repository:

[https://github.com/openhop-dev/openHop-Modem-Flasher](https://github.com/openhop-dev/openHop-Modem-Flasher)

## Browser requirements

Use a browser with Web Serial support, such as Chrome, Edge, or Chromium. The site must be served over HTTPS, which the hosted flasher already does.

## Firmware source

The flasher reads most modem firmware files from:

[https://github.com/openhop-dev/openhop_modem/tree/main/firmware](https://github.com/openhop-dev/openhop_modem/tree/main/firmware)

ESP32-family firmware variants use this layout:

| File | Flash offset | Used for |
| --- | --- | --- |
| `bootloader.bin` | `0x0` | Erase/full flash |
| `partitions.bin` | `0x8000` | Erase/full flash |
| `firmware.bin` | `0x10000` | Normal update and erase/full flash |

nRF52 variants use a `firmware.zip` DFU package.

## Flash a device

1. Connect the modem board to your computer over USB.
2. Open [flasher.openhop.dev](https://flasher.openhop.dev/).
3. Select the exact device model.
4. Select the openHop Modem firmware role/version shown by the flasher.
5. Click the browser serial connect button and choose the board's serial port.
6. Click **Flash** for a normal firmware update.
7. Use **Erase Device** only for a first install, a corrupted device, or when changing layouts.

Do not disconnect the board while flashing. After a successful flash, reset or power-cycle the board if it does not reboot automatically.

## Which flash action to choose

| Action | Meaning | When to use |
| --- | --- | --- |
| Flash | Writes the application firmware at `0x10000`. | Normal updates on a board that already has a compatible bootloader and partition table. |
| Erase Device | Erases and writes the full flash set, such as bootloader, partitions, and firmware. | Fresh installs, recovery, or switching a board from another firmware layout. |

## Board bootloader notes

Some ESP32-family boards enter download mode automatically. If the browser cannot connect or flashing fails before transfer starts, put the board into bootloader mode manually:

- Many ESP32 boards: hold **BOOT**, tap **RESET**, release **RESET**, then release **BOOT**.
- Some XIAO ESP32 boards: double-tap reset or hold the boot button while plugging in USB.
- WaveShare ESP32-P4-Nano: use the native USB-Serial-JTAG USB-C port for flashing, not the CH343P debug UART port.

## After flashing

For USB-CDC deployments, connect the board to the Repeater host and configure `radio_type: pymc_usb`.

For Wi-Fi or Ethernet deployments:

1. Connect to the device setup AP if this is the first boot.
2. Open `http://192.168.4.1`.
3. Save Wi-Fi credentials and restart.
4. Find the assigned hostname/IP.
5. Configure Repeater with `radio_type: pymc_tcp`.

See [Repeater Integration](/projects/openhop-modem/repeater-integration/) for the Repeater config blocks.

## Troubleshooting

- If no serial port appears, try another USB cable and confirm it is a data cable.
- If flashing starts but fails, lower the baud rate if the flasher exposes that option.
- If the board will not enter download mode, use the board-specific boot sequence above.
- If the modem is on Wi-Fi but Repeater cannot connect, verify `curl -u admin:password http://<modem-host>/api/stats` and TCP port `5055` from the Repeater host.
