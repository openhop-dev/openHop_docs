import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(scriptDir, '..');
const sourceSpec = resolve(docsRoot, '../openhop_repeater/repeater/web/openapi.yaml');
const targetSpec = resolve(docsRoot, 'public/openapi/repeater.yaml');

if (!existsSync(sourceSpec)) {
  if (existsSync(targetSpec)) {
    console.warn(
      `OpenAPI source file not found: ${sourceSpec}. Using checked-in spec at ${targetSpec}.`
    );
    process.exit(0);
  }

  console.warn(`OpenAPI source file not found, skipping sync: ${sourceSpec}`);
  process.exit(0);
}

mkdirSync(dirname(targetSpec), { recursive: true });
copyFileSync(sourceSpec, targetSpec);
const spec = readFileSync(targetSpec, 'utf8')
  .replaceAll('pyMC Repeater API', 'openHop Repeater API')
  .replaceAll('REST API for pyMC Repeater', 'REST API for openHop Repeater')
  .replaceAll('name: pyMC Repeater', 'name: openHop Repeater')
  .replaceAll('url: https://github.com/rightup/pyMC_Repeater', 'url: https://github.com/openhop-dev/openhop_repeater')
  .replaceAll('Check pyMC console availability', 'Check openHop console availability');
writeFileSync(targetSpec, spec);
console.log(`Synced OpenAPI spec: ${sourceSpec} -> ${targetSpec}`);
