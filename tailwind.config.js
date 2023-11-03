/**
 * Tailwind CSS configuration file
 *
 * docs: https://tailwindcss.com/docs/configuration
 * default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
const path = require('path')
let plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './layout/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './frontend/**/*.{js,jsx,ts,tsx}'
  ],
  safelist: [
    'skip-to-content-link'
  ],
  theme: {
    container: {
      center: true,
      // padding: {
      //   DEFAULT: '1rem',
      //   sm: '2rem',
      // },
      screens: {
        sm: `640px`,
        md: `768px`,
        lg: `1024px`,
        xl: `1280px`,
        '2xl': `calc(1536px + 4rem)`,
      },
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }
      md: '768px',
      // => @media (min-width: 768px) { ... }
      lg: '1024px',
      // => @media (min-width: 1024px) { ... }
      xl: '1280px',
      // => @media (min-width: 1280px) { ... }
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {
      fontFamily: {
        'open-sans': ['"Open Sans"', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'var(--color-neutral-400)',
            iframe: {
              width: '100%',
              height: '100%',
              aspectRatio: '16/9'
            },
            a: {
              color: 'var(--color-secondary-500)',
              '&:hover': {
                color: 'var(--color-secondary-200)',
              },
            },
          },
        },
      },
      colors: {
        'cloud-burst': {
          DEFAULT: '#252A59',
          50: '#7179C4',
          100: '#636CBE',
          200: '#4953AF',
          300: '#3D4593',
          400: '#313876',
          500: '#252A59',
          600: '#151731',
          700: '#04050A',
          800: '#000000',
          900: '#000000',
        },
        woodland: {
          DEFAULT: '#595425',
          50: '#C4BC71',
          100: '#BEB563',
          200: '#AFA649',
          300: '#938A3D',
          400: '#766F31',
          500: '#595425',
          600: '#312F15',
          700: '#0A0904',
          800: '#000000',
          900: '#000000',
          950: '#000000',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography')({
      className: 'rte'
    }),
    plugin(function ({ addVariant }) {
      addVariant('scrolled', '.scrolled &'),
        addVariant('mobile-menu-visible', '.mobile-menu-visible &')
    }),
  ],
}
