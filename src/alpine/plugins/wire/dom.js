export function insertNodesBefore(parentNode, insertBefore, fragment) {
  while (fragment.childNodes.length > 0) {
    var child = fragment.firstChild;
    parentNode.insertBefore(child, insertBefore);
  }
}