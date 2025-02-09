import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/server/main.ts'],
    tsconfig: 'tsconfig.json',
    outDir: 'dist',
    bundle: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    format: 'cjs',
});
