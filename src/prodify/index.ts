import {
  DATA_ATTR_PREFIX,
  ADD_BUTTON_TEXT_UNAVAILABLE_STRING
} from './const'

import {
  updateCurrentOptions,
} from './options'

import {
  initEventListeners
} from './events'

import {
  updateCurrentVariant
} from './variants'

import {
  updateDomAddButton
} from './dom'

import {
  compareInputValues
} from './helpers'

const el: HTMLElement = document.querySelector(`[${DATA_ATTR_PREFIX}]`)

if (!('prodify' in window) && el) {
  const pickerType: "select" | "radio" = el.dataset.prodify as "select" | "radio"

  (window as Window).prodify = {
    el: el,
    pickerType: pickerType,
  }

  updateCurrentOptions()
  updateCurrentVariant()
  compareInputValues()

  if (!(window as Window).prodify.currentVariant) {
    updateDomAddButton(true, ADD_BUTTON_TEXT_UNAVAILABLE_STRING, true)
  }

  initEventListeners()
}
