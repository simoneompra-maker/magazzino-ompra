import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    legacy({
      // Qui diciamo a Vite di creare una versione speciale per Android 6
      targets: ['defaults', 'not IE 11', 'android >= 6'],
    }),
  ],
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
  }
})