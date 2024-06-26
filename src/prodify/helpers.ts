async function fetchHTML(endpoint) {
  return await fetch(endpoint)
    .then((response) => response.text())
    .then((responseText) => {
      return new DOMParser().parseFromString(responseText, 'text/html')
    })
}

function compareInputValues() {
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

function updateURL() {
  if (!this.currentVariant || this.el.dataset.updateUrl === 'false') return
  window.history.replaceState({}, '', `${this.el.dataset.url}?variant=${this.currentVariant.id}`)
}

export {
  fetchHTML,
  compareInputValues,
  updateURL
}