import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/main.ts'],
    tsconfig: 'tsconfig.json',
    outDir: 'dist',
    bundle: true,
    splitting: false,
    sourcemap: false,
    clean: true,
    format: 'cjs',
});
