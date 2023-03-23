export default {
  name: 'global',
  store() {
    return {
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      isPredictiveSearchVisible: false,
      init() {
        console.log('Slayed Global Store Initialized.')
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
      }
    }
  }
}