import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '/homepage/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5055'
    }
  }
})
