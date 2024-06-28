import shopify from 'vite-plugin-shopify'
import cleanup from '@by-association-only/vite-plugin-shopify-clean'

import pageReload from 'vite-plugin-page-reload'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { watch } from 'chokidar';
import fs from 'fs-extra'

const watchStaticAssets = () => ({
  name: 'watch-static-assets',
  configureServer(server) {
    const watcher = watch('./public/*', {
      persistent: true
    });

    const copyAsset = async path => {
      await fs.copy(path, `assets/${path.replace('public/', '')}`);
    }

    const removeAsset = async path => {
      await fs.remove(`assets/${path.replace('public/', '')}`);
    }

    watcher.on('add', copyAsset);
    watcher.on('change', copyAsset);
    watcher.on('unlink', removeAsset);
  }
})

export default {
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    https: true,
    port: 3000,
    hmr: true
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
    basicSsl(),
    watchStaticAssets(),
    cleanup(),
    shopify({
      sourceCodeDir: "src",
      entrypointsDir: 'src/entrypoints',
      additionalEntrypoints: [
        'src/js/prodify/index.ts'
      ],
      snippetFile: "vite.liquid",
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
