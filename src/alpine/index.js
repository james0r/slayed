export default {
  register: (Alpine) => {
    // Alpine stores
    const alpineStores = import.meta.glob('./stores/*.js', { eager: true, import: 'default' })

    for (const path in alpineStores) {
      const store = alpineStores[path]

      const name = store.name

      Alpine.store(name, store.store())
    }

    // Alpine components
    const alpineComponents = import.meta.glob('./components/*.js', { eager: true, import: 'default' })

    for (const path in alpineComponents) {
      const component = alpineComponents[path]

      const name = component.name

      Alpine.data(name, component.component)
    }

    // Alpine directives
    // const alpineDirectives = import.meta.glob('./directives/*.js', { eager: true, import: 'default' })

    // for (const path in alpineDirectives) {
    //   const directive = alpineDirectives[path]

    //   Alpine.directive(directive.name, directive.callback)
    // }

    // Alpine magic
    // const alpineMagic = import.meta.glob('./magic/*.js', { eager: true, import: 'default' })

    // for (const path in alpineMagic) {
    //   const magic = alpineMagic[path]

    //   const name = magic.name

    //   Alpine.magic(name, magic.callback)
    // }
  },
}