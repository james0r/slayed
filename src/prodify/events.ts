import { updateQuantity } from './dom'
import {
  quantityIncrementButton,
  quantityDecrementButton,
  quantityPresentationInput,
  quantityHiddenInput
} from './index'

import {
  onVariantChange
} from './variants'

function initEventListeners() {
  this.el.addEventListener('change', onVariantChange)

  if (
    quantityIncrementButton &&
    quantityDecrementButton &&
    quantityPresentationInput
  ) {
    this.quantityIncrementButton.addEventListener('click', () => {
      updateQuantity('up')
    })

    this.quantityDecrementButton.addEventListener('click', () => {
      updateQuantity('down')
    })
  }
}

export {
  initEventListeners
}