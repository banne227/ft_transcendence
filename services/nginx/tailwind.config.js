/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./game/*.html",
    "./game/**/*.js",
    "./hub/*.html",
    "./hub/**/*.js",
    "./stats/*.html",
    "./stats/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        xp: {
          blue: '#0054e3',
          blueLight: '#3c9ef5',
          panel: '#d4d0c8',
          border: '#808080',
          borderLight: '#dfdfdf',
          statusDark: '#404040',

          btnFrom: '#5ba3f5',
          btnTo: '#2a7ae2',
          btnBorderLight: '#aad4ff',
          btnBorderDark: '#0030a0',

          closeFrom: '#f55',
          closeTo: '#c00',
          closeBorderLight: '#ff9999',
          closeBorderDark: '#800000',

          toolHover: '#c8d8f0',
          toolActive: '#b8c8e0',

          lbBorder: '#b0a890',
          lbRank: '#555555',

          grayBtnFrom: '#f0ede4',
        },
      },
    },
  },
  plugins: [],
};