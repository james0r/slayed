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
        subscribeToCartAjaxRequests((requestState, subscribeToResult) => {
          if (requestState.requestType === 'add') {

            subscribeToResult((requestState) => {
              if (requestState.responseData?.ok) {
                window.Alpine.store('global').isMinicartVisible = true
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
      },
    }
  },
}
