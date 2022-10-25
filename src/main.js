import Alpine from 'alpinejs'
import helpers from './helpers.js'
import intersect from '@alpinejs/intersect'
import focus from '@alpinejs/focus'
import './a11y.js'
import './css/main.css'
import pulseonclick from './alpine/plugins/pulseonclick'

window.Alpine = Alpine

// Declare our ns on the window
const ns = 'slayed'

// Define our ns and helpers property
window[ns] = (window[ns] || {})
window[ns].helpers = helpers

// Map helper functions to window[ns].helpers
for (const [key, value] of Object.entries(helpers)) {
  window[ns].helpers[key] = value
}

// Register Alpine plugins
Alpine.plugin(pulseonclick)
Alpine.plugin(intersect)
Alpine.plugin(focus)

// Register Alpine stores
const alpineStores = require.context('./alpine/stores/', true, /\.js$/)

alpineStores.keys().forEach((key) => {
  const store = alpineStores(key).default

  const name = store.name

  Alpine.store(name, store.store())
})

// Register Alpine componentw
const alpineComponents = require.context('./alpine/components/', true, /\.js$/)

alpineComponents.keys().forEach((key) => {
  const component = alpineComponents(key).default

  // Component name will be named exactly as defined in the module
  const name = component.name

  Alpine.data(name, component.component)
})

// Register Alpine Magic Properties

const alpineMagic = require.context('./alpine/magic/', true, /\.js$/)

alpineMagic.keys().forEach((key) => {
  const magic = alpineMagic(key).default

  // Magic name will be named exactly as defined in the module
  const name = magic.name

  Alpine.magic(name, magic.callback)
})

// Register Alpine directives

const alpineDirectives = require.context('./alpine/directives/', true, /\.js$/)

alpineDirectives.keys().forEach((key) => {
  const directive = alpineDirectives(key).default

  // Magic name will be named exactly as defined in the module
  const name = directive.name

  Alpine.directive(name, directive.callback)
})

Alpine.start()