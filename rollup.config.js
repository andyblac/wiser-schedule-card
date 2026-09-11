import buildVersion from './scripts/build-version.mjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from './rollup.typescript.js';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default (args) => ({
  input: 'src/wiser-schedule-card.ts',
  output: {
    dir: 'dist',
    format: 'es',
    sourcemap: false,
  },
  plugins: [
    buildVersion({ dev: Boolean(args.configDev) }),
    nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts'] }),
    typescript(),
    json(),
    terser(),
  ],
});
