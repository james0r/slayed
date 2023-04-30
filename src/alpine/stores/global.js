export default {
  name: 'global',
  store() {
    return {
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      isPredictiveSearchVisible: false,
      isWindowScrolled: false,
      init() {
        console.log('Slayed Global Store Initialized.')

        window.addEventListener('scroll', this.onWindowScrollHandler.bind(this))
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
      onWindowScrollHandler() {
        var scrollTop =
          window.pageYOffset !== undefined
            ? window.pageYOffset
            : (document.documentElement || document.body.parentNode || document.body).scrollTop

        if (scrollTop > 0) {
          document.body.classList.add('scrolled')
          this.isWindowScrolled = true
        } else {
          document.body.classList.remove('scrolled')
          this.isWindowScrolled = false
        }
      },
    }
  }
}