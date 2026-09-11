import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Keep the release version in package.json and the local dev counter outside dist,
// so cleaning build output does not reuse a cache-busting version.
export default function buildVersion({ dev = false, root = process.cwd() } = {}) {
  const packagePath = resolve(root, 'package.json');
  const counterPath = resolve(root, '.dev-build.json');
  let version;
  let baseVersion;
  let build;
  let resourceUrl;

  return {
    name: 'build-version',
    buildStart() {
      baseVersion = JSON.parse(readFileSync(packagePath, 'utf8')).version;
      version = baseVersion;
      if (dev) {
        let previous;
        try {
          previous = JSON.parse(readFileSync(counterPath, 'utf8'));
        } catch (error) {
          if (error.code !== 'ENOENT') throw error;
        }
        if (previous && (!Number.isSafeInteger(previous.build) || previous.build < 0)) {
          throw new Error('Invalid dev build counter in .dev-build.json');
        }
        build = previous?.baseVersion === baseVersion ? previous.build + 1 : 1;
        version = `${baseVersion}-dev.${build}`;
      }
      resourceUrl = `/wiser/wiser-schedule-card.js?v=${version}`;
    },
    shouldTransformCachedModule({ id }) {
      // Re-stamp package metadata on every watch rebuild, even when it is unchanged.
      return id === packagePath ? true : null;
    },
    transform(code, id) {
      if (id !== packagePath) return null;
      return { code: JSON.stringify({ ...JSON.parse(code), version }), map: null };
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'build-info.json',
        source: `${JSON.stringify({ version, resourceUrl }, null, 2)}\n`,
      });
    },
    writeBundle() {
      if (dev) writeFileSync(counterPath, `${JSON.stringify({ baseVersion, build }, null, 2)}\n`);
      console.info(`\nBuilt ${version}\nDashboard resource: ${resourceUrl}\n`);
    },
  };
}
