---
title: Hardware Setup
---

# Hardware Setup Guide

Complete guide to connecting your SX1262 LoRa module to your Raspberry Pi.

---

## Overview

pyMC Repeater requires an SX1262 LoRa radio module connected via SPI. This guide covers GPIO wiring, supported hardware, and configuration.

---

## Supported Hardware

### Raspberry Pi Models
- **Raspberry Pi Zero W** - Compact, low power
- **Raspberry Pi 3** - Good balance of performance and power
- **Raspberry Pi 4** - Best performance
- **Raspberry Pi 5** - Latest, most powerful

### LoRa Modules (SX1262)
- **Waveshare LoRa HAT** - Direct plug-and-play
- **Ebyte E22** series modules
- **Generic SX1262 breakout boards**
- **Custom boards** with SX1262 chipset

---

## GPIO Pin Mapping

### Standard Configuration (BCM Numbering)

| Function | GPIO (BCM) | Physical Pin |
|----------|------------|--------------|
| CS (Chip Select) | GPIO 21 | Pin 40 |
| RESET | GPIO 18 | Pin 12 |
| BUSY | GPIO 20 | Pin 38 |
| IRQ (DIO1) | GPIO 16 | Pin 36 |
| MOSI (SPI) | GPIO 10 | Pin 19 |
| MISO (SPI) | GPIO 9 | Pin 21 |
| SCK (SPI) | GPIO 11 | Pin 23 |
| GND | GND | Pin 6, 9, 14, 20, etc. |
| 3.3V | 3.3V | Pin 1 or 17 |

### Optional Pins

| Function | GPIO (BCM) | Usage |
|----------|------------|-------|
| TXEN | -1 (disabled) | TX enable (some modules) |
| RXEN | -1 (disabled) | RX enable (some modules) |
| TX LED | -1 (disabled) | TX activity indicator |
| RX LED | -1 (disabled) | RX activity indicator |

---

## Wiring Diagrams

### Waveshare LoRa HAT

The Waveshare SX1262 HAT plugs directly onto the Raspberry Pi GPIO header. No wiring required!

**Default Pin Configuration:**
```yaml
sx1262:
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16
```

### Generic SX1262 Module

For generic modules, wire as follows:

```
SX1262 Module          Raspberry Pi
─────────────          ────────────
VCC (3.3V)     ──────  Pin 1 (3.3V)
GND            ──────  Pin 6 (GND)
MOSI           ──────  Pin 19 (GPIO 10)
MISO           ──────  Pin 21 (GPIO 9)
SCK            ──────  Pin 23 (GPIO 11)
NSS/CS         ──────  Pin 40 (GPIO 21)
RESET          ──────  Pin 12 (GPIO 18)
BUSY           ──────  Pin 38 (GPIO 20)
DIO1/IRQ       ──────  Pin 36 (GPIO 16)
```

**⚠️ Important:** 
- Never connect 5V to the module (will damage it)
- Double-check pin numbers before powering on
- Use short wires to minimize interference

---

## Configuration

### Basic Configuration

Edit `/etc/pymc_repeater/config.yaml`:

```yaml
sx1262:
  # SPI bus configuration
  bus_id: 0
  cs_id: 0
  
  # GPIO pins (BCM numbering)
  cs_pin: 21
  reset_pin: 18
  busy_pin: 20
  irq_pin: 16
  
  # Optional features
  txen_pin: -1
  rxen_pin: -1
  txled_pin: -1
  rxled_pin: -1
  
  # Hardware flags
  use_dio3_tcxo: false
  is_waveshare: false
```

### Waveshare HAT Configuration

If using Waveshare HAT, enable the flag:

```yaml
sx1262:
  is_waveshare: true
  use_dio3_tcxo: false
```

### Custom Pin Configuration

If using different GPIO pins:

```yaml
sx1262:
  cs_pin: 8     # Your custom CS pin
  reset_pin: 25 # Your custom RESET pin
  busy_pin: 24  # Your custom BUSY pin
  irq_pin: 23   # Your custom IRQ pin
```

---

## Antenna Connection

### Antenna Types

**868 MHz (EU):**
- Quarter-wave: ~8.2 cm
- Half-wave: ~16.4 cm
- Commercial 868 MHz antennas

**915 MHz (US/AU):**
- Quarter-wave: ~7.8 cm
- Half-wave: ~15.6 cm
- Commercial 915 MHz antennas

### Connection

