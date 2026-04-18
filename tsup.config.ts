import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/server.ts'],
  clean: true,
  dts: false,
  format: ['cjs'],
  sourcemap: true,
  target: 'node20',
})
