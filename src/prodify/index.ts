import {
  DATA_ATTR_PREFIX,
  QUANTITY_INCREMENT_SELECTOR,
  QUANTITY_DECREMENT_SELECTOR,
  QUANTITY_PRESENTATION_SELECTOR,
  QUANTITY_HIDDEN_INPUT_SELECTOR
} from './const'

import {
  onVariantChange
} from './variants'

import {
  updateQuantity
} from './dom'

export const el: HTMLElement = document.querySelector(DATA_ATTR_PREFIX)
export const pickerType = el.dataset.prodify

export const quantityIncrementButton = el.querySelector(QUANTITY_INCREMENT_SELECTOR)
export const quantityDecrementButton = el.querySelector(QUANTITY_DECREMENT_SELECTOR)
export const quantityPresentationInput = el.querySelector(QUANTITY_PRESENTATION_SELECTOR)
export const quantityHiddenInput = el.querySelector(QUANTITY_HIDDEN_INPUT_SELECTOR)

if (!('prodify' in window)) {
  (window as Window).prodify = {}

  el.addEventListener('change', onVariantChange)

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