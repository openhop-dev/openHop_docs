---
title: Development
description: Set up a virtual environment and run the Repeater test, lint, security, and OpenAPI checks.
sidebar:
  order: 18
---

Development targets the `dev` branches of openHop Repeater and openHop Core. Use
an isolated virtual environment; the Repeater dependency currently resolves Core
from its moving `dev` branch.

## Setup

```bash
git clone https://github.com/openhop-dev/openhop_repeater.git
cd openhop_repeater
git switch dev
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -e ".[dev]"
python -m pip install pre-commit
pre-commit install
```

Python 3.12 is the primary CI environment. Keep public code compatible with the
repository's practical Python 3.10 minimum.

## Project map

- `repeater/main.py`: daemon composition and lifecycle
- `repeater/engine.py` and `packet_router.py`: routing and forwarding
- `repeater/handler_helpers/`: packet and command handlers
- `repeater/data_acquisition/`: storage, GPS, sensors, MQTT, Glass, and statistics
- `repeater/web/`: CherryPy API, authentication, WebSockets, and OpenAPI
- `tests/`: mocked unit and regression tests
- `config.yaml.example`: canonical commented configuration

`repeater/web/html/` contains generated frontend assets. Do not hand-edit them;
the active frontend source lives in the sibling openHop Repeater UI repository.

## Verification

Focused and full tests:

```bash
python -m pytest -q tests/<relevant_test>.py
python -m pytest -q
```

Read-only lint and format checks:

```bash
python -m ruff check .
python -m ruff format --check .
```

API changes must update code, tests, and `repeater/web/openapi.yaml`:

```bash
python scripts/check_openapi_contract.py
python scripts/check_openapi_contract.py --strict-methods
```

The complete contributor gate may rewrite files:

```bash
pre-commit run --all-files
```

It runs Ruff fixes/checks, format verification, Bandit, the OpenAPI contract
checker, and pytest. Review all resulting changes.

## Safe local runtime

Do not start development with a production config. A startup can generate an
identity and JWT secret, open hardware, connect to services, or transmit. Use
temporary config/storage and `radio_type: null` unless hardware testing is
explicitly intended.

## Sensor plug-ins

New sensors subclass `SensorBase`, use a lowercase registry key matching
`sensor_type`, keep optional imports lazy, return flat results quickly, include a
config example, and add mocked tests. Disable runtime package auto-install in
controlled, offline, or immutable deployments.

See the [Repeater repository](https://github.com/openhop-dev/openhop_repeater/tree/dev)
and its `docs/adding_sensors.md` guide for current implementation details.
