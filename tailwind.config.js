/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        hero: 'url(../public/blue-water.jpg)',
        sailboat: 'url(../public/starboard-tack.jpg)',
      }
    },
  },
  plugins: [],
}

