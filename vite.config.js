import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/hospital-finder-build/",
  server: {
    host: '0.0.0.0',  // Allows access from any device in the network
    port: 3000,        // You can specify any available port
  }
})
