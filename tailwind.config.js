/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [ './src/**/*.{html,js}' ],
  theme: {
    fontFamily: {
      'sans': [ 'Montserrat', 'Arial', 'sans-serif' ]
    },
    extend: {
      colors: {
        'primary': '#2BD17E',
        'error': '#EB5757',
        'background': '#093545',
        'input': '#224957',
        'card-background': '#092C39'
      }
    },
    container: {
      center: true,
      screens: {
        '2xl': '1440px'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio')
  ]
};
