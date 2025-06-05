import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

export const testConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.ts',
  },
})