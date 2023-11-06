import "liquid-ajax-cart";

import Alpine from 'alpinejs'
import AlpineCollapse from '@alpinejs/collapse'
import AlpineFocus from '@alpinejs/focus'
import AlpineMorph from '@alpinejs/morph'
import AlpineWire from '../js/alpine/plugins/wire'
import AlpineGlobals from '../js/alpine/index.js'
import helpers, { hasBodyClass } from '../js/helpers.js'

// Dynamic imports
hasBodyClass('product-template') && import('../js/prodify.js')

const ns = 'slayed'

window.slayedNamespace = ns
window[ns] = (window[ns] || {})
window[ns].helpers = helpers

for (const [key, value] of Object.entries(helpers)) {
  window[ns].helpers[key] = value
}

// Register and initialize AlpineJS
window.Alpine = Alpine

Alpine.plugin(
  [
    AlpineCollapse,
    AlpineFocus,
    AlpineWire,
    AlpineMorph
  ]
)
AlpineGlobals.register(Alpine)
Alpine.start()

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

