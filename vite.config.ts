import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2020',
    // Three.js (~250 kB gzip) n’est chargé qu’à la demande avec la scène 3D
    chunkSizeWarningLimit: 1000,
  },
})
