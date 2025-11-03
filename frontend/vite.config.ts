import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, './src/@shared'),
      "@assets": path.resolve(__dirname, './src/@assets')
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})