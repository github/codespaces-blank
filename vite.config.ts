import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // <-- Import the plugin

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Add the plugin here
    VitePWA({
      registerType: 'autoUpdate', // <-- This handles the "stuck app" problem
      manifest: {
        name: 'My Organizer App',
        short_name: 'Organizer',
        description: 'My awesome organizer PWA',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png', // We will add this icon soon
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png', // We will add this icon soon
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})