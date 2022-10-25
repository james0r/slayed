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
          const Alpine = window.Alpine

          subscribeToCartAjaxRequests((requestState, subscribeToResult) => {
            if (requestState.requestType === 'add') {
              document
                .querySelectorAll('[data-ajax-cart-messages="form"]')
                .forEach((element) => (element.innerHTML = ''))

              subscribeToResult((requestState) => {
                if (requestState.responseData?.ok) {
                  Alpine.store('globals').isMinicartVisible = true
                }
              })
            }
          })

          subscribeToCartStateUpdate((state) => {
            Alpine.store('liquidAjaxCart', {
              state: state,
            })
          })

          cartRequestGet()
        })
      },
    }
  },
}
