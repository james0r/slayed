// vite-plugin-clean-assets.js
import { rmSync, readdirSync } from 'fs'
import { resolve } from 'path'

export function cleanShopifyAssets(options = {}) {
  const {
    dir = 'assets',
    extensions = ['.js', '.css', '.map']
  } = options

  return {
    name: 'clean-shopify-assets',
    buildStart() {
      const assetsDir = resolve(process.cwd(), dir)

      try {
        const files = readdirSync(assetsDir)

        files
          .filter(file => /\-[a-zA-Z0-9]{8}\.(js|css|map)$/.test(file))
          .forEach(file => {
            rmSync(resolve(assetsDir, file), { force: true })
          })

        console.log(`[clean-shopify-assets] Cleaned ${dir}/`)
      } catch {
        // Directory doesn't exist yet, nothing to clean
      }
    }
  }
}