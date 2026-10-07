import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Nova provides this package at runtime. The tests use a stub.
      'laravel-nova-ui': fileURLToPath(new URL('./tests/js/stubs/laravel-nova-ui.js', import.meta.url)),
    },
  },
  test: {
    environment: 'happy-dom',
    include: ['tests/js/**/*.test.js'],
  },
})
