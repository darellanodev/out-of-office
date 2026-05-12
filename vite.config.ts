import { defineConfig } from 'vite'

export default defineConfig({
  base: process.env.VITE_BASE_URL || '/',
  build: {
    chunkSizeWarningLimit: 1000,
  },
})