// Verifies that every installed runtime/dev dependency uses an allowed free licence.
// Usage: npm run licenses
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ALLOWED = new Set(['MIT', 'ISC', 'BSD-2-Clause', 'BSD-3-Clause', 'Apache-2.0', '0BSD', 'OFL-1.1', 'CC0-1.0', 'BlueOak-1.0.0', 'Unlicense', 'MPL-2.0', 'Python-2.0', 'CC-BY-4.0']);
const root = 'node_modules';
const rows = [];
const visit = (dir) => {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue;
    const p = join(dir, name);
    if (name.startsWith('@')) { visit(p); continue; }
    const pj = join(p, 'package.json');
    if (!existsSync(pj)) continue;
    const pkg = JSON.parse(readFileSync(pj, 'utf8'));
    let lic = pkg.license || (pkg.licenses && pkg.licenses.map((l) => l.type || l).join(' OR ')) || 'UNKNOWN';
    if (typeof lic === 'object') lic = lic.type;
    rows.push({ name: pkg.name, version: pkg.version, license: lic });
    if (existsSync(join(p, 'node_modules'))) visit(join(p, 'node_modules'));
  }
};
visit(root);
const ok = (l) => l.replace(/[()]/g, '').split(/\s+(?:OR|AND)\s+/).every((x) => ALLOWED.has(x.trim()));
const bad = rows.filter((r) => !ok(r.license));
const direct = JSON.parse(readFileSync('package.json', 'utf8'));
const directNames = new Set([...Object.keys(direct.dependencies || {}), ...Object.keys(direct.devDependencies || {})]);
console.log('Direct dependencies:');
for (const r of rows.filter((r) => directNames.has(r.name))) console.log(`  ${r.name}@${r.version}  ${r.license}`);
console.log(`\nChecked ${rows.length} installed packages.`);
if (bad.length) { console.log('Packages needing review:'); for (const r of bad) console.log(`  ${r.name}@${r.version}  ${r.license}`); process.exitCode = 1; }
else console.log('All licences are free/open-source and on the allow-list.');
