import Alpine from 'alpinejs'
import helpers from './helpers.js'
import focus from '@alpinejs/focus'
import './a11y.js'
import './css/site.css'

window.Alpine = Alpine

// Declare our namespace on the window
const ns = 'vta'

// Define our ns and helpers property
window[ns] = (window[ns] || {})
window[ns].helpers = helpers

// Map helper functions to window[ns].helpers
for (const [key, value] of Object.entries(helpers)) {
  window[ns].helpers[key] = value
}

// Register Alpine plugins
Alpine.plugin(focus)

// Register Alpine stores
const alpineStores = import.meta.glob('./alpine/stores/*.js', { eager: true, import: 'default' })

for (const path in alpineStores) {
  const store = alpineStores[path]
  
  const name = store.name
  
  Alpine.store(name, store.store())
}

// Register Alpine componentw
const alpineComponents = import.meta.glob('./alpine/components/*.js', { eager: true, import: 'default' })

for (const path in alpineComponents) {
  const component = alpineComponents[path]
  
  const name = component.name
  
  Alpine.data(name, component.component)
}

// Register Alpine Magic Properties
const alpineMagic = import.meta.glob('./alpine/magic/*.js', { eager: true, import: 'default' })

for (const path in alpineMagic) {
  const magic = alpineMagic[path]
  
  const name = magic.name
  
  Alpine.magic(name, magic.callback)
}

Alpine.start()

console.log('test shopify-cli 3')