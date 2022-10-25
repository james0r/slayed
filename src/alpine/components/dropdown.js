export default {
  name: 'dropdown',
  component () {
    return {
      show: false,
      open() { this.show = true },
      close() { this.show = false },
      isOpen() { return this.show === true }
    }
  }
}