class Prodify {
  constructor(settings) {
    this.settings = {
      showSoldOutLabels: false,
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
      soldOutVariantValueLabel: '[value] - Sold Out',
      addButtonTextUnavailable: window.variantStrings.unavailable,
    }

    this.quantityIncrementButton = this.el.querySelector(this.selectors.quantityIncrement)
    this.quantityDecrementButton = this.el.querySelector(this.selectors.quantityDecrement)
    this.quantityPresentationInput = this.el.querySelector(this.selectors.quantityPresentation)
    this.quantityHiddenInput = this.el.querySelector('input[name="quantity"]')

    this.initEventListeners()

    // this.el.dispatchEvent(new Event('change'));
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

  getAvailableVariantsOptions(array, option, value) {
    let availableOptions = array.filter(item => item[option] === value && item.available === true).map(item => {
      let options = {};
      for (let i = 1; i <= 3; i++) {
        options[`option${i}`] = item[`option${i}`];
      }
      return options;
    });
    return availableOptions;
  }

  getAllMatchingVariantsOptions(array, option, value) {
    let allVariants = array.filter(item => item[option] === value).map(item => {
      let options = {};
      for (let i = 1; i <= 3; i++) {
        options[`option${i}`] = item[`option${i}`];
      }
      return options;
    });
    return allVariants;
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

  updateVariantInput() {
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
    this.lastSelectedOption = event.target.querySelector('option:checked')

    this.latestOptionPosition = this.lastSelectedOption.dataset.optionPosition
    this.latestOptionValue = this.lastSelectedOption.value

    const allOptionElements = Array.from(this.el.querySelectorAll(`option`))

    allOptionElements.forEach((option) => {
      option.innerHTML = option.value + ' - Unavailable'
    })

    const allMatchingVariantsOptions = this.getAllMatchingVariantsOptions(this.getVariantData(), `${this.latestOptionPosition}`, this.latestOptionValue)

    allMatchingVariantsOptions.forEach((option) => {

      for (const [key, value] of Object.entries(option)) {
        const optionEl = document.querySelector(`option[data-option-position="${key}"][value="${value}"]`)
        optionEl.innerHTML = value + ' - Sold out'
      }
    })

    const availableVariantsOptions = this.getAvailableVariantsOptions(this.getVariantData(), `${this.latestOptionPosition}`, this.latestOptionValue)

    availableVariantsOptions.forEach((option) => {
      
      for (const [key, value] of Object.entries(option)) {
        const optionEl = document.querySelector(`option[data-option-position="${key}"][value="${value}"]`)
        optionEl.innerHTML = value
      }
    })

    this.updateCurrentOptions()
    this.updateCurrentVariant()
    this.updateAddButtonDom(true, '', false)

    if (!this.currentVariant) {
      this.updateAddButtonDom(true, this.textStrings.addButtonTextUnavailable, true)
    } else {
      this.updateURL()

      this.swapProductInfo()
    }
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

  getVariantData = () => {
    this.variantData =
      this.variantData || JSON.parse(this.el.querySelector(this.selectors.variantsJson).textContent)
    return this.variantData
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.prodify = new Prodify({
    showSoldOutLabels: false
  })
})
