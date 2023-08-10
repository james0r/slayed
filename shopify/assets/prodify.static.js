class SlayedProdify {
  constructor() {
    this.el = document.querySelector('[data-prodify]')
    this.pickerType = this.el.dataset.prodify

    this.selectors = {
      priceContainer: '[data-prodify-price-container]',
      mediaContainer: '[data-prodify-media-container]',
      variantsJson: '[data-prodify-variants-json]',
      optionContainer: '[data-prodify-option-container]',
      productForm: '[data-prodify-product-form]',
      quantityIncrement: '[data-prodify-quantity-increment]',
      quantityDecrement: '[data-prodify-quantity-decrement]',
      quantityPresentation: '[data-prodify-quantity-presentation]',
    }

    this.textStrings = {
      addToCart: 'Add to Cart',
      unavailableVariantLabel: '[value] - Unavailable',
      addButtonTextUnavailable: 'Unavailable',
    }

    this.quantityIncrementButton = this.el.querySelector(this.selectors.quantityIncrement)
    this.quantityDecrementButton = this.el.querySelector(this.selectors.quantityDecrement)
    this.quantityPresentationInput = this.el.querySelector(this.selectors.quantityPresentation)
    this.quantityHiddenInput = this.el.querySelector('input[name="quantity"]')

    if (this.quantityIncrementButton && this.quantityDecrementButton && this.quantityPresentationInput) {
      this.initQuantityControls()
    }
    
    this.el.addEventListener('change', this.onVariantChange)
  }

  initQuantityControls = () => {
    this.quantityIncrementButton.addEventListener('click', () => {
      this.updateQuantity('up')
    })

    this.quantityDecrementButton.addEventListener('click', () => {
      this.updateQuantity('down')
    })
  }

  updateQuantity = (stepDirection) => {
    const previousQuantity = parseInt(this.quantityPresentationInput.value)

    if (stepDirection == 'up') {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value = previousQuantity + 1
    } else {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value = Math.max(1, previousQuantity - 1)
    }
  }

  onVariantChange = () => {
    this.updateOptions()
    this.updateMasterId()
    this.toggleAddButton(true, '', false)
    this.updateVariantStatuses()

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true)
      this.setUnavailable()
    } else {
      this.updateURL()
      this.updateVariantInput()
      this.swapProductInfo()
    }
  }

  onQuantityClick = (event) => {
    console.log(event.currentTarget)
  }

  updateURL() {
    if (!this.currentVariant || this.el.dataset.updateUrl === 'false') return
    window.history.replaceState({}, '', `${this.el.dataset.url}?variant=${this.currentVariant.id}`)
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(this.selectors.productForm)
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      // input.dispatchEvent(new Event('change', { bubbles: true }));
    })
  }

  setUnavailable() {
    const productForm = document.querySelector(this.selectors.productForm)
    const addButton = productForm.querySelector('[name="add"]')
    const addButtonText = productForm.querySelector('[name="add"] > span')
    const price = document.querySelector(this.selectors.priceContainer)

    if (!addButton) return
    addButtonText.textContent = this.textStrings.addButtonTextUnavailable
    if (price) price.classList.add('visibility-hidden')
  }

  updateMasterId = () => {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option
        })
        .includes(false)
    })
  }

  swapProductInfo = () => {
    window.slayed.helpers
      .fetchHTML(
        `${this.el.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.el.dataset.section}`
      )
      .then((responseHTML) => {
        const priceSource = responseHTML.querySelector(this.selectors.priceContainer)
        const priceTarget = this.el.querySelector(this.selectors.priceContainer)
        const mediaSource = responseHTML.querySelector(this.selectors.mediaContainer)
        const mediaTarget = this.el.querySelector(this.selectors.mediaContainer)
        const addButtonSource = responseHTML.querySelector(
          `${this.selectors.productForm} [name="add"]`
        )
        const addButtonTarget = this.el.querySelector(`${this.selectors.productForm} [name="add"]`)

        if (priceSource && priceTarget) {
          priceTarget.replaceWith(priceSource)
        }

        if (mediaSource && mediaTarget) {
          mediaTarget.replaceWith(mediaSource)
        }

        if (addButtonSource && addButtonTarget) {
          addButtonTarget.replaceWith(addButtonSource)
        }

        if (window.Drift) {
          this.reInitProductZoom()
        }
      })
  }

  reInitProductZoom() {
    if (window.productZoom) {
      window.productZoom.destroy()

      window.productZoom = new Drift(
        document.querySelector(`${window.productZoomContainerSelector} [data-zoom]`),
        {
          paneContainer: document.querySelector(`${window.productZoomContainerSelector}`),
          inlinePane: false,
        }
      )
    }
  }

  updateVariantStatuses() {
    const variantsMatchingOptionOneSelected = this.variantData.filter(
      (variant) => this.el.querySelector(':checked').value === variant.option1
    )
    const inputWrappers = [...this.el.querySelectorAll(this.selectors.optionContainer)]
    inputWrappers.forEach((option, index) => {
      if (index === 0) return
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value
      const availableOptionInputsValues = variantsMatchingOptionOneSelected
        .filter(
          (variant) => variant.available && variant[`option${index}`] === previousOptionSelected
        )
        .map((variantOption) => variantOption[`option${index + 1}`])

      this.setInputAvailability(optionInputs, availableOptionInputsValues)
    })
  }

  setInputAvailability(listOfOptions, listOfAvailableOptions) {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        if (this.pickerType == 'select') {
          input.innerText = input.getAttribute('value')
          return
        }
        input.classList.remove('disabled')
      } else {
        if (this.pickerType == 'select') {
          input.innerText = this.textStrings.unavailableVariantLabel.replace(
            '[value]',
            input.getAttribute('value')
          )
          return
        }
        input.classList.add('disabled')
      }
    })
  }

  getVariantData = () => {
    this.variantData =
      this.variantData || JSON.parse(this.el.querySelector(this.selectors.variantsJson).textContent)
    return this.variantData
  }

  updateOptions = () => {
    if (this.pickerType == 'select') {
      this.options = Array.from(this.el.querySelectorAll('select'), (select) => select.value)
      return
    }

    this.optionContainers = Array.from(this.el.querySelectorAll(this.selectors.optionContainer))
    this.options = this.optionContainers.map((optionContainer) => {
      return Array.from(optionContainer.querySelectorAll('input')).find((radio) => radio.checked)
        .value
    })
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
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
      addButtonText.textContent = this.textStrings.addButtonTextUnavailable
    }

    if (!modifyClass) return
  }
}

if (window.slayedNamespace && window[slayedNamespace]) {
  window[slayedNamespace].SlayedProdify = new SlayedProdify()
} else {
  window.SlayedProdify = new SlayedProdify()
}


