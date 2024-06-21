export const hasBodyClass = (className) => {
  return document.body.classList.contains(className)
}

export default {
  /**
   * Emit a custom event
   * @param  {String} type   The event type
   * @param  {Object} detail Any details to pass along with the event
   * @param  {Node}   elem   The element to attach the event to
   */
  emitEvent(type, detail = {}, elem = document) {
    if (!type) return

    let event = new CustomEvent(type, {
      bubbles: true,
      cancelable: true,
      detail: detail,
    })

    return elem.dispatchEvent(event)
  },
  randomNumber(min = 0, max = 1000) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  debounce(fn, wait) {
    let t
    return (...args) => {
      clearTimeout(t)
      t = setTimeout(() => fn.apply(this, args), wait)
    }
  },
  truncateLongTitle(input) {
    return input.length > 5 ? `${input.substring(0, 18)}...` : input
  },
  async fetchHTML(endpoint) {
    return await fetch(endpoint)
      .then((response) => response.text())
      .then((responseText) => {
        return new DOMParser().parseFromString(responseText, 'text/html')
      })
  },
}
