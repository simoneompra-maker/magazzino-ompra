import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import legacy from '@vitejs/plugin-legacy'
import { writeFileSync } from 'fs'
import { resolve } from 'path'

// Genera versione univoca ad ogni build (timestamp)
const buildVersion = new Date().toISOString().replace(/[:.]/g, '-')

// Scrive version.json nella cartella public al momento del build
function writeVersionPlugin() {
  return {
    name: 'write-version',
    buildStart() {
      const versionFile = resolve(__dirname, 'public/version.json')
      writeFileSync(versionFile, JSON.stringify({ version: buildVersion }))
      console.log(`[version] Build version: ${buildVersion}`)
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11', 'android >= 6'],
    }),
    writeVersionPlugin(),
  ],
  define: {
    // Rende la versione disponibile come costante nel codice React
    __APP_VERSION__: JSON.stringify(buildVersion),
  },
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
