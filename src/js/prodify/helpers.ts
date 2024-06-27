import { OPTION_CONTAINER_SELECTOR } from './const'
import { setInputAvailability } from './dom'

async function fetchHTML(endpoint) {
  return await fetch(endpoint)
    .then((response) => response.text())
    .then((responseText) => {
      return new DOMParser().parseFromString(responseText, 'text/html')
    })
}

function compareInputValues() {
  const variantsMatchingOptionOneSelected = window.prodify.variantData.filter(
    // Grab the first checked input and compare it to the variant option1
    // return an array of variants where the option1 matches the checked input
    (variant) => (window.prodify.el.querySelector(':checked') as HTMLInputElement).value === variant.option1
  )

  const inputWrappers = Array.from(window.prodify.el.querySelectorAll(OPTION_CONTAINER_SELECTOR))

  inputWrappers.forEach((option, index) => {
    if (index === 0) return
    const optionInputs = Array.from(option.querySelectorAll('input[type="radio"], option'))
    const previousOptionSelected = (inputWrappers[index - 1].querySelector(':checked') as HTMLInputElement).value
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

    setInputAvailability(optionInputs, availableOptionInputsValues, existingOptionInputsValues)
  })
}

function updateURL() {
  if (!window.prodify.currentVariant || window.prodify.el.dataset.updateUrl === 'false') return
  window.history.replaceState({}, '', `${window.prodify.el.dataset.url}?variant=${window.prodify.currentVariant.id}`)
}

export {
  fetchHTML,
  compareInputValues,
  updateURL
}