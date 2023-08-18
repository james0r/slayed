import {
  SwapInnerHTML,
  SwapOuterHTML,
  SwapAfterBegin,
  SwapBeforeBegin,
  SwapBeforeEnd,
  SwapAfterEnd,
} from './swap'

import { fetchHTML } from './xhr'

export default function (Alpine) {

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

  Alpine.magic('wire', (el, { Alpine }) => (endpoint, select, target, swapStyle = 'innerHTML', onSettleCallback = () => { }) => {
    endpoint = endpoint || window.location.href
    target = target ? document.querySelector(target) : el

    fetchHTML(endpoint).then((response) => {
      const fragment = select && response.querySelector(select) ? response.querySelector(select) : response.body

      swap(swapStyle, target, fragment, onSettleCallback)
    })
  })
}