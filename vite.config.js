import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
  ],
  // `npm run dev` forwards API calls to the event-day backend.
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
