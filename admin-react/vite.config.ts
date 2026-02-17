import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow importing shared assets (like the existing Angular logo)
    fs: {
      allow: ['..'],
    },
  },
})
