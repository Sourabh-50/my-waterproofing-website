import { defineConfig } from 'vite'
import { resolve } from 'path'

// Pure HTML/CSS/JS Multi-Page Vite Configuration
export default defineConfig({
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        about: resolve(import.meta.dirname, 'about.html'),
        gallery: resolve(import.meta.dirname, 'gallery.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  base: '/',
})