1. **Use proper connector** - Usually U.FL or SMA
2. **Check polarity** - Match antenna to module connector
3. **Secure connection** - Loose connections reduce range
4. **Never transmit without antenna** - Can damage radio!

### Antenna Placement

- **Vertical orientation** for best omni-directional coverage
- **Clear line of sight** when possible
- **Away from metal objects** (at least 5-10 cm)
- **Higher is better** for maximum range

---

## Testing Hardware

### Check SPI is Enabled

```bash
ls -l /dev/spidev*
```

Should show:
```
/dev/spidev0.0
/dev/spidev0.1
```

### Verify GPIO Access

```bash
# As repeater user
sudo -u repeater gpio readall
```

### Test Service Start

```bash
sudo systemctl start pymc-repeater
sudo systemctl status pymc-repeater
```

Check logs for radio initialization:
```bash
journalctl -u pymc-repeater -n 50 | grep -i radio
```

Should see:
```
Radio hardware initialized
Radio config - Freq: 869.6MHz
Radio config - SF: 8
```

---

## Common Hardware Issues

### Radio Not Detected

**Symptoms:** Service fails with "Radio initialization failed"

**Solutions:**
1. Verify SPI is enabled: `lsmod | grep spi`
2. Check GPIO pin numbers in config
3. Verify physical connections
4. Try reseating the HAT or checking wire connections
5. Check module has power (3.3V)

### Poor Signal/No Reception

**Symptoms:** Low RSSI, no packets received

**Solutions:**
1. Check antenna connection
2. Verify antenna matches frequency (868/915 MHz)
3. Move antenna away from metal objects
4. Try different antenna orientation
5. Check TX power setting in config

### Intermittent Connection

**Symptoms:** Radio works then stops

**Solutions:**
1. Check for loose connections
2. Verify power supply is adequate (2.5A+ for Pi 4)
3. Check for overheating (add heatsinks/cooling)
4. Review logs for error patterns
5. Check duty cycle limits aren't being hit

### Wrong Frequency Detection

**Symptoms:** "Frequency mismatch" errors

**Solutions:**
1. Verify `radio.frequency` in config matches antenna
2. Check regional regulations
3. Ensure all network nodes use same frequency

---

## Hardware Compatibility List

### Tested Configurations

| Raspberry Pi | LoRa Module | Status | Notes |
|--------------|-------------|--------|-------|
| Pi Zero W | Waveshare HAT | ✅ | supported |
| Pi 3B+ | Waveshare HAT | ✅ | Supported|
| Pi 4 (2GB) | Waveshare HAT | ✅ | Best performance |
| Pi 4 (4GB+) | Waveshare HAT | ✅ | Overkill but works |
| Pi 5 | Waveshare HAT | ✅ | Latest hardware |
| Pi 3B | Generic SX1262 | ✅ |
| Pi Zero W | Ebyte E22 | ✅ | 

### Power Requirements

| Model | Idle | Active (TX) | Recommended PSU |
|-------|------|-------------|-----------------|
| Pi Zero W | ~120 mA | ~200 mA | 1A |
| Pi 3B+ | ~400 mA | ~600 mA | 2.5A |
| Pi 4 | ~600 mA | ~900 mA | 3A |
| Pi 5 | ~800 mA | ~1.2A | 5A (USB-C PD) |

---

## Advanced Topics

### TX/RX Enable Pins

Some modules require TXEN/RXEN pins for power amplifier control:

```yaml
sx1262:
  txen_pin: 13  # Enable when transmitting
  rxen_pin: 19  # Enable when receiving
```

### LED Indicators

Add status LEDs:

```yaml
sx1262:
  txled_pin: 5   # Lights when transmitting
  rxled_pin: 6   # Lights when receiving
```

Wire LEDs with current-limiting resistors (~330Ω for 3.3V).

### TCXO Configuration

For modules with DIO3-powered TCXO:

```yaml
sx1262:
  use_dio3_tcxo: true
```

---

## Next Steps

1. **[Configuration Guide](config-file)** - Configure radio parameters
2. **[First Boot](first-boot)** - Test your hardware
3. **[Troubleshooting](troubleshooting)** - Fix common issues

---

## Additional Resources

- [Raspberry Pi GPIO Pinout](https://pinout.xyz/)
- [SX1262 Datasheet](https://www.semtech.com/products/wireless-rf/lora-connect/sx1262)
- [Waveshare Wiki](https://www.waveshare.com/wiki/Main_Page)
