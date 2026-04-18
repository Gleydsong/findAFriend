import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['src/**/*.spec.ts', 'test/**/*.spec.ts'],
    exclude: ['src/http/controllers/**/*.spec.ts', 'src/**/*.e2e-spec.ts'],
    setupFiles: ['test/vitest.setup.ts'],
  },
})
