---
title: Identity Management
description: Create, import, back up, and protect Repeater, room-server, and companion identities.
sidebar:
  order: 12
---

A MeshCore identity is the node's long-lived cryptographic identity. Replacing it
changes how the mesh recognizes the node; exposing its private material allows
impersonation.

## Primary repeater identity

The main identity is configured under `repeater`:

```yaml
repeater:
  identity_file: null
  # identity_key: null
```

When `identity_key` is absent, Repeater loads or creates a MeshCore-compatible
identity using `identity_file` when set. Without an explicit path it uses this
system identity **only if the file already exists**:

```text
/etc/openhop_repeater/identity.key
```

The generated file contains a base64-encoded 32-byte private scalar and is
written with mode `0600`; loading also accepts a decoded 64-byte key. When the
system file does not exist, the fallback follows
`XDG_CONFIG_HOME/openhop_repeater/identity.key` or
`~/.config/openhop_repeater/identity.key`.

`repeater.identity_key` takes precedence over `repeater.identity_file`. An inline
key makes the whole config secret, so a separate protected identity file is
usually easier to back up and handle safely. Omit `identity_key` when using a
file: an explicitly present `identity_key: null` still bypasses automatic file
loading in the current config reader. Set an explicit absolute `identity_file`
to avoid relying on the service account's home directory.

A missing or unreadable/invalid identity file can cause generation of a new
identity; a failed save is logged but the generated key can remain in memory.
If startup reports either condition on an existing node, stop and recover the
original key rather than repeatedly restarting and advertising a new identity.

## First-run behavior

The `/setup` onboarding flow can establish the node configuration and identity.
After first startup:

1. Confirm the displayed node name and public identity/hash.
2. Stop and investigate if an existing installation unexpectedly reports a new
   identity.
3. Back up the identity file and config through a secure offline process.
4. Keep the backup separate from public logs, screenshots, and support bundles.

## Importing a firmware identity

The Repeater repository includes `convert_firmware_key.sh` for converting a
MeshCore firmware private key and updating a config. Run it only on a trusted
host from a reviewed checkout, and avoid placing a real key in shell history,
terminal recordings, or process-monitoring output.

Back up the current identity and config first. The helper requires a 64-byte
firmware private key (128 hexadecimal characters) as its first argument and
accepts an optional config path (default `/etc/openhop_repeater/config.yaml`).
`--output-format=yaml` is the default and embeds binary key material in the
config. `--output-format=identity` writes the fixed system path
`/etc/openhop_repeater/identity.key`; it is not a custom key-path argument.
Check for an inline `identity_key` override before expecting that file to be used.

**Its argument-based interface can expose the key in process listings even when
shell history is disabled.** Do not run it in a shared or recorded shell, and do
not copy a real key into a support command. Use only a trusted administrative
environment; the current helper does not offer a documented hidden-input mode.

Restart only after reviewing the changed configuration securely. Confirm the
public identity after restart before deleting the old backup.

## Room-server and companion identities

Additional identities are configured under:

- `identities.room_servers` for room servers;
- `identities.companions` for companion bridges and TCP frame servers.

Each logical identity needs unique private key material. Companion settings also
include `tcp_port`, optional `bind_address`, and timeout behavior. Use a unique
port per companion and remember that one client connects to each companion TCP
port at a time.

Identity names must be unique. The first byte of each public key must also be
unique within the server class (primary Repeater plus room servers) and within
the companion class. A companion may share that one-byte prefix with a
server-class identity because current routing and persistence keep those classes
in separate namespaces and verify the full cryptographic identity.

The dashboard and authenticated API expose identity operations. Creating,
updating, deleting, or importing an identity changes persistent state and may
affect clients, contacts, queues, and advertised identity. Export a backup before
destructive changes.

## Mesh client permissions and stored ACLs

Mesh client access lists are separate from dashboard accounts, JWTs, and API
keys. Each repeater or room-server identity has its own ACL, stored under its
full public key rather than only the one-byte identity hash.

An administrator can grant a client access using the MeshCore remote CLI:

```text
setperm <full-client-public-key-hex> 3
get acl
```

