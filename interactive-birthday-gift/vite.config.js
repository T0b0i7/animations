import { defineConfig } from 'vite'

// Servi depuis /<repo>/interactive-birthday-gift/ sur GitHub Pages :
// `./` garde les assets relatifs, donc indépendant du nom du repo.
export default defineConfig({
  base: process.env.VITE_BASE || './',
})
