export default {
  name: 'globals',
  store() {
    return {
      authorWebsite: 'https://jamesauble.com',
      mobileMenuEl: null,
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      init() {
        console.log('test3')
        this.mobileMenuEl = document.querySelector('#mobile-nav');
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