import {
  ADD_BUTTON_TEXT_UNAVAILABLE_STRING,
  SOLD_OUT_VARIANT_VALUE_STRING,
  UNAVAILABLE_VARIANT_VALUE_STRING,
  PRODUCT_FORM_SELECTOR,
  PRICE_CONTAINER_SELECTOR,
  MEDIA_CONTAINER_SELECTOR
} from './const'
import { fetchHTML } from './helpers'

function updateDomAddButton(disable = true, text, modifyClass = true) {
  const productForm = document.querySelector(PRODUCT_FORM_SELECTOR)
  
  if (!productForm) return

  const addButton = productForm.querySelector('[name="add"]')
  const addButtonText = productForm.querySelector('[name="add"] > span')

  if (!addButton) return

  if (disable) {
    addButton.setAttribute('disabled', 'disabled')
    if (text) addButtonText.textContent = text
  } else {
    addButton.removeAttribute('disabled')
    addButtonText.textContent = ADD_BUTTON_TEXT_UNAVAILABLE_STRING
  }

  if (!modifyClass) return

  if (disable) {
    addButton.classList.add('disabled')
  } else {
    addButton.classList.remove('disabled')
  }
}

function updateVariantIdInput() {
  const productForms = document.querySelectorAll(PRODUCT_FORM_SELECTOR)
  productForms.forEach((productForm) => {
    const input: HTMLInputElement = productForm.querySelector('input[name="id"]')
    input.value = (window.prodify.currentVariant.id) as unknown as string
    // input.dispatchEvent(new Event('change', { bubbles: true }));
  })
}

function setInputAvailability(optionInputs, availableOptionInputValues, existingOptionInputsValues) {
  optionInputs.forEach((input) => {
    if (availableOptionInputValues.includes(input.getAttribute('value'))) {
      if (window.prodify.pickerType == 'select') {
        input.innerText = input.getAttribute('value')
        return
      }
      input.classList.remove('disabled')
    } else {
      if (existingOptionInputsValues.includes(input.getAttribute('value'))) {
        if (window.prodify.pickerType == 'select') {
          input.innerText = SOLD_OUT_VARIANT_VALUE_STRING.replace(
            '[value]',
            input.getAttribute('value')
          )
          return
        }
        input.classList.add('disabled')
      } else {
        if (window.prodify.pickerType == 'select') {
          input.innerText = UNAVAILABLE_VARIANT_VALUE_STRING.replace(
            '[value]',
            input.getAttribute('value')
          )
          return
        }
        input.classList.add('disabled')
      }
    }
  })
}

function maybeSetOptionSelected(select) {
  if (window.prodify.pickerType == 'select') {
    const options = Array.from(select.querySelectorAll('option'))
    const currentValue = select.value

    options.forEach((option: HTMLOptionElement) => {
      if (option.value === currentValue) {
        option.setAttribute('selected', 'selected')
      } else {
        option.removeAttribute('selected')
      }
    })
  }
}

function updateQuantity(stepDirection) {
  const previousQuantity = parseInt(window.prodify.quantityPresentationInput.value)

  if (stepDirection == 'up') {
    window.prodify.quantityHiddenInput.value = window.prodify.quantityPresentationInput.value = (previousQuantity + 1) as unknown as string
  } else {
    window.prodify.quantityHiddenInput.value = window.prodify.quantityPresentationInput.value = (Math.max(1, previousQuantity - 1)) as unknown as string
  }
}

function swapProductInfo() {
  fetchHTML(
    `${window.prodify.el.dataset.url}?variant=${window.prodify.currentVariant.id}&section_id=${window.prodify.el.dataset.section}`
  )
    .then((responseHTML) => {
      const priceSource = responseHTML.querySelector(PRICE_CONTAINER_SELECTOR)
      const priceTarget = window.prodify.el.querySelector(PRICE_CONTAINER_SELECTOR)
      const mediaSource = responseHTML.querySelector(MEDIA_CONTAINER_SELECTOR)
      const mediaTarget = window.prodify.el.querySelector(MEDIA_CONTAINER_SELECTOR)
      const addButtonSource = responseHTML.querySelector(
        `${PRODUCT_FORM_SELECTOR} [name="add"]`
      )
      const addButtonTarget = window.prodify.el.querySelector(`${PRODUCT_FORM_SELECTOR} [name="add"]`)

      if (priceSource && priceTarget) {
        priceTarget.replaceWith(priceSource)
      }

      if (mediaSource && mediaTarget) {
        mediaTarget.replaceWith(mediaSource)
      }

      if (addButtonSource && addButtonTarget) {
        addButtonTarget.replaceWith(addButtonSource)
      }

    })
}

export {
  updateQuantity,
  swapProductInfo,
  updateVariantIdInput,
  updateDomAddButton,
  setInputAvailability,
  maybeSetOptionSelected
}
