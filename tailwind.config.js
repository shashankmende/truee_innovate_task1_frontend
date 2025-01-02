// /** @type {import('tailwindcss').Config} **/
// module.exports = {
//   content: [
//     "./src//*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {
//       colors: {
//         'custom-blue': '#217989',
//         'custom-bg': '#F5F9FA',
//         'toggle-bg': '#DEF5FB',
//       },
//     },
//     screens: {
//       'sm': {'min': '320px', 'max': '639px'},
//       'md': {'min': '640px', 'max': '1023px'},
//       'lg': {'min': '1024px', 'max': '1279px'},
//       'xl': {'min': '1280px', 'max': '1535px'},
//       '2xl': {'min': '1536px'},
//     },
//   },
//   plugins: [],

// }
// module.exports = {
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//     "./public/index.html",
//   ],
//   theme: {
//     extend: {
//       colors:{
//         'custom-blu':"#217989"
//       }
//     },
//   },
//   plugins: [],
// };


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#217989',
        'custom-bg': '#F5F9FA',
        'toggle-bg': '#DEF5FB',
        'custom-blu': '#217989',
      },
    },
  },
  plugins: [],
};

