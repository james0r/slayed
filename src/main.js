import Alpine from 'alpinejs'
import helpers from './helpers.js'
import focus from '@alpinejs/focus'
import './a11y.js'
import './css/site.css'

window.Alpine = Alpine

const ns = 'slayed' 

window[ns] = (window[ns] || {})
window[ns].helpers = helpers

for (const [key, value] of Object.entries(helpers)) {
  window[ns].helpers[key] = value
}

// Alpine plugins
Alpine.plugin(focus)

// Alpine stores
const alpineStores = import.meta.glob('./alpine/stores/*.js', { eager: true, import: 'default' })

for (const path in alpineStores) {
  const store = alpineStores[path]
  
  const name = store.name
  
  Alpine.store(name, store.store())
}

// Alpine components
const alpineComponents = import.meta.glob('./alpine/components/*.js', { eager: true, import: 'default' })

for (const path in alpineComponents) {
  const component = alpineComponents[path]
  
  const name = component.name
  
  Alpine.data(name, component.component)
}

// Alpine directives
const alpineDirectives = import.meta.glob('./alpine/directives/*.js', { eager: true, import: 'default' })

for (const path in alpineDirectives) {
  const directive = alpineDirectives[path]
    
  Alpine.directive(directive.name, directive.callback)
}

// Alpine magic
const alpineMagic = import.meta.glob('./alpine/magic/*.js', { eager: true, import: 'default' })

for (const path in alpineMagic) {
  const magic = alpineMagic[path]
  
  const name = magic.name
  
  Alpine.magic(name, magic.callback)
}

// Hide the Shopify preview bar when in development
// if (process.env.NODE_ENV === 'development') {
//   //
//   window.addEventListener('DOMContentLoaded', () => {
//     var css = '#preview-bar-iframe { display: none !important; }',
//       head = document.head || document.getElementsByTagName('head')[0],
//       style = document.createElement('style')

//     head.appendChild(style)

//     style.appendChild(document.createTextNode(css))
//   })
// }

Alpine.start() 