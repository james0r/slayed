class Prodify {
  constructor() {
    this.el = document.querySelector('[x-prodify]')
    this.el.addEventListener('change', this.onVariantChange)
    this.priceContainerSelector = '[x-prodify-price-container]'
    this.mediaContainerSelector = '[x-prodify-media-container]'
    this.variantsJsonSelector = '[x-prodify-variants-json]'
    this.optionContainerSelector = '[x-prodify-option-container]'
    this.productFormSelector = '[x-prodify-product-form]'
    this.addButtonTextUnavailable = 'Unavailable'
  }

  onVariantChange = () => {
    this.updateOptions()
    this.updateMasterId()
    this.toggleAddButton(true, '', false);

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateURL();
      this.updateVariantInput();
      this.swapProductInfo();
    }
    // swapProductInfo(handle, sectionId, getMatchingVariantIfExists().id)
  }

  updateURL() {
    if (!this.currentVariant || this.el.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.el.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(this.productFormSelector);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      // input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  setUnavailable() {
    const productForm = document.querySelector(this.productFormSelector);
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    const price = document.querySelector(this.priceContainerSelector);
    // const inventory = document.getElementById(`Inventory-${this.dataset.section}`);
    // const sku = document.getElementById(`Sku-${this.dataset.section}`);

    if (!addButton) return;
    addButtonText.textContent = this.addButtonTextUnavailable;
    if (price) price.classList.add('visibility-hidden');
    // if (inventory) inventory.classList.add('visibility-hidden');
    // if (sku) sku.classList.add('visibility-hidden');
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
    fetch(`${this.el.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.el.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const responseHTML = new DOMParser().parseFromString(responseText, 'text/html')
        const priceSource = responseHTML.querySelector(this.priceContainerSelector)
        const priceTarget = this.el.querySelector(this.priceContainerSelector)
        const mediaSource = responseHTML.querySelector(this.mediaContainerSelector)
        const mediaTarget = this.el.querySelector(this.mediaContainerSelector)
        console.log(`${this.productFormSelector} [name="add"]`)
        const addButtonSource = responseHTML.querySelector(`${this.productFormSelector} [name="add"]`)
        const addButtonTarget = this.el.querySelector(`${this.productFormSelector} [name="add"]`)

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

  updateVariantStatuses = () => {
    const variantsMatchingOptionOneSelected = [...variants].filter(
      (variant) => this.el.querySelector(':checked').value === variant.option1
    )
    let variantMatchingAllSelectedOptions = [...variants]

    optionContainers.forEach((optionContainer, index) => {
      if (index === 0) return
      variantMatchingAllSelectedOptions = variantMatchingAllSelectedOptions.filter((variant) => {
        return optionContainer.querySelector(':checked').value === variant[`option${index + 1}`]
      })

      const currentOptionContainerInputs = [
        ...optionContainer.querySelectorAll('input[type="radio"]'),
      ]
      const previousOptionSelected = optionContainers[index - 1].querySelector(':checked').value
      const availableOptionInputsValues = variantsMatchingOptionOneSelected
        .filter(
          (variant) => variant.available && variant[`option${index}`] === previousOptionSelected
        )
        .map((variantOption) => variantOption[`option${index + 1}`])
      setInputAvailability(currentOptionContainerInputs, availableOptionInputsValues)
    })
  }

  setInputAvailability = (listOfOptions, listOfAvailableOptions) => {
    listOfOptions.forEach((input) => {
      if (listOfAvailableOptions.includes(input.getAttribute('value'))) {
        input.classList.remove('disabled')
      } else {
        input.classList.add('disabled')
      }
    })
  }

  getVariantData = () => {
    this.variantData =
      this.variantData || JSON.parse(this.el.querySelector(this.variantsJsonSelector).textContent)
    return this.variantData
  }

  updateOptions = () => {
    const optionContainers = Array.from(this.el.querySelectorAll(this.optionContainerSelector))
    this.options = optionContainers.map((optionContainer) => {
      return Array.from(optionContainer.querySelectorAll('input')).find((radio) => radio.checked)
        .value
    })
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.querySelector(this.productFormSelector);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');
    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = this.addButtonTextUnavailable;
    }

    if (!modifyClass) return;
  }
}

new Prodify()
