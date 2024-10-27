import shopify from 'vite-plugin-shopify'
import cleanup from '@by-association-only/vite-plugin-shopify-clean'
import pageReload from 'vite-plugin-page-reload'
import basicSsl from '@vitejs/plugin-basic-ssl'

import fs from 'fs';
import path from 'path';
import chokidar from 'chokidar';

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function removeFile(dest) {
  if (fs.existsSync(dest)) {
    try {
      fs.unlinkSync(dest);
    } catch (err) {
      console.error(`Failed to remove file: ${dest}`);
    }
  }
}

function copyPublicToAssetsPlugin() {
  let config;

  return {
    name: 'vite-plugin-copy-public',
    apply: 'serve', // Only apply this during development
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    buildStart() {
      const publicDir = path.resolve(config.root, 'public');
      const assetsDir = path.resolve(config.root, 'assets');

      const watcher = chokidar.watch(publicDir, { ignoreInitial: true });

      watcher.on('add', (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        console.log(`Copying new file: ${relativePath}`);
        copyFile(filePath, destPath);
      });

      watcher.on('change', (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        console.log(`Updating file: ${relativePath}`);
        copyFile(filePath, destPath);
      });

      watcher.on('unlink', (filePath) => {
        const relativePath = path.relative(publicDir, filePath);
        const destPath = path.resolve(assetsDir, relativePath);
        console.log(`Removing file: ${relativePath}`);
        removeFile(destPath);
      });
    },
  };
}

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
    cleanup(),
    copyPublicToAssetsPlugin(),
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
