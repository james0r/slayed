import { resolve } from 'node:path'
import shopify from 'vite-plugin-shopify'
import pageReload from 'vite-plugin-page-reload'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'

export default {
  clearScreen: false,
  server: {
    host: '127.0.0.1',
    https: true,
    port: 3000
  },
  publicDir: 'public',
  plugins: [
    basicSsl(),
    shopify({
      snippetFile: 'vite.liquid'
    }),
    pageReload('/tmp/theme.update', {
      delay: 2000
    })
  ],
  build: {
    sourcemap: true
  }
}
