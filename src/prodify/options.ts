import { OPTION_CONTAINER_SELECTOR } from './const'

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

function updateCurrentOptions() {
  if (this.pickerType == 'select') {
    this.options = Array.from(this.el.querySelectorAll('select'), (select: HTMLInputElement) => select.value)
    return
  }

  this.optionContainers = Array.from(this.el.querySelectorAll(OPTION_CONTAINER_SELECTOR))
  this.options = this.optionContainers.map((optionContainer) => {
    return (Array.from(optionContainer.querySelectorAll('input')).find((radio: HTMLInputElement) => radio.checked) as HTMLInputElement).value
  })
}

export {
  maybeSetOptionSelected,
  updateCurrentOptions
}