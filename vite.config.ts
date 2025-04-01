import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic'
    }),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Brick Restaurant Platform',
        short_name: 'Brick',
        theme_color: '#2B2B2B',
        icons: [
          {
            src: '/vila-labs-icon.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      }
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 1024
    }),
    process.env.ANALYZE && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ].filter(Boolean),
  
  server: {
    port: 5173,
    host: '0.0.0.0',
    hmr: true,
    watch: {
      usePolling: true
    }
  },
  
  build: {
    target: 'esnext',
    minify: 'esbuild',
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion', 'sonner'],
          'auth-vendor': ['@supabase/supabase-js', '@supabase/auth-ui-react'],
          'utils-vendor': ['date-fns', 'zod', 'zustand'],
          'nlp-vendor': ['compromise', 'fuse.js'],
          'payment-vendor': ['@stripe/stripe-js', '@stripe/react-stripe-js', 'use-shopping-cart']
        }
      }
    }
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      'framer-motion',
      'sonner',
      '@supabase/supabase-js',
      'date-fns',
      'zod',
      'zustand',
      'compromise',
      'fuse.js',
      '@stripe/stripe-js',
      '@stripe/react-stripe-js',
      'use-shopping-cart'
    ],
    exclude: ['@supabase/auth-helpers-react']
  },
  
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    pure: process.env.NODE_ENV === 'production' ? 
      ['console.log', 'console.info', 'console.debug', 'console.trace'] : [],
    legalComments: 'none',
    target: 'esnext'
  }
});