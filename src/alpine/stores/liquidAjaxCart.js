import {
  subscribeToCartAjaxRequests,
  subscribeToCartStateUpdate,
  cartRequestGet,
} from 'liquid-ajax-cart'

export default {
  name: 'liquidAjaxCart',
  store() {
    return {
      init() {
        document.addEventListener('alpine:init', () => {

          subscribeToCartAjaxRequests((requestState, subscribeToResult) => {
            if (requestState.requestType === 'add') {
              document
                .querySelectorAll('[data-ajax-cart-messages="form"]')
                .forEach((element) => (element.innerHTML = ''))

              subscribeToResult((requestState) => {
                if (requestState.responseData?.ok) {
                  window.Alpine.store('globals').isMinicartVisible = true
                }
              })
            }
          })

          subscribeToCartStateUpdate((state) => {
            window.Alpine.store('liquidAjaxCart', {
              state: state,
            })
          })

          cartRequestGet()
        })
      },
    }
  },
}