Replace the placeholder with the client's complete 64-character hexadecimal
**public** key, not a private key or a shortened identity hash. The permissions
byte's low two bits select the role: `1` read-only, `2` read-write, `3` admin.
`get acl` lists permission bytes in hexadecimal. In `setperm`, a role of `0`
removes a matching entry; use a full key to avoid ambiguous prefix removal.
An invalid nonnumeric permissions argument can also become zero, so check the
command carefully before sending it.

- The primary repeater stores nonzero-permission entries across restarts.
- Room servers store admin entries only; other room roles are session state and
  do not survive a restart.
- A stored client can log in with a blank password while retaining its granted
  role. Blank login still requires the client's cryptographic identity; it is
  not permission for an arbitrary client to become an administrator.
- Removing a stored entry removes its persistent grant too. Changing a shared
  password is not a substitute for revoking already stored client permissions.

For automation, authenticated `POST /api/acl_set_permissions` takes
`identity_name`, `client_pubkey`, and `permissions`. Its `persisted` result tells
whether that entry survives restart. Use `POST /api/acl_remove_client` for
removal; prefer an explicit `identity_name` to a potentially colliding hash.
Omitting both identity selectors removes the client from every ACL. See the
[API Reference](/projects/openhop-repeater/api-reference/) for request schemas.

A provisioned or reloaded ACL entry may have `last_activity: 0` until used.
Consequently the ACL entry count can exceed the authenticated/active-client
count. A `store_error` or `store_errors` response means the stored ACL could not
be read—not that it is empty. Investigate database access and recover the store
before replacing grants. Include the persistent database in identity backups;
config and key files alone do not preserve these permissions.

:::caution[Blank-password guest access]
For the primary repeater, an empty guest password permits a new client's blank
login as a guest even when `allow_read_only` is false. A configured guest password
and the separate read-only setting change this path. Room servers retain their
own password and read-only rules. Set deliberate access policy rather than
assuming that an empty guest password disables guest access.
:::

## Plugins and identity access

Installing an external [Plugin](/projects/openhop-repeater/plugins/) does not
automatically create a MeshCore identity. Configure any required companion or
room-server identity explicitly, following the application's instructions.
Plugin settings and persistent data are separate from the primary identity
file. Plugins run with service-account access, not in a security sandbox: trust
them before granting credentials or access to hosted identities.

## Permissions and backups

For a native install, verify that the service can read the identity while other
users cannot. Do not make the file world-readable to fix a startup problem.

```bash
sudo stat /etc/openhop_repeater/identity.key
sudo journalctl -u openhop-repeater -n 100 --no-pager
```

The `stat` output should show restrictive permissions. Do not print or validate a
private key with commands that echo its contents.

A usable backup plan includes:

- `/etc/openhop_repeater/identity.key` when present;
- `/etc/openhop_repeater/config.yaml` after secret-aware handling;
- policy and runtime state needed by hosted identities;
- an encrypted/offline destination and a tested restore procedure.

Container installations persist identity/config in the config volume. A container
recreation without that volume can generate a new identity.

## Troubleshooting identity changes

If the node identity changes unexpectedly:

1. Stop the service to avoid advertising the wrong identity.
2. Determine which config path and service unit are active.
3. Check whether an `identity_key` overrides the file.
4. Check the current and legacy openHop/pyMC config directories after migration.
5. Restore only from a verified private backup.
6. Restart and confirm the public identity before transmitting.

Never post the private key while asking for help. A public key/hash and redacted
logs are sufficient for most identity investigations.

See [First Boot](/projects/openhop-repeater/first-boot/),
[Configuration Reference](/projects/openhop-repeater/config-file/), and
[Web Dashboard](/projects/openhop-repeater/web-dashboard/).

## Implementation references

- [Identity config loading](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/config.py)
- [Identity collision regression tests](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/tests/test_identity_collision_preflight.py)
- [ACL persistence and login rules](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/handler_helpers/acl.py)
- [Remote CLI permissions](https://github.com/openhop-dev/openhop_repeater/blob/3c4bf3a9586d1e0b3871091649bc3fd09da3b662/repeater/handler_helpers/mesh_cli.py)
