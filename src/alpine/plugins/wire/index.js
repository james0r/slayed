import {
  SwapInnerHTML,
  SwapOuterHTML,
  SwapAfterBegin,
  SwapBeforeBegin,
  SwapBeforeEnd,
  SwapAfterEnd,
} from './swap'

export default function (Alpine) {

  const getFragment = async (endpoint) => {
    return await fetch(endpoint)
      .then((response) => response.text())
      .then((responseText) => {
        return new DOMParser().parseFromString(responseText, 'text/html')
      })
  }

  function isValidCSSSelector(selector) {
    try {
      document.createDocumentFragment().querySelector(selector);
    } catch (e) {
      console.error(e)
      return false;
    }
    return true;
  }

  function swap(swapStyle, target, fragment, onSettleCallback) {
    switch (swapStyle) {
      case "none":
        return;
      case "outerHTML":
        SwapOuterHTML(target, fragment, onSettleCallback);
        return;
      case "afterbegin":
        SwapAfterBegin(target, fragment, onSettleCallback);
        return;
      case "beforebegin":
        SwapBeforeBegin(target, fragment, onSettleCallback);
        return;
      case "beforeend":
        SwapBeforeEnd(target, fragment, onSettleCallback);
        return;
      case "afterend":
        SwapAfterEnd(target, fragment, onSettleCallback);
        return;
      default:
        SwapInnerHTML(target, fragment, onSettleCallback);
        return
    }
  }

  Alpine.magic('wire', (el, { Alpine }) => (endpoint, select, target, swapStyle = 'innerHTML', onSettleCallback = () => {}) => {

    endpoint = endpoint || window.location.href
    target = isValidCSSSelector(target) ? document.querySelector(target) : el

    getFragment(endpoint).then((response) => {
      const fragment = isValidCSSSelector(select) ? response.querySelector(select) : response

      console.log(fragment)

      swap(swapStyle, target, fragment, onSettleCallback)
    })
  })
}