import { insertNodesBefore } from './dom';
import Alpine from 'alpinejs'

export function SwapOuterHTML(target, fragment, onSettleCallback) {
  if (target.tagName === "BODY") {
    return SwapInnerHTML(target, fragment, onSettleCallback);
  } else {
    // @type {HTMLElement}

    if (Alpine.morph) {
      Alpine.morph(target, fragment)
    } else {
      target.replaceWith(fragment)
    }
  }

  return onSettleCallback()
}

export function SwapAfterBegin(target, fragment, onSettleCallback) {
  insertNodesBefore(target, target.firstChild, fragment)
  return onSettleCallback()
}

export function SwapBeforeBegin(target, fragment, onSettleCallback) {
  insertNodesBefore(parentElt(target), target, fragment)
  return onSettleCallback()
}

export function SwapBeforeEnd(target, fragment, onSettleCallback) {
  insertNodesBefore(target, null, fragment);
  return onSettleCallback()
}

export function SwapAfterEnd(target, fragment, onSettleCallback) {
  insertNodesBefore(target.parentElement, target.nextSibling, fragment);
  return onSettleCallback()
}

export function SwapInnerHTML(target, fragment, onSettleCallback) {
  var firstChild = target.firstChild;
  insertNodesBefore(target, firstChild, fragment);

  if (firstChild) {
    while (firstChild.nextSibling) {
      target.removeChild(firstChild.nextSibling);
    }
    target.removeChild(firstChild);
  }

  onSettleCallback();
}