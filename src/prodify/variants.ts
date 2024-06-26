import { updateCurrentOptions } from './options'
import {
  updateDomAddButton,
  maybeSetOptionSelected,
  updateVariantIdInput,
  swapProductInfo
} from './dom'
import { compareInputValues, updateURL } from './helpers'
import { ADD_BUTTON_TEXT_UNAVAILABLE_STRING } from './const'

function updateCurrentVariant() {
  const variants = this.getVariantData()
  const matchingVariant = variants.find(
    variant => {
      return variant.options.every((option, index) => {
        return this.options[index] === option
      })
    })
  this.currentVariant = matchingVariant
}

function onVariantChange(event) {
  updateCurrentOptions()
  updateCurrentVariant()
  updateDomAddButton(true, '', false)
  compareInputValues()
  maybeSetOptionSelected(event.target)

  if (!this.currentVariant) {
    updateDomAddButton(true, ADD_BUTTON_TEXT_UNAVAILABLE_STRING, true)
  } else {
    updateURL()
    updateVariantIdInput()
    swapProductInfo()
  }
}

export {
  updateVariantIdInput,
  updateCurrentVariant,
  onVariantChange
}