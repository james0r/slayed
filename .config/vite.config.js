import { resolve } from 'path'
import del from 'rollup-plugin-delete'
import ESLintPlugin from '@modyqyw/vite-plugin-eslint'
import StylelintPlugin from 'vite-plugin-stylelint'
import FullReload from 'vite-plugin-full-reload'

export default {
  plugins: [
    ESLintPlugin({
      overrideConfigFile: resolve(__dirname, './.eslintrc.js'),
      include: '../src/**/*.{js}',
    }),
    StylelintPlugin({
      files: '../src/**/*.{css,sass,scss}',
      configFile: resolve(__dirname, './.stylelintrc.js'),
    }),
    FullReload("/tmp/theme.update", {
      delay: 2000,
      root: "/",
    }),
  ],
  clearScreen: false,
  css: {
    postcss: resolve(__dirname, '../.config/postcss.config.js'),
  },
  resolve: {
    extensions: ['*', '.js', '.json'],
    alias: {
      '@': resolve(__dirname, '../src/'),
      '@shopify-directory': resolve(__dirname, '../shopify/'),
    },
  },
  build: {
    sourcemap: process.env.NODE_ENV != 'production',
    rollupOptions: {
      input: {
        bundle: resolve(__dirname, '../src/main.js'),
      },
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: (assetInfo) =>
          assetInfo.name.split('/').pop().split('.').shift() == 'main'
            ? 'bundle.css'
            : '[name].[ext]',
      },
      plugins: [
        process.env.NODE_ENV == 'production' &&
        del({
          targets: [
            resolve(__dirname, '../shopify/assets/!(*.static.*)'),
          ],
          verbose: false
        }),
      ],
    },
    outDir: resolve(__dirname, '../shopify/assets'),
    assetsDir: '.',
    emptyOutDir: false,
  },
}
