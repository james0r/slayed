export default {
  name: 'global',
  store() {
    return {
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      isPredictiveSearchVisible: false,
      isWindowScrolled: false,
      cart: null,
      init() {
        console.log('Slayed Global Store Initialized.')

        window.addEventListener('scroll', this.onWindowScrollHandler.bind(this))

        this.initLiquidAJaxCart()
      },
      get bodyClasses() {
        let classes = []

        if (this.isMobileMenuVisible) {
          classes.push('mobile-menu-visible')
        }

        return classes || ''
      },
      openMobileMenu() {
        this.isMobileMenuVisible = true
      },
      closeMobileMenu() {
        this.isMobileMenuVisible = false
      },
      toggleMobileMenu() {
        this.isMobileMenuVisible = !this.isMobileMenuVisible
      },
      initLiquidAJaxCart() {
        document.addEventListener("liquid-ajax-cart:request-end", (event) => {
          const { requestState, cart, previousCart, sections } = event.detail;

          if (requestState.requestType === 'add') {
            if (requestState.responseData?.ok) {
              this.isMinicartVisible = true
            }
          }

          this.cart = cart
        });
      },
      onWindowScrollHandler() {
        var scrollTop =
          window.scrollY !== undefined
            ? window.scrollY
            : (document.documentElement || document.body.parentNode || document.body).scrollTop

        if (scrollTop > 0) {
          // document.body.classList.add('scrolled') 
          this.isWindowScrolled = true
        } else {
          // document.body.classList.remove('scrolled')
          this.isWindowScrolled = false
        }
      },
    }
  }
}