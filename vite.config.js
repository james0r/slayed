import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import basicSsl from '@vitejs/plugin-basic-ssl'
import tailwindcss from "@tailwindcss/vite";
import { copyPublicToAssetsPlugin } from './plugins/vite-plugin-copy-public-to-assets.js'
import { cleanShopifyAssets } from './plugins/vite-plugin-clean-assets.js'

export default {
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    https: true,
    port: 3000,
    hmr: true,
    cors: {
      origin: [
        /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/,
        'https://slayed-starter.myshopify.com',
        'https:/slayed-starter.com'
      ]
    }
  },
  publicDir: 'public',
  build: {
    manifest: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]',
      },
    }
  },
  plugins: [
    tailwindcss(),
    basicSsl(),
    copyPublicToAssetsPlugin(),
    cleanShopifyAssets(),
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: 'src/entrypoints',
      additionalEntrypoints: [
        'src/js/prodify/index.ts'
      ],
    }),
    pageReload('/tmp/theme.update', {
      delay: 2000
    }),
    {
      name: 'vite-plugin-liquid-tailwind-refresh',
      handleHotUpdate(ctx) {
        if (ctx.file.endsWith('.liquid')) {
          // Filter out the liquid module to prevent a full refresh
          return [...ctx.modules[0]?.importers ?? [], ...ctx.modules.slice(1)]
        }
      }
    }
  ],
}
