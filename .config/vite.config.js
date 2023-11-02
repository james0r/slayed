import { resolve } from 'path'
import del from 'rollup-plugin-delete'
import shopify from 'vite-plugin-shopify'
import basicSsl from '@vitejs/plugin-basic-ssl'
import pageReload from 'vite-plugin-page-reload'

export default {
  server: {
    host: true,
    https: false,
    port: 3000
  },
  publicDir: resolve(__dirname, '../public'),
  plugins: [
    shopify({
      // Root path to your Shopify theme directory (location of snippets, sections, templates, etc.)
      themeRoot: resolve(__dirname, '../shopify'),
      sourceCodeDir: resolve(__dirname, '../src'),
      // Additional files to use as entry points (accepts an array of file paths or glob patterns)
      entrypointsDir: resolve(__dirname, '../src/entrypoints'),
      // additionalEntrypoints: [],
      // Specifies the file name of the snippet that loads your assets
      snippetFile: 'vite-tag.liquid'
    }),
    pageReload('/tmp/theme.update', {
      delay: 1600
    })
  ],
  css: {
    postcss: resolve(__dirname, '../.config/postcss.config.js'),
  },
  build: {
    sourcemap: true
  }
}
