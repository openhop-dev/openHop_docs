---
title: Troubleshooting
---

# Troubleshooting Guide

Common issues and solutions for pyMC Repeater.

---

## Quick Diagnostics

```bash
# Check service status
sudo systemctl status pymc-repeater

# View recent logs
journalctl -u pymc-repeater -n 100

# Live log monitoring
journalctl -u pymc-repeater -f

# Check configuration
yq eval '.' /etc/pymc_repeater/config.yaml

# Verify SPI
ls -l /dev/spidev*
```

---

## Service Issues

### Service Won't Start

**Symptoms:**
```
● pymc-repeater.service - failed
```

**Check logs:**
```bash
journalctl -u pymc-repeater -n 50
```

**Common causes:**

1. **SPI Not Enabled**
   ```bash
   sudo raspi-config
   # Interface Options → SPI → Enable
   sudo reboot
   ```

2. **Wrong GPIO Configuration**
   - Verify `sx1262` section in `/etc/pymc_repeater/config.yaml`
   - Check BCM pin numbers match your hardware

3. **Missing Dependencies**
   ```bash
   cd /opt/pymc_repeater
   sudo pip install --break-system-packages -e .
   ```

4. **Permission Issues**
   ```bash
   sudo chown -R repeater:repeater /opt/pymc_repeater /etc/pymc_repeater /var/lib/pymc_repeater
   sudo usermod -a -G gpio,spi repeater
   ```

### Service Crashes/Restarts

**Check for issues:**
```bash
# Recent crashes
journalctl -u pymc-repeater --since "1 hour ago"

```

**Solutions:**
- Reduce `logging.level` from DEBUG to INFO
- Add cooling (heatsink/fan)
- Check power supply capacity
- Review configuration for errors

---

## Radio/Hardware Issues

### Radio Not Detected

**Error:** `Failed to initialize radio hardware`

**Solutions:**

1. **Verify SPI enabled:**
   ```bash
   lsmod | grep spi
   ls -l /dev/spidev*
   ```

2. **Check GPIO configuration:**
   ```yaml
   sx1262:
     cs_pin: 21
     reset_pin: 18
     busy_pin: 20
     irq_pin: 16
   ```

3. **Test with different pins if custom wiring**

4. **Verify 3.3V power to module**

5. **Check for loose connections**

### No Packets Received

**Symptoms:** Service running, but no packets in logs/dashboard

**Check:**

1. **Radio settings match network:**
   ```yaml
   radio:
     frequency: 869618000  # Must match other nodes
     spreading_factor: 8
     bandwidth: 62500
     coding_rate: 8
     sync_word: 13380
   ```

2. **Antenna connected properly**

3. **Check TX power:**
   ```yaml
   radio:
     tx_power: 14  # Try increasing to 20
   ```

4. **Verify other nodes are transmitting**

5. **Check logs for received packets:**
   ```bash
   journalctl -u pymc-repeater 
   ```

### Poor Signal Quality

**Symptoms:** Low RSSI, high packet loss

**Solutions:**

1. **Check antenna:**
   - Proper 868/915 MHz antenna
   - Secure connection
   - Vertical orientation
   - Away from metal

2. **Increase TX power:**
   ```yaml
   radio:
     tx_power: 20  # Maximum for most modules
   ```

3. **Optimize placement:**
   - Higher location
   - Clear line of sight
   - Away from interference sources

4. **Monitor signal:**
   ```bash
   # Watch RSSI/SNR in logs
   journalctl -u pymc-repeater -f | grep -i rssi
   ```

---

## Network/Connectivity Issues

### Can't Access Web Interface

**Check service is running:**
```bash
sudo systemctl status pymc-repeater
```

**Verify port 8000 listening:**
```bash
sudo netstat -tulpn | grep 8000
```

**Test from Pi itself:**
```bash
curl http://localhost:8000
```

**Check firewall (if enabled):**
```bash
sudo ufw status
sudo ufw allow 8000/tcp
```

**Find Pi's IP address:**
```bash
ip add
```

### LetsMesh Not Connecting

**Symptoms:** No status updates on LetsMesh dashboard

**Check configuration:**
```yaml
letsmesh:
  enabled: true
  iata_code: "NYC"  # Set your location code
  broker_index: 0   # 0=EU, 1=US
  status_interval: 60
```

**Verify internet connectivity:**
```bash
ping -c 4 mqtt-eu-v1.letsmesh.net
curl -I https://analyzer.letsmesh.sh
```

**Check logs for errors:**
```bash
journalctl -u pymc-repeater | grep -i letsmesh
```

**Common errors:**

1. **JWT token errors** - Fixed in v1.0.5+
2. **Wrong broker** - Check `broker_index`
3. **Network blocked** - Check firewall for port 443

### MQTT Not Publishing

**Check configuration:**
```yaml
storage:
  mqtt:
    enabled: true
    broker: "localhost"
    port: 1883
```

**Test MQTT broker:**
```bash
# Install mosquitto-clients
sudo apt-get install mosquitto-clients

# Subscribe to test
mosquitto_sub -h localhost -t "meshcore/#" -v
```

**Check broker running:**
```bash
sudo systemctl status mosquitto
```

