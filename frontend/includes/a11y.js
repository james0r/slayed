// Let the document know when the mouse is being used
document.body.addEventListener('mousedown', function() {
  document.body.classList.add('using-mouse');
});

// Re-enable focus styling when Tab is pressed
document.body.addEventListener('keydown', function(event) {
  if (event.keyCode === 9) {
    document.body.classList.remove('using-mouse');
  }
});

// Switch this flag to true to enable a11y debugging
const a11yDebug = false

function getKeyboardFocusableElements (element = document) {
 return [...element.querySelectorAll(
   'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
 )]
   .filter(el => !el.hasAttribute('disabled') && !el.getAttribute("aria-hidden"))
}
if (a11yDebug) {
  let focusable = getKeyboardFocusableElements()
  
  focusable.forEach((element) => {
    element.addEventListener('focus', function(e) {
      console.log(e.target)
    }) 
  })
}
