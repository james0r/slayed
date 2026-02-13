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

export function copyPublicToAssetsPlugin() {
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

      // Initial sync of existing files
      if (fs.existsSync(publicDir)) {
        const files = fs.readdirSync(publicDir);
        files.forEach(file => {
          const src = path.resolve(publicDir, file);
          if (fs.statSync(src).isFile()) {
            const dest = path.resolve(assetsDir, file);
            copyFile(src, dest);
          }
        });
        console.log(`[copy-public] Synced ${files.length} files to assets/`);
      }

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