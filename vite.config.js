import shopify from 'vite-plugin-shopify'
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
    port: 3000
  },
  publicDir: true,
  plugins: [
    basicSsl(),
    watchStaticAssets(),
    shopify({
      snippetFile: 'vite.liquid'
    }),
    // pageReload('/tmp/theme.update', {
    //   delay: 2000
    // })
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: '[name].[hash].min.js',
        chunkFileNames: '[name].[hash].min.js',
        assetFileNames: '[name].[hash].min[extname]',
      },
    }
  }
}
