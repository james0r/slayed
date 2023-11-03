export default function (Alpine) {
  Alpine.directive('scrolled', (
    el,
    { value, modifiers, expression },
    { Alpine, effect, cleanup, evaluate, evaluateLater }
  ) => {

    const defaultConfig = {
      className: 'scrolled'
    }

    const getConfig = expression ? evaluateLater(expression) : (cb) => cb(defaultConfig)
    const eventTarget = modifiers.includes('self') ? el : window

    const onScrollHandler = () => {
      computed.scrollY = eventTarget.scrollY ?? eventTarget.scrollTop
    }

    const computed = Alpine.reactive(
      {
        scrollY: eventTarget.scrollY ?? eventTarget.scrollTop
      }
    )

    eventTarget.addEventListener('scroll', onScrollHandler, { passive: true })

    cleanup(() => {
      eventTarget.removeEventListener('scroll', onScrollHandler)
    })

    effect(() => {
      const action = computed.scrollY > 0 ? 'add' : 'remove'

      getConfig((newConfig) => {
        const config = { ...defaultConfig, ...newConfig }
        el.classList[action](config.className)
      })
    })
  })
}