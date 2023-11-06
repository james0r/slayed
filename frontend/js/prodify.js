class Prodify {
  constructor(settings) {
    this.settings = {
      ...settings
    }

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
      addToCart: window.variantStrings.addToCart,
      unavailableVariantValueLabel: window.variantStrings.unavailable_with_option,
      soldOutVariantValueLabel: window.variantStrings.soldout_with_option,
      addButtonTextUnavailable: window.variantStrings.unavailable,
    }

    this.quantityIncrementButton = this.el.querySelector(this.selectors.quantityIncrement)
    this.quantityDecrementButton = this.el.querySelector(this.selectors.quantityDecrement)
    this.quantityPresentationInput = this.el.querySelector(this.selectors.quantityPresentation)
    this.quantityHiddenInput = this.el.querySelector('input[name="quantity"]')

    this.initEventListeners()
  }

  initEventListeners = () => {
    this.el.addEventListener('change', this.onVariantChange)

    if (
      this.quantityIncrementButton &&
      this.quantityDecrementButton &&
      this.quantityPresentationInput
    ) {
      this.quantityIncrementButton.addEventListener('click', () => {
        this.updateQuantity('up')
      })

      this.quantityDecrementButton.addEventListener('click', () => {
        this.updateQuantity('down')
      })
    }
  }

  updateCurrentVariant = () => {
    const variants = this.getVariantData();
    const matchingVariant = variants.find(variant => {
      return variant.options.every((option, index) => {
        return this.options[index] === option;
      });
    });
    this.currentVariant = matchingVariant;
  };

  updateQuantity = (stepDirection) => {
    const previousQuantity = parseInt(this.quantityPresentationInput.value)

    if (stepDirection == 'up') {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value = previousQuantity + 1
    } else {
      this.quantityHiddenInput.value = this.quantityPresentationInput.value = Math.max(1, previousQuantity - 1)
    }
  }

  updateCurrentOptions = () => {
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

  updateVariantIdInput() {
    const productForms = document.querySelectorAll(this.selectors.productForm)
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      // input.dispatchEvent(new Event('change', { bubbles: true }));
    })
  }

  updateURL() {
    if (!this.currentVariant || this.el.dataset.updateUrl === 'false') return
    window.history.replaceState({}, '', `${this.el.dataset.url}?variant=${this.currentVariant.id}`)
  }

  updateAddButtonDom(disable = true, text, modifyClass = true) {
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

    if (disable) {
      addButton.classList.add('disabled')
    } else {
      addButton.classList.remove('disabled')
    }
  }

  onVariantChange = (event) => {

    this.updateCurrentOptions()
    this.updateCurrentVariant()
    this.updateAddButtonDom(true, '', false)
    this.compareInputValues()
    this.setOptionSelected(event.target)
    
    if (!this.currentVariant) {
      this.updateAddButtonDom(true, this.textStrings.addButtonTextUnavailable, true)
    } else {
      this.updateURL()
      this.updateVariantIdInput()
      this.swapProductInfo()
    }
  }

  setOptionSelected(select) {
    if (this.pickerType == 'select') {
      const options = Array.from(select.querySelectorAll('option'))
      const currentValue = select.value

      options.forEach((option) => {
        if (option.value === currentValue) {
          option.setAttribute('selected', 'selected')
        } else {
          option.removeAttribute('selected')
        }
      })
    }
  }

  compareInputValues() {
    const variantsMatchingOptionOneSelected = this.variantData.filter(
      // Grab the first checked input and compare it to the variant option1
      // return an array of variants where the option1 matches the checked input
      (variant) => this.el.querySelector(':checked').value === variant.option1
    )

    const inputWrappers = [...this.el.querySelectorAll(this.selectors.optionContainer)]
    inputWrappers.forEach((option, index) => {
      if (index === 0) return
      const optionInputs = [...option.querySelectorAll('input[type="radio"], option')]
      const previousOptionSelected = inputWrappers[index - 1].querySelector(':checked').value
      const availableOptionInputsValues = variantsMatchingOptionOneSelected
        .filter(
          // 
          (variant) => variant.available && variant[`option${index}`] === previousOptionSelected
        )
        .map((variantOption) => variantOption[`option${index + 1}`])

      const existingOptionInputsValues = variantsMatchingOptionOneSelected
        .filter(
          // 
          (variant) => variant[`option${index}`] === previousOptionSelected
        )
        .map((variantOption) => variantOption[`option${index + 1}`])

      this.setInputAvailability(optionInputs, availableOptionInputsValues, existingOptionInputsValues)
    })
  }

  setInputAvailability(optionInputs, availableOptionInputValues, existingOptionInputsValues) {
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
            input.innerText = this.textStrings.soldOutVariantValueLabel.replace(
              '[value]',
              input.getAttribute('value')
            )
            return
          }
          input.classList.add('disabled')
        } else {
          if (this.pickerType == 'select') {
            input.innerText = this.textStrings.unavailableVariantValueLabel.replace(
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

      })
  }

  getVariantData = () => {
    this.variantData =
      this.variantData || JSON.parse(this.el.querySelector(this.selectors.variantsJson).textContent)
    return this.variantData
  }
}

window.prodify = new Prodify()
