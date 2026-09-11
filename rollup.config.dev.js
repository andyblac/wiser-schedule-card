import buildVersion from './scripts/build-version.mjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import typescript from './rollup.typescript.js';
import json from '@rollup/plugin-json';
import serve from 'rollup-plugin-serve';

export default {
  input: 'src/wiser-schedule-card.ts',
  output: { dir: 'dist', format: 'es', sourcemap: true },
  plugins: [
    buildVersion({ dev: true }),
    nodeResolve({ extensions: ['.mjs', '.js', '.json', '.ts'] }),
    typescript(),
    json(),
    serve({
      contentBase: 'dist',
      host: '127.0.0.1',
      port: 5000,
      headers: { 'Access-Control-Allow-Origin': '*' },
    }),
  ],
};
