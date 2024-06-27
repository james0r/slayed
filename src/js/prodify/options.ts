import { OPTION_CONTAINER_SELECTOR } from './const'

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

function updateCurrentOptions() {
  if (window.prodify.pickerType == 'select') {
    window.prodify.options = Array.from(window.prodify.el.querySelectorAll('select'), (select: HTMLSelectElement) => select.value)
    return
  }

  window.prodify.optionContainers = Array.from(window.prodify.el.querySelectorAll(OPTION_CONTAINER_SELECTOR))
  window.prodify.options = window.prodify.optionContainers.map((optionContainer) => {
    return (Array.from(optionContainer.querySelectorAll('input')).find((radio: HTMLInputElement) => radio.checked) as HTMLInputElement).value
  })
}

export {
  maybeSetOptionSelected,
  updateCurrentOptions
}