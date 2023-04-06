export default {
  name: 'promoBar',
  component () {
    return {
      calcAndSetPromoBarHeight(isVisible) {
        if (isVisible) {
          const overridePromoBarHeightVar = () => {
            const promoBar = document.querySelector('#site-promo-bar')
      
            promoBar.style.height = 'auto'
            document.body.style.setProperty('--promo-bar-height', `${promoBar.offsetHeight}px`)
          }
    
          const overridePromoBarHeightVarDebounced = window.slayed?.helpers?.debounce(overridePromoBarHeightVar, 50)
    
          overridePromoBarHeightVar()
          window.addEventListener("resize", overridePromoBarHeightVarDebounced);
        }
      }
    }
  }
}