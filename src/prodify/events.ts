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
  const quantityIncrementButton = window.prodify.el.querySelector(QUANTITY_INCREMENT_SELECTOR)
  const quantityDecrementButton = window.prodify.el.querySelector(QUANTITY_DECREMENT_SELECTOR)
  const quantityPresentationInput = window.prodify.el.querySelector(QUANTITY_PRESENTATION_SELECTOR)
  const quantityHiddenInput = window.prodify.el.querySelector(QUANTITY_HIDDEN_INPUT_SELECTOR)
  
  window.prodify.el.addEventListener('change', onVariantChange)

  if (
    quantityIncrementButton &&
    quantityDecrementButton &&
    quantityPresentationInput
  ) {
    quantityIncrementButton.addEventListener('click', () => {
      updateQuantity('up')
    })

    quantityDecrementButton.addEventListener('click', () => {
      updateQuantity('down')
    })
  }
}

export {
  initEventListeners
}