import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import history from 'connect-history-api-fallback'
import { copyFileSync } from 'fs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'spa-fallback',
      configureServer: (server) => {
        // Add history API fallback middleware for client-side routing
        server.middlewares.use(
          history({
            // Only serve index.html for navigation requests (not for assets)
            rewrites: [
              // Don't redirect API routes
              { from: /^\/api\/.*$/, to: function(context) {
                return context.parsedUrl.pathname;
              }},
            ],
            // Accept requests that look like they're for HTML pages
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml'],
            // Enable verbose logging for debugging
            verbose: process.env.NODE_ENV === 'development',
          })
        )
      }
    },
    {
      name: 'copy-spa-config',
      writeBundle() {
        // Copy SPA routing configs to dist folder for deployment
        try {
          copyFileSync('public/_redirects', 'dist/_redirects')
          copyFileSync('public/vercel.json', 'dist/vercel.json')
        } catch (error) {
          console.log('Note: Some deployment configs not copied (this is normal for development)')
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    // Ensure assets are properly referenced
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Better chunking for SPA
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
  preview: {
    port: 3000,
  },
})
