/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: {
    relative: true,
    files: [
      './src/pages/dashboard.tsx',
      './src/pages/*.{js,ts,jsx,tsx}',
      './src/pages/components/*.{js,ts,jsx,tsx}',
      './src/**/*.{js,jsx,ts,tsx}',
      './public/**/*.html',
      "./public/index.html"
    ]
  },
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
