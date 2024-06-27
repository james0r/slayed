export default {
  name: 'global',
  store() {
    return {
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      isPredictiveSearchVisible: false,
      isPromoBarVisible: true,
      isWindowScrolled: false,
      cart: null,
      init() {
        console.log('Slayed Global Store Initialized.')

        window.addEventListener('scroll', this.throttle(this.onWindowScrollHandler.bind(this), 200))

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
        const isScrolled = window.scrollY > 0

        console.log(window.scrollY)

        // Hide promo bar when scrolling down more than 100px
        if (window.scrollY > 100) {
          this.isPromoBarVisible = false
        } else {
          this.isPromoBarVisible = true
        }

        this.isWindowScrolled = isScrolled
        document.body.classList[isScrolled ? 'add' : 'remove']('scrolled')
      },
      throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function (...args) {
          const context = this;
          if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
          } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
              if ((Date.now() - lastRan) >= limit) {
                func.apply(context, args);
                lastRan = Date.now();
              }
            }, limit - (Date.now() - lastRan));
          }
        };
      }
    }
  }
}