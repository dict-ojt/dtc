import { defineConfig } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/dtc/',
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['logo.png', 'dtc-logo.png', 'complete.png', 'vite.svg'],
      manifest: {
        name: 'DICT Region 2 - DTC Tuguegarao Attendance System',
        short_name: 'DTC Attendance',
        description: 'Data Training Center Attendance System for DICT Region 2 Tuguegarao',
        theme_color: '#1a3a5c',
        background_color: '#f8fafc',
        display: 'standalone',
        scope: '/dtc/',
        start_url: '/dtc/',
        orientation: 'portrait',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      devOptions: {
        enabled: true
      }
    })
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
