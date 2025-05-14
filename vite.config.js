import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/hospital-finder-by-province",
  server: {
    host: '0.0.0.0',  // Allows access from any device in the network
    port: 3000,        // You can specify any available port
  }
})
