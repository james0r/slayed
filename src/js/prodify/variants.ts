import { updateCurrentOptions } from './options'
import {
  updateDomAddButton,
  maybeSetOptionSelected,
  updateVariantIdInput,
  swapProductInfo
} from './dom'
import { compareInputValues, updateURL } from './helpers'
import {
  ADD_BUTTON_TEXT_UNAVAILABLE_STRING,
  VARIANTS_JSON_SELECTOR
} from './const'

function updateCurrentVariant() {
  const variants = getVariantData()
  const matchingVariant = variants.find(
    variant => {
      return variant.options.every((option, index) => {
        return window.prodify.options[index] === option
      })
    })
  window.prodify.currentVariant = matchingVariant
}

function onVariantChange(event) {
  updateCurrentOptions()
  updateCurrentVariant()
  updateDomAddButton(true, '', false)
  compareInputValues()
  maybeSetOptionSelected(event.target)

  if (!window.prodify.currentVariant) {
    updateDomAddButton(true, ADD_BUTTON_TEXT_UNAVAILABLE_STRING, true)
  } else {
    updateURL()
    updateVariantIdInput()
    swapProductInfo()
  }
}

function getVariantData() {
  window.prodify.variantData = window.prodify.variantData
    || JSON.parse(
      window.prodify.el.querySelector(VARIANTS_JSON_SELECTOR).textContent
    )
  return window.prodify.variantData
}

export {
  updateVariantIdInput,
  updateCurrentVariant,
  onVariantChange,
  getVariantData
}