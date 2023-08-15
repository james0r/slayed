/**
 * Registers an Alpine directive that adds a class to an element when it is scrolled.
 * @param {Object} Alpine - The Alpine instance.
 */
export default function (Alpine) {
  Alpine.directive('scrolled', (
    el,
    { value, modifiers, expression },
    { Alpine, effect, cleanup, evaluate, evaluateLater }
  ) => {

    /**
     * The default configuration for the directive.
     * @type {Object}
     * @property {string} className - The class name to add to the element when it is scrolled.
     */
    const defaultConfig = {
      className: 'scrolled'
    }

    /**
     * Gets the configuration for the directive.
     * @type {Function}
     * @returns {Object} - The configuration object.
     */
    const getConfig = expression ? evaluateLater(expression) : () => defaultConfig

    /**
     * The event target to listen for scroll events on.
     * @type {Object}
     */
    let eventTarget = window

    if (modifiers.includes('self')) {
      eventTarget = el
    }

    /**
     * Gets the current scroll position of the window.
     * @type {Function}
     * @returns {number} - The scroll position.
     */
    const getWindowScrollY = () => {
      return window.scrollY !== undefined
        ? window.scrollY
        : (document.documentElement || document.body.parentNode || document.body).scrollTop
    }

    /**
     * The scroll event handler.
     */
    const onScrollHandler = () => {
      computed.scrollY = modifiers.includes('self') ? el.scrollTop : getWindowScrollY()
    }

    /**
     * The reactive object that tracks the scroll position.
     * @type {Object}
     * @property {number} scrollY - The current scroll position.
     */
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
