export default {
  name: 'minicart',
  component () {
    return {
      minicartIsVisible: false,
      toggleMinicart() { 
        this.minicartIsVisible = !this.minicartIsVisible
      }, 
      showMinicart() {
        this.minicartIsVisible = true
      },
      hideMinicart() {
        this.minicartIsVisible = false
      }
    }
  }
}