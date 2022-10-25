import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

export default {
  name: 'globals',
  store() {
    return {
      authorWebsite: 'https://jamesauble.com',
      mobileMenuEl: null,
      isMobileMenuVisible: false,
      isMinicartVisible: false,
      init() {
        this.mobileMenuEl = document.querySelector('#mobile-nav');

        window.Alpine.effect(() => {
          this.isMobileMenuVisible ? disableBodyScroll(this.mobileMenuEl) : enableBodyScroll(this.mobileMenuEl)
        })
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