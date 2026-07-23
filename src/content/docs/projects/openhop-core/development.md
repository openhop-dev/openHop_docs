---
title: Core Development
description: Set up, test, format, and build documentation for openHop Core.
sidebar:
  order: 5
---

## Development setup

Use Python 3.9 through 3.12 in a virtual environment:

```bash
git clone https://github.com/openhop-dev/openhop_core.git
cd openhop_core
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
python -m pip install pre-commit
pre-commit install
```

The repository has no dependency lockfile. Record the Python and dependency
versions when investigating version-sensitive behavior.

## Tests

Run the complete suite without connecting hardware:

```bash
python -m pytest --tb=short -v
```

Use a focused file while developing, then run the full suite:

```bash
python -m pytest tests/test_packet.py --tb=short -v
python -m pytest tests/test_dispatcher.py --tb=short -v
```

Tests under `tests/hardware/` may still mock hardware-adjacent logic. Read a test
before assuming it needs a physical radio.

## Formatting and linting

The repository's contributor gate is:

```bash
pre-commit run --all-files
```

Pre-commit can rewrite files. It runs whitespace and YAML checks, Black, isort,
and flake8; it does not run pytest. Review all changes, then run tests separately.
Mypy is installed as a development dependency but is not a configured project gate.

## Build the Core documentation

```bash
python -m pip install -r docs/requirements.txt
cd docs
python -m mkdocs build --clean
```

The source tree also contains detailed MkDocs API material. The public openHop
documentation site is [docs.openhop.dev](https://docs.openhop.dev/); this Core
section focuses on stable ecosystem-level guidance.

## Compatibility rules

- Keep protocol bytes compatible with MeshCore firmware.
- Use independent firmware byte vectors for packet-format changes.
- Preserve serialized radio transmission, acknowledgement cleanup, cancellation,
  callbacks, and async behavior.
- Public code remains compatible with Python 3.9.
- A successful radio `send()` returns a metadata mapping; only failure returns
  `None`.
- The caller owns radio shutdown after stopping `MeshNode`.
- Never use hardware examples as unattended smoke tests.

## Before opening a change

1. Add or update focused tests.
2. Run the focused tests and full test suite.
3. Run pre-commit and review any rewrites.
4. Build the MkDocs site when documentation changes.
5. Check the diff for generated files, identities, tokens, device paths, and other
   local artifacts.

See the [repository contributing guide](https://github.com/openhop-dev/openhop_core/blob/dev/docs/docs/contributing.md)
for the current project workflow.
