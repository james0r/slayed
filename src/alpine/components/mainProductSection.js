export default {
  name: 'mainProductSection',
  component() {
    return {
      quantity: 0,
      selectedVariantPrice: 0,
      selectedVariant: null,
      selectedOption1: null,
      selectedOption2: null,
      selectedOption3: null,
      addToCartButtonText: 'Add to cart',
      showBuyNow: true,
      variants: [],
      init(variants, selectedVariantId) {
        // Return if not explicitly called by x-init directive
        if (!selectedVariantId) return

        // Make variants array and selected variant id reactive
        this.variants = variants
        this.selectedVariant = selectedVariantId

        // Find the selected variant object in our variants list
        const variantSelected = this.variants.find((variant) => {
          return variant.id == selectedVariantId
        })

        // Set button text, button visibility, and quantity input
        if (variantSelected.available) {
          this.quantity = 1
          this.addToCartButtonText = 'Add to cart'
          this.showBuyNow = true
        } else {
          this.quantity = 0
          this.addToCartButtonText = 'Out of stock'
          this.showBuyNow = false
        }

        // Set variant option values if they exist
        if (variantSelected.option1) {
          this.selectedOption1 = variantSelected.option1
        }
        if (variantSelected.option2) {
          this.selectedOption2 = variantSelected.option2
        }
        if (variantSelected.option3) {
          this.selectedOption3 = variantSelected.option3
        }

        // Set selected variant price
        this.selectedVariantPrice = variantSelected.price
      },
      get matchedVariantByCurrentOptions() {
        return this.variants.find((variant) => {
          return (
            variant.option1 == this.selectedOption1 &&
            variant.option2 == this.selectedOption2 &&
            variant.option3 == this.selectedOption3
          )
        })
      },
      availableVariantsFromFirstSelected() {
        if (this.selectedOption2) {
          return this.variants.filter(
            (variant) => this.selectedOption1 === variant.option1 && variant.available
          );
        }
      },
      availableVariantsFromSecondSelected() {
        if (this.selectedOption3) {
          return this.availableVariantsFromFirstSelected().filter(
            (variant) => this.selectedOption2 === variant.option2 && variant.available
          );
        }
      },
      inputIsSoldOutOrUnavailable(optionPosition, value) {
        if (optionPosition === 1) { return }
        if (optionPosition === 2) {
          return !this.availableVariantsFromFirstSelected().some((v) => (
            v[`option${optionPosition}`] === value
          ))
        }

        if (optionPosition === 3) {
          return !this.availableVariantsFromSecondSelected().some((v) => (
            v[`option${optionPosition}`] === value
          ))
        }
      },
      onOptionChangeHandler(el, option) {

        if (this.matchedVariantByCurrentOptions) {
          let variant = this.matchedVariantByCurrentOptions
          this.selectedVariant = variant.id
          this.selectedVariantPrice = variant.price

          // Set button text, button visibility, and quantity input
          if (variant.available) {
            this.quantity = 1
            this.addToCartButtonText = 'Add to cart'
            this.showBuyNow = true
          } else {
            this.quantity = 0
            this.addToCartButtonText = 'Out of stock'
            this.showBuyNow = false
          }

          this.replaceSection(el)
          window.history.replaceState(
            {},
            '',
            `${el.dataset.url}?variant=${this.selectedVariant}&lastSelectedOption=${option}`
          )
        } else {
          this.addToCartButtonText = 'Unavailable'
          this.showBuyNow = false
          this.quantity = 0
        }

      },
      replaceSection(el) {
        fetch(`${el.dataset.url}?variant=${this.selectedVariant}&section_id=${el.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const html = new DOMParser().parseFromString(responseText, 'text/html')
            const destination = document.querySelector('.pdp-main')
            const source = html.querySelector('.pdp-main')

            destination.innerHTML = source.innerHTML

            const params = new Proxy(new URLSearchParams(window.location.search), {
              get: (searchParams, prop) => searchParams.get(prop),
            })

            let optionId = params.lastSelectedOption

            document.getElementById(optionId).focus()
          })
      },
    }
  },
}
