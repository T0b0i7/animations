import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le build est servi depuis /<repo>/lamp-login/ sur GitHub Pages.
// `./` garde les assets relatifs : le site fonctionne quel que soit le nom du repo.
// Pour forcer un chemin absolu : VITE_BASE=/animations/lamp-login/ npm run build
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || './',
})
