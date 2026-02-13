import "liquid-ajax-cart";

import Alpine from 'alpinejs'
import AlpineCollapse from '@alpinejs/collapse'
import AlpineFocus from '@alpinejs/focus'
import AlpineMorph from '@alpinejs/morph'
import AlpineGlobals from '../js/alpine/index.js'
import helpers, { hasBodyClass } from '../js/helpers.js'

// Uncomment to use to load the dynamic script demo
// hasBodyClass('product-template') && import('../js/dynamicScript')

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
    AlpineMorph
  ]
)
AlpineGlobals.register(Alpine)
Alpine.start()

// Hide the Shopify preview bar in development
if (process.env.NODE_ENV === 'development') {
  //
  window.addEventListener('DOMContentLoaded', () => {
    var css = '#preview-bar-iframe { display: none !important; }',
      headEl = document.head || document.getElementsByTagName('head')[0],
      styleEl = document.createElement('style')

    headEl.appendChild(styleEl)

    styleEl.appendChild(document.createTextNode(css))
  })
}

