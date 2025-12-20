/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require('path')
let plugin = require('tailwindcss/plugin')

module.exports = {
  theme: {
    // screens: {
    //   sm: '640px',
    //   // => @media (min-width: 640px) { ... }
    //   md: '768px',
    //   // => @media (min-width: 768px) { ... }
    //   lg: '1024px',
    //   // => @media (min-width: 1024px) { ... }
    //   xl: '1280px',
    //   // => @media (min-width: 1280px) { ... }
    //   '2xl': '1536px',
    //   // => @media (min-width: 1536px) { ... }
    // },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--color-cloud-burst-400)',
            iframe: {
              width: '100%',
              height: '100%',
              aspectRatio: '16/9'
            },
            a: {
              color: 'var(--color-woodland-500)',
              '&:hover': {
                color: 'var(--color-woodland-200)',
              },
            },
          },
        },
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('scrolled', '.scrolled &'),
        addVariant('mobile-menu-visible', '.mobile-menu-visible &')
    }),
  ],
}
