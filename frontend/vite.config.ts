import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path/posix'
import { VitePWA } from 'vite-plugin-pwa'
import { internalIpV4 } from 'internal-ip'

export default defineConfig({
  server: {
    port: 4321,
    host: '0.0.0.0',
    proxy: {
      '/api/v1': 'http://localhost:4322',
    },
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: await internalIpV4(),
      port: 4421,
    },
  },
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: 'Heartbeat',
        short_name: 'Heartbeat',
        icons: [
          {
            src: '/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
      },
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg}'],
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(js|css|ts)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  resolve: {
    alias: {
      '@src': resolve(__dirname, './src'),
    },
  },
})
