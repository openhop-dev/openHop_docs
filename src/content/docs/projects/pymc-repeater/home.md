---
title: Documentation Home
---

# pyMC Repeater Documentation

Welcome to the **pyMC Repeater** documentation. Comprehensive guides for setting up, configuring, and operating your LoRa mesh network repeater.

---

## Quick Start

New to pyMC Repeater? Start here:

1. **[Installation Guide](installation)** - Get your repeater up and running
2. **[Hardware Setup](hardware-setup)** - Connect your LoRa radio module
3. **[Configuration Guide](config-file)** - Configure your repeater settings
4. **[First Boot](first-boot)** - Verify everything works *(coming soon)*

---

## Documentation

### Setup & Configuration
- **[Configuration Reference](config-file)** - Complete `config.yaml` documentation
- [Hardware Setup](hardware-setup) - GPIO wiring and hardware configuration
- [Radio Settings](config-file#radio-configuration) - LoRa parameter tuning guide
- [Network Planning](network-planning) - Deployment best practices *(coming soon)*

### Features
- [Web Dashboard](web-dashboard) - Using the built-in web interface *(coming soon)*
- [LetsMesh Integration](config-file#letsmesh-integration) - Cloud monitoring setup
- [MQTT Publishing](config-file#local-mqtt-publishing) - Local MQTT broker integration
- [Transport Keys](transport-keys) - Advanced flood control *(coming soon)*

### Operation
- [Monitoring & Logs](troubleshooting#quick-diagnostics) - System health and diagnostics
- [Troubleshooting](troubleshooting) - Common issues and solutions
- [Performance Tuning](performance-tuning) - Optimization tips *(coming soon)*
- [Upgrading](installation#upgrading) - Update to latest version

### Advanced Topics
- [Duty Cycle Management](config-file#duty-cycle-management) - Regulatory compliance
- [Database Management](config-file#storage-and-data-management) - SQLite and RRD data
- [API Reference](api-reference) - HTTP API endpoints *(coming soon)*
- [Development](development) - Contributing to the project *(coming soon)*

---

## Hardware Support

pyMC Repeater supports various LoRa hardware:

- **Raspberry Pi** (Zero W, 3, 4, 5) + SX1262 modules
- **Waveshare LoRa HAT** (SX1262)
- **Custom SX1262 boards** via GPIO configuration

See [Hardware Compatibility](hardware-setup#hardware-compatibility-list) for full list.

---

## Community & Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/rightup/pyMC_Repeater/issues)
- **Discussions**: [Ask questions and share ideas](https://github.com/rightup/pyMC_Repeater/discussions)
- **LetsMesh Network**: [View live network map](https://analyzer.letsmesh.sh/)

---

## Key Resources

### Essential Guides
- **[Configuration Reference](config-file)**  - Complete config.yaml guide
- [Installation](installation) - Step-by-step setup
- [Troubleshooting](troubleshooting) - Fix common issues

### Related Projects
- [pyMC_core](https://github.com/rightup/pyMC_core) - MeshCore protocol library
- [pyMC_API](https://github.com/rightup/pyMC_API) - REST API server
- [MeshCore](https://github.com/rightup/MeshCore) - Embedded firmware

---

## What's New

**Latest Release: v1.0.5**
- JWT token refresh for LetsMesh (no more disconnections!)
- Improved configuration merge on upgrade
- Enhanced trace packet handling
- Performance optimizations

See [Changelog](changelog) for full release history.

---

## Quick Links

| Topic | Description |
|-------|-------------|
| [Configuration](config-file) | Complete config.yaml reference |
| [Installation](installation) | Install pyMC Repeater |
| [Hardware Setup](hardware-setup) | Wire your LoRa module |
| [Troubleshooting](troubleshooting) | Common issues & fixes |
| [API Reference](api-reference) | HTTP API documentation *(coming soon)* |
| [LetsMesh Setup](letsmesh-integration) | Cloud monitoring |

---

## Getting Help

Having issues? Check these resources:

1. **[Troubleshooting Guide](troubleshooting)** - Common problems and solutions
2. **[Configuration Reference](config-file)** - Verify your settings
3. **[GitHub Issues](https://github.com/rightup/pyMC_Repeater/issues)** - Search existing issues
4. **System Logs**: `journalctl -u pymc-repeater -f` - View real-time logs

---

**Project Maintained by**: [rightup](https://github.com/rightup)  
**License**: See [LICENSE](https://github.com/rightup/pyMC_Repeater/blob/main/LICENSE)  
**Version**: Compatible with pyMC Repeater v1.0.5+
