import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Absolute base: the site is served from the domain root (Vercel + the
  // Express fallback in server/). A relative './' base breaks nested routes
  // like /tracks/aws, where ./assets/* resolves to /tracks/assets/*.
  base: '/',
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
