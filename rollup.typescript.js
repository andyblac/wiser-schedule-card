import ts from 'typescript';

// Type-check separately with tsc. Transpile per module here so production builds
// do not create a TypeScript watch program or leave filesystem watchers running.
export default function typescript() {
  const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile);
  if (config.error) throw new Error(ts.flattenDiagnosticMessageText(config.error.messageText, '\n'));
  const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, '.');
  return {
    name: 'typescript-transpile',
    transform(code, id) {
      if (!id.endsWith('.ts') || id.endsWith('.d.ts') || id.includes('/node_modules/')) return null;
      const result = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: { ...options, noEmit: false, importHelpers: true, sourceMap: true, inlineSources: true },
      });
      return { code: result.outputText, map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null };
    },
  };
}
