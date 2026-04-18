import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    globals: true,
    include: ['src/**/*.e2e-spec.ts'],
    setupFiles: ['test/vitest.setup.ts'],
  },
})
