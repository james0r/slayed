import Alpine from 'alpinejs'
import AlpineCollapse from '@alpinejs/collapse'
import AlpineFocus from '@alpinejs/focus'
import AlpineGlobals from './alpine/index.js'

import helpers from './helpers.js'
import './a11y.js'
import './css/site.css'

const ns = 'slayed' 

window[ns] = (window[ns] || {})
window[ns].helpers = helpers

for (const [key, value] of Object.entries(helpers)) {
  window[ns].helpers[key] = value
}

// Register and initialize AlpineJS
window.Alpine = Alpine

Alpine.plugin([AlpineCollapse, AlpineFocus])
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

