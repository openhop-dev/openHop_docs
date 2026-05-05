import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(scriptDir, '..');
const sourceSpec = resolve(docsRoot, '../pyMC_Repeater/repeater/web/openapi.yaml');
const targetSpec = resolve(docsRoot, 'public/openapi/repeater.yaml');

if (!existsSync(sourceSpec)) {
  console.warn(`OpenAPI source file not found, skipping sync: ${sourceSpec}`);
  process.exit(0);
}

mkdirSync(dirname(targetSpec), { recursive: true });
copyFileSync(sourceSpec, targetSpec);
console.log(`Synced OpenAPI spec: ${sourceSpec} -> ${targetSpec}`);
