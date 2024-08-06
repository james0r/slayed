import { updateQuantity } from './dom'
import {
  QUANTITY_INCREMENT_SELECTOR,
  QUANTITY_DECREMENT_SELECTOR,
  QUANTITY_PRESENTATION_SELECTOR,
  QUANTITY_HIDDEN_INPUT_SELECTOR,
} from './const'


import {
  onVariantChange
} from './variants'

function initEventListeners() {
  window.prodify.quantityIncrementButton = window.prodify.el.querySelector(QUANTITY_INCREMENT_SELECTOR)
  window.prodify.quantityDecrementButton = window.prodify.el.querySelector(QUANTITY_DECREMENT_SELECTOR)
  window.prodify.quantityPresentationInput = window.prodify.el.querySelector(QUANTITY_PRESENTATION_SELECTOR)
  window.prodify.quantityHiddenInput = window.prodify.el.querySelector(QUANTITY_HIDDEN_INPUT_SELECTOR)
  
  window.prodify.el.addEventListener('change', onVariantChange)

  if (
    window.prodify.quantityIncrementButton &&
    window.prodify.quantityDecrementButton &&
    window.prodify.quantityPresentationInput
  ) {
    window.prodify.quantityIncrementButton.addEventListener('click', () => {
      updateQuantity('up')
    })

    window.prodify.quantityDecrementButton.addEventListener('click', () => {
      updateQuantity('down')
    })
  }
}

export {
  initEventListeners
}