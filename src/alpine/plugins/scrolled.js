export default function (Alpine) {
  Alpine.directive('scrolled', (
    el,
    { value, modifiers, expression },
    { Alpine, effect, cleanup, evaluate, evaluateLater }
  ) => {

    const defaultConfig = {
      className: 'scrolled'
    }

    const getConfig = expression ? evaluateLater(expression) : () => defaultConfig
    let eventTarget = window

    if (modifiers.includes('self')) {
      eventTarget = el
    }

    const getWindowScrollY = () => {
      return window.scrollY !== undefined
        ? window.scrollY
        : (document.documentElement || document.body.parentNode || document.body).scrollTop
    }

    const onScrollHandler = () => {
      computed.scrollY = modifiers.includes('self') ? el.scrollTop : getWindowScrollY()
    }

    const computed = Alpine.reactive(
      {
        scrollY: modifiers.includes('self') ? el.scrollTop : getWindowScrollY()
      }
    )

    eventTarget.addEventListener('scroll', onScrollHandler)

    cleanup(() => {
      eventTarget.removeEventListener('scroll', onScrollHandler)
    })

    effect(() => {
      let config = defaultConfig

      getConfig((newConfig) => {
        config = { ...defaultConfig, ...newConfig }
      })

      if (computed.scrollY > 0) {
        el.classList.add(config.className)
      } else {
        el.classList.remove(config.className)
      }
    })
  })
}
