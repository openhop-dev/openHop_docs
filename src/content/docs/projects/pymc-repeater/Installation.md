---
title: Installation
---

# Installation Guide

Complete guide to installing pyMC Repeater on your Raspberry Pi.

---

## Prerequisites

### Hardware Requirements
- **Raspberry Pi** (Zero W, 3, 4, or 5)
- **SX1262 LoRa Module** (e.g., Waveshare LoRa HAT)
- **MicroSD Card** (8GB minimum, 16GB+ recommended)
- **Power Supply** (appropriate for your Pi model)
- **Antenna** (868/915 MHz depending on region)

### Software Requirements
- **Raspberry Pi OS** (Bookworm or newer recommended)
- **Python 3.9+** (included in recent Pi OS)
- **Internet connection** (for initial setup)

---

## Quick Installation

The easiest way to install pyMC Repeater is using the interactive management script:

```bash
# Clone the repository
git clone https://github.com/rightup/pyMC_Repeater.git
cd pyMC_Repeater

# Run the installer
sudo ./manage.sh install
```

The installer will:
1. Enable SPI interface (with reboot if needed)
2. Install system dependencies
3. Create service user and directories
4. Install Python packages
5. Configure systemd service
6. Launch interactive radio configuration

---

## Manual Installation

If you prefer manual installation or need more control:

### 1. Enable SPI Interface

```bash
sudo raspi-config
# Navigate to: Interface Options → SPI → Enable
```

Or edit `/boot/firmware/config.txt` directly:
```bash
echo "dtparam=spi=on" | sudo tee -a /boot/firmware/config.txt
sudo reboot
```

### 2. Install System Dependencies

```bash
sudo apt-get update
sudo apt-get install -y libffi-dev jq pip python3-rrdtool wget
```

### 3. Install yq (YAML processor)

```bash
YQ_VERSION="v4.40.5"
YQ_BINARY="yq_linux_arm64"  # or yq_linux_amd64 for 64-bit x86
sudo wget -qO /usr/local/bin/yq "https://github.com/mikefarah/yq/releases/download/${YQ_VERSION}/${YQ_BINARY}"
sudo chmod +x /usr/local/bin/yq
```

### 4. Create Service User

```bash
sudo useradd --system --home /var/lib/pymc_repeater --shell /sbin/nologin repeater
sudo usermod -a -G gpio,i2c,spi,dialout repeater
```

### 5. Create Directories

```bash
sudo mkdir -p /opt/pymc_repeater /etc/pymc_repeater /var/log/pymc_repeater /var/lib/pymc_repeater
```

### 6. Copy Files

```bash
sudo cp -r repeater /opt/pymc_repeater/
sudo cp pyproject.toml README.md /opt/pymc_repeater/
sudo cp config.yaml.example /etc/pymc_repeater/config.yaml.example
sudo cp config.yaml.example /etc/pymc_repeater/config.yaml
```

### 7. Install Python Package

```bash
cd /opt/pymc_repeater
sudo pip install --break-system-packages -e .
```

### 8. Install Systemd Service

```bash
sudo cp pymc-repeater.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable pymc-repeater
```

### 9. Configure Permissions

```bash
sudo chown -R repeater:repeater /opt/pymc_repeater /etc/pymc_repeater /var/log/pymc_repeater /var/lib/pymc_repeater
sudo chmod 750 /etc/pymc_repeater /var/log/pymc_repeater /var/lib/pymc_repeater
```

### 10. Configure Radio Settings

Edit `/etc/pymc_repeater/config.yaml` - see [Configuration Guide](config-file) for details.

### 11. Start Service

```bash
sudo systemctl start pymc-repeater
```

---

## Post-Installation

### Verify Installation

Check service status:
```bash
sudo systemctl status pymc-repeater
```

View logs:
```bash
journalctl -u pymc-repeater -f
```

Access web interface:
```
http://<raspberry-pi-ip>:8000
```

### Configure Radio

Run the radio configuration helper:
```bash
cd /path/to/pyMC_Repeater
sudo ./setup-radio-config.sh /etc/pymc_repeater
```

Or edit `/etc/pymc_repeater/config.yaml` manually - see [Configuration Reference](config-file).

### Set Node Identity

Generate a new identity:
```bash
# Identity is auto-generated on first start
# Find it in: /var/lib/pymc_repeater/identity.key
```

Or provide your own:
```yaml
# In config.yaml:
repeater:
  identity_file: "/etc/pymc_repeater/my_identity.key"
```

---

## Upgrading

To upgrade to the latest version:

```bash
cd pyMC_Repeater
git pull
sudo ./manage.sh upgrade
```

The upgrade process preserves your configuration and data.

---

## Uninstalling

To completely remove pyMC Repeater:

```bash
sudo ./manage.sh uninstall
```

This removes all files except a configuration backup in `/tmp/`.

---

## Troubleshooting

### Service won't start

Check logs for errors:
```bash
journalctl -u pymc-repeater -n 50
```

Common issues:
- SPI not enabled → Run `sudo raspi-config`
- Wrong GPIO pins → Check `sx1262` section in config
- Permission errors → Verify service user has correct groups

### No radio detected

Verify SPI is working:
```bash
ls -l /dev/spidev*
# Should show: /dev/spidev0.0 and /dev/spidev0.1
```

Check module is loaded:
```bash
lsmod | grep spi
```

### Can't access web interface

Check service is running:
```bash
sudo systemctl status pymc-repeater
```

Verify port 8000 is listening:
```bash
sudo netstat -tulpn | grep 8000
```

Check firewall rules if using one.

---

## Next Steps

1. **[Hardware Setup](hardware-setup)** - Verify GPIO wiring
2. **[Configuration Guide](config-file)** - Configure your repeater
3. **[First Boot](first-boot)** - Test your installation
4. **[LetsMesh Integration](letsmesh-integration)** - Enable cloud monitoring

---

## Additional Resources

- [Troubleshooting Guide](troubleshooting)
- [Configuration Reference](config-file)
- [GitHub Issues](https://github.com/rightup/pyMC_Repeater/issues)
