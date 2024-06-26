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
  const productForm = document.querySelector(this.selectors.productForm)
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
    input.value = this.currentVariant.id
    // input.dispatchEvent(new Event('change', { bubbles: true }));
  })
}

function setInputAvailability(optionInputs, availableOptionInputValues, existingOptionInputsValues) {
  optionInputs.forEach((input) => {
    if (availableOptionInputValues.includes(input.getAttribute('value'))) {
      if (this.pickerType == 'select') {
        input.innerText = input.getAttribute('value')
        return
      }
      input.classList.remove('disabled')
    } else {
      if (existingOptionInputsValues.includes(input.getAttribute('value'))) {
        if (this.pickerType == 'select') {
          input.innerText = SOLD_OUT_VARIANT_VALUE_STRING.replace(
            '[value]',
            input.getAttribute('value')
          )
          return
        }
        input.classList.add('disabled')
      } else {
        if (this.pickerType == 'select') {
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
  if (this.pickerType == 'select') {
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

function updateQuantity (stepDirection) {
  const previousQuantity = parseInt(this.quantityPresentationInput.value)

  if (stepDirection == 'up') {
    this.quantityHiddenInput.value = this.quantityPresentationInput.value = previousQuantity + 1
  } else {
    this.quantityHiddenInput.value = this.quantityPresentationInput.value = Math.max(1, previousQuantity - 1)
  }
}

function swapProductInfo() {
  fetchHTML(
    `${this.el.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.el.dataset.section}`
  )
    .then((responseHTML) => {
      const priceSource = responseHTML.querySelector(PRICE_CONTAINER_SELECTOR)
      const priceTarget = this.el.querySelector(PRICE_CONTAINER_SELECTOR)
      const mediaSource = responseHTML.querySelector(MEDIA_CONTAINER_SELECTOR)
      const mediaTarget = this.el.querySelector(MEDIA_CONTAINER_SELECTOR)
      const addButtonSource = responseHTML.querySelector(
        `${this.selectors.productForm} [name="add"]`
      )
      const addButtonTarget = this.el.querySelector(`${PRODUCT_FORM_SELECTOR} [name="add"]`)

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
