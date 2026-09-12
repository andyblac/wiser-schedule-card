import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import buildVersion from '../scripts/build-version.mjs';

test('dev versions increment on successful builds and reset for a new release', () => {
  const root = mkdtempSync(join(tmpdir(), 'wiser-version-'));
  const packagePath = join(root, 'package.json');
  const setRelease = (version) => writeFileSync(packagePath, JSON.stringify({ version }));
  const run = (dev, success = true) => {
    const plugin = buildVersion({ dev, root });
    plugin.buildStart();
    const version = JSON.parse(plugin.transform(readFileSync(packagePath, 'utf8'), packagePath).code).version;
    plugin.generateBundle.call({
      emitFile(asset) {
        const info = JSON.parse(asset.source);
        assert.equal(info.version, version);
        assert.equal(info.resourceUrl, `/wiser/wiser-schedule-card.js?v=${version}`);
      },
    });
    if (success) plugin.writeBundle();
    return version;
  };
  try {
    setRelease('2.0.0');
    assert.equal(run(true), '2.0.0-dev.1');
    assert.equal(run(true), '2.0.0-dev.2');
    assert.equal(run(false), '2.0.0');
    assert.equal(run(true, false), '2.0.0-dev.3');
    assert.equal(run(true), '2.0.0-dev.3');
    assert.equal(JSON.parse(readFileSync(packagePath, 'utf8')).version, '2.0.0');
    setRelease('2.1.0');
    assert.equal(run(true), '2.1.0-dev.1');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('cached Rollup rebuilds stamp the next version into the JavaScript', async () => {
  const { rollup } = await import('rollup');
  const { default: json } = await import('@rollup/plugin-json');
  const root = mkdtempSync(join(tmpdir(), 'wiser-version-cache-'));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ version: '2.0.0' }));
  writeFileSync(join(root, 'entry.js'), "import {version} from './package.json'; console.log(version);");
  let cache;
  const plugin = buildVersion({ dev: true, root });
  try {
    for (const number of [1, 2]) {
      const bundle = await rollup({ input: join(root, 'entry.js'), plugins: [plugin, json()], cache });
      try {
        cache = bundle.cache;
        const { output } = await bundle.write({ dir: join(root, 'dist'), format: 'es' });
        const code = output.find((item) => item.type === 'chunk').code;
        assert.ok(code.startsWith(`/*! WISER-CARD-VERSION wiser-schedule-card 2.0.0-dev.${number} */`));
      } finally {
        await bundle.close();
      }
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
