---
title: pyMC_core Quick Start
description: Install pyMC_core and bootstrap a basic local node runtime.
---

## Install

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -U pip
pip install pymc-core
```

For hardware-backed operation, install optional dependencies:

```bash
pip install pymc-core[hardware]
```

## Minimal runtime shape

```python
import asyncio
from pymc_core import MeshNode, LocalIdentity

async def main() -> None:
    identity = LocalIdentity()
    node = MeshNode(local_identity=identity)
    await node.start()
    print('Node started')

asyncio.run(main())
```

## Notes

- Hardware-specific radio initialization depends on your board and wiring.
- For supported radio modules and production examples, use the upstream docs and examples folder.
