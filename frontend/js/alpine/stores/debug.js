export default {
  name: 'debug',
  store() {
    return {
      enabled: false,
      init() {
        if (this.enabled) {
          this.initA11yDebugging()
        }
      },
      initA11yDebugging() {
        let focusable = this.getKeyboardFocusableElements()
          
        focusable.forEach((element) => {
          element.addEventListener('focus', function(e) {
            console.log(e.target)
          }) 
        })
      },
      getKeyboardFocusableElements (element = document) {
        return [...element.querySelectorAll(
          'a[href], button, input, textarea, select, details,[tabindex]:not([tabindex="-1"])'
        )]
          .filter(el => !el.hasAttribute('disabled') && !el.getAttribute("aria-hidden"))
       }
    }
  }
}