---

## Configuration Issues

### Invalid YAML Syntax

**Error:** `Error parsing config.yaml`

**Test syntax:**
```bash
yq eval '.' /etc/pymc_repeater/config.yaml
```

**Common mistakes:**
- Missing colons after keys
- Wrong indentation (use 2 spaces)
- Tabs instead of spaces
- Unquoted special characters

### Configuration Not Applied

**After editing config, restart service:**
```bash
sudo systemctl restart pymc-repeater
```

**Verify config loaded:**
```bash
journalctl -u pymc-repeater -n 50 | grep -i config
```

### Settings Reverting After Upgrade

**Use manage script for upgrades:**
```bash
sudo bash manage.sh upgrade
```

This preserves your configuration while adding new options.

---

## Performance Issues

### High CPU Usage

**Check current usage:**
```bash
top -u repeater
```

**Common causes:**

1. **DEBUG logging**
   ```yaml
   logging:
     level: INFO  # Change from DEBUG
   ```

2. **High packet rate** - Normal for busy networks

3. **Database operations** - Check SQLite file size

**Monitor:**
```bash
# CPU temperature
vcgencmd measure_temp

# Process stats
ps aux | grep repeater
```

### High Memory Usage

**Check memory:**
```bash
free -h
```

**Solutions:**
- Reduce `repeater.cache_ttl`
- Clean up old database records
- Restart service periodically

### Disk Space Issues

**Check disk usage:**
```bash
df -h
du -sh /var/lib/pymc_repeater/*
```

**Clean up old data:**
```yaml
storage:
  retention:
    sqlite_cleanup_days: 7  # Reduce from 31
```

**Manual cleanup:**
```bash
# Delete old SQLite records
sqlite3 /var/lib/pymc_repeater/repeater.db "DELETE FROM packets WHERE timestamp < strftime('%s', 'now', '-7 days')"

# Vacuum database
sqlite3 /var/lib/pymc_repeater/repeater.db "VACUUM"
```

---

## Upgrade Issues

### Config Merge Errors

**Symptoms:** Configuration lost or broken after upgrade

**Solution:**
```bash
# Restore from backup
sudo cp /etc/pymc_repeater.backup.*/config.yaml /etc/pymc_repeater/

# Restart service
sudo systemctl restart pymc-repeater
```

**Manual merge:**
```bash
# Compare old and new
diff /etc/pymc_repeater.backup.*/config.yaml /etc/pymc_repeater/config.yaml.example
```

### Service Fails After Upgrade

**Check Python dependencies:**
```bash
cd /opt/pymc_repeater
sudo pip install --break-system-packages -e . --force-reinstall
```

**Verify systemd service:**
```bash
sudo systemctl daemon-reload
sudo systemctl restart pymc-repeater
```

---

## Data/Database Issues

### Database Corruption

**Symptoms:** Service crashes, database errors in logs

**Check integrity:**
```bash
sqlite3 /var/lib/pymc_repeater/repeater.db "PRAGMA integrity_check"
```

**Backup and repair:**
```bash
# Stop service
sudo systemctl stop pymc-repeater

# Backup
sudo cp /var/lib/pymc_repeater/repeater.db /var/lib/pymc_repeater/repeater.db.backup

# Repair
sqlite3 /var/lib/pymc_repeater/repeater.db ".recover" | sqlite3 /var/lib/pymc_repeater/repeater_new.db
sudo mv /var/lib/pymc_repeater/repeater_new.db /var/lib/pymc_repeater/repeater.db

# Restart
sudo systemctl start pymc-repeater
```

### Missing Statistics

**Symptoms:** No RRD graphs, missing historical data

**Check RRD files:**
```bash
ls -lh /var/lib/pymc_repeater/*.rrd
```

**Recreate if missing:**
```bash
# Service will auto-create on next start
sudo systemctl restart pymc-repeater
```

---

## Getting More Help

### Enable Debug Logging

```yaml
logging:
  level: DEBUG
```

```bash
sudo systemctl restart pymc-repeater
journalctl -u pymc-repeater -f
```

**⚠️ Remember to set back to INFO after debugging**

### Collect Diagnostic Info

```bash
# System info
uname -a
cat /etc/os-release

# Service status
sudo systemctl status pymc-repeater

# Recent logs
journalctl -u pymc-repeater -n 200 > pymc-repeater.log

# Configuration
cat /etc/pymc_repeater/config.yaml > config.txt

# Hardware
gpio readall
ls -l /dev/spidev*
```

### Report Issues

When reporting issues on [GitHub](https://github.com/rightup/pyMC_Repeater/issues):

1. **Describe the problem** clearly
2. **Include logs** (use DEBUG level)
3. **Share configuration** (remove sensitive data)
4. **List hardware** (Pi model, LoRa module)
5. **Mention version** (`cat /opt/pymc_repeater/pyproject.toml`)

---

## Additional Resources

- [Configuration Reference](config-file)
- [Hardware Setup](hardware-setup)
- [GitHub Issues](https://github.com/rightup/pyMC_Repeater/issues)
- [GitHub Discussions](https://github.com/rightup/pyMC_Repeater/discussions)
