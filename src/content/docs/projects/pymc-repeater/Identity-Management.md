---
title: Identity Management
---

# Identity Management Guide

Guide for managing cryptographic identities in pyMC Repeater.

---

## Table of Contents

- [Understanding Identity](#understanding-identity)
- [Automatic Identity Generation](#automatic-identity-generation)
- [Creating Your Own Identity](#creating-your-own-identity)
- [Identity Configuration Methods](#identity-configuration-methods)
- [Verifying Your Identity](#verifying-your-identity)
- [Identity Security Best Practices](#identity-security-best-practices)
- [Troubleshooting Identity Issues](#troubleshooting-identity-issues)

---

## Understanding Identity

Each repeater has a unique cryptographic identity consisting of a private key and derived public key. The identity determines your repeater's node address and enables packet signing.

### Key Components

- **Private Key:** 64-byte (128 hex characters) Ed25519 key used for signing packets
- **Public Key:** Derived from the private key using Ed25519 scalar multiplication
- **Node Address:** The first byte of the public key (0x00-0xFF)

### Why Identity Matters

- **Unique Identification:** Each node has a unique address on the mesh network
- **Packet Signing:** Enables cryptographic verification of packet authenticity
- **Network Trust:** Allows other nodes to verify messages came from your repeater
- **Persistent Identity:** Maintains the same address across restarts

---

## Automatic Identity Generation

If no identity is configured, the repeater automatically generates a new identity on first startup.

### Configuration

```yaml
repeater:
  identity_file: null  # Auto-generate
```

### Behavior

1. On first startup, generates a random 64-byte Ed25519 private key
2. Derives the public key and node address
3. Stores the identity in the storage directory
4. Reuses the same identity on subsequent runs

### When to Use

- Quick testing and development
- Non-production deployments
- When you don't need a specific node address

---

## Creating Your Own Identity

There are two main approaches to creating a custom identity:

### Option 1: Generate a New Random Key

Create a fresh identity file with a cryptographically secure random key.

**Steps:**

```bash
# Generate a random 64-byte key
python3 -c "import secrets; print(secrets.token_hex(64))" > /etc/pymc_repeater/identity.key

# Secure the file permissions
sudo chmod 600 /etc/pymc_repeater/identity.key
sudo chown root:root /etc/pymc_repeater/identity.key
```

**Configure in config.yaml:**

```yaml
repeater:
  identity_file: "/etc/pymc_repeater/identity.key"
```

**Advantages:**
- Full control over key storage location
- Good for new deployments

### Option 2: Import from MeshCore Firmware

If you have a MeshCore firmware device and want your repeater to use that identity (node address), use the `convert_firmware_key.sh` script.

#### Prerequisites

1. Extract the 64-byte private key from your MeshCore firmware device
2. Have sudo access to modify configuration files
3. Python 3 with `yaml` and `nacl` packages installed

#### Script Usage

```bash
cd /path/to/pyMC_Repeater
sudo ./convert_firmware_key.sh <64-byte-hex-key> [config-path]
```

**Parameters:**
- `<64-byte-hex-key>` - The 128 hex character private key from firmware (required)
- `[config-path]` - Path to config.yaml (optional, defaults to `/etc/pymc_repeater/config.yaml`)

#### Complete Example

```bash
# Navigate to pyMC_Repeater directory
cd ~/pyMC_Repeater

# Run the conversion script with your firmware key
sudo ./convert_firmware_key.sh \
  987BDA619630197351F2B3040FD19B2EE0DEE357DD69BBEEE295786FA78A4D5F298B0BF1B7DE73CBC23257CDB2C562F5033DF58C232916432948B0F6BA4448F2 \
  /etc/pymc_repeater/config.yaml
```

#### What the Script Does

1. **Validates** the key format (must be exactly 128 hex characters)
2. **Derives** the public key using Ed25519 scalar multiplication
3. **Calculates** the node address (first byte of public key)
4. **Creates** a timestamped backup of your current config.yaml
5. **Imports** the key into `repeater.identity_key` field
6. **Offers** to restart the repeater service automatically

#### Expected Output

```
=== MeshCore Firmware Key Import ===

Input (64-byte firmware key):
  987BDA619630197351F2B3040FD19B2E...

Derived public key: a1b2c3d4e5f6...
Node address: 0xa1

Created backup: /etc/pymc_repeater/config.yaml.backup.1234567890
✓ Successfully updated /etc/pymc_repeater/config.yaml

Restart pymc-repeater service now? (yes/no):
```

#### Important Considerations

⚠️ **Only one device with the same identity should be active at a time**
- Running multiple devices with the same key simultaneously can cause network confusion
- Other nodes may see conflicting messages from the same address
- Use shared identity only for migration or testing scenarios

---

## Identity Configuration Methods

There are two ways to configure your repeater's identity:

### Method 1: Using `identity_file` (Recommended)

Store the private key in a separate file.

**Configuration:**

```yaml
repeater:
  identity_file: "/etc/pymc_repeater/identity.key"
```

**File Format:**

The identity file should contain exactly 128 hex characters (64 bytes) representing the private key:

```
987BDA619630197351F2B3040FD19B2EE0DEE357DD69BBEEE295786FA78A4D5F298B0BF1B7DE73CBC23257CDB2C562F5033DF58C232916432948B0F6BA4448F2
```

**Advantages:**
- ✅ Clean separation of config and secrets
- ✅ Easier to manage file permissions independently
- ✅ Can be symlinked or mounted from secure storage
- ✅ Simple text format for easy backup and verification
- ✅ No need to modify config.yaml when rotating keys

**Best for:**
- Production deployments
- Security-conscious setups
- Manual key management

### Method 2: Using `repeater.identity_key`

Store the key directly in config.yaml as a binary field.

**Configuration:**

```yaml
repeater:
  identity_key: !!binary |
    mHvdaZYwGXNR8rMED9GbLuDe41fdaaYwGXNR8rMED9G...
```

**Notes:**
- This is a YAML binary field (base64-encoded)
- The `convert_firmware_key.sh` script uses this method
- The encoding is handled automatically by the script


### Priority Order

If both methods are configured, the repeater uses this priority:

1. `repeater.identity_file` (if set and file exists)
2. `repeater.identity_key` (if set in config)
3. Auto-generated identity (if neither is set)

---

## Verifying Your Identity

After configuring an identity, verify it loaded correctly.

### Check Service Logs

```bash
# View recent logs with identity information
sudo journalctl -u pymc-repeater -n 100 | grep -i 'identity\|hash\|address'

# Follow logs in real-time
sudo journalctl -u pymc-repeater -f | grep -i 'identity\|hash\|address'
```

### Expected Output

```
INFO - Loading identity from file: /etc/pymc_repeater/identity.key
INFO - Identity loaded successfully
INFO - Node address: 0xa1
INFO - Public key hash: a1b2c3d4e5f6...
```

### Verify Identity File

```bash
# Check if file exists and has correct permissions
sudo ls -la /etc/pymc_repeater/identity.key

# Verify key format (should be exactly 128 hex characters)
cat /etc/pymc_repeater/identity.key | wc -c
# Should output: 128 (or 129 if newline is present)

# Check the key is valid hexadecimal
cat /etc/pymc_repeater/identity.key | grep -E '^[0-9a-fA-F]{128}$'
# Should output the key if valid
```

### Verify via Web Interface

If the web interface is running:

1. Open `http://<repeater-ip>:8080` in your browser
2. Check the "Node Info" or "Status" section
3. Verify the node address matches your expectations

---

## Identity Security Best Practices

### 1. Protect Your Private Key

The private key is the most sensitive component - anyone with access can impersonate your node.

```bash
# Set restrictive permissions (owner read-only)
sudo chmod 600 /etc/pymc_repeater/identity.key

# Ensure root ownership
sudo chown root:root /etc/pymc_repeater/identity.key

# Verify permissions
ls -la /etc/pymc_repeater/identity.key
# Should show: -rw------- 1 root root
```

### 2. Backup Your Identity

```bash
# Create a secure backup
sudo cp /etc/pymc_repeater/identity.key ~/identity-backup-$(date +%Y%m%d).key

# Store offline securely
# - USB drive in safe location
# - Encrypted backup service
# - Password manager with secure notes
```

### 3. Never Share Your Private Key

- ❌ Don't share via email, chat, or cloud storage
- ❌ Don't commit to version control (git, etc.)
- ❌ Don't post in public forums or documentation
- ✅ Public keys and addresses are safe to share

### 4. Use Unique Identities per Repeater

Unless intentionally sharing identity with a firmware device:

- Each repeater should have its own unique identity
- Prevents address conflicts on the network
- Easier to track and identify individual nodes
- Improves network security and accountability

### 5. Rotate Keys When Compromised

If you suspect a key has been compromised:

```bash
# Generate a new identity immediately
python3 -c "import secrets; print(secrets.token_hex(64))" | sudo tee /etc/pymc_repeater/identity.key

# Restart the repeater
sudo systemctl restart pymc-repeater

# Update documentation with new node address
```

### 6. Secure Config Files

```bash
# Protect config.yaml if using repeater.identity_key
sudo chmod 600 /etc/pymc_repeater/config.yaml
sudo chown root:root /etc/pymc_repeater/config.yaml
```

---

## Troubleshooting Identity Issues

### Repeater Won't Start / Identity Errors

**Check if identity file exists and is readable:**

```bash
sudo ls -la /etc/pymc_repeater/identity.key
```

**Verify key format (should be 128 hex characters):**

```bash
cat /etc/pymc_repeater/identity.key | wc -c
# Should output: 128 (or 129 if newline present)

# Remove trailing newline if present
sudo truncate -s 128 /etc/pymc_repeater/identity.key
```

**Check logs for specific error:**

```bash
sudo journalctl -u pymc-repeater -n 50 | grep -i identity
```

**Common errors:**

- `Identity file not found` - Check path in config.yaml matches actual file location
- `Invalid key format` - Ensure file contains exactly 128 hex characters
- `Permission denied` - Check file permissions and ownership

### Converting Firmware Key Fails

**Ensure key is exactly 128 hex characters (no spaces/newlines):**

```bash
echo -n "YOUR_KEY_HERE" | wc -c
# Should output: 128
```

**Verify Python dependencies are installed:**

```bash
python3 -c "import yaml, nacl; print('Dependencies OK')"
```

**If dependencies are missing:**

```bash
pip3 install pyyaml pynacl
# or
sudo apt install python3-yaml python3-nacl
```

**Check config path is correct:**

```bash
sudo ls -la /etc/pymc_repeater/config.yaml
```

**Run script with explicit path:**

```bash
sudo ./convert_firmware_key.sh YOUR_KEY /etc/pymc_repeater/config.yaml
```

### Node Address Doesn't Match Firmware

If you imported a firmware key but the address is different:

**Verify key was imported correctly:**

```bash
# Check if repeater.identity_key exists in config
grep -A 5 "repeater:" /etc/pymc_repeater/config.yaml | grep identity_key
```

**Recalculate address from key:**

```python
# Create a test script: check_address.py
from nacl.bindings import crypto_scalarmult_ed25519_base_noclamp

key_hex = "YOUR_64_BYTE_KEY_HERE"
key_bytes = bytes.fromhex(key_hex)
scalar = key_bytes[:32]
pubkey = crypto_scalarmult_ed25519_base_noclamp(scalar)
address = pubkey[0]
print(f"Node address should be: 0x{address:02x}")
```

Run it:

```bash
python3 check_address.py
```

**Ensure firmware key format is correct:**
- Must be full 64-byte key (128 hex chars)
- Not just the 32-byte scalar portion
- Format: [32-byte scalar][32-byte nonce]

---

## Additional Resources

- [pyMC_Repeater GitHub](https://github.com/rightup/pyMC_Repeater)
- [MeshCore Firmware](https://github.com/rightup/MeshCore)
- [Configuration Guide](config-file.md)
- [Installation Guide](Installation.md)
- [Troubleshooting Guide](Troubleshooting.md)

---

**Last Updated:** January 2026  
**Compatible with:** pyMC Repeater v1.0.5+
